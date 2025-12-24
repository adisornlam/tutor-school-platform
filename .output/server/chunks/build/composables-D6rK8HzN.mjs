globalThis.__timing__.logStart('Load chunks/build/composables-D6rK8HzN');import { hasInjectionContext, inject } from 'vue';
import { d as useNuxtApp } from './server.mjs';
import { u as useHead$1, h as headSymbol } from '../routes/renderer.mjs';

function injectHead(nuxtApp) {
  const nuxt = nuxtApp || useNuxtApp();
  return nuxt.ssrContext?.head || nuxt.runWithContext(() => {
    if (hasInjectionContext()) {
      const head = inject(headSymbol);
      if (!head) {
        throw new Error("[nuxt] [unhead] Missing Unhead instance.");
      }
      return head;
    }
  });
}
function useHead(input, options = {}) {
  const head = options.head || injectHead(options.nuxt);
  return useHead$1(input, { head, ...options });
}

export { useHead as u };;globalThis.__timing__.logEnd('Load chunks/build/composables-D6rK8HzN');
//# sourceMappingURL=composables-D6rK8HzN.mjs.map
