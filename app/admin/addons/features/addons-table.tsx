'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { deleteAddon } from '@/lib/actions/addons';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Addon {
  id: string;
  name: string;
  category: string;
  price: number;
  budget_tag: string;
  active: boolean | null;
}

interface AddonsTableProps {
  addons: Addon[];
}

export function AddonsTable({ addons }: AddonsTableProps) {
  const router = useRouter();

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this addon?')) {
      const result = await deleteAddon(id);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Addon deleted');
        router.refresh();
      }
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {addons.map((addon) => (
            <TableRow key={addon.id}>
              <TableCell className="font-medium">{addon.name}</TableCell>
              <TableCell className="capitalize">{addon.category}</TableCell>
              <TableCell>${addon.price}</TableCell>
              <TableCell className="capitalize">{addon.budget_tag}</TableCell>
              <TableCell>
                <Badge variant={addon.active ? 'default' : 'secondary'}>
                  {addon.active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/addons/${addon.id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(addon.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
