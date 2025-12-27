import { defineComponent, ref, reactive, unref, watch, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderComponent } from 'vue/server-renderer';
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
import 'path';
import 'querystring';
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
  __name: "RoleModal",
  __ssrInlineRender: true,
  props: {
    show: { type: Boolean },
    role: { default: null }
  },
  emits: ["close", "saved"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    useAuth();
    const form = reactive({
      name: "",
      description: ""
    });
    const loading = ref(false);
    const error = ref("");
    watch(() => props.role, (role) => {
      if (role) {
        form.name = role.name;
        form.description = role.description || "";
      } else {
        form.name = "";
        form.description = "";
      }
      error.value = "";
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.show) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" }, _attrs))}><div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"><div class="flex items-center justify-between mb-6"><h2 class="text-2xl font-bold">${ssrInterpolate(__props.role ? "แก้ไขบทบาท" : "เพิ่มบทบาท")}</h2><button class="text-gray-400 hover:text-gray-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><form class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-2"> ชื่อบทบาท <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).name)} type="text" required${ssrIncludeBooleanAttr(!!__props.role) ? " disabled" : ""} class="${ssrRenderClass(["w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500", { "bg-gray-100 cursor-not-allowed": __props.role }])}">`);
        if (__props.role) {
          _push(`<p class="mt-1 text-xs text-gray-500">ไม่สามารถแก้ไขชื่อบทบาทระบบได้</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-2"> คำอธิบาย </label><textarea rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">${ssrInterpolate(unref(form).description)}</textarea></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/RoleModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$1, { __name: "RoleModal" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const config = useRuntimeConfig();
    const { accessToken } = useAuth();
    const roles = ref([]);
    const loading = ref(false);
    const error = ref("");
    const showCreateModal = ref(false);
    const editingRole = ref(null);
    const filters = reactive({
      search: ""
    });
    const systemRoles = ["system_admin", "owner", "admin", "branch_admin", "tutor", "parent", "student"];
    const isSystemRole = (roleName) => {
      return systemRoles.includes(roleName);
    };
    const loadRoles = async () => {
      loading.value = true;
      error.value = "";
      try {
        const params = new URLSearchParams();
        if (filters.search) params.append("search", filters.search);
        const response = await $fetch(`${config.public.apiBase}/admin/settings/roles?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          }
        });
        if (response.success) {
          roles.value = response.data;
        }
      } catch (err) {
        console.error("Error loading roles:", err);
        error.value = err.data?.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      } finally {
        loading.value = false;
      }
    };
    const closeModal = () => {
      showCreateModal.value = false;
      editingRole.value = null;
    };
    const handleRoleSaved = () => {
      closeModal();
      loadRoles();
    };
    const formatDate = (date) => {
      return format(new Date(date), "dd MMM yyyy", { locale: th });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_RoleModal = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="flex items-center justify-between mb-6"><h1 class="text-3xl font-bold">จัดการบทบาทผู้ใช้</h1><button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg><span>เพิ่มบทบาท</span></button></div><div class="bg-white rounded-lg shadow p-4 mb-6"><div><label class="block text-sm font-medium text-gray-700 mb-2">ค้นหา</label><input${ssrRenderAttr("value", unref(filters).search)} type="text" placeholder="ค้นหาด้วยชื่อบทบาท, คำอธิบาย" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div></div><div class="bg-white rounded-lg shadow overflow-hidden">`);
      if (unref(loading)) {
        _push(`<div class="p-8 text-center"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div><p class="mt-2 text-gray-600">กำลังโหลด...</p></div>`);
      } else if (unref(error)) {
        _push(`<div class="p-4 bg-red-50 border border-red-200 text-red-700 rounded">${ssrInterpolate(unref(error))}</div>`);
      } else if (unref(roles).length === 0) {
        _push(`<div class="p-8 text-center text-gray-500"> ไม่พบบทบาท </div>`);
      } else {
        _push(`<table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อบทบาท</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">คำอธิบาย</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่สร้าง</th><th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th></tr></thead><tbody class="bg-white divide-y divide-gray-200"><!--[-->`);
        ssrRenderList(unref(roles), (role) => {
          _push(`<tr class="hover:bg-gray-50"><td class="px-6 py-4 whitespace-nowrap"><div class="text-sm font-medium text-gray-900">${ssrInterpolate(role.name)}</div></td><td class="px-6 py-4"><div class="text-sm text-gray-500 max-w-xs truncate">${ssrInterpolate(role.description || "-")}</div></td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${ssrInterpolate(formatDate(role.created_at))}</td><td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><div class="flex items-center justify-end space-x-2"><button class="text-blue-600 hover:text-blue-900" title="แก้ไข"${ssrIncludeBooleanAttr(isSystemRole(role.name)) ? " disabled" : ""}><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="${ssrRenderClass([{ "opacity-50 cursor-not-allowed": isSystemRole(role.name) }, "w-5 h-5"])}"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>`);
          if (!isSystemRole(role.name)) {
            _push(`<button class="text-red-600 hover:text-red-900" title="ลบ"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></td></tr>`);
        });
        _push(`<!--]--></tbody></table>`);
      }
      _push(`</div>`);
      if (unref(showCreateModal) || unref(editingRole)) {
        _push(ssrRenderComponent(_component_RoleModal, {
          show: unref(showCreateModal) || !!unref(editingRole),
          role: unref(editingRole),
          onClose: closeModal,
          onSaved: handleRoleSaved
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/settings/roles/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Cvk7ldB7.mjs.map
