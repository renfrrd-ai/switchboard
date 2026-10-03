"use client";

import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Placeholder } from "@tiptap/extensions";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState } from "react";
import { updateNote } from "@/lib/notes";
import type { Note } from "@/lib/types";
import {
  BulletListIcon,
  CodeBlockIcon,
  DividerIcon,
  LinkIcon,
  OrderedListIcon,
  QuoteIcon,
  TaskListIcon,
} from "./icons";

/** How long typing has to pause before the body is saved. */
const SAVE_DELAY_MS = 500;

/**
 * The note body. Markdown shortcuts work as you type ("# ", "- ", "1. ",
 * "[] ", "> ", "```", "---", **bold**, *italic*, `code`), and the toolbar
 * covers the same set. Saves itself shortly after you stop typing.
 */
export function NoteEditor({
  note,
  onSavingChange,
}: {
  note: Note;
  onSavingChange: (saving: boolean) => void;
}) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<Pick<Note, "body" | "text"> | null>(null);
  const onSaving = useRef(onSavingChange);
  useEffect(() => {
    onSaving.current = onSavingChange;
  });

  const flush = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    if (pending.current) {
      updateNote(note.id, pending.current);
      pending.current = null;
    }
    onSaving.current(false);
  };
  const flushRef = useRef(flush);
  useEffect(() => {
    flushRef.current = flush;
  });

  // Save whatever is waiting when the note closes.
  useEffect(() => () => flushRef.current(), []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        strike: false,
        underline: false,
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: "https",
          HTMLAttributes: { rel: "noopener noreferrer nofollow", target: "_blank" },
        },
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({
        placeholder: "Start writing. # heading, - list, [] to-do, ``` code",
      }),
    ],
    content: note.body ?? "",
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: { class: "note-body", "aria-label": "Note", "aria-multiline": "true" },
      // Links are edited in place; Cmd/Ctrl-click opens one.
      handleClick: (_view, _pos, event) => {
        const link = (event.target as HTMLElement).closest("a");
        if (link && (event.metaKey || event.ctrlKey)) {
          window.open(link.href, "_blank", "noopener,noreferrer");
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      pending.current = {
        body: editor.getJSON(),
        text: editor.getText({ blockSeparator: "\n" }),
      };
      onSaving.current(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => flushRef.current(), SAVE_DELAY_MS);
    },
  });

  return (
    <div className="flex flex-col gap-3">
      {editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} className="min-h-[40vh] cursor-text" />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const [linking, setLinking] = useState(false);
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      h1: e.isActive("heading", { level: 1 }),
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      code: e.isActive("code"),
      link: e.isActive("link"),
      href: (e.getAttributes("link").href as string | undefined) ?? "",
      bulletList: e.isActive("bulletList"),
      orderedList: e.isActive("orderedList"),
      taskList: e.isActive("taskList"),
      blockquote: e.isActive("blockquote"),
      codeBlock: e.isActive("codeBlock"),
    }),
  });

  const run = () => editor.chain().focus();

  return (
    <div className="sticky top-0 z-10 -mx-1 flex flex-col gap-2 bg-bg px-1 py-1.5">
      <div
        role="toolbar"
        aria-label="Formatting"
        className="flex items-center gap-0.5 overflow-x-auto [scrollbar-width:thin]"
      >
        <Tool label="Heading 1" active={state.h1} onClick={() => run().toggleHeading({ level: 1 }).run()}>
          H1
        </Tool>
        <Tool label="Heading 2" active={state.h2} onClick={() => run().toggleHeading({ level: 2 }).run()}>
          H2
        </Tool>
        <Tool label="Heading 3" active={state.h3} onClick={() => run().toggleHeading({ level: 3 }).run()}>
          H3
        </Tool>
        <Divider />
        <Tool label="Bold" active={state.bold} onClick={() => run().toggleBold().run()}>
          <span className="font-bold">B</span>
        </Tool>
        <Tool label="Italic" active={state.italic} onClick={() => run().toggleItalic().run()}>
          <span className="font-serif italic">I</span>
        </Tool>
        <Tool label="Inline code" active={state.code} onClick={() => run().toggleCode().run()}>
          <span className="font-mono text-[13px]">{"<>"}</span>
        </Tool>
        <Tool label="Link" active={state.link || linking} onClick={() => setLinking(!linking)}>
          <LinkIcon />
        </Tool>
        <Divider />
        <Tool label="Bulleted list" active={state.bulletList} onClick={() => run().toggleBulletList().run()}>
          <BulletListIcon />
        </Tool>
        <Tool label="Numbered list" active={state.orderedList} onClick={() => run().toggleOrderedList().run()}>
          <OrderedListIcon />
        </Tool>
        <Tool label="To-do list" active={state.taskList} onClick={() => run().toggleTaskList().run()}>
          <TaskListIcon />
        </Tool>
        <Tool label="Quote" active={state.blockquote} onClick={() => run().toggleBlockquote().run()}>
          <QuoteIcon />
        </Tool>
        <Tool label="Code block" active={state.codeBlock} onClick={() => run().toggleCodeBlock().run()}>
          <CodeBlockIcon />
        </Tool>
        <Tool label="Divider" active={false} onClick={() => run().setHorizontalRule().run()}>
          <DividerIcon />
        </Tool>
      </div>
      {linking && (
        <LinkForm
          key={state.href}
          editor={editor}
          href={state.href}
          onDone={() => setLinking(false)}
        />
      )}
    </div>
  );
}

function Tool({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      // Keep the editor's selection when a tool is clicked.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`grid size-11 flex-none place-items-center rounded-xl text-sm font-semibold ${
        active ? "bg-ink text-bg" : "text-muted hover:bg-sunk hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span aria-hidden="true" className="mx-1 h-6 w-px flex-none bg-line" />;
}

/** Adds http(s):// when the scheme is missing. Anything else the link extension rejects. */
function normaliseHref(raw: string): string {
  const href = raw.trim();
  if (!href) return "";
  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return href;
  return `https://${href}`;
}

function LinkForm({
  editor,
  href,
  onDone,
}: {
  editor: Editor;
  href: string;
  onDone: () => void;
}) {
  const [value, setValue] = useState(href);

  const apply = () => {
    const url = normaliseHref(value);
    const chain = editor.chain().focus().extendMarkRange("link");
    if (!url) {
      chain.unsetLink().run();
    } else if (editor.state.selection.empty && !editor.isActive("link")) {
      // Nothing selected: insert the address itself as the link text.
      chain.insertContent({ type: "text", text: url, marks: [{ type: "link", attrs: { href: url } }] }).run();
    } else {
      chain.setLink({ href: url }).run();
    }
    onDone();
  };

  return (
    <form
      className="flex flex-wrap gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        apply();
      }}
    >
      <input
        type="text"
        inputMode="url"
        autoCapitalize="none"
        spellCheck={false}
        autoFocus
        className="field field-boxed min-w-0 flex-[1_1_220px]"
        aria-label="Link address"
        placeholder="Paste or type a link"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            onDone();
            editor.commands.focus();
          }
        }}
      />
      <div className="flex gap-2">
        <button type="submit" className="btn btn-solid">
          {href ? "Update" : "Add link"}
        </button>
        {href && (
          <>
            <a href={href} target="_blank" rel="noopener noreferrer" className="btn">
              Open
            </a>
            <button
              type="button"
              className="btn btn-quiet"
              onClick={() => {
                editor.chain().focus().extendMarkRange("link").unsetLink().run();
                onDone();
              }}
            >
              Remove
            </button>
          </>
        )}
      </div>
    </form>
  );
}
