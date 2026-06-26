import { getProducts } from '@/lib/services/productService';

const MONEY_FORMATTER = new Intl.NumberFormat('en-IN');

const formatPrice = (value: any) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'N/A';
  return `₹${MONEY_FORMATTER.format(value)}`;
};

const normalizeText = (value: string) => value.toLowerCase().replace(/\s+/g, ' ').trim();

const tokenize = (value: string) => normalizeText(value)
  .replace(/[^a-z0-9\s₹]/g, ' ')
  .split(' ')
  .filter((token) => token.length > 2);

const getBudgetLimit = (message: string) => {
  const normalized = normalizeText(message).replace(/,/g, '');
  const explicitBudget = normalized.match(/(?:under|below|less than|max|within)\s*₹?\s*(\d{3,7})/i);
  if (explicitBudget?.[1]) return Number(explicitBudget[1]);

  const amountMatch = normalized.match(/₹\s*(\d{3,7})/i) || normalized.match(/\b(\d{4,7})\b/);
  if (amountMatch?.[1] && /budget|under|below|less than|max|within|range|\bphones?\b|\bunder\b/i.test(normalized)) {
    return Number(amountMatch[1]);
  }

  return null;
};

const buildProductLine = (product: any) => {
  const stockLabel = product.inStock ? 'In stock' : 'Out of stock';
  const variantText = product.variants?.length
    ? ` Variants: ${product.variants.slice(0, 2).map((variant: any) => `${variant.ram || ''}/${variant.storage || ''} ${formatPrice(variant.price)}`.trim()).join(', ')}`
    : '';

  return `- ${product.name} (${product.brand}) ${formatPrice(product.price)} · ${stockLabel}${variantText}`;
};

const buildProductReply = (title: string, products: any[], message: string) => {
  if (products.length === 0) {
    return `I couldn’t find a matching product for “${message}”. Try a brand name, model, storage, or budget like “under 20000”.`;
  }

  const lines = products.slice(0, 3).map(buildProductLine);
  return `${title}\n${lines.join('\n')}\n\nIf you want, I can narrow it by brand, budget, or compare two models.`;
};

const buildComparisonReply = (products: any[]) => {
  const [first, second] = products;
  if (!first || !second) {
    return 'I can compare two phones if you mention both models, for example: “compare iPhone 15 and Samsung S24”.';
  }

  return [
    `I found two likely matches:`,
    `- ${first.name} (${first.brand}) ${formatPrice(first.price)}`,
    `- ${second.name} (${second.brand}) ${formatPrice(second.price)}`,
    '',
    'Send the exact two models and I’ll compare price, storage, and availability side by side.'
  ].join('\n');
};

const detectIntent = (message: string) => {
  const normalized = normalizeText(message);

  if (/\b(hi|hello|hey|namaste|yo)\b/.test(normalized)) return 'greeting';
  if (/\b(thanks|thank you|thx|ok|okay)\b/.test(normalized)) return 'thanks';
  if (/\b(compare|vs|versus)\b/.test(normalized)) return 'compare';
  if (/\b(whatsapp|contact|call|support|help|store|address|location)\b/.test(normalized)) return 'contact';
  if (/\b(case|cover|charger|cable|earbuds|headset|screen guard|screen protector|power bank|watch|accessor)/.test(normalized)) return 'accessories';
  if (/\b(stock|available|availability|in stock)\b/.test(normalized)) return 'stock';
  if (/\b(price|cost|rate|how much|for\s+how\s+much)\b/.test(normalized)) return 'price';
  if (/\b(budget|under|below|less than|max|within)\b/.test(normalized) || getBudgetLimit(message)) return 'budget';

  return 'search';
};

const rankProducts = (message: string, allProducts: any[]) => {
  const tokens = tokenize(message);
  const budget = getBudgetLimit(message);
  const normalized = normalizeText(message);

  const scored = allProducts.map((product) => {
    const name = normalizeText(product.name || '');
    const brand = normalizeText(product.brand || '');
    const category = normalizeText(product.category || '');
    const price = typeof product.price === 'number' ? product.price : null;

    let score = 0;
    tokens.forEach((token) => {
      if (name.includes(token)) score += 6;
      if (brand.includes(token)) score += 5;
      if (category.includes(token)) score += 3;
      if ((product.ram || '').toLowerCase().includes(token)) score += 1;
      if ((product.storage || '').toLowerCase().includes(token)) score += 1;
    });

    if (/iphone|apple/.test(normalized) && /iphone|apple/.test(name + ' ' + brand)) score += 8;
    if (/samsung|galaxy/.test(normalized) && /samsung|galaxy/.test(name + ' ' + brand)) score += 8;
    if (/oneplus/.test(normalized) && /oneplus/.test(name + ' ' + brand)) score += 8;
    if (/vivo/.test(normalized) && /vivo/.test(name + ' ' + brand)) score += 8;
    if (/oppo/.test(normalized) && /oppo/.test(name + ' ' + brand)) score += 8;
    if (/realme/.test(normalized) && /realme/.test(name + ' ' + brand)) score += 8;
    if (/motorola/.test(normalized) && /motorola/.test(name + ' ' + brand)) score += 8;
    if (/xiaomi|redmi|mi/.test(normalized) && /xiaomi|redmi|mi/.test(name + ' ' + brand)) score += 8;

    if (budget && price) {
      if (price <= budget) score += 4;
      else score -= 2;
    }

    return {
      product,
      score,
    };
  });

  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || (a.product.price || 0) - (b.product.price || 0))
    .map(({ product }) => product);
};

