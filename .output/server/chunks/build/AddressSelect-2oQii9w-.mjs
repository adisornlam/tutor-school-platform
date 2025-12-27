import { defineComponent, ref, watch, computed, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderList } from 'vue/server-renderer';
import { u as useAuth, c as useRuntimeConfig } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AddressSelect",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    userId: {},
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: true },
    placeholder: { default: "เลือกที่อยู่" },
    hint: { default: "" },
    showAddButton: { type: Boolean, default: true }
  },
  emits: ["update:modelValue", "add-new"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const addresses = ref([]);
    const config = useRuntimeConfig();
    const { accessToken } = useAuth();
    const loadAddresses = async () => {
      if (!props.userId) {
        addresses.value = [];
        return;
      }
      try {
        const response = await $fetch(
          `${config.public.apiBase}/admin/users/${props.userId}/addresses`,
          {
            headers: {
              Authorization: `Bearer ${accessToken.value}`
            }
          }
        );
        if (response.success) {
          addresses.value = response.data;
        }
      } catch (err) {
        console.error("Error loading addresses:", err);
        addresses.value = [];
      }
    };
    const formatAddress = (address) => {
      const parts = [];
      if (address.recipient_name) parts.push(address.recipient_name);
      if (address.address_line1) parts.push(address.address_line1);
      if (address.district) parts.push(`อ.${address.district}`);
      if (address.province) parts.push(`จ.${address.province}`);
      if (address.postal_code) parts.push(address.postal_code);
      const addressStr = parts.join(" ");
      const typeLabel = address.address_type === "home" ? "บ้าน" : address.address_type === "work" ? "ที่ทำงาน" : "อื่นๆ";
      const defaultLabel = address.is_default ? " (หลัก)" : "";
      return `${addressStr} [${typeLabel}${defaultLabel}]`;
    };
    watch(() => props.userId, (newUserId) => {
      if (newUserId) {
        loadAddresses();
      } else {
        addresses.value = [];
      }
    }, { immediate: true });
    const reloadAddresses = async () => {
      await loadAddresses();
    };
    __expose({
      loadAddresses,
      reloadAddresses,
      addresses: computed(() => addresses.value)
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><label class="block text-sm font-medium text-gray-700 mb-2">`);
      ssrRenderSlot(_ctx.$slots, "label", {}, () => {
        _push(`ที่อยู่จัดส่ง <span class="text-red-500">*</span>`);
      }, _push, _parent);
      _push(`</label><div class="relative"><select${ssrRenderAttr("value", __props.modelValue)}${ssrIncludeBooleanAttr(__props.disabled || __props.loading) ? " disabled" : ""}${ssrIncludeBooleanAttr(__props.required) ? " required" : ""} data-address-select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed bg-white text-gray-900"><option value="">${ssrInterpolate(__props.loading ? "กำลังโหลด..." : __props.placeholder)}</option><!--[-->`);
      ssrRenderList(unref(addresses), (address) => {
        _push(`<option${ssrRenderAttr("value", address.id)}>${ssrInterpolate(formatAddress(address))}</option>`);
      });
      _push(`<!--]--></select>`);
      if (__props.showAddButton) {
        _push(`<button type="button" class="absolute right-10 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-700" title="เพิ่มที่อยู่ใหม่"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (__props.hint) {
        _push(`<p class="mt-1 text-sm text-gray-500">${ssrInterpolate(__props.hint)}</p>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddressSelect.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const AddressSelect = Object.assign(_sfc_main, { __name: "AddressSelect" });

export { AddressSelect as A };
//# sourceMappingURL=AddressSelect-2oQii9w-.mjs.map
