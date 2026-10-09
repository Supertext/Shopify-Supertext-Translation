import type { LoginError } from "@shopify/shopify-app-react-router/server";
import { LoginErrorType } from "@shopify/shopify-app-react-router/server";
import type { MessageKey } from "../../i18n";

interface LoginErrorMessage {
  shop?: MessageKey;
}

export function loginErrorMessage(loginErrors: LoginError): LoginErrorMessage {
  if (loginErrors?.shop === LoginErrorType.MissingShop) {
    return { shop: "login.missingShop" };
  } else if (loginErrors?.shop === LoginErrorType.InvalidShop) {
    return { shop: "login.invalidShop" };
  }

  return {};
}
