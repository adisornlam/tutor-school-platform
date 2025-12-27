import { _ as __nuxt_component_0 } from './UserModal-C1fGoxGH.mjs';
import { defineComponent, ref, reactive, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { u as useAuth, c as useRuntimeConfig } from './server.mjs';
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
    const config = useRuntimeConfig();
    const { accessToken } = useAuth();
    const users = ref([]);
    const loading = ref(false);
    const error = ref("");
    const showCreateModal = ref(false);
    const editingUser = ref(null);
    const filters = reactive({
      search: "",
      role: "",
      status: ""
    });
    const pagination = reactive({
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0
    });
    const loadUsers = async () => {
      loading.value = true;
      error.value = "";
      try {
        const params = new URLSearchParams({
          page: pagination.page.toString(),
          limit: pagination.limit.toString()
        });
        if (filters.search) params.append("search", filters.search);
        if (filters.role) params.append("role", filters.role);
        if (filters.status) params.append("status", filters.status);
        const response = await $fetch(`${config.public.apiBase}/admin/users?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          }
        });
        if (response.success) {
          users.value = response.data.filter((user) => {
            const hasValidRoles = user.roles.some(
              (role) => ["system_admin", "owner", "admin", "branch_admin", "tutor"].includes(role)
            );
            return hasValidRoles;
          });
          Object.assign(pagination, response.pagination);
        }
      } catch (err) {
        console.error("Error loading users:", err);
        error.value = err.data?.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      } finally {
        loading.value = false;
      }
    };
    const closeModal = () => {
      showCreateModal.value = false;
      editingUser.value = null;
    };
    const handleUserSaved = () => {
      closeModal();
      loadUsers();
    };
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
    const getRoleDisplayName = (role) => {
      const roleNames = {
        system_admin: "System Admin",
        owner: "Owner",
        admin: "Admin กลาง",
        branch_admin: "Admin สาขา",
        tutor: "Tutor",
        parent: "Parent",
        student: "Student"
      };
      return roleNames[role] || role;
    };
    const getRoleBadgeClass = (role) => {
      const classes = {
        system_admin: "bg-purple-100 text-purple-800",
        owner: "bg-red-100 text-red-800",
        admin: "bg-blue-100 text-blue-800",
        branch_admin: "bg-indigo-100 text-indigo-800",
        tutor: "bg-yellow-100 text-yellow-800",
        parent: "bg-green-100 text-green-800",
        student: "bg-gray-100 text-gray-800"
      };
      return classes[role] || "bg-gray-100 text-gray-800";
    };
    const formatDate = (date) => {
      return format(new Date(date), "dd MMM yyyy", { locale: th });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UserModal = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="flex items-center justify-between mb-6"><h1 class="text-3xl font-bold">จัดการผู้ใช้งาน</h1><button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg><span>เพิ่มผู้ใช้งาน</span></button></div><div class="bg-white rounded-lg shadow p-4 mb-6"><div class="grid grid-cols-1 md:grid-cols-3 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2">ค้นหา</label><input${ssrRenderAttr("value", unref(filters).search)} type="text" placeholder="ค้นหาด้วย username, email, ชื่อ" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2">บทบาท</label><select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filters).role) ? ssrLooseContain(unref(filters).role, "") : ssrLooseEqual(unref(filters).role, "")) ? " selected" : ""}>ทั้งหมด</option><option value="system_admin"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).role) ? ssrLooseContain(unref(filters).role, "system_admin") : ssrLooseEqual(unref(filters).role, "system_admin")) ? " selected" : ""}>System Admin</option><option value="owner"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).role) ? ssrLooseContain(unref(filters).role, "owner") : ssrLooseEqual(unref(filters).role, "owner")) ? " selected" : ""}>Owner</option><option value="admin"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).role) ? ssrLooseContain(unref(filters).role, "admin") : ssrLooseEqual(unref(filters).role, "admin")) ? " selected" : ""}>Admin กลาง</option><option value="branch_admin"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).role) ? ssrLooseContain(unref(filters).role, "branch_admin") : ssrLooseEqual(unref(filters).role, "branch_admin")) ? " selected" : ""}>Admin สาขา</option><option value="tutor"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).role) ? ssrLooseContain(unref(filters).role, "tutor") : ssrLooseEqual(unref(filters).role, "tutor")) ? " selected" : ""}>Tutor</option></select></div><div><label class="block text-sm font-medium text-gray-700 mb-2">สถานะ</label><select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "") : ssrLooseEqual(unref(filters).status, "")) ? " selected" : ""}>ทั้งหมด</option><option value="active"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "active") : ssrLooseEqual(unref(filters).status, "active")) ? " selected" : ""}>ใช้งาน</option><option value="inactive"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "inactive") : ssrLooseEqual(unref(filters).status, "inactive")) ? " selected" : ""}>ปิดใช้งาน</option><option value="suspended"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "suspended") : ssrLooseEqual(unref(filters).status, "suspended")) ? " selected" : ""}>ระงับ</option></select></div></div></div><div class="bg-white rounded-lg shadow overflow-hidden">`);
      if (unref(loading)) {
        _push(`<div class="p-8 text-center"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div><p class="mt-2 text-gray-600">กำลังโหลด...</p></div>`);
      } else if (unref(error)) {
        _push(`<div class="p-4 bg-red-50 border border-red-200 text-red-700 rounded">${ssrInterpolate(unref(error))}</div>`);
      } else if (unref(users).length === 0) {
        _push(`<div class="p-8 text-center text-gray-500"> ไม่พบผู้ใช้งาน </div>`);
      } else {
        _push(`<table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ผู้ใช้งาน</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">บทบาท</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่สร้าง</th><th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th></tr></thead><tbody class="bg-white divide-y divide-gray-200"><!--[-->`);
        ssrRenderList(unref(users), (user) => {
          _push(`<tr class="hover:bg-gray-50"><td class="px-6 py-4 whitespace-nowrap"><div><div class="text-sm font-medium text-gray-900">${ssrInterpolate(user.first_name)} ${ssrInterpolate(user.last_name)}</div><div class="text-sm text-gray-500">${ssrInterpolate(user.username)}</div>`);
          if (user.email) {
            _push(`<div class="text-xs text-gray-400">${ssrInterpolate(user.email)}</div>`);
          } else {
            _push(`<!---->`);
          }
          if (user.phone) {
            _push(`<div class="text-xs text-gray-400">${ssrInterpolate(user.phone)}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></td><td class="px-6 py-4"><div class="flex flex-wrap gap-1"><!--[-->`);
          ssrRenderList(user.roles, (role) => {
            _push(`<span class="${ssrRenderClass([getRoleBadgeClass(role), "px-2 py-1 text-xs font-medium rounded"])}">${ssrInterpolate(getRoleDisplayName(role))}</span>`);
          });
          _push(`<!--]--></div></td><td class="px-6 py-4 whitespace-nowrap"><span class="${ssrRenderClass([getStatusBadgeClass(user.status), "px-2 py-1 text-xs font-medium rounded"])}">${ssrInterpolate(getStatusDisplayName(user.status))}</span></td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${ssrInterpolate(formatDate(user.created_at))}</td><td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><div class="flex items-center justify-end space-x-2"><button class="text-blue-600 hover:text-blue-900" title="แก้ไข"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>`);
          if (user.status === "active") {
            _push(`<button class="text-yellow-600 hover:text-yellow-900" title="ปิดใช้งาน"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg></button>`);
          } else {
            _push(`<button class="text-green-600 hover:text-green-900" title="เปิดใช้งาน"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></button>`);
          }
          _push(`<button class="text-red-600 hover:text-red-900" title="ลบ"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></div></td></tr>`);
        });
        _push(`<!--]--></tbody></table>`);
      }
      if (unref(pagination).totalPages > 1) {
        _push(`<div class="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200"><div class="text-sm text-gray-700"> แสดง ${ssrInterpolate((unref(pagination).page - 1) * unref(pagination).limit + 1)} ถึง ${ssrInterpolate(Math.min(unref(pagination).page * unref(pagination).limit, unref(pagination).total))} จาก ${ssrInterpolate(unref(pagination).total)} รายการ </div><div class="flex space-x-2"><button${ssrIncludeBooleanAttr(unref(pagination).page === 1) ? " disabled" : ""} class="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"> ก่อนหน้า </button><button${ssrIncludeBooleanAttr(unref(pagination).page >= unref(pagination).totalPages) ? " disabled" : ""} class="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"> ถัดไป </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(showCreateModal) || unref(editingUser)) {
        _push(ssrRenderComponent(_component_UserModal, {
          show: unref(showCreateModal) || !!unref(editingUser),
          user: unref(editingUser),
          onClose: closeModal,
          onSaved: handleUserSaved
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/settings/users/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-C6_laMk5.mjs.map
