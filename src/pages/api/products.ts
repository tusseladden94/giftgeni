import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import { scrapeAmazonProduct, extractAffiliateTag } from '../../lib/amazon';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { affiliateUrl, category } = await request.json();

    // Extract product ID and affiliate tag
    const affiliateTag = extractAffiliateTag(affiliateUrl);
    
    // Scrape product data
    const productData = await scrapeAmazonProduct(affiliateUrl);

    // Insert into Supabase
    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          title: productData.title,
          description: productData.description,
          price: productData.price,
          image: productData.image,
          url: affiliateUrl,
          category,
          affiliate_tag: affiliateTag,
          is_visible: false
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return new Response(JSON.stringify({ success: true, product: data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error adding product:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to add product' 
      }), 
      { status: 500 }
    );
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const { id, is_visible } = await request.json();

    const { error } = await supabase
      .from('products')
      .update({ is_visible })
      .eq('id', id);

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to update product' }), 
      { status: 500 }
    );
  }
};