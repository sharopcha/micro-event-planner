import { AddonForm } from '../features/addon-form';
import { getAddon } from '@/lib/actions/addons';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAddonPage({ params }: PageProps) {
  const { id } = await params;
  const addon = await getAddon(id);

  if (!addon) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Edit Addon</h1>
      </div>
      <AddonForm initialData={addon} />
    </div>
  );
}
