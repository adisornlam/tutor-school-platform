import { defineComponent, ref, computed, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { u as useAuth } from './server.mjs';
import '../nitro/nitro.mjs';
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
import 'jsonwebtoken';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import '@heroicons/vue/24/outline';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { user } = useAuth();
    const dashboardData = ref(null);
    const loading = ref(true);
    const error = ref(null);
    const getRoleDisplayName = (role) => {
      const roleNames = {
        system_admin: "ผู้ดูแลระบบ",
        owner: "เจ้าของ",
        admin: "Admin กลาง",
        branch_admin: "ผู้ดูแลสาขา",
        tutor: "อาจารย์",
        student: "นักเรียน",
        parent: "ผู้ปกครอง"
      };
      return roleNames[role || ""] || role || "ผู้ใช้";
    };
    const primaryRole = computed(() => {
      return user.value?.roles?.[0] || "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 class="text-3xl font-bold mb-6">Dashboard</h1>`);
      if (unref(loading)) {
        _push(`<div class="flex items-center justify-center py-12"><div class="text-center"><div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div><p class="mt-4 text-gray-600">กำลังโหลดข้อมูล Dashboard...</p></div></div>`);
      } else if (unref(error)) {
        _push(`<div class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6"><div class="flex items-center"><svg class="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><div><h3 class="text-lg font-semibold text-red-800">เกิดข้อผิดพลาด</h3><p class="text-red-600">${ssrInterpolate(unref(error))}</p></div></div></div>`);
      } else if (unref(dashboardData)) {
        _push(`<!--[--><div class="bg-white rounded-lg shadow p-6 mb-6"><h2 class="text-xl font-semibold mb-2"> ยินดีต้อนรับ, ${ssrInterpolate(unref(user)?.first_name)} ${ssrInterpolate(unref(user)?.last_name)}! </h2><p class="text-gray-600"> คุณเข้าสู่ระบบในฐานะ: <span class="font-semibold text-green-600">${ssrInterpolate(getRoleDisplayName(unref(primaryRole)))}</span>`);
        if (unref(dashboardData).branchName) {
          _push(`<span class="ml-2 text-gray-500"> - ${ssrInterpolate(unref(dashboardData).branchName)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</p></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">`);
        if (unref(primaryRole) === "system_admin" || unref(primaryRole) === "owner" || unref(primaryRole) === "admin") {
          _push(`<!--[--><div class="bg-white rounded-lg shadow p-6"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-600">นักเรียนทั้งหมด</p><p class="text-2xl font-bold mt-2">${ssrInterpolate((unref(dashboardData).stats.totalStudents || 0).toLocaleString())}</p></div><div class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center"><svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg></div></div></div><div class="bg-white rounded-lg shadow p-6"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-600">คอร์สเรียน</p><p class="text-2xl font-bold mt-2">${ssrInterpolate((unref(dashboardData).stats.totalCourses || 0).toLocaleString())}</p></div><div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center"><svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg></div></div></div><div class="bg-white rounded-lg shadow p-6"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-600">รายได้เดือนนี้</p><p class="text-2xl font-bold mt-2">฿${ssrInterpolate((unref(dashboardData).stats.monthlyRevenue || 0).toLocaleString())}</p></div><div class="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center"><svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div></div></div><div class="bg-white rounded-lg shadow p-6"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-600">การลงทะเบียน</p><p class="text-2xl font-bold mt-2">${ssrInterpolate((unref(dashboardData).stats.totalEnrollments || 0).toLocaleString())}</p></div><div class="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center"><svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></div></div></div>`);
          if (unref(primaryRole) === "system_admin" || unref(primaryRole) === "owner") {
            _push(`<!--[-->`);
            if (unref(dashboardData).stats.activeBranches !== void 0) {
              _push(`<div class="bg-white rounded-lg shadow p-6"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-600">สาขาที่เปิดใช้งาน</p><p class="text-2xl font-bold mt-2">${ssrInterpolate((unref(dashboardData).stats.activeBranches || 0).toLocaleString())}</p></div><div class="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center"><svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg></div></div></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<!--]-->`);
          } else {
            _push(`<!---->`);
          }
          if (unref(primaryRole) === "admin" && unref(dashboardData).stats.pendingPayments !== void 0) {
            _push(`<div class="bg-white rounded-lg shadow p-6"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-600">การชำระเงินรออนุมัติ</p><p class="text-2xl font-bold mt-2">${ssrInterpolate((unref(dashboardData).stats.pendingPayments || 0).toLocaleString())}</p></div><div class="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center"><svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        } else if (unref(primaryRole) === "branch_admin") {
          _push(`<!--[--><div class="bg-white rounded-lg shadow p-6"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-600">นักเรียนในสาขา</p><p class="text-2xl font-bold mt-2">${ssrInterpolate((unref(dashboardData).stats.branchStudents || 0).toLocaleString())}</p></div><div class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center"><svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg></div></div></div><div class="bg-white rounded-lg shadow p-6"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-600">คอร์สในสาขา</p><p class="text-2xl font-bold mt-2">${ssrInterpolate((unref(dashboardData).stats.branchCourses || 0).toLocaleString())}</p></div><div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center"><svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg></div></div></div><div class="bg-white rounded-lg shadow p-6"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-600">รายได้สาขา (เดือนนี้)</p><p class="text-2xl font-bold mt-2">฿${ssrInterpolate((unref(dashboardData).stats.branchRevenue || 0).toLocaleString())}</p></div><div class="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center"><svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div></div></div><div class="bg-white rounded-lg shadow p-6"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-600">การลงทะเบียนสาขา</p><p class="text-2xl font-bold mt-2">${ssrInterpolate((unref(dashboardData).stats.branchEnrollments || 0).toLocaleString())}</p></div><div class="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center"><svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></div></div></div>`);
          if (unref(dashboardData).stats.pendingPayments !== void 0) {
            _push(`<div class="bg-white rounded-lg shadow p-6"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-600">การชำระเงินรออนุมัติ</p><p class="text-2xl font-bold mt-2">${ssrInterpolate((unref(dashboardData).stats.pendingPayments || 0).toLocaleString())}</p></div><div class="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center"><svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(dashboardData).stats.activeTutors !== void 0) {
            _push(`<div class="bg-white rounded-lg shadow p-6"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-600">อาจารย์ในสาขา</p><p class="text-2xl font-bold mt-2">${ssrInterpolate((unref(dashboardData).stats.activeTutors || 0).toLocaleString())}</p></div><div class="h-12 w-12 bg-teal-100 rounded-lg flex items-center justify-center"><svg class="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg></div></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        } else if (unref(primaryRole) === "tutor") {
          _push(`<!--[--><div class="bg-white rounded-lg shadow p-6"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-600">คอร์สที่สอน</p><p class="text-2xl font-bold mt-2">${ssrInterpolate((unref(dashboardData).stats.myCourses || 0).toLocaleString())}</p><p class="text-sm text-green-600 mt-1">คอร์สที่รับผิดชอบ</p></div><div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center"><svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg></div></div></div><div class="bg-white rounded-lg shadow p-6"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-600">นักเรียนที่สอน</p><p class="text-2xl font-bold mt-2">${ssrInterpolate((unref(dashboardData).stats.myStudents || 0).toLocaleString())}</p><p class="text-sm text-green-600 mt-1">นักเรียนในคอร์สที่สอน</p></div><div class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center"><svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg></div></div></div><div class="bg-white rounded-lg shadow p-6"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-600">ชั่วโมงการสอน</p><p class="text-2xl font-bold mt-2">${ssrInterpolate((unref(dashboardData).stats.teachingHours || 0).toLocaleString())}</p><p class="text-sm text-purple-600 mt-1">รวมทั้งหมด</p></div><div class="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center"><svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div></div></div><div class="bg-white rounded-lg shadow p-6"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-600">ชั่วโมงการสอนเดือนนี้</p><p class="text-2xl font-bold mt-2">${ssrInterpolate((unref(dashboardData).stats.teachingHoursThisMonth || 0).toLocaleString())}</p><p class="text-sm text-blue-600 mt-1">ชั่วโมงในเดือนนี้</p></div><div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center"><svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div></div></div><div class="bg-white rounded-lg shadow p-6"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-600">การบ้านที่ต้องตรวจ</p><p class="text-2xl font-bold mt-2">${ssrInterpolate((unref(dashboardData).stats.pendingAssignments || 0).toLocaleString())}</p><p class="text-sm text-orange-600 mt-1">รอการตรวจ</p></div><div class="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center"><svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></div></div></div><div class="bg-white rounded-lg shadow p-6"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-600">คลาสที่ต้องสอนวันนี้</p><p class="text-2xl font-bold mt-2">${ssrInterpolate((unref(dashboardData).stats.upcomingClassesToday || 0).toLocaleString())}</p><p class="text-sm text-indigo-600 mt-1">ตารางสอนวันนี้</p></div><div class="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center"><svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div></div></div><!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="grid grid-cols-1 lg:grid-cols-2 gap-6">`);
        if (unref(primaryRole) !== "tutor") {
          _push(`<div class="bg-white rounded-lg shadow p-6"><h2 class="text-xl font-semibold mb-4">รายได้</h2><div class="h-64 flex items-center justify-center text-gray-400"><p>กราฟรายได้ (จะเพิ่มในภายหลัง)</p></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="bg-white rounded-lg shadow p-6"><h2 class="text-xl font-semibold mb-4">การลงทะเบียนล่าสุด</h2>`);
        if (unref(dashboardData).recentEnrollments.length === 0) {
          _push(`<div class="text-center py-8 text-gray-500"><p>ยังไม่มีการลงทะเบียน</p></div>`);
        } else {
          _push(`<div class="space-y-4"><!--[-->`);
          ssrRenderList(unref(dashboardData).recentEnrollments, (enrollment) => {
            _push(`<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><div><p class="font-medium">${ssrInterpolate(enrollment.studentName)}</p><p class="text-sm text-gray-600">${ssrInterpolate(enrollment.courseName)}</p>`);
            if (enrollment.branchName) {
              _push(`<p class="text-xs text-gray-500 mt-1">${ssrInterpolate(enrollment.branchName)}</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div><div class="text-right"><p class="font-semibold text-green-600">฿${ssrInterpolate(enrollment.amount.toLocaleString())}</p><p class="text-xs text-gray-500">${ssrInterpolate(enrollment.date)}</p></div></div>`);
          });
          _push(`<!--]--></div>`);
        }
        _push(`</div></div><!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Cb9_knGu.mjs.map
