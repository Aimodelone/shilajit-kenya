/**
 * components/admin/resources.js
 * Config objects for ResourceManager — one per CRUD section.
 *
 * Each config:
 *   apiBase    string   — /api/admin/{resource}
 *   type       string   — for POST /api/admin/revalidate { type }
 *   label      string   — plural label for headings
 *   single     string   — singular label
 *   viewBase   string   — public URL prefix for "View on site"
 *   getSlug    fn       — extract slug from item (for view link + revalidate)
 *   cardTitle  fn(item) — primary card text
 *   cardSub    fn(item) — secondary card text
 *   cardImage  fn(item) — { url, alt } | null
 *   cardBadges fn(item) — array of { label, style }
 *   fields     array    — form field configs
 *
 * Field types: text | textarea | number | checkbox | image | images | strings | tags | date
 */

export const PRODUCTS = {
  apiBase:   '/api/admin/products',
  type:      'product',
  label:     'Products',
  single:    'Product',
  viewBase:  '/products',
  getSlug:   (item) => item.slug,
  cardTitle: (item) => item.name,
  cardSub:   (item) => item.price != null ? `KES ${Number(item.price).toLocaleString()}` : '',
  cardImage: (item) => item.coverImage || null,
  cardBadges: (item) => [
    { label: item.published ? 'Published' : 'Draft', style: item.published ? 'pillGreen' : 'pillGray' },
    item.featured  && { label: 'Featured',    style: 'pillBlue' },
    item.inStock === false && { label: 'Out of stock', style: 'pillRed' },
  ].filter(Boolean),
  fields: [
    { key: 'name',             label: 'Name',                  type: 'text',     required: true },
    { key: 'slug',             label: 'Slug',                  type: 'text',     slugField: true },
    { key: 'shortDescription', label: 'Short description',     type: 'textarea', required: true, maxLength: 300 },
    { key: 'description',      label: 'Description',           type: 'textarea', hint: 'Supports Markdown (## heading, **bold**, - list)' },
    { key: 'price',            label: 'Price (KES)',           type: 'number',   required: true },
    { key: 'compareAtPrice',   label: 'Compare-at price (KES)',type: 'number' },
    { key: 'coverImage',       label: 'Cover image',           type: 'image',    section: 'products' },
    { key: 'images',           label: 'Gallery images',        type: 'images',   section: 'products' },
    { key: 'benefits',         label: 'Key benefits',          type: 'strings',  hint: 'One benefit per line' },
    { key: 'howToUse',         label: 'How to use',            type: 'textarea' },
    { key: 'ingredients',      label: 'Ingredients',           type: 'textarea' },
    { key: 'certificates',     label: 'Certificates',          type: 'images',   section: 'products' },
    { key: 'inStock',          label: 'In stock',              type: 'checkbox', defaultValue: true },
    { key: 'featured',         label: 'Featured',              type: 'checkbox' },
    { key: 'published',        label: 'Published',             type: 'checkbox', defaultValue: true },
    { key: 'order',            label: 'Display order',         type: 'number' },
    { key: 'seoTitle',         label: 'SEO title',             type: 'text',     maxLength: 70 },
    { key: 'seoDescription',   label: 'SEO description',       type: 'textarea', maxLength: 170 },
  ],
};

export const BENEFITS = {
  apiBase:   '/api/admin/benefits',
  type:      'benefit',
  label:     'Benefits',
  single:    'Benefit',
  viewBase:  '/benefits',
  getSlug:   (item) => item.slug,
  cardTitle: (item) => item.title,
  cardSub:   (item) => item.shortDescription?.slice(0, 80) || '',
  cardImage: (item) => item.image || null,
  cardBadges: (item) => [
    { label: item.published ? 'Published' : 'Draft', style: item.published ? 'pillGreen' : 'pillGray' },
  ].filter(Boolean),
  fields: [
    { key: 'title',            label: 'Title',           type: 'text',     required: true },
    { key: 'slug',             label: 'Slug',            type: 'text',     slugField: true },
    { key: 'shortDescription', label: 'Short description', type: 'textarea', maxLength: 300 },
    { key: 'content',          label: 'Content',         type: 'textarea', hint: 'Supports Markdown' },
    { key: 'image',            label: 'Image',           type: 'image',    section: 'benefits' },
    { key: 'published',        label: 'Published',       type: 'checkbox', defaultValue: true },
    { key: 'order',            label: 'Display order',   type: 'number' },
    { key: 'seoTitle',         label: 'SEO title',       type: 'text',     maxLength: 70 },
    { key: 'seoDescription',   label: 'SEO description', type: 'textarea', maxLength: 170 },
  ],
};

