import { _ as __nuxt_component_0 } from './nuxt-link-CODr8WH9.mjs';
import { defineComponent, ref, computed, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrRenderComponent } from 'vue/server-renderer';
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
  __name: "my-courses",
  __ssrInlineRender: true,
  setup(__props) {
    const { user } = useAuth();
    const activeTab = ref("all");
    const selectedEnrollmentType = ref("all");
    const sortBy = ref("newest");
    const enrollments = ref([]);
    const loading = ref(true);
    const error = ref("");
    const isParent = computed(() => {
      return user.value?.roles?.includes("parent");
    });
    const tabs = [
      { id: "all", label: "การเรียนทั้งหมด" },
      { id: "active", label: "กำลังเรียน" },
      { id: "completed", label: "เรียนจบแล้ว" }
    ];
    const filteredEnrollments = computed(() => {
      let filtered = [...enrollments.value];
      if (activeTab.value === "active") {
        filtered = filtered.filter((e) => e.status === "active");
      } else if (activeTab.value === "completed") {
        filtered = filtered.filter((e) => e.status === "completed");
      }
      if (selectedEnrollmentType.value !== "all") {
        filtered = filtered.filter((e) => e.enrollmentType === selectedEnrollmentType.value);
      }
      if (sortBy.value === "newest") {
        filtered.sort((a, b) => new Date(b.enrollmentDate).getTime() - new Date(a.enrollmentDate).getTime());
      } else if (sortBy.value === "oldest") {
        filtered.sort((a, b) => new Date(a.enrollmentDate).getTime() - new Date(b.enrollmentDate).getTime());
      } else if (sortBy.value === "title") {
        filtered.sort((a, b) => a.course.title.localeCompare(b.course.title, "th"));
      }
      return filtered;
    });
    const formatDate = (dateString) => {
      try {
        return format(new Date(dateString), "d MMMM yyyy", { locale: th });
      } catch {
        return dateString;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 class="text-3xl font-bold mb-6">คอร์สเรียนของฉัน</h1>`);
      if (unref(loading)) {
        _push(`<div class="text-center py-12"><div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div><p class="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p></div>`);
      } else if (unref(error)) {
        _push(`<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!--[--><div class="flex items-center gap-4 mb-6 border-b border-gray-200"><!--[-->`);
        ssrRenderList(tabs, (tab) => {
          _push(`<button class="${ssrRenderClass([unref(activeTab) === tab.id ? "text-green-600 border-b-2 border-green-600" : "text-gray-600 hover:text-green-600", "px-4 py-2 font-semibold transition-colors relative"])}">${ssrInterpolate(tab.label)}</button>`);
        });
        _push(`<!--]--></div><div class="flex items-center justify-between mb-6"><div class="text-gray-600"> จำนวน: <span class="font-semibold">${ssrInterpolate(unref(filteredEnrollments).length)}</span> คอร์ส </div><div class="flex items-center gap-4"><select class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value="all"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedEnrollmentType)) ? ssrLooseContain(unref(selectedEnrollmentType), "all") : ssrLooseEqual(unref(selectedEnrollmentType), "all")) ? " selected" : ""}>ทุกประเภทการเรียน</option><option value="onsite"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedEnrollmentType)) ? ssrLooseContain(unref(selectedEnrollmentType), "onsite") : ssrLooseEqual(unref(selectedEnrollmentType), "onsite")) ? " selected" : ""}>เรียนที่สาขา</option><option value="online"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedEnrollmentType)) ? ssrLooseContain(unref(selectedEnrollmentType), "online") : ssrLooseEqual(unref(selectedEnrollmentType), "online")) ? " selected" : ""}>เรียนออนไลน์</option></select><select class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value="newest"${ssrIncludeBooleanAttr(Array.isArray(unref(sortBy)) ? ssrLooseContain(unref(sortBy), "newest") : ssrLooseEqual(unref(sortBy), "newest")) ? " selected" : ""}>วันที่ลงเรียนใหม่-เก่า</option><option value="oldest"${ssrIncludeBooleanAttr(Array.isArray(unref(sortBy)) ? ssrLooseContain(unref(sortBy), "oldest") : ssrLooseEqual(unref(sortBy), "oldest")) ? " selected" : ""}>วันที่ลงเรียนเก่า-ใหม่</option><option value="title"${ssrIncludeBooleanAttr(Array.isArray(unref(sortBy)) ? ssrLooseContain(unref(sortBy), "title") : ssrLooseEqual(unref(sortBy), "title")) ? " selected" : ""}>ชื่อคอร์ส (ก-ฮ)</option></select></div></div><div class="space-y-4"><!--[-->`);
        ssrRenderList(unref(filteredEnrollments), (enrollment) => {
          _push(`<div class="bg-white rounded-lg shadow p-6 flex gap-6 hover:shadow-md transition-shadow"><div class="w-48 h-32 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">`);
          if (enrollment.course.thumbnail_url) {
            _push(`<img${ssrRenderAttr("src", enrollment.course.thumbnail_url)}${ssrRenderAttr("alt", enrollment.course.title)} class="w-full h-full object-cover">`);
          } else {
            _push(`<div class="w-full h-full flex items-center justify-center text-gray-400"><svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg></div>`);
          }
          _push(`</div><div class="flex-1"><div class="flex items-start justify-between mb-2"><div class="flex-1"><div class="flex items-center gap-2 mb-1"><span class="${ssrRenderClass([enrollment.enrollmentType === "online" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800", "px-2 py-1 text-xs font-semibold rounded"])}">${ssrInterpolate(enrollment.enrollmentType === "online" ? "เรียนออนไลน์" : "เรียนที่สาขา")}</span>`);
          if (enrollment.branch) {
            _push(`<span class="text-sm text-gray-500">${ssrInterpolate(enrollment.branch.name)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (enrollment.course.code) {
            _push(`<span class="text-xs text-gray-400">${ssrInterpolate(enrollment.course.code)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><h3 class="text-xl font-semibold mb-2">${ssrInterpolate(enrollment.course.title)}</h3>`);
          if (enrollment.course.description) {
            _push(`<p class="text-gray-600 text-sm mb-4 line-clamp-2">${ssrInterpolate(enrollment.course.description)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
          {
            _push(`<!---->`);
          }
          _push(`<div class="flex items-center justify-between"><div class="text-sm text-gray-500"> ลงทะเบียนเมื่อ: ${ssrInterpolate(formatDate(enrollment.enrollmentDate))} `);
          if (enrollment.student && unref(isParent)) {
            _push(`<span class="ml-2"> (${ssrInterpolate(enrollment.student.firstName)} ${ssrInterpolate(enrollment.student.lastName)}) </span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="flex items-center gap-2">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/courses/${enrollment.course.id}`,
            class: "px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` ดูรายละเอียด `);
              } else {
                return [
                  createTextVNode(" ดูรายละเอียด ")
                ];
              }
            }),
            _: 2
          }, _parent));
          if (enrollment.enrollmentType === "online") {
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: `/learning/courses/${enrollment.course.id}`,
              class: "px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` เริ่มเรียน `);
                } else {
                  return [
                    createTextVNode(" เริ่มเรียน ")
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></div></div>`);
        });
        _push(`<!--]-->`);
        if (unref(filteredEnrollments).length === 0) {
          _push(`<div class="text-center py-12 bg-white rounded-lg shadow"><svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg><h3 class="mt-2 text-sm font-semibold text-gray-900">ยังไม่มีคอร์สเรียน</h3><p class="mt-1 text-sm text-gray-500">เริ่มต้นเรียนกับเราได้เลย</p><div class="mt-6">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/courses",
            class: "inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` ดูคอร์สเรียนทั้งหมด `);
              } else {
                return [
                  createTextVNode(" ดูคอร์สเรียนทั้งหมด ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><!--]-->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/my-courses.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=my-courses-B84-7wEG.mjs.map
