import { E as EnrollmentModal } from './EnrollmentModal-DJ0T9o-E.mjs';
import { defineComponent, computed, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderStyle, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { a as useRoute, b as useRouter, u as useAuth } from './server.mjs';
import './AddressSelect-2oQii9w-.mjs';
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
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    useAuth();
    const courseId = computed(() => parseInt(route.params.id));
    const loading = ref(true);
    const error = ref("");
    const courseDetail = ref(null);
    const showEnrollmentModal = ref(false);
    const enrollmentType = ref("online");
    const handleEnrollmentSaved = () => {
      showEnrollmentModal.value = false;
      router.push("/my-courses");
    };
    const getTypeName = (type) => {
      const typeNames = {
        live_online: "Live Online",
        vod: "VOD",
        hybrid: "Hybrid"
      };
      return typeNames[type] || type;
    };
    const getLevelName = (level) => {
      const levelNames = {
        beginner: "เริ่มต้น",
        intermediate: "กลาง",
        advanced: "สูง"
      };
      return levelNames[level] || level;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_EnrollmentModal = EnrollmentModal;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))}>`);
      if (unref(loading)) {
        _push(`<div class="container mx-auto px-4 py-12"><div class="text-center"><div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div><p class="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p></div></div>`);
      } else if (unref(error)) {
        _push(`<div class="container mx-auto px-4 py-12"><div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">${ssrInterpolate(unref(error))}</div></div>`);
      } else if (unref(courseDetail)) {
        _push(`<div class="container mx-auto px-4 py-8"><div class="grid grid-cols-1 lg:grid-cols-3 gap-8"><div class="lg:col-span-2 space-y-6">`);
        if (unref(courseDetail).course.thumbnail_url) {
          _push(`<div class="bg-white rounded-lg shadow overflow-hidden"><img${ssrRenderAttr("src", unref(courseDetail).course.thumbnail_url)}${ssrRenderAttr("alt", unref(courseDetail).course.title)} class="w-full h-auto" style="${ssrRenderStyle({ "max-height": "500px", "object-fit": "cover" })}"></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="bg-white rounded-lg shadow p-6"><div class="mb-4"><span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">${ssrInterpolate(getTypeName(unref(courseDetail).course.type))}</span></div><h1 class="text-3xl font-bold text-gray-900 mb-4">${ssrInterpolate(unref(courseDetail).course.title)}</h1>`);
        if (unref(courseDetail).course.description) {
          _push(`<div class="prose max-w-none mb-6">${unref(courseDetail).course.description ?? ""}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t"><div><p class="text-sm text-gray-500 mb-1">ระยะเวลา</p><p class="font-semibold">${ssrInterpolate(unref(courseDetail).course.duration_hours ? `${unref(courseDetail).course.duration_hours} ชั่วโมง` : "-")}</p></div><div><p class="text-sm text-gray-500 mb-1">ระดับ</p><p class="font-semibold">${ssrInterpolate(unref(courseDetail).course.level ? getLevelName(unref(courseDetail).course.level) : "-")}</p></div><div><p class="text-sm text-gray-500 mb-1">ประเภท</p><p class="font-semibold">${ssrInterpolate(getTypeName(unref(courseDetail).course.type))}</p></div><div><p class="text-sm text-gray-500 mb-1">รหัสคอร์ส</p><p class="font-semibold">${ssrInterpolate(unref(courseDetail).course.code || "-")}</p></div></div></div>`);
        if (unref(courseDetail).branches && unref(courseDetail).branches.length > 0) {
          _push(`<div class="bg-white rounded-lg shadow p-6"><h2 class="text-xl font-semibold mb-4">สาขาที่เปิดสอน</h2><div class="space-y-3"><!--[-->`);
          ssrRenderList(unref(courseDetail).branches, (branch) => {
            _push(`<div class="border border-gray-200 rounded-lg p-4"><h3 class="font-medium text-lg mb-2">${ssrInterpolate(branch.branch_name)}</h3><div class="grid grid-cols-2 gap-2 text-sm text-gray-600"><div>จำนวนที่นั่ง: <span class="font-medium">${ssrInterpolate(branch.seat_limit ? branch.seat_limit.toLocaleString() : "ไม่จำกัด")}</span></div><div>ผู้ลงทะเบียนแล้ว: <span class="font-medium">${ssrInterpolate(branch.current_enrollments || 0)}</span></div>`);
            if (branch.available_seats !== null) {
              _push(`<div> ที่นั่งว่าง: <span class="font-medium text-green-600">${ssrInterpolate(branch.available_seats)}</span></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="lg:col-span-1"><div class="bg-white rounded-lg shadow-lg sticky top-4 p-6"><div class="mb-6">`);
        if (unref(courseDetail).course.onsite_price && unref(courseDetail).course.onsite_price !== unref(courseDetail).course.online_price) {
          _push(`<div class="mb-2"><p class="text-sm text-gray-500">เรียนสด (Onsite)</p><div class="flex items-baseline gap-2"><span class="text-3xl font-bold text-gray-900"> ฿${ssrInterpolate(unref(courseDetail).course.onsite_price.toLocaleString())}</span></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div><p class="text-sm text-gray-500 mb-1">เรียนออนไลน์ (Online)</p><div class="flex items-baseline gap-2">`);
        if (unref(courseDetail).course.online_price < unref(courseDetail).course.price) {
          _push(`<span class="text-sm text-gray-400 line-through"> ฿${ssrInterpolate(unref(courseDetail).course.price.toLocaleString())}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span class="text-3xl font-bold text-green-600"> ฿${ssrInterpolate(unref(courseDetail).course.online_price.toLocaleString())}</span></div></div></div><div class="space-y-3"><button class="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg> สมัครเรียนออนไลน์ </button>`);
        if (unref(courseDetail).branches && unref(courseDetail).branches.length > 0) {
          _push(`<button class="w-full px-6 py-3 bg-white border-2 border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors"> สมัครเรียนสดที่สาขา </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="mt-6 pt-6 border-t space-y-3"><div class="flex items-start gap-3"><svg class="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><div><p class="font-medium text-sm">เรียนซ้ำกี่รอบก็ได้</p><p class="text-xs text-gray-500">ดูวิดีโอย้อนหลังได้ตลอดชีพ</p></div></div><div class="flex items-start gap-3"><svg class="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><div><p class="font-medium text-sm">ส่งเอกสารฟรีถึงบ้าน</p><p class="text-xs text-gray-500">สำหรับผู้ที่สมัครเรียนออนไลน์</p></div></div><div class="flex items-start gap-3"><svg class="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><div><p class="font-medium text-sm">สอบถามอาจารย์ได้ตลอดเวลา</p><p class="text-xs text-gray-500">ผ่านระบบถาม-ตอบในคอร์ส</p></div></div></div></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(showEnrollmentModal)) {
        _push(ssrRenderComponent(_component_EnrollmentModal, {
          show: unref(showEnrollmentModal),
          enrollment: null,
          "prefill-course-id": unref(courseId),
          "prefill-enrollment-type": unref(enrollmentType),
          onClose: ($event) => showEnrollmentModal.value = false,
          onSaved: handleEnrollmentSaved
        }, null, _parent));
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/courses/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-D2Wpd-0Y.mjs.map
