import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrRenderComponent } from 'vue/server-renderer';
import _sfc_main$1 from './BankAccountModal-TDo4EpJK.mjs';
import { u as useAuth, f as useConfirm } from './server.mjs';
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
  __name: "BankAccountsSection",
  __ssrInlineRender: true,
  props: {
    paymentMethodId: {}
  },
  emits: ["saved"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { accessToken } = useAuth();
    useConfirm();
    const loading = ref(false);
    const error = ref(null);
    const accounts = ref([]);
    const showCreateModal = ref(false);
    const editingAccount = ref(null);
    const loadAccounts = async () => {
      try {
        loading.value = true;
        error.value = null;
        const response = await $fetch(
          `/api/admin/settings/payment-methods/${props.paymentMethodId}/bank-accounts`,
          {
            headers: {
              Authorization: `Bearer ${accessToken.value}`
            }
          }
        );
        if (response.success) {
          accounts.value = response.data;
        } else {
          error.value = "ไม่สามารถโหลดบัญชีธนาคารได้";
        }
      } catch (err) {
        console.error("Error loading bank accounts:", err);
        error.value = err.data?.message || "เกิดข้อผิดพลาดในการโหลดบัญชีธนาคาร";
      } finally {
        loading.value = false;
      }
    };
    const closeModal = () => {
      editingAccount.value = null;
      showCreateModal.value = false;
    };
    const handleSaved = () => {
      closeModal();
      loadAccounts();
      emit("saved");
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex items-center justify-between"><h3 class="text-lg font-semibold">บัญชีธนาคาร</h3><button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"> เพิ่มบัญชีธนาคาร </button></div>`);
      if (unref(loading)) {
        _push(`<div class="text-center py-8"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div><p class="mt-2 text-gray-600">กำลังโหลด...</p></div>`);
      } else if (unref(error)) {
        _push(`<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">${ssrInterpolate(unref(error))}</div>`);
      } else if (unref(accounts).length === 0) {
        _push(`<div class="text-center py-8 text-gray-500"> ยังไม่มีบัญชีธนาคาร </div>`);
      } else {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-4"><!--[-->`);
        ssrRenderList(unref(accounts), (account) => {
          _push(`<div class="${ssrRenderClass([{ "border-green-500 bg-green-50": account.is_default }, "border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"])}"><div class="flex items-start justify-between"><div class="flex-1"><div class="flex items-center gap-2 mb-2"><h4 class="font-semibold text-lg">${ssrInterpolate(account.bank_name)}</h4>`);
          if (account.is_default) {
            _push(`<span class="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded"> ค่าเริ่มต้น </span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="text-sm text-gray-600 space-y-1"><p><span class="font-medium">ชื่อบัญชี:</span> ${ssrInterpolate(account.account_name)}</p><p><span class="font-medium">เลขบัญชี:</span> ${ssrInterpolate(account.account_number)}</p>`);
          if (account.branch_name) {
            _push(`<p><span class="font-medium">สาขา:</span> ${ssrInterpolate(account.branch_name)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<p><span class="font-medium">ประเภท:</span> ${ssrInterpolate(account.account_type === "savings" ? "ออมทรัพย์" : "กระแสรายวัน")}</p></div>`);
          if (account.qr_code_url) {
            _push(`<div class="mt-3"><img${ssrRenderAttr("src", account.qr_code_url)} alt="QR Code" class="w-32 h-32 object-contain border border-gray-200 rounded"></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="flex flex-col gap-2 ml-4"><button class="text-blue-600 hover:text-blue-900" title="แก้ไข"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>`);
          if (!account.is_default) {
            _push(`<button class="text-red-600 hover:text-red-900" title="ลบ"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(ssrRenderComponent(_sfc_main$1, {
        show: unref(showCreateModal) || !!unref(editingAccount),
        account: unref(editingAccount),
        "payment-method-id": __props.paymentMethodId,
        onClose: closeModal,
        onSaved: handleSaved
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/settings/payment-methods/components/BankAccountsSection.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=BankAccountsSection-DvbJydEj.mjs.map
