import { _ as __nuxt_component_0 } from './nuxt-link-CODr8WH9.mjs';
import { defineComponent, computed, ref, unref, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { a as useRoute, b as useRouter, u as useAuth } from './server.mjs';
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
import 'jwa';
import 'ms';
import 'semver';
import 'lodash.includes';
import 'lodash.isboolean';
import 'lodash.isinteger';
import 'lodash.isnumber';
import 'lodash.isplainobject';
import 'lodash.isstring';
import 'lodash.once';
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
    const route = useRoute();
    useRouter();
    const { user } = useAuth();
    computed(() => parseInt(route.params.id));
    const loading = ref(true);
    const error = ref("");
    const enrollmentDetail = ref(null);
    const canEdit = computed(() => {
      if (!user.value || !user.value.roles) return false;
      const allowedRoles = ["system_admin", "owner", "admin", "branch_admin"];
      return user.value.roles.some((role) => allowedRoles.includes(role));
    });
    const getStatusName = (status) => {
      const statusNames = {
        pending: "รอการยืนยัน",
        active: "กำลังเรียน",
        completed: "เรียนจบ",
        cancelled: "ยกเลิก"
      };
      return statusNames[status] || status;
    };
    const getStatusBadgeClass = (status) => {
      const classes = {
        pending: "bg-yellow-100 text-yellow-800",
        active: "bg-green-100 text-green-800",
        completed: "bg-blue-100 text-blue-800",
        cancelled: "bg-red-100 text-red-800"
      };
      return classes[status] || "bg-gray-100 text-gray-800";
    };
    const getTypeName = (type) => {
      const typeNames = {
        live_online: "Live Online",
        vod: "VOD",
        hybrid: "Hybrid"
      };
      return typeNames[type] || type;
    };
    const getTypeBadgeClass = (type) => {
      const classes = {
        live_online: "bg-blue-100 text-blue-800",
        vod: "bg-purple-100 text-purple-800",
        hybrid: "bg-indigo-100 text-indigo-800"
      };
      return classes[type] || "bg-gray-100 text-gray-800";
    };
    const getLevelName = (level) => {
      const levelNames = {
        beginner: "เริ่มต้น",
        intermediate: "กลาง",
        advanced: "สูง"
      };
      return levelNames[level] || level;
    };
    const getPaymentStatusName = (status) => {
      const statusNames = {
        pending: "รอการชำระ",
        paid: "ชำระแล้ว",
        failed: "ชำระไม่สำเร็จ",
        refunded: "คืนเงินแล้ว"
      };
      return statusNames[status] || status;
    };
    const getPaymentStatusBadgeClass = (status) => {
      const classes = {
        pending: "bg-yellow-100 text-yellow-800",
        paid: "bg-green-100 text-green-800",
        failed: "bg-red-100 text-red-800",
        refunded: "bg-gray-100 text-gray-800"
      };
      return classes[status] || "bg-gray-100 text-gray-800";
    };
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("th-TH", {
        style: "currency",
        currency: "THB"
      }).format(amount);
    };
    const formatDate = (date) => {
      return format(new Date(date), "dd MMM yyyy HH:mm", { locale: th });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="flex items-center justify-between mb-6"><div class="flex items-center space-x-4"><button class="p-2 hover:bg-gray-100 rounded-lg"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg></button><h1 class="text-3xl font-bold">รายละเอียดการลงทะเบียน</h1></div><div class="flex items-center space-x-3">`);
      if (unref(canEdit)) {
        _push(`<button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg><span>แก้ไข</span></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      if (unref(loading)) {
        _push(`<div class="text-center py-12"><div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div><p class="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p></div>`);
      } else if (unref(error)) {
        _push(`<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">${ssrInterpolate(unref(error))}</div>`);
      } else if (unref(enrollmentDetail)) {
        _push(`<div class="space-y-6"><div class="bg-white rounded-lg shadow p-6"><div class="flex items-center justify-between mb-4"><h2 class="text-xl font-semibold">สถานะการลงทะเบียน</h2><span class="${ssrRenderClass([getStatusBadgeClass(unref(enrollmentDetail).enrollment.status), "px-3 py-1 text-sm font-medium rounded"])}">${ssrInterpolate(getStatusName(unref(enrollmentDetail).enrollment.status))}</span></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-500 mb-1">ประเภทการเรียน</label><span class="${ssrRenderClass([unref(enrollmentDetail).enrollment.enrollment_type === "online" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800", "px-2 py-1 text-xs font-medium rounded"])}">${ssrInterpolate(unref(enrollmentDetail).enrollment.enrollment_type === "online" ? "เรียนออนไลน์" : "เรียนสด")}</span></div><div><label class="block text-sm font-medium text-gray-500 mb-1">วันที่ลงทะเบียน</label><p class="text-gray-900">${ssrInterpolate(formatDate(unref(enrollmentDetail).enrollment.enrollment_date || unref(enrollmentDetail).enrollment.created_at))}</p></div><div><label class="block text-sm font-medium text-gray-500 mb-1">อัปเดตล่าสุด</label><p class="text-gray-900">${ssrInterpolate(formatDate(unref(enrollmentDetail).enrollment.updated_at))}</p></div></div></div><div class="bg-white rounded-lg shadow p-6"><h2 class="text-xl font-semibold mb-4">ข้อมูลนักเรียน</h2><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-500 mb-1">ชื่อ-นามสกุล</label><p class="text-gray-900">${ssrInterpolate(unref(enrollmentDetail).student.first_name)} ${ssrInterpolate(unref(enrollmentDetail).student.last_name)}</p></div><div><label class="block text-sm font-medium text-gray-500 mb-1">Username</label><p class="text-gray-900">@${ssrInterpolate(unref(enrollmentDetail).student.username)}</p></div><div><label class="block text-sm font-medium text-gray-500 mb-1">อีเมล</label><p class="text-gray-900">${ssrInterpolate(unref(enrollmentDetail).student.email || "-")}</p></div><div><label class="block text-sm font-medium text-gray-500 mb-1">เบอร์โทรศัพท์</label><p class="text-gray-900">${ssrInterpolate(unref(enrollmentDetail).student.phone || "-")}</p></div></div></div><div class="bg-white rounded-lg shadow p-6"><h2 class="text-xl font-semibold mb-4">ข้อมูลคอร์ส</h2><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="md:col-span-2"><label class="block text-sm font-medium text-gray-500 mb-1">ชื่อคอร์ส</label>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/admin/courses/${unref(enrollmentDetail).course.id}`,
          class: "text-green-600 hover:text-green-700"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<p class="text-lg font-medium"${_scopeId}>${ssrInterpolate(unref(enrollmentDetail).course.title)}</p>`);
            } else {
              return [
                createVNode("p", { class: "text-lg font-medium" }, toDisplayString(unref(enrollmentDetail).course.title), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div><label class="block text-sm font-medium text-gray-500 mb-1">รหัสคอร์ส</label><p class="text-gray-900">${ssrInterpolate(unref(enrollmentDetail).course.code || "-")}</p></div><div><label class="block text-sm font-medium text-gray-500 mb-1">ประเภท</label><span class="${ssrRenderClass([getTypeBadgeClass(unref(enrollmentDetail).course.type), "px-2 py-1 text-xs font-medium rounded"])}">${ssrInterpolate(getTypeName(unref(enrollmentDetail).course.type))}</span></div><div><label class="block text-sm font-medium text-gray-500 mb-1">ราคา</label><p class="text-lg font-medium text-gray-900">${ssrInterpolate(formatCurrency(unref(enrollmentDetail).course.price))}</p></div><div><label class="block text-sm font-medium text-gray-500 mb-1">ระยะเวลา</label><p class="text-gray-900">${ssrInterpolate(unref(enrollmentDetail).course.duration_hours ? `${unref(enrollmentDetail).course.duration_hours} ชั่วโมง` : "-")}</p></div><div><label class="block text-sm font-medium text-gray-500 mb-1">ระดับ</label><p class="text-gray-900">${ssrInterpolate(unref(enrollmentDetail).course.level ? getLevelName(unref(enrollmentDetail).course.level) : "-")}</p></div>`);
        if (unref(enrollmentDetail).course.description) {
          _push(`<div class="md:col-span-2"><label class="block text-sm font-medium text-gray-500 mb-1">คำอธิบาย</label><div class="text-gray-900 prose max-w-none">${unref(enrollmentDetail).course.description ?? ""}</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
        if (unref(enrollmentDetail).enrollment.enrollment_type === "onsite" && unref(enrollmentDetail).branch) {
          _push(`<div class="bg-white rounded-lg shadow p-6"><h2 class="text-xl font-semibold mb-4">ข้อมูลสาขา</h2><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-500 mb-1">ชื่อสาขา</label><p class="text-gray-900">${ssrInterpolate(unref(enrollmentDetail).branch.name)}</p></div><div><label class="block text-sm font-medium text-gray-500 mb-1">รหัสสาขา</label><p class="text-gray-900">${ssrInterpolate(unref(enrollmentDetail).branch.code || "-")}</p></div>`);
          if (unref(enrollmentDetail).branch.address) {
            _push(`<div class="md:col-span-2"><label class="block text-sm font-medium text-gray-500 mb-1">ที่อยู่</label><p class="text-gray-900">${ssrInterpolate(unref(enrollmentDetail).branch.address)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(enrollmentDetail).branch.phone) {
            _push(`<div><label class="block text-sm font-medium text-gray-500 mb-1">เบอร์โทรศัพท์</label><p class="text-gray-900">${ssrInterpolate(unref(enrollmentDetail).branch.phone)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(enrollmentDetail).branch.email) {
            _push(`<div><label class="block text-sm font-medium text-gray-500 mb-1">อีเมล</label><p class="text-gray-900">${ssrInterpolate(unref(enrollmentDetail).branch.email)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(enrollmentDetail).enrollment.enrollment_type === "online" && unref(enrollmentDetail).shipping_address) {
          _push(`<div class="bg-white rounded-lg shadow p-6"><h2 class="text-xl font-semibold mb-4">ที่อยู่จัดส่ง</h2><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-500 mb-1">ผู้รับ</label><p class="text-gray-900">${ssrInterpolate(unref(enrollmentDetail).shipping_address.recipient_name)}</p></div><div><label class="block text-sm font-medium text-gray-500 mb-1">เบอร์โทรศัพท์</label><p class="text-gray-900">${ssrInterpolate(unref(enrollmentDetail).shipping_address.phone)}</p></div><div class="md:col-span-2"><label class="block text-sm font-medium text-gray-500 mb-1">ที่อยู่</label><p class="text-gray-900">${ssrInterpolate(unref(enrollmentDetail).shipping_address.address_line1)} `);
          if (unref(enrollmentDetail).shipping_address.address_line2) {
            _push(`<span>, ${ssrInterpolate(unref(enrollmentDetail).shipping_address.address_line2)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</p><p class="text-gray-900">`);
          if (unref(enrollmentDetail).shipping_address.subdistrict) {
            _push(`<span>${ssrInterpolate(unref(enrollmentDetail).shipping_address.subdistrict)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(enrollmentDetail).shipping_address.district) {
            _push(`<span>อ.${ssrInterpolate(unref(enrollmentDetail).shipping_address.district)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(enrollmentDetail).shipping_address.province) {
            _push(`<span>จ.${ssrInterpolate(unref(enrollmentDetail).shipping_address.province)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(enrollmentDetail).shipping_address.postal_code) {
            _push(`<span>${ssrInterpolate(unref(enrollmentDetail).shipping_address.postal_code)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</p></div><div><label class="block text-sm font-medium text-gray-500 mb-1">ประเภทที่อยู่</label><p class="text-gray-900">${ssrInterpolate(unref(enrollmentDetail).shipping_address.address_type === "home" ? "บ้าน" : unref(enrollmentDetail).shipping_address.address_type === "work" ? "ที่ทำงาน" : "อื่นๆ")} `);
          if (unref(enrollmentDetail).shipping_address.is_default) {
            _push(`<span class="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">หลัก</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</p></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(enrollmentDetail).payment) {
          _push(`<div class="bg-white rounded-lg shadow p-6"><h2 class="text-xl font-semibold mb-4">ข้อมูลการชำระเงิน</h2><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-500 mb-1">จำนวนเงิน</label><p class="text-lg font-medium text-gray-900">${ssrInterpolate(formatCurrency(unref(enrollmentDetail).payment.amount))}</p></div><div><label class="block text-sm font-medium text-gray-500 mb-1">สถานะ</label><span class="${ssrRenderClass([getPaymentStatusBadgeClass(unref(enrollmentDetail).payment.status), "px-2 py-1 text-xs font-medium rounded"])}">${ssrInterpolate(getPaymentStatusName(unref(enrollmentDetail).payment.status))}</span></div>`);
          if (unref(enrollmentDetail).payment.payment_method) {
            _push(`<div><label class="block text-sm font-medium text-gray-500 mb-1">วิธีการชำระ</label><p class="text-gray-900">${ssrInterpolate(unref(enrollmentDetail).payment.payment_method)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(enrollmentDetail).payment.transaction_id) {
            _push(`<div><label class="block text-sm font-medium text-gray-500 mb-1">Transaction ID</label><p class="text-gray-900">${ssrInterpolate(unref(enrollmentDetail).payment.transaction_id)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(enrollmentDetail).payment.invoice_number) {
            _push(`<div><label class="block text-sm font-medium text-gray-500 mb-1">เลขที่ใบแจ้งหนี้</label><p class="text-gray-900">${ssrInterpolate(unref(enrollmentDetail).payment.invoice_number)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(enrollmentDetail).payment.paid_at) {
            _push(`<div><label class="block text-sm font-medium text-gray-500 mb-1">วันที่ชำระ</label><p class="text-gray-900">${ssrInterpolate(formatDate(unref(enrollmentDetail).payment.paid_at))}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/enrollments/[id]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DkMwtOCR.mjs.map
