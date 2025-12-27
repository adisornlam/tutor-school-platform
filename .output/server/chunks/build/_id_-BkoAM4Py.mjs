import { defineComponent, ref, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderList } from 'vue/server-renderer';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { a as useRoute, u as useAuth } from './server.mjs';
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
import 'util';
import 'jwa';
import 'ms';
import 'semver';
import 'lodash.includes';
import 'lodash.isboolean';
import 'lodash.isinteger';
import 'lodash.isnumber';
import 'lodash.isplainobject';
import 'lodash.isstring';
import 'lodash.once';
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
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useAuth();
    parseInt(route.params.id);
    const loading = ref(true);
    const error = ref("");
    const studentDetail = ref(null);
    const getStatusDisplayName = (status) => {
      const statusNames = {
        active: "ใช้งาน",
        inactive: "ปิดใช้งาน",
        suspended: "ระงับ"
      };
      return statusNames[status] || status;
    };
    const getStatusBadgeClass = (status) => {
      const classes = {
        active: "bg-green-100 text-green-800",
        inactive: "bg-gray-100 text-gray-800",
        suspended: "bg-red-100 text-red-800"
      };
      return classes[status] || "bg-gray-100 text-gray-800";
    };
    const getRelationshipName = (relationship) => {
      const relationshipNames = {
        father: "บิดา",
        mother: "มารดา",
        guardian: "ผู้ปกครอง",
        other: "อื่นๆ"
      };
      return relationshipNames[relationship] || relationship;
    };
    const getEnrollmentStatusName = (status) => {
      const statusNames = {
        pending: "รอดำเนินการ",
        active: "กำลังเรียน",
        completed: "เรียนจบ",
        cancelled: "ยกเลิก"
      };
      return statusNames[status] || status;
    };
    const formatDate = (date) => {
      return format(new Date(date), "dd MMM yyyy HH:mm", { locale: th });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="flex items-center justify-between mb-6"><div class="flex items-center space-x-4"><button class="p-2 hover:bg-gray-100 rounded-lg"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg></button><h1 class="text-3xl font-bold">รายละเอียดนักเรียน</h1></div></div>`);
      if (unref(loading)) {
        _push(`<div class="text-center py-12"><div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div><p class="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p></div>`);
      } else if (unref(error)) {
        _push(`<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">${ssrInterpolate(unref(error))}</div>`);
      } else if (unref(studentDetail)) {
        _push(`<div class="space-y-6"><div class="bg-white rounded-lg shadow p-6"><div class="flex items-center justify-between mb-6"><h2 class="text-xl font-semibold">ข้อมูลนักเรียน</h2><span class="${ssrRenderClass([getStatusBadgeClass(unref(studentDetail).student.status), "px-3 py-1 text-sm font-medium rounded"])}">${ssrInterpolate(getStatusDisplayName(unref(studentDetail).student.status))}</span></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><div><label class="block text-sm font-medium text-gray-500 mb-1">ชื่อ-นามสกุล</label><p class="text-lg font-medium text-gray-900">${ssrInterpolate(unref(studentDetail).student.first_name)} ${ssrInterpolate(unref(studentDetail).student.last_name)}</p></div><div><label class="block text-sm font-medium text-gray-500 mb-1">Username</label><p class="text-gray-900">${ssrInterpolate(unref(studentDetail).student.username)}</p></div><div><label class="block text-sm font-medium text-gray-500 mb-1">Email</label><p class="text-gray-900">${ssrInterpolate(unref(studentDetail).student.email || "-")}</p></div><div><label class="block text-sm font-medium text-gray-500 mb-1">เบอร์โทรศัพท์</label><p class="text-gray-900">${ssrInterpolate(unref(studentDetail).student.phone || "-")}</p></div><div><label class="block text-sm font-medium text-gray-500 mb-1">วันที่สร้าง</label><p class="text-gray-900">${ssrInterpolate(formatDate(unref(studentDetail).student.created_at))}</p></div></div></div><div class="bg-white rounded-lg shadow p-6"><h2 class="text-xl font-semibold mb-4">ผู้ปกครอง</h2>`);
        if (unref(studentDetail).parents && unref(studentDetail).parents.length > 0) {
          _push(`<div class="space-y-4"><!--[-->`);
          ssrRenderList(unref(studentDetail).parents, (parent) => {
            _push(`<div class="border border-gray-200 rounded-lg p-4"><div class="flex items-center justify-between mb-3"><h3 class="text-lg font-medium text-gray-900">${ssrInterpolate(parent.first_name)} ${ssrInterpolate(parent.last_name)}</h3><span class="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">${ssrInterpolate(getRelationshipName(parent.relationship))}</span></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-500 mb-1">Email</label><p class="text-gray-900">${ssrInterpolate(parent.email || "-")}</p></div><div><label class="block text-sm font-medium text-gray-500 mb-1">เบอร์โทรศัพท์</label><p class="text-gray-900">${ssrInterpolate(parent.phone || "-")}</p></div></div></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<div class="text-center py-8 text-gray-500"><svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg><p class="mt-2">ไม่มีข้อมูลผู้ปกครอง</p></div>`);
        }
        _push(`</div><div class="bg-white rounded-lg shadow p-6"><h2 class="text-xl font-semibold mb-4">คอร์สที่ลงทะเบียน</h2>`);
        if (unref(studentDetail).enrollments && unref(studentDetail).enrollments.length > 0) {
          _push(`<div class="space-y-4"><!--[-->`);
          ssrRenderList(unref(studentDetail).enrollments, (enrollment) => {
            _push(`<div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"><div class="flex items-start justify-between"><div class="flex-1"><div class="flex items-center space-x-3 mb-2"><h3 class="text-lg font-medium text-gray-900">${ssrInterpolate(enrollment.course.title)}</h3><span class="${ssrRenderClass([enrollment.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800", "px-2 py-1 text-xs font-medium rounded"])}">${ssrInterpolate(getEnrollmentStatusName(enrollment.status))}</span></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"><div><span class="text-gray-500">รหัสคอร์ส:</span><span class="ml-2 text-gray-900">${ssrInterpolate(enrollment.course.code)}</span></div><div><span class="text-gray-500">สาขา:</span><span class="ml-2 text-gray-900">${ssrInterpolate(enrollment.branch.name)}</span></div><div><span class="text-gray-500">วันที่ลงทะเบียน:</span><span class="ml-2 text-gray-900">${ssrInterpolate(formatDate(enrollment.enrolled_at))}</span></div></div></div></div></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<div class="text-center py-8 text-gray-500"><svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg><p class="mt-2">ยังไม่ได้ลงทะเบียนคอร์สใดๆ</p></div>`);
        }
        _push(`</div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/tutor/students/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-BkoAM4Py.mjs.map
