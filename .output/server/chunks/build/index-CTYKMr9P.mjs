import { defineComponent, ref, computed, watch, mergeProps, unref, readonly, nextTick, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrRenderStyle, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { parseISO, formatDistanceToNow, isSameDay, format } from 'date-fns';
import { th } from 'date-fns/locale';
import { u as useAuth, a as useRoute, b as useRouter, c as useRuntimeConfig, _ as _export_sfc } from './server.mjs';
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

const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "ChatRoomList",
  __ssrInlineRender: true,
  props: {
    rooms: {},
    activeRoom: {},
    loading: { type: Boolean, default: false }
  },
  emits: ["select-room", "create-room"],
  setup(__props, { emit: __emit }) {
    const { user, hasAnyRole } = useAuth();
    const canCreateRoom = computed(() => {
      return hasAnyRole(["student", "parent"]);
    });
    const getOtherUser = (room) => {
      if (!user.value) return null;
      return room.student_id === user.value.id ? room.tutor : room.student;
    };
    const formatDate = (dateString) => {
      if (!dateString) return "";
      try {
        return formatDistanceToNow(new Date(dateString), {
          addSuffix: true,
          locale: th
        });
      } catch {
        return dateString;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "h-full flex flex-col" }, _attrs))}><div class="p-4 border-b"><div class="flex items-center justify-between mb-2"><h2 class="text-lg font-semibold">แชท</h2></div>`);
      if (unref(canCreateRoom)) {
        _push(`<button class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center space-x-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg><span>เริ่มแชทใหม่</span></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex-1 overflow-y-auto">`);
      if (__props.loading) {
        _push(`<div class="p-4 text-center text-gray-500"> กำลังโหลด... </div>`);
      } else if (__props.rooms.length === 0) {
        _push(`<div class="p-4 text-center text-gray-500"> ไม่มีห้องแชท </div>`);
      } else {
        _push(`<div class="divide-y"><!--[-->`);
        ssrRenderList(__props.rooms, (room) => {
          _push(`<button class="${ssrRenderClass([
            "w-full p-4 text-left hover:bg-gray-50 transition-colors",
            __props.activeRoom?.id === room.id ? "bg-green-50 border-l-4 border-l-green-600" : ""
          ])}"><div class="flex items-start space-x-3"><div class="flex-shrink-0"><div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">`);
          if (getOtherUser(room)?.avatar_url) {
            _push(`<img${ssrRenderAttr("src", getOtherUser(room)?.avatar_url)}${ssrRenderAttr("alt", getOtherUser(room)?.first_name)} class="w-full h-full object-cover">`);
          } else {
            _push(`<span class="text-gray-500 text-lg font-semibold">${ssrInterpolate(getOtherUser(room)?.first_name?.charAt(0))}</span>`);
          }
          _push(`</div></div><div class="flex-1 min-w-0"><div class="flex items-center justify-between mb-1"><h3 class="font-semibold text-gray-900 truncate">${ssrInterpolate(getOtherUser(room)?.first_name)} ${ssrInterpolate(getOtherUser(room)?.last_name)}</h3>`);
          if (room.unread_count && room.unread_count > 0) {
            _push(`<span class="ml-2 flex-shrink-0 bg-green-600 text-white text-xs font-semibold rounded-full px-2 py-1 min-w-[20px] text-center">${ssrInterpolate(room.unread_count > 99 ? "99+" : room.unread_count)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><p class="text-sm text-gray-600 truncate">${ssrInterpolate(room.course?.title)}</p>`);
          if (room.last_message_at) {
            _push(`<p class="text-xs text-gray-400 mt-1">${ssrInterpolate(formatDate(room.last_message_at))}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></button>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/ChatRoomList.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const ChatRoomList = Object.assign(_sfc_main$9, { __name: "ChatRoomList" });
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "ChatMessage",
  __ssrInlineRender: true,
  props: {
    message: {},
    currentUserId: {}
  },
  emits: ["image-click", "reply", "pin", "scroll-to-message"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const isOwnMessage = computed(() => props.message.sender_id === props.currentUserId);
    const showMenu = ref(false);
    const showContextMenu = ref(false);
    const formatTime = (dateString) => {
      try {
        return format(new Date(dateString), "HH:mm", { locale: th });
      } catch {
        return dateString;
      }
    };
    const formatFileSize = (bytes) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: [
          "flex mb-4",
          unref(isOwnMessage) ? "justify-end" : "justify-start"
        ]
      }, _attrs))}><div class="${ssrRenderClass(["flex space-x-2 max-w-[70%]", unref(isOwnMessage) ? "flex-row-reverse space-x-reverse" : ""])}">`);
      if (!unref(isOwnMessage)) {
        _push(`<div class="flex-shrink-0"><div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">`);
        if (__props.message.sender?.avatar_url) {
          _push(`<img${ssrRenderAttr("src", __props.message.sender.avatar_url)}${ssrRenderAttr("alt", __props.message.sender.first_name)} class="w-full h-full object-cover">`);
        } else {
          _push(`<span class="text-gray-500 text-sm font-semibold">${ssrInterpolate(__props.message.sender?.first_name?.charAt(0))}</span>`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="${ssrRenderClass(["flex flex-col group relative", unref(isOwnMessage) ? "items-end" : "items-start"])}">`);
      if (!unref(isOwnMessage)) {
        _push(`<span class="text-xs text-gray-500 mb-1 px-1">${ssrInterpolate(__props.message.sender?.first_name)} ${ssrInterpolate(__props.message.sender?.last_name)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex items-center space-x-2"><div class="${ssrRenderClass([
        "rounded-lg px-4 py-2 relative",
        unref(isOwnMessage) ? "bg-green-600 text-white" : "bg-gray-100 text-gray-900"
      ])}">`);
      if (__props.message.reply_to) {
        _push(`<div class="${ssrRenderClass([
          "mb-2 pb-2 border-l-4 pl-2 cursor-pointer hover:opacity-90 transition-opacity",
          unref(isOwnMessage) ? "border-white text-white bg-white bg-opacity-20 rounded" : "border-gray-500 text-gray-700 bg-gray-50 rounded"
        ])}"><div class="${ssrRenderClass(["font-semibold mb-0.5", unref(isOwnMessage) ? "text-white" : "text-gray-800"])}">${ssrInterpolate(__props.message.reply_to.sender?.first_name)} ${ssrInterpolate(__props.message.reply_to.sender?.last_name)}</div><div class="${ssrRenderClass(["truncate", unref(isOwnMessage) ? "text-white" : "text-gray-700"])}">${ssrInterpolate(__props.message.reply_to.content || (__props.message.reply_to.file_name || "ไฟล์"))}</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.message.message_type === "text") {
        _push(`<p class="whitespace-pre-wrap break-words">${ssrInterpolate(__props.message.content)}</p>`);
      } else if (__props.message.message_type === "image") {
        _push(`<div class="max-w-sm">`);
        if (__props.message.file_url) {
          _push(`<img${ssrRenderAttr("src", __props.message.file_url)}${ssrRenderAttr("alt", __props.message.content || "Image")} class="rounded-lg max-w-full h-auto cursor-pointer">`);
        } else {
          _push(`<!---->`);
        }
        if (__props.message.content) {
          _push(`<p class="mt-2 text-sm opacity-90">${ssrInterpolate(__props.message.content)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else if (__props.message.message_type === "file") {
        _push(`<div class="flex items-center space-x-2"><svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg><div class="flex-1 min-w-0"><a${ssrRenderAttr("href", __props.message.file_url)} target="_blank" rel="noopener noreferrer" class="text-sm font-medium hover:underline truncate block">${ssrInterpolate(__props.message.file_name || "ไฟล์")}</a>`);
        if (__props.message.file_size) {
          _push(`<p class="text-xs opacity-75">${ssrInterpolate(formatFileSize(__props.message.file_size))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(showMenu)) {
        _push(`<button class="p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0" type="button"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(showContextMenu)) {
        _push(`<div class="${ssrRenderClass([
          "absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[150px]",
          unref(isOwnMessage) ? "right-0" : "left-0"
        ])}" style="${ssrRenderStyle({ "top": "100%", "margin-top": "4px" })}"><button class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"> ตอบกลับ </button><button class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"> คัดลอกลิงก์ </button><button class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">${ssrInterpolate(__props.message.is_pinned ? "ยกเลิกปักหมุด" : "ปักหมุด")}</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span class="text-xs text-gray-400 mt-1 px-1">${ssrInterpolate(formatTime(__props.message.created_at))}</span></div></div></div>`);
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/ChatMessage.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const ChatMessage = Object.assign(_sfc_main$8, { __name: "ChatMessage" });
const useChatSocket = () => {
  useAuth();
  const socket = ref(null);
  const connected = ref(false);
  const connect = () => {
    {
      console.warn("[Chat Socket] Cannot connect in server-side");
      return;
    }
  };
  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
      connected.value = false;
      console.log("[Chat Socket] ⚠️  Disconnected");
    }
  };
  const joinRoom = (roomId) => {
    if (socket.value && connected.value) {
      console.log(`[Chat Socket] 📥 Emitting join_room for room ${roomId}`, {
        socketId: socket.value.id,
        connected: connected.value
      });
      socket.value.emit("join_room", { roomId });
      socket.value.once("room_joined", (data) => {
        console.log(`[Chat Socket] ✅ Successfully joined room ${data.roomId}`);
      });
      socket.value.once("error", (error) => {
        console.error(`[Chat Socket] ❌ Error joining room ${roomId}:`, error.message);
      });
    } else {
      console.warn("[Chat Socket] ⚠️  Cannot join room: not connected", {
        hasSocket: !!socket.value,
        connected: connected.value,
        roomId
      });
    }
  };
  const leaveRoom = (roomId) => {
    if (socket.value && connected.value) {
      socket.value.emit("leave_room", { roomId });
      console.log(`[Chat Socket] 📤 Leaving room ${roomId}`);
    }
  };
  const on = (event, callback) => {
    if (socket.value) {
      const hasListener = socket.value.hasListeners(event);
      if (hasListener) {
        console.log(`[Chat Socket] ⚠️ Event ${event} already has listeners, removing old ones first`);
        socket.value.off(event);
      }
      socket.value.on(event, callback);
      console.log(`[Chat Socket] 👂 Listening to event: ${event}`, {
        socketId: socket.value.id,
        connected: socket.value.connected
      });
    } else {
      console.warn(`[Chat Socket] ⚠️ Cannot listen to ${event}: socket not available`);
    }
  };
  const off = (event, callback) => {
    if (socket.value) {
      socket.value.off(event, callback);
    }
  };
  const emit = (event, data) => {
    if (socket.value && connected.value) {
      socket.value.emit(event, data);
    } else {
      console.warn(`[Chat Socket] Cannot emit ${event}: not connected`);
    }
  };
  return {
    socket: readonly(socket),
    connected: readonly(connected),
    connect,
    disconnect,
    joinRoom,
    leaveRoom,
    on,
    off,
    emit
  };
};
const useChat = () => {
  const config = useRuntimeConfig();
  const { accessToken, user } = useAuth();
  const rooms = ref([]);
  const activeRoom = ref(null);
  const messages = ref([]);
  const typingUsers = ref(/* @__PURE__ */ new Map());
  const {
    socket,
    connected,
    connect: connectSocket,
    disconnect: disconnectSocket,
    joinRoom: joinRoomSocket,
    leaveRoom: leaveRoomSocket,
    emit: socketEmit
  } = useChatSocket();
  const targetRoomId = ref(null);
  watch([connected, targetRoomId], ([isConnected, roomId]) => {
    if (isConnected && roomId) {
      console.log(`[Chat] ✅ Both connected and roomId ready, joining room ${roomId}`);
      joinRoomSocket(roomId);
    }
  }, { immediate: true });
  const loadRooms = async () => {
    try {
      const response = await $fetch(
        `${config.public.apiBase}/chat/rooms`,
        {
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          }
        }
      );
      if (response.success) {
        rooms.value = response.data;
        if (connected.value) {
          response.data.forEach((room) => {
            joinRoomSocket(room.id);
          });
        } else {
          if (response.data.length > 0) {
            targetRoomId.value = response.data[0].id;
          }
        }
        if (false) ;
      }
    } catch (error) {
      console.error("[Chat] Error loading rooms:", error);
    }
  };
  const loadRoom = async (roomId) => {
    try {
      const response = await $fetch(
        `${config.public.apiBase}/chat/rooms/${roomId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          }
        }
      );
      if (response.success) {
        activeRoom.value = response.data;
        console.log("[Chat] 📋 Loaded room:", {
          roomId: response.data.id,
          studentId: response.data.student_id,
          tutorId: response.data.tutor_id
        });
        if (connected.value) {
          console.log(`[Chat] 📥 Joining room ${roomId} via Socket.IO`);
          joinRoomSocket(roomId);
        } else {
          console.warn(`[Chat] ⚠️  Socket.IO not connected, cannot join room ${roomId}`);
        }
        return response.data;
      }
    } catch (error) {
      console.error("[Chat] Error loading room:", error);
      throw error;
    }
  };
  const loadMessages = async (roomId, limit = 50, offset = 0) => {
    try {
      const response = await $fetch(
        `${config.public.apiBase}/chat/rooms/${roomId}/messages?limit=${limit}&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          }
        }
      );
      if (response.success) {
        if (offset === 0) {
          const otherRoomMessages = messages.value.filter((m) => m.room_id !== roomId);
          messages.value = [...otherRoomMessages, ...response.data];
          console.log("[Chat] 📋 First load messages for room:", {
            roomId,
            apiCount: response.data.length,
            otherRoomsCount: otherRoomMessages.length,
            totalCount: messages.value.length
          });
        } else {
          const existingIds = new Set(messages.value.map((m) => m.id));
          const newMessages = response.data.filter((msg) => !existingIds.has(msg.id));
          messages.value = [...newMessages, ...messages.value];
          console.log("[Chat] 📋 Loaded more messages for room:", {
            roomId,
            apiCount: response.data.length,
            newCount: newMessages.length,
            totalCount: messages.value.length
          });
        }
        return response.data;
      }
    } catch (error) {
      console.error("[Chat] Error loading messages:", error);
      throw error;
    }
  };
  const joinRoom = (roomId) => {
    targetRoomId.value = roomId;
  };
  const leaveRoom = (roomId) => {
    if (connected.value) {
      leaveRoomSocket(roomId);
    }
    if (targetRoomId.value === roomId) {
      targetRoomId.value = null;
    }
  };
  const sendingMessages = ref(/* @__PURE__ */ new Set());
  const sendMessage = async (data) => {
    const messageContent = data.content || "";
    `${data.room_id}-${messageContent}-${Date.now()}`;
    console.log("[Chat] 🚀 sendMessage called:", {
      roomId: data.room_id,
      content: messageContent,
      messageType: data.message_type,
      userId: user.value?.id,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    const duplicateKey = `${data.room_id}-${messageContent}`;
    if (sendingMessages.value.has(duplicateKey)) {
      console.log("[Chat] ⚠️ Message already being sent, skipping duplicate:", messageContent.substring(0, 50));
      return;
    }
    sendingMessages.value.add(duplicateKey);
    console.log("[Chat] ✅ Message marked as sending, duplicateKey:", duplicateKey);
    try {
      const tempId = `temp-${Date.now()}-${Math.random()}`;
      const optimisticMessage = {
        id: tempId,
        room_id: data.room_id,
        sender_id: user.value?.id || 0,
        message_type: data.message_type || "text",
        content: messageContent,
        file_url: data.file_url || null,
        file_name: data.file_name || null,
        file_size: data.file_size || null,
        file_type: data.file_type || null,
        is_read: false,
        read_at: null,
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        sender: {
          id: user.value?.id || 0,
          first_name: user.value?.first_name || "",
          last_name: user.value?.last_name || "",
          avatar_url: user.value?.avatar_url || null
        }
      };
      const hasOptimistic = messages.value.some((m) => {
        const id = m.id;
        return typeof id === "string" && id.startsWith("temp-") && m.content === messageContent && m.room_id === data.room_id;
      });
      if (!hasOptimistic) {
        messages.value = [...messages.value, optimisticMessage];
      }
      console.log("[Chat] 📤 Sending message via REST API:", {
        roomId: data.room_id,
        content: data.content?.substring(0, 50),
        messageType: data.message_type,
        apiUrl: `${config.public.apiBase}/chat/rooms/${data.room_id}/messages`,
        hasToken: !!accessToken.value
      });
      const response = await $fetch(
        `${config.public.apiBase}/chat/rooms/${data.room_id}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          },
          body: {
            content: data.content,
            message_type: data.message_type || "text",
            file_url: data.file_url,
            file_name: data.file_name,
            file_size: data.file_size,
            file_type: data.file_type,
            reply_to_id: data.reply_to_id || null
          }
        }
      );
      console.log("[Chat] 📥 REST API response received:", {
        success: response.success,
        messageId: response.data?.id,
        content: response.data?.content?.substring(0, 50),
        roomId: response.data?.room_id
      });
      if (response.success) {
        console.log("[Chat] 📥 REST API response received:", {
          messageId: response.data.id,
          content: response.data.content?.substring(0, 50)
        });
        const tempIndex = messages.value.findIndex((m) => {
          const id = m.id;
          return typeof id === "string" && id.startsWith("temp-") && m.content === messageContent && m.sender_id === user.value?.id && m.room_id === data.room_id;
        });
        if (tempIndex !== -1) {
          const newMessages = [...messages.value];
          newMessages[tempIndex] = response.data;
          messages.value = newMessages;
          console.log("[Chat] ✅ Replaced optimistic message with real message");
        } else {
          const exists = messages.value.some((m) => m.id === response.data.id);
          if (!exists) {
            messages.value = [...messages.value, response.data];
            console.log("[Chat] ✅ Added real message from REST API");
          }
        }
      }
    } catch (error) {
      console.error("[Chat] ❌ Error sending message via REST API:", error);
      const tempIndex = messages.value.findIndex((m) => {
        const id = m.id;
        return typeof id === "string" && id.startsWith("temp-") && m.content === messageContent && m.sender_id === user.value?.id && m.room_id === data.room_id;
      });
      if (tempIndex !== -1) {
        const newMessages = [...messages.value];
        newMessages.splice(tempIndex, 1);
        messages.value = newMessages;
      }
      throw error;
    } finally {
      setTimeout(() => {
        sendingMessages.value.delete(duplicateKey);
      }, 2e3);
    }
  };
  const markAsRead = async (roomId, messageId) => {
    if (connected.value) {
      socketEmit("mark_read", { roomId, messageId });
    } else {
      try {
        await $fetch(`${config.public.apiBase}/chat/rooms/${roomId}/messages/read`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          },
          body: {
            messageId
          }
        });
      } catch (error) {
        console.error("[Chat] Error marking messages as read:", error);
      }
    }
    const room = rooms.value.find((r) => r.id === roomId);
    if (room) {
      room.unread_count = 0;
    }
  };
  const startTyping = async (roomId) => {
    if (connected.value) {
      socketEmit("typing", { roomId });
    } else {
      try {
        await $fetch(`${config.public.apiBase}/chat/rooms/${roomId}/typing`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          }
        });
      } catch (error) {
        console.error("[Chat] Error starting typing:", error);
      }
    }
  };
  const stopTyping = async (roomId) => {
    if (connected.value) {
      socketEmit("stop_typing", { roomId });
    } else {
      try {
        await $fetch(`${config.public.apiBase}/chat/rooms/${roomId}/typing/stop`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          }
        });
      } catch (error) {
        console.error("[Chat] Error stopping typing:", error);
      }
    }
  };
  const uploadFile = async (roomId, file, fileType = "image") => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await $fetch(`${config.public.apiBase}/chat/upload?roomId=${roomId}&fileType=${fileType}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      },
      body: formData
    });
    if (response.success) {
      return response.data;
    } else {
      throw new Error("Failed to upload file");
    }
  };
  const getRoomMessages = (roomId) => {
    return messages.value.filter((m) => m.room_id === roomId);
  };
  const sortedMessages = computed(() => {
    if (!activeRoom.value?.id) {
      return [];
    }
    const roomMessages = messages.value.filter((m) => m.room_id === activeRoom.value.id);
    const sorted = [...roomMessages].sort((a, b) => {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return timeA - timeB;
    });
    console.log("[Chat] 🔄 sortedMessages computed:", {
      roomId: activeRoom.value.id,
      count: sorted.length,
      messageIds: sorted.map((m) => m.id).slice(-5)
    });
    return sorted;
  });
  const getTypingUsers = (roomId) => {
    const users = typingUsers.value.get(roomId);
    return users ? Array.from(users) : [];
  };
  const clearMessages = (roomId) => {
    messages.value = messages.value.filter((m) => m.room_id !== roomId);
  };
  const setActiveRoom = (room) => {
    console.log("[Chat] 🎯 setActiveRoom called:", {
      roomId: room?.id || "null",
      previousRoomId: activeRoom.value?.id,
      connected: connected.value
    });
    if (activeRoom.value && connected.value) {
      console.log(`[Chat] 📤 Leaving previous room ${activeRoom.value.id}`);
      leaveRoomSocket(activeRoom.value.id);
    }
    activeRoom.value = room;
    if (activeRoom.value) {
      targetRoomId.value = activeRoom.value.id;
    } else {
      targetRoomId.value = null;
    }
  };
  const setupChatEventListeners = () => {
    {
      console.warn("[Chat] Cannot setup event listeners in server-side");
      return;
    }
  };
  return {
    connected: readonly(connected),
    socket,
    // ✅ Return socket for checking availability
    rooms: readonly(rooms),
    activeRoom: readonly(activeRoom),
    messages: readonly(messages),
    // ✅ UI reads only
    sortedMessages,
    // ✅ Computed property for UI
    typingUsers: readonly(typingUsers),
    connect: connectSocket,
    disconnect: disconnectSocket,
    loadRooms,
    loadRoom,
    loadMessages,
    joinRoom,
    leaveRoom,
    sendMessage,
    markAsRead,
    startTyping,
    stopTyping,
    uploadFile,
    getRoomMessages,
    getTypingUsers,
    clearMessages,
    setActiveRoom,
    setupChatEventListeners
  };
};
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "ChatInput",
  __ssrInlineRender: true,
  props: {
    roomId: {},
    placeholder: {},
    uploading: { type: Boolean },
    sending: { type: Boolean },
    replyingTo: {}
  },
  emits: ["send-message", "typing", "cancel-reply"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const messageText = ref("");
    ref(null);
    ref(null);
    const previewFile = ref(null);
    const previewFileUrl = ref("");
    const error = ref("");
    ref(null);
    ref("");
    ref(0);
    const showEmojiPicker = ref(false);
    ref(null);
    const commonEmojis = [
      "😀",
      "😃",
      "😄",
      "😁",
      "😆",
      "😅",
      "🤣",
      "😂",
      "🙂",
      "🙃",
      "😉",
      "😊",
      "😇",
      "🥰",
      "😍",
      "🤩",
      "😘",
      "😗",
      "😚",
      "😙",
      "😋",
      "😛",
      "😜",
      "🤪",
      "😝",
      "🤑",
      "🤗",
      "🤭",
      "🤫",
      "🤔",
      "🤐",
      "🤨",
      "😐",
      "😑",
      "😶",
      "😏",
      "😒",
      "🙄",
      "😬",
      "🤥",
      "😌",
      "😔",
      "😪",
      "🤤",
      "😴",
      "😷",
      "🤒",
      "🤕",
      "🤢",
      "🤮",
      "🤧",
      "🥵",
      "🥶",
      "😶‍🌫️",
      "😵",
      "😵‍💫",
      "🤯",
      "🤠",
      "🥳",
      "😎",
      "🤓",
      "🧐",
      "😕",
      "😟",
      "🙁",
      "☹️",
      "😮",
      "😯",
      "😲",
      "😳",
      "🥺",
      "😦",
      "😧",
      "😨",
      "😰",
      "😥",
      "😢",
      "😭",
      "😱",
      "😖",
      "😣",
      "😞",
      "😓",
      "😩",
      "😫",
      "🥱",
      "😤",
      "😡",
      "😠",
      "🤬",
      "😈",
      "👿",
      "💀",
      "☠️",
      "💩",
      "🤡",
      "👹",
      "👺",
      "👻",
      "👽",
      "👾",
      "🤖",
      "😺",
      "😸",
      "😹",
      "😻",
      "😼",
      "😽",
      "🙀",
      "😿",
      "😾",
      "👋",
      "🤚",
      "🖐️",
      "✋",
      "🖖",
      "👌",
      "🤌",
      "🤏",
      "✌️",
      "🤞",
      "🤟",
      "🤘",
      "🤙",
      "👈",
      "👉",
      "👆",
      "🖕",
      "👇",
      "☝️",
      "👍",
      "👎",
      "✊",
      "👊",
      "🤛",
      "🤜",
      "👏",
      "🙌",
      "👐",
      "🤲",
      "🤝",
      "🙏",
      "✍️",
      "💪",
      "🦾",
      "🦿",
      "🦵",
      "🦶",
      "👂",
      "🦻",
      "👃",
      "🧠",
      "🫀",
      "🫁",
      "🦷",
      "🦴",
      "👀",
      "👁️",
      "👅",
      "👄",
      "💋",
      "🩸",
      "❤️",
      "🧡",
      "💛",
      "💚",
      "💙",
      "💜",
      "🖤",
      "🤍",
      "🤎",
      "💔",
      "❣️",
      "💕",
      "💞",
      "💓",
      "💗",
      "💖",
      "💘",
      "💝",
      "💟",
      "☮️",
      "✝️",
      "☪️",
      "🕉️",
      "☸️",
      "✡️",
      "🔯",
      "🕎",
      "☯️",
      "☦️",
      "🛐",
      "⛎",
      "♈",
      "♉",
      "♊",
      "♋",
      "♌",
      "♍",
      "♎",
      "♏",
      "♐",
      "♑",
      "♒",
      "♓",
      "🆔",
      "⚛️",
      "🉑",
      "☢️",
      "☣️",
      "📴",
      "📳",
      "🈶",
      "🈚",
      "🈸",
      "🈺",
      "🈷️",
      "✴️",
      "🆚",
      "💮",
      "🉐",
      "㊙️",
      "㊗️",
      "🈴",
      "🈵",
      "🈹",
      "🈲",
      "🅰️",
      "🅱️",
      "🆎",
      "🆑",
      "🅾️",
      "🆘",
      "❌",
      "⭕",
      "🛑",
      "⛔",
      "📛",
      "🚫",
      "💯",
      "💢",
      "♨️",
      "🚷",
      "🚯",
      "🚳",
      "🚱",
      "🔞",
      "📵",
      "🚭",
      "❗",
      "❓",
      "❕",
      "❔",
      "‼️",
      "⁉️",
      "🔅",
      "🔆",
      "〽️",
      "⚠️",
      "🚸",
      "🔱",
      "⚜️",
      "🔰",
      "♻️",
      "✅",
      "🈯",
      "💹",
      "❇️",
      "✳️",
      "❎",
      "🌐",
      "💠",
      "Ⓜ️",
      "🌀",
      "💤",
      "🏧",
      "🚾",
      "♿",
      "🅿️",
      "🈳",
      "🈂️",
      "🛂",
      "🛃",
      "🛄",
      "🛅",
      "🚹",
      "🚺",
      "🚼",
      "🚻",
      "🚮",
      "🎦",
      "📶",
      "🈁",
      "🔣",
      "ℹ️",
      "🔤",
      "🔡",
      "🔠",
      "🆖",
      "🆗",
      "🆙",
      "🆒",
      "🆕",
      "🆓",
      "0️⃣",
      "1️⃣",
      "2️⃣",
      "3️⃣",
      "4️⃣",
      "5️⃣",
      "6️⃣",
      "7️⃣",
      "8️⃣",
      "9️⃣",
      "🔟",
      "🔢",
      "#️⃣",
      "*️⃣",
      "▶️",
      "⏸️",
      "⏯️",
      "⏹️",
      "⏺️",
      "⏭️",
      "⏮️",
      "⏩",
      "⏪",
      "⏫",
      "⏬",
      "◀️",
      "🔼",
      "🔽",
      "➡️",
      "⬅️",
      "⬆️",
      "⬇️",
      "↗️",
      "↘️",
      "↙️",
      "↖️",
      "↕️",
      "↔️",
      "↪️",
      "↩️",
      "⤴️",
      "⤵️",
      "🔀",
      "🔁",
      "🔂",
      "🔄",
      "🔃",
      "🎵",
      "🎶",
      "➕",
      "➖",
      "➗",
      "✖️",
      "💲",
      "💱",
      "™️",
      "©️",
      "®️",
      "〰️",
      "➰",
      "➿",
      "🔚",
      "🔙",
      "🔛",
      "🔜",
      "🔝",
      "✔️",
      "☑️",
      "🔘",
      "🔴",
      "🟠",
      "🟡",
      "🟢",
      "🔵",
      "🟣",
      "⚫",
      "⚪",
      "🟤",
      "🔺",
      "🔻",
      "🔸",
      "🔹",
      "🔶",
      "🔷",
      "🔳",
      "🔲",
      "▪️",
      "▫️",
      "◾",
      "◽",
      "◼️",
      "◻️",
      "🟥",
      "🟧",
      "🟨",
      "🟩",
      "🟦",
      "🟪",
      "⬛",
      "⬜",
      "🟫",
      "🔈",
      "🔇",
      "🔉",
      "🔊",
      "🔔",
      "🔕",
      "📣",
      "📢",
      "💬",
      "💭",
      "🗯️",
      "♠️",
      "♣️",
      "♥️",
      "♦️",
      "🃏",
      "🎴",
      "🀄",
      "🕐",
      "🕑",
      "🕒",
      "🕓",
      "🕔",
      "🕕",
      "🕖",
      "🕗",
      "🕘",
      "🕙",
      "🕚",
      "🕛",
      "🕜",
      "🕝",
      "🕞",
      "🕟",
      "🕠",
      "🕡",
      "🕢",
      "🕣",
      "🕤",
      "🕥",
      "🕦",
      "🕧"
    ];
    const canSend = computed(() => {
      return (messageText.value.trim().length > 0 || previewFile.value !== null) && !props.uploading && !props.sending;
    });
    const formatFileSize = (bytes) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "border-t p-4 bg-white relative" }, _attrs))} data-v-c9b7ef97>`);
      if (__props.replyingTo) {
        _push(`<div class="mb-3 p-3 bg-gray-50 rounded-lg border-l-4 border-l-green-600 flex items-start justify-between" data-v-c9b7ef97><div class="flex-1 min-w-0" data-v-c9b7ef97><div class="text-xs text-gray-500 mb-1" data-v-c9b7ef97> ตอบกลับ ${ssrInterpolate(__props.replyingTo.sender?.first_name)} ${ssrInterpolate(__props.replyingTo.sender?.last_name)}</div><div class="text-sm text-gray-700 truncate" data-v-c9b7ef97>${ssrInterpolate(__props.replyingTo.content || (__props.replyingTo.file_name || "ไฟล์"))}</div></div><button class="ml-2 text-gray-500 hover:text-gray-700 flex-shrink-0" data-v-c9b7ef97><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c9b7ef97><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-c9b7ef97></path></svg></button></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(previewFile)) {
        _push(`<div class="mb-3 p-3 bg-gray-50 rounded-lg flex items-center justify-between" data-v-c9b7ef97><div class="flex items-center space-x-3 flex-1 min-w-0" data-v-c9b7ef97>`);
        if (unref(previewFile).type.startsWith("image/")) {
          _push(`<img${ssrRenderAttr("src", unref(previewFileUrl))} alt="Preview" class="w-16 h-16 object-cover rounded" data-v-c9b7ef97>`);
        } else {
          _push(`<svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c9b7ef97><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" data-v-c9b7ef97></path></svg>`);
        }
        _push(`<div class="flex-1 min-w-0" data-v-c9b7ef97><p class="text-sm font-medium text-gray-900 truncate" data-v-c9b7ef97>${ssrInterpolate(unref(previewFile).name)}</p><p class="text-xs text-gray-500" data-v-c9b7ef97>${ssrInterpolate(formatFileSize(unref(previewFile).size))}</p></div></div><button class="ml-2 text-red-600 hover:text-red-700" data-v-c9b7ef97><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c9b7ef97><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-c9b7ef97></path></svg></button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex items-center space-x-2" data-v-c9b7ef97><div class="relative" data-v-c9b7ef97><button class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors self-center"${ssrIncludeBooleanAttr(__props.uploading || __props.sending) ? " disabled" : ""} title="เพิ่ม emoji" data-v-c9b7ef97><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c9b7ef97><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-v-c9b7ef97></path></svg></button>`);
      if (unref(showEmojiPicker)) {
        _push(`<div class="absolute bottom-full mb-2 left-0 bg-white border border-gray-200 rounded-lg shadow-xl p-3 w-64 h-64 overflow-y-auto z-[100]" data-v-c9b7ef97><div class="grid grid-cols-8 gap-1" data-v-c9b7ef97><!--[-->`);
        ssrRenderList(commonEmojis, (emoji) => {
          _push(`<button class="p-2 hover:bg-gray-100 rounded text-lg transition-colors" type="button" data-v-c9b7ef97>${ssrInterpolate(emoji)}</button>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><button class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors self-center"${ssrIncludeBooleanAttr(__props.uploading || __props.sending) ? " disabled" : ""} title="แนบไฟล์" data-v-c9b7ef97><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c9b7ef97><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" data-v-c9b7ef97></path></svg></button><input type="file" class="hidden" accept="image/*,application/pdf,.doc,.docx,.xls,.xls,.txt" data-v-c9b7ef97><div class="flex-1 relative" data-v-c9b7ef97><textarea${ssrRenderAttr("placeholder", __props.placeholder)}${ssrIncludeBooleanAttr(__props.uploading || __props.sending) ? " disabled" : ""} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" rows="1" style="${ssrRenderStyle({ "max-height": "120px", "min-height": "40px" })}" data-v-c9b7ef97>${ssrInterpolate(unref(messageText))}</textarea></div><button${ssrIncludeBooleanAttr(!unref(canSend) || __props.uploading || __props.sending) ? " disabled" : ""} class="h-[44px] w-[44px] flex items-center justify-center bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0" data-v-c9b7ef97>`);
      if (__props.sending) {
        _push(`<svg class="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24" data-v-c9b7ef97><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-c9b7ef97></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" data-v-c9b7ef97></path></svg>`);
      } else {
        _push(`<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c9b7ef97><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" data-v-c9b7ef97></path></svg>`);
      }
      _push(`</button></div>`);
      if (unref(error)) {
        _push(`<p class="mt-2 text-sm text-red-600" data-v-c9b7ef97>${ssrInterpolate(unref(error))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/ChatInput.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const ChatInput = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$7, [["__scopeId", "data-v-c9b7ef97"]]), { __name: "ChatInput" });
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "ChatWindow",
  __ssrInlineRender: true,
  props: {
    room: {},
    messages: {},
    loading: { type: Boolean, default: false }
  },
  emits: ["send-message", "load-more", "reply", "pin"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { user } = useAuth();
    const { getTypingUsers, startTyping, stopTyping } = useChat();
    const messagesContainer = ref(null);
    const previewImage = ref(null);
    const uploading = ref(false);
    const sending = ref(false);
    const loadingMore = ref(false);
    const hasMoreMessages = ref(true);
    const typingTimer = ref(null);
    const replyingToMessage = ref(null);
    const messageRefs = ref({});
    const currentUserId = computed(() => user.value?.id || 0);
    const otherUser = computed(() => {
      if (!props.room || !user.value) return null;
      return props.room.student_id === user.value.id ? props.room.tutor : props.room.student;
    });
    const typingUsers = computed(() => {
      if (!props.room) return [];
      return getTypingUsers(props.room.id);
    });
    const formatDateLabel = (date) => {
      const day = format(date, "d", { locale: th });
      const month = format(date, "MMM", { locale: th });
      const dayOfWeek = format(date, "EEE", { locale: th });
      return `${day} ${month} (${dayOfWeek}.)`;
    };
    const isSameDate = (date1, date2) => {
      try {
        const d1 = typeof date1 === "string" ? parseISO(date1) : date1;
        const d2 = typeof date2 === "string" ? parseISO(date2) : date2;
        return isSameDay(d1, d2);
      } catch {
        return false;
      }
    };
    const messagesWithDates = computed(() => {
      const result = [];
      for (let i = 0; i < props.messages.length; i++) {
        const message = props.messages[i];
        const messageDate = parseISO(message.created_at);
        const prevMessage = i > 0 ? props.messages[i - 1] : null;
        const shouldShowDate = !prevMessage || !isSameDate(message.created_at, prevMessage.created_at);
        if (shouldShowDate) {
          result.push({
            type: "date",
            dateLabel: formatDateLabel(messageDate),
            key: `date-${message.id}`
          });
        }
        result.push({
          type: "message",
          message,
          key: `message-${message.id}-${message.created_at}`
        });
      }
      return result;
    });
    const handleSendMessage = async (data) => {
      sending.value = true;
      try {
        emit("send-message", data);
        await nextTick();
        scrollToBottom();
      } finally {
        sending.value = false;
      }
    };
    const handleTyping = () => {
      if (!props.room) return;
      startTyping(props.room.id);
      if (typingTimer.value) {
        clearTimeout(typingTimer.value);
      }
      typingTimer.value = setTimeout(() => {
        if (props.room) {
          stopTyping(props.room.id);
        }
      }, 3e3);
    };
    const handleImageClick = (url) => {
      previewImage.value = url;
    };
    const handleReply = (message) => {
      replyingToMessage.value = message;
      nextTick(() => {
        const input = (void 0).querySelector('textarea[placeholder="พิมพ์ข้อความ..."]');
        if (input) {
          input.focus();
        }
      });
    };
    const handlePin = async (messageId, pin) => {
      console.log("[ChatWindow] Pin message:", messageId, pin);
      emit("pin", messageId, pin);
    };
    const handleScrollToMessage = (messageId) => {
      const messageElement = messageRefs.value[messageId] || (void 0).getElementById(`message-${messageId}`);
      if (messageElement && messagesContainer.value) {
        messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
        messageElement.classList.add("bg-yellow-100", "transition-colors", "duration-300");
        setTimeout(() => {
          messageElement.classList.remove("bg-yellow-100");
        }, 2e3);
      }
    };
    const scrollToBottom = () => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
      }
    };
    watch(() => props.messages.length, () => {
      nextTick(() => {
        scrollToBottom();
      });
    });
    watch(() => props.room?.id, () => {
      nextTick(() => {
        scrollToBottom();
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "h-full flex flex-col bg-white overflow-hidden" }, _attrs))}>`);
      if (__props.room) {
        _push(`<div class="border-b p-4 bg-gray-50 flex-shrink-0"><div class="flex items-center space-x-3"><div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">`);
        if (unref(otherUser)?.avatar_url) {
          _push(`<img${ssrRenderAttr("src", unref(otherUser).avatar_url)}${ssrRenderAttr("alt", unref(otherUser).first_name)} class="w-full h-full object-cover">`);
        } else {
          _push(`<span class="text-gray-500 font-semibold">${ssrInterpolate(unref(otherUser)?.first_name?.charAt(0))}</span>`);
        }
        _push(`</div><div class="flex-1 min-w-0"><h3 class="font-semibold text-gray-900">${ssrInterpolate(unref(otherUser)?.first_name)} ${ssrInterpolate(unref(otherUser)?.last_name)}</h3><p class="text-sm text-gray-500 truncate">${ssrInterpolate(__props.room.course?.title)}</p></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex-1 overflow-y-auto p-4 space-y-1">`);
      if (unref(loadingMore)) {
        _push(`<div class="text-center py-2 text-sm text-gray-500"> กำลังโหลด... </div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(hasMoreMessages) && !unref(loadingMore)) {
        _push(`<div class="text-center py-2"><button class="text-sm text-green-600 hover:text-green-700 font-medium"> โหลดข้อความเก่า </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(unref(messagesWithDates), (item, index) => {
        _push(`<!--[-->`);
        if (item.type === "date") {
          _push(`<div class="flex items-center justify-center my-4"><div class="bg-gray-300 text-white px-4 py-1.5 rounded-lg text-sm font-medium flex items-center space-x-1"><span>${ssrInterpolate(item.dateLabel)}</span><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg></div></div>`);
        } else {
          _push(`<div${ssrRenderAttr("id", `message-${item.message.id}`)}>`);
          _push(ssrRenderComponent(ChatMessage, {
            message: item.message,
            "current-user-id": unref(currentUserId),
            onImageClick: handleImageClick,
            onReply: handleReply,
            onPin: handlePin,
            onScrollToMessage: handleScrollToMessage
          }, null, _parent));
          _push(`</div>`);
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]-->`);
      if (unref(typingUsers).length > 0) {
        _push(`<div class="flex items-center space-x-2 text-gray-500 text-sm italic py-2"><div class="flex space-x-1"><div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="${ssrRenderStyle({ "animation-delay": "0ms" })}"></div><div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="${ssrRenderStyle({ "animation-delay": "150ms" })}"></div><div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="${ssrRenderStyle({ "animation-delay": "300ms" })}"></div></div><span>กำลังพิมพ์...</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!__props.loading && __props.messages.length === 0) {
        _push(`<div class="text-center py-8 text-gray-500"> ยังไม่มีข้อความ </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex-shrink-0">`);
      if (__props.room) {
        _push(ssrRenderComponent(ChatInput, {
          "room-id": __props.room.id,
          placeholder: "พิมพ์ข้อความ...",
          uploading: unref(uploading),
          sending: unref(sending),
          "replying-to": unref(replyingToMessage),
          onSendMessage: handleSendMessage,
          onTyping: handleTyping,
          onCancelReply: ($event) => replyingToMessage.value = null
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(previewImage)) {
        _push(`<div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"><img${ssrRenderAttr("src", unref(previewImage))} alt="Preview" class="max-w-full max-h-full object-contain"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/ChatWindow.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const ChatWindow = Object.assign(_sfc_main$6, { __name: "ChatWindow" });
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "AddTagModal",
  __ssrInlineRender: true,
  props: {
    show: { type: Boolean },
    roomId: {}
  },
  emits: ["close", "tag-added"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    useAuth();
    const tagName = ref("");
    const selectedColor = ref("#3B82F6");
    const loading = ref(false);
    const colors = [
      { value: "#3B82F6", name: "Blue" },
      { value: "#10B981", name: "Green" },
      { value: "#F59E0B", name: "Orange" },
      { value: "#EF4444", name: "Red" },
      { value: "#8B5CF6", name: "Purple" },
      { value: "#EC4899", name: "Pink" },
      { value: "#06B6D4", name: "Cyan" },
      { value: "#84CC16", name: "Lime" }
    ];
    watch(() => props.show, (isOpen) => {
      if (!isOpen) {
        tagName.value = "";
        selectedColor.value = "#3B82F6";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.show) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" }, _attrs))}><div class="bg-white rounded-lg p-6 w-full max-w-md"><div class="flex items-center justify-between mb-4"><h3 class="text-lg font-semibold">เพิ่มแท็ก</h3><button class="text-gray-500 hover:text-gray-700"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><div class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-2">ชื่อแท็ก</label><input${ssrRenderAttr("value", unref(tagName))} type="text" placeholder="เช่น VIP, สำคัญ, ติดตาม" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2">สี</label><div class="flex flex-wrap gap-2"><!--[-->`);
        ssrRenderList(colors, (color) => {
          _push(`<button class="${ssrRenderClass([
            "w-10 h-10 rounded-full border-2 transition-all",
            unref(selectedColor) === color.value ? "border-gray-800 scale-110" : "border-gray-300"
          ])}" style="${ssrRenderStyle({ backgroundColor: color.value })}"></button>`);
        });
        _push(`<!--]--></div></div><div class="flex justify-end space-x-3"><button class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"> ยกเลิก </button><button${ssrIncludeBooleanAttr(!unref(tagName).trim() || unref(loading)) ? " disabled" : ""} class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">${ssrInterpolate(unref(loading) ? "กำลังเพิ่ม..." : "เพิ่ม")}</button></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/AddTagModal.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const AddTagModal = Object.assign(_sfc_main$5, { __name: "ChatAddTagModal" });
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "AddNoteModal",
  __ssrInlineRender: true,
  props: {
    show: { type: Boolean },
    roomId: {}
  },
  emits: ["close", "note-added"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    useAuth();
    const content = ref("");
    const loading = ref(false);
    watch(() => props.show, (isOpen) => {
      if (!isOpen) {
        content.value = "";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.show) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" }, _attrs))}><div class="bg-white rounded-lg p-6 w-full max-w-2xl"><div class="flex items-center justify-between mb-4"><h3 class="text-lg font-semibold">เพิ่มโน้ต</h3><button class="text-gray-500 hover:text-gray-700"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><div class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-2">เนื้อหาโน้ต</label><textarea rows="6" placeholder="บันทึกข้อมูลผู้ใช้ บันทึกบทสนทนา หรือเพิ่มข้อความสำหรับส่งต่องาน..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none">${ssrInterpolate(unref(content))}</textarea><p class="text-xs text-gray-500 mt-1">ผู้ใช้จะไม่เห็นเนื้อหาในโน้ตนี้</p></div><div class="flex justify-end space-x-3"><button class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"> ยกเลิก </button><button${ssrIncludeBooleanAttr(!unref(content).trim() || unref(loading)) ? " disabled" : ""} class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">${ssrInterpolate(unref(loading) ? "กำลังเพิ่ม..." : "เพิ่ม")}</button></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/AddNoteModal.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const AddNoteModal = Object.assign(_sfc_main$4, { __name: "ChatAddNoteModal" });
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "EditNoteModal",
  __ssrInlineRender: true,
  props: {
    note: {}
  },
  emits: ["close", "note-updated"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    useAuth();
    const content = ref("");
    const loading = ref(false);
    watch(() => props.note, (newNote) => {
      if (newNote) {
        content.value = newNote.content;
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.note) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" }, _attrs))}><div class="bg-white rounded-lg p-6 w-full max-w-2xl"><div class="flex items-center justify-between mb-4"><h3 class="text-lg font-semibold">แก้ไขโน้ต</h3><button class="text-gray-500 hover:text-gray-700"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><div class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-2">เนื้อหาโน้ต</label><textarea rows="6" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none">${ssrInterpolate(unref(content))}</textarea></div><div class="flex justify-end space-x-3"><button class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"> ยกเลิก </button><button${ssrIncludeBooleanAttr(!unref(content).trim() || unref(loading)) ? " disabled" : ""} class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">${ssrInterpolate(unref(loading) ? "กำลังบันทึก..." : "บันทึก")}</button></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/EditNoteModal.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const EditNoteModal = Object.assign(_sfc_main$3, { __name: "ChatEditNoteModal" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ChatRoomSidebar",
  __ssrInlineRender: true,
  props: {
    room: {}
  },
  setup(__props) {
    const props = __props;
    const { user } = useAuth();
    const config = useRuntimeConfig();
    const { accessToken } = useAuth();
    const tags = ref([]);
    const notes = ref([]);
    const showAddTagModal = ref(false);
    const showAddNoteModal = ref(false);
    ref(false);
    const editingNote = ref(null);
    const otherUser = computed(() => {
      if (!props.room || !user.value) return null;
      return props.room.student_id === user.value.id ? props.room.tutor : props.room.student;
    });
    watch(() => props.room?.id, async (roomId) => {
      if (roomId) {
        await loadTags();
        await loadNotes();
      } else {
        tags.value = [];
        notes.value = [];
      }
    }, { immediate: true });
    const loadTags = async () => {
      if (!props.room?.id) return;
      try {
        const response = await $fetch(
          `${config.public.apiBase}/chat/rooms/${props.room.id}/tags`,
          {
            headers: {
              Authorization: `Bearer ${accessToken.value}`
            }
          }
        );
        if (response.success) {
          tags.value = response.data;
        }
      } catch (error) {
        console.error("[ChatRoomSidebar] Error loading tags:", error);
      }
    };
    const loadNotes = async () => {
      if (!props.room?.id) return;
      try {
        const response = await $fetch(
          `${config.public.apiBase}/chat/rooms/${props.room.id}/notes`,
          {
            headers: {
              Authorization: `Bearer ${accessToken.value}`
            }
          }
        );
        if (response.success) {
          notes.value = response.data;
        }
      } catch (error) {
        console.error("[ChatRoomSidebar] Error loading notes:", error);
      }
    };
    const handleTagAdded = () => {
      loadTags();
    };
    const handleNoteAdded = () => {
      loadNotes();
    };
    const handleNoteUpdated = () => {
      editingNote.value = null;
      loadNotes();
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-80 border-l bg-white flex-shrink-0 overflow-y-auto flex flex-col h-full" }, _attrs))}>`);
      if (!__props.room) {
        _push(`<div class="flex-1 flex items-center justify-center p-4"><div class="text-center text-gray-500"><svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg><p class="text-sm">เลือกห้องแชทเพื่อดูข้อมูล</p></div></div>`);
      } else {
        _push(`<div class="flex-1 overflow-y-auto"><div class="p-4 border-b"><div class="flex flex-col items-center mb-4"><div class="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-3">`);
        if (unref(otherUser)?.avatar_url) {
          _push(`<img${ssrRenderAttr("src", unref(otherUser).avatar_url)}${ssrRenderAttr("alt", unref(otherUser).first_name)} class="w-full h-full object-cover">`);
        } else {
          _push(`<span class="text-gray-500 text-2xl font-semibold">${ssrInterpolate(unref(otherUser)?.first_name?.charAt(0))}</span>`);
        }
        _push(`</div><h3 class="text-lg font-semibold text-gray-900 mb-1">${ssrInterpolate(unref(otherUser)?.first_name)} ${ssrInterpolate(unref(otherUser)?.last_name)}</h3><button class="text-gray-500 hover:text-gray-700" title="แก้ไขชื่อ"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button></div></div><div class="p-4 border-b"><div class="flex items-center justify-between mb-3"><h4 class="text-sm font-semibold text-gray-700">แท็ก</h4><button class="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg><span>ใส่แท็ก</span></button></div>`);
        if (unref(tags).length === 0) {
          _push(`<div class="text-sm text-gray-500 text-center py-4"> ยังไม่มีแท็ก </div>`);
        } else {
          _push(`<div class="flex flex-wrap gap-2"><!--[-->`);
          ssrRenderList(unref(tags), (tag) => {
            _push(`<span style="${ssrRenderStyle({ backgroundColor: tag.color + "20", color: tag.color, borderColor: tag.color })}" class="px-3 py-1 rounded-full text-sm font-medium border">${ssrInterpolate(tag.tag_name)}</span>`);
          });
          _push(`<!--]--></div>`);
        }
        _push(`</div><div class="p-4 border-b"><div class="flex items-center justify-between mb-3"><h4 class="text-sm font-semibold text-gray-700"> โน้ต <span class="text-gray-500 font-normal">(${ssrInterpolate(unref(notes).length)})</span></h4><button class="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg><span>เพิ่มโน้ต</span></button></div>`);
        if (unref(notes).length === 0) {
          _push(`<div class="text-sm text-gray-500 text-center py-4"> ยังไม่มีโน้ต </div>`);
        } else {
          _push(`<div class="space-y-3"><!--[-->`);
          ssrRenderList(unref(notes), (note) => {
            _push(`<div class="bg-gray-50 rounded-lg p-3"><p class="text-sm text-gray-900 whitespace-pre-wrap">${ssrInterpolate(note.content)}</p><div class="flex items-center justify-between mt-2 text-xs text-gray-500"><span> สร้างโดย ${ssrInterpolate(note.creator?.first_name)} ${ssrInterpolate(note.creator?.last_name)} `);
            if (note.updated_by && note.updated_by !== note.created_by) {
              _push(`<span> (แก้ไขล่าสุดโดย ${ssrInterpolate(note.updater?.first_name)} ${ssrInterpolate(note.updater?.last_name)}) </span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</span><button class="text-green-600 hover:text-green-700"> แก้ไข </button></div></div>`);
          });
          _push(`<!--]--></div>`);
        }
        _push(`</div></div>`);
      }
      if (__props.room) {
        _push(ssrRenderComponent(AddTagModal, {
          show: unref(showAddTagModal),
          "room-id": __props.room.id,
          onClose: ($event) => showAddTagModal.value = false,
          onTagAdded: handleTagAdded
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (__props.room) {
        _push(ssrRenderComponent(AddNoteModal, {
          show: unref(showAddNoteModal),
          "room-id": __props.room.id,
          onClose: ($event) => showAddNoteModal.value = false,
          onNoteAdded: handleNoteAdded
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(editingNote)) {
        _push(ssrRenderComponent(EditNoteModal, {
          note: unref(editingNote),
          onClose: ($event) => editingNote.value = null,
          onNoteUpdated: handleNoteUpdated
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/ChatRoomSidebar.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const ChatRoomSidebar = Object.assign(_sfc_main$2, { __name: "ChatRoomSidebar" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "CreateChatRoomModal",
  __ssrInlineRender: true,
  props: {
    show: { type: Boolean }
  },
  emits: ["close", "room-created"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const config = useRuntimeConfig();
    const { accessToken } = useAuth();
    const chatOptions = ref([]);
    const loading = ref(false);
    const error = ref("");
    const creating = ref(false);
    const loadChatOptions = async () => {
      loading.value = true;
      error.value = "";
      try {
        const response = await $fetch(
          `${config.public.apiBase}/learning/available-chats`,
          {
            headers: {
              Authorization: `Bearer ${accessToken.value}`
            }
          }
        );
        if (response.success) {
          chatOptions.value = response.data;
        }
      } catch (err) {
        console.error("[CreateChatRoomModal] Error loading options:", err);
        error.value = err.data?.message || "ไม่สามารถโหลดข้อมูลได้";
      } finally {
        loading.value = false;
      }
    };
    watch(() => props.show, (isOpen) => {
      if (isOpen) {
        loadChatOptions();
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.show) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" }, _attrs))}><div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col"><div class="px-6 py-4 border-b flex items-center justify-between"><h2 class="text-xl font-semibold">เริ่มแชทกับอาจารย์</h2><button class="text-gray-400 hover:text-gray-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><div class="flex-1 overflow-y-auto p-6">`);
        if (unref(loading)) {
          _push(`<div class="text-center py-8"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div><p class="mt-2 text-gray-600">กำลังโหลด...</p></div>`);
        } else if (unref(error)) {
          _push(`<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">${ssrInterpolate(unref(error))}</div>`);
        } else if (unref(chatOptions).length === 0) {
          _push(`<div class="text-center py-8 text-gray-500"><svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg><p>คุณยังไม่มีคอร์สที่สามารถแชทได้</p><p class="text-sm mt-2">กรุณาลงทะเบียนเรียนคอร์สก่อน</p></div>`);
        } else {
          _push(`<div class="space-y-3"><!--[-->`);
          ssrRenderList(unref(chatOptions), (option) => {
            _push(`<div class="${ssrRenderClass([option.chatRoomId ? "border-green-200 bg-green-50" : "border-gray-200", "border rounded-lg p-4 hover:bg-gray-50 transition-colors"])}"><div class="flex items-start space-x-4"><div class="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">`);
            if (option.course.thumbnail) {
              _push(`<img${ssrRenderAttr("src", option.course.thumbnail)}${ssrRenderAttr("alt", option.course.title)} class="w-full h-full object-cover">`);
            } else {
              _push(`<div class="w-full h-full flex items-center justify-center text-gray-400"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg></div>`);
            }
            _push(`</div><div class="flex-1 min-w-0"><h3 class="font-semibold text-gray-900 mb-1">${ssrInterpolate(option.course.title)}</h3><p class="text-sm text-gray-600 mb-2"> อาจารย์: ${ssrInterpolate(option.tutor.firstName)} ${ssrInterpolate(option.tutor.lastName)}</p><div class="flex items-center justify-between">`);
            if (option.chatRoomId) {
              _push(`<span class="text-xs text-green-600 font-medium"> ✓ มีห้องแชทอยู่แล้ว </span>`);
            } else {
              _push(`<span class="text-xs text-gray-500"> ยังไม่มีห้องแชท </span>`);
            }
            _push(`<button${ssrIncludeBooleanAttr(unref(creating)) ? " disabled" : ""} class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium">${ssrInterpolate(option.chatRoomId ? "เปิดแชท" : "เริ่มแชท")}</button></div></div></div></div>`);
          });
          _push(`<!--]--></div>`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/chat/CreateChatRoomModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const CreateChatRoomModal = Object.assign(_sfc_main$1, { __name: "ChatCreateChatRoomModal" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useAuth();
    const {
      rooms,
      activeRoom,
      setActiveRoom,
      loadRooms,
      loadMessages,
      sendMessage,
      markAsRead,
      sortedMessages
    } = useChat();
    const loadingRooms = ref(false);
    const loadingMessages = ref(false);
    const messageOffset = ref(0);
    const hasMoreMessages = ref(true);
    const showCreateModal = ref(false);
    ref(false);
    const chatRooms = computed(() => [...rooms.value]);
    watch(() => activeRoom.value?.id, async (roomId) => {
      if (roomId) {
        await loadRoomMessages(roomId);
        markAsRead(roomId);
      } else {
        messageOffset.value = 0;
        hasMoreMessages.value = true;
      }
    }, { immediate: true });
    const currentMessages = sortedMessages;
    watch(() => currentMessages.value.length, (newLength, oldLength) => {
      console.log("[Chat] 📏 Message count changed:", {
        oldLength,
        newLength,
        willScroll: newLength > (oldLength || 0)
      });
    });
    const loadRoomMessages = async (roomId, append = false) => {
      loadingMessages.value = true;
      try {
        const offset = append ? messageOffset.value : 0;
        const apiMessages = await loadMessages(roomId, 50, offset);
        if (!apiMessages) {
          console.error("[Chat] loadMessages returned undefined");
          return;
        }
        if (apiMessages.length < 50) {
          hasMoreMessages.value = false;
        } else {
          messageOffset.value += apiMessages.length;
          hasMoreMessages.value = true;
        }
      } catch (error) {
        console.error("[Chat] Error loading messages:", error);
      } finally {
        loadingMessages.value = false;
      }
    };
    const handleSelectRoom = async (room) => {
      console.log("[Chat] 🎯 Selecting room:", room.id);
      setActiveRoom(room);
      messageOffset.value = 0;
      hasMoreMessages.value = true;
      const route = useRoute();
      const router = useRouter();
      if (route.query.roomId !== room.id.toString()) {
        await router.replace({
          query: { ...route.query, roomId: room.id.toString() }
        });
      }
    };
    const sending = ref(false);
    const handleSendMessage = async (data) => {
      console.log("[Chat Page] 🎯 handleSendMessage called:", {
        hasActiveRoom: !!activeRoom.value,
        roomId: activeRoom.value?.id,
        content: data.content?.substring(0, 50),
        messageType: data.messageType,
        isSending: sending.value
      });
      if (!activeRoom.value) {
        console.error("[Chat Page] ❌ No active room");
        return;
      }
      if (sending.value) {
        console.log("[Chat Page] ⚠️ Already sending a message, skipping duplicate");
        return;
      }
      sending.value = true;
      console.log("[Chat Page] ✅ Sending state set to true");
      try {
        console.log("[Chat Page] 📤 Calling sendMessage composable...");
        await sendMessage({
          room_id: activeRoom.value.id,
          content: data.content,
          message_type: data.messageType,
          file_url: data.fileUrl,
          file_name: data.fileName,
          file_size: data.fileSize,
          file_type: data.fileType,
          reply_to_id: data.replyToId || null
        });
        console.log("[Chat Page] ✅ sendMessage completed successfully");
        markAsRead(activeRoom.value.id);
      } catch (error) {
        console.error("[Chat Page] ❌ Error in handleSendMessage:", {
          error: error.message,
          stack: error.stack,
          response: error.response
        });
      } finally {
        setTimeout(() => {
          sending.value = false;
          console.log("[Chat Page] 🔄 Sending state reset to false");
        }, 500);
      }
    };
    const handleLoadMore = async () => {
      if (!activeRoom.value || !hasMoreMessages.value || loadingMessages.value) return;
      await loadRoomMessages(activeRoom.value.id, true);
    };
    const handleRoomCreated = async (roomId) => {
      await loadRooms();
      const newRoom = rooms.value.find((r) => r.id === roomId);
      if (newRoom) {
        await handleSelectRoom(newRoom);
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "h-full flex overflow-hidden" }, _attrs))}><div class="w-80 border-r bg-white flex-shrink-0 overflow-y-auto">`);
      _push(ssrRenderComponent(ChatRoomList, {
        rooms: unref(chatRooms),
        "active-room": unref(activeRoom),
        loading: unref(loadingRooms),
        onSelectRoom: handleSelectRoom,
        onCreateRoom: ($event) => showCreateModal.value = true
      }, null, _parent));
      _push(`</div><div class="flex-1 flex flex-col min-w-0 overflow-hidden">`);
      if (!unref(activeRoom)) {
        _push(`<div class="flex-1 flex items-center justify-center bg-gray-50"><div class="text-center text-gray-500"><svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg><p class="text-lg">เลือกห้องแชทเพื่อเริ่มการสนทนา</p></div></div>`);
      } else {
        _push(`<div class="flex-1 flex min-w-0 overflow-hidden">`);
        _push(ssrRenderComponent(ChatWindow, {
          class: "flex-1 min-w-0",
          room: unref(activeRoom),
          messages: unref(currentMessages),
          loading: unref(loadingMessages),
          onSendMessage: handleSendMessage,
          onLoadMore: handleLoadMore
        }, null, _parent));
        _push(ssrRenderComponent(ChatRoomSidebar, {
          class: "flex-shrink-0",
          room: unref(activeRoom)
        }, null, _parent));
        _push(`</div>`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(CreateChatRoomModal, {
        show: unref(showCreateModal),
        onClose: ($event) => showCreateModal.value = false,
        onRoomCreated: handleRoomCreated
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/chat/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CTYKMr9P.mjs.map
