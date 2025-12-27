import { defineComponent, ref, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrRenderComponent } from 'vue/server-renderer';
import _sfc_main$1 from './PaymentMethodModal-BnfeOhC_.mjs';
import _sfc_main$2 from './PaymentMethodDetailModal-BI2Ymto6.mjs';
import { u as useAuth, f as useConfirm } from './server.mjs';
import './PaymentMethodBasicInfo-DluNVwrX.mjs';
import './BankAccountsSection-DvbJydEj.mjs';
import './BankAccountModal-TDo4EpJK.mjs';
import './GatewayConfigSection-DQwVCOTd.mjs';
import './StripeConfig-8Ff2Qb4D.mjs';
import './KsherConfig-CzUwN_np.mjs';
import './GenericGatewayConfig-CywwJcQF.mjs';
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
import 'util';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { accessToken } = useAuth();
    useConfirm();
    const loading = ref(false);
    const error = ref(null);
    const paymentMethods = ref([]);
    const showCreateModal = ref(false);
    const showDetailModal = ref(false);
    const editingMethod = ref(null);
    const selectedMethod = ref(null);
    const loadPaymentMethods = async () => {
      try {
        loading.value = true;
        error.value = null;
        const response = await $fetch(
          "/api/admin/settings/payment-methods",
          {
            headers: {
              Authorization: `Bearer ${accessToken.value}`
            }
          }
        );
        if (response.success) {
          paymentMethods.value = response.data;
        } else {
          error.value = "ไม่สามารถโหลดวิธีการชำระเงินได้";
        }
      } catch (err) {
        console.error("Error loading payment methods:", err);
        error.value = err.data?.message || "เกิดข้อผิดพลาดในการโหลดวิธีการชำระเงิน";
      } finally {
        loading.value = false;
      }
    };
    const closeDetailModal = () => {
      selectedMethod.value = null;
      showDetailModal.value = false;
    };
    const closeModal = () => {
      editingMethod.value = null;
      showCreateModal.value = false;
    };
    const handleSaved = () => {
      closeModal();
      closeDetailModal();
      loadPaymentMethods();
    };
    const getTypeName = (type) => {
      const types = {
        bank_transfer: "โอนเงินผ่านธนาคาร",
        payment_gateway: "Payment Gateway",
        other: "อื่นๆ"
      };
      return types[type] || type;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="flex items-center justify-between mb-6"><div><h1 class="text-3xl font-bold">จัดการวิธีการชำระเงิน</h1><p class="mt-2 text-gray-600">เพิ่ม แก้ไข และจัดการวิธีการชำระเงิน</p></div><button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg><span>เพิ่มวิธีชำระเงิน</span></button></div><div class="bg-white rounded-lg shadow overflow-hidden">`);
      if (unref(loading)) {
        _push(`<div class="p-8 text-center"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div><p class="mt-2 text-gray-600">กำลังโหลด...</p></div>`);
      } else if (unref(error)) {
        _push(`<div class="p-4 bg-red-50 border border-red-200 text-red-700 rounded">${ssrInterpolate(unref(error))}</div>`);
      } else if (unref(paymentMethods).length === 0) {
        _push(`<div class="p-8 text-center text-gray-500"> ไม่พบวิธีชำระเงิน </div>`);
      } else {
        _push(`<table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รหัส</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ประเภท</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ค่าเริ่มต้น</th><th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th></tr></thead><tbody class="bg-white divide-y divide-gray-200"><!--[-->`);
        ssrRenderList(unref(paymentMethods), (method) => {
          _push(`<tr class="hover:bg-gray-50"><td class="px-6 py-4 whitespace-nowrap"><div class="text-sm font-medium text-gray-900">${ssrInterpolate(method.code)}</div></td><td class="px-6 py-4 whitespace-nowrap"><div class="text-sm font-medium text-gray-900">${ssrInterpolate(method.name)}</div>`);
          if (method.description) {
            _push(`<div class="text-sm text-gray-500">${ssrInterpolate(method.description)}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</td><td class="px-6 py-4 whitespace-nowrap"><span class="${ssrRenderClass([{
            "bg-blue-100 text-blue-800": method.type === "bank_transfer",
            "bg-purple-100 text-purple-800": method.type === "payment_gateway",
            "bg-gray-100 text-gray-800": method.type === "other"
          }, "px-2 py-1 text-xs font-medium rounded"])}">${ssrInterpolate(getTypeName(method.type))}</span></td><td class="px-6 py-4 whitespace-nowrap"><span class="${ssrRenderClass([method.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800", "px-2 py-1 text-xs font-medium rounded"])}">${ssrInterpolate(method.is_active ? "ใช้งาน" : "ปิดใช้งาน")}</span></td><td class="px-6 py-4 whitespace-nowrap">`);
          if (method.is_default) {
            _push(`<span class="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded"> ค่าเริ่มต้น </span>`);
          } else {
            _push(`<span class="text-gray-400">-</span>`);
          }
          _push(`</td><td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><div class="flex items-center justify-end space-x-2"><button class="text-green-600 hover:text-green-900" title="รายละเอียด/จัดการ"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg></button><button class="text-blue-600 hover:text-blue-900"${ssrRenderAttr("title", method.is_active ? "ปิดใช้งาน" : "เปิดใช้งาน")}>`);
          if (method.is_active) {
            _push(`<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>`);
          } else {
            _push(`<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`);
          }
          _push(`</button>`);
          if (!method.is_default) {
            _push(`<button class="text-red-600 hover:text-red-900" title="ลบ"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></td></tr>`);
        });
        _push(`<!--]--></tbody></table>`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_sfc_main$1, {
        show: unref(showCreateModal),
        method: unref(editingMethod),
        onClose: closeModal,
        onSaved: handleSaved
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$2, {
        show: unref(showDetailModal),
        method: unref(selectedMethod),
        onClose: closeDetailModal,
        onSaved: handleSaved
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/settings/payment-methods/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-6MOfGLUy.mjs.map
