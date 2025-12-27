import { defineComponent, ref, reactive, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { E as EnrollmentModal } from './EnrollmentModal-DJ0T9o-E.mjs';
import { u as useAuth, b as useRouter, c as useRuntimeConfig } from './server.mjs';
import './AddressSelect-2oQii9w-.mjs';
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
import '@socket.io/component-emitter';
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
    const config = useRuntimeConfig();
    const { accessToken } = useAuth();
    useRouter();
    const enrollments = ref([]);
    const availableCourses = ref([]);
    const availableBranches = ref([]);
    const loading = ref(true);
    const error = ref("");
    const showCreateModal = ref(false);
    const filters = reactive({
      search: "",
      status: "",
      course_id: "",
      branch_id: ""
    });
    const loadEnrollments = async () => {
      loading.value = true;
      error.value = "";
      try {
        const params = {};
        if (filters.search) params.search = filters.search;
        if (filters.status) params.status = filters.status;
        if (filters.course_id) params.course_id = filters.course_id;
        if (filters.branch_id) params.branch_id = filters.branch_id;
        const response = await $fetch(`${config.public.apiBase}/admin/enrollments`, {
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          },
          params
        });
        if (response.success) {
          enrollments.value = response.data;
        }
      } catch (err) {
        console.error("Error loading enrollments:", err);
        error.value = err.data?.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      } finally {
        loading.value = false;
      }
    };
    const closeModal = () => {
      showCreateModal.value = false;
    };
    const handleEnrollmentSaved = async () => {
      closeModal();
      await loadEnrollments();
    };
    const getStatusName = (status) => {
      const statusNames = {
        pending: "รอการยืนยัน",
        active: "กำลังเรียน",
        completed: "เรียนจบ",
        cancelled: "ยกเลิก"
      };
      return statusNames[status] || status;
    };
    const getStatusBadgeClass = (status) => {
      const classes = {
        pending: "bg-yellow-100 text-yellow-800",
        active: "bg-green-100 text-green-800",
        completed: "bg-blue-100 text-blue-800",
        cancelled: "bg-red-100 text-red-800"
      };
      return classes[status] || "bg-gray-100 text-gray-800";
    };
    const formatDate = (date) => {
      return format(new Date(date), "dd MMM yyyy", { locale: th });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="flex items-center justify-between mb-6"><h1 class="text-3xl font-bold">การลงทะเบียน</h1><button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg><span>ลงทะเบียนใหม่</span></button></div><div class="bg-white rounded-lg shadow p-4 mb-6"><div class="grid grid-cols-1 md:grid-cols-4 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2">ค้นหา</label><input${ssrRenderAttr("value", unref(filters).search)} type="text" placeholder="ค้นหาด้วยชื่อนักเรียน, ชื่อคอร์ส" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2">สถานะ</label><select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "") : ssrLooseEqual(unref(filters).status, "")) ? " selected" : ""}>ทั้งหมด</option><option value="pending"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "pending") : ssrLooseEqual(unref(filters).status, "pending")) ? " selected" : ""}>รอการยืนยัน</option><option value="active"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "active") : ssrLooseEqual(unref(filters).status, "active")) ? " selected" : ""}>กำลังเรียน</option><option value="completed"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "completed") : ssrLooseEqual(unref(filters).status, "completed")) ? " selected" : ""}>เรียนจบ</option><option value="cancelled"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "cancelled") : ssrLooseEqual(unref(filters).status, "cancelled")) ? " selected" : ""}>ยกเลิก</option></select></div><div><label class="block text-sm font-medium text-gray-700 mb-2">คอร์ส</label><select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filters).course_id) ? ssrLooseContain(unref(filters).course_id, "") : ssrLooseEqual(unref(filters).course_id, "")) ? " selected" : ""}>ทั้งหมด</option><!--[-->`);
      ssrRenderList(unref(availableCourses), (course) => {
        _push(`<option${ssrRenderAttr("value", course.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(filters).course_id) ? ssrLooseContain(unref(filters).course_id, course.id) : ssrLooseEqual(unref(filters).course_id, course.id)) ? " selected" : ""}>${ssrInterpolate(course.title)}</option>`);
      });
      _push(`<!--]--></select></div><div><label class="block text-sm font-medium text-gray-700 mb-2">สาขา</label><select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filters).branch_id) ? ssrLooseContain(unref(filters).branch_id, "") : ssrLooseEqual(unref(filters).branch_id, "")) ? " selected" : ""}>ทั้งหมด</option><!--[-->`);
      ssrRenderList(unref(availableBranches), (branch) => {
        _push(`<option${ssrRenderAttr("value", branch.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(filters).branch_id) ? ssrLooseContain(unref(filters).branch_id, branch.id) : ssrLooseEqual(unref(filters).branch_id, branch.id)) ? " selected" : ""}>${ssrInterpolate(branch.name)}</option>`);
      });
      _push(`<!--]--></select></div></div></div><div class="bg-white rounded-lg shadow overflow-hidden">`);
      if (unref(loading)) {
        _push(`<div class="p-8 text-center"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div><p class="mt-2 text-gray-600">กำลังโหลด...</p></div>`);
      } else if (unref(error)) {
        _push(`<div class="p-4 bg-red-50 border border-red-200 text-red-700 rounded">${ssrInterpolate(unref(error))}</div>`);
      } else if (unref(enrollments).length === 0) {
        _push(`<div class="p-8 text-center text-gray-500"> ไม่พบการลงทะเบียน </div>`);
      } else {
        _push(`<table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">นักเรียน</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">คอร์ส</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ประเภท</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สาขา/ที่อยู่</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่ลงทะเบียน</th><th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th></tr></thead><tbody class="bg-white divide-y divide-gray-200"><!--[-->`);
        ssrRenderList(unref(enrollments), (enrollment) => {
          _push(`<tr class="hover:bg-gray-50"><td class="px-6 py-4 cursor-pointer"><div><div class="text-sm font-medium text-green-600 hover:text-green-700 cursor-pointer">${ssrInterpolate(enrollment.student_first_name)} ${ssrInterpolate(enrollment.student_last_name)}</div><div class="text-xs text-gray-500">@${ssrInterpolate(enrollment.student_username)}</div>`);
          if (enrollment.student_email) {
            _push(`<div class="text-xs text-gray-400">${ssrInterpolate(enrollment.student_email)}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></td><td class="px-6 py-4"><div><div class="text-sm font-medium text-gray-900">${ssrInterpolate(enrollment.course_title)}</div>`);
          if (enrollment.course_code) {
            _push(`<div class="text-xs text-gray-500">รหัส: ${ssrInterpolate(enrollment.course_code)}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></td><td class="px-6 py-4 whitespace-nowrap"><span class="${ssrRenderClass([enrollment.enrollment_type === "online" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800", "px-2 py-1 text-xs font-medium rounded"])}">${ssrInterpolate(enrollment.enrollment_type === "online" ? "ออนไลน์" : "เรียนสด")}</span></td><td class="px-6 py-4 whitespace-nowrap">`);
          if (enrollment.enrollment_type === "onsite") {
            _push(`<div class="text-sm text-gray-900"><div>${ssrInterpolate(enrollment.branch_name || "-")}</div>`);
            if (enrollment.branch_code) {
              _push(`<div class="text-xs text-gray-500">${ssrInterpolate(enrollment.branch_code)}</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<div class="text-sm text-gray-500 italic"> เรียนออนไลน์ </div>`);
          }
          _push(`</td><td class="px-6 py-4 whitespace-nowrap"><span class="${ssrRenderClass([getStatusBadgeClass(enrollment.status), "px-2 py-1 text-xs font-medium rounded"])}">${ssrInterpolate(getStatusName(enrollment.status))}</span></td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${ssrInterpolate(formatDate(enrollment.enrollment_date || enrollment.created_at))}</td><td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><div class="flex items-center justify-end space-x-2"><button class="text-green-600 hover:text-green-900" title="แก้ไข"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>`);
          if (enrollment.status === "pending") {
            _push(`<button class="text-green-600 hover:text-green-900" title="ยืนยัน"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></button>`);
          } else if (enrollment.status === "active") {
            _push(`<button class="text-blue-600 hover:text-blue-900" title="ปิดการเรียน"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<button class="text-red-600 hover:text-red-900" title="ลบ"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></div></td></tr>`);
        });
        _push(`<!--]--></tbody></table>`);
      }
      _push(`</div>`);
      if (unref(showCreateModal)) {
        _push(ssrRenderComponent(EnrollmentModal, {
          show: unref(showCreateModal),
          enrollment: null,
          onClose: closeModal,
          onSaved: handleEnrollmentSaved
        }, null, _parent));
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/enrollments/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-D7Kkgqct.mjs.map
