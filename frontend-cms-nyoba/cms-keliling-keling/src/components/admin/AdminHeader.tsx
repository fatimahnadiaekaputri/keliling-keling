"use client"

import { useState } from "react"
import { ChevronDown, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type User = {
  name: string
}

export default function AdminHeader({ user }: { user: User }) {
  return (
    <header className="w-full justify-items-end bg-white px-6 py-3 shadow-md">

      {/* Kanan - User Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center space-x-2 cursor-pointer">
          <User className="w-5 h-5 text-gray-700" />
          <span className="text-gray-800 font-medium">{user.name}</span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="mt-2">
          <DropdownMenuItem onClick={() => console.log("Settings clicked")}>
            Pengaturan
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log("Logout clicked")}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
