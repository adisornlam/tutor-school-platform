<template>
  <div @click="showViewMenu = false; showCreateMenu = false; showDateMenu = {}">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold">ปฏิทินกิจกรรม</h1>
        <p class="text-gray-600 mt-1">จัดการและดูตารางสอนและกิจกรรมของคุณ</p>
      </div>
      <div class="flex items-center space-x-4">
        <!-- Create Button with Dropdown -->
        <div class="relative" @click.stop="">
          <button
            @click.stop="showCreateMenu = !showCreateMenu"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>สร้าง</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <!-- Dropdown Menu -->
          <div
            v-if="showCreateMenu"
            @click.stop=""
            class="absolute left-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-1 z-50"
          >
            <button
              @click="showCreateMenu = false; selectedDateForCreate = null; showEventModal = true; selectedEvent = null"
              class="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>กิจกรรม</span>
            </button>
            <button
              @click="showCreateMenu = false; selectedDateForCreate = null; showTaskModal = true; selectedTask = null"
              class="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span>งาน</span>
            </button>
            <button
              @click="showCreateMenu = false; selectedDateForCreate = null; showAppointmentModal = true; selectedAppointment = null"
              class="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>กำหนดเวลาการนัดหมาย</span>
            </button>
          </div>
        </div>

        <!-- View Mode Selector (Google Calendar Style) -->
        <div class="relative" @click.stop="">
          <button
            @click.stop="showViewMenu = !showViewMenu"
            class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2 text-gray-700"
          >
            <span>{{ currentViewLabel }}</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
            <!-- Dropdown Menu -->
          <div
            v-if="showViewMenu"
            @click.stop=""
            class="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-50"
          >
            <div class="py-1">
              <button
                v-for="view in viewModes"
                :key="view.value"
                @click="changeViewMode(view.value)"
                class="w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center justify-between"
                :class="{ 'bg-gray-700': viewMode === view.value }"
              >
                <span>{{ view.label }}</span>
                <span class="text-gray-400 text-sm">{{ view.shortcut }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons (for calendar views) -->
        <div v-if="isCalendarView" class="flex items-center space-x-2">
          <button
            @click="navigatePrevious"
            class="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            @click="navigateToday"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
          >
            วันนี้
          </button>
          <button
            @click="navigateNext"
            class="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <!-- Current Period Label (for calendar views) -->
        <div v-if="isCalendarView" class="text-lg font-semibold text-gray-700">
          {{ currentPeriodLabel }}
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">วันนี้</p>
            <p class="text-2xl font-bold text-gray-900">{{ todayCount }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">สัปดาห์นี้</p>
            <p class="text-2xl font-bold text-gray-900">{{ weekCount }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">กำลังสอน</p>
            <p class="text-2xl font-bold text-orange-600">{{ ongoingCount }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">เสร็จสิ้น</p>
            <p class="text-2xl font-bold text-green-600">{{ completedCount }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">ช่วงเวลา</label>
          <select
            v-model="dateRange"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            @change="handleDateRangeChange"
          >
            <option value="today">วันนี้</option>
            <option value="week">สัปดาห์นี้</option>
            <option value="month">เดือนนี้</option>
            <option value="upcoming">ที่กำลังจะมาถึง</option>
            <option value="all">ทั้งหมด</option>
            <option value="custom">กำหนดเอง</option>
          </select>
        </div>
        <div v-if="dateRange === 'custom'">
          <label class="block text-sm font-medium text-gray-700 mb-2">จากวันที่</label>
          <input
            v-model="customStartDate"
            type="date"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            @change="loadSchedules"
          >
        </div>
        <div v-if="dateRange === 'custom'">
          <label class="block text-sm font-medium text-gray-700 mb-2">ถึงวันที่</label>
          <input
            v-model="customEndDate"
            type="date"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            @change="loadSchedules"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">สถานะ</label>
          <select
            v-model="filters.status"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            @change="loadSchedules"
          >
            <option value="">ทั้งหมด</option>
            <option value="scheduled">กำหนดแล้ว</option>
            <option value="ongoing">กำลังสอน</option>
            <option value="completed">เสร็จสิ้น</option>
            <option value="cancelled">ยกเลิก</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">คอร์ส</label>
          <select
            v-model="filters.courseId"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            @change="loadSchedules"
          >
            <option value="">ทั้งหมด</option>
            <option v-for="course in courses" :key="course.id" :value="course.id">
              {{ course.title }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Day View -->
    <div v-if="viewMode === 'day'" class="bg-white rounded-lg shadow p-6">
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p class="mt-2 text-gray-600">กำลังโหลด...</p>
      </div>

      <div v-else-if="error" class="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
        {{ error }}
      </div>

      <div v-else>
        <!-- Day Schedule Timeline -->
        <div class="space-y-4">
          <!-- Events -->
          <div
            v-for="event in getEventsForDay(currentDay)"
            :key="`event-${event.id}`"
            class="border-l-4 p-4 rounded-r-lg cursor-pointer hover:shadow-md transition-shadow"
            :style="{ borderColor: event.color }"
            @click="openEditEvent(event)"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-2">
                  <span class="text-lg font-semibold text-gray-900">{{ event.title }}</span>
                  <span class="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
                    Event
                  </span>
                  <span v-if="event.is_shared" class="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700">
                    แชร์
                  </span>
                </div>
                <div class="text-sm text-gray-600 mb-2">
                  <div v-if="event.location">สถานที่: {{ event.location }}</div>
                  <div>เวลา: {{ formatTimeRange(event.start_datetime, event.end_datetime) }}</div>
                  <div v-if="event.description" class="mt-1 text-gray-500">{{ event.description }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tasks -->
          <div
            v-for="task in getTasksForDay(currentDay)"
            :key="`task-${task.id}`"
            class="border-l-4 p-4 rounded-r-lg cursor-pointer hover:shadow-md transition-shadow"
            :style="{ borderColor: task.color }"
            @click="openEditTask(task)"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-2">
                  <svg class="w-5 h-5" :class="task.status === 'completed' ? 'text-green-600' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="task.status === 'completed'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span class="text-lg font-semibold text-gray-900" :class="task.status === 'completed' ? 'line-through opacity-60' : ''">{{ task.title }}</span>
                  <span class="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700">
                    งาน
                  </span>
                  <span v-if="task.status === 'completed'" class="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
                    เสร็จแล้ว
                  </span>
                </div>
                <div class="text-sm text-gray-600 mb-2">
                  <div v-if="task.due_date">ครบกำหนด: {{ formatDateTime(task.due_date) }}</div>
                  <div v-if="task.priority" class="capitalize">ลำดับความสำคัญ: {{ task.priority }}</div>
                  <div v-if="task.description" class="mt-1 text-gray-500">{{ task.description }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Appointments -->
          <div
            v-for="appointment in getAppointmentsForDay(currentDay)"
            :key="`appointment-${appointment.id}`"
            class="border-l-4 p-4 rounded-r-lg cursor-pointer hover:shadow-md transition-shadow"
            :style="{ borderColor: appointment.color }"
            @click="openEditAppointment(appointment)"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-2">
                  <span class="text-lg font-semibold text-gray-900">{{ appointment.title }}</span>
                  <span class="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700">
                    การนัดหมาย
                  </span>
                  <span v-if="appointment.status === 'confirmed'" class="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700">
                    ยืนยันแล้ว
                  </span>
                </div>
                <div class="text-sm text-gray-600 mb-2">
                  <div v-if="appointment.location">สถานที่: {{ appointment.location }}</div>
                  <div>เวลา: {{ formatTimeRange(appointment.start_datetime, appointment.end_datetime) }}</div>
                  <div v-if="appointment.participants && appointment.participants.length > 0">
                    ผู้เข้าร่วม: {{ appointment.participants.length }} คน
                  </div>
                  <div v-if="appointment.description" class="mt-1 text-gray-500">{{ appointment.description }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Schedules -->
          <div
            v-for="schedule in getSchedulesForDay(currentDay)"
            :key="schedule.id"
            class="border-l-4 p-4 rounded-r-lg"
            :class="getScheduleBorderClass(schedule.status)"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-2">
                  <span class="text-lg font-semibold text-gray-900">{{ schedule.course.title }}</span>
                  <span class="px-2 py-1 text-xs font-medium rounded" :class="getStatusBadgeClass(schedule.status)">
                    {{ getStatusName(schedule.status) }}
                  </span>
                  <span class="px-2 py-1 text-xs font-medium rounded" :class="getSessionTypeBadgeClass(schedule.session_type)">
                    {{ getSessionTypeName(schedule.session_type) }}
                  </span>
                </div>
                <div class="text-sm text-gray-600 mb-2">
                  <div>สาขา: {{ schedule.branch.name }}</div>
                  <div>เวลา: {{ formatTimeRange(schedule.start_datetime, schedule.end_datetime) }}</div>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <a
                  v-if="schedule.session_type === 'live' && schedule.meeting_link"
                  :href="schedule.meeting_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  เข้าร่วม
                </a>
                <a
                  v-else-if="schedule.session_type === 'vod' && schedule.video_url"
                  :href="schedule.video_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                >
                  ดูวิดีโอ
                </a>
              </div>
            </div>
          </div>
          <div v-if="getSchedulesForDay(currentDay).length === 0 && getEventsForDay(currentDay).length === 0 && getTasksForDay(currentDay).length === 0 && getAppointmentsForDay(currentDay).length === 0" class="text-center py-12 text-gray-500">
            ไม่มีกิจกรรมในวันนี้
          </div>
        </div>
      </div>
    </div>

    <!-- Weekly Calendar View -->
    <div v-else-if="viewMode === 'week'" class="bg-white rounded-lg shadow p-6">
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p class="mt-2 text-gray-600">กำลังโหลด...</p>
      </div>

      <div v-else-if="error" class="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
        {{ error }}
      </div>

      <div v-else>
        <!-- Calendar Grid -->
        <div class="grid grid-cols-7 gap-2">
          <!-- Day Headers -->
          <div
            v-for="day in weekDays"
            :key="day.key"
            class="text-center font-semibold text-gray-700 py-2 border-b"
          >
            <div class="text-sm">{{ day.label }}</div>
          </div>

          <!-- Day Cells -->
          <div
            v-for="day in weekDays"
            :key="day.key"
            class="min-h-32 border border-gray-200 rounded-lg p-2 relative group"
            :class="{
              'bg-blue-50': isToday(day.date),
              'bg-gray-50': day.date < new Date(new Date().setHours(0, 0, 0, 0))
            }"
          >
            <!-- Date Header with Menu Button -->
            <div class="flex items-center justify-between mb-2">
              <div class="text-xs font-medium text-gray-600">
                {{ formatDay(day.date) }}
              </div>
              <!-- Date Menu (3 dots) - Show on hover -->
              <div class="relative" @click.stop="">
                <button
                  @click.stop="showDateMenu[day.key] = !showDateMenu[day.key]"
                  class="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200 transition-opacity"
                  :title="`จัดการ${format(day.date, ' dd MMM yyyy', { locale: th })}`"
                >
                  <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
                
                <!-- Date Menu Dropdown -->
                <div
                  v-if="showDateMenu[day.key]"
                  @click.stop=""
                  class="absolute right-0 mt-1 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-1 z-50"
                >
                  <button
                    @click="showDateMenu[day.key] = false; selectedDateForCreate = day.date; showEventModal = true; selectedEvent = null"
                    class="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors flex items-center space-x-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>สร้างกิจกรรม</span>
                  </button>
                  <button
                    @click="showDateMenu[day.key] = false; selectedDateForCreate = day.date; showTaskModal = true; selectedTask = null"
                    class="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors flex items-center space-x-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <span>สร้างงาน</span>
                  </button>
                  <button
                    @click="showDateMenu[day.key] = false; selectedDateForCreate = day.date; showAppointmentModal = true; selectedAppointment = null"
                    class="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors flex items-center space-x-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>สร้างการนัดหมาย</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="space-y-1">
              <!-- Events -->
              <div
                v-for="event in getEventsForDay(day.date)"
                :key="`event-${event.id}`"
                class="text-xs p-1 rounded cursor-pointer truncate"
                :style="{ backgroundColor: event.color + '20', borderLeft: `3px solid ${event.color}` }"
                @click="openEditEvent(event)"
              >
                <div class="font-medium truncate text-gray-900">{{ event.title }}</div>
                <div class="text-xs opacity-75 text-gray-600">
                  {{ formatTime(event.start_datetime) }}
                </div>
              </div>
              
              <!-- Tasks -->
              <div
                v-for="task in getTasksForDay(day.date)"
                :key="`task-${task.id}`"
                class="text-xs p-1 rounded cursor-pointer truncate flex items-center space-x-1"
                :style="{ backgroundColor: task.color + '20', borderLeft: `2px solid ${task.color}` }"
                @click="openEditTask(task)"
              >
                <svg class="w-3 h-3 flex-shrink-0" :class="task.status === 'completed' ? 'text-green-600' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="task.status === 'completed'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <div class="font-medium truncate text-gray-900" :class="task.status === 'completed' ? 'line-through opacity-60' : ''">
                  {{ task.title }}
                </div>
              </div>
              
              <!-- Appointments -->
              <div
                v-for="appointment in getAppointmentsForDay(day.date)"
                :key="`appointment-${appointment.id}`"
                class="text-xs p-1 rounded cursor-pointer truncate"
                :style="{ backgroundColor: appointment.color + '20', borderLeft: `3px solid ${appointment.color}` }"
                @click="openEditAppointment(appointment)"
              >
                <div class="font-medium truncate text-gray-900">{{ appointment.title }}</div>
                <div class="text-xs opacity-75 text-gray-600">
                  {{ formatTime(appointment.start_datetime) }}
                </div>
              </div>

              <!-- Schedules -->
              <div
                v-for="schedule in getSchedulesForDay(day.date)"
                :key="schedule.id"
                class="text-xs p-1 rounded cursor-pointer"
                :class="getScheduleCardClass(schedule)"
                @click="selectedSchedule = schedule"
              >
                <div class="font-medium truncate">{{ schedule.course.title }}</div>
                <div class="text-xs opacity-75">
                  {{ formatTime(schedule.start_datetime) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Month View -->
    <div v-else-if="viewMode === 'month'" class="bg-white rounded-lg shadow p-6">
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p class="mt-2 text-gray-600">กำลังโหลด...</p>
      </div>

      <div v-else-if="error" class="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
        {{ error }}
      </div>

      <div v-else>
        <!-- Month Calendar Grid -->
        <div class="grid grid-cols-7 gap-1 mb-2">
          <!-- Day Headers -->
          <div
            v-for="day in weekDays"
            :key="day.key"
            class="text-center font-semibold text-gray-700 py-2"
          >
            <div class="text-sm">{{ day.label }}</div>
          </div>
        </div>

        <!-- Calendar Days Grid -->
        <div class="grid grid-cols-7 gap-1">
          <div
            v-for="day in monthDays"
            :key="day.key"
            class="min-h-24 border border-gray-200 rounded p-1"
            :class="{
              'bg-blue-50': isToday(day.date),
              'bg-gray-50': !isSameMonth(day.date, currentMonth),
            }"
          >
            <div class="text-xs font-medium text-gray-600 mb-1">
              {{ formatDay(day.date) }}
            </div>
            <div class="space-y-0.5">
              <!-- Events -->
              <div
                v-for="event in getEventsForDay(day.date)"
                :key="`event-${event.id}`"
                class="text-xs p-0.5 rounded truncate cursor-pointer"
                :style="{ backgroundColor: event.color + '20', borderLeft: `2px solid ${event.color}` }"
                :title="event.title"
                @click="openEditEvent(event)"
              >
                {{ formatTime(event.start_datetime) }} {{ event.title }}
              </div>
              <!-- Tasks -->
              <div
                v-for="task in getTasksForDay(day.date)"
                :key="`task-${task.id}`"
                class="text-xs p-0.5 rounded truncate cursor-pointer flex items-center space-x-1"
                :style="{ backgroundColor: task.color + '20', borderLeft: `2px solid ${task.color}` }"
                :title="task.title"
                @click="openEditTask(task)"
              >
                <span :class="task.status === 'completed' ? 'line-through opacity-60' : ''">{{ task.title }}</span>
              </div>
              <!-- Appointments -->
              <div
                v-for="appointment in getAppointmentsForDay(day.date)"
                :key="`appointment-${appointment.id}`"
                class="text-xs p-0.5 rounded truncate cursor-pointer"
                :style="{ backgroundColor: appointment.color + '20', borderLeft: `2px solid ${appointment.color}` }"
                :title="appointment.title"
                @click="openEditAppointment(appointment)"
              >
                {{ formatTime(appointment.start_datetime) }} {{ appointment.title }}
              </div>
              <!-- Schedules -->
              <div
                v-for="schedule in getSchedulesForDay(day.date)"
                :key="schedule.id"
                class="text-xs p-1 rounded truncate cursor-pointer"
                :class="getScheduleCardClass(schedule)"
                :title="schedule.course.title"
              >
                {{ formatTime(schedule.start_datetime) }} {{ schedule.course.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 4 Days View -->
    <div v-else-if="viewMode === '4days'" class="bg-white rounded-lg shadow p-6">
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p class="mt-2 text-gray-600">กำลังโหลด...</p>
      </div>

      <div v-else-if="error" class="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
        {{ error }}
      </div>

      <div v-else>
        <!-- 4 Days Grid -->
        <div class="grid grid-cols-4 gap-4">
          <div
            v-for="day in fourDays"
            :key="day.key"
            class="border border-gray-200 rounded-lg p-4"
            :class="{
              'bg-blue-50': isToday(day.date),
            }"
          >
            <div class="font-semibold text-gray-700 mb-3">
              <div class="text-sm">{{ day.label }}</div>
              <div class="text-xs text-gray-500">{{ formatDay(day.date) }}</div>
            </div>
            <div class="space-y-2">
              <!-- Events -->
              <div
                v-for="event in getEventsForDay(day.date)"
                :key="`event-${event.id}`"
                class="text-xs p-2 rounded cursor-pointer"
                :style="{ backgroundColor: event.color + '20', borderLeft: `3px solid ${event.color}` }"
                @click="openEditEvent(event)"
              >
                <div class="font-medium truncate text-gray-900">{{ event.title }}</div>
                <div class="text-xs opacity-75 text-gray-600">
                  {{ formatTimeRange(event.start_datetime, event.end_datetime) }}
                </div>
              </div>
              
              <!-- Tasks -->
              <div
                v-for="task in getTasksForDay(day.date)"
                :key="`task-${task.id}`"
                class="text-xs p-2 rounded cursor-pointer flex items-center space-x-1"
                :style="{ backgroundColor: task.color + '20', borderLeft: `3px solid ${task.color}` }"
                @click="openEditTask(task)"
              >
                <svg class="w-3 h-3 flex-shrink-0" :class="task.status === 'completed' ? 'text-green-600' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="task.status === 'completed'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <div class="font-medium truncate text-gray-900" :class="task.status === 'completed' ? 'line-through opacity-60' : ''">
                  {{ task.title }}
                </div>
              </div>
              
              <!-- Appointments -->
              <div
                v-for="appointment in getAppointmentsForDay(day.date)"
                :key="`appointment-${appointment.id}`"
                class="text-xs p-2 rounded cursor-pointer"
                :style="{ backgroundColor: appointment.color + '20', borderLeft: `3px solid ${appointment.color}` }"
                @click="openEditAppointment(appointment)"
              >
                <div class="font-medium truncate text-gray-900">{{ appointment.title }}</div>
                <div class="text-xs opacity-75 text-gray-600">
                  {{ formatTimeRange(appointment.start_datetime, appointment.end_datetime) }}
                </div>
              </div>

              <!-- Schedules -->
              <div
                v-for="schedule in getSchedulesForDay(day.date)"
                :key="schedule.id"
                class="text-xs p-2 rounded cursor-pointer"
                :class="getScheduleCardClass(schedule)"
              >
                <div class="font-medium truncate">{{ schedule.course.title }}</div>
                <div class="text-xs opacity-75">
                  {{ formatTimeRange(schedule.start_datetime, schedule.end_datetime) }}
                </div>
              </div>
              <div v-if="getSchedulesForDay(day.date).length === 0 && getEventsForDay(day.date).length === 0 && getTasksForDay(day.date).length === 0 && getAppointmentsForDay(day.date).length === 0" class="text-xs text-gray-400 text-center py-4">
                ไม่มี
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Agenda View (List View) -->
    <div v-else-if="viewMode === 'agenda'" class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p class="mt-2 text-gray-600">กำลังโหลด...</p>
      </div>

      <div v-else-if="error" class="p-4 bg-red-50 border border-red-200 text-red-700 rounded m-4">
        {{ error }}
      </div>

      <div v-else-if="schedules.length === 0 && events.length === 0 && tasks.length === 0 && appointments.length === 0" class="p-8 text-center text-gray-500">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p class="mt-4 text-lg font-medium">ไม่พบกิจกรรม</p>
        <p class="mt-1 text-sm">ไม่มีตารางสอน, กิจกรรม, งาน หรือการนัดหมายในช่วงเวลาที่เลือก</p>
      </div>

      <div v-else class="space-y-4">
        <!-- Events Section -->
        <div v-if="events.length > 0">
          <h3 class="px-6 py-3 text-lg font-semibold text-gray-900 border-b">Events</h3>
          <div class="divide-y divide-gray-200">
            <div
              v-for="event in events"
              :key="`event-${event.id}`"
              class="px-6 py-4 hover:bg-gray-50 cursor-pointer"
              @click="openEditEvent(event)"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-2">
                    <div
                      class="w-4 h-4 rounded"
                      :style="{ backgroundColor: event.color }"
                    ></div>
                    <div class="text-sm font-medium text-gray-900">{{ event.title }}</div>
                    <span v-if="event.is_shared" class="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700">
                      แชร์
                    </span>
                  </div>
                  <div class="mt-1 text-sm text-gray-500">
                    {{ formatDateTime(event.start_datetime) }}
                    <span v-if="event.location" class="ml-2">• {{ event.location }}</span>
                  </div>
                  <div v-if="event.description" class="mt-1 text-sm text-gray-600">
                    {{ event.description }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tasks Section -->
        <div v-if="tasks.length > 0">
          <h3 class="px-6 py-3 text-lg font-semibold text-gray-900 border-b">งาน</h3>
          <div class="divide-y divide-gray-200">
            <div
              v-for="task in tasks"
              :key="`task-${task.id}`"
              class="px-6 py-4 hover:bg-gray-50 cursor-pointer"
              @click="openEditTask(task)"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4" :class="task.status === 'completed' ? 'text-green-600' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path v-if="task.status === 'completed'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <div class="text-sm font-medium text-gray-900" :class="task.status === 'completed' ? 'line-through opacity-60' : ''">{{ task.title }}</div>
                  </div>
                  <div class="mt-1 text-sm text-gray-500">
                    <span v-if="task.due_date">{{ formatDateTime(task.due_date) }}</span>
                    <span v-if="task.priority" class="ml-2 capitalize">• {{ task.priority }}</span>
                  </div>
                  <div v-if="task.description" class="mt-1 text-sm text-gray-600">
                    {{ task.description }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Appointments Section -->
        <div v-if="appointments.length > 0">
          <h3 class="px-6 py-3 text-lg font-semibold text-gray-900 border-b">การนัดหมาย</h3>
          <div class="divide-y divide-gray-200">
            <div
              v-for="appointment in appointments"
              :key="`appointment-${appointment.id}`"
              class="px-6 py-4 hover:bg-gray-50 cursor-pointer"
              @click="openEditAppointment(appointment)"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-2">
                    <div
                      class="w-4 h-4 rounded"
                      :style="{ backgroundColor: appointment.color }"
                    ></div>
                    <div class="text-sm font-medium text-gray-900">{{ appointment.title }}</div>
                    <span v-if="appointment.status === 'confirmed'" class="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700">
                      ยืนยันแล้ว
                    </span>
                  </div>
                  <div class="mt-1 text-sm text-gray-500">
                    {{ formatDateTime(appointment.start_datetime) }}
                    <span v-if="appointment.location" class="ml-2">• {{ appointment.location }}</span>
                    <span v-if="appointment.participants && appointment.participants.length > 0" class="ml-2">• {{ appointment.participants.length }} คน</span>
                  </div>
                  <div v-if="appointment.description" class="mt-1 text-sm text-gray-600">
                    {{ appointment.description }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Schedules Section -->
        <div v-if="schedules.length > 0">
          <h3 class="px-6 py-3 text-lg font-semibold text-gray-900 border-b">ตารางสอน</h3>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันเวลา</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">คอร์ส</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สาขา</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ประเภท</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ลิงก์</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="schedule in schedules" :key="schedule.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ formatDateTime(schedule.start_datetime) }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ formatTimeRange(schedule.start_datetime, schedule.end_datetime) }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ schedule.course.title }}
                  </div>
                  <div v-if="schedule.course.code" class="text-xs text-gray-500">
                    {{ schedule.course.code }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ schedule.branch.name }}
                  </div>
                  <div v-if="schedule.branch.code" class="text-xs text-gray-500">
                    {{ schedule.branch.code }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs font-medium rounded" :class="getSessionTypeBadgeClass(schedule.session_type)">
                    {{ getSessionTypeName(schedule.session_type) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs font-medium rounded" :class="getStatusBadgeClass(schedule.status)">
                    {{ getStatusName(schedule.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-if="schedule.session_type === 'live' && schedule.meeting_link" class="flex items-center space-x-2">
                    <a
                      :href="schedule.meeting_link"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      เข้าร่วม
                    </a>
                  </div>
                  <div v-else-if="schedule.session_type === 'vod' && schedule.video_url" class="flex items-center space-x-2">
                    <a
                      :href="schedule.video_url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-purple-600 hover:text-purple-800 text-sm flex items-center"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      ดูวิดีโอ
                    </a>
                  </div>
                  <span v-else class="text-xs text-gray-400">-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Event Modal -->
    <EventModal
      :show="showEventModal"
      :event="selectedEvent"
      :initial-date="selectedDateForCreate"
      @close="showEventModal = false; selectedEvent = null; selectedDateForCreate = null"
      @saved="handleEventSaved"
    />

    <!-- Task Modal -->
    <TaskModal
      :show="showTaskModal"
      :task="selectedTask"
      :initial-date="selectedDateForCreate"
      @close="showTaskModal = false; selectedTask = null; selectedDateForCreate = null"
      @saved="handleTaskSaved"
    />

    <!-- Appointment Modal -->
    <AppointmentModal
      :show="showAppointmentModal"
      :appointment="selectedAppointment"
      :initial-date="selectedDateForCreate"
      @close="showAppointmentModal = false; selectedAppointment = null; selectedDateForCreate = null"
      @saved="handleAppointmentSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { format, addDays, startOfWeek, endOfWeek, isSameDay, parseISO, isToday as isTodayFn, startOfDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths, addWeeks, subWeeks } from 'date-fns'
import { th } from 'date-fns/locale'

definePageMeta({
  middleware: 'admin',
  layout: 'admin'
})

const config = useRuntimeConfig()
const { accessToken } = useAuth()

interface Schedule {
  id: number
  course_id: number
  branch_id: number
  tutor_id: number
  start_datetime: string
  end_datetime: string
  session_type: 'live' | 'vod'
  meeting_link?: string | null
  video_url?: string | null
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
  course: {
    id: number
    title: string
    code?: string | null
    type?: string | null
  }
  branch: {
    id: number
    name: string
    code?: string | null
  }
}

interface Course {
  id: number
  title: string
}

const schedules = ref<Schedule[]>([])
const events = ref<any[]>([])
const tasks = ref<any[]>([])
const appointments = ref<any[]>([])
const courses = ref<Course[]>([])
const loading = ref(true)
const error = ref('')
const viewMode = ref<'day' | 'week' | 'month' | 'agenda' | '4days'>('month')
const dateRange = ref('month')
const customStartDate = ref('')
const customEndDate = ref('')
const currentWeekStart = ref(startOfWeek(new Date(), { weekStartsOn: 1 })) // Monday
const currentDay = ref(new Date())
const currentMonth = ref(startOfMonth(new Date()))
const selectedSchedule = ref<Schedule | null>(null)
const showViewMenu = ref(false)
const showCreateMenu = ref(false)
const showDateMenu = ref<Record<number, boolean>>({})
const showEventModal = ref(false)
const showTaskModal = ref(false)
const showAppointmentModal = ref(false)
const selectedEvent = ref<any | null>(null)
const selectedTask = ref<any | null>(null)
const selectedAppointment = ref<any | null>(null)
const selectedDateForCreate = ref<Date | null>(null)

const viewModes = [
  { value: 'day', label: 'วัน', shortcut: 'D' },
  { value: 'week', label: 'สัปดาห์', shortcut: 'W' },
  { value: 'month', label: 'เดือน', shortcut: 'M' },
  { value: 'agenda', label: 'กำหนดการ', shortcut: 'A' },
  { value: '4days', label: '4 วัน', shortcut: 'X' }
]

const filters = reactive({
  status: '',
  courseId: ''
})

// Computed properties
const currentViewLabel = computed(() => {
  const view = viewModes.find(v => v.value === viewMode.value)
  return view?.label || 'สัปดาห์'
})

const isCalendarView = computed(() => {
  return ['day', 'week', 'month', '4days'].includes(viewMode.value)
})

const currentPeriodLabel = computed(() => {
  if (viewMode.value === 'day') {
    return format(currentDay.value, 'dd MMMM yyyy', { locale: th })
  } else if (viewMode.value === 'week') {
    return formatWeekRange(currentWeekStart.value)
  } else if (viewMode.value === 'month') {
    return format(currentMonth.value, 'MMMM yyyy', { locale: th })
  } else if (viewMode.value === '4days') {
    const endDate = addDays(currentDay.value, 3)
    return `${format(currentDay.value, 'dd MMM', { locale: th })} - ${format(endDate, 'dd MMM yyyy', { locale: th })}`
  }
  return ''
})

const fourDays = computed(() => {
  const days = []
  const dayNames = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี']
  for (let i = 0; i < 4; i++) {
    const date = addDays(currentDay.value, i)
    days.push({
      key: i,
      label: dayNames[i] || format(date, 'EEEE', { locale: th }),
      date: date
    })
  }
  return days
})

const monthDays = computed(() => {
  const start = startOfWeek(startOfMonth(currentMonth.value), { weekStartsOn: 1 })
  const end = endOfWeek(endOfMonth(currentMonth.value), { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start, end })
  return days.map((date, index) => ({
    key: index,
    date: date
  }))
})

// Computed properties for summary
const todayCount = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return schedules.value.filter(s => 
    s.start_datetime.startsWith(today) && s.status !== 'cancelled'
  ).length
})

const weekCount = computed(() => {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })
  return schedules.value.filter(s => {
    const scheduleDate = parseISO(s.start_datetime)
    return scheduleDate >= weekStart && scheduleDate <= weekEnd && s.status !== 'cancelled'
  }).length
})

const ongoingCount = computed(() => {
  return schedules.value.filter(s => s.status === 'ongoing').length
})

const completedCount = computed(() => {
  return schedules.value.filter(s => s.status === 'completed').length
})

// Week days for calendar
const weekDays = computed(() => {
  const days = []
  for (let i = 0; i < 7; i++) {
    const date = addDays(currentWeekStart.value, i)
    const dayNames = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์']
    days.push({
      key: i,
      label: dayNames[i],
      date: date
    })
  }
  return days
})

const loadCourses = async () => {
  try {
    const response = await $fetch<{
      success: boolean
      data: Course[]
    }>(`${config.public.apiBase}/admin/courses`, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })

    if (response.success) {
      courses.value = response.data
    }
  } catch (err: any) {
    console.error('Error loading courses:', err)
  }
}

const loadEvents = async () => {
  try {
    const params: any = {}

    // Calculate date range based on view mode
    if (viewMode.value === 'day') {
      params.start_date = format(currentDay.value, 'yyyy-MM-dd')
      params.end_date = format(currentDay.value, 'yyyy-MM-dd')
    } else if (viewMode.value === 'week') {
      const weekEnd = endOfWeek(currentWeekStart.value, { weekStartsOn: 1 })
      params.start_date = format(currentWeekStart.value, 'yyyy-MM-dd')
      params.end_date = format(weekEnd, 'yyyy-MM-dd')
    } else if (viewMode.value === 'month') {
      const monthStart = startOfMonth(currentMonth.value)
      const monthEnd = endOfMonth(currentMonth.value)
      params.start_date = format(monthStart, 'yyyy-MM-dd')
      params.end_date = format(monthEnd, 'yyyy-MM-dd')
    } else if (viewMode.value === '4days') {
      const endDate = addDays(currentDay.value, 3)
      params.start_date = format(currentDay.value, 'yyyy-MM-dd')
      params.end_date = format(endDate, 'yyyy-MM-dd')
    } else if (viewMode.value === 'agenda') {
      const today = new Date().toISOString().split('T')[0]
      params.start_date = today
    } else {
      // Fallback to dateRange filter
      if (dateRange.value === 'today') {
        const today = new Date().toISOString().split('T')[0]
        params.start_date = today
        params.end_date = today
      } else if (dateRange.value === 'week') {
        const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
        const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })
        params.start_date = format(weekStart, 'yyyy-MM-dd')
        params.end_date = format(weekEnd, 'yyyy-MM-dd')
      } else if (dateRange.value === 'month') {
        const now = new Date()
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        params.start_date = format(monthStart, 'yyyy-MM-dd')
        params.end_date = format(monthEnd, 'yyyy-MM-dd')
      } else if (dateRange.value === 'upcoming') {
        const today = new Date().toISOString().split('T')[0]
        params.start_date = today
      } else if (dateRange.value === 'custom') {
        if (customStartDate.value) params.start_date = customStartDate.value
        if (customEndDate.value) params.end_date = customEndDate.value
      }
    }

    params.include_shared = 'true'

    const response = await $fetch<{
      success: boolean
      data: any[]
    }>(`${config.public.apiBase}/calendar/events`, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      },
      params
    })

    if (response.success) {
      events.value = response.data
    }
  } catch (err: any) {
    console.error('Error loading events:', err)
  }
}

const loadTasks = async () => {
  try {
    const params: any = {}

    // Calculate date range based on view mode
    if (viewMode.value === 'day') {
      params.start_date = format(currentDay.value, 'yyyy-MM-dd')
      params.end_date = format(currentDay.value, 'yyyy-MM-dd')
    } else if (viewMode.value === 'week') {
      const weekEnd = endOfWeek(currentWeekStart.value, { weekStartsOn: 1 })
      params.start_date = format(currentWeekStart.value, 'yyyy-MM-dd')
      params.end_date = format(weekEnd, 'yyyy-MM-dd')
    } else if (viewMode.value === 'month') {
      const monthStart = startOfMonth(currentMonth.value)
      const monthEnd = endOfMonth(currentMonth.value)
      params.start_date = format(monthStart, 'yyyy-MM-dd')
      params.end_date = format(monthEnd, 'yyyy-MM-dd')
    } else if (viewMode.value === '4days') {
      const endDate = addDays(currentDay.value, 3)
      params.start_date = format(currentDay.value, 'yyyy-MM-dd')
      params.end_date = format(endDate, 'yyyy-MM-dd')
    } else if (viewMode.value === 'agenda') {
      const today = new Date().toISOString().split('T')[0]
      params.start_date = today
    } else {
      // Fallback to dateRange filter
      if (dateRange.value === 'today') {
        const today = new Date().toISOString().split('T')[0]
        params.start_date = today
        params.end_date = today
      } else if (dateRange.value === 'week') {
        const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
        const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })
        params.start_date = format(weekStart, 'yyyy-MM-dd')
        params.end_date = format(weekEnd, 'yyyy-MM-dd')
      } else if (dateRange.value === 'month') {
        const now = new Date()
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        params.start_date = format(monthStart, 'yyyy-MM-dd')
        params.end_date = format(monthEnd, 'yyyy-MM-dd')
      } else if (dateRange.value === 'upcoming') {
        const today = new Date().toISOString().split('T')[0]
        params.start_date = today
      } else if (dateRange.value === 'custom') {
        if (customStartDate.value) params.start_date = customStartDate.value
        if (customEndDate.value) params.end_date = customEndDate.value
      }
    }

    params.include_shared = 'true'

    const response = await $fetch<{
      success: boolean
      data: any[]
    }>(`${config.public.apiBase}/calendar/tasks`, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      },
      params
    })

    if (response.success) {
      tasks.value = response.data
    }
  } catch (err: any) {
    console.error('Error loading tasks:', err)
  }
}

const loadAppointments = async () => {
  try {
    const params: any = {}

    // Calculate date range based on view mode
    if (viewMode.value === 'day') {
      params.start_date = format(currentDay.value, 'yyyy-MM-dd')
      params.end_date = format(currentDay.value, 'yyyy-MM-dd')
    } else if (viewMode.value === 'week') {
      const weekEnd = endOfWeek(currentWeekStart.value, { weekStartsOn: 1 })
      params.start_date = format(currentWeekStart.value, 'yyyy-MM-dd')
      params.end_date = format(weekEnd, 'yyyy-MM-dd')
    } else if (viewMode.value === 'month') {
      const monthStart = startOfMonth(currentMonth.value)
      const monthEnd = endOfMonth(currentMonth.value)
      params.start_date = format(monthStart, 'yyyy-MM-dd')
      params.end_date = format(monthEnd, 'yyyy-MM-dd')
    } else if (viewMode.value === '4days') {
      const endDate = addDays(currentDay.value, 3)
      params.start_date = format(currentDay.value, 'yyyy-MM-dd')
      params.end_date = format(endDate, 'yyyy-MM-dd')
    } else if (viewMode.value === 'agenda') {
      const today = new Date().toISOString().split('T')[0]
      params.start_date = today
    } else {
      // Fallback to dateRange filter
      if (dateRange.value === 'today') {
        const today = new Date().toISOString().split('T')[0]
        params.start_date = today
        params.end_date = today
      } else if (dateRange.value === 'week') {
        const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
        const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })
        params.start_date = format(weekStart, 'yyyy-MM-dd')
        params.end_date = format(weekEnd, 'yyyy-MM-dd')
      } else if (dateRange.value === 'month') {
        const now = new Date()
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        params.start_date = format(monthStart, 'yyyy-MM-dd')
        params.end_date = format(monthEnd, 'yyyy-MM-dd')
      } else if (dateRange.value === 'upcoming') {
        const today = new Date().toISOString().split('T')[0]
        params.start_date = today
      } else if (dateRange.value === 'custom') {
        if (customStartDate.value) params.start_date = customStartDate.value
        if (customEndDate.value) params.end_date = customEndDate.value
      }
    }

    const response = await $fetch<{
      success: boolean
      data: any[]
    }>(`${config.public.apiBase}/calendar/appointments`, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      },
      params
    })

    if (response.success) {
      appointments.value = response.data
    }
  } catch (err: any) {
    console.error('Error loading appointments:', err)
  }
}

