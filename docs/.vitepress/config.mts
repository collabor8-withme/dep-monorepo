import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "DepAnlz 📦",
  description: "A CLI for analyzing NPM dependencies",
  themeConfig: {
    logo: "/Collabor8.svg",
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'Docs', link: '/docs/' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is DepAnlz?', link: '/guide/' },
            { text: 'Getting Started', link: '/guide/one' },
          ]
        }
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
