import { _ as __nuxt_component_0$1 } from './nuxt-link-CODr8WH9.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, createBlock, createCommentVNode, openBlock, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CourseCard",
  __ssrInlineRender: true,
  props: {
    course: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        to: `/courses/${__props.course.id}`,
        class: "block bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="aspect-video bg-gray-200 relative"${_scopeId}>`);
            if (__props.course.thumbnail || __props.course.thumbnail_url) {
              _push2(`<img${ssrRenderAttr("src", __props.course.thumbnail || __props.course.thumbnail_url)}${ssrRenderAttr("alt", __props.course.title)} class="w-full h-full object-cover"${_scopeId}>`);
            } else {
              _push2(`<div class="w-full h-full flex items-center justify-center text-gray-400"${_scopeId}><svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"${_scopeId}></path></svg></div>`);
            }
            if (__props.course.type) {
              _push2(`<div class="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium"${_scopeId}>${ssrInterpolate(__props.course.type)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="p-4"${_scopeId}><div class="flex items-center gap-2 mb-2"${_scopeId}><span class="text-sm text-gray-500"${_scopeId}>คอร์สออนไลน์</span><span class="text-gray-300"${_scopeId}>•</span><span class="text-sm text-gray-500"${_scopeId}>เรียนซ้ำกี่รอบก็ได้ตลอดชีพ</span></div><h3 class="font-semibold text-lg mb-2 line-clamp-2"${_scopeId}>${ssrInterpolate(__props.course.title)}</h3>`);
            if (__props.course.description) {
              _push2(`<p class="text-gray-600 text-sm mb-4 line-clamp-2"${_scopeId}>${ssrInterpolate(__props.course.description)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex items-center justify-between"${_scopeId}><div class="flex items-center gap-4"${_scopeId}>`);
            if (__props.course.rating) {
              _push2(`<div class="flex items-center gap-1"${_scopeId}><svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"${_scopeId}><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"${_scopeId}></path></svg><span class="text-sm font-semibold"${_scopeId}>${ssrInterpolate(__props.course.rating)}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.course.students) {
              _push2(`<div class="text-sm text-gray-500"${_scopeId}>${ssrInterpolate(__props.course.students.toLocaleString())} คน </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="text-right"${_scopeId}>`);
            if (__props.course.originalPrice) {
              _push2(`<div class="text-sm text-gray-400 line-through"${_scopeId}> ฿${ssrInterpolate(__props.course.originalPrice.toLocaleString())}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="text-lg font-bold text-green-600"${_scopeId}> ฿${ssrInterpolate(__props.course.price.toLocaleString())}</div></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "aspect-video bg-gray-200 relative" }, [
                __props.course.thumbnail || __props.course.thumbnail_url ? (openBlock(), createBlock("img", {
                  key: 0,
                  src: __props.course.thumbnail || __props.course.thumbnail_url,
                  alt: __props.course.title,
                  class: "w-full h-full object-cover"
                }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "w-full h-full flex items-center justify-center text-gray-400"
                }, [
                  (openBlock(), createBlock("svg", {
                    class: "w-16 h-16",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    })
                  ]))
                ])),
                __props.course.type ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium"
                }, toDisplayString(__props.course.type), 1)) : createCommentVNode("", true)
              ]),
              createVNode("div", { class: "p-4" }, [
                createVNode("div", { class: "flex items-center gap-2 mb-2" }, [
                  createVNode("span", { class: "text-sm text-gray-500" }, "คอร์สออนไลน์"),
                  createVNode("span", { class: "text-gray-300" }, "•"),
                  createVNode("span", { class: "text-sm text-gray-500" }, "เรียนซ้ำกี่รอบก็ได้ตลอดชีพ")
                ]),
                createVNode("h3", { class: "font-semibold text-lg mb-2 line-clamp-2" }, toDisplayString(__props.course.title), 1),
                __props.course.description ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: "text-gray-600 text-sm mb-4 line-clamp-2"
                }, toDisplayString(__props.course.description), 1)) : createCommentVNode("", true),
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("div", { class: "flex items-center gap-4" }, [
                    __props.course.rating ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "flex items-center gap-1"
                    }, [
                      (openBlock(), createBlock("svg", {
                        class: "w-4 h-4 text-yellow-400",
                        fill: "currentColor",
                        viewBox: "0 0 20 20"
                      }, [
                        createVNode("path", { d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" })
                      ])),
                      createVNode("span", { class: "text-sm font-semibold" }, toDisplayString(__props.course.rating), 1)
                    ])) : createCommentVNode("", true),
                    __props.course.students ? (openBlock(), createBlock("div", {
                      key: 1,
                      class: "text-sm text-gray-500"
                    }, toDisplayString(__props.course.students.toLocaleString()) + " คน ", 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "text-right" }, [
                    __props.course.originalPrice ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-sm text-gray-400 line-through"
                    }, " ฿" + toDisplayString(__props.course.originalPrice.toLocaleString()), 1)) : createCommentVNode("", true),
                    createVNode("div", { class: "text-lg font-bold text-green-600" }, " ฿" + toDisplayString(__props.course.price.toLocaleString()), 1)
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CourseCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "CourseCard" });

export { __nuxt_component_0 as _ };
//# sourceMappingURL=CourseCard-Glyxgknx.mjs.map
