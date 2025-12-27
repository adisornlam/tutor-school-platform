import { _ as __nuxt_component_0 } from './nuxt-link-CODr8WH9.mjs';
import { defineComponent, ref, mergeProps, withCtx, createVNode, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
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
import 'mime-db';
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
  __name: "homepage",
  __ssrInlineRender: true,
  setup(__props) {
    const { isAuthenticated, user } = useAuth();
    const showUserMenu = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-white" }, _attrs))}><header class="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm"><nav class="container mx-auto px-4"><div class="flex items-center justify-between h-16">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center space-x-2"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-2xl font-bold text-green-600"${_scopeId}>KDC School</span>`);
          } else {
            return [
              createVNode("span", { class: "text-2xl font-bold text-green-600" }, "KDC School")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="hidden md:flex items-center space-x-6">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/courses",
        class: "text-gray-700 hover:text-green-600 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` คอร์สเรียนทั้งหมด `);
          } else {
            return [
              createTextVNode(" คอร์สเรียนทั้งหมด ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/courses?level=elementary",
        class: "text-gray-700 hover:text-green-600 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` ประถมศึกษา `);
          } else {
            return [
              createTextVNode(" ประถมศึกษา ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/courses?level=secondary",
        class: "text-gray-700 hover:text-green-600 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` มัธยมศึกษา `);
          } else {
            return [
              createTextVNode(" มัธยมศึกษา ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/about",
        class: "text-gray-700 hover:text-green-600 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` เกี่ยวกับเรา `);
          } else {
            return [
              createTextVNode(" เกี่ยวกับเรา ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="flex items-center space-x-4"><div class="hidden md:block relative"><input type="text" placeholder="ค้นหาคอร์สเรียน" class="pl-10 pr-4 py-2 w-64 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 placeholder-gray-400"><svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div>`);
      if (unref(isAuthenticated)) {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/my-courses",
          class: "text-gray-700 hover:text-green-600 transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` คอร์สเรียนของฉัน `);
            } else {
              return [
                createTextVNode(" คอร์สเรียนของฉัน ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<button class="relative p-2 text-gray-700 hover:text-green-600"><svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg><span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span></button><div class="relative"><button class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"><div class="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">${ssrInterpolate(unref(user)?.first_name?.[0] || "U")}</div></button>`);
        if (unref(showUserMenu)) {
          _push(`<div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/profile",
            class: "block px-4 py-2 text-gray-700 hover:bg-gray-100",
            onClick: ($event) => showUserMenu.value = false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` โปรไฟล์ `);
              } else {
                return [
                  createTextVNode(" โปรไฟล์ ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`<button class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"> ออกจากระบบ </button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><!--]-->`);
      } else {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/auth/login",
          class: "px-4 py-2 text-gray-700 hover:text-green-600 transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` เข้าสู่ระบบ `);
            } else {
              return [
                createTextVNode(" เข้าสู่ระบบ ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/auth/register",
          class: "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` สมัครสมาชิก `);
            } else {
              return [
                createTextVNode(" สมัครสมาชิก ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<!--]-->`);
      }
      _push(`</div></div></nav></header><main>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main><footer class="bg-gray-900 text-white py-12 mt-20"><div class="container mx-auto px-4"><div class="grid md:grid-cols-4 gap-8"><div><h3 class="text-xl font-bold mb-4">KDC School</h3><p class="text-gray-400"> เรียนออนไลน์ได้ทุกที่ ทุกเวลา </p></div><div><h4 class="font-semibold mb-4">เกี่ยวกับเรา</h4><ul class="space-y-2 text-gray-400"><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/about",
        class: "hover:text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`เกี่ยวกับเรา`);
          } else {
            return [
              createTextVNode("เกี่ยวกับเรา")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/contact",
        class: "hover:text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`ติดต่อเรา`);
          } else {
            return [
              createTextVNode("ติดต่อเรา")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/careers",
        class: "hover:text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`ร่วมงานกับเรา`);
          } else {
            return [
              createTextVNode("ร่วมงานกับเรา")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></div><div><h4 class="font-semibold mb-4">ช่วยเหลือ</h4><ul class="space-y-2 text-gray-400"><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/help",
        class: "hover:text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`คำถามที่พบบ่อย`);
          } else {
            return [
              createTextVNode("คำถามที่พบบ่อย")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/support",
        class: "hover:text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`ติดต่อฝ่ายสนับสนุน`);
          } else {
            return [
              createTextVNode("ติดต่อฝ่ายสนับสนุน")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></div><div><h4 class="font-semibold mb-4">ติดตามเรา</h4><div class="flex space-x-4"><a href="#" class="text-gray-400 hover:text-white">Facebook</a><a href="#" class="text-gray-400 hover:text-white">Line</a><a href="#" class="text-gray-400 hover:text-white">YouTube</a></div></div></div><div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400"><p>© 2024 KDC School. สงวนลิขสิทธิ์</p></div></div></footer></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/homepage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=homepage-BUzDIIY1.mjs.map
