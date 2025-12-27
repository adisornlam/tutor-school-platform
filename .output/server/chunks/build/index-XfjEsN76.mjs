import { defineComponent, ref, reactive, computed, unref, watch, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrRenderStyle, ssrRenderComponent } from 'vue/server-renderer';
import { U as UserRole } from '../nitro/nitro.mjs';
import { u as useAuth, c as useRuntimeConfig } from './server.mjs';
import { startOfWeek, startOfMonth, format, addDays, endOfWeek, endOfMonth, eachDayOfInterval, parseISO, isSameMonth, isSameDay, isToday } from 'date-fns';
import { th } from 'date-fns/locale';
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

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "EventModal",
  __ssrInlineRender: true,
  props: {
    show: { type: Boolean },
    event: {},
    initialDate: {}
  },
  emits: ["close", "saved"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const config = useRuntimeConfig();
    const { accessToken, user } = useAuth();
    const saving = ref(false);
    const availableBranches = ref([]);
    const form = reactive({
      title: "",
      description: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      is_all_day: false,
      location: "",
      event_type: "personal",
      color: "#3B82F6",
      reminder_minutes: null,
      is_shared: false,
      shared_scope: "public",
      shared_branch_id: null
    });
    const colorOptions = [
      { value: "#3B82F6", class: "blue-500", label: "ฟ้า" },
      { value: "#10B981", class: "green-500", label: "เขียว" },
      { value: "#F59E0B", class: "yellow-500", label: "เหลือง" },
      { value: "#EF4444", class: "red-500", label: "แดง" },
      { value: "#8B5CF6", class: "purple-500", label: "ม่วง" },
      { value: "#EC4899", class: "pink-500", label: "ชมพู" }
    ];
    const userRoles = computed(() => user.value?.roles || []);
    const isSystemAdmin = computed(() => userRoles.value.includes(UserRole.SYSTEM_ADMIN) || userRoles.value.includes(UserRole.OWNER));
    const isAdmin = computed(() => userRoles.value.includes(UserRole.ADMIN));
    const isBranchAdmin = computed(() => userRoles.value.includes(UserRole.BRANCH_ADMIN));
    const isTutor = computed(() => userRoles.value.includes(UserRole.TUTOR));
    const isStudent = computed(() => userRoles.value.includes(UserRole.STUDENT));
    const isParent = computed(() => userRoles.value.includes(UserRole.PARENT));
    const canCreateHoliday = computed(() => isSystemAdmin.value || isAdmin.value || isBranchAdmin.value);
    const canCreateAnnouncement = computed(() => isSystemAdmin.value || isAdmin.value || isBranchAdmin.value);
    const canShareToAdmins = computed(() => isSystemAdmin.value || isAdmin.value);
    const canShareToBranchAdmins = computed(() => isSystemAdmin.value || isAdmin.value || isBranchAdmin.value);
    const canShareToTutors = computed(() => isSystemAdmin.value || isAdmin.value || isBranchAdmin.value || isTutor.value);
    const canShareToStudents = computed(() => isSystemAdmin.value || isAdmin.value || isBranchAdmin.value || isTutor.value || isStudent.value);
    const canShareToBranchStudents = computed(() => isSystemAdmin.value || isAdmin.value || isBranchAdmin.value || isTutor.value);
    const canShareToParents = computed(() => isSystemAdmin.value || isAdmin.value || isBranchAdmin.value || isTutor.value || isParent.value);
    const canShareToBranchParents = computed(() => isSystemAdmin.value || isAdmin.value || isBranchAdmin.value || isTutor.value);
    const loadBranches = async () => {
      try {
        const response = await $fetch(`${config.public.apiBase}/admin/branches`, {
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          }
        });
        if (response.success) {
          availableBranches.value = response.data.filter((b) => b.code !== null);
        }
      } catch (error) {
        console.error("Error loading branches:", error);
      }
    };
    const initializeForm = () => {
      if (props.event) {
        const startDate = new Date(props.event.start_datetime);
        const endDate = new Date(props.event.end_datetime);
        form.title = props.event.title;
        form.description = props.event.description || "";
        form.startDate = formatDateInput(startDate);
        form.startTime = formatTimeInput(startDate);
        form.endDate = formatDateInput(endDate);
        form.endTime = formatTimeInput(endDate);
        form.is_all_day = props.event.is_all_day;
        form.location = props.event.location || "";
        form.event_type = props.event.event_type;
        form.color = props.event.color;
        form.reminder_minutes = props.event.reminder_minutes;
        form.is_shared = props.event.is_shared;
        form.shared_scope = props.event.shared_scope;
        form.shared_branch_id = props.event.shared_branch_id;
      } else {
        const baseDate = props.initialDate || /* @__PURE__ */ new Date();
        form.startDate = formatDateInput(baseDate);
        form.startTime = formatTimeInput(baseDate);
        form.endDate = formatDateInput(baseDate);
        form.endTime = formatTimeInput(new Date(baseDate.getTime() + 60 * 60 * 1e3));
        form.is_all_day = false;
        form.is_shared = false;
        form.shared_scope = "public";
        form.shared_branch_id = null;
      }
    };
    const formatDateInput = (date) => {
      return date.toISOString().split("T")[0];
    };
    const formatTimeInput = (date) => {
      return date.toTimeString().slice(0, 5);
    };
    watch(() => props.show, (newVal) => {
      if (newVal) {
        initializeForm();
        if (canShareToBranchAdmins.value || canShareToTutors.value || canShareToBranchStudents.value || canShareToBranchParents.value) {
          loadBranches();
        }
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.show) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" }, _attrs))}><div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"><div class="flex items-center justify-between mb-6"><h2 class="text-2xl font-bold">${ssrInterpolate(__props.event ? "แก้ไข Event" : "สร้าง Event")}</h2><button class="text-gray-400 hover:text-gray-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><form class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-2"> ชื่อ Event <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).title)} type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="เช่น ประชุมทีม, วันหยุดส่วนตัว"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> คำอธิบาย </label><textarea rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="รายละเอียดเพิ่มเติม">${ssrInterpolate(unref(form).description)}</textarea></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2"> เริ่มต้น <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).startDate)} type="date" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">`);
        if (!unref(form).is_all_day) {
          _push(`<input${ssrRenderAttr("value", unref(form).startTime)} type="time" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mt-2">`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-2"> สิ้นสุด <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).endDate)} type="date" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">`);
        if (!unref(form).is_all_day) {
          _push(`<input${ssrRenderAttr("value", unref(form).endTime)} type="time" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mt-2">`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div><label class="flex items-center space-x-2"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).is_all_day) ? ssrLooseContain(unref(form).is_all_day, null) : unref(form).is_all_day) ? " checked" : ""} type="checkbox" class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"><span class="text-sm font-medium text-gray-700">ทั้งวัน</span></label></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> สถานที่ </label><input${ssrRenderAttr("value", unref(form).location)} type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="เช่น ห้องประชุม, Zoom Meeting"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> ประเภท Event </label><select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value="personal"${ssrIncludeBooleanAttr(Array.isArray(unref(form).event_type) ? ssrLooseContain(unref(form).event_type, "personal") : ssrLooseEqual(unref(form).event_type, "personal")) ? " selected" : ""}>ส่วนตัว</option><option value="meeting"${ssrIncludeBooleanAttr(Array.isArray(unref(form).event_type) ? ssrLooseContain(unref(form).event_type, "meeting") : ssrLooseEqual(unref(form).event_type, "meeting")) ? " selected" : ""}>ประชุม</option><option value="holiday"${ssrIncludeBooleanAttr(!unref(canCreateHoliday)) ? " disabled" : ""}${ssrIncludeBooleanAttr(Array.isArray(unref(form).event_type) ? ssrLooseContain(unref(form).event_type, "holiday") : ssrLooseEqual(unref(form).event_type, "holiday")) ? " selected" : ""}>วันหยุด</option><option value="announcement"${ssrIncludeBooleanAttr(!unref(canCreateAnnouncement)) ? " disabled" : ""}${ssrIncludeBooleanAttr(Array.isArray(unref(form).event_type) ? ssrLooseContain(unref(form).event_type, "announcement") : ssrLooseEqual(unref(form).event_type, "announcement")) ? " selected" : ""}>ประกาศ</option><option value="other"${ssrIncludeBooleanAttr(Array.isArray(unref(form).event_type) ? ssrLooseContain(unref(form).event_type, "other") : ssrLooseEqual(unref(form).event_type, "other")) ? " selected" : ""}>อื่นๆ</option></select></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> สี Event </label><div class="flex items-center space-x-2"><!--[-->`);
        ssrRenderList(colorOptions, (colorOption) => {
          _push(`<button type="button" class="${ssrRenderClass([[
            unref(form).color === colorOption.value ? "border-gray-800 scale-110" : "border-gray-300",
            `bg-${colorOption.class}`
          ], "w-10 h-10 rounded-lg border-2 transition-all"])}" style="${ssrRenderStyle({ backgroundColor: colorOption.value })}"></button>`);
        });
        _push(`<!--]--></div></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> แจ้งเตือน </label><select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option${ssrRenderAttr("value", null)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).reminder_minutes) ? ssrLooseContain(unref(form).reminder_minutes, null) : ssrLooseEqual(unref(form).reminder_minutes, null)) ? " selected" : ""}>ไม่แจ้งเตือน</option><option${ssrRenderAttr("value", 15)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).reminder_minutes) ? ssrLooseContain(unref(form).reminder_minutes, 15) : ssrLooseEqual(unref(form).reminder_minutes, 15)) ? " selected" : ""}>15 นาทีก่อน</option><option${ssrRenderAttr("value", 30)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).reminder_minutes) ? ssrLooseContain(unref(form).reminder_minutes, 30) : ssrLooseEqual(unref(form).reminder_minutes, 30)) ? " selected" : ""}>30 นาทีก่อน</option><option${ssrRenderAttr("value", 60)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).reminder_minutes) ? ssrLooseContain(unref(form).reminder_minutes, 60) : ssrLooseEqual(unref(form).reminder_minutes, 60)) ? " selected" : ""}>1 ชั่วโมงก่อน</option><option${ssrRenderAttr("value", 1440)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).reminder_minutes) ? ssrLooseContain(unref(form).reminder_minutes, 1440) : ssrLooseEqual(unref(form).reminder_minutes, 1440)) ? " selected" : ""}>1 วันก่อน</option><option${ssrRenderAttr("value", 2880)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).reminder_minutes) ? ssrLooseContain(unref(form).reminder_minutes, 2880) : ssrLooseEqual(unref(form).reminder_minutes, 2880)) ? " selected" : ""}>2 วันก่อน</option></select></div><div class="border-t pt-4"><label class="flex items-center space-x-2 mb-4"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).is_shared) ? ssrLooseContain(unref(form).is_shared, null) : unref(form).is_shared) ? " checked" : ""} type="checkbox" class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"><span class="text-sm font-medium text-gray-700">แชร์ Event</span></label>`);
        if (unref(form).is_shared) {
          _push(`<div class="space-y-3 pl-6 border-l-2 border-gray-200"><div><label class="block text-sm font-medium text-gray-700 mb-2"> แชร์ให้ </label><div class="space-y-2"><label class="flex items-center space-x-2"><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).shared_scope, "public")) ? " checked" : ""} type="radio" value="public" class="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"><span class="text-sm text-gray-700">ทุกคน (Public)</span></label>`);
          if (unref(canShareToAdmins)) {
            _push(`<label class="flex items-center space-x-2"><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).shared_scope, "admins")) ? " checked" : ""} type="radio" value="admins" class="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"><span class="text-sm text-gray-700">ผู้ดูแลระบบ (Admins)</span></label>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(canShareToBranchAdmins)) {
            _push(`<label class="flex items-center space-x-2"><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).shared_scope, "branch_admins")) ? " checked" : ""} type="radio" value="branch_admins" class="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"><span class="text-sm text-gray-700">ผู้ดูแลสาขา (Branch Admins)</span></label>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(form).shared_scope === "branch_admins" && unref(availableBranches).length > 0) {
            _push(`<div class="ml-6 mt-2"><select class="w-full px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option${ssrRenderAttr("value", null)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).shared_branch_id) ? ssrLooseContain(unref(form).shared_branch_id, null) : ssrLooseEqual(unref(form).shared_branch_id, null)) ? " selected" : ""}>ทุกสาขา</option><!--[-->`);
            ssrRenderList(unref(availableBranches), (branch) => {
              _push(`<option${ssrRenderAttr("value", branch.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).shared_branch_id) ? ssrLooseContain(unref(form).shared_branch_id, branch.id) : ssrLooseEqual(unref(form).shared_branch_id, branch.id)) ? " selected" : ""}>${ssrInterpolate(branch.name)}</option>`);
            });
            _push(`<!--]--></select></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(canShareToTutors)) {
            _push(`<label class="flex items-center space-x-2"><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).shared_scope, "tutors")) ? " checked" : ""} type="radio" value="tutors" class="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"><span class="text-sm text-gray-700">ครูทุกคน (Tutors)</span></label>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(form).shared_scope === "tutors" && unref(availableBranches).length > 0) {
            _push(`<div class="ml-6 mt-2"><select class="w-full px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option${ssrRenderAttr("value", null)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).shared_branch_id) ? ssrLooseContain(unref(form).shared_branch_id, null) : ssrLooseEqual(unref(form).shared_branch_id, null)) ? " selected" : ""}>ทุกสาขา</option><!--[-->`);
            ssrRenderList(unref(availableBranches), (branch) => {
              _push(`<option${ssrRenderAttr("value", branch.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).shared_branch_id) ? ssrLooseContain(unref(form).shared_branch_id, branch.id) : ssrLooseEqual(unref(form).shared_branch_id, branch.id)) ? " selected" : ""}>${ssrInterpolate(branch.name)}</option>`);
            });
            _push(`<!--]--></select></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(canShareToStudents)) {
            _push(`<label class="flex items-center space-x-2"><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).shared_scope, "students")) ? " checked" : ""} type="radio" value="students" class="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"><span class="text-sm text-gray-700">นักเรียนทุกคน (Students)</span></label>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(canShareToBranchStudents)) {
            _push(`<label class="flex items-center space-x-2"><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).shared_scope, "branch_students")) ? " checked" : ""} type="radio" value="branch_students" class="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"><span class="text-sm text-gray-700">นักเรียนในสาขา (Branch Students)</span></label>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(form).shared_scope === "branch_students" && unref(availableBranches).length > 0) {
            _push(`<div class="ml-6 mt-2"><select required class="w-full px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).shared_branch_id) ? ssrLooseContain(unref(form).shared_branch_id, "") : ssrLooseEqual(unref(form).shared_branch_id, "")) ? " selected" : ""}>เลือกสาขา</option><!--[-->`);
            ssrRenderList(unref(availableBranches), (branch) => {
              _push(`<option${ssrRenderAttr("value", branch.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).shared_branch_id) ? ssrLooseContain(unref(form).shared_branch_id, branch.id) : ssrLooseEqual(unref(form).shared_branch_id, branch.id)) ? " selected" : ""}>${ssrInterpolate(branch.name)}</option>`);
            });
            _push(`<!--]--></select></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(canShareToParents)) {
            _push(`<label class="flex items-center space-x-2"><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).shared_scope, "parents")) ? " checked" : ""} type="radio" value="parents" class="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"><span class="text-sm text-gray-700">ผู้ปกครองทุกคน (Parents)</span></label>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(canShareToBranchParents)) {
            _push(`<label class="flex items-center space-x-2"><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).shared_scope, "branch_parents")) ? " checked" : ""} type="radio" value="branch_parents" class="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"><span class="text-sm text-gray-700">ผู้ปกครองในสาขา (Branch Parents)</span></label>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(form).shared_scope === "branch_parents" && unref(availableBranches).length > 0) {
            _push(`<div class="ml-6 mt-2"><select required class="w-full px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).shared_branch_id) ? ssrLooseContain(unref(form).shared_branch_id, "") : ssrLooseEqual(unref(form).shared_branch_id, "")) ? " selected" : ""}>เลือกสาขา</option><!--[-->`);
            ssrRenderList(unref(availableBranches), (branch) => {
              _push(`<option${ssrRenderAttr("value", branch.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).shared_branch_id) ? ssrLooseContain(unref(form).shared_branch_id, branch.id) : ssrLooseEqual(unref(form).shared_branch_id, branch.id)) ? " selected" : ""}>${ssrInterpolate(branch.name)}</option>`);
            });
            _push(`<!--]--></select></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex items-center justify-end space-x-4 pt-4 border-t"><button type="button" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"> ยกเลิก </button><button type="submit"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">`);
        if (unref(saving)) {
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
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/EventModal.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$3, { __name: "EventModal" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "TaskModal",
  __ssrInlineRender: true,
  props: {
    show: { type: Boolean },
    task: {},
    initialDate: {}
  },
  emits: ["close", "saved"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    useAuth();
    const saving = ref(false);
    const form = reactive({
      title: "",
      description: "",
      start_date: "",
      due_date: "",
      priority: "medium",
      status: "not_started",
      color: "#10B981",
      category: ""
    });
    const colorOptions = [
      { value: "#10B981", class: "green-500", label: "เขียว" },
      { value: "#3B82F6", class: "blue-500", label: "ฟ้า" },
      { value: "#F59E0B", class: "yellow-500", label: "เหลือง" },
      { value: "#EF4444", class: "red-500", label: "แดง" },
      { value: "#8B5CF6", class: "purple-500", label: "ม่วง" },
      { value: "#EC4899", class: "pink-500", label: "ชมพู" }
    ];
    const formatDateInput = (date) => {
      if (!date) return "";
      const d = typeof date === "string" ? new Date(date) : date;
      return d.toISOString().split("T")[0];
    };
    const initializeForm = () => {
      if (props.task) {
        form.title = props.task.title;
        form.description = props.task.description || "";
        form.start_date = formatDateInput(props.task.start_date);
        form.due_date = formatDateInput(props.task.due_date);
        form.priority = props.task.priority;
        form.status = props.task.status;
        form.color = props.task.color;
        form.category = props.task.category || "";
      } else {
        form.title = "";
        form.description = "";
        if (props.initialDate) {
          form.start_date = formatDateInput(props.initialDate);
          form.due_date = formatDateInput(props.initialDate);
        } else {
          form.start_date = "";
          form.due_date = "";
        }
        form.priority = "medium";
        form.status = "not_started";
        form.color = "#10B981";
        form.category = "";
      }
    };
    watch(() => props.show, (newVal) => {
      if (newVal) {
        initializeForm();
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.show) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" }, _attrs))}><div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"><div class="flex items-center justify-between mb-6"><h2 class="text-2xl font-bold">${ssrInterpolate(__props.task ? "แก้ไขงาน" : "สร้างงาน")}</h2><button class="text-gray-400 hover:text-gray-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><form class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-2"> ชื่องาน <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).title)} type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="เช่น จัดทำรายงาน, ตรวจสอบงานนักเรียน"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> คำอธิบาย </label><textarea rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="รายละเอียดเพิ่มเติม">${ssrInterpolate(unref(form).description)}</textarea></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2"> วันที่เริ่มต้น </label><input${ssrRenderAttr("value", unref(form).start_date)} type="date" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> วันครบกำหนด </label><input${ssrRenderAttr("value", unref(form).due_date)} type="date" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2"> ลำดับความสำคัญ </label><select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value="low"${ssrIncludeBooleanAttr(Array.isArray(unref(form).priority) ? ssrLooseContain(unref(form).priority, "low") : ssrLooseEqual(unref(form).priority, "low")) ? " selected" : ""}>ต่ำ</option><option value="medium"${ssrIncludeBooleanAttr(Array.isArray(unref(form).priority) ? ssrLooseContain(unref(form).priority, "medium") : ssrLooseEqual(unref(form).priority, "medium")) ? " selected" : ""}>ปานกลาง</option><option value="high"${ssrIncludeBooleanAttr(Array.isArray(unref(form).priority) ? ssrLooseContain(unref(form).priority, "high") : ssrLooseEqual(unref(form).priority, "high")) ? " selected" : ""}>สูง</option><option value="urgent"${ssrIncludeBooleanAttr(Array.isArray(unref(form).priority) ? ssrLooseContain(unref(form).priority, "urgent") : ssrLooseEqual(unref(form).priority, "urgent")) ? " selected" : ""}>ด่วน</option></select></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> สถานะ </label><select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value="not_started"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "not_started") : ssrLooseEqual(unref(form).status, "not_started")) ? " selected" : ""}>ยังไม่เริ่ม</option><option value="in_progress"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "in_progress") : ssrLooseEqual(unref(form).status, "in_progress")) ? " selected" : ""}>กำลังทำ</option><option value="completed"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "completed") : ssrLooseEqual(unref(form).status, "completed")) ? " selected" : ""}>เสร็จสิ้น</option><option value="cancelled"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "cancelled") : ssrLooseEqual(unref(form).status, "cancelled")) ? " selected" : ""}>ยกเลิก</option></select></div></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> หมวดหมู่ </label><input${ssrRenderAttr("value", unref(form).category)} type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="เช่น การบ้าน, รายงาน, อื่นๆ"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> สีงาน </label><div class="flex items-center space-x-2"><!--[-->`);
        ssrRenderList(colorOptions, (colorOption) => {
          _push(`<button type="button" class="${ssrRenderClass([[
            unref(form).color === colorOption.value ? "border-gray-800 scale-110" : "border-gray-300",
            `bg-${colorOption.class}`
          ], "w-10 h-10 rounded-lg border-2 transition-all"])}" style="${ssrRenderStyle({ backgroundColor: colorOption.value })}"></button>`);
        });
        _push(`<!--]--></div></div><div class="flex items-center justify-end space-x-4 pt-4 border-t"><button type="button" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"> ยกเลิก </button><button type="submit"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">`);
        if (unref(saving)) {
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
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TaskModal.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$2, { __name: "TaskModal" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "AppointmentModal",
  __ssrInlineRender: true,
  props: {
    show: { type: Boolean },
    appointment: {}
  },
  emits: ["close", "saved"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    useAuth();
    const saving = ref(false);
    const form = reactive({
      title: "",
      description: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      appointment_type: "student",
      location: "",
      meeting_link: "",
      status: "scheduled",
      color: "#3B82F6",
      reminder_minutes: null,
      participant_user_ids_input: "",
      participant_user_ids: []
    });
    const colorOptions = [
      { value: "#3B82F6", class: "blue-500", label: "ฟ้า" },
      { value: "#10B981", class: "green-500", label: "เขียว" },
      { value: "#F59E0B", class: "yellow-500", label: "เหลือง" },
      { value: "#EF4444", class: "red-500", label: "แดง" },
      { value: "#8B5CF6", class: "purple-500", label: "ม่วง" },
      { value: "#EC4899", class: "pink-500", label: "ชมพู" }
    ];
    const formatDateInput = (date) => {
      const d = typeof date === "string" ? new Date(date) : date;
      return d.toISOString().split("T")[0];
    };
    const formatTimeInput = (date) => {
      const d = typeof date === "string" ? new Date(date) : date;
      return d.toTimeString().slice(0, 5);
    };
    const initializeForm = () => {
      if (props.appointment) {
        const startDate = new Date(props.appointment.start_datetime);
        const endDate = new Date(props.appointment.end_datetime);
        form.title = props.appointment.title;
        form.description = props.appointment.description || "";
        form.startDate = formatDateInput(startDate);
        form.startTime = formatTimeInput(startDate);
        form.endDate = formatDateInput(endDate);
        form.endTime = formatTimeInput(endDate);
        form.appointment_type = props.appointment.appointment_type;
        form.location = props.appointment.location || "";
        form.meeting_link = props.appointment.meeting_link || "";
        form.status = props.appointment.status;
        form.color = props.appointment.color;
        form.reminder_minutes = props.appointment.reminder_minutes;
        form.participant_user_ids = props.appointment.participants?.map((p) => p.user_id) || [];
        form.participant_user_ids_input = form.participant_user_ids.join(",");
      } else {
        const baseDate = props.initialDate || /* @__PURE__ */ new Date();
        form.startDate = formatDateInput(baseDate);
        form.startTime = formatTimeInput(baseDate);
        form.endDate = formatDateInput(baseDate);
        form.endTime = formatTimeInput(new Date(baseDate.getTime() + 60 * 60 * 1e3));
        form.appointment_type = "student";
        form.status = "scheduled";
        form.participant_user_ids = [];
        form.participant_user_ids_input = "";
      }
    };
    watch(() => props.show, (newVal) => {
      if (newVal) {
        initializeForm();
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.show) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" }, _attrs))}><div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"><div class="flex items-center justify-between mb-6"><h2 class="text-2xl font-bold">${ssrInterpolate(__props.appointment ? "แก้ไขการนัดหมาย" : "สร้างการนัดหมาย")}</h2><button class="text-gray-400 hover:text-gray-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><form class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-2"> หัวข้อ <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).title)} type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="เช่น นัดหมายนักเรียน, ประชุมทีม"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> คำอธิบาย </label><textarea rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="รายละเอียดเพิ่มเติม">${ssrInterpolate(unref(form).description)}</textarea></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2"> เริ่มต้น <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).startDate)} type="date" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><input${ssrRenderAttr("value", unref(form).startTime)} type="time" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mt-2"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> สิ้นสุด <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).endDate)} type="date" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><input${ssrRenderAttr("value", unref(form).endTime)} type="time" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mt-2"></div></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> ประเภทการนัดหมาย </label><select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value="student"${ssrIncludeBooleanAttr(Array.isArray(unref(form).appointment_type) ? ssrLooseContain(unref(form).appointment_type, "student") : ssrLooseEqual(unref(form).appointment_type, "student")) ? " selected" : ""}>นัดหมายนักเรียน</option><option value="meeting"${ssrIncludeBooleanAttr(Array.isArray(unref(form).appointment_type) ? ssrLooseContain(unref(form).appointment_type, "meeting") : ssrLooseEqual(unref(form).appointment_type, "meeting")) ? " selected" : ""}>ประชุม</option><option value="parent"${ssrIncludeBooleanAttr(Array.isArray(unref(form).appointment_type) ? ssrLooseContain(unref(form).appointment_type, "parent") : ssrLooseEqual(unref(form).appointment_type, "parent")) ? " selected" : ""}>นัดหมายผู้ปกครอง</option><option value="staff"${ssrIncludeBooleanAttr(Array.isArray(unref(form).appointment_type) ? ssrLooseContain(unref(form).appointment_type, "staff") : ssrLooseEqual(unref(form).appointment_type, "staff")) ? " selected" : ""}>นัดหมายเจ้าหน้าที่</option><option value="other"${ssrIncludeBooleanAttr(Array.isArray(unref(form).appointment_type) ? ssrLooseContain(unref(form).appointment_type, "other") : ssrLooseEqual(unref(form).appointment_type, "other")) ? " selected" : ""}>อื่นๆ</option></select></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> สถานที่ </label><input${ssrRenderAttr("value", unref(form).location)} type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="เช่น ห้องประชุม, Zoom Meeting"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> ลิงก์ประชุม </label><input${ssrRenderAttr("value", unref(form).meeting_link)} type="url" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="https://zoom.us/j/..."></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> สถานะ </label><select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value="scheduled"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "scheduled") : ssrLooseEqual(unref(form).status, "scheduled")) ? " selected" : ""}>จองแล้ว</option><option value="confirmed"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "confirmed") : ssrLooseEqual(unref(form).status, "confirmed")) ? " selected" : ""}>ยืนยันแล้ว</option><option value="cancelled"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "cancelled") : ssrLooseEqual(unref(form).status, "cancelled")) ? " selected" : ""}>ยกเลิก</option><option value="completed"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "completed") : ssrLooseEqual(unref(form).status, "completed")) ? " selected" : ""}>เสร็จสิ้น</option></select></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> สีการนัดหมาย </label><div class="flex items-center space-x-2"><!--[-->`);
        ssrRenderList(colorOptions, (colorOption) => {
          _push(`<button type="button" class="${ssrRenderClass([[
            unref(form).color === colorOption.value ? "border-gray-800 scale-110" : "border-gray-300",
            `bg-${colorOption.class}`
          ], "w-10 h-10 rounded-lg border-2 transition-all"])}" style="${ssrRenderStyle({ backgroundColor: colorOption.value })}"></button>`);
        });
        _push(`<!--]--></div></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> แจ้งเตือน </label><select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option${ssrRenderAttr("value", null)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).reminder_minutes) ? ssrLooseContain(unref(form).reminder_minutes, null) : ssrLooseEqual(unref(form).reminder_minutes, null)) ? " selected" : ""}>ไม่แจ้งเตือน</option><option${ssrRenderAttr("value", 15)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).reminder_minutes) ? ssrLooseContain(unref(form).reminder_minutes, 15) : ssrLooseEqual(unref(form).reminder_minutes, 15)) ? " selected" : ""}>15 นาทีก่อน</option><option${ssrRenderAttr("value", 30)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).reminder_minutes) ? ssrLooseContain(unref(form).reminder_minutes, 30) : ssrLooseEqual(unref(form).reminder_minutes, 30)) ? " selected" : ""}>30 นาทีก่อน</option><option${ssrRenderAttr("value", 60)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).reminder_minutes) ? ssrLooseContain(unref(form).reminder_minutes, 60) : ssrLooseEqual(unref(form).reminder_minutes, 60)) ? " selected" : ""}>1 ชั่วโมงก่อน</option><option${ssrRenderAttr("value", 1440)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).reminder_minutes) ? ssrLooseContain(unref(form).reminder_minutes, 1440) : ssrLooseEqual(unref(form).reminder_minutes, 1440)) ? " selected" : ""}>1 วันก่อน</option></select></div><div class="border-t pt-4"><label class="block text-sm font-medium text-gray-700 mb-2"> ผู้เข้าร่วม (User IDs - คั่นด้วย comma) </label><input${ssrRenderAttr("value", unref(form).participant_user_ids_input)} type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="เช่น 1,2,3 (User IDs)"><p class="text-xs text-gray-500 mt-1">กรุณาระบุ User IDs คั่นด้วย comma (จะพัฒนาระบบค้นหาผู้ใช้ในอนาคต)</p></div><div class="flex items-center justify-end space-x-4 pt-4 border-t"><button type="button" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"> ยกเลิก </button><button type="submit"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">`);
        if (unref(saving)) {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppointmentModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main$1, { __name: "AppointmentModal" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const config = useRuntimeConfig();
    const { accessToken } = useAuth();
    const schedules = ref([]);
    const events = ref([]);
    const tasks = ref([]);
    const appointments = ref([]);
    const courses = ref([]);
    const loading = ref(true);
    const error = ref("");
    const viewMode = ref("month");
    const dateRange = ref("month");
    const customStartDate = ref("");
    const customEndDate = ref("");
    const currentWeekStart = ref(startOfWeek(/* @__PURE__ */ new Date(), { weekStartsOn: 1 }));
    const currentDay = ref(/* @__PURE__ */ new Date());
    const currentMonth = ref(startOfMonth(/* @__PURE__ */ new Date()));
    ref(null);
    const showViewMenu = ref(false);
    const showCreateMenu = ref(false);
    const showDateMenu = ref({});
    const showEventModal = ref(false);
    const showTaskModal = ref(false);
    const showAppointmentModal = ref(false);
    const selectedEvent = ref(null);
    const selectedTask = ref(null);
    const selectedAppointment = ref(null);
    const selectedDateForCreate = ref(null);
    const viewModes = [
      { value: "day", label: "วัน", shortcut: "D" },
      { value: "week", label: "สัปดาห์", shortcut: "W" },
      { value: "month", label: "เดือน", shortcut: "M" },
      { value: "agenda", label: "กำหนดการ", shortcut: "A" },
      { value: "4days", label: "4 วัน", shortcut: "X" }
    ];
    const filters = reactive({
      status: "",
      courseId: ""
    });
    const currentViewLabel = computed(() => {
      const view = viewModes.find((v) => v.value === viewMode.value);
      return view?.label || "สัปดาห์";
    });
    const isCalendarView = computed(() => {
      return ["day", "week", "month", "4days"].includes(viewMode.value);
    });
    const currentPeriodLabel = computed(() => {
      if (viewMode.value === "day") {
        return format(currentDay.value, "dd MMMM yyyy", { locale: th });
      } else if (viewMode.value === "week") {
        return formatWeekRange(currentWeekStart.value);
      } else if (viewMode.value === "month") {
        return format(currentMonth.value, "MMMM yyyy", { locale: th });
      } else if (viewMode.value === "4days") {
        const endDate = addDays(currentDay.value, 3);
        return `${format(currentDay.value, "dd MMM", { locale: th })} - ${format(endDate, "dd MMM yyyy", { locale: th })}`;
      }
      return "";
    });
    const fourDays = computed(() => {
      const days = [];
      const dayNames = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี"];
      for (let i = 0; i < 4; i++) {
        const date = addDays(currentDay.value, i);
        days.push({
          key: i,
          label: dayNames[i] || format(date, "EEEE", { locale: th }),
          date
        });
      }
      return days;
    });
    const monthDays = computed(() => {
      const start = startOfWeek(startOfMonth(currentMonth.value), { weekStartsOn: 1 });
      const end = endOfWeek(endOfMonth(currentMonth.value), { weekStartsOn: 1 });
      const days = eachDayOfInterval({ start, end });
      return days.map((date, index) => ({
        key: index,
        date
      }));
    });
    const todayCount = computed(() => {
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      return schedules.value.filter(
        (s) => s.start_datetime.startsWith(today) && s.status !== "cancelled"
      ).length;
    });
    const weekCount = computed(() => {
      const weekStart = startOfWeek(/* @__PURE__ */ new Date(), { weekStartsOn: 1 });
      const weekEnd = endOfWeek(/* @__PURE__ */ new Date(), { weekStartsOn: 1 });
      return schedules.value.filter((s) => {
        const scheduleDate = parseISO(s.start_datetime);
        return scheduleDate >= weekStart && scheduleDate <= weekEnd && s.status !== "cancelled";
      }).length;
    });
    const ongoingCount = computed(() => {
      return schedules.value.filter((s) => s.status === "ongoing").length;
    });
    const completedCount = computed(() => {
      return schedules.value.filter((s) => s.status === "completed").length;
    });
    const weekDays = computed(() => {
      const days = [];
      for (let i = 0; i < 7; i++) {
        const date = addDays(currentWeekStart.value, i);
        const dayNames = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "อาทิตย์"];
        days.push({
          key: i,
          label: dayNames[i],
          date
        });
      }
      return days;
    });
    const loadEvents = async () => {
      try {
        const params = {};
        if (viewMode.value === "day") {
          params.start_date = format(currentDay.value, "yyyy-MM-dd");
          params.end_date = format(currentDay.value, "yyyy-MM-dd");
        } else if (viewMode.value === "week") {
          const weekEnd = endOfWeek(currentWeekStart.value, { weekStartsOn: 1 });
          params.start_date = format(currentWeekStart.value, "yyyy-MM-dd");
          params.end_date = format(weekEnd, "yyyy-MM-dd");
        } else if (viewMode.value === "month") {
          const monthStart = startOfMonth(currentMonth.value);
          const monthEnd = endOfMonth(currentMonth.value);
          params.start_date = format(monthStart, "yyyy-MM-dd");
          params.end_date = format(monthEnd, "yyyy-MM-dd");
        } else if (viewMode.value === "4days") {
          const endDate = addDays(currentDay.value, 3);
          params.start_date = format(currentDay.value, "yyyy-MM-dd");
          params.end_date = format(endDate, "yyyy-MM-dd");
        } else if (viewMode.value === "agenda") {
          const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
          params.start_date = today;
        } else {
          if (dateRange.value === "today") {
            const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
            params.start_date = today;
            params.end_date = today;
          } else if (dateRange.value === "week") {
            const weekStart = startOfWeek(/* @__PURE__ */ new Date(), { weekStartsOn: 1 });
            const weekEnd = endOfWeek(/* @__PURE__ */ new Date(), { weekStartsOn: 1 });
            params.start_date = format(weekStart, "yyyy-MM-dd");
            params.end_date = format(weekEnd, "yyyy-MM-dd");
          } else if (dateRange.value === "month") {
            const now = /* @__PURE__ */ new Date();
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            params.start_date = format(monthStart, "yyyy-MM-dd");
            params.end_date = format(monthEnd, "yyyy-MM-dd");
          } else if (dateRange.value === "upcoming") {
            const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
            params.start_date = today;
          } else if (dateRange.value === "custom") {
            if (customStartDate.value) params.start_date = customStartDate.value;
            if (customEndDate.value) params.end_date = customEndDate.value;
          }
        }
        params.include_shared = "true";
        const response = await $fetch(`${config.public.apiBase}/calendar/events`, {
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          },
          params
        });
        if (response.success) {
          events.value = response.data;
        }
      } catch (err) {
        console.error("Error loading events:", err);
      }
    };
    const loadTasks = async () => {
      try {
        const params = {};
        if (viewMode.value === "day") {
          params.start_date = format(currentDay.value, "yyyy-MM-dd");
          params.end_date = format(currentDay.value, "yyyy-MM-dd");
        } else if (viewMode.value === "week") {
          const weekEnd = endOfWeek(currentWeekStart.value, { weekStartsOn: 1 });
          params.start_date = format(currentWeekStart.value, "yyyy-MM-dd");
          params.end_date = format(weekEnd, "yyyy-MM-dd");
        } else if (viewMode.value === "month") {
          const monthStart = startOfMonth(currentMonth.value);
          const monthEnd = endOfMonth(currentMonth.value);
          params.start_date = format(monthStart, "yyyy-MM-dd");
          params.end_date = format(monthEnd, "yyyy-MM-dd");
        } else if (viewMode.value === "4days") {
          const endDate = addDays(currentDay.value, 3);
          params.start_date = format(currentDay.value, "yyyy-MM-dd");
          params.end_date = format(endDate, "yyyy-MM-dd");
        } else if (viewMode.value === "agenda") {
          const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
          params.start_date = today;
        } else {
          if (dateRange.value === "today") {
            const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
            params.start_date = today;
            params.end_date = today;
          } else if (dateRange.value === "week") {
            const weekStart = startOfWeek(/* @__PURE__ */ new Date(), { weekStartsOn: 1 });
            const weekEnd = endOfWeek(/* @__PURE__ */ new Date(), { weekStartsOn: 1 });
            params.start_date = format(weekStart, "yyyy-MM-dd");
            params.end_date = format(weekEnd, "yyyy-MM-dd");
          } else if (dateRange.value === "month") {
            const now = /* @__PURE__ */ new Date();
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            params.start_date = format(monthStart, "yyyy-MM-dd");
            params.end_date = format(monthEnd, "yyyy-MM-dd");
          } else if (dateRange.value === "upcoming") {
            const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
            params.start_date = today;
          } else if (dateRange.value === "custom") {
            if (customStartDate.value) params.start_date = customStartDate.value;
            if (customEndDate.value) params.end_date = customEndDate.value;
          }
        }
        params.include_shared = "true";
        const response = await $fetch(`${config.public.apiBase}/calendar/tasks`, {
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          },
          params
        });
        if (response.success) {
          tasks.value = response.data;
        }
      } catch (err) {
        console.error("Error loading tasks:", err);
      }
    };
    const loadAppointments = async () => {
      try {
        const params = {};
        if (viewMode.value === "day") {
          params.start_date = format(currentDay.value, "yyyy-MM-dd");
          params.end_date = format(currentDay.value, "yyyy-MM-dd");
        } else if (viewMode.value === "week") {
          const weekEnd = endOfWeek(currentWeekStart.value, { weekStartsOn: 1 });
          params.start_date = format(currentWeekStart.value, "yyyy-MM-dd");
          params.end_date = format(weekEnd, "yyyy-MM-dd");
        } else if (viewMode.value === "month") {
          const monthStart = startOfMonth(currentMonth.value);
          const monthEnd = endOfMonth(currentMonth.value);
          params.start_date = format(monthStart, "yyyy-MM-dd");
          params.end_date = format(monthEnd, "yyyy-MM-dd");
        } else if (viewMode.value === "4days") {
          const endDate = addDays(currentDay.value, 3);
          params.start_date = format(currentDay.value, "yyyy-MM-dd");
          params.end_date = format(endDate, "yyyy-MM-dd");
        } else if (viewMode.value === "agenda") {
          const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
          params.start_date = today;
        } else {
          if (dateRange.value === "today") {
            const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
            params.start_date = today;
            params.end_date = today;
          } else if (dateRange.value === "week") {
            const weekStart = startOfWeek(/* @__PURE__ */ new Date(), { weekStartsOn: 1 });
            const weekEnd = endOfWeek(/* @__PURE__ */ new Date(), { weekStartsOn: 1 });
            params.start_date = format(weekStart, "yyyy-MM-dd");
            params.end_date = format(weekEnd, "yyyy-MM-dd");
          } else if (dateRange.value === "month") {
            const now = /* @__PURE__ */ new Date();
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            params.start_date = format(monthStart, "yyyy-MM-dd");
            params.end_date = format(monthEnd, "yyyy-MM-dd");
          } else if (dateRange.value === "upcoming") {
            const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
            params.start_date = today;
          } else if (dateRange.value === "custom") {
            if (customStartDate.value) params.start_date = customStartDate.value;
            if (customEndDate.value) params.end_date = customEndDate.value;
          }
        }
        const response = await $fetch(`${config.public.apiBase}/calendar/appointments`, {
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          },
          params
        });
        if (response.success) {
          appointments.value = response.data;
        }
      } catch (err) {
        console.error("Error loading appointments:", err);
      }
    };
    const getSchedulesForDay = (date) => {
      return schedules.value.filter((schedule) => {
        const scheduleDate = parseISO(schedule.start_datetime);
        return isSameDay(scheduleDate, date);
      });
    };
    const getEventsForDay = (date) => {
      return events.value.filter((event) => {
        const eventDate = parseISO(event.start_datetime);
        return isSameDay(eventDate, date);
      });
    };
    const getTasksForDay = (date) => {
      return tasks.value.filter((task) => {
        if (task.due_date) {
          const taskDate = parseISO(task.due_date);
          return isSameDay(taskDate, date);
        } else if (task.start_date) {
          const taskDate = parseISO(task.start_date);
          return isSameDay(taskDate, date);
        }
        return false;
      });
    };
    const getAppointmentsForDay = (date) => {
      return appointments.value.filter((appointment) => {
        const appointmentDate = parseISO(appointment.start_datetime);
        return isSameDay(appointmentDate, date);
      });
    };
    const handleEventSaved = () => {
      loadEvents();
      showEventModal.value = false;
      selectedEvent.value = null;
    };
    const handleTaskSaved = () => {
      loadTasks();
      showTaskModal.value = false;
      selectedTask.value = null;
    };
    const handleAppointmentSaved = () => {
      loadAppointments();
      showAppointmentModal.value = false;
      selectedAppointment.value = null;
    };
    const isToday$1 = (date) => {
      return isToday(date);
    };
    const formatWeekRange = (weekStart) => {
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      return `${format(weekStart, "dd MMM yyyy", { locale: th })} - ${format(weekEnd, "dd MMM yyyy", { locale: th })}`;
    };
    const formatDay = (date) => {
      return format(date, "d", { locale: th });
    };
    const formatDateTime = (dateTime) => {
      return format(parseISO(dateTime), "dd MMM yyyy", { locale: th });
    };
    const formatTime = (dateTime) => {
      return format(parseISO(dateTime), "HH:mm", { locale: th });
    };
    const formatTimeRange = (start, end) => {
      return `${format(parseISO(start), "HH:mm")} - ${format(parseISO(end), "HH:mm")}`;
    };
    const getStatusName = (status) => {
      const statusNames = {
        scheduled: "กำหนดแล้ว",
        ongoing: "กำลังสอน",
        completed: "เสร็จสิ้น",
        cancelled: "ยกเลิก"
      };
      return statusNames[status] || status;
    };
    const getStatusBadgeClass = (status) => {
      const classes = {
        scheduled: "bg-blue-100 text-blue-800",
        ongoing: "bg-orange-100 text-orange-800",
        completed: "bg-green-100 text-green-800",
        cancelled: "bg-gray-100 text-gray-800"
      };
      return classes[status] || "bg-gray-100 text-gray-800";
    };
    const getSessionTypeName = (type) => {
      const typeNames = {
        live: "Live",
        vod: "VOD"
      };
      return typeNames[type] || type;
    };
    const getSessionTypeBadgeClass = (type) => {
      const classes = {
        live: "bg-red-100 text-red-800",
        vod: "bg-purple-100 text-purple-800"
      };
      return classes[type] || "bg-gray-100 text-gray-800";
    };
    const getScheduleCardClass = (schedule) => {
      if (schedule.status === "completed") return "bg-green-100 text-green-800 border border-green-200";
      if (schedule.status === "ongoing") return "bg-orange-100 text-orange-800 border border-orange-200";
      if (schedule.status === "cancelled") return "bg-gray-100 text-gray-600 border border-gray-200";
      return "bg-blue-100 text-blue-800 border border-blue-200";
    };
    const getScheduleBorderClass = (status) => {
      if (status === "completed") return "border-green-500 bg-green-50";
      if (status === "ongoing") return "border-orange-500 bg-orange-50";
      if (status === "cancelled") return "border-gray-400 bg-gray-50";
      return "border-blue-500 bg-blue-50";
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_EventModal = __nuxt_component_0;
      const _component_TaskModal = __nuxt_component_1;
      const _component_AppointmentModal = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="flex items-center justify-between mb-6"><div><h1 class="text-3xl font-bold">ปฏิทินกิจกรรม</h1><p class="text-gray-600 mt-1">จัดการและดูตารางสอนและกิจกรรมของคุณ</p></div><div class="flex items-center space-x-4"><div class="relative"><button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg><span>สร้าง</span><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button>`);
      if (unref(showCreateMenu)) {
        _push(`<div class="absolute left-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-1 z-50"><button class="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors flex items-center space-x-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><span>กิจกรรม</span></button><button class="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors flex items-center space-x-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg><span>งาน</span></button><button class="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors flex items-center space-x-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg><span>กำหนดเวลาการนัดหมาย</span></button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="relative"><button class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2 text-gray-700"><span>${ssrInterpolate(unref(currentViewLabel))}</span><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button>`);
      if (unref(showViewMenu)) {
        _push(`<div class="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-50"><div class="py-1"><!--[-->`);
        ssrRenderList(viewModes, (view) => {
          _push(`<button class="${ssrRenderClass([{ "bg-gray-700": unref(viewMode) === view.value }, "w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center justify-between"])}"><span>${ssrInterpolate(view.label)}</span><span class="text-gray-400 text-sm">${ssrInterpolate(view.shortcut)}</span></button>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(isCalendarView)) {
        _push(`<div class="flex items-center space-x-2"><button class="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></button><button class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"> วันนี้ </button><button class="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isCalendarView)) {
        _push(`<div class="text-lg font-semibold text-gray-700">${ssrInterpolate(unref(currentPeriodLabel))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"><div class="bg-white rounded-lg shadow p-4"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-600">วันนี้</p><p class="text-2xl font-bold text-gray-900">${ssrInterpolate(unref(todayCount))}</p></div><div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div></div></div><div class="bg-white rounded-lg shadow p-4"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-600">สัปดาห์นี้</p><p class="text-2xl font-bold text-gray-900">${ssrInterpolate(unref(weekCount))}</p></div><div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg></div></div></div><div class="bg-white rounded-lg shadow p-4"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-600">กำลังสอน</p><p class="text-2xl font-bold text-orange-600">${ssrInterpolate(unref(ongoingCount))}</p></div><div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center"><svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div></div></div><div class="bg-white rounded-lg shadow p-4"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-600">เสร็จสิ้น</p><p class="text-2xl font-bold text-green-600">${ssrInterpolate(unref(completedCount))}</p></div><div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div></div></div></div><div class="bg-white rounded-lg shadow p-4 mb-6"><div class="grid grid-cols-1 md:grid-cols-4 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2">ช่วงเวลา</label><select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value="today"${ssrIncludeBooleanAttr(Array.isArray(unref(dateRange)) ? ssrLooseContain(unref(dateRange), "today") : ssrLooseEqual(unref(dateRange), "today")) ? " selected" : ""}>วันนี้</option><option value="week"${ssrIncludeBooleanAttr(Array.isArray(unref(dateRange)) ? ssrLooseContain(unref(dateRange), "week") : ssrLooseEqual(unref(dateRange), "week")) ? " selected" : ""}>สัปดาห์นี้</option><option value="month"${ssrIncludeBooleanAttr(Array.isArray(unref(dateRange)) ? ssrLooseContain(unref(dateRange), "month") : ssrLooseEqual(unref(dateRange), "month")) ? " selected" : ""}>เดือนนี้</option><option value="upcoming"${ssrIncludeBooleanAttr(Array.isArray(unref(dateRange)) ? ssrLooseContain(unref(dateRange), "upcoming") : ssrLooseEqual(unref(dateRange), "upcoming")) ? " selected" : ""}>ที่กำลังจะมาถึง</option><option value="all"${ssrIncludeBooleanAttr(Array.isArray(unref(dateRange)) ? ssrLooseContain(unref(dateRange), "all") : ssrLooseEqual(unref(dateRange), "all")) ? " selected" : ""}>ทั้งหมด</option><option value="custom"${ssrIncludeBooleanAttr(Array.isArray(unref(dateRange)) ? ssrLooseContain(unref(dateRange), "custom") : ssrLooseEqual(unref(dateRange), "custom")) ? " selected" : ""}>กำหนดเอง</option></select></div>`);
      if (unref(dateRange) === "custom") {
        _push(`<div><label class="block text-sm font-medium text-gray-700 mb-2">จากวันที่</label><input${ssrRenderAttr("value", unref(customStartDate))} type="date" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(dateRange) === "custom") {
        _push(`<div><label class="block text-sm font-medium text-gray-700 mb-2">ถึงวันที่</label><input${ssrRenderAttr("value", unref(customEndDate))} type="date" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div><label class="block text-sm font-medium text-gray-700 mb-2">สถานะ</label><select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "") : ssrLooseEqual(unref(filters).status, "")) ? " selected" : ""}>ทั้งหมด</option><option value="scheduled"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "scheduled") : ssrLooseEqual(unref(filters).status, "scheduled")) ? " selected" : ""}>กำหนดแล้ว</option><option value="ongoing"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "ongoing") : ssrLooseEqual(unref(filters).status, "ongoing")) ? " selected" : ""}>กำลังสอน</option><option value="completed"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "completed") : ssrLooseEqual(unref(filters).status, "completed")) ? " selected" : ""}>เสร็จสิ้น</option><option value="cancelled"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).status) ? ssrLooseContain(unref(filters).status, "cancelled") : ssrLooseEqual(unref(filters).status, "cancelled")) ? " selected" : ""}>ยกเลิก</option></select></div><div><label class="block text-sm font-medium text-gray-700 mb-2">คอร์ส</label><select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filters).courseId) ? ssrLooseContain(unref(filters).courseId, "") : ssrLooseEqual(unref(filters).courseId, "")) ? " selected" : ""}>ทั้งหมด</option><!--[-->`);
      ssrRenderList(unref(courses), (course) => {
        _push(`<option${ssrRenderAttr("value", course.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(filters).courseId) ? ssrLooseContain(unref(filters).courseId, course.id) : ssrLooseEqual(unref(filters).courseId, course.id)) ? " selected" : ""}>${ssrInterpolate(course.title)}</option>`);
      });
      _push(`<!--]--></select></div></div></div>`);
      if (unref(viewMode) === "day") {
        _push(`<div class="bg-white rounded-lg shadow p-6">`);
        if (unref(loading)) {
          _push(`<div class="p-8 text-center"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div><p class="mt-2 text-gray-600">กำลังโหลด...</p></div>`);
        } else if (unref(error)) {
          _push(`<div class="p-4 bg-red-50 border border-red-200 text-red-700 rounded">${ssrInterpolate(unref(error))}</div>`);
        } else {
          _push(`<div><div class="space-y-4"><!--[-->`);
          ssrRenderList(getEventsForDay(unref(currentDay)), (event) => {
            _push(`<div class="border-l-4 p-4 rounded-r-lg cursor-pointer hover:shadow-md transition-shadow" style="${ssrRenderStyle({ borderColor: event.color })}"><div class="flex items-start justify-between"><div class="flex-1"><div class="flex items-center space-x-2 mb-2"><span class="text-lg font-semibold text-gray-900">${ssrInterpolate(event.title)}</span><span class="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700"> Event </span>`);
            if (event.is_shared) {
              _push(`<span class="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700"> แชร์ </span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div><div class="text-sm text-gray-600 mb-2">`);
            if (event.location) {
              _push(`<div>สถานที่: ${ssrInterpolate(event.location)}</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<div>เวลา: ${ssrInterpolate(formatTimeRange(event.start_datetime, event.end_datetime))}</div>`);
            if (event.description) {
              _push(`<div class="mt-1 text-gray-500">${ssrInterpolate(event.description)}</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div></div></div>`);
          });
          _push(`<!--]--><!--[-->`);
          ssrRenderList(getTasksForDay(unref(currentDay)), (task) => {
            _push(`<div class="border-l-4 p-4 rounded-r-lg cursor-pointer hover:shadow-md transition-shadow" style="${ssrRenderStyle({ borderColor: task.color })}"><div class="flex items-start justify-between"><div class="flex-1"><div class="flex items-center space-x-2 mb-2"><svg class="${ssrRenderClass([task.status === "completed" ? "text-green-600" : "text-gray-400", "w-5 h-5"])}" fill="none" stroke="currentColor" viewBox="0 0 24 24">`);
            if (task.status === "completed") {
              _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>`);
            } else {
              _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>`);
            }
            _push(`</svg><span class="${ssrRenderClass([task.status === "completed" ? "line-through opacity-60" : "", "text-lg font-semibold text-gray-900"])}">${ssrInterpolate(task.title)}</span><span class="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700"> งาน </span>`);
            if (task.status === "completed") {
              _push(`<span class="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700"> เสร็จแล้ว </span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div><div class="text-sm text-gray-600 mb-2">`);
            if (task.due_date) {
              _push(`<div>ครบกำหนด: ${ssrInterpolate(formatDateTime(task.due_date))}</div>`);
            } else {
              _push(`<!---->`);
            }
            if (task.priority) {
              _push(`<div class="capitalize">ลำดับความสำคัญ: ${ssrInterpolate(task.priority)}</div>`);
            } else {
              _push(`<!---->`);
            }
            if (task.description) {
              _push(`<div class="mt-1 text-gray-500">${ssrInterpolate(task.description)}</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div></div></div>`);
          });
          _push(`<!--]--><!--[-->`);
          ssrRenderList(getAppointmentsForDay(unref(currentDay)), (appointment) => {
            _push(`<div class="border-l-4 p-4 rounded-r-lg cursor-pointer hover:shadow-md transition-shadow" style="${ssrRenderStyle({ borderColor: appointment.color })}"><div class="flex items-start justify-between"><div class="flex-1"><div class="flex items-center space-x-2 mb-2"><span class="text-lg font-semibold text-gray-900">${ssrInterpolate(appointment.title)}</span><span class="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700"> การนัดหมาย </span>`);
            if (appointment.status === "confirmed") {
              _push(`<span class="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700"> ยืนยันแล้ว </span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div><div class="text-sm text-gray-600 mb-2">`);
            if (appointment.location) {
              _push(`<div>สถานที่: ${ssrInterpolate(appointment.location)}</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<div>เวลา: ${ssrInterpolate(formatTimeRange(appointment.start_datetime, appointment.end_datetime))}</div>`);
            if (appointment.participants && appointment.participants.length > 0) {
              _push(`<div> ผู้เข้าร่วม: ${ssrInterpolate(appointment.participants.length)} คน </div>`);
            } else {
              _push(`<!---->`);
            }
            if (appointment.description) {
              _push(`<div class="mt-1 text-gray-500">${ssrInterpolate(appointment.description)}</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div></div></div>`);
          });
          _push(`<!--]--><!--[-->`);
          ssrRenderList(getSchedulesForDay(unref(currentDay)), (schedule) => {
            _push(`<div class="${ssrRenderClass([getScheduleBorderClass(schedule.status), "border-l-4 p-4 rounded-r-lg"])}"><div class="flex items-start justify-between"><div class="flex-1"><div class="flex items-center space-x-2 mb-2"><span class="text-lg font-semibold text-gray-900">${ssrInterpolate(schedule.course.title)}</span><span class="${ssrRenderClass([getStatusBadgeClass(schedule.status), "px-2 py-1 text-xs font-medium rounded"])}">${ssrInterpolate(getStatusName(schedule.status))}</span><span class="${ssrRenderClass([getSessionTypeBadgeClass(schedule.session_type), "px-2 py-1 text-xs font-medium rounded"])}">${ssrInterpolate(getSessionTypeName(schedule.session_type))}</span></div><div class="text-sm text-gray-600 mb-2"><div>สาขา: ${ssrInterpolate(schedule.branch.name)}</div><div>เวลา: ${ssrInterpolate(formatTimeRange(schedule.start_datetime, schedule.end_datetime))}</div></div></div><div class="flex items-center space-x-2">`);
            if (schedule.session_type === "live" && schedule.meeting_link) {
              _push(`<a${ssrRenderAttr("href", schedule.meeting_link)} target="_blank" rel="noopener noreferrer" class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"> เข้าร่วม </a>`);
            } else if (schedule.session_type === "vod" && schedule.video_url) {
              _push(`<a${ssrRenderAttr("href", schedule.video_url)} target="_blank" rel="noopener noreferrer" class="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"> ดูวิดีโอ </a>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div></div>`);
          });
          _push(`<!--]-->`);
          if (getSchedulesForDay(unref(currentDay)).length === 0 && getEventsForDay(unref(currentDay)).length === 0 && getTasksForDay(unref(currentDay)).length === 0 && getAppointmentsForDay(unref(currentDay)).length === 0) {
            _push(`<div class="text-center py-12 text-gray-500"> ไม่มีกิจกรรมในวันนี้ </div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        }
        _push(`</div>`);
      } else if (unref(viewMode) === "week") {
        _push(`<div class="bg-white rounded-lg shadow p-6">`);
        if (unref(loading)) {
          _push(`<div class="p-8 text-center"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div><p class="mt-2 text-gray-600">กำลังโหลด...</p></div>`);
        } else if (unref(error)) {
          _push(`<div class="p-4 bg-red-50 border border-red-200 text-red-700 rounded">${ssrInterpolate(unref(error))}</div>`);
        } else {
          _push(`<div><div class="grid grid-cols-7 gap-2"><!--[-->`);
          ssrRenderList(unref(weekDays), (day) => {
            _push(`<div class="text-center font-semibold text-gray-700 py-2 border-b"><div class="text-sm">${ssrInterpolate(day.label)}</div></div>`);
          });
          _push(`<!--]--><!--[-->`);
          ssrRenderList(unref(weekDays), (day) => {
            _push(`<div class="${ssrRenderClass([{
              "bg-blue-50": isToday$1(day.date),
              "bg-gray-50": day.date < new Date((/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0))
            }, "min-h-32 border border-gray-200 rounded-lg p-2 relative group"])}"><div class="flex items-center justify-between mb-2"><div class="text-xs font-medium text-gray-600">${ssrInterpolate(formatDay(day.date))}</div><div class="relative"><button class="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200 transition-opacity"${ssrRenderAttr("title", `จัดการ${unref(format)(day.date, " dd MMM yyyy", { locale: unref(th) })}`)}><svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg></button>`);
            if (unref(showDateMenu)[day.key]) {
              _push(`<div class="absolute right-0 mt-1 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-1 z-50"><button class="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors flex items-center space-x-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><span>สร้างกิจกรรม</span></button><button class="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors flex items-center space-x-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg><span>สร้างงาน</span></button><button class="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors flex items-center space-x-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg><span>สร้างการนัดหมาย</span></button></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div><div class="space-y-1"><!--[-->`);
            ssrRenderList(getEventsForDay(day.date), (event) => {
              _push(`<div class="text-xs p-1 rounded cursor-pointer truncate" style="${ssrRenderStyle({ backgroundColor: event.color + "20", borderLeft: `3px solid ${event.color}` })}"><div class="font-medium truncate text-gray-900">${ssrInterpolate(event.title)}</div><div class="text-xs opacity-75 text-gray-600">${ssrInterpolate(formatTime(event.start_datetime))}</div></div>`);
            });
            _push(`<!--]--><!--[-->`);
            ssrRenderList(getTasksForDay(day.date), (task) => {
              _push(`<div class="text-xs p-1 rounded cursor-pointer truncate flex items-center space-x-1" style="${ssrRenderStyle({ backgroundColor: task.color + "20", borderLeft: `2px solid ${task.color}` })}"><svg class="${ssrRenderClass([task.status === "completed" ? "text-green-600" : "text-gray-400", "w-3 h-3 flex-shrink-0"])}" fill="none" stroke="currentColor" viewBox="0 0 24 24">`);
              if (task.status === "completed") {
                _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>`);
              } else {
                _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>`);
              }
              _push(`</svg><div class="${ssrRenderClass([task.status === "completed" ? "line-through opacity-60" : "", "font-medium truncate text-gray-900"])}">${ssrInterpolate(task.title)}</div></div>`);
            });
            _push(`<!--]--><!--[-->`);
            ssrRenderList(getAppointmentsForDay(day.date), (appointment) => {
              _push(`<div class="text-xs p-1 rounded cursor-pointer truncate" style="${ssrRenderStyle({ backgroundColor: appointment.color + "20", borderLeft: `3px solid ${appointment.color}` })}"><div class="font-medium truncate text-gray-900">${ssrInterpolate(appointment.title)}</div><div class="text-xs opacity-75 text-gray-600">${ssrInterpolate(formatTime(appointment.start_datetime))}</div></div>`);
            });
            _push(`<!--]--><!--[-->`);
            ssrRenderList(getSchedulesForDay(day.date), (schedule) => {
              _push(`<div class="${ssrRenderClass([getScheduleCardClass(schedule), "text-xs p-1 rounded cursor-pointer"])}"><div class="font-medium truncate">${ssrInterpolate(schedule.course.title)}</div><div class="text-xs opacity-75">${ssrInterpolate(formatTime(schedule.start_datetime))}</div></div>`);
            });
            _push(`<!--]--></div></div>`);
          });
          _push(`<!--]--></div></div>`);
        }
        _push(`</div>`);
      } else if (unref(viewMode) === "month") {
        _push(`<div class="bg-white rounded-lg shadow p-6">`);
        if (unref(loading)) {
          _push(`<div class="p-8 text-center"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div><p class="mt-2 text-gray-600">กำลังโหลด...</p></div>`);
        } else if (unref(error)) {
          _push(`<div class="p-4 bg-red-50 border border-red-200 text-red-700 rounded">${ssrInterpolate(unref(error))}</div>`);
        } else {
          _push(`<div><div class="grid grid-cols-7 gap-1 mb-2"><!--[-->`);
          ssrRenderList(unref(weekDays), (day) => {
            _push(`<div class="text-center font-semibold text-gray-700 py-2"><div class="text-sm">${ssrInterpolate(day.label)}</div></div>`);
          });
          _push(`<!--]--></div><div class="grid grid-cols-7 gap-1"><!--[-->`);
          ssrRenderList(unref(monthDays), (day) => {
            _push(`<div class="${ssrRenderClass([{
              "bg-blue-50": isToday$1(day.date),
              "bg-gray-50": !unref(isSameMonth)(day.date, unref(currentMonth))
            }, "min-h-24 border border-gray-200 rounded p-1"])}"><div class="text-xs font-medium text-gray-600 mb-1">${ssrInterpolate(formatDay(day.date))}</div><div class="space-y-0.5"><!--[-->`);
            ssrRenderList(getEventsForDay(day.date), (event) => {
              _push(`<div class="text-xs p-0.5 rounded truncate cursor-pointer" style="${ssrRenderStyle({ backgroundColor: event.color + "20", borderLeft: `2px solid ${event.color}` })}"${ssrRenderAttr("title", event.title)}>${ssrInterpolate(formatTime(event.start_datetime))} ${ssrInterpolate(event.title)}</div>`);
            });
            _push(`<!--]--><!--[-->`);
            ssrRenderList(getTasksForDay(day.date), (task) => {
              _push(`<div class="text-xs p-0.5 rounded truncate cursor-pointer flex items-center space-x-1" style="${ssrRenderStyle({ backgroundColor: task.color + "20", borderLeft: `2px solid ${task.color}` })}"${ssrRenderAttr("title", task.title)}><span class="${ssrRenderClass(task.status === "completed" ? "line-through opacity-60" : "")}">${ssrInterpolate(task.title)}</span></div>`);
            });
            _push(`<!--]--><!--[-->`);
            ssrRenderList(getAppointmentsForDay(day.date), (appointment) => {
              _push(`<div class="text-xs p-0.5 rounded truncate cursor-pointer" style="${ssrRenderStyle({ backgroundColor: appointment.color + "20", borderLeft: `2px solid ${appointment.color}` })}"${ssrRenderAttr("title", appointment.title)}>${ssrInterpolate(formatTime(appointment.start_datetime))} ${ssrInterpolate(appointment.title)}</div>`);
            });
            _push(`<!--]--><!--[-->`);
            ssrRenderList(getSchedulesForDay(day.date), (schedule) => {
              _push(`<div class="${ssrRenderClass([getScheduleCardClass(schedule), "text-xs p-1 rounded truncate cursor-pointer"])}"${ssrRenderAttr("title", schedule.course.title)}>${ssrInterpolate(formatTime(schedule.start_datetime))} ${ssrInterpolate(schedule.course.title)}</div>`);
            });
            _push(`<!--]--></div></div>`);
          });
          _push(`<!--]--></div></div>`);
        }
        _push(`</div>`);
      } else if (unref(viewMode) === "4days") {
        _push(`<div class="bg-white rounded-lg shadow p-6">`);
        if (unref(loading)) {
          _push(`<div class="p-8 text-center"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div><p class="mt-2 text-gray-600">กำลังโหลด...</p></div>`);
        } else if (unref(error)) {
          _push(`<div class="p-4 bg-red-50 border border-red-200 text-red-700 rounded">${ssrInterpolate(unref(error))}</div>`);
        } else {
          _push(`<div><div class="grid grid-cols-4 gap-4"><!--[-->`);
          ssrRenderList(unref(fourDays), (day) => {
            _push(`<div class="${ssrRenderClass([{
              "bg-blue-50": isToday$1(day.date)
            }, "border border-gray-200 rounded-lg p-4"])}"><div class="font-semibold text-gray-700 mb-3"><div class="text-sm">${ssrInterpolate(day.label)}</div><div class="text-xs text-gray-500">${ssrInterpolate(formatDay(day.date))}</div></div><div class="space-y-2"><!--[-->`);
            ssrRenderList(getEventsForDay(day.date), (event) => {
              _push(`<div class="text-xs p-2 rounded cursor-pointer" style="${ssrRenderStyle({ backgroundColor: event.color + "20", borderLeft: `3px solid ${event.color}` })}"><div class="font-medium truncate text-gray-900">${ssrInterpolate(event.title)}</div><div class="text-xs opacity-75 text-gray-600">${ssrInterpolate(formatTimeRange(event.start_datetime, event.end_datetime))}</div></div>`);
            });
            _push(`<!--]--><!--[-->`);
            ssrRenderList(getTasksForDay(day.date), (task) => {
              _push(`<div class="text-xs p-2 rounded cursor-pointer flex items-center space-x-1" style="${ssrRenderStyle({ backgroundColor: task.color + "20", borderLeft: `3px solid ${task.color}` })}"><svg class="${ssrRenderClass([task.status === "completed" ? "text-green-600" : "text-gray-400", "w-3 h-3 flex-shrink-0"])}" fill="none" stroke="currentColor" viewBox="0 0 24 24">`);
              if (task.status === "completed") {
                _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>`);
              } else {
                _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>`);
              }
              _push(`</svg><div class="${ssrRenderClass([task.status === "completed" ? "line-through opacity-60" : "", "font-medium truncate text-gray-900"])}">${ssrInterpolate(task.title)}</div></div>`);
            });
            _push(`<!--]--><!--[-->`);
            ssrRenderList(getAppointmentsForDay(day.date), (appointment) => {
              _push(`<div class="text-xs p-2 rounded cursor-pointer" style="${ssrRenderStyle({ backgroundColor: appointment.color + "20", borderLeft: `3px solid ${appointment.color}` })}"><div class="font-medium truncate text-gray-900">${ssrInterpolate(appointment.title)}</div><div class="text-xs opacity-75 text-gray-600">${ssrInterpolate(formatTimeRange(appointment.start_datetime, appointment.end_datetime))}</div></div>`);
            });
            _push(`<!--]--><!--[-->`);
            ssrRenderList(getSchedulesForDay(day.date), (schedule) => {
              _push(`<div class="${ssrRenderClass([getScheduleCardClass(schedule), "text-xs p-2 rounded cursor-pointer"])}"><div class="font-medium truncate">${ssrInterpolate(schedule.course.title)}</div><div class="text-xs opacity-75">${ssrInterpolate(formatTimeRange(schedule.start_datetime, schedule.end_datetime))}</div></div>`);
            });
            _push(`<!--]-->`);
            if (getSchedulesForDay(day.date).length === 0 && getEventsForDay(day.date).length === 0 && getTasksForDay(day.date).length === 0 && getAppointmentsForDay(day.date).length === 0) {
              _push(`<div class="text-xs text-gray-400 text-center py-4"> ไม่มี </div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div>`);
          });
          _push(`<!--]--></div></div>`);
        }
        _push(`</div>`);
      } else if (unref(viewMode) === "agenda") {
        _push(`<div class="bg-white rounded-lg shadow overflow-hidden">`);
        if (unref(loading)) {
          _push(`<div class="p-8 text-center"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div><p class="mt-2 text-gray-600">กำลังโหลด...</p></div>`);
        } else if (unref(error)) {
          _push(`<div class="p-4 bg-red-50 border border-red-200 text-red-700 rounded m-4">${ssrInterpolate(unref(error))}</div>`);
        } else if (unref(schedules).length === 0 && unref(events).length === 0 && unref(tasks).length === 0 && unref(appointments).length === 0) {
          _push(`<div class="p-8 text-center text-gray-500"><svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><p class="mt-4 text-lg font-medium">ไม่พบกิจกรรม</p><p class="mt-1 text-sm">ไม่มีตารางสอน, กิจกรรม, งาน หรือการนัดหมายในช่วงเวลาที่เลือก</p></div>`);
        } else {
          _push(`<div class="space-y-4">`);
          if (unref(events).length > 0) {
            _push(`<div><h3 class="px-6 py-3 text-lg font-semibold text-gray-900 border-b">Events</h3><div class="divide-y divide-gray-200"><!--[-->`);
            ssrRenderList(unref(events), (event) => {
              _push(`<div class="px-6 py-4 hover:bg-gray-50 cursor-pointer"><div class="flex items-center justify-between"><div class="flex-1"><div class="flex items-center space-x-2"><div class="w-4 h-4 rounded" style="${ssrRenderStyle({ backgroundColor: event.color })}"></div><div class="text-sm font-medium text-gray-900">${ssrInterpolate(event.title)}</div>`);
              if (event.is_shared) {
                _push(`<span class="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700"> แชร์ </span>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div><div class="mt-1 text-sm text-gray-500">${ssrInterpolate(formatDateTime(event.start_datetime))} `);
              if (event.location) {
                _push(`<span class="ml-2">• ${ssrInterpolate(event.location)}</span>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
              if (event.description) {
                _push(`<div class="mt-1 text-sm text-gray-600">${ssrInterpolate(event.description)}</div>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div></div></div>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(tasks).length > 0) {
            _push(`<div><h3 class="px-6 py-3 text-lg font-semibold text-gray-900 border-b">งาน</h3><div class="divide-y divide-gray-200"><!--[-->`);
            ssrRenderList(unref(tasks), (task) => {
              _push(`<div class="px-6 py-4 hover:bg-gray-50 cursor-pointer"><div class="flex items-center justify-between"><div class="flex-1"><div class="flex items-center space-x-2"><svg class="${ssrRenderClass([task.status === "completed" ? "text-green-600" : "text-gray-400", "w-4 h-4"])}" fill="none" stroke="currentColor" viewBox="0 0 24 24">`);
              if (task.status === "completed") {
                _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>`);
              } else {
                _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>`);
              }
              _push(`</svg><div class="${ssrRenderClass([task.status === "completed" ? "line-through opacity-60" : "", "text-sm font-medium text-gray-900"])}">${ssrInterpolate(task.title)}</div></div><div class="mt-1 text-sm text-gray-500">`);
              if (task.due_date) {
                _push(`<span>${ssrInterpolate(formatDateTime(task.due_date))}</span>`);
              } else {
                _push(`<!---->`);
              }
              if (task.priority) {
                _push(`<span class="ml-2 capitalize">• ${ssrInterpolate(task.priority)}</span>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
              if (task.description) {
                _push(`<div class="mt-1 text-sm text-gray-600">${ssrInterpolate(task.description)}</div>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div></div></div>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(appointments).length > 0) {
            _push(`<div><h3 class="px-6 py-3 text-lg font-semibold text-gray-900 border-b">การนัดหมาย</h3><div class="divide-y divide-gray-200"><!--[-->`);
            ssrRenderList(unref(appointments), (appointment) => {
              _push(`<div class="px-6 py-4 hover:bg-gray-50 cursor-pointer"><div class="flex items-center justify-between"><div class="flex-1"><div class="flex items-center space-x-2"><div class="w-4 h-4 rounded" style="${ssrRenderStyle({ backgroundColor: appointment.color })}"></div><div class="text-sm font-medium text-gray-900">${ssrInterpolate(appointment.title)}</div>`);
              if (appointment.status === "confirmed") {
                _push(`<span class="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700"> ยืนยันแล้ว </span>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div><div class="mt-1 text-sm text-gray-500">${ssrInterpolate(formatDateTime(appointment.start_datetime))} `);
              if (appointment.location) {
                _push(`<span class="ml-2">• ${ssrInterpolate(appointment.location)}</span>`);
              } else {
                _push(`<!---->`);
              }
              if (appointment.participants && appointment.participants.length > 0) {
                _push(`<span class="ml-2">• ${ssrInterpolate(appointment.participants.length)} คน</span>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
              if (appointment.description) {
                _push(`<div class="mt-1 text-sm text-gray-600">${ssrInterpolate(appointment.description)}</div>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div></div></div>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(schedules).length > 0) {
            _push(`<div><h3 class="px-6 py-3 text-lg font-semibold text-gray-900 border-b">ตารางสอน</h3><table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันเวลา</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">คอร์ส</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สาขา</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ประเภท</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ลิงก์</th></tr></thead><tbody class="bg-white divide-y divide-gray-200"><!--[-->`);
            ssrRenderList(unref(schedules), (schedule) => {
              _push(`<tr class="hover:bg-gray-50"><td class="px-6 py-4 whitespace-nowrap"><div class="text-sm font-medium text-gray-900">${ssrInterpolate(formatDateTime(schedule.start_datetime))}</div><div class="text-xs text-gray-500">${ssrInterpolate(formatTimeRange(schedule.start_datetime, schedule.end_datetime))}</div></td><td class="px-6 py-4"><div class="text-sm font-medium text-gray-900">${ssrInterpolate(schedule.course.title)}</div>`);
              if (schedule.course.code) {
                _push(`<div class="text-xs text-gray-500">${ssrInterpolate(schedule.course.code)}</div>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</td><td class="px-6 py-4 whitespace-nowrap"><div class="text-sm text-gray-900">${ssrInterpolate(schedule.branch.name)}</div>`);
              if (schedule.branch.code) {
                _push(`<div class="text-xs text-gray-500">${ssrInterpolate(schedule.branch.code)}</div>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</td><td class="px-6 py-4 whitespace-nowrap"><span class="${ssrRenderClass([getSessionTypeBadgeClass(schedule.session_type), "px-2 py-1 text-xs font-medium rounded"])}">${ssrInterpolate(getSessionTypeName(schedule.session_type))}</span></td><td class="px-6 py-4 whitespace-nowrap"><span class="${ssrRenderClass([getStatusBadgeClass(schedule.status), "px-2 py-1 text-xs font-medium rounded"])}">${ssrInterpolate(getStatusName(schedule.status))}</span></td><td class="px-6 py-4 whitespace-nowrap">`);
              if (schedule.session_type === "live" && schedule.meeting_link) {
                _push(`<div class="flex items-center space-x-2"><a${ssrRenderAttr("href", schedule.meeting_link)} target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 text-sm flex items-center"><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg> เข้าร่วม </a></div>`);
              } else if (schedule.session_type === "vod" && schedule.video_url) {
                _push(`<div class="flex items-center space-x-2"><a${ssrRenderAttr("href", schedule.video_url)} target="_blank" rel="noopener noreferrer" class="text-purple-600 hover:text-purple-800 text-sm flex items-center"><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> ดูวิดีโอ </a></div>`);
              } else {
                _push(`<span class="text-xs text-gray-400">-</span>`);
              }
              _push(`</td></tr>`);
            });
            _push(`<!--]--></tbody></table></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_EventModal, {
        show: unref(showEventModal),
        event: unref(selectedEvent),
        "initial-date": unref(selectedDateForCreate),
        onClose: ($event) => {
          showEventModal.value = false;
          selectedEvent.value = null;
          selectedDateForCreate.value = null;
        },
        onSaved: handleEventSaved
      }, null, _parent));
      _push(ssrRenderComponent(_component_TaskModal, {
        show: unref(showTaskModal),
        task: unref(selectedTask),
        "initial-date": unref(selectedDateForCreate),
        onClose: ($event) => {
          showTaskModal.value = false;
          selectedTask.value = null;
          selectedDateForCreate.value = null;
        },
        onSaved: handleTaskSaved
      }, null, _parent));
      _push(ssrRenderComponent(_component_AppointmentModal, {
        show: unref(showAppointmentModal),
        appointment: unref(selectedAppointment),
        "initial-date": unref(selectedDateForCreate),
        onClose: ($event) => {
          showAppointmentModal.value = false;
          selectedAppointment.value = null;
          selectedDateForCreate.value = null;
        },
        onSaved: handleAppointmentSaved
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/tutor/schedule/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-XfjEsN76.mjs.map
