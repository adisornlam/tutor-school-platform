import { defineComponent, ref, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline';
import _sfc_main$1 from './GeneralTab-CHRudM28.mjs';
import _sfc_main$2 from './TimezoneTab-Dw893pUd.mjs';
import _sfc_main$3 from './MaintenanceTab-Dm9kgHWA.mjs';
import _sfc_main$4 from './SecurityTab-DDNotXn0.mjs';
import _sfc_main$5 from './FileUploadTab-CW3cNCWa.mjs';
import _sfc_main$6 from './NotificationTab-CXea2PWy.mjs';
import _sfc_main$7 from './LanguageTab-DbPMqoWD.mjs';
import _sfc_main$8 from './DisplayTab-CsMJSnCo.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { accessToken } = useAuth();
    const activeTab = ref("general");
    const loading = ref(true);
    const error = ref(null);
    const settings = ref({});
    const tabs = [
      { id: "general", label: "ข้อมูลทั่วไป" },
      { id: "timezone", label: "เวลาและวันที่" },
      { id: "maintenance", label: "บำรุงรักษา" },
      { id: "security", label: "ความปลอดภัย" },
      { id: "file_upload", label: "การอัพโหลดไฟล์" },
      { id: "notification", label: "การแจ้งเตือน" },
      { id: "language", label: "ภาษา" },
      { id: "display", label: "การแสดงผล" }
    ];
    const loadSettings = async () => {
      try {
        loading.value = true;
        error.value = null;
        const response = await $fetch(
          "/api/admin/settings/system",
          {
            headers: {
              Authorization: `Bearer ${accessToken.value}`
            }
          }
        );
        if (response.success) {
          settings.value = response.data;
        } else {
          error.value = "ไม่สามารถโหลดการตั้งค่าได้";
        }
      } catch (err) {
        console.error("Error loading system settings:", err);
        error.value = err.data?.message || "เกิดข้อผิดพลาดในการโหลดการตั้งค่า";
      } finally {
        loading.value = false;
      }
    };
    const handleSaved = () => {
      loadSettings();
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="mb-6"><h1 class="text-3xl font-bold">ตั้งค่าระบบ</h1><p class="mt-2 text-gray-600">จัดการการตั้งค่าระบบต่างๆ</p></div>`);
      if (unref(loading)) {
        _push(`<div class="flex items-center justify-center py-12"><div class="text-center"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div><p class="mt-4 text-gray-600">กำลังโหลด...</p></div></div>`);
      } else if (unref(error)) {
        _push(`<div class="bg-red-50 border border-red-200 rounded-lg p-4"><div class="flex items-center">`);
        _push(ssrRenderComponent(unref(ExclamationTriangleIcon), { class: "h-5 w-5 text-red-600 mr-2" }, null, _parent));
        _push(`<p class="text-red-800">${ssrInterpolate(unref(error))}</p></div></div>`);
      } else {
        _push(`<div><div class="flex items-center gap-4 mb-6 border-b border-gray-200"><!--[-->`);
        ssrRenderList(tabs, (tab) => {
          _push(`<button class="${ssrRenderClass([unref(activeTab) === tab.id ? "text-green-600 border-b-2 border-green-600" : "text-gray-600 hover:text-green-600", "px-4 py-2 font-semibold transition-colors relative"])}">${ssrInterpolate(tab.label)}</button>`);
        });
        _push(`<!--]--></div><div>`);
        if (unref(activeTab) === "general") {
          _push(ssrRenderComponent(_sfc_main$1, {
            settings: unref(settings).general || [],
            onSaved: handleSaved
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(activeTab) === "timezone") {
          _push(ssrRenderComponent(_sfc_main$2, {
            settings: unref(settings).timezone || [],
            onSaved: handleSaved
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(activeTab) === "maintenance") {
          _push(ssrRenderComponent(_sfc_main$3, {
            settings: unref(settings).maintenance || [],
            onSaved: handleSaved
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(activeTab) === "security") {
          _push(ssrRenderComponent(_sfc_main$4, {
            settings: unref(settings).security || [],
            onSaved: handleSaved
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(activeTab) === "file_upload") {
          _push(ssrRenderComponent(_sfc_main$5, {
            settings: unref(settings).file_upload || [],
            onSaved: handleSaved
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(activeTab) === "notification") {
          _push(ssrRenderComponent(_sfc_main$6, {
            settings: unref(settings).notification || [],
            onSaved: handleSaved
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(activeTab) === "language") {
          _push(ssrRenderComponent(_sfc_main$7, {
            settings: unref(settings).language || [],
            onSaved: handleSaved
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(activeTab) === "display") {
          _push(ssrRenderComponent(_sfc_main$8, {
            settings: unref(settings).display || [],
            onSaved: handleSaved
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/settings/system/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Dgx-VJ48.mjs.map
