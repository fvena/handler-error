import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/handler-error/",
  description:
    "Handler-Error is a modular and type-safe TypeScript library that simplifies creating and managing custom errors, promoting best practices for large-scale projects.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { link: "/", text: "Home" },
      { link: "/markdown-examples", text: "Examples" },
    ],

    sidebar: [
      {
        items: [
          { link: "/markdown-examples", text: "Markdown Examples" },
          { link: "/api-examples", text: "Runtime API Examples" },
        ],
        text: "Examples",
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/vuejs/vitepress" }],
  },
  title: "Handler Error",
});
