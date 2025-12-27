import { _ as __nuxt_component_0 } from './CourseCard-Glyxgknx.mjs';
import { defineComponent, ref, reactive, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { u as useHead } from './composables-D6rK8HzN.mjs';
import { a as useRoute } from './server.mjs';
import './nuxt-link-CODr8WH9.mjs';
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
import 'jws';
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
    useHead({
      title: "คอร์สเรียนทั้งหมด - KDC School"
    });
    useRoute();
    const courses = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const pagination = reactive({
      page: 1,
      limit: 15,
      total: 0,
      totalPages: 0
    });
    const searchQuery = ref("");
    const selectedType = ref("");
    const selectedLevel = ref("");
    const selectedBranch = ref("");
    const sortBy = ref("newest");
    const branches = ref([]);
    const loadingBranches = ref(false);
    const formatCourseForCard = (course) => {
      return {
        id: course.id,
        title: course.title,
        description: course.description,
        price: course.price,
        thumbnail: course.thumbnail_url || void 0,
        type: getTypeName(course.type),
        students: course.enrollment_count,
        rating: void 0,
        // TODO: Add rating if available
        originalPrice: void 0
        // TODO: Add original price if available
      };
    };
    const getTypeName = (type) => {
      const typeNames = {
        live_online: "Live Online",
        vod: "Video on Demand",
        hybrid: "Hybrid"
      };
      return typeNames[type] || type;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CourseCard = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))}><section class="bg-gradient-to-br from-green-500 to-green-700 text-white py-12"><div class="container mx-auto px-4"><h1 class="text-4xl font-bold mb-4">คอร์สเรียนทั้งหมด</h1><p class="text-lg text-green-100">เลือกคอร์สที่เหมาะสมกับคุณ</p></div></section><section class="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm"><div class="container mx-auto px-4 py-4"><div class="flex flex-col md:flex-row gap-4"><div class="flex-1"><div class="relative"><input${ssrRenderAttr("value", unref(searchQuery))} type="text" placeholder="ค้นหาคอร์ส..." class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div></div><select class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(selectedType)) ? ssrLooseContain(unref(selectedType), "") : ssrLooseEqual(unref(selectedType), "")) ? " selected" : ""}>ทุกประเภท</option><option value="live_online"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedType)) ? ssrLooseContain(unref(selectedType), "live_online") : ssrLooseEqual(unref(selectedType), "live_online")) ? " selected" : ""}>Live Online</option><option value="vod"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedType)) ? ssrLooseContain(unref(selectedType), "vod") : ssrLooseEqual(unref(selectedType), "vod")) ? " selected" : ""}>Video on Demand</option><option value="hybrid"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedType)) ? ssrLooseContain(unref(selectedType), "hybrid") : ssrLooseEqual(unref(selectedType), "hybrid")) ? " selected" : ""}>Hybrid</option></select><select class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(selectedLevel)) ? ssrLooseContain(unref(selectedLevel), "") : ssrLooseEqual(unref(selectedLevel), "")) ? " selected" : ""}>ทุกระดับ</option><option value="beginner"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedLevel)) ? ssrLooseContain(unref(selectedLevel), "beginner") : ssrLooseEqual(unref(selectedLevel), "beginner")) ? " selected" : ""}>Beginner</option><option value="intermediate"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedLevel)) ? ssrLooseContain(unref(selectedLevel), "intermediate") : ssrLooseEqual(unref(selectedLevel), "intermediate")) ? " selected" : ""}>Intermediate</option><option value="advanced"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedLevel)) ? ssrLooseContain(unref(selectedLevel), "advanced") : ssrLooseEqual(unref(selectedLevel), "advanced")) ? " selected" : ""}>Advanced</option></select><select class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"${ssrIncludeBooleanAttr(unref(loadingBranches)) ? " disabled" : ""}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(selectedBranch)) ? ssrLooseContain(unref(selectedBranch), "") : ssrLooseEqual(unref(selectedBranch), "")) ? " selected" : ""}>ทุกสาขา</option><!--[-->`);
      ssrRenderList(unref(branches), (branch) => {
        _push(`<option${ssrRenderAttr("value", branch.id.toString())}${ssrIncludeBooleanAttr(Array.isArray(unref(selectedBranch)) ? ssrLooseContain(unref(selectedBranch), branch.id.toString()) : ssrLooseEqual(unref(selectedBranch), branch.id.toString())) ? " selected" : ""}>${ssrInterpolate(branch.name)}</option>`);
      });
      _push(`<!--]--></select><select class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value="newest"${ssrIncludeBooleanAttr(Array.isArray(unref(sortBy)) ? ssrLooseContain(unref(sortBy), "newest") : ssrLooseEqual(unref(sortBy), "newest")) ? " selected" : ""}>ใหม่ล่าสุด</option><option value="popular"${ssrIncludeBooleanAttr(Array.isArray(unref(sortBy)) ? ssrLooseContain(unref(sortBy), "popular") : ssrLooseEqual(unref(sortBy), "popular")) ? " selected" : ""}>ยอดนิยม</option><option value="price_asc"${ssrIncludeBooleanAttr(Array.isArray(unref(sortBy)) ? ssrLooseContain(unref(sortBy), "price_asc") : ssrLooseEqual(unref(sortBy), "price_asc")) ? " selected" : ""}>ราคา: ต่ำ-สูง</option><option value="price_desc"${ssrIncludeBooleanAttr(Array.isArray(unref(sortBy)) ? ssrLooseContain(unref(sortBy), "price_desc") : ssrLooseEqual(unref(sortBy), "price_desc")) ? " selected" : ""}>ราคา: สูง-ต่ำ</option></select></div></div></section>`);
      if (unref(loading)) {
        _push(`<div class="container mx-auto px-4 py-12"><div class="text-center"><div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div><p class="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p></div></div>`);
      } else if (unref(error)) {
        _push(`<div class="container mx-auto px-4 py-12"><div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">${ssrInterpolate(unref(error))}</div></div>`);
      } else {
        _push(`<section class="container mx-auto px-4 py-8"><div class="mb-6"><p class="text-gray-600"> พบ <span class="font-semibold text-gray-900">${ssrInterpolate(unref(pagination).total)}</span> คอร์ส </p></div>`);
        if (unref(courses).length === 0) {
          _push(`<div class="text-center py-16"><svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg><h3 class="text-xl font-semibold text-gray-900 mb-2">ไม่พบคอร์สเรียน</h3><p class="text-gray-600">ลองเปลี่ยนเงื่อนไขการค้นหาหรือตัวกรอง</p></div>`);
        } else {
          _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
          ssrRenderList(unref(courses), (course) => {
            _push(ssrRenderComponent(_component_CourseCard, {
              key: course.id,
              course: formatCourseForCard(course)
            }, null, _parent));
          });
          _push(`<!--]--></div>`);
        }
        if (unref(pagination).totalPages > 1) {
          _push(`<div class="mt-8 bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 rounded-lg shadow-sm"><div class="text-sm text-gray-700"> แสดง ${ssrInterpolate((unref(pagination).page - 1) * unref(pagination).limit + 1)} ถึง ${ssrInterpolate(Math.min(unref(pagination).page * unref(pagination).limit, unref(pagination).total))} จาก ${ssrInterpolate(unref(pagination).total)} รายการ </div><div class="flex space-x-2"><button${ssrIncludeBooleanAttr(unref(pagination).page === 1) ? " disabled" : ""} class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"> ก่อนหน้า </button><button${ssrIncludeBooleanAttr(unref(pagination).page >= unref(pagination).totalPages) ? " disabled" : ""} class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"> ถัดไป </button></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</section>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/courses/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BjLz_g6-.mjs.map
