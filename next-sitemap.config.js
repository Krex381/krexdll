/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://krex38.xyz',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      'https://krex38.xyz/sitemap.xml',
    ],
  },
  exclude: ['/404'],
  generateIndexSitemap: false,
  changefreq: 'weekly',
  priority: 1.0,
  lastmod: new Date().toISOString(),
  transform: async (config, path) => {
    // Custom transform function to set priority based on path
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
      priority: priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
