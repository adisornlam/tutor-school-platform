import { defineComponent, ref, reactive, watch, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
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
import 'vary';
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

const placeholderExample = "<p>สวัสดี {{first_name}},</p>";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TemplateModal",
  __ssrInlineRender: true,
  props: {
    show: { type: Boolean },
    template: {},
    mode: { default: "view" }
  },
  emits: ["close", "saved"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    useAuth();
    const mode = ref(props.mode);
    const form = reactive({
      name: "",
      subject: "",
      body: ""
    });
    const loading = ref(false);
    const error = ref("");
    const formatVariable = (variable) => {
      return `{{${variable}}}`;
    };
    watch(() => props.template, (template) => {
      if (template) {
        form.name = template.name;
        form.subject = template.subject;
        form.body = template.body;
      }
      error.value = "";
      mode.value = props.mode;
    }, { immediate: true });
    watch(() => props.mode, (newMode) => {
      mode.value = newMode;
    });
    const previewBody = computed(() => {
      let preview = form.body || props.template.body;
      props.template.variables.forEach((variable) => {
        const sampleData = {
          first_name: "สมชาย",
          last_name: "ใจดี",
          email: "example@email.com",
          student_name: "สมชาย ใจดี",
          course_name: "คณิตศาสตร์ ม.3",
          enrollment_date: "1 มกราคม 2567",
          reset_link: "https://example.com/reset-password"
        };
        const regex = new RegExp(`{{\\s*${variable}\\s*}}`, "g");
        preview = preview.replace(regex, sampleData[variable] || `[${variable}]`);
      });
      return preview;
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.show) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" }, _attrs))}><div class="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"><div class="flex items-center justify-between mb-6"><h2 class="text-2xl font-bold">${ssrInterpolate(unref(mode) === "view" ? "ดูเทมเพลต" : "แก้ไขเทมเพลต")}</h2><button class="text-gray-400 hover:text-gray-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>`);
        if (unref(mode) === "view") {
          _push(`<div><div class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-2">ชื่อเทมเพลต</label><div class="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">${ssrInterpolate(__props.template.name)}</div></div><div><label class="block text-sm font-medium text-gray-700 mb-2">รหัส</label><div class="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">${ssrInterpolate(__props.template.code)}</div></div><div><label class="block text-sm font-medium text-gray-700 mb-2">หัวเรื่อง</label><div class="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">${ssrInterpolate(__props.template.subject)}</div></div><div><label class="block text-sm font-medium text-gray-700 mb-2">ตัวแปรที่ใช้ได้</label><div class="flex flex-wrap gap-2"><!--[-->`);
          ssrRenderList(__props.template.variables, (variable) => {
            _push(`<span class="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded">${ssrInterpolate(formatVariable(variable))}</span>`);
          });
          _push(`<!--]--></div></div><div><label class="block text-sm font-medium text-gray-700 mb-2">เนื้อหา (HTML)</label><div class="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg min-h-[200px] overflow-auto"><div>${__props.template.body ?? ""}</div></div></div><div><label class="block text-sm font-medium text-gray-700 mb-2">ตัวอย่างการแสดงผล</label><div class="px-4 py-3 bg-white border-2 border-gray-300 rounded-lg min-h-[200px]"><div>${unref(previewBody) ?? ""}</div></div></div></div><div class="flex justify-end space-x-3 pt-6 mt-6 border-t"><button type="button" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"> ปิด </button><button type="button" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"> แก้ไข </button></div></div>`);
        } else {
          _push(`<form class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-2"> ชื่อเทมเพลต <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).name)} type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2">รหัส</label><input${ssrRenderAttr("value", __props.template.code)} type="text" disabled class="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> หัวเรื่อง <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).subject)} type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> เนื้อหา (HTML) <span class="text-red-500">*</span></label><textarea rows="10" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm"${ssrRenderAttr("placeholder", placeholderExample)}>${ssrInterpolate(unref(form).body)}</textarea><p class="mt-1 text-xs text-gray-500">ใช้ตัวแปรในรูปแบบ {{variable_name}}</p></div><div><label class="block text-sm font-medium text-gray-700 mb-2">ตัวอย่างการแสดงผล</label><div class="px-4 py-3 bg-white border-2 border-gray-300 rounded-lg min-h-[200px]"><div>${unref(previewBody) ?? ""}</div></div></div>`);
          if (unref(error)) {
            _push(`<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">${ssrInterpolate(unref(error))}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="flex justify-end space-x-3 pt-4"><button type="button" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"> ยกเลิก </button><button type="submit"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">`);
          if (unref(loading)) {
            _push(`<span>กำลังบันทึก...</span>`);
          } else {
            _push(`<span>บันทึก</span>`);
          }
          _push(`</button></div></form>`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/settings/email/components/TemplateModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=TemplateModal-GRTNwPnN.mjs.map