const loadSchedules = async () => {
  loading.value = true
  error.value = ''

  try {
    const params: any = {}

    // Calculate date range based on view mode
    if (viewMode.value === 'day') {
      params.start_date = format(currentDay.value, 'yyyy-MM-dd')
      params.end_date = format(currentDay.value, 'yyyy-MM-dd')
    } else if (viewMode.value === 'week') {
      const weekEnd = endOfWeek(currentWeekStart.value, { weekStartsOn: 1 })
      params.start_date = format(currentWeekStart.value, 'yyyy-MM-dd')
      params.end_date = format(weekEnd, 'yyyy-MM-dd')
    } else if (viewMode.value === 'month') {
      const monthStart = startOfMonth(currentMonth.value)
      const monthEnd = endOfMonth(currentMonth.value)
      params.start_date = format(monthStart, 'yyyy-MM-dd')
      params.end_date = format(monthEnd, 'yyyy-MM-dd')
    } else if (viewMode.value === '4days') {
      const endDate = addDays(currentDay.value, 3)
      params.start_date = format(currentDay.value, 'yyyy-MM-dd')
      params.end_date = format(endDate, 'yyyy-MM-dd')
    } else if (viewMode.value === 'agenda') {
      // Agenda shows upcoming schedules
      const today = new Date().toISOString().split('T')[0]
      params.start_date = today
    } else {
      // Fallback to dateRange filter
      if (dateRange.value === 'today') {
        const today = new Date().toISOString().split('T')[0]
        params.start_date = today
        params.end_date = today
      } else if (dateRange.value === 'week') {
        const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
        const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })
        params.start_date = format(weekStart, 'yyyy-MM-dd')
        params.end_date = format(weekEnd, 'yyyy-MM-dd')
        currentWeekStart.value = weekStart
      } else if (dateRange.value === 'month') {
        const now = new Date()
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        params.start_date = format(monthStart, 'yyyy-MM-dd')
        params.end_date = format(monthEnd, 'yyyy-MM-dd')
      } else if (dateRange.value === 'upcoming') {
        const today = new Date().toISOString().split('T')[0]
        params.start_date = today
      } else if (dateRange.value === 'custom') {
        if (customStartDate.value) params.start_date = customStartDate.value
        if (customEndDate.value) params.end_date = customEndDate.value
      }
    }

    if (filters.status) params.status = filters.status
    if (filters.courseId) params.course_id = filters.courseId

    const response = await $fetch<{
      success: boolean
      data: Schedule[]
    }>(`${config.public.apiBase}/admin/tutor/schedules`, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      },
      params
    })

    if (response.success) {
      schedules.value = response.data
    }

    // Load events, tasks, and appointments in parallel
    await Promise.all([
      loadEvents(),
      loadTasks(),
      loadAppointments()
    ])
  } catch (err: any) {
    console.error('Error loading schedules:', err)
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
  } finally {
    loading.value = false
  }
}

