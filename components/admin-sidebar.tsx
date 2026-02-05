import Link from 'next/link';
import { LayoutDashboard, Package, Settings, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function AdminSidebar() {
  return (
    <div className="pb-12 w-64 border-r min-h-screen bg-muted/40 hidden md:block">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Admin
          </h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/admin/addons">
                <Package className="mr-2 h-4 w-4" />
                Addons
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/admin/users">
                <Users className="mr-2 h-4 w-4" />
                Users
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" disabled>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Events (Coming Soon)
            </Button>
            <Button variant="ghost" className="w-full justify-start" disabled>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
