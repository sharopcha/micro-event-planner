'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

export function AdminNavbar() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error signing out');
    } else {
      router.push('/login');
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Link href="/admin/addons" className="text-xl font-bold tracking-tight">
          MicroPlanner Admin
        </Link>
      </div>
      <div>
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </nav>
  );
}
