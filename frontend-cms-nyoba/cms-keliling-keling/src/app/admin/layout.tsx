'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Boxes, Settings } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar' // ganti sesuai lokasi file kamu

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isActive = (path: string) => pathname.startsWith(path)

  return (
    <SidebarProvider>
      <SidebarTrigger className="fixed left-2 top-2 z-50 md:hidden" />
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <h1 className="text-lg font-bold">Admin Panel</h1>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/admin" passHref>
                <SidebarMenuButton isActive={isActive('/admin')}>
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <Link href="/admin/users" passHref>
                <SidebarMenuButton isActive={isActive('/admin/users')}>
                  <Users />
                  <span>Users</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <Link href="/admin/products" passHref>
                <SidebarMenuButton isActive={isActive('/admin/products')}>
                  <Boxes />
                  <span>Products</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            <SidebarSeparator />

            <SidebarMenuItem>
              <Link href="/admin/settings" passHref>
                <SidebarMenuButton isActive={isActive('/admin/settings')}>
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <p className="text-sm text-muted-foreground">© 2025 Nadia</p>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <main className="p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