const changeViewMode = (mode: 'day' | 'week' | 'month' | 'agenda' | '4days') => {
  viewMode.value = mode
  showViewMenu.value = false
  
  // Update date range based on view mode
  if (mode === 'day') {
    dateRange.value = 'today'
    currentDay.value = new Date()
  } else if (mode === 'week') {
    dateRange.value = 'week'
    currentWeekStart.value = startOfWeek(new Date(), { weekStartsOn: 1 })
  } else if (mode === 'month') {
    dateRange.value = 'month'
    currentMonth.value = startOfMonth(new Date())
  } else if (mode === '4days') {
    dateRange.value = 'custom'
    currentDay.value = new Date()
    const endDate = addDays(currentDay.value, 3)
    customStartDate.value = format(currentDay.value, 'yyyy-MM-dd')
    customEndDate.value = format(endDate, 'yyyy-MM-dd')
  } else if (mode === 'agenda') {
    dateRange.value = 'upcoming'
  }
  
  loadSchedules()
}

const navigatePrevious = () => {
  if (viewMode.value === 'day') {
    currentDay.value = addDays(currentDay.value, -1)
    dateRange.value = 'custom'
    customStartDate.value = format(currentDay.value, 'yyyy-MM-dd')
    customEndDate.value = format(currentDay.value, 'yyyy-MM-dd')
  } else if (viewMode.value === 'week') {
    currentWeekStart.value = subWeeks(currentWeekStart.value, 1)
    const weekEnd = endOfWeek(currentWeekStart.value, { weekStartsOn: 1 })
    dateRange.value = 'custom'
    customStartDate.value = format(currentWeekStart.value, 'yyyy-MM-dd')
    customEndDate.value = format(weekEnd, 'yyyy-MM-dd')
  } else if (viewMode.value === 'month') {
    currentMonth.value = subMonths(currentMonth.value, 1)
    dateRange.value = 'month'
  } else if (viewMode.value === '4days') {
    currentDay.value = addDays(currentDay.value, -4)
    const endDate = addDays(currentDay.value, 3)
    dateRange.value = 'custom'
    customStartDate.value = format(currentDay.value, 'yyyy-MM-dd')
    customEndDate.value = format(endDate, 'yyyy-MM-dd')
  }
  loadSchedules()
}

