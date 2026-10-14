-- "Send version information to Supertext" and the Supertext SDK's reporter state (JSON), per shop.
ALTER TABLE "ShopSettings" ADD COLUMN "versionReports" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "ShopSettings" ADD COLUMN "reporterState" TEXT NOT NULL DEFAULT '';
