'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { TablesInsert, TablesUpdate } from '@/lib/supabase/types';

import { addonSchema, AddonFormData } from '@/lib/validations/addons';

export async function getAddons() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data, error } = await supabase
    .from('addons')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getAddon(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data, error } = await supabase
    .from('addons')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(error.message);
  }

  return data;
}

export async function createAddon(data: AddonFormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const validatedFields = addonSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  const { error } = await supabase
    .from('addons')
    .insert(validatedFields.data as TablesInsert<'addons'>);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/addons');
  revalidatePath('/create/selection');
  redirect('/admin/addons');
}

export async function updateAddon(id: string, data: AddonFormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const validatedFields = addonSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  const { error } = await supabase
    .from('addons')
    .update(validatedFields.data as TablesUpdate<'addons'>)
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/addons');
  revalidatePath('/create/selection');
  redirect('/admin/addons');
}

export async function deleteAddon(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { error } = await supabase
    .from('addons')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/addons');
}

export async function addAddonToEvent(eventId: string, addonId: string, price: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check if it exists to handle quantity
  const { data: existing } = await supabase
    .from('event_addons')
    .select('id, quantity')
    .eq('event_id', eventId)
    .eq('addon_id', addonId)
    .single();

  if (existing) {
    const newQuantity = (existing.quantity || 1) + 1;
    const { error } = await supabase
      .from('event_addons')
      .update({ quantity: newQuantity })
      .eq('id', existing.id);

    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from('event_addons')
      .insert({
        event_id: eventId,
        addon_id: addonId,
        price_at_purchase: price,
        quantity: 1,
      });

    if (error) throw new Error(error.message);
  }

  revalidatePath(`/create/selection`);
}

export async function removeAddonFromEvent(eventId: string, addonId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: existing } = await supabase
    .from('event_addons')
    .select('id, quantity')
    .eq('event_id', eventId)
    .eq('addon_id', addonId)
    .single();

  if (existing) {
    if (existing.quantity && existing.quantity > 1) {
      const { error } = await supabase
        .from('event_addons')
        .update({ quantity: existing.quantity - 1 })
        .eq('id', existing.id);

      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from('event_addons')
        .delete()
        .eq('id', existing.id);

      if (error) throw new Error(error.message);
    }
  }

  revalidatePath(`/create/selection`);
}

export async function getEventAddons(eventId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data, error } = await supabase
    .from('event_addons')
    .select(`
      addon_id,
      quantity,
      price_at_purchase,
      addons (
        id,
        name,
        price,
        category
      )
    `)
    .eq('event_id', eventId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
