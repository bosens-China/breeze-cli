module.exports = {
  title: 'Hello Breeze',
  description: '简化流程的开发工具',
  base: process.env.NODE_ENV === 'production' ? '/breeze-cli/' : '/',
  head: [['link', { rel: 'icon', href: '/favicon.png' }]],
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/introduce' },
      { text: '配置介绍', link: '/config/' },
      { text: 'Github', link: 'https://github.com/bosens-China/breeze-cli' },
    ],
    smoothScroll: true,
    displayAllHeaders: true,
    sidebar: {
      '/config/': [
        {
          title: '配置介绍',
          path: '',
          collapsable: false,
          sidebarDepth: 2,
        },
      ],

      '/guide/': [
        {
          title: '介绍',
          path: 'introduce',
        },
        {
          title: '快速上手',
          path: 'started',
        },
        {
          title: '开发',
          collapsable: false,
          sidebarDepth: 2,
          children: [
            {
              title: '浏览器兼容性',
              path: 'compatible',
            },
            {
              title: 'HTML 和静态资源',
              path: 'resources',
            },
            {
              title: '内联资源的处理',
              path: 'inline',
            },
            {
              title: 'Q&A',
              path: 'careful',
            },
          ],
        },

        {
          title: '流程图',
          path: 'framework',
          collapsable: false,
          sidebarDepth: 2,
        },
      ],
    },
  },
};
