import cheerio from 'cheerio';
import fetch from 'node-fetch';
import { z } from 'zod';

const ProductSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.string(),
  image: z.string().url(),
});

export async function scrapeAmazonProduct(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    const product = {
      title: $('#productTitle').text().trim(),
      description: $('#feature-bullets').text().trim(),
      price: $('.a-price-whole').first().text().trim(),
      image: $('#landingImage').attr('src') || '',
    };

    const result = ProductSchema.safeParse(product);
    if (!result.success) {
      throw new Error('Failed to parse product data');
    }

    return result.data;
  } catch (error) {
    console.error('Error scraping Amazon product:', error);
    throw new Error('Failed to fetch product data');
  }
}

export function extractAffiliateTag(url: string): string {
  const urlObj = new URL(url);
  return urlObj.searchParams.get('tag') || '';
}