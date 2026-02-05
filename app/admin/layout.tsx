import { AdminSidebar } from '@/components/admin-sidebar';
import { AdminNavbar } from '@/components/admin-navbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <AdminNavbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <div className="flex-1 space-y-4 p-8 pt-6">
          {children}
        </div>
      </div>
    </div>
  );
}
