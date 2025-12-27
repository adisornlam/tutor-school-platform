import { _ as __nuxt_component_0 } from './nuxt-link-CODr8WH9.mjs';
import { defineComponent, ref, reactive, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
import { formatDistanceToNow } from 'date-fns';
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
import 'object-assign';
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
    const rooms = ref([]);
    const courses = ref([]);
    const loading = ref(false);
    const error = ref("");
    const searchQuery = ref("");
    const filters = reactive({
      status: "",
      courseId: null
    });
    const pagination = reactive({
      page: 1,
      limit: 50,
      total: 0,
      totalPages: 0,
      offset: 0
    });
    const getStatusText = (status) => {
      const statusMap = {
        active: "เปิดใช้งาน",
        archived: "เก็บถาวร",
        closed: "ปิด"
      };
      return statusMap[status] || status;
    };
    const formatDate = (dateString) => {
      if (!dateString) return "-";
      try {
        return formatDistanceToNow(new Date(dateString), {
          addSuffix: true,
          locale: th
        });
      } catch {
        return dateString;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="flex items-center justify-between mb-6"><h1 class="text-3xl font-bold">จัดการแชท</h1></div><div class="bg-white rounded-lg shadow p-4 mb-6"><div class="grid grid-cols-1 md:grid-cols-4 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2">สถานะ</label><select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "") : ssrLooseEqual(unref(filters).status, "")) ? " selected" : ""}>ทั้งหมด</option><option value="active"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "active") : ssrLooseEqual(unref(filters).status, "active")) ? " selected" : ""}>เปิดใช้งาน</option><option value="archived"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "archived") : ssrLooseEqual(unref(filters).status, "archived")) ? " selected" : ""}>เก็บถาวร</option><option value="closed"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "closed") : ssrLooseEqual(unref(filters).status, "closed")) ? " selected" : ""}>ปิด</option></select></div><div><label class="block text-sm font-medium text-gray-700 mb-2">ค้นหา (ชื่อผู้เรียน/อาจารย์)</label><input${ssrRenderAttr("value", unref(searchQuery))} type="text" placeholder="ค้นหา..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2">คอร์ส</label><select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option${ssrRenderAttr("value", null)}${ssrIncludeBooleanAttr(Array.isArray(unref(filters).courseId) ? ssrLooseContain(unref(filters).courseId, null) : ssrLooseEqual(unref(filters).courseId, null)) ? " selected" : ""}>ทั้งหมด</option><!--[-->`);
      ssrRenderList(unref(courses), (course) => {
        _push(`<option${ssrRenderAttr("value", course.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(filters).courseId) ? ssrLooseContain(unref(filters).courseId, course.id) : ssrLooseEqual(unref(filters).courseId, course.id)) ? " selected" : ""}>${ssrInterpolate(course.title)}</option>`);
      });
      _push(`<!--]--></select></div><div class="flex items-end"><button class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"> ค้นหา </button></div></div></div><div class="bg-white rounded-lg shadow overflow-hidden">`);
      if (unref(loading)) {
        _push(`<div class="p-8 text-center text-gray-500"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div><p class="mt-2">กำลังโหลด...</p></div>`);
      } else if (unref(error)) {
        _push(`<div class="p-4 bg-red-50 border border-red-200 text-red-700 rounded">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<div><table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> ห้องแชท </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> ผู้เรียน </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> อาจารย์ </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> คอร์ส </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> สถานะ </th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> อัพเดตล่าสุด </th><th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"> การจัดการ </th></tr></thead><tbody class="bg-white divide-y divide-gray-200"><!--[-->`);
        ssrRenderList(unref(rooms), (room) => {
          _push(`<tr class="hover:bg-gray-50"><td class="px-6 py-4 whitespace-nowrap"><div class="text-sm font-medium text-gray-900"> #${ssrInterpolate(room.id)}</div></td><td class="px-6 py-4 whitespace-nowrap"><div class="text-sm text-gray-900">${ssrInterpolate(room.student?.first_name)} ${ssrInterpolate(room.student?.last_name)}</div></td><td class="px-6 py-4 whitespace-nowrap"><div class="text-sm text-gray-900">${ssrInterpolate(room.tutor?.first_name)} ${ssrInterpolate(room.tutor?.last_name)}</div></td><td class="px-6 py-4"><div class="text-sm text-gray-900">${ssrInterpolate(room.course?.title)}</div><div class="text-xs text-gray-500">${ssrInterpolate(room.course?.code)}</div></td><td class="px-6 py-4 whitespace-nowrap"><span class="${ssrRenderClass([
            "px-2 py-1 text-xs font-semibold rounded-full",
            room.status === "active" ? "bg-green-100 text-green-800" : room.status === "archived" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"
          ])}">${ssrInterpolate(getStatusText(room.status))}</span></td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${ssrInterpolate(formatDate(room.last_message_at || room.updated_at))}</td><td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/admin/chat/${room.id}`,
            class: "text-green-600 hover:text-green-900"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` ดูแชท `);
              } else {
                return [
                  createTextVNode(" ดูแชท ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</td></tr>`);
        });
        _push(`<!--]--></tbody></table>`);
        if (unref(pagination).totalPages > 1) {
          _push(`<div class="px-6 py-4 border-t flex items-center justify-between"><div class="text-sm text-gray-700"> แสดง ${ssrInterpolate((unref(pagination).offset || 0) + 1)} - ${ssrInterpolate(Math.min((unref(pagination).offset || 0) + (unref(pagination).limit || 50), unref(pagination).total))} จาก ${ssrInterpolate(unref(pagination).total)}</div><div class="flex space-x-2"><button${ssrIncludeBooleanAttr(unref(pagination).page <= 1) ? " disabled" : ""} class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"> ก่อนหน้า </button><button${ssrIncludeBooleanAttr(unref(pagination).page >= unref(pagination).totalPages) ? " disabled" : ""} class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"> ถัดไป </button></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/chat/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-9b65BEUu.mjs.map
