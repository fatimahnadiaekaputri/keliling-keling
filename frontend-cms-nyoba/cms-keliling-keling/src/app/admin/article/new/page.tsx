"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import imageCompression from "browser-image-compression"
import { useRouter } from "next/navigation"
import moment from "moment-timezone"
import Cookies from "js-cookie"

const ArticleEditor = dynamic(() => import("@/components/admin/ArticleEditor"), {
  ssr: false,
})

export default function NewArticlePage() {
  const [title, setTitle] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.size <= 10 * 1024 * 1024) {
      setImage(file)
    } else {
      alert("Ukuran gambar maksimum 10MB")
    }
  }

  const handleSubmit = async () => {
    if (!title || !content) {
      alert("Judul dan konten tidak boleh kosong.")
      return
    }

    setLoading(true)

    try {
      // 1. Get user UUID from token
      const userRes = await fetch("http://localhost:5000/api/user/me", { credentials: "include" })
      const userData = await userRes.json()
      const userId = userData.user_id

      // 2. Compress & upload image
      let imageUrl = ""
      if (image) {
        const compressedFile = await imageCompression(image, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1280,
          useWebWorker: true,
        })

        const formData = new FormData()
        formData.append("image", compressedFile)

        const uploadRes = await fetch("http://localhost:5000/api/article/upload", {
          method: "POST",
          credentials: "include",
          body: formData,
        })
        const uploadData = await uploadRes.json()
        imageUrl = uploadData.url
      }

      // 3. Get Jakarta time
      const timestamp = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")

      // 4. Submit article
      await fetch("http://localhost:5000/api/article", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
         },
        body: JSON.stringify({
          title,
          content,
          timestamp: timestamp,
          user_id: userId,
          photo: imageUrl,
        }),
        credentials: "include",
      })

      console.log("Payload:", {
        title,
        content,
        timestamp,
        user_id: userId,
        photo: imageUrl,
      })      

      alert("Artikel berhasil disimpan!")
      // router.push("/admin/article")
    } catch (err) {
      console.error("Gagal simpan:", err)
      alert("Terjadi kesalahan saat menyimpan artikel.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Buat Artikel Baru</h1>

      {/* Input Judul */}
      <div className="flex flex-col space-y-1">
        <label htmlFor="title" className="font-semibold">Judul Artikel</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Masukkan judul artikel"
        />
      </div>

      {/* Upload Gambar */}
      <div className="flex flex-col space-y-1">
        <label htmlFor="image" className="font-semibold">Upload Gambar</label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file:border file:px-4 file:py-2 file:rounded-md file:bg-blue-500 file:text-white"
        />
        {image && (
          <p className="text-sm text-gray-600 mt-1">Gambar terpilih: {image.name}</p>
        )}
      </div>

      {/* Editor */}
      <ArticleEditor onChange={setContent} value={content} />

      {/* Tombol Simpan */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md"
      >
        {loading ? "Menyimpan..." : "Simpan Artikel"}
      </button>
    </div>
  )
}
