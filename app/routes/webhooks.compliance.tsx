import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

/**
 * Shopify's mandatory privacy webhooks. The app stores no customer data, so
 * customer requests need no action; shop/redact (48 hours after uninstall)
 * deletes everything the app kept for the shop.
 */
export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, topic } = await authenticate.webhook(request);
  console.log(`[supertext] received ${topic} webhook for ${shop}`);

  if (topic === "SHOP_REDACT") {
    await db.translationJob.deleteMany({ where: { shop } });
    await db.shopSettings.deleteMany({ where: { shop } });
    await db.session.deleteMany({ where: { shop } });
  }
  return new Response();
};
