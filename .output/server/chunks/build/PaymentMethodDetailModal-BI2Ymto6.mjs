import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
import _sfc_main$1 from './PaymentMethodBasicInfo-DluNVwrX.mjs';
import _sfc_main$2 from './BankAccountsSection-DvbJydEj.mjs';
import _sfc_main$3 from './GatewayConfigSection-DQwVCOTd.mjs';
import './server.mjs';
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
import './BankAccountModal-TDo4EpJK.mjs';
import './StripeConfig-8Ff2Qb4D.mjs';
import './KsherConfig-CzUwN_np.mjs';
import './GenericGatewayConfig-CywwJcQF.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PaymentMethodDetailModal",
  __ssrInlineRender: true,
  props: {
    show: { type: Boolean },
    method: {}
  },
  emits: ["close", "saved"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const activeTab = ref("basic");
    const tabs = computed(() => {
      const baseTabs = [
        { id: "basic", label: "ข้อมูลพื้นฐาน" }
      ];
      if (props.method?.type === "bank_transfer") {
        baseTabs.push({ id: "bank_accounts", label: "บัญชีธนาคาร" });
      } else if (props.method?.type === "payment_gateway") {
        baseTabs.push({ id: "gateway", label: "ตั้งค่า Gateway" });
      }
      return baseTabs;
    });
    const handleSaved = () => {
      emit("saved");
    };
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.show && __props.method) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" }, _attrs))}><div class="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"><div class="flex items-center justify-between mb-6"><h2 class="text-2xl font-bold">จัดการ: ${ssrInterpolate(__props.method.name)}</h2><button class="text-gray-400 hover:text-gray-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><div class="flex items-center gap-4 mb-6 border-b border-gray-200"><!--[-->`);
        ssrRenderList(unref(tabs), (tab) => {
          _push(`<button class="${ssrRenderClass([unref(activeTab) === tab.id ? "text-green-600 border-b-2 border-green-600" : "text-gray-600 hover:text-green-600", "px-4 py-2 font-semibold transition-colors relative"])}">${ssrInterpolate(tab.label)}</button>`);
        });
        _push(`<!--]--></div><div>`);
        if (unref(activeTab) === "basic") {
          _push(ssrRenderComponent(_sfc_main$1, {
            method: __props.method,
            onSaved: handleSaved
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(activeTab) === "bank_accounts" && __props.method.type === "bank_transfer") {
          _push(ssrRenderComponent(_sfc_main$2, {
            "payment-method-id": __props.method.id,
            onSaved: handleSaved
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(activeTab) === "gateway" && __props.method.type === "payment_gateway") {
          _push(ssrRenderComponent(_sfc_main$3, {
            "payment-method-id": __props.method.id,
            "gateway-code": __props.method.code,
            onSaved: handleSaved
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/settings/payment-methods/components/PaymentMethodDetailModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=PaymentMethodDetailModal-BI2Ymto6.mjs.map
