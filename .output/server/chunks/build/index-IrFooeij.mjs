import { defineComponent, ref, reactive, unref, watch, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
import { R as RichTextEditor } from './RichTextEditor-BKbhyB-N.mjs';
import { u as useAuth, f as useConfirm, c as useRuntimeConfig } from './server.mjs';
import '@tiptap/vue-3';
import '@tiptap/starter-kit';
import '@tiptap/extension-image';
import '@tiptap/extension-link';
import '@tiptap/extension-text-align';
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

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ArticleModal",
  __ssrInlineRender: true,
  props: {
    show: { type: Boolean },
    article: {}
  },
  emits: ["close", "saved"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    useAuth();
    const loading = ref(false);
    const uploadingThumbnail = ref(false);
    ref(null);
    const uploadError = ref("");
    const form = reactive({
      title: "",
      excerpt: "",
      content: "",
      category: "",
      icon: "",
      featured_image_url: "",
      status: "draft",
      is_featured: false,
      display_order: 0
    });
    watch(() => props.show, (newVal) => {
      if (newVal) {
        if (props.article) {
          form.title = props.article.title || "";
          form.excerpt = props.article.excerpt || "";
          form.content = props.article.content || "";
          form.category = props.article.category || "";
          form.icon = props.article.icon || "";
          form.featured_image_url = props.article.featured_image_url || "";
          form.status = props.article.status;
          form.is_featured = props.article.is_featured || false;
          form.display_order = props.article.display_order || 0;
        } else {
          resetForm();
        }
      }
    });
    const resetForm = () => {
      form.title = "";
      form.excerpt = "";
      form.content = "";
      form.category = "";
      form.icon = "";
      form.featured_image_url = "";
      form.status = "draft";
      form.is_featured = false;
      form.display_order = 0;
      uploadError.value = "";
    };
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.show) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" }, _attrs))}><div class="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"><div class="flex items-center justify-between mb-6"><h2 class="text-2xl font-bold">${ssrInterpolate(__props.article ? "แก้ไขบทความ" : "เพิ่มบทความ")}</h2><button class="text-gray-400 hover:text-gray-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><form class="space-y-4"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-2"> หัวข้อ <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).title)} type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> หมวดหมู่ </label><input${ssrRenderAttr("value", unref(form).category)} type="text" placeholder="เช่น เทคนิคการเรียน, เคล็ดลับ" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Icon (Emoji) </label><input${ssrRenderAttr("value", unref(form).icon)} type="text" placeholder="เช่น 📝, 📚" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> สถานะ </label><select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value="draft"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "draft") : ssrLooseEqual(unref(form).status, "draft")) ? " selected" : ""}>ร่าง</option><option value="published"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "published") : ssrLooseEqual(unref(form).status, "published")) ? " selected" : ""}>เผยแพร่</option><option value="archived"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "archived") : ssrLooseEqual(unref(form).status, "archived")) ? " selected" : ""}>เก็บถาวร</option></select></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> ลำดับการแสดง </label><input${ssrRenderAttr("value", unref(form).display_order)} type="number" min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div class="flex items-center"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).is_featured) ? ssrLooseContain(unref(form).is_featured, null) : unref(form).is_featured) ? " checked" : ""} type="checkbox" class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"><label class="ml-2 block text-sm text-gray-700"> แสดงในหน้าแรก </label></div></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> คำอธิบายสั้นๆ (Excerpt) </label><textarea rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">${ssrInterpolate(unref(form).excerpt)}</textarea></div><div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-2"> รูปภาพปก </label><div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3"><p class="text-sm font-semibold text-blue-900 mb-2">📐 ขนาดที่แนะนำ:</p><ul class="text-sm text-blue-800 space-y-1 list-disc list-inside"><li><strong>ขนาด:</strong> 1280 x 720 pixels</li><li><strong>สัดส่วน:</strong> 16:9 (แนวนอน)</li><li><strong>รูปแบบ:</strong> JPG, PNG, WebP</li><li><strong>ขนาดไฟล์:</strong> ไม่เกิน 2 MB (แนะนำ &lt; 500 KB)</li></ul></div><div class="space-y-3">`);
        if (unref(uploadingThumbnail)) {
          _push(`<div class="text-sm text-gray-600 py-2"> กำลังอัปโหลด... </div>`);
        } else if (unref(form).featured_image_url) {
          _push(`<div class="space-y-3"><p class="text-sm text-gray-600">ตัวอย่าง (สัดส่วน 16:9):</p><div class="aspect-video bg-gray-200 rounded-lg overflow-hidden max-w-2xl"><img${ssrRenderAttr("src", unref(form).featured_image_url)} alt="Featured image preview" class="w-full h-full object-cover"></div><button type="button" class="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg border border-red-200"> ลบรูปภาพ </button></div>`);
        } else {
          _push(`<div class="border-2 border-dashed border-gray-300 rounded-lg p-4"><input type="file" accept="image/jpeg,image/png,image/webp" class="hidden"><button type="button" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"><svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg> อัปโหลดรูปภาพปก </button><p class="text-xs text-gray-500 mt-2 text-center">รองรับไฟล์: JPG, PNG, WebP (สูงสุด 2 MB)</p></div>`);
        }
        _push(`</div>`);
        if (unref(uploadError)) {
          _push(`<p class="mt-2 text-sm text-red-600">${ssrInterpolate(unref(uploadError))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-2"> เนื้อหา <span class="text-red-500">*</span></label>`);
        _push(ssrRenderComponent(RichTextEditor, {
          modelValue: unref(form).content,
          "onUpdate:modelValue": ($event) => unref(form).content = $event,
          "entity-type": "articles",
          "entity-id": props.article?.id,
          class: "w-full"
        }, null, _parent));
        _push(`</div><div class="flex justify-end space-x-4 pt-4 border-t"><button type="button" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"> ยกเลิก </button><button type="submit"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">${ssrInterpolate(unref(loading) ? "กำลังบันทึก..." : "บันทึก")}</button></div></form></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ArticleModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$1, { __name: "ArticleModal" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const config = useRuntimeConfig();
    const { accessToken } = useAuth();
    const articles = ref([]);
    const loading = ref(false);
    const error = ref("");
    const showCreateModal = ref(false);
    const editingArticle = ref(null);
    const filters = reactive({
      search: "",
      category: "",
      status: ""
    });
    const loadArticles = async () => {
      loading.value = true;
      error.value = "";
      try {
        const params = new URLSearchParams();
        if (filters.search) params.append("search", filters.search);
        if (filters.category) params.append("category", filters.category);
        if (filters.status) params.append("status", filters.status);
        const response = await $fetch(`${config.public.apiBase}/admin/articles?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          }
        });
        if (response.success) {
          articles.value = response.data;
        }
      } catch (err) {
        console.error("Error loading articles:", err);
        error.value = err.data?.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      } finally {
        loading.value = false;
      }
    };
    const getStatusName = (status) => {
      const statusNames = {
        draft: "ร่าง",
        published: "เผยแพร่",
        archived: "เก็บถาวร"
      };
      return statusNames[status] || status;
    };
    const closeModal = () => {
      showCreateModal.value = false;
      editingArticle.value = null;
    };
    const handleArticleSaved = () => {
      closeModal();
      loadArticles();
    };
    useConfirm();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ArticleModal = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="flex items-center justify-between mb-6"><h1 class="text-3xl font-bold">จัดการบทความ</h1><button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg><span>เพิ่มบทความ</span></button></div><div class="bg-white rounded-lg shadow p-4 mb-6"><div class="grid grid-cols-1 md:grid-cols-3 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2">ค้นหา</label><input${ssrRenderAttr("value", unref(filters).search)} type="text" placeholder="ค้นหาด้วยหัวข้อ, เนื้อหา" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2">หมวดหมู่</label><input${ssrRenderAttr("value", unref(filters).category)} type="text" placeholder="กรองตามหมวดหมู่" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2">สถานะ</label><select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "") : ssrLooseEqual(unref(filters).status, "")) ? " selected" : ""}>ทั้งหมด</option><option value="draft"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "draft") : ssrLooseEqual(unref(filters).status, "draft")) ? " selected" : ""}>ร่าง</option><option value="published"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "published") : ssrLooseEqual(unref(filters).status, "published")) ? " selected" : ""}>เผยแพร่</option><option value="archived"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "archived") : ssrLooseEqual(unref(filters).status, "archived")) ? " selected" : ""}>เก็บถาวร</option></select></div></div></div><div class="bg-white rounded-lg shadow overflow-hidden">`);
      if (unref(loading)) {
        _push(`<div class="p-8 text-center"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div><p class="mt-2 text-gray-600">กำลังโหลด...</p></div>`);
      } else if (unref(error)) {
        _push(`<div class="p-4 bg-red-50 border border-red-200 text-red-700 rounded">${ssrInterpolate(unref(error))}</div>`);
      } else if (unref(articles).length === 0) {
        _push(`<div class="p-8 text-center text-gray-500"> ไม่พบบทความ </div>`);
      } else {
        _push(`<table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">หัวข้อ</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">หมวดหมู่</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">หน้าแรก</th><th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th></tr></thead><tbody class="bg-white divide-y divide-gray-200"><!--[-->`);
        ssrRenderList(unref(articles), (article) => {
          _push(`<tr class="hover:bg-gray-50"><td class="px-6 py-4"><div class="flex items-center space-x-3">`);
          if (article.icon) {
            _push(`<div class="text-2xl">${ssrInterpolate(article.icon)}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div><div class="text-sm font-medium text-gray-900">${ssrInterpolate(article.title)}</div>`);
          if (article.excerpt) {
            _push(`<div class="text-xs text-gray-500 mt-1 line-clamp-1">${ssrInterpolate(article.excerpt)}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></td><td class="px-6 py-4 whitespace-nowrap"><div class="text-sm text-gray-900">${ssrInterpolate(article.category || "-")}</div></td><td class="px-6 py-4 whitespace-nowrap"><span class="${ssrRenderClass([{
            "bg-yellow-100 text-yellow-800": article.status === "draft",
            "bg-green-100 text-green-800": article.status === "published",
            "bg-gray-100 text-gray-800": article.status === "archived"
          }, "px-2 py-1 text-xs font-medium rounded"])}">${ssrInterpolate(getStatusName(article.status))}</span></td><td class="px-6 py-4 whitespace-nowrap">`);
          if (article.is_featured) {
            _push(`<span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded"> แสดง </span>`);
          } else {
            _push(`<span class="text-gray-400">-</span>`);
          }
          _push(`</td><td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><div class="flex items-center justify-end space-x-2"><button class="text-blue-600 hover:text-blue-900" title="แก้ไข"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button><button class="text-red-600 hover:text-red-900" title="ลบ"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></div></td></tr>`);
        });
        _push(`<!--]--></tbody></table>`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_ArticleModal, {
        show: unref(showCreateModal) || unref(editingArticle) !== null,
        article: unref(editingArticle),
        onClose: closeModal,
        onSaved: handleArticleSaved
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/content/articles/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-IrFooeij.mjs.map
