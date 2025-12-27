import { _ as __nuxt_component_0 } from './nuxt-link-CODr8WH9.mjs';
import { defineComponent, computed, mergeProps, withCtx, unref, createTextVNode, toDisplayString, readonly, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { i as useState } from './server.mjs';
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

const translations = {
  th: {
    app: { name: "KDC Tutor School" },
    nav: { courses: "คอร์สเรียน", login: "เข้าสู่ระบบ", register: "สมัครสมาชิก", dashboard: "แดชบอร์ด" },
    home: {
      hero: {
        title: "เรียนออนไลน์ได้ทุกที่ ทุกเวลา",
        subtitle: "พร้อมทั้ง Live e-Learning และ Video on Demand",
        viewCourses: "ดูคอร์สทั้งหมด",
        register: "ลงทะเบียน"
      },
      features: {
        title: "ทำไมต้องเลือกเรา",
        live: "Live e-Learning",
        liveDesc: "เรียนสดออนไลน์กับอาจารย์",
        vod: "Video on Demand",
        vodDesc: "เรียนย้อนหลังได้ 24 ชั่วโมง",
        materials: "ส่งเอกสาร",
        materialsDesc: "ส่งเอกสารผ่าน Kerry Express"
      }
    },
    error: { goHome: "กลับหน้าหลัก" },
    footer: { allRightsReserved: "สงวนลิขสิทธิ์" }
  },
  en: {
    app: { name: "KDC Tutor School" },
    nav: { courses: "Courses", login: "Login", register: "Register", dashboard: "Dashboard" },
    home: {
      hero: {
        title: "Learn Online Anytime, Anywhere",
        subtitle: "With Live e-Learning and Video on Demand",
        viewCourses: "View All Courses",
        register: "Register"
      },
      features: {
        title: "Why Choose Us",
        live: "Live e-Learning",
        liveDesc: "Learn live online with teachers",
        vod: "Video on Demand",
        vodDesc: "Watch recordings for 24 hours",
        materials: "Material Delivery",
        materialsDesc: "Materials delivered via Kerry Express"
      }
    },
    error: { goHome: "Go Home" },
    footer: { allRightsReserved: "All Rights Reserved" }
  }
};
const useI18n = () => {
  const locale = useState("i18n.locale", () => "th");
  const t = (key, params) => {
    const keys = key.split(".");
    let value = translations[locale.value] || translations.th;
    for (const k of keys) {
      value = value?.[k];
      if (value === void 0) {
        console.warn(`Translation key "${key}" not found for locale "${locale.value}"`);
        return key;
      }
    }
    if (typeof value !== "string") {
      return key;
    }
    if (params) {
      return Object.entries(params).reduce(
        (str, [param, val]) => str.replace(`{${param}}`, val),
        value
      );
    }
    return value;
  };
  const setLocale = (newLocale) => {
    if (translations[newLocale]) {
      locale.value = newLocale;
    }
  };
  return {
    locale: readonly(locale),
    t,
    setLocale
  };
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const { locale, t } = useI18n();
    const currentLocale = computed(() => locale.value);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))}><header class="bg-white shadow-sm"><nav class="container mx-auto px-4 py-4"><div class="flex items-center justify-between">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "text-2xl font-bold text-primary-blue"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("app.name"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("app.name")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex items-center gap-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/courses",
        class: "text-gray-700 hover:text-primary-blue"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("nav.courses"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("nav.courses")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/auth/login",
        class: "text-gray-700 hover:text-primary-blue"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("nav.login"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("nav.login")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button class="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200">${ssrInterpolate(unref(currentLocale) === "th" ? "EN" : "TH")}</button></div></div></nav></header><main>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main><footer class="bg-gray-800 text-white mt-auto py-8"><div class="container mx-auto px-4 text-center"><p>© 2024 KDC Tutor School. ${ssrInterpolate(unref(t)("footer.allRightsReserved"))}</p></div></footer></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-DK77MwgI.mjs.map
