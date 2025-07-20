/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://krex38.xyz',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  changefreq: 'weekly',
  priority: 1.0,
  exclude: ['/404', '/500'],
  autoLastmod: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
  transform: async (config, path) => {
    let priority = 0.7;

    if (path === '/') {
      priority = 1.0;
    } else if (path.includes('about') || path.includes('skills')) {
      priority = 0.8;
    } else if (path.includes('contact')) {
      priority = 0.7;
    }

    return {
      loc: path,
      changefreq: config.changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
