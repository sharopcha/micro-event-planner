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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

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
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [budgetFilter, setBudgetFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

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

  const filteredAddons = addons.filter((addon) => {
    const matchCategory = categoryFilter === 'all' || addon.category === categoryFilter;
    const matchBudget = budgetFilter === 'all' || addon.budget_tag === budgetFilter;
    const matchStatus = statusFilter === 'all'
      ? true
      : statusFilter === 'active'
        ? addon.active
        : !addon.active;

    return matchCategory && matchBudget && matchStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="venue">Venue</SelectItem>
            <SelectItem value="food">Food</SelectItem>
            <SelectItem value="drinks">Drinks</SelectItem>
            <SelectItem value="decor">Decor</SelectItem>
            <SelectItem value="music">Music</SelectItem>
            <SelectItem value="photography">Photography</SelectItem>
            <SelectItem value="activities">Activities</SelectItem>
            <SelectItem value="extras">Extras</SelectItem>
          </SelectContent>
        </Select>

        <Select value={budgetFilter} onValueChange={setBudgetFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Budget" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Budgets</SelectItem>
            <SelectItem value="cheap">Cheap</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {(categoryFilter !== 'all' || budgetFilter !== 'all' || statusFilter !== 'all') && (
          <Button
            variant="ghost"
            onClick={() => {
              setCategoryFilter('all');
              setBudgetFilter('all');
              setStatusFilter('all');
            }}
          >
            Reset
          </Button>
        )}
      </div>

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
            {filteredAddons.map((addon) => (
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
            {filteredAddons.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  No addons found matching the filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
