import * as paypal from "@paypal/checkout-server-sdk";

// Cấu hình PayPal Environment với Client ID và Secret
const clientId = process.env.PAYPAL_CLIENT_ID!;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;

function environment() {
  return new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

function client() {
  return new paypal.core.PayPalHttpClient(environment());
}

export { client, paypal };
