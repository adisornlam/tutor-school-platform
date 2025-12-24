globalThis.__timing__.logStart('Load chunks/build/RichTextEditor-BKbhyB-N');import { defineComponent, ref, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { u as useAuth } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "RichTextEditor",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    entityType: {},
    entityId: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const showImageDialog = ref(false);
    const showLinkDialog = ref(false);
    const imageUrl = ref("");
    const linkUrl = ref("");
    const uploadingImage = ref(false);
    ref(null);
    useAuth();
    const editor = useEditor({
      content: props.modelValue,
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3]
          }
        }),
        Image.configure({
          inline: true,
          allowBase64: true
        }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            target: "_blank",
            rel: "noopener noreferrer"
          }
        }),
        TextAlign.configure({
          types: ["heading", "paragraph"]
        })
        // Note: Underline extension - uncomment if package is installed
        // Underline
      ],
      onUpdate: ({ editor: editor2 }) => {
        emit("update:modelValue", editor2.getHTML());
      }
    });
    watch(() => props.modelValue, (value) => {
      const isSame = editor.value?.getHTML() === value;
      if (!isSame) {
        editor.value?.commands.setContent(value || "");
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "rich-text-editor" }, _attrs))}>`);
      if (unref(editor)) {
        _push(`<div class="border border-gray-300 rounded-lg overflow-hidden"><div class="border-b border-gray-300 bg-gray-50 p-2 flex flex-wrap gap-1"><button type="button" class="${ssrRenderClass([
          "p-2 rounded hover:bg-gray-200",
          unref(editor).isActive("bold") ? "bg-gray-300" : ""
        ])}" title="Bold"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"></path></svg></button><button type="button" class="${ssrRenderClass([
          "p-2 rounded hover:bg-gray-200",
          unref(editor).isActive("italic") ? "bg-gray-300" : ""
        ])}" title="Italic"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg></button><div class="w-px h-6 bg-gray-300 mx-1"></div><button type="button" class="${ssrRenderClass([
          "p-2 rounded hover:bg-gray-200",
          unref(editor).isActive("heading", { level: 1 }) ? "bg-gray-300" : ""
        ])}" title="Heading 1"> H1 </button><button type="button" class="${ssrRenderClass([
          "p-2 rounded hover:bg-gray-200",
          unref(editor).isActive("heading", { level: 2 }) ? "bg-gray-300" : ""
        ])}" title="Heading 2"> H2 </button><button type="button" class="${ssrRenderClass([
          "p-2 rounded hover:bg-gray-200",
          unref(editor).isActive("heading", { level: 3 }) ? "bg-gray-300" : ""
        ])}" title="Heading 3"> H3 </button><div class="w-px h-6 bg-gray-300 mx-1"></div><button type="button" class="${ssrRenderClass([
          "p-2 rounded hover:bg-gray-200",
          unref(editor).isActive("bulletList") ? "bg-gray-300" : ""
        ])}" title="Bullet List"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 6h13M8 12h13m-13 6h13M3 6h.01M3 12h.01M3 18h.01"></path></svg></button><button type="button" class="${ssrRenderClass([
          "p-2 rounded hover:bg-gray-200",
          unref(editor).isActive("orderedList") ? "bg-gray-300" : ""
        ])}" title="Numbered List"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path></svg></button><div class="w-px h-6 bg-gray-300 mx-1"></div><button type="button" class="p-2 rounded hover:bg-gray-200" title="Insert Image"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></button><button type="button" class="${ssrRenderClass([
          "p-2 rounded hover:bg-gray-200",
          unref(editor).isActive("link") ? "bg-gray-300" : ""
        ])}" title="Insert Link"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg></button></div>`);
        _push(ssrRenderComponent(unref(EditorContent), {
          editor: unref(editor),
          class: "prose max-w-none min-h-[300px] p-4 focus:outline-none"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(showImageDialog)) {
        _push(`<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div class="bg-white rounded-lg p-6 max-w-md w-full mx-4"><h3 class="text-lg font-semibold mb-4">แทรกรูปภาพ</h3><div class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-2">อัปโหลดรูปภาพ</label><input type="file" accept="image/*" class="hidden"><div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors cursor-pointer"><svg class="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg><p class="text-sm text-gray-600 mb-1"><span class="text-green-600 font-medium">คลิกเพื่อเลือกไฟล์</span> หรือลากวางไฟล์ที่นี่ </p><p class="text-xs text-gray-500">รองรับ: JPG, PNG, GIF, WebP (สูงสุด 5MB)</p>`);
        if (unref(uploadingImage)) {
          _push(`<div class="mt-2"><div class="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div><p class="text-xs text-gray-600 mt-1">กำลังอัปโหลด...</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="relative"><div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-300"></div></div><div class="relative flex justify-center text-sm"><span class="px-2 bg-white text-gray-500">หรือ</span></div></div><div><label class="block text-sm font-medium text-gray-700 mb-2">ใส่ URL รูปภาพ</label><input${ssrRenderAttr("value", unref(imageUrl))} type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="https://example.com/image.jpg"></div><div class="flex justify-end space-x-2"><button type="button" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"> ยกเลิก </button><button type="button"${ssrIncludeBooleanAttr(!unref(imageUrl) || unref(uploadingImage)) ? " disabled" : ""} class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"> แทรกจาก URL </button></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(showLinkDialog)) {
        _push(`<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div class="bg-white rounded-lg p-6 max-w-md w-full mx-4"><h3 class="text-lg font-semibold mb-4">แทรกลิงก์</h3><div class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-2">URL</label><input${ssrRenderAttr("value", unref(linkUrl))} type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="https://example.com"></div><div class="flex justify-end space-x-2"><button type="button" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"> ยกเลิก </button><button type="button" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"> แทรก </button></div></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/RichTextEditor.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const RichTextEditor = Object.assign(_sfc_main, { __name: "RichTextEditor" });

export { RichTextEditor as R };;globalThis.__timing__.logEnd('Load chunks/build/RichTextEditor-BKbhyB-N');
//# sourceMappingURL=RichTextEditor-BKbhyB-N.mjs.map
