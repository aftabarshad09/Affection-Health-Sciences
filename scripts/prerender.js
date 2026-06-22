// Runs after the client + SSR builds. Renders every known route to static
// HTML using the SSR bundle, then writes each one into dist/ at the path
// Express's static middleware (server/server.js) already expects
// (dist/<route>/index.html), so no backend changes are needed.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const distDir = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')

const { render } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)
const { blogArticles } = await import(pathToFileURL(path.join(root, 'src/data/seed.js')).href)

const SITE_URL = 'https://www.affectionhealthsciences.com'

const staticPages = {
  '/': {
    title: 'Affection Health Sciences | Clinical-Grade Nutrition Supplements',
    description:
      'Research-led nutrition and wellness supplements for hepatic, maternal, pediatric, and immune health — third-party tested, clinician-reviewed, made in Pakistan.',
  },
  '/products': {
    title: 'Our Products | Affection Health Sciences',
    description: 'Clinical-grade nutrition supplements for every life stage, from hepatic and maternal health to pediatric and immune support.',
  },
  '/blogs': {
    title: 'Wellness Blogs | Affection Health Sciences',
    description: 'Research-backed insights on hepatic, maternal, pediatric, and immune health nutrition from the Affection Health Sciences team.',
  },
  '/careers': {
    title: 'Careers | Affection Health Sciences',
    description: 'Join Affection Health Sciences and represent clinical-grade nutrition products that improve lives.',
  },
  '/contact': {
    title: 'Contact Us | Affection Health Sciences',
    description: 'Get in touch with Affection Health Sciences for product, partnership, or support inquiries.',
  },
  '/review': {
    title: 'Customer Reviews | Affection Health Sciences',
    description: 'See what customers are saying about Affection Health Sciences supplements.',
  },
  '/about': {
    title: 'Who We Are | Affection Health Sciences',
    description: 'Built on science, carried by people — learn about the team behind Affection Health Sciences.',
  },
  '/privacy': {
    title: 'Privacy Policy | Affection Health Sciences',
    description: 'Read the Affection Health Sciences privacy policy.',
  },
  '/terms': {
    title: 'Terms & Conditions | Affection Health Sciences',
    description: 'Read the Affection Health Sciences terms and conditions.',
  },
}

const blogPages = Object.fromEntries(
  blogArticles.map((post) => [
    `/blog/${post.slug}`,
    { title: `${post.title} | Affection Health Sciences`, description: post.metaDescription },
  ])
)

const pageMeta = { ...staticPages, ...blogPages }
const routes = Object.keys(pageMeta)

const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8')

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

for (const url of routes) {
  const appHtml = render(url)
  const meta = pageMeta[url]
  const canonical = `${SITE_URL}${url === '/' ? '/' : url}`

  let pageHtml = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
  pageHtml = pageHtml
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(meta.title)}</title>`)
    .replace(/<meta\s+name="description"\s+content=".*?"\s*\/>/s, `<meta name="description" content="${escapeHtml(meta.description)}" />`)
    .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${escapeHtml(meta.title)}" />`)
    .replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/>/s, `<meta property="og:description" content="${escapeHtml(meta.description)}" />`)
    .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`)
    .replace(/<meta\s+name="twitter:description"\s+content=".*?"\s*\/>/s, `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`)

  const outPath = url === '/' ? path.join(distDir, 'index.html') : path.join(distDir, url, 'index.html')
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, pageHtml)
  console.log(`prerendered ${url} -> ${path.relative(root, outPath)}`)
}

fs.rmSync(ssrDir, { recursive: true, force: true })
