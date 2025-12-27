import { defineComponent, ref, reactive, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain } from 'vue/server-renderer';
import { u as useAuth } from './server.mjs';
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
  __name: "StripeConfig",
  __ssrInlineRender: true,
  props: {
    gatewayConfig: {},
    paymentMethodId: {}
  },
  emits: ["saved"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    useAuth();
    const saving = ref(false);
    const saveError = ref("");
    const form = reactive({
      gateway_code: "stripe",
      gateway_name: "Stripe",
      api_key: "",
      api_secret: "",
      webhook_secret: "",
      is_test_mode: true,
      is_active: false
    });
    watch(() => props.gatewayConfig, (config) => {
      if (config) {
        form.gateway_code = config.gateway_code || "stripe";
        form.gateway_name = config.gateway_name || "Stripe";
        form.api_key = config.api_key || "";
        form.is_test_mode = config.is_test_mode !== void 0 ? config.is_test_mode : true;
        form.is_active = config.is_active !== void 0 ? config.is_active : false;
      } else {
        form.gateway_code = "stripe";
        form.gateway_name = "Stripe";
        form.api_key = "";
        form.api_secret = "";
        form.webhook_secret = "";
        form.is_test_mode = true;
        form.is_active = false;
      }
      saveError.value = "";
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white rounded-lg shadow p-6" }, _attrs))}><h3 class="text-lg font-semibold mb-4">การตั้งค่า Stripe</h3><form class="space-y-4"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-2"> Gateway Name </label><input${ssrRenderAttr("value", unref(form).gateway_name)} type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Publishable Key (API Key) <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).api_key)} type="text" required placeholder="pk_test_..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Secret Key (API Secret) <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).api_secret)} type="password" required placeholder="sk_test_..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm">`);
      if (__props.gatewayConfig?.api_secret) {
        _push(`<p class="mt-1 text-xs text-gray-500"> ปัจจุบัน: ${ssrInterpolate(__props.gatewayConfig.api_secret)} (กรอกเฉพาะเมื่อต้องการเปลี่ยน) </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Webhook Secret </label><input${ssrRenderAttr("value", unref(form).webhook_secret)} type="password" placeholder="whsec_..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm">`);
      if (__props.gatewayConfig?.webhook_secret) {
        _push(`<p class="mt-1 text-xs text-gray-500"> ปัจจุบัน: ${ssrInterpolate(__props.gatewayConfig.webhook_secret)} (กรอกเฉพาะเมื่อต้องการเปลี่ยน) </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="flex items-center space-x-4"><label class="flex items-center"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).is_test_mode) ? ssrLooseContain(unref(form).is_test_mode, null) : unref(form).is_test_mode) ? " checked" : ""} type="checkbox" class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"><span class="ml-2 text-sm text-gray-700">Test Mode (ใช้คีย์ทดสอบ)</span></label><label class="flex items-center"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).is_active) ? ssrLooseContain(unref(form).is_active, null) : unref(form).is_active) ? " checked" : ""} type="checkbox" class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"><span class="ml-2 text-sm text-gray-700">เปิดใช้งาน</span></label></div>`);
      if (unref(saveError)) {
        _push(`<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">${ssrInterpolate(unref(saveError))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex justify-end space-x-3 pt-4"><button type="submit"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">`);
      if (unref(saving)) {
        _push(`<span>กำลังบันทึก...</span>`);
      } else {
        _push(`<span>บันทึก</span>`);
      }
      _push(`</button></div></form></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/settings/payment-methods/components/gateway/StripeConfig.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=StripeConfig-8Ff2Qb4D.mjs.map