const buildFallbackReply = (message: string, topResults: any[], intent: string, budgetLimit: number | null) => {
  if (/(hi|hello|hey|namaste|yo)/.test(normalizeText(message))) {
    return 'Namaste! I can help with phone prices, stock, comparisons, and accessories. Try: “iPhone under 80000”, “compare Samsung S24 and iPhone 15”, or “charger for OnePlus”.';
  }

  if (/(thanks|thank you|thx|ok|okay)/.test(normalizeText(message))) {
    return 'Anytime. If you want, send a model or budget and I’ll filter the best options for you.';
  }

  if (intent === 'contact') {
    return 'I can help you find the right product here. If you want to contact the store, open the WhatsApp or call option in the site footer and send me the model name or budget here too.';
  }

  if (intent === 'compare') {
    return buildComparisonReply(topResults);
  }

  if (intent === 'budget') {
    return buildProductReply(
      budgetLimit
        ? `Phones under ₹${MONEY_FORMATTER.format(budgetLimit)}:`
        : 'Budget-friendly options:',
      topResults,
      message
    );
  }

  if (intent === 'accessories') {
    return buildProductReply('Accessory options:', topResults, message);
  }

  if (intent === 'stock') {
    const inStock = topResults.filter((product: any) => product.inStock);
    return buildProductReply('Available now:', inStock.length > 0 ? inStock : topResults, message);
  }

  return buildProductReply('Best matches:', topResults, message);
};

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // First, search the database for relevant products
    const allProducts = await getProducts();
    const rankedProducts = rankProducts(message, allProducts);
    const intent = detectIntent(message);

    const topResults = rankedProducts.slice(0, 5).map((product: any) => ({
      name: product.name,
      brand: product.brand,
      price: product.price,
      ram: product.ram,
      storage: product.storage,
      inStock: product.inStock !== false,
      variants: product.variants?.map((variant: any) => ({
        ram: variant.ram,
        storage: variant.storage,
        price: variant.price
      })) || []
    }));

    const budgetLimit = getBudgetLimit(message);
    const budgetMatches = budgetLimit
      ? topResults.filter((product: any) => typeof product.price === 'number' && product.price <= budgetLimit)
      : topResults;

    const contextLines = (budgetMatches.length > 0 ? budgetMatches : topResults).map((product: any) =>
      `- ${product.name} (${product.brand}) - ${formatPrice(product.price)}${product.variants.length ? `, Variants: ${product.variants.map((variant: any) => `${variant.ram}/${variant.storage} ${formatPrice(variant.price)}`).join(', ')}` : ''} ${product.inStock ? '✅ In Stock' : '❌ Out of Stock'}`
    );

    const productContext = contextLines.length > 0
      ? `Available products matching the query:\n${contextLines.join('\n')}`
      : 'No products found matching this query in the database.';

    const groqKey = process.env.GROQ_API_KEY?.trim();

    if (groqKey) {
      try {
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [
              {
                role: 'system',
                content: `You are Shreeshyam Mobiles' store assistant. Answer naturally in 2-4 short lines. Use ₹ for prices. Be helpful and practical. Never invent products or prices. Use only the catalog context below. If the user asks for comparisons, stock, budget phones, or accessories, answer from the catalog.

${productContext}`
              },
              { role: 'user', content: message }
            ],
            max_tokens: 220,
            temperature: 0.5,
          }),
        });

        if (!groqResponse.ok) {
          // Avoid silent failures
          const errText = await groqResponse.text().catch(() => '');
          console.warn('Groq non-OK response:', groqResponse.status, errText);
        } else {
          const data = await groqResponse.json().catch(() => null as any);
          const reply =
            data?.choices?.[0]?.message?.content ||
            buildFallbackReply(message, budgetMatches.length > 0 ? budgetMatches : topResults, intent, budgetLimit);

          return Response.json({ reply });
        }
      } catch (groqError) {
        console.warn('Groq request failed, using fallback:', groqError);
      }
    } else {
      console.warn('GROQ_API_KEY is missing/empty. Using fallback reply only.');
    }

    return Response.json({
      reply: buildFallbackReply(message, budgetMatches.length > 0 ? budgetMatches : topResults, intent, budgetLimit)
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return Response.json(
      { reply: "Sorry, something went wrong. Please try again or use the site search to find products quickly." },
      { status: 200 }
    );
  }
}