const navigateNext = () => {
  if (viewMode.value === 'day') {
    currentDay.value = addDays(currentDay.value, 1)
    dateRange.value = 'custom'
    customStartDate.value = format(currentDay.value, 'yyyy-MM-dd')
    customEndDate.value = format(currentDay.value, 'yyyy-MM-dd')
  } else if (viewMode.value === 'week') {
    currentWeekStart.value = addWeeks(currentWeekStart.value, 1)
    const weekEnd = endOfWeek(currentWeekStart.value, { weekStartsOn: 1 })
    dateRange.value = 'custom'
    customStartDate.value = format(currentWeekStart.value, 'yyyy-MM-dd')
    customEndDate.value = format(weekEnd, 'yyyy-MM-dd')
  } else if (viewMode.value === 'month') {
    currentMonth.value = addMonths(currentMonth.value, 1)
    dateRange.value = 'month'
  } else if (viewMode.value === '4days') {
    currentDay.value = addDays(currentDay.value, 4)
    const endDate = addDays(currentDay.value, 3)
    dateRange.value = 'custom'
    customStartDate.value = format(currentDay.value, 'yyyy-MM-dd')
    customEndDate.value = format(endDate, 'yyyy-MM-dd')
  }
  loadSchedules()
}

const navigateToday = () => {
  const today = new Date()
  if (viewMode.value === 'day') {
    currentDay.value = today
    dateRange.value = 'today'
  } else if (viewMode.value === 'week') {
    currentWeekStart.value = startOfWeek(today, { weekStartsOn: 1 })
    dateRange.value = 'week'
  } else if (viewMode.value === 'month') {
    currentMonth.value = startOfMonth(today)
    dateRange.value = 'month'
  } else if (viewMode.value === '4days') {
    currentDay.value = today
    const endDate = addDays(today, 3)
    dateRange.value = 'custom'
    customStartDate.value = format(today, 'yyyy-MM-dd')
    customEndDate.value = format(endDate, 'yyyy-MM-dd')
  }
  loadSchedules()
}

