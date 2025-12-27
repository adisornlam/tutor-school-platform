import { _ as __nuxt_component_0 } from './nuxt-link-CODr8WH9.mjs';
import { _ as __nuxt_component_0$1 } from './CourseCard-Glyxgknx.mjs';
import { defineComponent, ref, withCtx, createTextVNode, unref, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { u as useHead } from './composables-D6rK8HzN.mjs';
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
import './server.mjs';
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
      title: "KDC School - เรียนออนไลน์ได้ทุกที่ ทุกเวลา"
    });
    const categories = [
      { id: 1, name: "คณิตศาสตร์", icon: "📐", slug: "mathematics", count: 0 },
      { id: 2, name: "วิทยาศาสตร์", icon: "🔬", slug: "science", count: 0 },
      { id: 3, name: "ภาษาไทย", icon: "📖", slug: "thai", count: 0 },
      { id: 4, name: "ภาษาอังกฤษ", icon: "🌐", slug: "english", count: 0 }
    ];
    const featuredCourses = ref([]);
    const loadingFeaturedCourses = ref(false);
    const stats = ref({
      yearsOfExperience: 10,
      totalStudents: 5e3,
      totalCourses: 50,
      successRate: 95
    });
    const testimonials = ref([]);
    const loadingTestimonials = ref(false);
    const featuredArticles = ref([]);
    const loadingArticles = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_CourseCard = __nuxt_component_0$1;
      _push(`<!--[--><section class="bg-gradient-to-br from-green-500 to-green-700 text-white py-20"><div class="container mx-auto px-4"><div class="max-w-3xl mx-auto text-center"><h1 class="text-5xl font-bold mb-6"> เรียนออนไลน์ได้ทุกที่ ทุกเวลา </h1><p class="text-xl mb-8 text-green-100"> คอร์สเรียนคุณภาพสูงจากอาจารย์ผู้เชี่ยวชาญ พร้อมระบบ Live และ VOD </p><div class="flex gap-4 justify-center">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/courses",
        class: "px-8 py-4 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
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
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/auth/register",
        class: "px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` เริ่มเรียนฟรี `);
          } else {
            return [
              createTextVNode(" เริ่มเรียนฟรี ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></section><section class="py-16 bg-white"><div class="container mx-auto px-4"><h2 class="text-3xl font-bold text-center mb-12">ทำไมต้องเลือก KDC School?</h2><div class="grid md:grid-cols-3 gap-8"><div class="text-center p-6 bg-gray-50 rounded-lg"><div class="text-5xl mb-4">🎥</div><h3 class="text-xl font-semibold mb-2">Live Online Class</h3><p class="text-gray-600">เรียนสดกับอาจารย์ผ่านระบบออนไลน์ พร้อมถามตอบแบบ Real-time</p></div><div class="text-center p-6 bg-gray-50 rounded-lg"><div class="text-5xl mb-4">📹</div><h3 class="text-xl font-semibold mb-2">Video on Demand</h3><p class="text-gray-600">เรียนซ้ำกี่รอบก็ได้ตลอดชีพ ดูได้ทุกที่ทุกเวลา</p></div><div class="text-center p-6 bg-gray-50 rounded-lg"><div class="text-5xl mb-4">📚</div><h3 class="text-xl font-semibold mb-2">เอกสารประกอบ</h3><p class="text-gray-600">ส่งเอกสารประกอบการเรียนถึงบ้านผ่าน Kerry Express</p></div></div></div></section><section class="py-16"><div class="container mx-auto px-4"><div class="flex items-center justify-between mb-8"><h2 class="text-3xl font-bold">คอร์สเรียนยอดนิยม</h2>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/courses",
        class: "text-green-600 hover:text-green-700 font-semibold"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` ดูทั้งหมด → `);
          } else {
            return [
              createTextVNode(" ดูทั้งหมด → ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(loadingFeaturedCourses)) {
        _push(`<div class="grid md:grid-cols-3 gap-6"><!--[-->`);
        ssrRenderList(3, (i) => {
          _push(`<div class="bg-white rounded-lg shadow animate-pulse"><div class="aspect-video bg-gray-200"></div><div class="p-4 space-y-3"><div class="h-4 bg-gray-200 rounded w-3/4"></div><div class="h-4 bg-gray-200 rounded w-full"></div><div class="h-4 bg-gray-200 rounded w-2/3"></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(featuredCourses).length > 0) {
        _push(`<div class="grid md:grid-cols-3 gap-6"><!--[-->`);
        ssrRenderList(unref(featuredCourses), (course) => {
          _push(ssrRenderComponent(_component_CourseCard, {
            key: course.id,
            course
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="text-center py-8 text-gray-500"> กำลังโหลดคอร์สยอดนิยม... </div>`);
      }
      _push(`</div></section><section class="py-16 bg-gradient-to-br from-green-600 to-green-700 text-white"><div class="container mx-auto px-4"><h2 class="text-3xl font-bold text-center mb-12">ความสำเร็จของเรา</h2><div class="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"><div class="text-center"><div class="text-4xl md:text-5xl font-bold mb-2">${ssrInterpolate(unref(stats).yearsOfExperience)}+</div><div class="text-green-100 text-sm md:text-base">ปีแห่งประสบการณ์</div></div><div class="text-center"><div class="text-4xl md:text-5xl font-bold mb-2">${ssrInterpolate(unref(stats).totalStudents.toLocaleString())}+</div><div class="text-green-100 text-sm md:text-base">นักเรียนทั้งหมด</div></div><div class="text-center"><div class="text-4xl md:text-5xl font-bold mb-2">${ssrInterpolate(unref(stats).totalCourses)}+</div><div class="text-green-100 text-sm md:text-base">คอร์สเรียน</div></div><div class="text-center"><div class="text-4xl md:text-5xl font-bold mb-2">${ssrInterpolate(unref(stats).successRate)}%</div><div class="text-green-100 text-sm md:text-base">อัตราความสำเร็จ</div></div></div></div></section><section class="py-16 bg-white"><div class="container mx-auto px-4"><h2 class="text-3xl font-bold text-center mb-12">เสียงตอบรับจากผู้ปกครอง</h2>`);
      if (unref(loadingTestimonials)) {
        _push(`<div class="grid md:grid-cols-3 gap-8"><!--[-->`);
        ssrRenderList(3, (i) => {
          _push(`<div class="bg-gray-50 rounded-lg p-6 shadow-sm animate-pulse"><div class="h-4 bg-gray-200 rounded w-1/4 mb-4"></div><div class="h-4 bg-gray-200 rounded w-full mb-2"></div><div class="h-4 bg-gray-200 rounded w-3/4"></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(testimonials).length > 0) {
        _push(`<div class="grid md:grid-cols-3 gap-8"><!--[-->`);
        ssrRenderList(unref(testimonials), (testimonial) => {
          _push(`<div class="bg-gray-50 rounded-lg p-6 shadow-sm"><div class="flex items-center gap-1 mb-4"><!--[-->`);
          ssrRenderList(5, (i) => {
            _push(`<svg class="${ssrRenderClass([i <= testimonial.rating ? "text-yellow-400" : "text-gray-300", "w-5 h-5"])}" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>`);
          });
          _push(`<!--]--></div><p class="text-gray-700 mb-4 italic">&quot;${ssrInterpolate(testimonial.comment)}&quot;</p><div><div class="font-semibold text-gray-900">${ssrInterpolate(testimonial.name)}</div><div class="text-sm text-gray-600">${ssrInterpolate(testimonial.role)}</div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="text-center py-8 text-gray-500"> ยังไม่มีรีวิว </div>`);
      }
      _push(`</div></section><section class="py-16 bg-gray-50"><div class="container mx-auto px-4"><h2 class="text-3xl font-bold text-center mb-8">หมวดหมู่คอร์สเรียน</h2><p class="text-center text-gray-600 mb-8">เลือกเรียนตามวิชาที่คุณสนใจ</p><div class="grid md:grid-cols-4 gap-6"><!--[-->`);
      ssrRenderList(categories, (category) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: category.id,
          to: `/courses?category=${category.slug}`,
          class: "bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-center group"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="text-4xl mb-4 group-hover:scale-110 transition-transform"${_scopeId}>${ssrInterpolate(category.icon)}</div><h3 class="font-semibold text-lg mb-2"${_scopeId}>${ssrInterpolate(category.name)}</h3><p class="text-gray-600 text-sm"${_scopeId}>${ssrInterpolate(category.count)} คอร์ส</p>`);
            } else {
              return [
                createVNode("div", { class: "text-4xl mb-4 group-hover:scale-110 transition-transform" }, toDisplayString(category.icon), 1),
                createVNode("h3", { class: "font-semibold text-lg mb-2" }, toDisplayString(category.name), 1),
                createVNode("p", { class: "text-gray-600 text-sm" }, toDisplayString(category.count) + " คอร์ส", 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div></section><section class="py-16 bg-white"><div class="container mx-auto px-4"><div class="flex items-center justify-between mb-8"><h2 class="text-3xl font-bold">เทคนิคดีๆ และบทความ</h2>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/articles",
        class: "text-green-600 hover:text-green-700 font-semibold"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` ดูทั้งหมด → `);
          } else {
            return [
              createTextVNode(" ดูทั้งหมด → ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(loadingArticles)) {
        _push(`<div class="grid md:grid-cols-3 gap-6"><!--[-->`);
        ssrRenderList(3, (i) => {
          _push(`<div class="bg-white rounded-lg shadow animate-pulse"><div class="aspect-video bg-gray-200"></div><div class="p-6 space-y-3"><div class="h-4 bg-gray-200 rounded w-1/4"></div><div class="h-4 bg-gray-200 rounded w-full"></div><div class="h-4 bg-gray-200 rounded w-2/3"></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(featuredArticles).length > 0) {
        _push(`<div class="grid md:grid-cols-3 gap-6"><!--[-->`);
        ssrRenderList(unref(featuredArticles), (article) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: article.id,
            to: `/articles/${article.slug}`,
            class: "bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden cursor-pointer block"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="aspect-video bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center"${_scopeId}><div class="text-4xl"${_scopeId}>${ssrInterpolate(article.icon || "📝")}</div></div><div class="p-6"${_scopeId}><div class="text-sm text-gray-500 mb-2"${_scopeId}>${ssrInterpolate(article.category || "บทความ")}</div><h3 class="text-lg font-semibold mb-2 line-clamp-2"${_scopeId}>${ssrInterpolate(article.title)}</h3><p class="text-gray-600 text-sm mb-4 line-clamp-2"${_scopeId}>${ssrInterpolate(article.excerpt || "")}</p><div class="text-sm text-green-600 font-semibold"${_scopeId}>อ่านต่อ →</div></div>`);
              } else {
                return [
                  createVNode("div", { class: "aspect-video bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center" }, [
                    createVNode("div", { class: "text-4xl" }, toDisplayString(article.icon || "📝"), 1)
                  ]),
                  createVNode("div", { class: "p-6" }, [
                    createVNode("div", { class: "text-sm text-gray-500 mb-2" }, toDisplayString(article.category || "บทความ"), 1),
                    createVNode("h3", { class: "text-lg font-semibold mb-2 line-clamp-2" }, toDisplayString(article.title), 1),
                    createVNode("p", { class: "text-gray-600 text-sm mb-4 line-clamp-2" }, toDisplayString(article.excerpt || ""), 1),
                    createVNode("div", { class: "text-sm text-green-600 font-semibold" }, "อ่านต่อ →")
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="text-center py-8 text-gray-500"> ยังไม่มีบทความ </div>`);
      }
      _push(`</div></section><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CyzpvD2m.mjs.map
