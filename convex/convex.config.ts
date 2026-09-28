import { defineApp } from "convex/server";
import { v } from "convex/values";

const app = defineApp({
  env: {
    META_PAGE_ACCESS_TOKEN: v.string(),
    IG_PAGE_ACCESS_TOKEN: v.string(),
  },
});

export default app;
