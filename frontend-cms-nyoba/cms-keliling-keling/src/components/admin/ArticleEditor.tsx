"use client"

import { useEffect, useState } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

export default function ArticleEditor() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Tulis artikel di sini...</p>",
    editorProps: {
      attributes: {
        class: "prose min-h-[300px] p-4 border rounded-md bg-white",
      },
    },
    immediatelyRender: false, // ✅ prevent SSR hydration error
  })

  if (!mounted || !editor) {
    return <p>Loading editor...</p>
  }

  return (
    <div>
      <div className="mb-2 flex gap-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="rounded border px-3 py-1 text-sm font-medium hover:bg-gray-100"
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="rounded border px-3 py-1 text-sm font-medium hover:bg-gray-100"
        >
          Italic
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}
