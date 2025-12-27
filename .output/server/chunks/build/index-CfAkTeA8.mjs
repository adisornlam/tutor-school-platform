import { _ as __nuxt_component_0 } from './nuxt-link-CODr8WH9.mjs';
import { defineComponent, ref, reactive, unref, withCtx, createBlock, openBlock, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useAuth();
    const students = ref([]);
    const loading = ref(false);
    const error = ref("");
    const selectedStudent = ref(null);
    const studentDetail = ref(null);
    const loadingDetail = ref(false);
    const filters = reactive({
      search: "",
      status: ""
    });
    const pagination = reactive({
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0
    });
    const getStatusDisplayName = (status) => {
      const statusNames = {
        active: "ใช้งาน",
        inactive: "ปิดใช้งาน",
        suspended: "ระงับ"
      };
      return statusNames[status] || status;
    };
    const getStatusBadgeClass = (status) => {
      const classes = {
        active: "bg-green-100 text-green-800",
        inactive: "bg-gray-100 text-gray-800",
        suspended: "bg-red-100 text-red-800"
      };
      return classes[status] || "bg-gray-100 text-gray-800";
    };
    const getRelationshipName = (relationship) => {
      const relationshipNames = {
        father: "บิดา",
        mother: "มารดา",
        guardian: "ผู้ปกครอง"
      };
      return relationshipNames[relationship] || relationship;
    };
    const formatDate = (date) => {
      return format(new Date(date), "dd MMM yyyy", { locale: th });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="flex items-center justify-between mb-6"><h1 class="text-3xl font-bold">นักเรียน</h1></div><div class="bg-white rounded-lg shadow p-4 mb-6"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2">ค้นหา</label><input${ssrRenderAttr("value", unref(filters).search)} type="text" placeholder="ค้นหาด้วย username, email, ชื่อ" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2">สถานะ</label><select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "") : ssrLooseEqual(unref(filters).status, "")) ? " selected" : ""}>ทั้งหมด</option><option value="active"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "active") : ssrLooseEqual(unref(filters).status, "active")) ? " selected" : ""}>ใช้งาน</option><option value="inactive"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "inactive") : ssrLooseEqual(unref(filters).status, "inactive")) ? " selected" : ""}>ปิดใช้งาน</option><option value="suspended"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "suspended") : ssrLooseEqual(unref(filters).status, "suspended")) ? " selected" : ""}>ระงับ</option></select></div></div></div><div class="bg-white rounded-lg shadow overflow-hidden">`);
      if (unref(loading)) {
        _push(`<div class="p-8 text-center"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div><p class="mt-2 text-gray-600">กำลังโหลด...</p></div>`);
      } else if (unref(error)) {
        _push(`<div class="p-4 bg-red-50 border border-red-200 text-red-700 rounded">${ssrInterpolate(unref(error))}</div>`);
      } else if (unref(students).length === 0) {
        _push(`<div class="p-8 text-center text-gray-500"> ไม่พบนักเรียน </div>`);
      } else {
        _push(`<table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">นักเรียน</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ผู้ปกครอง</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่สร้าง</th><th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th></tr></thead><tbody class="bg-white divide-y divide-gray-200"><!--[-->`);
        ssrRenderList(unref(students), (student) => {
          _push(`<tr class="hover:bg-gray-50"><td class="px-6 py-4 whitespace-nowrap"><div><div class="text-sm font-medium text-gray-900">${ssrInterpolate(student.first_name)} ${ssrInterpolate(student.last_name)}</div><div class="text-sm text-gray-500">${ssrInterpolate(student.username)}</div>`);
          if (student.email) {
            _push(`<div class="text-xs text-gray-400">${ssrInterpolate(student.email)}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></td><td class="px-6 py-4">`);
          if (student.parents && student.parents.length > 0) {
            _push(`<div class="space-y-1"><!--[-->`);
            ssrRenderList(student.parents, (parent) => {
              _push(`<div class="text-sm"><span class="font-medium text-gray-900">${ssrInterpolate(parent.name)}</span><span class="text-gray-500 ml-2">(${ssrInterpolate(getRelationshipName(parent.relationship))})</span></div>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<div class="text-sm text-gray-400">ไม่มีผู้ปกครอง</div>`);
          }
          _push(`</td><td class="px-6 py-4 whitespace-nowrap"><span class="${ssrRenderClass([getStatusBadgeClass(student.status), "px-2 py-1 text-xs font-medium rounded"])}">${ssrInterpolate(getStatusDisplayName(student.status))}</span></td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${ssrInterpolate(formatDate(student.created_at))}</td><td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><div class="flex items-center justify-end space-x-2">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/admin/tutor/students/${student.id}`,
            class: "text-blue-600 hover:text-blue-900",
            title: "ดูรายละเอียด"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"${_scopeId}></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"${_scopeId}></path></svg>`);
              } else {
                return [
                  (openBlock(), createBlock("svg", {
                    class: "w-5 h-5",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    }),
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    })
                  ]))
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></td></tr>`);
        });
        _push(`<!--]--></tbody></table>`);
      }
      if (unref(pagination).totalPages > 1) {
        _push(`<div class="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200"><div class="text-sm text-gray-700"> แสดง ${ssrInterpolate((unref(pagination).page - 1) * unref(pagination).limit + 1)} ถึง ${ssrInterpolate(Math.min(unref(pagination).page * unref(pagination).limit, unref(pagination).total))} จาก ${ssrInterpolate(unref(pagination).total)} รายการ </div><div class="flex space-x-2"><button${ssrIncludeBooleanAttr(unref(pagination).page === 1) ? " disabled" : ""} class="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"> ก่อนหน้า </button><button${ssrIncludeBooleanAttr(unref(pagination).page >= unref(pagination).totalPages) ? " disabled" : ""} class="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"> ถัดไป </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(selectedStudent)) {
        _push(`<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div class="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"><div class="flex items-center justify-between mb-6"><h2 class="text-2xl font-bold">รายละเอียดนักเรียน</h2><button class="text-gray-400 hover:text-gray-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>`);
        if (unref(loadingDetail)) {
          _push(`<div class="text-center py-8"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div><p class="mt-2 text-gray-600">กำลังโหลด...</p></div>`);
        } else if (unref(studentDetail)) {
          _push(`<div class="space-y-6"><div class="bg-gray-50 rounded-lg p-4"><h3 class="text-lg font-semibold mb-4">ข้อมูลนักเรียน</h3><div class="grid grid-cols-2 gap-4"><div><label class="text-sm font-medium text-gray-500">ชื่อ-นามสกุล</label><p class="text-gray-900">${ssrInterpolate(unref(studentDetail).student.first_name)} ${ssrInterpolate(unref(studentDetail).student.last_name)}</p></div><div><label class="text-sm font-medium text-gray-500">Username</label><p class="text-gray-900">${ssrInterpolate(unref(studentDetail).student.username)}</p></div><div><label class="text-sm font-medium text-gray-500">Email</label><p class="text-gray-900">${ssrInterpolate(unref(studentDetail).student.email || "-")}</p></div><div><label class="text-sm font-medium text-gray-500">เบอร์โทรศัพท์</label><p class="text-gray-900">${ssrInterpolate(unref(studentDetail).student.phone || "-")}</p></div><div><label class="text-sm font-medium text-gray-500">สถานะ</label><span class="${ssrRenderClass([getStatusBadgeClass(unref(studentDetail).student.status), "px-2 py-1 text-xs font-medium rounded"])}">${ssrInterpolate(getStatusDisplayName(unref(studentDetail).student.status))}</span></div></div></div><div class="bg-gray-50 rounded-lg p-4"><h3 class="text-lg font-semibold mb-4">ผู้ปกครอง</h3>`);
          if (unref(studentDetail).parents && unref(studentDetail).parents.length > 0) {
            _push(`<div class="space-y-3"><!--[-->`);
            ssrRenderList(unref(studentDetail).parents, (parent) => {
              _push(`<div class="bg-white rounded-lg p-4 border border-gray-200"><div class="grid grid-cols-2 gap-4"><div><label class="text-sm font-medium text-gray-500">ชื่อ-นามสกุล</label><p class="text-gray-900">${ssrInterpolate(parent.first_name)} ${ssrInterpolate(parent.last_name)}</p></div><div><label class="text-sm font-medium text-gray-500">ความสัมพันธ์</label><p class="text-gray-900">${ssrInterpolate(getRelationshipName(parent.relationship))}</p></div><div><label class="text-sm font-medium text-gray-500">Email</label><p class="text-gray-900">${ssrInterpolate(parent.email || "-")}</p></div><div><label class="text-sm font-medium text-gray-500">เบอร์โทรศัพท์</label><p class="text-gray-900">${ssrInterpolate(parent.phone || "-")}</p></div></div></div>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<div class="text-gray-500 text-center py-4"> ไม่มีข้อมูลผู้ปกครอง </div>`);
          }
          _push(`</div><div class="bg-gray-50 rounded-lg p-4"><h3 class="text-lg font-semibold mb-4">คอร์สที่ลงทะเบียน</h3>`);
          if (unref(studentDetail).enrollments && unref(studentDetail).enrollments.length > 0) {
            _push(`<div class="space-y-2"><!--[-->`);
            ssrRenderList(unref(studentDetail).enrollments, (enrollment) => {
              _push(`<div class="bg-white rounded-lg p-3 border border-gray-200"><div class="flex items-center justify-between"><div><p class="font-medium text-gray-900">${ssrInterpolate(enrollment.course.title)}</p><p class="text-sm text-gray-500">${ssrInterpolate(enrollment.branch.name)} - ${ssrInterpolate(enrollment.course.code)}</p></div><div class="text-right"><span class="${ssrRenderClass([enrollment.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800", "px-2 py-1 text-xs font-medium rounded"])}">${ssrInterpolate(enrollment.status === "active" ? "ใช้งาน" : enrollment.status)}</span><p class="text-xs text-gray-500 mt-1">${ssrInterpolate(formatDate(enrollment.enrolled_at))}</p></div></div></div>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<div class="text-gray-500 text-center py-4"> ยังไม่ได้ลงทะเบียนคอร์สใดๆ </div>`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex justify-end mt-6"><button class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"> ปิด </button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/tutor/students/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CfAkTeA8.mjs.map
