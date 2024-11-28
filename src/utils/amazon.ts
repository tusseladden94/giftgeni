export interface Product {
  id: string;
  title: string;
  price: string;
  image: string;
  url: string;
  category: string;
}

export function extractProductId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    
    // Handle different Amazon URL formats
    const patterns = [
      /\/dp\/([A-Z0-9]{10})/i,
      /\/gp\/product\/([A-Z0-9]{10})/i,
      /\/exec\/obidos\/asin\/([A-Z0-9]{10})/i,
      /\/([A-Z0-9]{10})(?:[/?]|$)/i
    ];

    for (const pattern of patterns) {
      const match = urlObj.pathname.match(pattern);
      if (match) return match[1];
    }

    // Try to get from query parameters
    const asin = urlObj.searchParams.get('asin');
    if (asin && /^[A-Z0-9]{10}$/i.test(asin)) return asin;

    return null;
  } catch (error) {
    console.error('Failed to parse URL:', error);
    return null;
  }
}

export function isValidAffiliateUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const isAmazon = urlObj.hostname.includes('amazon.');
    const hasTag = urlObj.searchParams.has('tag') || url.includes('tag=');
    const hasProductId = !!extractProductId(url);

    return isAmazon && hasTag && hasProductId;
  } catch {
    return false;
  }
}

export function extractAffiliateTag(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('tag') || null;
  } catch {
    return null;
  }
}