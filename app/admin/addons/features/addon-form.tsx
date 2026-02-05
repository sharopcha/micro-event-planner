'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addonSchema, AddonFormData } from '@/lib/validations/addons';
import { createAddon, updateAddon } from '@/lib/actions/addons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Tables } from '@/lib/supabase/types';

interface AddonFormProps {
  initialData?: Tables<'addons'>;
}

const CATEGORIES = ['venue', 'food', 'drinks', 'decor', 'music', 'photography', 'activities', 'extras'];
const BUDGET_TAGS = ['cheap', 'standard', 'premium'];
const EVENT_TYPES = ['baby_shower', 'birthday_party', 'picnic', 'proposal'] as const;

export function AddonForm({ initialData }: AddonFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(addonSchema),
    defaultValues: {
      name: initialData?.name || '',
      category: (initialData?.category as any) || 'venue',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      budget_tag: (initialData?.budget_tag as any) || 'standard',
      compatible_event_types: (initialData?.compatible_event_types as any) || [],
      active: initialData?.active ?? true,
      image_url: initialData?.image_url || '',
    },
  });

  async function onSubmit(data: AddonFormData) {
    setLoading(true);
    try {
      if (initialData) {
        const result = await updateAddon(initialData.id, data);
        if (result?.error) {
          toast.error(result.error);
        } else {
          toast.success('Addon updated successfully');
        }
      } else {
        const result = await createAddon(data);
        if (result?.error) {
          toast.error(result.error);
        } else {
          toast.success('Addon created successfully');
        }
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Addon Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat} className="capitalize">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="budget_tag"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget Tag</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a budget tag" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {BUDGET_TAGS.map((tag) => (
                      <SelectItem key={tag} value={tag} className="capitalize">
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} value={field.value as number} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description of the addon" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="compatible_event_types"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Compatible Event Types</FormLabel>
                <FormDescription>
                  Select the event types this addon is suitable for.
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {EVENT_TYPES.map((type) => (
                  <FormField
                    key={type}
                    control={form.control}
                    name="compatible_event_types"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={type}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(type)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, type])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== type
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            {type.replace('_', ' ')}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active</FormLabel>
                <FormDescription>
                  Active addons will be visible to users.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : initialData ? 'Update Addon' : 'Create Addon'}
        </Button>
      </form>
    </Form>
  );
}
