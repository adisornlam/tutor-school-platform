globalThis.__timing__.logStart('Load chunks/build/login-DqqBgQn6');import { defineComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="min-h-screen flex items-center justify-center bg-gray-50"><div class="text-center"><p class="text-gray-600 mb-4">กำลังเปลี่ยนเส้นทาง...</p><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };;globalThis.__timing__.logEnd('Load chunks/build/login-DqqBgQn6');
//# sourceMappingURL=login-DqqBgQn6.mjs.map
