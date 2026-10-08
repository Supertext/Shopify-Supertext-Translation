-- Supertext code per Shopify locale (JSON), e.g. {"de":"de-CH"}.
ALTER TABLE "ShopSettings" ADD COLUMN "languageCodes" TEXT NOT NULL DEFAULT '{}';
