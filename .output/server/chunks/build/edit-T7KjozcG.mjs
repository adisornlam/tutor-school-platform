import { defineComponent, computed, ref, reactive, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrRenderComponent, ssrRenderStyle } from 'vue/server-renderer';
import { A as AddressSelect } from './AddressSelect-2oQii9w-.mjs';
import { a as useRoute, b as useRouter, u as useAuth } from './server.mjs';
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
import 'ecdsa-sig-formatter';
import 'buffer-equal-constant-time';
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
  __name: "edit",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    useAuth();
    computed(() => parseInt(route.params.id));
    const loading = ref(true);
    const error = ref("");
    const submitting = ref(false);
    const submitError = ref("");
    const form = reactive({
      student_id: 0,
      course_id: 0,
      branch_id: 0,
      enrollment_type: "onsite",
      shipping_address_id: null,
      enrollment_date: "",
      status: "pending"
    });
    const availableStudents = ref([]);
    const availableCourses = ref([]);
    const availableBranches = ref([]);
    const loadingStudents = ref(false);
    const loadingCourses = ref(false);
    const loadingBranches = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="flex items-center justify-between mb-6"><div class="flex items-center space-x-4"><button class="p-2 hover:bg-gray-100 rounded-lg"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg></button><h1 class="text-3xl font-bold">แก้ไขการลงทะเบียน</h1></div></div>`);
      if (unref(loading)) {
        _push(`<div class="text-center py-12"><div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div><p class="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p></div>`);
      } else {
        _push(`<!--[-->`);
        if (unref(error)) {
          _push(`<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">${ssrInterpolate(unref(error))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<form class="bg-white rounded-lg shadow p-6 space-y-6"><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label class="block text-sm font-medium text-gray-700 mb-2"> นักเรียน <span class="text-red-500">*</span></label><select required${ssrIncludeBooleanAttr(unref(loadingStudents)) ? " disabled" : ""} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).student_id) ? ssrLooseContain(unref(form).student_id, "") : ssrLooseEqual(unref(form).student_id, "")) ? " selected" : ""}>${ssrInterpolate(unref(loadingStudents) ? "กำลังโหลด..." : "เลือกนักเรียน")}</option><!--[-->`);
        ssrRenderList(unref(availableStudents), (student) => {
          _push(`<option${ssrRenderAttr("value", student.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).student_id) ? ssrLooseContain(unref(form).student_id, student.id) : ssrLooseEqual(unref(form).student_id, student.id)) ? " selected" : ""}>${ssrInterpolate(student.first_name)} ${ssrInterpolate(student.last_name)} (@${ssrInterpolate(student.username)}) </option>`);
        });
        _push(`<!--]--></select></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> คอร์ส <span class="text-red-500">*</span></label><select required${ssrIncludeBooleanAttr(unref(loadingCourses)) ? " disabled" : ""} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).course_id) ? ssrLooseContain(unref(form).course_id, "") : ssrLooseEqual(unref(form).course_id, "")) ? " selected" : ""}>${ssrInterpolate(unref(loadingCourses) ? "กำลังโหลด..." : "เลือกคอร์ส")}</option><!--[-->`);
        ssrRenderList(unref(availableCourses), (course) => {
          _push(`<option${ssrRenderAttr("value", course.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).course_id) ? ssrLooseContain(unref(form).course_id, course.id) : ssrLooseEqual(unref(form).course_id, course.id)) ? " selected" : ""}>${ssrInterpolate(course.title)}</option>`);
        });
        _push(`<!--]--></select></div><div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-2"> ประเภทการเรียน <span class="text-red-500">*</span></label><div class="flex gap-6"><label class="flex items-center cursor-pointer"><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).enrollment_type, "onsite")) ? " checked" : ""} type="radio" value="onsite" class="mr-2 w-4 h-4 text-green-600 focus:ring-green-500"><span class="text-gray-700">เรียนสด (Onsite)</span></label><label class="flex items-center cursor-pointer"><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).enrollment_type, "online")) ? " checked" : ""} type="radio" value="online" class="mr-2 w-4 h-4 text-green-600 focus:ring-green-500"><span class="text-gray-700">เรียนออนไลน์ (Online)</span></label></div></div>`);
        if (unref(form).enrollment_type === "onsite") {
          _push(`<div><label class="block text-sm font-medium text-gray-700 mb-2"> สาขา <span class="text-red-500">*</span></label><select${ssrIncludeBooleanAttr(unref(form).enrollment_type === "onsite") ? " required" : ""}${ssrIncludeBooleanAttr(!unref(form).course_id || unref(loadingBranches)) ? " disabled" : ""} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed bg-white text-gray-900"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).branch_id) ? ssrLooseContain(unref(form).branch_id, "") : ssrLooseEqual(unref(form).branch_id, "")) ? " selected" : ""}>${ssrInterpolate(unref(loadingBranches) ? "กำลังโหลด..." : "เลือกสาขา")}</option><!--[-->`);
          ssrRenderList(unref(availableBranches), (branch) => {
            _push(`<option${ssrRenderAttr("value", branch.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).branch_id) ? ssrLooseContain(unref(form).branch_id, branch.id) : ssrLooseEqual(unref(form).branch_id, branch.id)) ? " selected" : ""}>${ssrInterpolate(branch.name)}</option>`);
          });
          _push(`<!--]--></select></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(form).enrollment_type === "online" && unref(form).student_id) {
          _push(`<div>`);
          _push(ssrRenderComponent(AddressSelect, {
            modelValue: unref(form).shipping_address_id,
            "onUpdate:modelValue": ($event) => unref(form).shipping_address_id = $event,
            "user-id": unref(form).student_id,
            required: unref(form).enrollment_type === "online",
            placeholder: "เลือกที่อยู่จัดส่ง",
            hint: "สำหรับส่งเอกสารประกอบการเรียน"
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div><label class="block text-sm font-medium text-gray-700 mb-2"> สถานะ <span class="text-red-500">*</span></label><select required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value="pending"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "pending") : ssrLooseEqual(unref(form).status, "pending")) ? " selected" : ""}>รอการยืนยัน</option><option value="active"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "active") : ssrLooseEqual(unref(form).status, "active")) ? " selected" : ""}>กำลังเรียน</option><option value="completed"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "completed") : ssrLooseEqual(unref(form).status, "completed")) ? " selected" : ""}>เรียนจบ</option><option value="cancelled"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "cancelled") : ssrLooseEqual(unref(form).status, "cancelled")) ? " selected" : ""}>ยกเลิก</option></select></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> วันที่ลงทะเบียน </label><input${ssrRenderAttr("value", unref(form).enrollment_date)} type="datetime-local" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900" style="${ssrRenderStyle({ "color-scheme": "light" })}"></div></div>`);
        if (unref(submitError)) {
          _push(`<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">${ssrInterpolate(unref(submitError))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex justify-end space-x-3 pt-4 border-t"><button type="button" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"> ยกเลิก </button><button type="submit"${ssrIncludeBooleanAttr(unref(submitting)) ? " disabled" : ""} class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">`);
        if (unref(submitting)) {
          _push(`<span>กำลังบันทึก...</span>`);
        } else {
          _push(`<span>บันทึก</span>`);
        }
        _push(`</button></div></form><!--]-->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/enrollments/[id]/edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=edit-T7KjozcG.mjs.map
