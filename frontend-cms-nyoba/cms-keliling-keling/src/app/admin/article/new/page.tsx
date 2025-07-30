"use client"
// app/admin/article/new/page.tsx
import dynamic from "next/dynamic"

const ArticleEditor = dynamic(() => import("@/components/admin/ArticleEditor"), {
  ssr: false,
})

export default function NewArticlePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Buat Artikel Baru</h1>
      <ArticleEditor />
    </div>
  )
}
