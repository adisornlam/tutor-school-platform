import { defineComponent, ref, reactive, unref, watch, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
import { u as useAuth, f as useConfirm, c as useRuntimeConfig } from './server.mjs';
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

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "TestimonialModal",
  __ssrInlineRender: true,
  props: {
    show: { type: Boolean },
    testimonial: {}
  },
  emits: ["close", "saved"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    useAuth();
    const loading = ref(false);
    const uploadingAvatar = ref(false);
    ref(null);
    const uploadError = ref("");
    const form = reactive({
      name: "",
      role: "",
      comment: "",
      rating: 5,
      avatar_url: "",
      status: "pending",
      display_order: 0
    });
    watch(() => props.show, (newVal) => {
      if (newVal) {
        if (props.testimonial) {
          form.name = props.testimonial.name || "";
          form.role = props.testimonial.role || "";
          form.comment = props.testimonial.comment || "";
          form.rating = props.testimonial.rating || 5;
          form.avatar_url = props.testimonial.avatar_url || "";
          form.status = props.testimonial.status;
          form.display_order = props.testimonial.display_order || 0;
        } else {
          resetForm();
        }
      }
    });
    const resetForm = () => {
      form.name = "";
      form.role = "";
      form.comment = "";
      form.rating = 5;
      form.avatar_url = "";
      form.status = "pending";
      form.display_order = 0;
      uploadError.value = "";
    };
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.show) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" }, _attrs))}><div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"><div class="flex items-center justify-between mb-6"><h2 class="text-2xl font-bold">${ssrInterpolate(__props.testimonial ? "แก้ไขรีวิว" : "เพิ่มรีวิว")}</h2><button class="text-gray-400 hover:text-gray-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><form class="space-y-4"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-2"> ชื่อ <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).name)} type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> บทบาท/ตำแหน่ง <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).role)} type="text" required placeholder="เช่น ผู้ปกครองของน้องน้ำ, นักเรียนชั้น ม.3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> คะแนน <span class="text-red-500">*</span></label><select required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option${ssrRenderAttr("value", 1)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).rating) ? ssrLooseContain(unref(form).rating, 1) : ssrLooseEqual(unref(form).rating, 1)) ? " selected" : ""}>1 ดาว</option><option${ssrRenderAttr("value", 2)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).rating) ? ssrLooseContain(unref(form).rating, 2) : ssrLooseEqual(unref(form).rating, 2)) ? " selected" : ""}>2 ดาว</option><option${ssrRenderAttr("value", 3)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).rating) ? ssrLooseContain(unref(form).rating, 3) : ssrLooseEqual(unref(form).rating, 3)) ? " selected" : ""}>3 ดาว</option><option${ssrRenderAttr("value", 4)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).rating) ? ssrLooseContain(unref(form).rating, 4) : ssrLooseEqual(unref(form).rating, 4)) ? " selected" : ""}>4 ดาว</option><option${ssrRenderAttr("value", 5)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).rating) ? ssrLooseContain(unref(form).rating, 5) : ssrLooseEqual(unref(form).rating, 5)) ? " selected" : ""}>5 ดาว</option></select></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> สถานะ </label><select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value="pending"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "pending") : ssrLooseEqual(unref(form).status, "pending")) ? " selected" : ""}>รออนุมัติ</option><option value="approved"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "approved") : ssrLooseEqual(unref(form).status, "approved")) ? " selected" : ""}>อนุมัติแล้ว</option><option value="rejected"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "rejected") : ssrLooseEqual(unref(form).status, "rejected")) ? " selected" : ""}>ปฏิเสธ</option></select></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> ลำดับการแสดง </label><input${ssrRenderAttr("value", unref(form).display_order)} type="number" min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-2"> รูปภาพ (Avatar) </label><div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3"><p class="text-sm font-semibold text-blue-900 mb-1">📐 ขนาดที่แนะนำ:</p><ul class="text-xs text-blue-800 space-y-1 list-disc list-inside"><li><strong>ขนาด:</strong> 400 x 400 pixels</li><li><strong>สัดส่วน:</strong> 1:1 (สี่เหลี่ยมจัตุรัส)</li><li><strong>รูปแบบ:</strong> JPG, PNG, WebP</li><li><strong>ขนาดไฟล์:</strong> ไม่เกิน 1 MB</li></ul></div><div class="space-y-3">`);
        if (unref(uploadingAvatar)) {
          _push(`<div class="text-sm text-gray-600 py-2"> กำลังอัปโหลด... </div>`);
        } else if (unref(form).avatar_url) {
          _push(`<div class="space-y-3"><p class="text-sm text-gray-600">ตัวอย่าง:</p><div class="w-32 h-32 bg-gray-200 rounded-full overflow-hidden border-2 border-gray-300"><img${ssrRenderAttr("src", unref(form).avatar_url)} alt="Avatar preview" class="w-full h-full object-cover"></div><button type="button" class="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg border border-red-200"> ลบรูปภาพ </button></div>`);
        } else {
          _push(`<div class="border-2 border-dashed border-gray-300 rounded-lg p-4"><input type="file" accept="image/jpeg,image/png,image/webp" class="hidden"><button type="button" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"><svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg> อัปโหลดรูปภาพ Avatar </button><p class="text-xs text-gray-500 mt-2 text-center">รองรับไฟล์: JPG, PNG, WebP (สูงสุด 1 MB)</p></div>`);
        }
        _push(`</div>`);
        if (unref(uploadError)) {
          _push(`<p class="mt-2 text-sm text-red-600">${ssrInterpolate(unref(uploadError))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-2"> รีวิว <span class="text-red-500">*</span></label><textarea rows="5" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">${ssrInterpolate(unref(form).comment)}</textarea></div></div><div class="flex justify-end space-x-4 pt-4 border-t"><button type="button" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"> ยกเลิก </button><button type="submit"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">${ssrInterpolate(unref(loading) ? "กำลังบันทึก..." : "บันทึก")}</button></div></form></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TestimonialModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$1, { __name: "TestimonialModal" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const config = useRuntimeConfig();
    const { accessToken } = useAuth();
    const testimonials = ref([]);
    const loading = ref(false);
    const error = ref("");
    const showCreateModal = ref(false);
    const editingTestimonial = ref(null);
    const filters = reactive({
      search: "",
      status: ""
    });
    const loadTestimonials = async () => {
      loading.value = true;
      error.value = "";
      try {
        const params = new URLSearchParams();
        if (filters.search) params.append("search", filters.search);
        if (filters.status) params.append("status", filters.status);
        const response = await $fetch(`${config.public.apiBase}/admin/testimonials?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          }
        });
        if (response.success) {
          testimonials.value = response.data;
        }
      } catch (err) {
        console.error("Error loading testimonials:", err);
        error.value = err.data?.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      } finally {
        loading.value = false;
      }
    };
    const getStatusName = (status) => {
      const statusNames = {
        pending: "รออนุมัติ",
        approved: "อนุมัติแล้ว",
        rejected: "ปฏิเสธ"
      };
      return statusNames[status] || status;
    };
    const closeModal = () => {
      showCreateModal.value = false;
      editingTestimonial.value = null;
    };
    const handleTestimonialSaved = () => {
      closeModal();
      loadTestimonials();
    };
    useConfirm();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_TestimonialModal = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="flex items-center justify-between mb-6"><h1 class="text-3xl font-bold">จัดการรีวิว</h1><button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg><span>เพิ่มรีวิว</span></button></div><div class="bg-white rounded-lg shadow p-4 mb-6"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2">ค้นหา</label><input${ssrRenderAttr("value", unref(filters).search)} type="text" placeholder="ค้นหาด้วยชื่อ, บทบาท, รีวิว" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2">สถานะ</label><select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "") : ssrLooseEqual(unref(filters).status, "")) ? " selected" : ""}>ทั้งหมด</option><option value="pending"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "pending") : ssrLooseEqual(unref(filters).status, "pending")) ? " selected" : ""}>รออนุมัติ</option><option value="approved"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "approved") : ssrLooseEqual(unref(filters).status, "approved")) ? " selected" : ""}>อนุมัติแล้ว</option><option value="rejected"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "rejected") : ssrLooseEqual(unref(filters).status, "rejected")) ? " selected" : ""}>ปฏิเสธ</option></select></div></div></div><div class="bg-white rounded-lg shadow overflow-hidden">`);
      if (unref(loading)) {
        _push(`<div class="p-8 text-center"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div><p class="mt-2 text-gray-600">กำลังโหลด...</p></div>`);
      } else if (unref(error)) {
        _push(`<div class="p-4 bg-red-50 border border-red-200 text-red-700 rounded">${ssrInterpolate(unref(error))}</div>`);
      } else if (unref(testimonials).length === 0) {
        _push(`<div class="p-8 text-center text-gray-500"> ไม่พบรีวิว </div>`);
      } else {
        _push(`<table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">บทบาท</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">คะแนน</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รีวิว</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th><th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th></tr></thead><tbody class="bg-white divide-y divide-gray-200"><!--[-->`);
        ssrRenderList(unref(testimonials), (testimonial) => {
          _push(`<tr class="hover:bg-gray-50"><td class="px-6 py-4 whitespace-nowrap"><div class="flex items-center">`);
          if (testimonial.avatar_url) {
            _push(`<div class="h-10 w-10 rounded-full bg-gray-200 mr-3 overflow-hidden"><img${ssrRenderAttr("src", testimonial.avatar_url)}${ssrRenderAttr("alt", testimonial.name)} class="h-full w-full object-cover"></div>`);
          } else {
            _push(`<div class="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold mr-3">${ssrInterpolate(testimonial.name[0])}</div>`);
          }
          _push(`<div class="text-sm font-medium text-gray-900">${ssrInterpolate(testimonial.name)}</div></div></td><td class="px-6 py-4 whitespace-nowrap"><div class="text-sm text-gray-900">${ssrInterpolate(testimonial.role)}</div></td><td class="px-6 py-4 whitespace-nowrap"><div class="flex items-center gap-1"><!--[-->`);
          ssrRenderList(5, (i) => {
            _push(`<svg class="${ssrRenderClass([i <= testimonial.rating ? "text-yellow-400" : "text-gray-300", "w-4 h-4"])}" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>`);
          });
          _push(`<!--]--></div></td><td class="px-6 py-4"><div class="text-sm text-gray-900 line-clamp-2">${ssrInterpolate(testimonial.comment)}</div></td><td class="px-6 py-4 whitespace-nowrap"><span class="${ssrRenderClass([{
            "bg-yellow-100 text-yellow-800": testimonial.status === "pending",
            "bg-green-100 text-green-800": testimonial.status === "approved",
            "bg-red-100 text-red-800": testimonial.status === "rejected"
          }, "px-2 py-1 text-xs font-medium rounded"])}">${ssrInterpolate(getStatusName(testimonial.status))}</span></td><td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><div class="flex items-center justify-end space-x-2"><button class="text-blue-600 hover:text-blue-900" title="แก้ไข"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button><button class="text-red-600 hover:text-red-900" title="ลบ"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></div></td></tr>`);
        });
        _push(`<!--]--></tbody></table>`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_TestimonialModal, {
        show: unref(showCreateModal) || unref(editingTestimonial) !== null,
        testimonial: unref(editingTestimonial),
        onClose: closeModal,
        onSaved: handleTestimonialSaved
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/content/testimonials/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-fkEPeqsA.mjs.map
