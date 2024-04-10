import { defineConfig } from "vitepress"

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "superdrop",
  vite: {
    resolve: {
      alias: {
        vue: "vue/dist/vue.esm-bundler",
      },
    },
  },
  description: "a versatile drag & drop js library",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Docs", link: "/getting-started" },
    ],

    sidebar: [
      { text: "Getting Started", link: "/getting-started" },
      {
        text: "Examples",
        items: [
          { text: "List", link: "/vertical-list" },
          { text: "Tree", link: "/tree" },
          { text: "Grid", link: "/grid" },
          { text: "Horizontal List", link: "/horizontal-list" },
          { text: "Ghost Image", link: "/ghost-image" },
          { text: "Custom Drag Image", link: "/drag-image" },
          { text: "Autoscroll", link: "/autoscroll" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
})
