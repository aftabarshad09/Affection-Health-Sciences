// Runs after the client + SSR builds. Renders every known route to static
// HTML using the SSR bundle, then writes each one into dist/ at the path
// Express's static middleware (server/server.js) already expects
// (dist/<route>/index.html), so no backend changes are needed.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const distDir = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')

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

// ── Product pages (SEO): one indexable URL per active product ───────────────
// Source the catalog from the live SQLite DB if present (reflects admin
// edits), else the committed export. Each active product with a slug gets its
// own prerendered /products/<slug> page with product-specific meta + Product
// structured data, so Google can index and rank it.
const optimizedImage = (url, width = 800) => {
  if (!url || typeof url !== 'string') return url
  const marker = '/upload/'
  const i = url.indexOf(marker)
  if (i === -1) return url
  const after = url.slice(i + marker.length)
  if (/^(f_|q_|w_|c_)/.test(after)) return url
  return `${url.slice(0, i + marker.length)}f_auto,q_auto,w_${width}/${after}`
}

function loadActiveProducts() {
  const dbPath = path.join(root, 'server', 'data', 'store.db')
  if (fs.existsSync(dbPath)) {
    try {
      const require = createRequire(import.meta.url)
      const Database = require('better-sqlite3')
      const db = new Database(dbPath, { readonly: true })
      const rows = db.prepare(
        "SELECT name, slug, tagline, card_line, meta_title, meta_description, retail_price, sale_price, image, image_a FROM products WHERE commerce_status='active' AND slug IS NOT NULL"
      ).all()
      db.close()
      return rows
    } catch (e) {
      console.warn('⚠️ Could not read store.db for prerender, falling back to export:', e.message)
    }
  }
  const exp = path.join(root, 'server', 'data', 'supabase-export.json')
  if (fs.existsSync(exp)) {
    const data = JSON.parse(fs.readFileSync(exp, 'utf-8'))
    return (data.products || [])
      .filter((p) => p.commerce_status === 'active' && p.slug)
      .map((p) => ({
        name: p.name, slug: p.slug, tagline: p.tagline, card_line: p.card_line,
        meta_title: p.meta_title, meta_description: p.meta_description,
        retail_price: p.retail_price, sale_price: p.sale_price, image: p.image, image_a: p.image_a,
      }))
  }
  return []
}

const activeProducts = loadActiveProducts()

const productPages = {}
for (const p of activeProducts) {
  productPages[`/products/${p.slug}`] = {
    title: p.meta_title || `${p.name} | Affection Health Sciences`,
    description: p.meta_description || p.tagline || p.card_line || `${p.name} — clinical-grade nutrition from Affection Health Sciences.`,
    product: p,
  }
}

const pageMeta = { ...staticPages, ...productPages }
const routes = Object.keys(pageMeta)

const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8')

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// The body of every /products/* page is the same catalog shell (the product
// modal is opened client-side after hydration) — render it once and reuse.
const productsBodyHtml = render('/products')

function productJsonLd(p, canonical) {
  const price = p.sale_price ?? p.retail_price ?? null
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: (p.meta_description || p.tagline || p.card_line || '').toString(),
    url: canonical,
    brand: { '@type': 'Brand', name: 'Affection Health Sciences' },
  }
  const img = optimizedImage(p.image || p.image_a, 800)
  if (img) ld.image = img
  if (price) {
    ld.offers = {
      '@type': 'Offer', price: String(price), priceCurrency: 'PKR',
      availability: 'https://schema.org/InStock', url: canonical,
    }
  }
  return JSON.stringify(ld).replace(/</g, '\\u003c')
}

for (const url of routes) {
  const meta = pageMeta[url]
  const isProduct = !!meta.product
  const appHtml = isProduct ? productsBodyHtml : render(url)
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

  if (isProduct) {
    pageHtml = pageHtml.replace('</head>', `  <script type="application/ld+json">${productJsonLd(meta.product, canonical)}</script>\n  </head>`)
  }

  const outPath = url === '/' ? path.join(distDir, 'index.html') : path.join(distDir, url, 'index.html')
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, pageHtml)
}
console.log(`prerendered ${Object.keys(staticPages).length} static pages + ${activeProducts.length} product pages`)

// ── Sitemap: keep existing entries, refresh the /products/* ones ────────────
const sitemapPath = path.join(root, 'public', 'sitemap.xml')
try {
  const existing = fs.readFileSync(sitemapPath, 'utf-8')
  const keptBlocks = [...existing.matchAll(/<url>[\s\S]*?<\/url>/g)]
    .map((m) => m[0])
    .filter((b) => !new RegExp(`<loc>${SITE_URL}/products/[^<]+</loc>`).test(b))
  const productBlocks = activeProducts.map(
    (p) => `  <url>\n    <loc>${SITE_URL}/products/${p.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`
  )
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...keptBlocks, ...productBlocks].join('\n')}\n</urlset>\n`
  fs.writeFileSync(sitemapPath, sitemap)
  const distSitemap = path.join(distDir, 'sitemap.xml')
  if (fs.existsSync(distSitemap)) fs.writeFileSync(distSitemap, sitemap)
  console.log(`✅ sitemap.xml: ${keptBlocks.length} existing + ${productBlocks.length} product URLs`)
} catch (e) {
  console.warn('⚠️ Could not update sitemap:', e.message)
}

fs.rmSync(ssrDir, { recursive: true, force: true })
