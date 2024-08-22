import Medusa from "@medusajs/medusa-js";

// Defaults to standard port for Medusa server
const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

const medusa = new Medusa({ baseUrl: BACKEND_URL, maxRetries: 3 });

export default medusa;