const handleDateRangeChange = () => {
  if (dateRange.value === 'week' && viewMode.value === 'week') {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
    currentWeekStart.value = weekStart
  }
  loadSchedules()
}

const getSchedulesForDay = (date: Date) => {
  return schedules.value.filter(schedule => {
    const scheduleDate = parseISO(schedule.start_datetime)
    return isSameDay(scheduleDate, date)
  })
}

const getEventsForDay = (date: Date) => {
  return events.value.filter(event => {
    const eventDate = parseISO(event.start_datetime)
    return isSameDay(eventDate, date)
  })
}

const getTasksForDay = (date: Date) => {
  return tasks.value.filter(task => {
    if (task.due_date) {
      const taskDate = parseISO(task.due_date)
      return isSameDay(taskDate, date)
    } else if (task.start_date) {
      const taskDate = parseISO(task.start_date)
      return isSameDay(taskDate, date)
    }
    return false
  })
}

const getAppointmentsForDay = (date: Date) => {
  return appointments.value.filter(appointment => {
    const appointmentDate = parseISO(appointment.start_datetime)
    return isSameDay(appointmentDate, date)
  })
}

const handleEventSaved = () => {
  loadEvents()
  showEventModal.value = false
  selectedEvent.value = null
}

const handleTaskSaved = () => {
  loadTasks()
  showTaskModal.value = false
  selectedTask.value = null
}

