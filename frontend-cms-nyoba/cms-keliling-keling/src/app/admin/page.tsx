import AdminHeader from "@/components/admin/AdminHeader"

const mockUser = {
    name: "Nadia Lee",
}

export default function AdminDashboardPage() {
    return (
    <div>
    <AdminHeader user={mockUser} />
    <h1 className="text-2xl font-semibold">Welcome to Admin Dashboard</h1>
    </div>
    
  )}
  