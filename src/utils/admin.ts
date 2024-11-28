import type { Product } from '../lib/supabase';
import { supabase } from '../lib/supabase';

export async function loadProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

export async function addProduct(url: string, category: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      body: JSON.stringify({ affiliateUrl: url, category }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding product:', error);
    return { success: false, error: 'Failed to add product' };
  }
}

export async function deleteProduct(productId: string): Promise<void> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (error) throw error;
}

export async function updateProduct(productId: string, updates: Partial<Product>): Promise<void> {
  const { error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', productId);

  if (error) throw error;
}