const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const config = JSON.parse(fs.readFileSync(path.join(root, 'site.config.json'), 'utf8'));
const configuredUrl = new URL(config.siteUrl);

if (configuredUrl.protocol !== 'https:' || configuredUrl.username || configuredUrl.password || configuredUrl.search || configuredUrl.hash) {
  throw new Error('siteUrl must be an HTTPS URL without credentials, query parameters, or a fragment.');
}

const baseUrl = `${configuredUrl.origin}${configuredUrl.pathname.replace(/\/+$/, '')}`;
const siteRootPath = `${configuredUrl.pathname.replace(/\/+$/, '')}/`;
const htmlEscape = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
})[character]);
const xmlEscape = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
})[character]);

const updateMetadata = (filename, title, description) => {
  const filepath = path.join(root, filename);
  let html = fs.readFileSync(filepath, 'utf8');
  const titlePattern = /<title data-config="metaTitle">[\s\S]*?<\/title>/;
  const descriptionPattern = /<meta name="description" content="[^"]*" data-config="metaDescription">/;

  if (!titlePattern.test(html) || !descriptionPattern.test(html)) {
    throw new Error(`Expected config-driven title and description hooks in ${filename}.`);
  }

  html = html.replace(titlePattern, `<title data-config="metaTitle">${htmlEscape(title)}</title>`);
  html = html.replace(
    descriptionPattern,
    `<meta name="description" content="${htmlEscape(description)}" data-config="metaDescription">`,
  );
  fs.writeFileSync(filepath, html);
};

updateMetadata('index.html', config.seo.title, config.seo.description);
updateMetadata('privacy.html', config.privacy.title, config.privacy.description);
updateMetadata('404.html', config.seo.notFoundTitle, config.seo.notFoundDescription);

const sitemapUrls = [`${baseUrl}/`, `${baseUrl}/privacy.html`];
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...sitemapUrls.map((url) => `  <url><loc>${xmlEscape(url)}</loc></url>`),
  '</urlset>',
  '',
].join('\n');
fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap);

fs.writeFileSync(path.join(root, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml\n`);

const colors = config.theme.colors;
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="${xmlEscape(colors['green-deep'])}"/><path d="M58 8 24 54h22l-4 38 36-54H55z" fill="${xmlEscape(colors.lime)}"/></svg>\n`;
fs.writeFileSync(path.join(root, 'favicon.svg'), favicon);