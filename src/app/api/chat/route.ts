import { getProducts } from '@/lib/services/productService';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // First, search the database for relevant products
    const allProducts = await getProducts();
    const searchTerms = message.toLowerCase().split(' ').filter((t: string) => t.length > 2);
    
    const matches = allProducts.filter((product: any) => {
      const name = (product.name || '').toLowerCase();
      const brand = (product.brand || '').toLowerCase();
      return searchTerms.some((term: string) => name.includes(term) || brand.includes(term));
    });

    const topResults = matches.slice(0, 5).map((p: any) => ({
      name: p.name,
      brand: p.brand,
      price: p.price,
      ram: p.ram,
      storage: p.storage,
      inStock: p.inStock !== false,
      variants: p.variants?.map((v: any) => ({
        ram: v.ram, storage: v.storage, price: v.price
      })) || []
    }));

    const productContext = topResults.length > 0
      ? `Available products matching the query:\n${topResults.map((p: any) => 
          `- ${p.name} (${p.brand}) - ₹${p.price?.toLocaleString('en-IN') || 'N/A'}${p.variants.length ? `, Variants: ${p.variants.map((v: any) => `${v.ram}/${v.storage} ₹${v.price?.toLocaleString('en-IN')}`).join(', ')}` : ''} ${p.inStock ? '✅ In Stock' : '❌ Out of Stock'}`
        ).join('\n')}`
      : 'No products found matching this query in the database.';

    // Call Groq API directly
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3b-instant',
        messages: [
          {
            role: 'system',
            content: `You are Shreeshyam Mobiles AI Assistant. You help customers find mobile phones. 
Be brief (2-3 lines max), friendly, use ₹ for prices. 
DO NOT invent products or prices. Only use the data provided below.
If no products found, say "Sorry, we couldn't find that. Please check our store or WhatsApp us!"

${productContext}`
          },
          { role: 'user', content: message }
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!groqResponse.ok) {
      throw new Error(`Groq API error: ${groqResponse.status}`);
    }

    const data = await groqResponse.json();
    const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not process that. Please try again!';

    return Response.json({ reply });
  } catch (error) {
    console.error("Chat API Error:", error);
    return Response.json(
      { reply: "Sorry, something went wrong. Please try again or WhatsApp us directly! 🙏" },
      { status: 500 }
    );
  }
}
