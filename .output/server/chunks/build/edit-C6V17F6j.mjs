import { defineComponent, ref, reactive, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList } from 'vue/server-renderer';
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
    parseInt(route.params.id);
    const loading = ref(true);
    const error = ref("");
    const student = ref(null);
    const parents = ref([]);
    const submitting = ref(false);
    const submitError = ref("");
    const showAddParentModal = ref(false);
    const parentSearch = ref("");
    const parentSearchResults = ref([]);
    const selectedParentToAdd = ref(null);
    const parentRelationship = ref("guardian");
    const addingParent = ref(false);
    const addParentError = ref("");
    const parentToEdit = ref(null);
    const editingParent = ref(false);
    const editParentError = ref("");
    const editParentForm = reactive({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      relationship: "guardian"
    });
    const form = reactive({
      username: "",
      email: "",
      first_name: "",
      last_name: "",
      phone: "",
      status: "active"
    });
    const getRelationshipName = (relationship) => {
      const relationshipNames = {
        father: "บิดา",
        mother: "มารดา",
        guardian: "ผู้ปกครอง",
        other: "อื่นๆ"
      };
      return relationshipNames[relationship] || relationship;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="flex items-center justify-between mb-6"><div class="flex items-center space-x-4"><button class="p-2 hover:bg-gray-100 rounded-lg"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg></button><h1 class="text-3xl font-bold">แก้ไขผู้เรียน</h1></div></div>`);
      if (unref(loading)) {
        _push(`<div class="text-center py-12"><div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div><p class="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p></div>`);
      } else if (unref(error)) {
        _push(`<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">${ssrInterpolate(unref(error))}</div>`);
      } else if (unref(student)) {
        _push(`<div class="space-y-6"><div class="bg-white rounded-lg shadow p-6"><h2 class="text-xl font-semibold mb-6">ข้อมูลผู้เรียน</h2><form class="space-y-4"><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label class="block text-sm font-medium text-gray-700 mb-2"> Username <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).username)} type="text" required disabled class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-100 cursor-not-allowed"><p class="mt-1 text-xs text-gray-500">ไม่สามารถแก้ไข Username ได้</p></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Email </label><input${ssrRenderAttr("value", unref(form).email)} type="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> ชื่อ <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).first_name)} type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> นามสกุล <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).last_name)} type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> เบอร์โทรศัพท์ </label><input${ssrRenderAttr("value", unref(form).phone)} type="tel" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> สถานะ <span class="text-red-500">*</span></label><select required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value="active"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "active") : ssrLooseEqual(unref(form).status, "active")) ? " selected" : ""}>ใช้งาน</option><option value="inactive"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "inactive") : ssrLooseEqual(unref(form).status, "inactive")) ? " selected" : ""}>ปิดใช้งาน</option><option value="suspended"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "suspended") : ssrLooseEqual(unref(form).status, "suspended")) ? " selected" : ""}>ระงับ</option></select></div></div>`);
        if (unref(submitError)) {
          _push(`<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">${ssrInterpolate(unref(submitError))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex justify-end space-x-3 pt-4"><button type="button" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"> ยกเลิก </button><button type="submit"${ssrIncludeBooleanAttr(unref(submitting)) ? " disabled" : ""} class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">`);
        if (unref(submitting)) {
          _push(`<span>กำลังบันทึก...</span>`);
        } else {
          _push(`<span>บันทึก</span>`);
        }
        _push(`</button></div></form></div><div class="bg-white rounded-lg shadow p-6"><div class="flex items-center justify-between mb-6"><h2 class="text-xl font-semibold">ผู้ปกครอง</h2><button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg><span>เพิ่มผู้ปกครอง</span></button></div>`);
        if (unref(parents) && unref(parents).length > 0) {
          _push(`<div class="space-y-4"><!--[-->`);
          ssrRenderList(unref(parents), (parent) => {
            _push(`<div class="border border-gray-200 rounded-lg p-4"><div class="flex items-center justify-between"><div class="flex-1"><div class="flex items-center space-x-3 mb-2"><h3 class="text-lg font-medium text-gray-900">${ssrInterpolate(parent.first_name)} ${ssrInterpolate(parent.last_name)}</h3><span class="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">${ssrInterpolate(getRelationshipName(parent.relationship))}</span></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"><div><span class="text-gray-500">Email:</span><span class="ml-2 text-gray-900">${ssrInterpolate(parent.email || "-")}</span></div><div><span class="text-gray-500">เบอร์โทรศัพท์:</span><span class="ml-2 text-gray-900">${ssrInterpolate(parent.phone || "-")}</span></div></div></div><div class="flex items-center space-x-2"><button class="px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="แก้ไขผู้ปกครอง"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button></div></div></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<div class="text-center py-8 text-gray-500"><svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg><p class="mt-2">ไม่มีข้อมูลผู้ปกครอง</p></div>`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(showAddParentModal)) {
        _push(`<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div class="bg-white rounded-lg p-6 max-w-md w-full mx-4"><h3 class="text-lg font-semibold mb-4">เพิ่มผู้ปกครอง</h3><form class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-2"> ค้นหาผู้ปกครอง (Username หรือ Email) </label><input${ssrRenderAttr("value", unref(parentSearch))} type="text" placeholder="กรอก username หรือ email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">`);
        if (unref(parentSearchResults).length > 0) {
          _push(`<div class="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg"><!--[-->`);
          ssrRenderList(unref(parentSearchResults), (user) => {
            _push(`<button type="button" class="w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"><div class="font-medium">${ssrInterpolate(user.first_name)} ${ssrInterpolate(user.last_name)}</div><div class="text-sm text-gray-500">${ssrInterpolate(user.username)} - ${ssrInterpolate(user.email || "-")}</div></button>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(selectedParentToAdd)) {
          _push(`<div><label class="block text-sm font-medium text-gray-700 mb-2"> ความสัมพันธ์ <span class="text-red-500">*</span></label><select required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value="father"${ssrIncludeBooleanAttr(Array.isArray(unref(parentRelationship)) ? ssrLooseContain(unref(parentRelationship), "father") : ssrLooseEqual(unref(parentRelationship), "father")) ? " selected" : ""}>บิดา</option><option value="mother"${ssrIncludeBooleanAttr(Array.isArray(unref(parentRelationship)) ? ssrLooseContain(unref(parentRelationship), "mother") : ssrLooseEqual(unref(parentRelationship), "mother")) ? " selected" : ""}>มารดา</option><option value="guardian"${ssrIncludeBooleanAttr(Array.isArray(unref(parentRelationship)) ? ssrLooseContain(unref(parentRelationship), "guardian") : ssrLooseEqual(unref(parentRelationship), "guardian")) ? " selected" : ""}>ผู้ปกครอง</option><option value="other"${ssrIncludeBooleanAttr(Array.isArray(unref(parentRelationship)) ? ssrLooseContain(unref(parentRelationship), "other") : ssrLooseEqual(unref(parentRelationship), "other")) ? " selected" : ""}>อื่นๆ</option></select></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(addParentError)) {
          _push(`<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">${ssrInterpolate(unref(addParentError))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex justify-end space-x-3 pt-4"><button type="button" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"> ยกเลิก </button><button type="submit"${ssrIncludeBooleanAttr(!unref(selectedParentToAdd) || unref(addingParent)) ? " disabled" : ""} class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">`);
        if (unref(addingParent)) {
          _push(`<span>กำลังเพิ่ม...</span>`);
        } else {
          _push(`<span>เพิ่ม</span>`);
        }
        _push(`</button></div></form></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(parentToEdit)) {
        _push(`<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div class="bg-white rounded-lg p-6 max-w-md w-full mx-4"><h3 class="text-lg font-semibold mb-4">แก้ไขผู้ปกครอง</h3><form class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-2"> ชื่อ <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(editParentForm).first_name)} type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> นามสกุล <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(editParentForm).last_name)} type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Email </label><input${ssrRenderAttr("value", unref(editParentForm).email)} type="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> เบอร์โทรศัพท์ </label><input${ssrRenderAttr("value", unref(editParentForm).phone)} type="tel" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> ความสัมพันธ์ <span class="text-red-500">*</span></label><select required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value="father"${ssrIncludeBooleanAttr(Array.isArray(unref(editParentForm).relationship) ? ssrLooseContain(unref(editParentForm).relationship, "father") : ssrLooseEqual(unref(editParentForm).relationship, "father")) ? " selected" : ""}>บิดา</option><option value="mother"${ssrIncludeBooleanAttr(Array.isArray(unref(editParentForm).relationship) ? ssrLooseContain(unref(editParentForm).relationship, "mother") : ssrLooseEqual(unref(editParentForm).relationship, "mother")) ? " selected" : ""}>มารดา</option><option value="guardian"${ssrIncludeBooleanAttr(Array.isArray(unref(editParentForm).relationship) ? ssrLooseContain(unref(editParentForm).relationship, "guardian") : ssrLooseEqual(unref(editParentForm).relationship, "guardian")) ? " selected" : ""}>ผู้ปกครอง</option><option value="other"${ssrIncludeBooleanAttr(Array.isArray(unref(editParentForm).relationship) ? ssrLooseContain(unref(editParentForm).relationship, "other") : ssrLooseEqual(unref(editParentForm).relationship, "other")) ? " selected" : ""}>อื่นๆ</option></select></div>`);
        if (unref(editParentError)) {
          _push(`<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">${ssrInterpolate(unref(editParentError))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex justify-end space-x-3 pt-4"><button type="button" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"> ยกเลิก </button><button type="submit"${ssrIncludeBooleanAttr(unref(editingParent)) ? " disabled" : ""} class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">`);
        if (unref(editingParent)) {
          _push(`<span>กำลังบันทึก...</span>`);
        } else {
          _push(`<span>บันทึก</span>`);
        }
        _push(`</button></div></form></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/students/[id]/edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=edit-C6V17F6j.mjs.map
