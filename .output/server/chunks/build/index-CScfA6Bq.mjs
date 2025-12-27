import { _ as __nuxt_component_0 } from './nuxt-link-CODr8WH9.mjs';
import { _ as __nuxt_component_1 } from './StudentModal-oAn_jRlQ.mjs';
import { defineComponent, ref, reactive, computed, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrRenderComponent, ssrRenderStyle, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { a as useRoute, b as useRouter, u as useAuth, c as useRuntimeConfig } from './server.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const config = useRuntimeConfig();
    const { accessToken, user } = useAuth();
    const studentId = parseInt(route.params.id);
    const loading = ref(true);
    const error = ref("");
    const studentDetail = ref(null);
    const learningProgress = ref([]);
    const payments = ref([]);
    const loadingPayments = ref(false);
    const showEditStudentModal = ref(false);
    const editingStudent = ref(null);
    const showAddParentModal = ref(false);
    const parentSearch = ref("");
    const parentSearchResults = ref([]);
    const selectedParentToAdd = ref(null);
    const parentRelationship = ref("guardian");
    const addingParent = ref(false);
    const addParentError = ref("");
    const parentToEdit = ref(null);
    const editingParent = ref(false);
    const editParentError = ref("");
    const editParentForm = reactive({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      relationship: "guardian"
    });
    const canEdit = computed(() => {
      if (!user.value || !user.value.roles) return false;
      const allowedRoles = ["system_admin", "owner", "admin", "branch_admin"];
      return user.value.roles.some((role) => allowedRoles.includes(role));
    });
    const canViewPayments = computed(() => {
      if (!user.value || !user.value.roles) return false;
      const allowedRoles = ["system_admin", "owner", "admin", "branch_admin"];
      return user.value.roles.some((role) => allowedRoles.includes(role));
    });
    const loadStudentDetail = async () => {
      loading.value = true;
      error.value = "";
      try {
        const response = await $fetch(`${config.public.apiBase}/admin/students/${studentId}`, {
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          }
        });
        if (response.success) {
          studentDetail.value = response.data;
          await Promise.all([
            loadLearningProgress(),
            ...canViewPayments.value ? [loadPayments()] : []
          ]);
        }
      } catch (err) {
        console.error("Error loading student detail:", err);
        error.value = err.data?.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      } finally {
        loading.value = false;
      }
    };
    const loadLearningProgress = async () => {
    };
    const loadPayments = async () => {
      if (!canViewPayments.value) return;
      loadingPayments.value = true;
      try {
        const response = await $fetch(`${config.public.apiBase}/admin/students/${studentId}/payments`, {
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          }
        });
        if (response.success) {
          payments.value = response.data;
        }
      } catch (err) {
        console.error("Error loading payments:", err);
        payments.value = [];
      } finally {
        loadingPayments.value = false;
      }
    };
    const closeEditStudentModal = () => {
      showEditStudentModal.value = false;
      editingStudent.value = null;
    };
    const handleStudentSaved = async () => {
      closeEditStudentModal();
      await loadStudentDetail();
    };
    const getStatusDisplayName = (status) => {
      const statusNames = {
        active: "ใช้งาน",
        inactive: "ปิดใช้งาน",
        suspended: "ระงับ"
      };
      return statusNames[status] || status;
    };
    const getStatusBadgeClass = (status) => {
      const classes = {
        active: "bg-green-100 text-green-800",
        inactive: "bg-gray-100 text-gray-800",
        suspended: "bg-red-100 text-red-800"
      };
      return classes[status] || "bg-gray-100 text-gray-800";
    };
    const getRelationshipName = (relationship) => {
      const relationshipNames = {
        father: "บิดา",
        mother: "มารดา",
        guardian: "ผู้ปกครอง",
        other: "อื่นๆ"
      };
      return relationshipNames[relationship] || relationship;
    };
    const getEnrollmentStatusName = (status) => {
      const statusNames = {
        pending: "รอดำเนินการ",
        active: "กำลังเรียน",
        completed: "เรียนจบ",
        cancelled: "ยกเลิก"
      };
      return statusNames[status] || status;
    };
    const getPaymentStatusName = (status) => {
      const statusNames = {
        pending: "รอชำระ",
        paid: "ชำระแล้ว",
        failed: "ชำระไม่สำเร็จ",
        refunded: "คืนเงิน"
      };
      return statusNames[status] || status;
    };
    const getPaymentStatusBadgeClass = (status) => {
      const classes = {
        pending: "bg-yellow-100 text-yellow-800",
        paid: "bg-green-100 text-green-800",
        failed: "bg-red-100 text-red-800",
        refunded: "bg-gray-100 text-gray-800"
      };
      return classes[status] || "bg-gray-100 text-gray-800";
    };
    const formatDate = (date) => {
      return format(new Date(date), "dd MMM yyyy HH:mm", { locale: th });
    };
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("th-TH", {
        style: "currency",
        currency: "THB"
      }).format(amount);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_StudentModal = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="flex items-center justify-between mb-6"><div class="flex items-center space-x-4"><button class="p-2 hover:bg-gray-100 rounded-lg"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg></button><h1 class="text-3xl font-bold">รายละเอียดผู้เรียน</h1></div><div class="flex items-center space-x-3">`);
      if (unref(canEdit)) {
        _push(`<button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg><span>แก้ไข</span></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      if (unref(loading)) {
        _push(`<div class="text-center py-12"><div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div><p class="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p></div>`);
      } else if (unref(error)) {
        _push(`<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">${ssrInterpolate(unref(error))}</div>`);
      } else if (unref(studentDetail)) {
        _push(`<div class="space-y-6"><div class="bg-white rounded-lg shadow p-6"><div class="flex items-center justify-between mb-6"><h2 class="text-xl font-semibold">ข้อมูลผู้เรียน</h2><span class="${ssrRenderClass([getStatusBadgeClass(unref(studentDetail).student.status), "px-3 py-1 text-sm font-medium rounded"])}">${ssrInterpolate(getStatusDisplayName(unref(studentDetail).student.status))}</span></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><div><label class="block text-sm font-medium text-gray-500 mb-1">ชื่อ-นามสกุล</label><p class="text-lg font-medium text-gray-900">${ssrInterpolate(unref(studentDetail).student.first_name)} ${ssrInterpolate(unref(studentDetail).student.last_name)}</p></div><div><label class="block text-sm font-medium text-gray-500 mb-1">Username</label><p class="text-gray-900">${ssrInterpolate(unref(studentDetail).student.username)}</p></div><div><label class="block text-sm font-medium text-gray-500 mb-1">Email</label><p class="text-gray-900">${ssrInterpolate(unref(studentDetail).student.email || "-")}</p></div><div><label class="block text-sm font-medium text-gray-500 mb-1">เบอร์โทรศัพท์</label><p class="text-gray-900">${ssrInterpolate(unref(studentDetail).student.phone || "-")}</p></div><div><label class="block text-sm font-medium text-gray-500 mb-1">วันที่สร้าง</label><p class="text-gray-900">${ssrInterpolate(formatDate(unref(studentDetail).student.created_at))}</p></div><div><label class="block text-sm font-medium text-gray-500 mb-1">อัปเดตล่าสุด</label><p class="text-gray-900">${ssrInterpolate(formatDate(unref(studentDetail).student.updated_at))}</p></div></div></div><div class="bg-white rounded-lg shadow p-6"><div class="flex items-center justify-between mb-4"><h2 class="text-xl font-semibold">ผู้ปกครอง</h2>`);
        if (unref(canEdit)) {
          _push(`<button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg><span>เพิ่มผู้ปกครอง</span></button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(studentDetail).parents && unref(studentDetail).parents.length > 0) {
          _push(`<div class="space-y-4"><!--[-->`);
          ssrRenderList(unref(studentDetail).parents, (parent) => {
            _push(`<div class="border border-gray-200 rounded-lg p-4"><div class="flex items-center justify-between mb-3"><div class="flex items-center space-x-3"><h3 class="text-lg font-medium text-gray-900">${ssrInterpolate(parent.first_name)} ${ssrInterpolate(parent.last_name)}</h3><span class="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">${ssrInterpolate(getRelationshipName(parent.relationship))}</span></div>`);
            if (unref(canEdit)) {
              _push(`<div class="flex items-center space-x-2"><button class="px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="แก้ไขผู้ปกครอง"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-500 mb-1">Username</label><p class="text-gray-900">${ssrInterpolate(parent.username)}</p></div><div><label class="block text-sm font-medium text-gray-500 mb-1">Email</label><p class="text-gray-900">${ssrInterpolate(parent.email || "-")}</p></div><div><label class="block text-sm font-medium text-gray-500 mb-1">เบอร์โทรศัพท์</label><p class="text-gray-900">${ssrInterpolate(parent.phone || "-")}</p></div><div><label class="block text-sm font-medium text-gray-500 mb-1">สถานะ</label><span class="${ssrRenderClass([getStatusBadgeClass(parent.status), "px-2 py-1 text-xs font-medium rounded"])}">${ssrInterpolate(getStatusDisplayName(parent.status))}</span></div></div></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<div class="text-center py-8 text-gray-500"><svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg><p class="mt-2">ไม่มีข้อมูลผู้ปกครอง</p></div>`);
        }
        _push(`</div><div class="bg-white rounded-lg shadow p-6"><h2 class="text-xl font-semibold mb-4">คอร์สที่ลงทะเบียน</h2>`);
        if (unref(studentDetail).enrollments && unref(studentDetail).enrollments.length > 0) {
          _push(`<div class="space-y-4"><!--[-->`);
          ssrRenderList(unref(studentDetail).enrollments, (enrollment) => {
            _push(`<div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"><div class="flex items-start justify-between"><div class="flex-1"><div class="flex items-center space-x-3 mb-2"><h3 class="text-lg font-medium text-gray-900">${ssrInterpolate(enrollment.course.title)}</h3><span class="${ssrRenderClass([enrollment.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800", "px-2 py-1 text-xs font-medium rounded"])}">${ssrInterpolate(getEnrollmentStatusName(enrollment.status))}</span></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"><div><span class="text-gray-500">รหัสคอร์ส:</span><span class="ml-2 text-gray-900">${ssrInterpolate(enrollment.course.code)}</span></div><div><span class="text-gray-500">สาขา:</span><span class="ml-2 text-gray-900">${ssrInterpolate(enrollment.branch.name)}</span></div><div><span class="text-gray-500">วันที่ลงทะเบียน:</span><span class="ml-2 text-gray-900">${ssrInterpolate(formatDate(enrollment.enrolled_at))}</span></div></div></div>`);
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: `/admin/enrollments/${enrollment.id}`,
              class: "ml-4 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
            _push(`</div></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<div class="text-center py-8 text-gray-500"><svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg><p class="mt-2">ยังไม่ได้ลงทะเบียนคอร์สใดๆ</p></div>`);
        }
        _push(`</div>`);
        if (unref(learningProgress) && unref(learningProgress).length > 0) {
          _push(`<div class="bg-white rounded-lg shadow p-6"><h2 class="text-xl font-semibold mb-4">ความคืบหน้าการเรียน</h2><div class="space-y-4"><!--[-->`);
          ssrRenderList(unref(learningProgress), (progress) => {
            _push(`<div class="border border-gray-200 rounded-lg p-4"><div class="flex items-center justify-between mb-2"><h3 class="font-medium text-gray-900">${ssrInterpolate(progress.course_title)}</h3><span class="text-sm text-gray-500">${ssrInterpolate(progress.completion_percentage)}%</span></div><div class="w-full bg-gray-200 rounded-full h-2"><div class="bg-green-600 h-2 rounded-full transition-all" style="${ssrRenderStyle({ width: `${progress.completion_percentage}%` })}"></div></div><div class="mt-2 text-sm text-gray-600"> เรียนแล้ว ${ssrInterpolate(progress.completed_sessions)} / ${ssrInterpolate(progress.total_sessions)} บทเรียน </div></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(canViewPayments)) {
          _push(`<div class="bg-white rounded-lg shadow p-6"><h2 class="text-xl font-semibold mb-4">ประวัติการชำระเงิน</h2>`);
          if (unref(loadingPayments)) {
            _push(`<div class="text-center py-8"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div><p class="mt-2 text-gray-600">กำลังโหลดข้อมูล...</p></div>`);
          } else if (unref(payments) && unref(payments).length > 0) {
            _push(`<div class="overflow-x-auto"><table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr><th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">วันที่ชำระ</th><th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">จำนวนเงิน</th><th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">วิธีการชำระ</th><th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">รหัสคอร์ส</th><th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">สาขา</th><th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">สถานะ</th></tr></thead><tbody class="bg-white divide-y divide-gray-200"><!--[-->`);
            ssrRenderList(unref(payments), (payment) => {
              _push(`<tr class="hover:bg-gray-50"><td class="px-4 py-3 text-sm text-gray-900">${ssrInterpolate(payment.payment_date ? formatDate(payment.payment_date) : formatDate(payment.created_at))}</td><td class="px-4 py-3 text-sm font-medium text-gray-900">${ssrInterpolate(formatCurrency(payment.amount))}</td><td class="px-4 py-3 text-sm text-gray-900">${ssrInterpolate(payment.payment_method_name)}</td><td class="px-4 py-3 text-sm text-gray-900">`);
              if (payment.enrollment) {
                _push(`<span class="font-medium text-green-600">${ssrInterpolate(payment.enrollment.course.code)}</span>`);
              } else {
                _push(`<span class="text-gray-400">-</span>`);
              }
              _push(`</td><td class="px-4 py-3 text-sm text-gray-900">`);
              if (payment.enrollment) {
                _push(`<span class="font-medium">${ssrInterpolate(payment.enrollment.branch.name)}</span>`);
              } else {
                _push(`<span class="text-gray-400">-</span>`);
              }
              _push(`</td><td class="px-4 py-3 text-sm"><span class="${ssrRenderClass([getPaymentStatusBadgeClass(payment.status), "px-2 py-1 text-xs font-medium rounded"])}">${ssrInterpolate(getPaymentStatusName(payment.status))}</span></td></tr>`);
            });
            _push(`<!--]--></tbody></table></div>`);
          } else {
            _push(`<div class="text-center py-8 text-gray-500"><svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg><p class="mt-2">ไม่มีประวัติการชำระเงิน</p></div>`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(showAddParentModal)) {
        _push(`<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"><h3 class="text-lg font-semibold mb-4">เพิ่มผู้ปกครอง</h3><form class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-2"> ค้นหาผู้ปกครอง (Username หรือ Email) </label><input${ssrRenderAttr("value", unref(parentSearch))} type="text" placeholder="กรอก username หรือ email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">`);
        if (unref(parentSearchResults).length > 0) {
          _push(`<div class="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg"><!--[-->`);
          ssrRenderList(unref(parentSearchResults), (user2) => {
            _push(`<button type="button" class="w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"><div class="font-medium">${ssrInterpolate(user2.first_name)} ${ssrInterpolate(user2.last_name)}</div><div class="text-sm text-gray-500">${ssrInterpolate(user2.username)} - ${ssrInterpolate(user2.email || "-")}</div></button>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(selectedParentToAdd)) {
          _push(`<div><label class="block text-sm font-medium text-gray-700 mb-2"> ความสัมพันธ์ <span class="text-red-500">*</span></label><select required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value="father"${ssrIncludeBooleanAttr(Array.isArray(unref(parentRelationship)) ? ssrLooseContain(unref(parentRelationship), "father") : ssrLooseEqual(unref(parentRelationship), "father")) ? " selected" : ""}>บิดา</option><option value="mother"${ssrIncludeBooleanAttr(Array.isArray(unref(parentRelationship)) ? ssrLooseContain(unref(parentRelationship), "mother") : ssrLooseEqual(unref(parentRelationship), "mother")) ? " selected" : ""}>มารดา</option><option value="guardian"${ssrIncludeBooleanAttr(Array.isArray(unref(parentRelationship)) ? ssrLooseContain(unref(parentRelationship), "guardian") : ssrLooseEqual(unref(parentRelationship), "guardian")) ? " selected" : ""}>ผู้ปกครอง</option><option value="other"${ssrIncludeBooleanAttr(Array.isArray(unref(parentRelationship)) ? ssrLooseContain(unref(parentRelationship), "other") : ssrLooseEqual(unref(parentRelationship), "other")) ? " selected" : ""}>อื่นๆ</option></select></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(addParentError)) {
          _push(`<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">${ssrInterpolate(unref(addParentError))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex justify-end space-x-3 pt-4"><button type="button" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"> ยกเลิก </button><button type="submit"${ssrIncludeBooleanAttr(!unref(selectedParentToAdd) || unref(addingParent)) ? " disabled" : ""} class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">`);
        if (unref(addingParent)) {
          _push(`<span>กำลังเพิ่ม...</span>`);
        } else {
          _push(`<span>เพิ่ม</span>`);
        }
        _push(`</button></div></form></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(parentToEdit)) {
        _push(`<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"><h3 class="text-lg font-semibold mb-4">แก้ไขผู้ปกครอง</h3><form class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-2"> ชื่อ <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(editParentForm).first_name)} type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> นามสกุล <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(editParentForm).last_name)} type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Email </label><input${ssrRenderAttr("value", unref(editParentForm).email)} type="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> เบอร์โทรศัพท์ </label><input${ssrRenderAttr("value", unref(editParentForm).phone)} type="tel" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> ความสัมพันธ์ <span class="text-red-500">*</span></label><select required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option value="father"${ssrIncludeBooleanAttr(Array.isArray(unref(editParentForm).relationship) ? ssrLooseContain(unref(editParentForm).relationship, "father") : ssrLooseEqual(unref(editParentForm).relationship, "father")) ? " selected" : ""}>บิดา</option><option value="mother"${ssrIncludeBooleanAttr(Array.isArray(unref(editParentForm).relationship) ? ssrLooseContain(unref(editParentForm).relationship, "mother") : ssrLooseEqual(unref(editParentForm).relationship, "mother")) ? " selected" : ""}>มารดา</option><option value="guardian"${ssrIncludeBooleanAttr(Array.isArray(unref(editParentForm).relationship) ? ssrLooseContain(unref(editParentForm).relationship, "guardian") : ssrLooseEqual(unref(editParentForm).relationship, "guardian")) ? " selected" : ""}>ผู้ปกครอง</option><option value="other"${ssrIncludeBooleanAttr(Array.isArray(unref(editParentForm).relationship) ? ssrLooseContain(unref(editParentForm).relationship, "other") : ssrLooseEqual(unref(editParentForm).relationship, "other")) ? " selected" : ""}>อื่นๆ</option></select></div>`);
        if (unref(editParentError)) {
          _push(`<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">${ssrInterpolate(unref(editParentError))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex justify-end space-x-3 pt-4"><button type="button" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"> ยกเลิก </button><button type="submit"${ssrIncludeBooleanAttr(unref(editingParent)) ? " disabled" : ""} class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">`);
        if (unref(editingParent)) {
          _push(`<span>กำลังบันทึก...</span>`);
        } else {
          _push(`<span>บันทึก</span>`);
        }
        _push(`</button></div></form></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(showEditStudentModal)) {
        _push(ssrRenderComponent(_component_StudentModal, {
          show: unref(showEditStudentModal),
          student: unref(editingStudent),
          onClose: closeEditStudentModal,
          onSaved: handleStudentSaved
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/students/[id]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CScfA6Bq.mjs.map
