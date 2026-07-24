// Runs after the client + SSR builds. Renders every known route to static
// HTML using the SSR bundle, then writes each one into dist/ at the path
// Express's static middleware (server/server.js) already expects
// (dist/<route>/index.html), so no backend changes are needed.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const distDir = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')

dotenv.config({ path: path.join(root, 'server', '.env') })

// Best-effort: if Supabase isn't reachable at build time, fall back to just
// the hand-authored static pages rather than failing the whole build.
async function fetchActiveProducts() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return []
  try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    const { data, error } = await supabase
      .from('products')
      .select('name, slug, tagline, meta_title, meta_description, commerce_status')
      .eq('commerce_status', 'active')
      .not('slug', 'is', null)
    if (error) throw error
    return data || []
  } catch (err) {
    console.warn('⚠️ Could not fetch products for prerendering (continuing without them):', err.message)
    return []
  }
}

const activeProducts = await fetchActiveProducts()

const { render } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)

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

const productPages = {}
for (const p of activeProducts) {
  productPages[`/products/${p.slug}`] = {
    title: p.meta_title || `${p.name} | Affection Health Sciences`,
    description: p.meta_description || p.tagline || `${p.name} — clinical-grade nutrition from Affection Health Sciences.`,
  }
}

const pageMeta = { ...staticPages, ...productPages }
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

// Regenerate sitemap.xml: keep every existing entry (static pages + the
// hand-maintained blog list) except stale /products/* ones, then add a
// fresh entry per currently-active product so the sitemap tracks the
// catalog instead of going stale the moment a product is added/archived.
const sitemapPath = path.join(root, 'public', 'sitemap.xml')
const existingSitemap = fs.readFileSync(sitemapPath, 'utf-8')
const urlBlocks = [...existingSitemap.matchAll(/<url>[\s\S]*?<\/url>/g)]
  .map((m) => m[0])
  .filter((block) => !new RegExp(`${SITE_URL}/products/[^<]+<`).test(block))

const productUrlBlocks = activeProducts.map(
  (p) => `  <url>\n    <loc>${SITE_URL}/products/${p.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`
)

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...urlBlocks, ...productUrlBlocks].join('\n')}\n</urlset>\n`
fs.writeFileSync(sitemapPath, sitemap)
console.log(`✅ sitemap.xml regenerated (${urlBlocks.length} existing + ${productUrlBlocks.length} product URLs)`)

// public/sitemap.xml is also copied into dist/ during the client build, so
// the already-built copy needs the same refresh or it'll serve the stale one.
const distSitemapPath = path.join(distDir, 'sitemap.xml')
if (fs.existsSync(distSitemapPath)) fs.writeFileSync(distSitemapPath, sitemap)
