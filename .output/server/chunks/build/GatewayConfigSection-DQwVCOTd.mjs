import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import _sfc_main$1 from './StripeConfig-8Ff2Qb4D.mjs';
import _sfc_main$2 from './KsherConfig-CzUwN_np.mjs';
import _sfc_main$3 from './GenericGatewayConfig-CywwJcQF.mjs';
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
import 'accepts';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "GatewayConfigSection",
  __ssrInlineRender: true,
  props: {
    paymentMethodId: {},
    gatewayCode: {}
  },
  emits: ["saved"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { accessToken } = useAuth();
    const loading = ref(false);
    const error = ref(null);
    const gatewayConfig = ref(null);
    const loadGatewayConfig = async () => {
      try {
        loading.value = true;
        error.value = null;
        const response = await $fetch(
          `/api/admin/settings/payment-methods/${props.paymentMethodId}/gateway`,
          {
            headers: {
              Authorization: `Bearer ${accessToken.value}`
            }
          }
        );
        if (response.success) {
          gatewayConfig.value = response.data;
        } else {
          error.value = "ไม่สามารถโหลดการตั้งค่า Gateway ได้";
        }
      } catch (err) {
        console.error("Error loading gateway config:", err);
        error.value = err.data?.message || "เกิดข้อผิดพลาดในการโหลดการตั้งค่า Gateway";
      } finally {
        loading.value = false;
      }
    };
    const handleSaved = () => {
      loadGatewayConfig();
      emit("saved");
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      if (unref(loading)) {
        _push(`<div class="text-center py-8"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div><p class="mt-2 text-gray-600">กำลังโหลด...</p></div>`);
      } else if (unref(error)) {
        _push(`<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<div>`);
        if (__props.gatewayCode === "stripe") {
          _push(ssrRenderComponent(_sfc_main$1, {
            "gateway-config": unref(gatewayConfig),
            "payment-method-id": __props.paymentMethodId,
            onSaved: handleSaved
          }, null, _parent));
        } else if (__props.gatewayCode === "ksher") {
          _push(ssrRenderComponent(_sfc_main$2, {
            "gateway-config": unref(gatewayConfig),
            "payment-method-id": __props.paymentMethodId,
            onSaved: handleSaved
          }, null, _parent));
        } else {
          _push(ssrRenderComponent(_sfc_main$3, {
            "gateway-config": unref(gatewayConfig),
            "payment-method-id": __props.paymentMethodId,
            "gateway-code": __props.gatewayCode,
            onSaved: handleSaved
          }, null, _parent));
        }
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/settings/payment-methods/components/GatewayConfigSection.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=GatewayConfigSection-DQwVCOTd.mjs.map
