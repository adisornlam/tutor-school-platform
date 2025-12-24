globalThis.__timing__.logStart('Load chunks/build/edit-KCC45fLa');import { defineComponent, computed, ref, reactive, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { R as RichTextEditor } from './RichTextEditor-BKbhyB-N.mjs';
import { a as useRoute, b as useRouter, u as useAuth } from './server.mjs';
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
import 'engine.io';
import 'socket.io';
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
  __name: "edit",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    useAuth();
    const courseId = computed(() => parseInt(route.params.id));
    const loading = ref(true);
    const error = ref("");
    const submitting = ref(false);
    const submitError = ref("");
    const form = reactive({
      title: "",
      description: "",
      thumbnail_url: "",
      type: "",
      price: 0,
      duration_hours: null,
      level: "",
      status: "draft",
      code: "",
      selectedBranches: []
    });
    const uploadingThumbnail = ref(false);
    ref(null);
    const availableBranches = ref([]);
    const loadingBranches = ref(false);
    const branchSeatLimits = ref({});
    const getBranchSeatLimit = (branchId) => {
      return branchSeatLimits.value[branchId] ?? "";
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="flex items-center justify-between mb-6"><div class="flex items-center space-x-4"><button class="p-2 hover:bg-gray-100 rounded-lg"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg></button><h1 class="text-3xl font-bold">แก้ไขคอร์ส</h1></div></div>`);
      if (unref(loading)) {
        _push(`<div class="text-center py-12"><div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div><p class="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p></div>`);
      } else {
        _push(`<!--[-->`);
        if (unref(error)) {
          _push(`<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">${ssrInterpolate(unref(error))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<form class="bg-white rounded-lg shadow p-6 space-y-6"><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-2"> ชื่อคอร์ส <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).title)} type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="กรุณากรอกชื่อคอร์ส"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> รหัสคอร์ส </label><input${ssrRenderAttr("value", unref(form).code)} type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="เช่น COURSE001"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> ประเภท <span class="text-red-500">*</span></label><select required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "") : ssrLooseEqual(unref(form).type, "")) ? " selected" : ""}>เลือกประเภท</option><option value="live_online"${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "live_online") : ssrLooseEqual(unref(form).type, "live_online")) ? " selected" : ""}>Live Online</option><option value="vod"${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "vod") : ssrLooseEqual(unref(form).type, "vod")) ? " selected" : ""}>VOD</option><option value="hybrid"${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "hybrid") : ssrLooseEqual(unref(form).type, "hybrid")) ? " selected" : ""}>Hybrid</option></select></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> ราคา (บาท) <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).price)} type="number" step="0.01" min="0" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="0.00"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> ระยะเวลา (ชั่วโมง) </label><input${ssrRenderAttr("value", unref(form).duration_hours)} type="number" min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="0"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> ระดับ </label><select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).level) ? ssrLooseContain(unref(form).level, "") : ssrLooseEqual(unref(form).level, "")) ? " selected" : ""}>เลือกระดับ</option><option value="beginner"${ssrIncludeBooleanAttr(Array.isArray(unref(form).level) ? ssrLooseContain(unref(form).level, "beginner") : ssrLooseEqual(unref(form).level, "beginner")) ? " selected" : ""}>เริ่มต้น</option><option value="intermediate"${ssrIncludeBooleanAttr(Array.isArray(unref(form).level) ? ssrLooseContain(unref(form).level, "intermediate") : ssrLooseEqual(unref(form).level, "intermediate")) ? " selected" : ""}>กลาง</option><option value="advanced"${ssrIncludeBooleanAttr(Array.isArray(unref(form).level) ? ssrLooseContain(unref(form).level, "advanced") : ssrLooseEqual(unref(form).level, "advanced")) ? " selected" : ""}>สูง</option></select></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> สถานะ <span class="text-red-500">*</span></label><select required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value="draft"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "draft") : ssrLooseEqual(unref(form).status, "draft")) ? " selected" : ""}>ร่าง</option><option value="published"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "published") : ssrLooseEqual(unref(form).status, "published")) ? " selected" : ""}>เผยแพร่</option><option value="archived"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "archived") : ssrLooseEqual(unref(form).status, "archived")) ? " selected" : ""}>เก็บถาวร</option></select></div><div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-2"> สาขา <span class="text-red-500">*</span></label>`);
        if (unref(loadingBranches)) {
          _push(`<div class="text-sm text-gray-500 py-2"> กำลังโหลดรายการสาขา... </div>`);
        } else if (unref(availableBranches).length === 0) {
          _push(`<div class="text-sm text-yellow-600 py-2 bg-yellow-50 border border-yellow-200 rounded p-2"> ⚠️ ไม่พบสาขา กรุณาสร้างสาขาก่อนแก้ไขคอร์ส </div>`);
        } else {
          _push(`<div class="space-y-2 border border-gray-300 rounded-lg p-3"><!--[-->`);
          ssrRenderList(unref(availableBranches), (branch) => {
            _push(`<div class="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0"><label class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"><input type="checkbox"${ssrRenderAttr("value", branch.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).selectedBranches) ? ssrLooseContain(unref(form).selectedBranches, branch.id) : unref(form).selectedBranches) ? " checked" : ""} class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"><div class="flex-1"><span class="text-sm font-medium text-gray-700">${ssrInterpolate(branch.name)}</span>`);
            if (branch.code) {
              _push(`<span class="text-xs text-gray-500 ml-1">(${ssrInterpolate(branch.code)})</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></label>`);
            if (unref(form).selectedBranches.includes(branch.id)) {
              _push(`<div class="mt-2 ml-6"><label class="block text-xs font-medium text-gray-600 mb-1"> จำนวนที่เปิดรับ (ที่นั่ง) </label><input type="number"${ssrRenderAttr("value", getBranchSeatLimit(branch.id))} min="1" class="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="ไม่จำกัด (เว้นว่าง)"><p class="text-xs text-gray-500 mt-1">เว้นว่างหากไม่จำกัดจำนวนที่นั่ง</p></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          });
          _push(`<!--]--></div>`);
        }
        if (unref(form).selectedBranches.length === 0 && !unref(loadingBranches) && unref(availableBranches).length > 0) {
          _push(`<p class="text-xs text-red-500 mt-1"> กรุณาเลือกอย่างน้อย 1 สาขา </p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-2"> รูปภาพปก <span class="text-red-500">*</span></label><div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3"><p class="text-sm font-semibold text-blue-900 mb-2">📐 ขนาดที่แนะนำ:</p><ul class="text-sm text-blue-800 space-y-1 list-disc list-inside"><li><strong>ขนาด:</strong> 1280 x 720 pixels</li><li><strong>สัดส่วน:</strong> 16:9 (แนวนอน)</li><li><strong>รูปแบบ:</strong> JPG, PNG, WebP</li><li><strong>ขนาดไฟล์:</strong> ไม่เกิน 2 MB (แนะนำ &lt; 500 KB)</li></ul></div><div class="space-y-3">`);
        if (unref(uploadingThumbnail)) {
          _push(`<div class="text-sm text-gray-600 py-2"> กำลังอัปโหลด... </div>`);
        } else if (unref(form).thumbnail_url) {
          _push(`<div class="space-y-3"><p class="text-sm text-gray-600">ตัวอย่าง (สัดส่วน 16:9):</p><div class="aspect-video bg-gray-200 rounded-lg overflow-hidden max-w-2xl"><img${ssrRenderAttr("src", unref(form).thumbnail_url)} alt="Thumbnail preview" class="w-full h-full object-cover"></div><button type="button" class="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg border border-red-200"> ลบรูปภาพ </button></div>`);
        } else {
          _push(`<div class="border-2 border-dashed border-gray-300 rounded-lg p-4"><input type="file" accept="image/jpeg,image/png,image/webp" class="hidden"><button type="button" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"><svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg> อัปโหลดรูปภาพปก </button><p class="text-xs text-gray-500 mt-2 text-center">รองรับไฟล์: JPG, PNG, WebP (สูงสุด 2 MB)</p></div>`);
        }
        _push(`</div>`);
        if (unref(submitError) && (unref(submitError).includes("รูป") || unref(submitError).includes("สัดส่วน"))) {
          _push(`<p class="mt-2 text-sm text-red-600">${ssrInterpolate(unref(submitError))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-2"> คำอธิบาย </label>`);
        _push(ssrRenderComponent(RichTextEditor, {
          modelValue: unref(form).description,
          "onUpdate:modelValue": ($event) => unref(form).description = $event,
          "entity-type": "courses",
          "entity-id": unref(courseId),
          class: "w-full"
        }, null, _parent));
        _push(`</div></div>`);
        if (unref(submitError)) {
          _push(`<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">${ssrInterpolate(unref(submitError))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex justify-end space-x-3 pt-4 border-t"><button type="button" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"> ยกเลิก </button><button type="submit"${ssrIncludeBooleanAttr(unref(submitting)) ? " disabled" : ""} class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">`);
        if (unref(submitting)) {
          _push(`<span>กำลังบันทึก...</span>`);
        } else {
          _push(`<span>บันทึก</span>`);
        }
        _push(`</button></div></form><!--]-->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/courses/[id]/edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };;globalThis.__timing__.logEnd('Load chunks/build/edit-KCC45fLa');
//# sourceMappingURL=edit-KCC45fLa.mjs.map
