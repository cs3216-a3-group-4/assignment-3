import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  client: { bundle: true, name: "@hey-api/client-axios" },
  input: `${process.env.NEXT_PUBLIC_BACKEND_URL}/openapi.json`,
  output: "client",
});
