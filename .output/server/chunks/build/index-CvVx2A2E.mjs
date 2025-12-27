import { defineComponent, ref, reactive, unref, watch, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
import { u as useAuth, c as useRuntimeConfig } from './server.mjs';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
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
import 'negotiator';
import 'mime-types';
import 'path';
import 'querystring';
import 'base64id';
import 'timers';
import 'cookie';
import 'ws';
import 'cors';
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

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "BranchModal",
  __ssrInlineRender: true,
  props: {
    show: { type: Boolean },
    branch: { default: null }
  },
  emits: ["close", "saved"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    useAuth();
    const form = reactive({
      name: "",
      code: "",
      address: "",
      phone: "",
      email: "",
      status: "active"
    });
    const loading = ref(false);
    const error = ref("");
    watch(() => props.branch, (branch) => {
      if (branch) {
        form.name = branch.name;
        form.code = branch.code;
        form.address = branch.address || "";
        form.phone = branch.phone || "";
        form.email = branch.email || "";
        form.status = branch.status;
      } else {
        form.name = "";
        form.code = "";
        form.address = "";
        form.phone = "";
        form.email = "";
        form.status = "active";
      }
      error.value = "";
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.show) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" }, _attrs))}><div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"><div class="flex items-center justify-between mb-6"><h2 class="text-2xl font-bold">${ssrInterpolate(__props.branch ? "แก้ไขสาขา" : "เพิ่มสาขา")}</h2><button class="text-gray-400 hover:text-gray-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><form class="space-y-4"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2"> ชื่อสาขา <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).name)} type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> รหัสสาขา <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).code)} type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-2"> ที่อยู่ </label><textarea rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">${ssrInterpolate(unref(form).address)}</textarea></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> เบอร์โทรศัพท์ </label><input${ssrRenderAttr("value", unref(form).phone)} type="tel" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> อีเมล </label><input${ssrRenderAttr("value", unref(form).email)} type="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> สถานะ </label><select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value="active"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "active") : ssrLooseEqual(unref(form).status, "active")) ? " selected" : ""}>ใช้งาน</option><option value="inactive"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "inactive") : ssrLooseEqual(unref(form).status, "inactive")) ? " selected" : ""}>ปิดใช้งาน</option></select></div></div>`);
        if (unref(error)) {
          _push(`<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">${ssrInterpolate(unref(error))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex justify-end space-x-3 pt-4"><button type="button" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"> ยกเลิก </button><button type="submit"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">`);
        if (unref(loading)) {
          _push(`<span>กำลังบันทึก...</span>`);
        } else {
          _push(`<span>บันทึก</span>`);
        }
        _push(`</button></div></form></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BranchModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$1, { __name: "BranchModal" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const config = useRuntimeConfig();
    const { accessToken } = useAuth();
    const branches = ref([]);
    const loading = ref(false);
    const error = ref("");
    const showCreateModal = ref(false);
    const editingBranch = ref(null);
    const filters = reactive({
      search: "",
      status: ""
    });
    const loadBranches = async () => {
      loading.value = true;
      error.value = "";
      try {
        const params = new URLSearchParams();
        if (filters.search) params.append("search", filters.search);
        if (filters.status) params.append("status", filters.status);
        const response = await $fetch(`${config.public.apiBase}/admin/settings/branches?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          }
        });
        if (response.success) {
          branches.value = response.data;
        }
      } catch (err) {
        console.error("Error loading branches:", err);
        error.value = err.data?.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      } finally {
        loading.value = false;
      }
    };
    const closeModal = () => {
      showCreateModal.value = false;
      editingBranch.value = null;
    };
    const handleBranchSaved = () => {
      closeModal();
      loadBranches();
    };
    const getStatusName = (status) => {
      const statusNames = {
        active: "ใช้งาน",
        inactive: "ปิดใช้งาน"
      };
      return statusNames[status] || status;
    };
    const getStatusBadgeClass = (status) => {
      const classes = {
        active: "bg-green-100 text-green-800",
        inactive: "bg-gray-100 text-gray-800"
      };
      return classes[status] || "bg-gray-100 text-gray-800";
    };
    const formatDate = (date) => {
      return format(new Date(date), "dd MMM yyyy", { locale: th });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BranchModal = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="flex items-center justify-between mb-6"><h1 class="text-3xl font-bold">จัดการสาขา</h1><button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg><span>เพิ่มสาขา</span></button></div><div class="bg-white rounded-lg shadow p-4 mb-6"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2">ค้นหา</label><input${ssrRenderAttr("value", unref(filters).search)} type="text" placeholder="ค้นหาด้วยชื่อสาขา, รหัสสาขา, ที่อยู่" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2">สถานะ</label><select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "") : ssrLooseEqual(unref(filters).status, "")) ? " selected" : ""}>ทั้งหมด</option><option value="active"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "active") : ssrLooseEqual(unref(filters).status, "active")) ? " selected" : ""}>ใช้งาน</option><option value="inactive"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "inactive") : ssrLooseEqual(unref(filters).status, "inactive")) ? " selected" : ""}>ปิดใช้งาน</option></select></div></div></div><div class="bg-white rounded-lg shadow overflow-hidden">`);
      if (unref(loading)) {
        _push(`<div class="p-8 text-center"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div><p class="mt-2 text-gray-600">กำลังโหลด...</p></div>`);
      } else if (unref(error)) {
        _push(`<div class="p-4 bg-red-50 border border-red-200 text-red-700 rounded">${ssrInterpolate(unref(error))}</div>`);
      } else if (unref(branches).length === 0) {
        _push(`<div class="p-8 text-center text-gray-500"> ไม่พบสาขา </div>`);
      } else {
        _push(`<table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สาขา</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ที่อยู่</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ติดต่อ</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่สร้าง</th><th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th></tr></thead><tbody class="bg-white divide-y divide-gray-200"><!--[-->`);
        ssrRenderList(unref(branches), (branch) => {
          _push(`<tr class="hover:bg-gray-50"><td class="px-6 py-4 whitespace-nowrap"><div><div class="text-sm font-medium text-gray-900">${ssrInterpolate(branch.name)}</div><div class="text-sm text-gray-500">รหัส: ${ssrInterpolate(branch.code)}</div></div></td><td class="px-6 py-4"><div class="text-sm text-gray-900">${ssrInterpolate(branch.address || "-")}</div></td><td class="px-6 py-4 whitespace-nowrap"><div class="text-sm text-gray-900">`);
          if (branch.phone) {
            _push(`<div>${ssrInterpolate(branch.phone)}</div>`);
          } else {
            _push(`<!---->`);
          }
          if (branch.email) {
            _push(`<div class="text-gray-500">${ssrInterpolate(branch.email)}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></td><td class="px-6 py-4 whitespace-nowrap"><span class="${ssrRenderClass([getStatusBadgeClass(branch.status), "px-2 py-1 text-xs font-medium rounded"])}">${ssrInterpolate(getStatusName(branch.status))}</span></td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${ssrInterpolate(formatDate(branch.created_at))}</td><td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><div class="flex items-center justify-end space-x-2"><button class="text-blue-600 hover:text-blue-900" title="แก้ไข"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>`);
          if (branch.status === "active") {
            _push(`<button class="text-yellow-600 hover:text-yellow-900" title="ปิดใช้งาน"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg></button>`);
          } else {
            _push(`<button class="text-green-600 hover:text-green-900" title="เปิดใช้งาน"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></button>`);
          }
          _push(`<button class="text-red-600 hover:text-red-900" title="ลบ"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></div></td></tr>`);
        });
        _push(`<!--]--></tbody></table>`);
      }
      _push(`</div>`);
      if (unref(showCreateModal) || unref(editingBranch)) {
        _push(ssrRenderComponent(_component_BranchModal, {
          show: unref(showCreateModal) || !!unref(editingBranch),
          branch: unref(editingBranch),
          onClose: closeModal,
          onSaved: handleBranchSaved
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/settings/branches/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CvVx2A2E.mjs.map
