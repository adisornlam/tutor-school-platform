import { defineComponent, reactive, ref, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderClass, ssrLooseContain } from 'vue/server-renderer';
import { U as UserRole } from '../nitro/nitro.mjs';
import { u as useAuth } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "UserModal",
  __ssrInlineRender: true,
  props: {
    show: { type: Boolean },
    user: { default: null }
  },
  emits: ["close", "saved"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    useAuth();
    const availableRoles = [
      { value: UserRole.SYSTEM_ADMIN, label: "System Admin" },
      { value: UserRole.OWNER, label: "Owner" },
      { value: UserRole.ADMIN, label: "Admin กลาง" },
      { value: UserRole.BRANCH_ADMIN, label: "Admin สาขา" },
      { value: UserRole.TUTOR, label: "Tutor" }
    ];
    const form = reactive({
      username: "",
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      phone: "",
      roles: []
    });
    const loading = ref(false);
    const error = ref("");
    watch(() => props.user, (user) => {
      if (user) {
        form.username = user.username;
        form.email = user.email || "";
        form.first_name = user.first_name;
        form.last_name = user.last_name;
        form.phone = user.phone || "";
        form.password = "";
        form.roles = user.roles.filter(
          (role) => availableRoles.some((r) => r.value === role)
        );
      } else {
        form.username = "";
        form.email = "";
        form.first_name = "";
        form.last_name = "";
        form.password = "";
        form.phone = "";
        form.roles = [];
      }
      error.value = "";
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.show) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" }, _attrs))}><div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"><div class="flex items-center justify-between mb-6"><h2 class="text-2xl font-bold">${ssrInterpolate(__props.user ? "แก้ไขผู้ใช้งาน" : "เพิ่มผู้ใช้งาน")}</h2><button class="text-gray-400 hover:text-gray-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><form class="space-y-4"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2"> Username <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).username)} type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"${ssrIncludeBooleanAttr(!!__props.user) ? " disabled" : ""}></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Email </label><input${ssrRenderAttr("value", unref(form).email)} type="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> ชื่อ <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).first_name)} type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> นามสกุล <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).last_name)} type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> รหัสผ่าน <span class="text-red-500">*</span>`);
        if (__props.user) {
          _push(`<span class="text-xs text-gray-500">(เว้นว่างไว้ถ้าไม่ต้องการเปลี่ยน)</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</label><input${ssrRenderAttr("value", unref(form).password)} type="password"${ssrIncludeBooleanAttr(!__props.user) ? " required" : ""} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> เบอร์โทรศัพท์ </label><input${ssrRenderAttr("value", unref(form).phone)} type="tel" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-2"> บทบาท <span class="text-red-500">*</span></label><div class="grid grid-cols-2 md:grid-cols-3 gap-3"><!--[-->`);
        ssrRenderList(availableRoles, (role) => {
          _push(`<label class="${ssrRenderClass([{ "bg-green-50 border-green-500": unref(form).roles.includes(role.value) }, "flex items-center space-x-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"])}"><input type="checkbox"${ssrRenderAttr("value", role.value)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).roles) ? ssrLooseContain(unref(form).roles, role.value) : unref(form).roles) ? " checked" : ""} class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"><span class="text-sm font-medium">${ssrInterpolate(role.label)}</span></label>`);
        });
        _push(`<!--]--></div>`);
        if (unref(form).roles.length === 0) {
          _push(`<p class="mt-2 text-sm text-red-600"> กรุณาเลือกอย่างน้อย 1 บทบาท </p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
        if (unref(error)) {
          _push(`<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">${ssrInterpolate(unref(error))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex justify-end space-x-3 pt-4"><button type="button" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"> ยกเลิก </button><button type="submit"${ssrIncludeBooleanAttr(unref(loading) || unref(form).roles.length === 0) ? " disabled" : ""} class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">`);
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
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "UserModal" });

export { __nuxt_component_0 as _ };
//# sourceMappingURL=UserModal-C1fGoxGH.mjs.map
