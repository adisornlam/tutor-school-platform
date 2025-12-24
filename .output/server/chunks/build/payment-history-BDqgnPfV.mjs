globalThis.__timing__.logStart('Load chunks/build/payment-history-BDqgnPfV');import { defineComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "payment-history",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 class="text-3xl font-bold mb-6">ประวัติการชำระเงิน</h1><div class="bg-white rounded-lg shadow p-8 text-center"><svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><h3 class="text-lg font-semibold text-gray-900 mb-2">ยังไม่มีข้อมูลการชำระเงิน</h3><p class="text-gray-600">ระบบการชำระเงินกำลังพัฒนา</p></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/payment-history.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };;globalThis.__timing__.logEnd('Load chunks/build/payment-history-BDqgnPfV');
//# sourceMappingURL=payment-history-BDqgnPfV.mjs.map
