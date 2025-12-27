import { defineComponent, ref, reactive, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BankAccountModal",
  __ssrInlineRender: true,
  props: {
    show: { type: Boolean },
    account: { default: null },
    paymentMethodId: {}
  },
  emits: ["close", "saved"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    useAuth();
    const loading = ref(false);
    const error = ref("");
    const form = reactive({
      bank_name: "",
      account_name: "",
      account_number: "",
      account_type: "savings",
      branch_name: "",
      qr_code_url: "",
      is_active: true,
      is_default: false,
      display_order: 0
    });
    watch(() => props.account, (account) => {
      if (account) {
        form.bank_name = account.bank_name || "";
        form.account_name = account.account_name || "";
        form.account_number = account.account_number || "";
        form.account_type = account.account_type || "savings";
        form.branch_name = account.branch_name || "";
        form.qr_code_url = account.qr_code_url || "";
        form.is_active = account.is_active !== void 0 ? account.is_active : true;
        form.is_default = account.is_default !== void 0 ? account.is_default : false;
        form.display_order = account.display_order || 0;
      } else {
        form.bank_name = "";
        form.account_name = "";
        form.account_number = "";
        form.account_type = "savings";
        form.branch_name = "";
        form.qr_code_url = "";
        form.is_active = true;
        form.is_default = false;
        form.display_order = 0;
      }
      error.value = "";
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.show) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" }, _attrs))}><div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"><div class="flex items-center justify-between mb-6"><h2 class="text-2xl font-bold">${ssrInterpolate(__props.account ? "แก้ไขบัญชีธนาคาร" : "เพิ่มบัญชีธนาคาร")}</h2><button class="text-gray-400 hover:text-gray-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><form class="space-y-4"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2"> ชื่อธนาคาร <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).bank_name)} type="text" required placeholder="ธนาคารกรุงเทพ" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> ชื่อบัญชี <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).account_name)} type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> เลขบัญชี <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).account_number)} type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> ประเภทบัญชี </label><select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value="savings"${ssrIncludeBooleanAttr(Array.isArray(unref(form).account_type) ? ssrLooseContain(unref(form).account_type, "savings") : ssrLooseEqual(unref(form).account_type, "savings")) ? " selected" : ""}>ออมทรัพย์</option><option value="current"${ssrIncludeBooleanAttr(Array.isArray(unref(form).account_type) ? ssrLooseContain(unref(form).account_type, "current") : ssrLooseEqual(unref(form).account_type, "current")) ? " selected" : ""}>กระแสรายวัน</option></select></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> สาขา </label><input${ssrRenderAttr("value", unref(form).branch_name)} type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> QR Code URL </label><input${ssrRenderAttr("value", unref(form).qr_code_url)} type="url" placeholder="https://example.com/qr-code.png" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> ลำดับการแสดงผล </label><input${ssrRenderAttr("value", unref(form).display_order)} type="number" min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div class="md:col-span-2 flex items-center space-x-4"><label class="flex items-center"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).is_active) ? ssrLooseContain(unref(form).is_active, null) : unref(form).is_active) ? " checked" : ""} type="checkbox" class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"><span class="ml-2 text-sm text-gray-700">เปิดใช้งาน</span></label><label class="flex items-center"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).is_default) ? ssrLooseContain(unref(form).is_default, null) : unref(form).is_default) ? " checked" : ""} type="checkbox" class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"><span class="ml-2 text-sm text-gray-700">ตั้งเป็นค่าเริ่มต้น</span></label></div></div>`);
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
        _push(`</button></div></form></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/settings/payment-methods/components/BankAccountModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=BankAccountModal-TDo4EpJK.mjs.map