export const BLOG = {
  apiBase:   '/api/admin/blog',
  type:      'blog',
  label:     'Blog Posts',
  single:    'Post',
  viewBase:  '/blog',
  getSlug:   (item) => item.slug,
  cardTitle: (item) => item.title,
  cardSub:   (item) => item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' }) : 'No date',
  cardImage: (item) => item.coverImage || null,
  cardBadges: (item) => [
    { label: item.published ? 'Published' : 'Draft', style: item.published ? 'pillGreen' : 'pillGray' },
    item.category && { label: item.category, style: 'pillBlue' },
  ].filter(Boolean),
  fields: [
    { key: 'title',          label: 'Title',           type: 'text',     required: true },
    { key: 'slug',           label: 'Slug',            type: 'text',     slugField: true },
    { key: 'excerpt',        label: 'Excerpt',         type: 'textarea', maxLength: 300 },
    { key: 'content',        label: 'Content',         type: 'textarea', hint: 'Markdown: ## heading, **bold**, - list item', large: true },
    { key: 'coverImage',     label: 'Cover image',     type: 'image',    section: 'blog' },
    { key: 'author',         label: 'Author',          type: 'text' },
    { key: 'category',       label: 'Category',        type: 'text' },
    { key: 'tags',           label: 'Tags',            type: 'tags',     hint: 'Comma-separated, e.g. health, energy' },
    { key: 'publishedAt',    label: 'Publish date',    type: 'date' },
    { key: 'published',      label: 'Published',       type: 'checkbox', defaultValue: true },
    { key: 'seoTitle',       label: 'SEO title',       type: 'text',     maxLength: 70 },
    { key: 'seoDescription', label: 'SEO description', type: 'textarea', maxLength: 170 },
  ],
};

export const TESTIMONIALS = {
  apiBase:   '/api/admin/testimonials',
  type:      'testimonial',
  label:     'Testimonials',
  single:    'Testimonial',
  viewBase:  '/testimonial',
  getSlug:   () => null,  // testimonials have no individual slug
  cardTitle: (item) => item.name,
  cardSub:   (item) => item.role || '',
  cardImage: (item) => item.photo || null,
  cardBadges: (item) => [
    { label: item.published ? 'Published' : 'Draft', style: item.published ? 'pillGreen' : 'pillGray' },
  ].filter(Boolean),
  fields: [
    { key: 'name',      label: 'Name',      type: 'text',     required: true },
    { key: 'role',      label: 'Role',      type: 'text' },
    { key: 'message',   label: 'Message',   type: 'textarea', maxLength: 1000 },
    { key: 'photo',     label: 'Photo',     type: 'image',    section: 'testimonials' },
    { key: 'published', label: 'Published', type: 'checkbox', defaultValue: true },
    { key: 'order',     label: 'Display order', type: 'number' },
  ],
};

export const FAQS = {
  apiBase:   '/api/admin/faqs',
  type:      'faq',
  label:     'FAQs',
  single:    'FAQ',
  viewBase:  '/faq',
  getSlug:   () => null,
  cardTitle: (item) => item.question,
  cardSub:   (item) => item.category || '',
  cardImage: () => null,
  cardBadges: (item) => [
    { label: item.published ? 'Published' : 'Draft', style: item.published ? 'pillGreen' : 'pillGray' },
    item.category && { label: item.category, style: 'pillBlue' },
  ].filter(Boolean),
  fields: [
    { key: 'question',  label: 'Question',  type: 'text',     maxLength: 300, required: true },
    { key: 'answer',    label: 'Answer',    type: 'textarea', maxLength: 3000, hint: 'Plain text only' },
    { key: 'category',  label: 'Category',  type: 'text' },
    { key: 'published', label: 'Published', type: 'checkbox', defaultValue: true },
    { key: 'order',     label: 'Display order', type: 'number' },
  ],
};
