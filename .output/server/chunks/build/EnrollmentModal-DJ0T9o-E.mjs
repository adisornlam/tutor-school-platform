globalThis.__timing__.logStart('Load chunks/build/EnrollmentModal-DJ0T9o-E');import { defineComponent, reactive, ref, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderComponent, ssrRenderStyle } from 'vue/server-renderer';
import { A as AddressSelect } from './AddressSelect-2oQii9w-.mjs';
import { u as useAuth, c as useRuntimeConfig } from './server.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "AddressForm",
  __ssrInlineRender: true,
  props: {
    address: { default: null }
  },
  emits: ["update"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const form = reactive({
      address_type: "home",
      recipient_name: "",
      phone: "",
      address_line1: "",
      address_line2: "",
      subdistrict: "",
      district: "",
      province: "",
      postal_code: "",
      country: "Thailand",
      is_default: false
    });
    const error = ref("");
    watch(() => props.address, (address) => {
      if (address) {
        Object.assign(form, {
          address_type: address.address_type || "home",
          recipient_name: address.recipient_name || "",
          phone: address.phone || "",
          address_line1: address.address_line1 || "",
          address_line2: address.address_line2 || "",
          subdistrict: address.subdistrict || "",
          district: address.district || "",
          province: address.province || "",
          postal_code: address.postal_code || "",
          country: address.country || "Thailand",
          is_default: address.is_default || false
        });
      } else {
        Object.assign(form, {
          address_type: "home",
          recipient_name: "",
          phone: "",
          address_line1: "",
          address_line2: "",
          subdistrict: "",
          district: "",
          province: "",
          postal_code: "",
          country: "Thailand",
          is_default: false
        });
      }
      error.value = "";
    }, { immediate: true });
    watch(form, (newForm) => {
      emit("update", { ...newForm });
    }, { deep: true });
    __expose({
      validate: () => {
        if (!form.recipient_name || !form.phone || !form.address_line1 || !form.province || !form.postal_code) {
          error.value = "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน";
          return false;
        }
        error.value = "";
        return true;
      },
      getData: () => ({ ...form })
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "space-y-4",
        "data-address-form": ""
      }, _attrs))}><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2"> ประเภทที่อยู่ </label><select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"><option value="home"${ssrIncludeBooleanAttr(Array.isArray(unref(form).address_type) ? ssrLooseContain(unref(form).address_type, "home") : ssrLooseEqual(unref(form).address_type, "home")) ? " selected" : ""}>บ้าน</option><option value="work"${ssrIncludeBooleanAttr(Array.isArray(unref(form).address_type) ? ssrLooseContain(unref(form).address_type, "work") : ssrLooseEqual(unref(form).address_type, "work")) ? " selected" : ""}>ที่ทำงาน</option><option value="other"${ssrIncludeBooleanAttr(Array.isArray(unref(form).address_type) ? ssrLooseContain(unref(form).address_type, "other") : ssrLooseEqual(unref(form).address_type, "other")) ? " selected" : ""}>อื่นๆ</option></select></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> ชื่อผู้รับ <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).recipient_name)} type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900" placeholder="ชื่อ-นามสกุล ผู้รับเอกสาร"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> เบอร์โทรศัพท์ <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).phone)} type="tel" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900" placeholder="080-123-4567"></div></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> ที่อยู่บรรทัดที่ 1 <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).address_line1)} type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900" placeholder="เลขที่ บ้าน อาคาร ถนน"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> ที่อยู่บรรทัดที่ 2 </label><input${ssrRenderAttr("value", unref(form).address_line2)} type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900" placeholder="หมู่ ซอย แขวง/ตำบล (ถ้ามี)"></div><div class="grid grid-cols-1 md:grid-cols-3 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2"> แขวง/ตำบล </label><input${ssrRenderAttr("value", unref(form).subdistrict)} type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> เขต/อำเภอ </label><input${ssrRenderAttr("value", unref(form).district)} type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> จังหวัด <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).province)} type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2"> รหัสไปรษณีย์ <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).postal_code)} type="text" required maxlength="5" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900" placeholder="10110"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> ประเทศ </label><input${ssrRenderAttr("value", unref(form).country)} type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900" placeholder="Thailand"></div></div><div class="flex items-center"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).is_default) ? ssrLooseContain(unref(form).is_default, null) : unref(form).is_default) ? " checked" : ""} type="checkbox" id="is_default" class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"><label for="is_default" class="ml-2 text-sm text-gray-700"> ตั้งเป็นที่อยู่หลัก </label></div>`);
      if (unref(error)) {
        _push(`<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddressForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const AddressForm = Object.assign(_sfc_main$1, { __name: "AddressForm" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "EnrollmentModal",
  __ssrInlineRender: true,
  props: {
    show: { type: Boolean },
    enrollment: { default: null },
    prefillCourseId: { default: void 0 },
    prefillEnrollmentType: { default: void 0 }
  },
  emits: ["close", "saved"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const config = useRuntimeConfig();
    const { accessToken, user } = useAuth();
    const form = reactive({
      student_id: 0,
      course_id: 0,
      branch_id: 0,
      enrollment_type: "onsite",
      shipping_address_id: null,
      enrollment_date: "",
      status: "pending"
    });
    const loading = ref(false);
    const loadingBranches = ref(false);
    const loadingStudents = ref(false);
    const error = ref("");
    ref([]);
    const filteredStudents = ref([]);
    const availableCourses = ref([]);
    const availableBranches = ref([]);
    const studentSearchQuery = ref("");
    const showStudentDropdown = ref(false);
    const selectedStudent = ref(null);
    const showAddressForm = ref(false);
    const newAddress = ref(null);
    const addressSelectRef = ref(null);
    const autoSelectStudent = ref(false);
    const loadCourses = async () => {
      try {
        const response = await $fetch(
          `${config.public.apiBase}/admin/courses`,
          {
            headers: {
              Authorization: `Bearer ${accessToken.value}`
            },
            params: { status: "published" }
          }
        );
        if (response.success) {
          availableCourses.value = response.data;
        }
      } catch (err) {
        console.error("Error loading courses:", err);
      }
    };
    const loadBranchesForCourse = async () => {
      if (!form.course_id) {
        availableBranches.value = [];
        form.branch_id = 0;
        return;
      }
      loadingBranches.value = true;
      try {
        const response = await $fetch(`${config.public.apiBase}/admin/courses/${form.course_id}`, {
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          }
        });
        if (response.success && response.data.branches) {
          availableBranches.value = response.data.branches.map((b) => ({
            id: b.branch_id,
            name: b.branch_name,
            code: b.branch_code
          }));
        }
      } catch (err) {
        console.error("Error loading branches:", err);
        error.value = "ไม่สามารถโหลดข้อมูลสาขาได้";
      } finally {
        loadingBranches.value = false;
      }
    };
    watch(() => props.enrollment, (enrollment) => {
      if (enrollment) {
        form.student_id = enrollment.student_id;
        form.course_id = enrollment.course_id;
        form.branch_id = enrollment.branch_id || 0;
        form.enrollment_type = enrollment.enrollment_type || "onsite";
        form.shipping_address_id = enrollment.shipping_address_id || null;
        form.status = enrollment.status;
        form.enrollment_date = enrollment.enrollment_date ? new Date(enrollment.enrollment_date).toISOString().slice(0, 16) : (/* @__PURE__ */ new Date()).toISOString().slice(0, 16);
        if (enrollment.student_id) {
          fetchStudentInfo(enrollment.student_id);
        }
        loadBranchesForCourse();
      } else {
        form.student_id = 0;
        form.course_id = props.prefillCourseId || 0;
        form.branch_id = 0;
        form.enrollment_type = props.prefillEnrollmentType || "onsite";
        form.shipping_address_id = null;
        form.status = "pending";
        form.enrollment_date = (/* @__PURE__ */ new Date()).toISOString().slice(0, 16);
        availableBranches.value = [];
        selectedStudent.value = null;
        studentSearchQuery.value = "";
        if (props.prefillCourseId) {
          loadBranchesForCourse();
        }
      }
    }, { immediate: true });
    const fetchStudentInfo = async (studentId) => {
      try {
        const response = await $fetch(
          `${config.public.apiBase}/admin/users`,
          {
            headers: {
              Authorization: `Bearer ${accessToken.value}`
            },
            params: { role: "student" }
          }
        );
        if (response.success) {
          const student = response.data.find((s) => s.id === studentId);
          if (student) {
            selectedStudent.value = student;
            studentSearchQuery.value = `${student.first_name} ${student.last_name} (@${student.username})`;
          }
        }
      } catch (err) {
        console.error("Error fetching student info:", err);
      }
    };
    const checkAutoSelectStudent = async () => {
      if (!user.value || !user.value.roles) {
        autoSelectStudent.value = false;
        return;
      }
      if (user.value.roles.includes("student")) {
        autoSelectStudent.value = true;
        form.student_id = user.value.id;
        try {
          const response = await $fetch(
            `${config.public.apiBase}/admin/users`,
            {
              headers: {
                Authorization: `Bearer ${accessToken.value}`
              },
              params: { role: "student", search: user.value.username || user.value.email }
            }
          );
          if (response.success && response.data.length > 0) {
            const student = response.data.find((s) => s.id === user.value.id) || response.data[0];
            selectedStudent.value = student;
            studentSearchQuery.value = `${student.first_name} ${student.last_name} (@${student.username})`;
          }
        } catch (err) {
          console.error("Error fetching student info:", err);
        }
      } else {
        autoSelectStudent.value = false;
      }
    };
    watch(() => props.show, async (show) => {
      if (show) {
        await checkAutoSelectStudent();
        loadCourses();
        if (props.enrollment) {
          loadBranchesForCourse();
          if (props.enrollment.student_id) {
            fetchStudentInfo(props.enrollment.student_id);
          }
        } else {
          if (!autoSelectStudent.value) {
            studentSearchQuery.value = "";
            selectedStudent.value = null;
            filteredStudents.value = [];
          }
          if (props.prefillCourseId) {
            form.course_id = props.prefillCourseId;
            loadBranchesForCourse();
          }
          if (props.prefillEnrollmentType) {
            form.enrollment_type = props.prefillEnrollmentType;
          }
        }
      }
    }, { immediate: true });
    const addressFormRef = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.show) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" }, _attrs))}><div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"><div class="flex items-center justify-between mb-6"><h2 class="text-2xl font-bold">${ssrInterpolate(__props.enrollment ? "แก้ไขการลงทะเบียน" : "ลงทะเบียนใหม่")}</h2><button class="text-gray-400 hover:text-gray-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><form class="space-y-4"><div class="grid grid-cols-1 md:grid-cols-2 gap-4">`);
        if (!unref(autoSelectStudent)) {
          _push(`<div><label class="block text-sm font-medium text-gray-700 mb-2"> นักเรียน <span class="text-red-500">*</span></label><div class="relative"><input${ssrRenderAttr("value", unref(studentSearchQuery))} type="text" placeholder="ค้นหานักเรียน (ชื่อ, username, อีเมล)..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900">`);
          if (unref(selectedStudent)) {
            _push(`<div class="absolute right-10 top-1/2 transform -translate-y-1/2 text-green-600"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(showStudentDropdown) && (unref(filteredStudents).length > 0 || unref(studentSearchQuery))) {
            _push(`<div class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">`);
            if (unref(loadingStudents)) {
              _push(`<div class="px-4 py-2 text-sm text-gray-500"> กำลังค้นหา... </div>`);
            } else if (unref(filteredStudents).length === 0 && unref(studentSearchQuery)) {
              _push(`<div class="px-4 py-2 text-sm text-gray-500"> ไม่พบนักเรียน </div>`);
            } else {
              _push(`<div class="divide-y divide-gray-200"><!--[-->`);
              ssrRenderList(unref(filteredStudents), (student) => {
                _push(`<button type="button" class="${ssrRenderClass([{ "bg-green-100": unref(form).student_id === student.id }, "w-full text-left px-4 py-2 hover:bg-green-50 focus:bg-green-50 focus:outline-none"])}"><div class="font-medium text-gray-900">${ssrInterpolate(student.first_name)} ${ssrInterpolate(student.last_name)}</div><div class="text-sm text-gray-500">@${ssrInterpolate(student.username)}</div>`);
                if (student.email) {
                  _push(`<div class="text-xs text-gray-400">${ssrInterpolate(student.email)}</div>`);
                } else {
                  _push(`<!---->`);
                }
                _push(`</button>`);
              });
              _push(`<!--]--></div>`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><input${ssrRenderAttr("value", unref(form).student_id)} type="hidden" required></div>`);
        } else {
          _push(`<div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-2"> นักเรียน </label><div class="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg"><p class="font-medium text-gray-900">${ssrInterpolate(unref(selectedStudent)?.first_name)} ${ssrInterpolate(unref(selectedStudent)?.last_name)}</p><p class="text-sm text-gray-500">@${ssrInterpolate(unref(selectedStudent)?.username)}</p></div><input${ssrRenderAttr("value", unref(form).student_id)} type="hidden" required></div>`);
        }
        _push(`<div><label class="block text-sm font-medium text-gray-700 mb-2"> คอร์ส <span class="text-red-500">*</span></label><select required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).course_id) ? ssrLooseContain(unref(form).course_id, "") : ssrLooseEqual(unref(form).course_id, "")) ? " selected" : ""}>เลือกคอร์ส</option><!--[-->`);
        ssrRenderList(unref(availableCourses), (course) => {
          _push(`<option${ssrRenderAttr("value", course.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).course_id) ? ssrLooseContain(unref(form).course_id, course.id) : ssrLooseEqual(unref(form).course_id, course.id)) ? " selected" : ""}>${ssrInterpolate(course.title)}</option>`);
        });
        _push(`<!--]--></select></div><div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-2"> ประเภทการเรียน <span class="text-red-500">*</span></label><div class="flex gap-6"><label class="flex items-center cursor-pointer"><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).enrollment_type, "onsite")) ? " checked" : ""} type="radio" value="onsite" class="mr-2 w-4 h-4 text-green-600 focus:ring-green-500"><span class="text-gray-700">เรียนสด (Onsite)</span></label><label class="flex items-center cursor-pointer"><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).enrollment_type, "online")) ? " checked" : ""} type="radio" value="online" class="mr-2 w-4 h-4 text-green-600 focus:ring-green-500"><span class="text-gray-700">เรียนออนไลน์ (Online)</span></label></div></div>`);
        if (unref(form).enrollment_type === "onsite") {
          _push(`<div><label class="block text-sm font-medium text-gray-700 mb-2"> สาขา <span class="text-red-500">*</span></label><select${ssrIncludeBooleanAttr(unref(form).enrollment_type === "onsite") ? " required" : ""}${ssrIncludeBooleanAttr(!unref(form).course_id || unref(loadingBranches)) ? " disabled" : ""} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed bg-white text-gray-900"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).branch_id) ? ssrLooseContain(unref(form).branch_id, "") : ssrLooseEqual(unref(form).branch_id, "")) ? " selected" : ""}>${ssrInterpolate(unref(loadingBranches) ? "กำลังโหลด..." : "เลือกสาขา")}</option><!--[-->`);
          ssrRenderList(unref(availableBranches), (branch) => {
            _push(`<option${ssrRenderAttr("value", branch.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).branch_id) ? ssrLooseContain(unref(form).branch_id, branch.id) : ssrLooseEqual(unref(form).branch_id, branch.id)) ? " selected" : ""}>${ssrInterpolate(branch.name)}</option>`);
          });
          _push(`<!--]--></select></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(form).enrollment_type === "online" && unref(form).student_id) {
          _push(`<div><label class="block text-sm font-medium text-gray-700 mb-2"> ที่อยู่จัดส่ง <span class="text-red-500">*</span></label>`);
          _push(ssrRenderComponent(AddressSelect, {
            ref_key: "addressSelectRef",
            ref: addressSelectRef,
            modelValue: unref(form).shipping_address_id,
            "onUpdate:modelValue": ($event) => unref(form).shipping_address_id = $event,
            "user-id": unref(form).student_id,
            required: unref(form).enrollment_type === "online",
            placeholder: "เลือกที่อยู่จัดส่ง",
            hint: "สำหรับส่งเอกสารประกอบการเรียน",
            onAddNew: ($event) => showAddressForm.value = true
          }, null, _parent));
          _push(`</div>`);
        } else if (unref(form).enrollment_type === "online" && !unref(form).student_id) {
          _push(`<div class="text-sm text-gray-500"> กรุณาเลือกนักเรียนก่อนเพื่อเลือกที่อยู่จัดส่ง </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div><label class="block text-sm font-medium text-gray-700 mb-2"> สถานะ <span class="text-red-500">*</span></label><select required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"><option value="pending"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "pending") : ssrLooseEqual(unref(form).status, "pending")) ? " selected" : ""}>รอการยืนยัน</option><option value="active"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "active") : ssrLooseEqual(unref(form).status, "active")) ? " selected" : ""}>กำลังเรียน</option><option value="completed"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "completed") : ssrLooseEqual(unref(form).status, "completed")) ? " selected" : ""}>เรียนจบ</option><option value="cancelled"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "cancelled") : ssrLooseEqual(unref(form).status, "cancelled")) ? " selected" : ""}>ยกเลิก</option></select></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> วันที่ลงทะเบียน </label><input${ssrRenderAttr("value", unref(form).enrollment_date)} type="datetime-local" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900" style="${ssrRenderStyle({ "color-scheme": "light" })}"></div></div>`);
        if (unref(error)) {
          _push(`<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">${ssrInterpolate(unref(error))}</div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(showAddressForm)) {
          _push(`<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"><div class="flex items-center justify-between mb-4"><h3 class="text-xl font-bold">เพิ่มที่อยู่ใหม่</h3><button class="text-gray-400 hover:text-gray-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>`);
          _push(ssrRenderComponent(AddressForm, {
            ref_key: "addressFormRef",
            ref: addressFormRef,
            address: null,
            onUpdate: ($event) => newAddress.value = $event
          }, null, _parent));
          _push(`<div class="flex justify-end space-x-3 mt-4 pt-4 border-t"><button type="button" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"> ยกเลิก </button><button type="button"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"> บันทึก </button></div></div></div>`);
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
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/EnrollmentModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const EnrollmentModal = Object.assign(_sfc_main, { __name: "EnrollmentModal" });

export { EnrollmentModal as E };;globalThis.__timing__.logEnd('Load chunks/build/EnrollmentModal-DJ0T9o-E');
//# sourceMappingURL=EnrollmentModal-DJ0T9o-E.mjs.map
