import { d as defineEventHandler, g as getUserRoles, c as createError, j as getHighestPriorityRole, q as query } from '../../../nitro/nitro.mjs';
import { r as requireAuth } from '../../../_/auth.middleware.mjs';
import 'node:http';
import 'node:https';
import 'node:crypto';
import 'stream';
import 'events';
import 'http';
import 'crypto';
import 'buffer';
import 'zlib';
import 'https';
import 'net';
import 'tls';
import 'url';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'fs';
import 'path';
import 'querystring';
import 'timers';
import 'cors';
import '@socket.io/component-emitter';
import 'jsonwebtoken';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const dashboard_get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u;
  try {
    const auth = await requireAuth(event);
    const userId = auth.userId;
    const roles = await getUserRoles(userId);
    if (!roles || roles.length === 0) {
      throw createError({
        statusCode: 403,
        message: "User has no roles"
      });
    }
    const primaryRole = getHighestPriorityRole(roles);
    if (!primaryRole) {
      throw createError({
        statusCode: 403,
        message: "Could not determine user role"
      });
    }
    let userBranchId = null;
    if (primaryRole === "branch_admin") {
      try {
        const branchAdmins = await query(
          "SELECT branch_id FROM branch_admins WHERE user_id = ? LIMIT 1",
          [userId]
        );
        if (branchAdmins && branchAdmins.length > 0 && branchAdmins[0].branch_id) {
          userBranchId = branchAdmins[0].branch_id;
        }
      } catch (error) {
      }
    }
    let tutorId = null;
    let tutorCourseIds = [];
    if (primaryRole === "tutor") {
      try {
        const tutors = await query(
          "SELECT id FROM tutors WHERE user_id = ? LIMIT 1",
          [userId]
        );
        if (tutors && tutors.length > 0) {
          tutorId = tutors[0].id;
          const tutorCourses = await query(
            "SELECT DISTINCT course_id FROM tutor_courses WHERE tutor_id = ?",
            [tutorId]
          );
          tutorCourseIds = tutorCourses.map((tc) => tc.course_id);
        }
      } catch (error) {
      }
    }
    const dashboardData = {
      stats: {},
      recentEnrollments: [],
      recentPayments: []
    };
    if (primaryRole === "system_admin" || primaryRole === "owner") {
      const [studentsResult] = await query(
        `SELECT COUNT(DISTINCT u.id) as total
         FROM users u
         INNER JOIN user_roles ur ON u.id = ur.user_id
         INNER JOIN roles r ON ur.role_id = r.id
         WHERE r.name IN ('student', 'parent')
         AND u.status = 'active'`
      );
      dashboardData.stats.totalStudents = ((_a = studentsResult == null ? void 0 : studentsResult[0]) == null ? void 0 : _a.total) || 0;
      const [coursesResult] = await query(
        `SELECT COUNT(*) as total FROM courses WHERE status = 'published'`
      );
      dashboardData.stats.totalCourses = ((_b = coursesResult == null ? void 0 : coursesResult[0]) == null ? void 0 : _b.total) || 0;
      const [enrollmentsResult] = await query(
        `SELECT COUNT(*) as total FROM enrollments WHERE status = 'active'`
      );
      dashboardData.stats.totalEnrollments = ((_c = enrollmentsResult == null ? void 0 : enrollmentsResult[0]) == null ? void 0 : _c.total) || 0;
      const currentMonth = (/* @__PURE__ */ new Date()).getMonth() + 1;
      const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
      const [revenueResult] = await query(
        `SELECT COALESCE(SUM(p.amount), 0) as total
         FROM payments p
         WHERE MONTH(p.created_at) = ? AND YEAR(p.created_at) = ?
         AND p.status = 'completed'`,
        [currentMonth, currentYear]
      );
      dashboardData.stats.monthlyRevenue = parseFloat(((_d = revenueResult == null ? void 0 : revenueResult[0]) == null ? void 0 : _d.total) || "0");
      const [usersByRoleResult] = await query(
        `SELECT r.name as role, COUNT(DISTINCT u.id) as count
         FROM users u
         INNER JOIN user_roles ur ON u.id = ur.user_id
         INNER JOIN roles r ON ur.role_id = r.id
         WHERE u.status = 'active'
         GROUP BY r.name`
      );
      dashboardData.stats.usersByRole = usersByRoleResult || [];
      const [branchesResult] = await query(
        `SELECT COUNT(*) as total FROM branches WHERE status = 'active'`
      );
      dashboardData.stats.activeBranches = ((_e = branchesResult == null ? void 0 : branchesResult[0]) == null ? void 0 : _e.total) || 0;
    } else if (primaryRole === "admin") {
      const [studentsResult] = await query(
        `SELECT COUNT(DISTINCT u.id) as total
         FROM users u
         INNER JOIN user_roles ur ON u.id = ur.user_id
         INNER JOIN roles r ON ur.role_id = r.id
         WHERE r.name IN ('student', 'parent')
         AND u.status = 'active'`
      );
      dashboardData.stats.totalStudents = ((_f = studentsResult == null ? void 0 : studentsResult[0]) == null ? void 0 : _f.total) || 0;
      const [coursesResult] = await query(
        `SELECT COUNT(*) as total FROM courses WHERE status = 'published'`
      );
      dashboardData.stats.totalCourses = ((_g = coursesResult == null ? void 0 : coursesResult[0]) == null ? void 0 : _g.total) || 0;
      const [enrollmentsResult] = await query(
        `SELECT COUNT(*) as total FROM enrollments WHERE status = 'active'`
      );
      dashboardData.stats.totalEnrollments = ((_h = enrollmentsResult == null ? void 0 : enrollmentsResult[0]) == null ? void 0 : _h.total) || 0;
      const currentMonth = (/* @__PURE__ */ new Date()).getMonth() + 1;
      const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
      const [revenueResult] = await query(
        `SELECT COALESCE(SUM(p.amount), 0) as total
         FROM payments p
         WHERE MONTH(p.created_at) = ? AND YEAR(p.created_at) = ?
         AND p.status = 'completed'`,
        [currentMonth, currentYear]
      );
      dashboardData.stats.monthlyRevenue = parseFloat(((_i = revenueResult == null ? void 0 : revenueResult[0]) == null ? void 0 : _i.total) || "0");
      const [pendingPaymentsResult] = await query(
        `SELECT COUNT(*) as total FROM payments WHERE status = 'pending'`
      );
      dashboardData.stats.pendingPayments = ((_j = pendingPaymentsResult == null ? void 0 : pendingPaymentsResult[0]) == null ? void 0 : _j.total) || 0;
    } else if (primaryRole === "tutor") {
      if (tutorId && tutorCourseIds.length > 0) {
        dashboardData.stats.myCourses = tutorCourseIds.length;
        const [studentsResult] = await query(
          `SELECT COUNT(DISTINCT e.student_id) as total
           FROM enrollments e
           WHERE e.course_id IN (${tutorCourseIds.map(() => "?").join(",")})
           AND e.status = 'active'`,
          tutorCourseIds
        );
        dashboardData.stats.myStudents = ((_k = studentsResult == null ? void 0 : studentsResult[0]) == null ? void 0 : _k.total) || 0;
        const [teachingHoursResult] = await query(
          `SELECT COALESCE(SUM(TIMESTAMPDIFF(HOUR, start_datetime, end_datetime)), 0) as total
           FROM course_schedules
           WHERE tutor_id = ? AND status IN ('completed', 'ongoing')`,
          [tutorId]
        );
        dashboardData.stats.teachingHours = ((_l = teachingHoursResult == null ? void 0 : teachingHoursResult[0]) == null ? void 0 : _l.total) || 0;
        const currentMonth = (/* @__PURE__ */ new Date()).getMonth() + 1;
        const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
        const [teachingHoursMonthResult] = await query(
          `SELECT COALESCE(SUM(TIMESTAMPDIFF(HOUR, start_datetime, end_datetime)), 0) as total
           FROM course_schedules
           WHERE tutor_id = ? 
           AND MONTH(start_datetime) = ? 
           AND YEAR(start_datetime) = ?
           AND status IN ('completed', 'ongoing')`,
          [tutorId, currentMonth, currentYear]
        );
        dashboardData.stats.teachingHoursThisMonth = ((_m = teachingHoursMonthResult == null ? void 0 : teachingHoursMonthResult[0]) == null ? void 0 : _m.total) || 0;
        dashboardData.stats.pendingAssignments = 0;
        const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        const [upcomingClassesResult] = await query(
          `SELECT COUNT(*) as total
           FROM course_schedules
           WHERE tutor_id = ? 
           AND DATE(start_datetime) = ?
           AND status = 'scheduled'`,
          [tutorId, today]
        );
        dashboardData.stats.upcomingClassesToday = ((_n = upcomingClassesResult == null ? void 0 : upcomingClassesResult[0]) == null ? void 0 : _n.total) || 0;
      } else {
        dashboardData.stats.myCourses = 0;
        dashboardData.stats.myStudents = 0;
        dashboardData.stats.teachingHours = 0;
        dashboardData.stats.teachingHoursThisMonth = 0;
        dashboardData.stats.pendingAssignments = 0;
        dashboardData.stats.upcomingClassesToday = 0;
      }
    } else if (primaryRole === "branch_admin") {
      if (!userBranchId) {
        throw createError({
          statusCode: 400,
          message: "Branch admin must be assigned to a branch"
        });
      }
      const [studentsResult] = await query(
        `SELECT COUNT(DISTINCT e.student_id) as total
         FROM enrollments e
         INNER JOIN course_branches cb ON e.course_id = cb.course_id AND e.branch_id = cb.branch_id
         WHERE e.branch_id = ? AND e.status = 'active'`,
        [userBranchId]
      );
      dashboardData.stats.branchStudents = ((_o = studentsResult == null ? void 0 : studentsResult[0]) == null ? void 0 : _o.total) || 0;
      const [coursesResult] = await query(
        `SELECT COUNT(DISTINCT c.id) as total
         FROM courses c
         INNER JOIN course_branches cb ON c.id = cb.course_id
         WHERE cb.branch_id = ? AND c.status = 'published'`,
        [userBranchId]
      );
      dashboardData.stats.branchCourses = ((_p = coursesResult == null ? void 0 : coursesResult[0]) == null ? void 0 : _p.total) || 0;
      const [enrollmentsResult] = await query(
        `SELECT COUNT(*) as total 
         FROM enrollments 
         WHERE branch_id = ? AND status = 'active'`,
        [userBranchId]
      );
      dashboardData.stats.branchEnrollments = ((_q = enrollmentsResult == null ? void 0 : enrollmentsResult[0]) == null ? void 0 : _q.total) || 0;
      const currentMonth = (/* @__PURE__ */ new Date()).getMonth() + 1;
      const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
      const [revenueResult] = await query(
        `SELECT COALESCE(SUM(p.amount), 0) as total
         FROM payments p
         INNER JOIN enrollments e ON p.enrollment_id = e.id
         WHERE e.branch_id = ?
         AND MONTH(p.created_at) = ? AND YEAR(p.created_at) = ?
         AND p.status = 'completed'`,
        [userBranchId, currentMonth, currentYear]
      );
      dashboardData.stats.branchRevenue = parseFloat(((_r = revenueResult == null ? void 0 : revenueResult[0]) == null ? void 0 : _r.total) || "0");
      const [pendingPaymentsResult] = await query(
        `SELECT COUNT(*) as total
         FROM payments p
         INNER JOIN enrollments e ON p.enrollment_id = e.id
         WHERE e.branch_id = ? AND p.status = 'pending'`,
        [userBranchId]
      );
      dashboardData.stats.pendingPayments = ((_s = pendingPaymentsResult == null ? void 0 : pendingPaymentsResult[0]) == null ? void 0 : _s.total) || 0;
      try {
        const [tutorsResult] = await query(
          `SELECT COUNT(DISTINCT t.id) as total
           FROM tutors t
           INNER JOIN users u ON t.user_id = u.id
           INNER JOIN tutor_branches tb ON t.id = tb.tutor_id
           WHERE tb.branch_id = ? AND t.status = 'active' AND u.status = 'active'`,
          [userBranchId]
        );
        dashboardData.stats.activeTutors = ((_t = tutorsResult == null ? void 0 : tutorsResult[0]) == null ? void 0 : _t.total) || 0;
      } catch (error) {
        dashboardData.stats.activeTutors = 0;
      }
      const [branchResult] = await query(
        "SELECT name FROM branches WHERE id = ?",
        [userBranchId]
      );
      dashboardData.branchName = ((_u = branchResult == null ? void 0 : branchResult[0]) == null ? void 0 : _u.name) || "Unknown";
    }
    let enrollmentsQuery = `
      SELECT 
        e.id,
        e.enrollment_date,
        e.status,
        u.first_name,
        u.last_name,
        u.username,
        c.title as course_title,
        c.price as course_price,
        b.name as branch_name
      FROM enrollments e
      INNER JOIN users u ON e.student_id = u.id
      INNER JOIN courses c ON e.course_id = c.id
      LEFT JOIN branches b ON e.branch_id = b.id
      WHERE 1=1
    `;
    const enrollmentsParams = [];
    if (primaryRole === "tutor" && tutorCourseIds.length > 0) {
      enrollmentsQuery += ` AND e.course_id IN (${tutorCourseIds.map(() => "?").join(",")})`;
      enrollmentsParams.push(...tutorCourseIds);
    } else if (primaryRole === "branch_admin" && userBranchId) {
      enrollmentsQuery += " AND e.branch_id = ?";
      enrollmentsParams.push(userBranchId);
    }
    enrollmentsQuery += " ORDER BY e.created_at DESC LIMIT 5";
    const recentEnrollments = await query(
      enrollmentsQuery,
      enrollmentsParams
    );
    dashboardData.recentEnrollments = (Array.isArray(recentEnrollments) ? recentEnrollments : []).map((row) => ({
      id: row.id,
      studentName: `${row.first_name} ${row.last_name}`,
      courseName: row.course_title,
      amount: parseFloat(row.course_price || "0"),
      date: new Date(row.enrollment_date).toLocaleDateString("th-TH"),
      branchName: row.branch_name,
      status: row.status
    }));
    let paymentsQuery = `
      SELECT 
        p.id,
        p.amount,
        p.status,
        p.created_at,
        u.first_name,
        u.last_name,
        c.title as course_title,
        b.name as branch_name
      FROM payments p
      INNER JOIN enrollments e ON p.enrollment_id = e.id
      INNER JOIN users u ON e.student_id = u.id
      INNER JOIN courses c ON e.course_id = c.id
      LEFT JOIN branches b ON e.branch_id = b.id
      WHERE 1=1
    `;
    const paymentsParams = [];
    if (primaryRole === "branch_admin" && userBranchId) {
      paymentsQuery += " AND e.branch_id = ?";
      paymentsParams.push(userBranchId);
    }
    if (primaryRole !== "tutor") {
      paymentsQuery += " ORDER BY p.created_at DESC LIMIT 5";
      const recentPayments = await query(
        paymentsQuery,
        paymentsParams
      );
      dashboardData.recentPayments = (Array.isArray(recentPayments) ? recentPayments : []).map((row) => ({
        id: row.id,
        studentName: `${row.first_name} ${row.last_name}`,
        courseName: row.course_title,
        amount: parseFloat(row.amount || "0"),
        date: new Date(row.created_at).toLocaleDateString("th-TH"),
        branchName: row.branch_name,
        status: row.status
      }));
    } else {
      dashboardData.recentPayments = [];
    }
    return {
      success: true,
      data: dashboardData,
      role: primaryRole
    };
  } catch (error) {
    console.error("[Dashboard API] Error:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      message: error.message || "Failed to fetch dashboard data"
    });
  }
});

export { dashboard_get as default };
//# sourceMappingURL=dashboard.get.mjs.map
