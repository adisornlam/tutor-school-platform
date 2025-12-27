import { defineComponent, reactive, ref, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useAuth } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "StudentModal",
  __ssrInlineRender: true,
  props: {
    show: { type: Boolean },
    student: { default: null }
  },
  emits: ["close", "saved"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    useAuth();
    const form = reactive({
      username: "",
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      phone: ""
    });
    const loading = ref(false);
    const error = ref("");
    watch(() => props.student, (student) => {
      if (student) {
        form.username = student.username;
        form.email = student.email || "";
        form.first_name = student.first_name;
        form.last_name = student.last_name;
        form.phone = student.phone || "";
        form.password = "";
      } else {
        form.username = "";
        form.email = "";
        form.first_name = "";
        form.last_name = "";
        form.password = "";
        form.phone = "";
      }
      error.value = "";
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.show) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" }, _attrs))}><div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"><div class="flex items-center justify-between mb-6"><h2 class="text-2xl font-bold">${ssrInterpolate(__props.student ? "แก้ไขผู้เรียน" : "เพิ่มผู้เรียน")}</h2><button class="text-gray-400 hover:text-gray-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><form class="space-y-4"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2"> Username <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).username)} type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"${ssrIncludeBooleanAttr(!!__props.student) ? " disabled" : ""}></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Email </label><input${ssrRenderAttr("value", unref(form).email)} type="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> ชื่อ <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).first_name)} type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> นามสกุล <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).last_name)} type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> รหัสผ่าน <span class="text-red-500">*</span>`);
        if (__props.student) {
          _push(`<span class="text-xs text-gray-500">(เว้นว่างไว้ถ้าไม่ต้องการเปลี่ยน)</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</label><input${ssrRenderAttr("value", unref(form).password)} type="password"${ssrIncludeBooleanAttr(!__props.student) ? " required" : ""} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> เบอร์โทรศัพท์ </label><input${ssrRenderAttr("value", unref(form).phone)} type="tel" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div></div>`);
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
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/StudentModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "StudentModal" });

export { __nuxt_component_1 as _ };
//# sourceMappingURL=StudentModal-oAn_jRlQ.mjs.map
