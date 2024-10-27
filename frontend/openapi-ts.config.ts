import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  client: { bundle: true, name: "@hey-api/client-axios" },
  input: "http://localhost:8000/openapi.json",
  output: "client",
  exportCore: false,
});
