import { getAddons } from '@/lib/actions/addons';
import { AddonsTable } from './features/addons-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default async function AddonsPage() {
  const addons = await getAddons();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Addons</h1>
        <Button asChild>
          <Link href="/admin/addons/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Link>
        </Button>
      </div>
      <AddonsTable addons={addons} />
    </div>
  );
}
