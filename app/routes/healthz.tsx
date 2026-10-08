/** Health check for Railway: the server is up (no Shopify login needed). */
export const loader = () => new Response("ok", { headers: { "Content-Type": "text/plain" } });
