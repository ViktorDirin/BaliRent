import { defineConfig } from '@prisma/config';

export default defineConfig({
    datasource: {
        //url: "file:./dev.db",
        url: process.env.DATABASE_URL,
    },
});
