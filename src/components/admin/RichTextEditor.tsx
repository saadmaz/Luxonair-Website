import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  ImageIcon,
  Quote,
  Undo,
  Redo,
} from "lucide-react";

export const editorExtensions = [StarterKit, Image, Link.configure({ openOnClick: false })];

type Props = {
  value: JSONContent | null;
  onChange: (doc: JSONContent) => void;
};

const btnCls = (active: boolean) =>
  `flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 ${
    active ? "bg-[#042045]/10 text-[#042045]" : ""
  }`;

export function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: editorExtensions,
    content: value ?? "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[220px] px-3.5 py-3 focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  const addImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp,image/gif";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      if (!res.ok) return;
      const { url } = (await res.json()) as { url: string };
      editor.chain().focus().setImage({ src: url }).run();
    };
    input.click();
  };

  const addLink = () => {
    const url = window.prompt("Link URL");
    if (!url) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 focus-within:border-[#042045] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#042045]/10">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 px-2 py-1.5">
        <button type="button" className={btnCls(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="h-3.5 w-3.5" />
        </button>
        <button type="button" className={btnCls(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="h-3.5 w-3.5" />
        </button>
        <button type="button" className={btnCls(editor.isActive("heading", { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="h-3.5 w-3.5" />
        </button>
        <button type="button" className={btnCls(editor.isActive("heading", { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 className="h-3.5 w-3.5" />
        </button>
        <button type="button" className={btnCls(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="h-3.5 w-3.5" />
        </button>
        <button type="button" className={btnCls(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="h-3.5 w-3.5" />
        </button>
        <button type="button" className={btnCls(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote className="h-3.5 w-3.5" />
        </button>
        <button type="button" className={btnCls(editor.isActive("link"))} onClick={addLink}>
          <LinkIcon className="h-3.5 w-3.5" />
        </button>
        <button type="button" className={btnCls(false)} onClick={addImage}>
          <ImageIcon className="h-3.5 w-3.5" />
        </button>
        <span className="mx-1 h-4 w-px bg-gray-200" />
        <button type="button" className={btnCls(false)} onClick={() => editor.chain().focus().undo().run()}>
          <Undo className="h-3.5 w-3.5" />
        </button>
        <button type="button" className={btnCls(false)} onClick={() => editor.chain().focus().redo().run()}>
          <Redo className="h-3.5 w-3.5" />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
