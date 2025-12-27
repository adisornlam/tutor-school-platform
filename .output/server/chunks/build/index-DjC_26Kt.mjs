import { defineComponent, ref, reactive, unref, watch, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
import { R as RichTextEditor } from './RichTextEditor-BKbhyB-N.mjs';
import { u as useAuth, b as useRouter, c as useRuntimeConfig } from './server.mjs';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
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
  __name: "CourseModal",
  __ssrInlineRender: true,
  props: {
    show: { type: Boolean },
    course: { default: null }
  },
  emits: ["close", "saved"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const config = useRuntimeConfig();
    const { accessToken } = useAuth();
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
    const loading = ref(false);
    const loadingBranches = ref(false);
    const error = ref("");
    const branchError = ref("");
    const availableBranches = ref([]);
    const branchSeatLimits = ref({});
    const uploadingThumbnail = ref(false);
    ref(null);
    const loadBranches = async () => {
      loadingBranches.value = true;
      branchError.value = "";
      try {
        const response = await $fetch(
          `${config.public.apiBase}/admin/branches`,
          {
            headers: {
              Authorization: `Bearer ${accessToken.value}`
            }
          }
        );
        if (response.success) {
          availableBranches.value = response.data || [];
          console.log("[CourseModal] Loaded branches:", availableBranches.value.length);
          if (availableBranches.value.length === 0) {
            branchError.value = "ไม่พบสาขาในระบบ กรุณาสร้างสาขาก่อนสร้างคอร์ส";
          }
        } else {
          branchError.value = "ไม่สามารถโหลดรายการสาขาได้";
        }
      } catch (err) {
        console.error("[CourseModal] Error loading branches:", err);
        branchError.value = err.data?.message || err.message || "เกิดข้อผิดพลาดในการโหลดรายการสาขา";
      } finally {
        loadingBranches.value = false;
      }
    };
    const getBranchSeatLimit = (branchId) => {
      return branchSeatLimits.value[branchId] ?? "";
    };
    watch(() => props.course, (course) => {
      if (course) {
        form.title = course.title;
        form.description = course.description || "";
        form.type = course.type;
        form.price = course.price;
        form.duration_hours = course.duration_hours || null;
        form.level = course.level || "";
        form.status = course.status;
        form.code = course.code || "";
        form.thumbnail_url = course.thumbnail_url || "";
        if (course.branches && course.branches.length > 0) {
          form.selectedBranches = course.branches.map((b) => b.branch_id);
          course.branches.forEach((b) => {
            if (b.seat_limit !== null && b.seat_limit !== void 0) {
              branchSeatLimits.value[b.branch_id] = b.seat_limit;
            }
          });
        } else {
          form.selectedBranches = [];
        }
      } else {
        form.title = "";
        form.description = "";
        form.type = "";
        form.price = 0;
        form.duration_hours = null;
        form.level = "";
        form.status = "draft";
        form.code = "";
        form.thumbnail_url = "";
        form.selectedBranches = [];
        branchSeatLimits.value = {};
      }
      error.value = "";
      branchError.value = "";
    }, { immediate: true });
    watch(() => props.show, (show) => {
      if (show) {
        loadBranches();
        if (!props.course) {
          branchSeatLimits.value = {};
        }
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.show) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" }, _attrs))}><div class="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto"><div class="flex items-center justify-between mb-6"><h2 class="text-2xl font-bold">${ssrInterpolate(__props.course ? "แก้ไขคอร์ส" : "เพิ่มคอร์ส")}</h2><button class="text-gray-400 hover:text-gray-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><form class="space-y-4"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-2"> ชื่อคอร์ส <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).title)} type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="กรุณากรอกชื่อคอร์ส"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> รหัสคอร์ส </label><input${ssrRenderAttr("value", unref(form).code)} type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="เช่น COURSE001"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> ประเภท <span class="text-red-500">*</span></label><select required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "") : ssrLooseEqual(unref(form).type, "")) ? " selected" : ""}>เลือกประเภท</option><option value="live_online"${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "live_online") : ssrLooseEqual(unref(form).type, "live_online")) ? " selected" : ""}>Live Online</option><option value="vod"${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "vod") : ssrLooseEqual(unref(form).type, "vod")) ? " selected" : ""}>VOD</option><option value="hybrid"${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "hybrid") : ssrLooseEqual(unref(form).type, "hybrid")) ? " selected" : ""}>Hybrid</option></select></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> ราคา (บาท) <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).price)} type="number" step="0.01" min="0" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="0.00"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> ระยะเวลา (ชั่วโมง) </label><input${ssrRenderAttr("value", unref(form).duration_hours)} type="number" min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="0"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> ระดับ </label><select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).level) ? ssrLooseContain(unref(form).level, "") : ssrLooseEqual(unref(form).level, "")) ? " selected" : ""}>เลือกระดับ</option><option value="beginner"${ssrIncludeBooleanAttr(Array.isArray(unref(form).level) ? ssrLooseContain(unref(form).level, "beginner") : ssrLooseEqual(unref(form).level, "beginner")) ? " selected" : ""}>เริ่มต้น</option><option value="intermediate"${ssrIncludeBooleanAttr(Array.isArray(unref(form).level) ? ssrLooseContain(unref(form).level, "intermediate") : ssrLooseEqual(unref(form).level, "intermediate")) ? " selected" : ""}>กลาง</option><option value="advanced"${ssrIncludeBooleanAttr(Array.isArray(unref(form).level) ? ssrLooseContain(unref(form).level, "advanced") : ssrLooseEqual(unref(form).level, "advanced")) ? " selected" : ""}>สูง</option></select></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> สถานะ <span class="text-red-500">*</span></label><select required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value="draft"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "draft") : ssrLooseEqual(unref(form).status, "draft")) ? " selected" : ""}>ร่าง</option><option value="published"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "published") : ssrLooseEqual(unref(form).status, "published")) ? " selected" : ""}>เผยแพร่</option><option value="archived"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "archived") : ssrLooseEqual(unref(form).status, "archived")) ? " selected" : ""}>เก็บถาวร</option></select></div><div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-2"> สาขา <span class="text-red-500">*</span></label>`);
        if (unref(loadingBranches)) {
          _push(`<div class="text-sm text-gray-500 py-2"> กำลังโหลดรายการสาขา... </div>`);
        } else if (unref(branchError)) {
          _push(`<div class="text-sm text-red-500 py-2 bg-red-50 border border-red-200 rounded p-2">${ssrInterpolate(unref(branchError))}</div>`);
        } else if (unref(availableBranches).length === 0) {
          _push(`<div class="text-sm text-yellow-600 py-2 bg-yellow-50 border border-yellow-200 rounded p-2"> ⚠️ ไม่พบสาขา กรุณาสร้างสาขาก่อนสร้างคอร์ส </div>`);
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
        _push(`</div><div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-2"> รูปภาพปก </label><div class="space-y-3"><div class="bg-blue-50 border border-blue-200 rounded-lg p-4"><p class="text-sm font-semibold text-blue-900 mb-2">📐 ขนาดที่แนะนำ:</p><ul class="text-sm text-blue-800 space-y-1 list-disc list-inside"><li><strong>ขนาด:</strong> 1280 x 720 pixels</li><li><strong>สัดส่วน:</strong> 16:9 (แนวนอน)</li><li><strong>รูปแบบ:</strong> JPG, PNG, WebP</li><li><strong>ขนาดไฟล์:</strong> ไม่เกิน 2 MB (แนะนำ &lt; 500 KB)</li></ul></div>`);
        if (unref(uploadingThumbnail)) {
          _push(`<div class="text-sm text-gray-600 py-2"> กำลังอัปโหลด... </div>`);
        } else if (unref(form).thumbnail_url) {
          _push(`<div class="space-y-3"><div class="aspect-video bg-gray-200 rounded-lg overflow-hidden max-w-2xl"><img${ssrRenderAttr("src", unref(form).thumbnail_url)} alt="Thumbnail preview" class="w-full h-full object-cover"></div><button type="button" class="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg border border-red-200"> ลบรูปภาพ </button></div>`);
        } else {
          _push(`<div class="border-2 border-dashed border-gray-300 rounded-lg p-4"><input type="file" accept="image/jpeg,image/png,image/webp" class="hidden"><button type="button" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"><svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg> อัปโหลดรูปภาพปก </button><p class="text-xs text-gray-500 mt-2 text-center">รองรับไฟล์: JPG, PNG, WebP (สูงสุด 2 MB)</p></div>`);
        }
        _push(`</div></div><div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-2"> คำอธิบาย </label>`);
        _push(ssrRenderComponent(RichTextEditor, {
          modelValue: unref(form).description,
          "onUpdate:modelValue": ($event) => unref(form).description = $event,
          "entity-type": "courses",
          "entity-id": props.course?.id,
          class: "w-full"
        }, null, _parent));
        _push(`</div></div>`);
        if (unref(error)) {
          _push(`<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">${ssrInterpolate(unref(error))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex justify-end space-x-3 pt-4"><button type="button" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"> ยกเลิก </button><button type="submit"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">`);
        if (unref(loading)) {
          _push(`<span>กำลังบันทึก...</span>`);
        } else {
          _push(`<span>บันทึก</span>`);
        }
        _push(`</button></div></form></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CourseModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$1, { __name: "CourseModal" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const config = useRuntimeConfig();
    const { accessToken } = useAuth();
    useRouter();
    const courses = ref([]);
    const loading = ref(true);
    const error = ref("");
    const showCreateModal = ref(false);
    const filters = reactive({
      search: "",
      type: "",
      status: ""
    });
    const loadCourses = async () => {
      loading.value = true;
      error.value = "";
      try {
        const params = {};
        if (filters.search) params.search = filters.search;
        if (filters.type) params.type = filters.type;
        if (filters.status) params.status = filters.status;
        const response = await $fetch(`${config.public.apiBase}/admin/courses`, {
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          },
          params
        });
        if (response.success) {
          courses.value = response.data;
        }
      } catch (err) {
        console.error("Error loading courses:", err);
        error.value = err.data?.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      } finally {
        loading.value = false;
      }
    };
    const closeModal = () => {
      showCreateModal.value = false;
    };
    const handleCourseSaved = async () => {
      closeModal();
      await loadCourses();
    };
    const getTypeName = (type) => {
      const typeNames = {
        live_online: "Live Online",
        vod: "VOD",
        hybrid: "Hybrid"
      };
      return typeNames[type] || type;
    };
    const getTypeBadgeClass = (type) => {
      const classes = {
        live_online: "bg-blue-100 text-blue-800",
        vod: "bg-purple-100 text-purple-800",
        hybrid: "bg-indigo-100 text-indigo-800"
      };
      return classes[type] || "bg-gray-100 text-gray-800";
    };
    const getStatusName = (status) => {
      const statusNames = {
        draft: "ร่าง",
        published: "เผยแพร่",
        archived: "เก็บถาวร"
      };
      return statusNames[status] || status;
    };
    const getStatusBadgeClass = (status) => {
      const classes = {
        draft: "bg-gray-100 text-gray-800",
        published: "bg-green-100 text-green-800",
        archived: "bg-yellow-100 text-yellow-800"
      };
      return classes[status] || "bg-gray-100 text-gray-800";
    };
    const getLevelName = (level) => {
      const levelNames = {
        beginner: "เริ่มต้น",
        intermediate: "กลาง",
        advanced: "สูง"
      };
      return levelNames[level] || level;
    };
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("th-TH", {
        style: "currency",
        currency: "THB"
      }).format(amount);
    };
    const formatDate = (date) => {
      return format(new Date(date), "dd MMM yyyy", { locale: th });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CourseModal = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="flex items-center justify-between mb-6"><h1 class="text-3xl font-bold">คอร์สเรียน</h1><button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg><span>เพิ่มคอร์ส</span></button></div><div class="bg-white rounded-lg shadow p-4 mb-6"><div class="grid grid-cols-1 md:grid-cols-3 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2">ค้นหา</label><input${ssrRenderAttr("value", unref(filters).search)} type="text" placeholder="ค้นหาด้วยชื่อคอร์ส, รหัสคอร์ส" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2">ประเภท</label><select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filters).type) ? ssrLooseContain(unref(filters).type, "") : ssrLooseEqual(unref(filters).type, "")) ? " selected" : ""}>ทั้งหมด</option><option value="live_online"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).type) ? ssrLooseContain(unref(filters).type, "live_online") : ssrLooseEqual(unref(filters).type, "live_online")) ? " selected" : ""}>Live Online</option><option value="vod"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).type) ? ssrLooseContain(unref(filters).type, "vod") : ssrLooseEqual(unref(filters).type, "vod")) ? " selected" : ""}>VOD</option><option value="hybrid"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).type) ? ssrLooseContain(unref(filters).type, "hybrid") : ssrLooseEqual(unref(filters).type, "hybrid")) ? " selected" : ""}>Hybrid</option></select></div><div><label class="block text-sm font-medium text-gray-700 mb-2">สถานะ</label><select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "") : ssrLooseEqual(unref(filters).status, "")) ? " selected" : ""}>ทั้งหมด</option><option value="draft"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "draft") : ssrLooseEqual(unref(filters).status, "draft")) ? " selected" : ""}>ร่าง</option><option value="published"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "published") : ssrLooseEqual(unref(filters).status, "published")) ? " selected" : ""}>เผยแพร่</option><option value="archived"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "archived") : ssrLooseEqual(unref(filters).status, "archived")) ? " selected" : ""}>เก็บถาวร</option></select></div></div></div><div class="bg-white rounded-lg shadow overflow-hidden">`);
      if (unref(loading)) {
        _push(`<div class="p-8 text-center"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div><p class="mt-2 text-gray-600">กำลังโหลด...</p></div>`);
      } else if (unref(error)) {
        _push(`<div class="p-4 bg-red-50 border border-red-200 text-red-700 rounded">${ssrInterpolate(unref(error))}</div>`);
      } else if (unref(courses).length === 0) {
        _push(`<div class="p-8 text-center text-gray-500"> ไม่พบคอร์สเรียน </div>`);
      } else {
        _push(`<table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">คอร์ส</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ประเภท</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ราคา</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ระดับ</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่สร้าง</th><th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th></tr></thead><tbody class="bg-white divide-y divide-gray-200"><!--[-->`);
        ssrRenderList(unref(courses), (course) => {
          _push(`<tr class="hover:bg-gray-50"><td class="px-6 py-4 cursor-pointer"><div><div class="text-sm font-medium text-green-600 hover:text-green-700 cursor-pointer">${ssrInterpolate(course.title)}</div>`);
          if (course.code) {
            _push(`<div class="text-xs text-gray-500">รหัส: ${ssrInterpolate(course.code)}</div>`);
          } else {
            _push(`<!---->`);
          }
          if (course.description) {
            _push(`<div class="text-xs text-gray-400 mt-1 line-clamp-2">${ssrInterpolate(course.description)}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></td><td class="px-6 py-4 whitespace-nowrap"><span class="${ssrRenderClass([getTypeBadgeClass(course.type), "px-2 py-1 text-xs font-medium rounded"])}">${ssrInterpolate(getTypeName(course.type))}</span></td><td class="px-6 py-4 whitespace-nowrap"><span class="text-sm font-medium text-gray-900">${ssrInterpolate(formatCurrency(course.price))}</span></td><td class="px-6 py-4 whitespace-nowrap">`);
          if (course.level) {
            _push(`<span class="text-sm text-gray-600">${ssrInterpolate(getLevelName(course.level))}</span>`);
          } else {
            _push(`<span class="text-sm text-gray-400">-</span>`);
          }
          _push(`</td><td class="px-6 py-4 whitespace-nowrap"><span class="${ssrRenderClass([getStatusBadgeClass(course.status), "px-2 py-1 text-xs font-medium rounded"])}">${ssrInterpolate(getStatusName(course.status))}</span></td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${ssrInterpolate(formatDate(course.created_at))}</td><td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><div class="flex items-center justify-end space-x-2"><button class="text-green-600 hover:text-green-900" title="แก้ไข"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>`);
          if (course.status === "published") {
            _push(`<button class="text-yellow-600 hover:text-yellow-900" title="เก็บถาวร"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg></button>`);
          } else if (course.status === "archived") {
            _push(`<button class="text-green-600 hover:text-green-900" title="เผยแพร่"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></button>`);
          } else if (course.status === "draft") {
            _push(`<button class="text-blue-600 hover:text-blue-900" title="เผยแพร่"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<button class="text-red-600 hover:text-red-900" title="ลบ"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></div></td></tr>`);
        });
        _push(`<!--]--></tbody></table>`);
      }
      _push(`</div>`);
      if (unref(showCreateModal)) {
        _push(ssrRenderComponent(_component_CourseModal, {
          show: unref(showCreateModal),
          course: null,
          onClose: closeModal,
          onSaved: handleCourseSaved
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/courses/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DjC_26Kt.mjs.map
