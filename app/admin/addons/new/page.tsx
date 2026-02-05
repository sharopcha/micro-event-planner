import { AddonForm } from '../features/addon-form';

export default function NewAddonPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Create Addon</h1>
      </div>
      <AddonForm />
    </div>
  );
}