const handleAppointmentSaved = () => {
  loadAppointments()
  showAppointmentModal.value = false
  selectedAppointment.value = null
}

const openEditEvent = (event: any) => {
  selectedEvent.value = event
  showEventModal.value = true
}

const openEditTask = (task: any) => {
  selectedTask.value = task
  showTaskModal.value = true
}

const openEditAppointment = (appointment: any) => {
  selectedAppointment.value = appointment
  showAppointmentModal.value = true
}

const isToday = (date: Date) => {
  return isTodayFn(date)
}

const formatWeekRange = (weekStart: Date) => {
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 })
  return `${format(weekStart, 'dd MMM yyyy', { locale: th })} - ${format(weekEnd, 'dd MMM yyyy', { locale: th })}`
}

const formatDay = (date: Date) => {
  return format(date, 'd', { locale: th })
}

const formatDateTime = (dateTime: string) => {
  return format(parseISO(dateTime), 'dd MMM yyyy', { locale: th })
}

const formatTime = (dateTime: string) => {
  return format(parseISO(dateTime), 'HH:mm', { locale: th })
}

const formatTimeRange = (start: string, end: string) => {
  return `${format(parseISO(start), 'HH:mm')} - ${format(parseISO(end), 'HH:mm')}`
}

const getStatusName = (status: string) => {
  const statusNames: Record<string, string> = {
    scheduled: 'กำหนดแล้ว',
    ongoing: 'กำลังสอน',
    completed: 'เสร็จสิ้น',
    cancelled: 'ยกเลิก'
  }
  return statusNames[status] || status
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-800',
    ongoing: 'bg-orange-100 text-orange-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getSessionTypeName = (type: string) => {
  const typeNames: Record<string, string> = {
    live: 'Live',
    vod: 'VOD'
  }
  return typeNames[type] || type
}

const getSessionTypeBadgeClass = (type: string) => {
  const classes: Record<string, string> = {
    live: 'bg-red-100 text-red-800',
    vod: 'bg-purple-100 text-purple-800'
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

const getScheduleCardClass = (schedule: Schedule) => {
  if (schedule.status === 'completed') return 'bg-green-100 text-green-800 border border-green-200'
  if (schedule.status === 'ongoing') return 'bg-orange-100 text-orange-800 border border-orange-200'
  if (schedule.status === 'cancelled') return 'bg-gray-100 text-gray-600 border border-gray-200'
  return 'bg-blue-100 text-blue-800 border border-blue-200'
}

const getScheduleBorderClass = (status: string) => {
  if (status === 'completed') return 'border-green-500 bg-green-50'
  if (status === 'ongoing') return 'border-orange-500 bg-orange-50'
  if (status === 'cancelled') return 'border-gray-400 bg-gray-50'
  return 'border-blue-500 bg-blue-50'
}

// Close view menu when clicking outside
onMounted(() => {
  loadCourses()
  loadSchedules()
})
</script>

