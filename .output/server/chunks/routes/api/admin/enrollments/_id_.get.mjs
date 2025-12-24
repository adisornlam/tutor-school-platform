globalThis.__timing__.logStart('Load chunks/routes/api/admin/enrollments/_id_.get');import { d as defineEventHandler, b as getRouterParam, c as createError, q as query } from '../../../../nitro/nitro.mjs';
import { r as requireAuth } from '../../../../_/auth.middleware.mjs';
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
import 'engine.io';
import 'socket.io';
import 'jsonwebtoken';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const _id__get = defineEventHandler(async (event) => {
  await requireAuth(event);
  const enrollmentId = parseInt(getRouterParam(event, "id") || "0");
  if (!enrollmentId) {
    throw createError({
      statusCode: 400,
      message: "Invalid enrollment ID"
    });
  }
  try {
    const enrollments = await query(
      `SELECT 
        e.id,
        e.student_id,
        e.course_id,
        e.branch_id,
        e.enrollment_type,
        e.shipping_address_id,
        e.enrollment_date,
        e.status,
        e.payment_id,
        e.created_at,
        e.updated_at,
        s.username as student_username,
        s.first_name as student_first_name,
        s.last_name as student_last_name,
        s.email as student_email,
        s.phone as student_phone,
        c.title as course_title,
        c.code as course_code,
        c.description as course_description,
        c.type as course_type,
        c.price as course_price,
        c.duration_hours as course_duration_hours,
        c.level as course_level,
        c.status as course_status,
        b.name as branch_name,
        b.code as branch_code,
        b.address as branch_address,
        b.phone as branch_phone,
        b.email as branch_email,
        p.amount as payment_amount,
        p.status as payment_status,
        p.payment_method,
        p.transaction_id,
        p.invoice_number,
        p.paid_at
      FROM enrollments e
      INNER JOIN users s ON e.student_id = s.id
      INNER JOIN courses c ON e.course_id = c.id
      LEFT JOIN branches b ON e.branch_id = b.id
      LEFT JOIN payments p ON e.payment_id = p.id
      WHERE e.id = ?`,
      [enrollmentId]
    );
    if (enrollments.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Enrollment not found"
      });
    }
    const enrollment = enrollments[0];
    let learningRights = [];
    try {
      learningRights = await query(
        `SELECT 
          id,
          enrollment_id,
          access_type,
          expires_at,
          is_active,
          created_at
        FROM learning_rights
        WHERE enrollment_id = ?
        ORDER BY created_at DESC`,
        [enrollmentId]
      );
    } catch (lrError) {
      console.warn("learning_rights table may not exist yet:", lrError.message);
    }
    return {
      success: true,
      data: {
        enrollment: {
          id: enrollment.id,
          student_id: enrollment.student_id,
          course_id: enrollment.course_id,
          branch_id: enrollment.branch_id,
          enrollment_type: enrollment.enrollment_type || "onsite",
          shipping_address_id: enrollment.shipping_address_id,
          enrollment_date: enrollment.enrollment_date,
          status: enrollment.status,
          payment_id: enrollment.payment_id,
          created_at: enrollment.created_at,
          updated_at: enrollment.updated_at
        },
        student: {
          id: enrollment.student_id,
          username: enrollment.student_username,
          first_name: enrollment.student_first_name,
          last_name: enrollment.student_last_name,
          email: enrollment.student_email,
          phone: enrollment.student_phone
        },
        course: {
          id: enrollment.course_id,
          title: enrollment.course_title,
          code: enrollment.course_code,
          description: enrollment.course_description,
          type: enrollment.course_type,
          price: enrollment.course_price,
          duration_hours: enrollment.course_duration_hours,
          level: enrollment.course_level,
          status: enrollment.course_status
        },
        branch: enrollment.branch_id ? {
          id: enrollment.branch_id,
          name: enrollment.branch_name,
          code: enrollment.branch_code,
          address: enrollment.branch_address,
          phone: enrollment.branch_phone,
          email: enrollment.branch_email
        } : null,
        shipping_address: shippingAddress,
        payment: enrollment.payment_id ? {
          id: enrollment.payment_id,
          amount: enrollment.payment_amount,
          status: enrollment.payment_status,
          payment_method: enrollment.payment_method,
          transaction_id: enrollment.transaction_id,
          invoice_number: enrollment.invoice_number,
          paid_at: enrollment.paid_at
        } : null,
        learning_rights: learningRights
      }
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    console.error("Error fetching enrollment detail:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch enrollment detail"
    });
  }
});

export { _id__get as default };;globalThis.__timing__.logEnd('Load chunks/routes/api/admin/enrollments/_id_.get');
//# sourceMappingURL=_id_.get.mjs.map
