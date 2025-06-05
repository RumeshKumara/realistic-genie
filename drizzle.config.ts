import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql",
    schema: "./utils/schema.ts",
    out: "./drizzle",
    dbCredentials: {
        url: 'postgresql://neondb_owner:npg_feyZJ2ITnSb3@ep-still-fire-a8vrrarp-pooler.eastus2.azure.neon.tech/neondb?sslmode=require',
    }
});