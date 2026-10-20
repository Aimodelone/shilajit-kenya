'use strict';
/**
 * scripts/seed-content.js — CommonJS
 * Seeds Products, Benefits, BlogPosts, Testimonials, FAQs, and SiteSettings
 * from existing static site data. Safe to re-run (upsert by slug/key).
 *
 * Run:  node --env-file=.env.local scripts/seed-content.js
 */

const mongoose = require('mongoose');

// ── Models ────────────────────────────────────────────────────────────────────
const Product     = require('../models/Product');
const Benefit     = require('../models/Benefit');
const BlogPost    = require('../models/BlogPost');
const Testimonial = require('../models/Testimonial');
const FAQ         = require('../models/Faq');
const SiteSettings = require('../models/SiteSettings');

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set');
  await mongoose.connect(uri, { bufferCommands: false });
  console.log('Connected to MongoDB');

  // ── 1. Products ─────────────────────────────────────────────────────────────
  // shortDescription: taken from the corresponding blog post contentIntro (real
  //   site text) where available; 8-in-1 uses the hero subtext.
  // description, howToUse, ingredients, seoTitle, seoDescription: no existing
  //   text on the product detail pages (all Lorem Ipsum / placeholder) → left
  //   empty. See report for empty-field list.
  const products = [
    {
      slug: 'shilajit-resin',
      name: 'Shilajit Resin',
      shortDescription: 'Shilajit is a natural resin found in the Himalayas, known for boosting energy, supporting immunity, and enhancing overall wellness.',
      price: 3900,
      coverImage: { url: '/images/team/1.jpg', alt: 'Shilajit Resin' },
      images: [{ url: '/images/team/single/img-1.jpg', alt: 'Shilajit Resin' }],
      certificates: [
        { url: '/images/certificates/1.jpg', alt: 'Certificate 1' },
        { url: '/images/certificates/2.jpg', alt: 'Certificate 2' },
        { url: '/images/certificates/3.jpg', alt: 'Certificate 3' },
        { url: '/images/certificates/4.jpg', alt: 'Certificate 4' },
      ],
      order: 1, published: true, featured: true, inStock: true,
    },
    {
      slug: 'shilajit-capsules',
      name: 'Shilajit Capsules',
      shortDescription: 'Shilajit capsules offer a modern, convenient way to enjoy the benefits of Himalayan Shilajit for energy, immunity, and vitality.',
      price: 4500,
      coverImage: { url: '/images/team/2.jpg', alt: 'Shilajit Capsules' },
      images: [{ url: '/images/team/single/img-2.jpg', alt: 'Shilajit Capsules' }],
      certificates: [
        { url: '/images/certificates/1.jpg', alt: 'Certificate 1' },
        { url: '/images/certificates/3.jpg', alt: 'Certificate 3' },
      ],
      order: 2, published: true, featured: true, inStock: true,
    },
    {
      slug: 'shilajit-gummies',
      name: 'Shilajit Gummies',
      shortDescription: 'Shilajit gummies provide a tasty and convenient way to support immunity, boost energy, and improve overall wellness.',
      price: 3000,
      coverImage: { url: '/images/team/3.jpg', alt: 'Shilajit Gummies' },
      images: [{ url: '/images/team/single/img-3.jpg', alt: 'Shilajit Gummies' }],
      certificates: [
        { url: '/images/certificates/2.jpg', alt: 'Certificate 2' },
        { url: '/images/certificates/4.jpg', alt: 'Certificate 4' },
      ],
      order: 3, published: true, featured: true, inStock: true,
    },
    {
      slug: 'shilajit-8-in-1-capsules',
      name: 'Shilajit 8-in-1 Capsules',
      // No product-specific text on the site; uses hero description.
      shortDescription: 'Experience the ancient natural supplement Shilajit — packed with minerals and fulvic acid to boost stamina, focus, and overall wellness every day.',
      price: 5000,
      coverImage: { url: '/images/team/4.jpg', alt: 'Shilajit 8-in-1 Capsules' },
      images: [{ url: '/images/team/single/img-4.jpg', alt: 'Shilajit 8-in-1 Capsules' }],
      certificates: [
        { url: '/images/certificates/1.jpg', alt: 'Certificate 1' },
        { url: '/images/certificates/2.jpg', alt: 'Certificate 2' },
        { url: '/images/certificates/3.jpg', alt: 'Certificate 3' },
      ],
      order: 4, published: true, featured: true, inStock: true,
    },
  ];

  let productCount = 0;
  for (const p of products) {
    const { slug, ...fields } = p;
    await Product.updateOne(
      { slug },
      { $set: fields, $setOnInsert: { slug } },
      { upsert: true }
    );
    productCount++;
  }
  console.log(`Products upserted: ${productCount}`);

  // ── 2. Benefits (first 5 from api/service.js) ────────────────────────────────
  const benefits = [
    {
      slug: 'boosts-energy-and-vitality',
      title: 'Boosts Energy and Vitality',
      shortDescription: 'Shilajit helps increase stamina, reduce fatigue, and keep you feeling energized all day.',
      content: 'Rich in minerals and fulvic acid, it restores strength naturally.\n\nIdeal for anyone seeking a natural boost in daily performance.',
      image: { url: '/images/service-single/img-1.jpg', alt: 'Boosts Energy and Vitality' },
      order: 1, published: true,
    },
    {
      slug: 'enhances-mental-clarity',
      title: 'Enhances Mental Clarity',
      shortDescription: 'Supports brain function by improving focus, memory, and concentration.',
      content: 'Helps reduce brain fog and promotes better cognitive health.\n\nA natural way to stay mentally sharp and alert.',
      image: { url: '/images/service-single/img-2.jpg', alt: 'Enhances Mental Clarity' },
      order: 2, published: true,
    },
    {
      slug: 'strengthens-immunity',
      title: 'Strengthens Immunity',
      shortDescription: "Packed with antioxidants that boost the body's natural defenses.",
      content: 'Helps you recover faster and stay resilient against infections.\n\nSupports a healthy immune system year-round.',
      image: { url: '/images/service-single/img-3.jpg', alt: 'Strengthens Immunity' },
      order: 3, published: true,
    },
    {
      slug: 'improves-physical-performance',
      title: 'Improves Physical Performance',
      shortDescription: 'Enhances oxygen delivery to muscles for better endurance.',
      content: 'Aids in muscle recovery and reduces post-workout fatigue.\n\nPerfect for active and athletic lifestyles.',
      image: { url: '/images/service-single/img-4.jpg', alt: 'Improves Physical Performance' },
      order: 4, published: true,
    },
    {
      slug: 'promotes-hormonal-balance',
      title: 'Promotes Hormonal Balance',
      shortDescription: 'Supports healthy hormone function and reproductive wellness.',
      content: 'May improve vitality, fertility, and overall hormonal health.\n\nA natural tonic for long-term balance and wellness.',
      image: { url: '/images/service-single/img-2.jpg', alt: 'Promotes Hormonal Balance' },
      order: 5, published: true,
    },
  ];

  let benefitCount = 0;
  for (const b of benefits) {
    const { slug, ...fields } = b;
    await Benefit.updateOne(
      { slug },
      { $set: fields, $setOnInsert: { slug } },
      { upsert: true }
    );
    benefitCount++;
  }
  console.log(`Benefits upserted: ${benefitCount}`);

  // ── 3. Blog posts ──────────────────────────────────────────────────────────
  const blogPosts = [
    {
      slug: 'shilajit-resin-energy-booster',
      title: "Shilajit Resin: Nature's Energy Booster",
      excerpt: 'Discover the benefits of pure Himalayan Shilajit Resin for energy, immunity, and vitality.',
      content: [
        'Shilajit is a natural resin found in the Himalayas, known for boosting energy, supporting immunity, and enhancing overall wellness.',
        '',
        'Rich in fulvic acid and minerals, Shilajit improves physical performance and mental clarity.',
        'Daily intake can support stamina, vitality, and recovery from fatigue.',
        'Traditional medicine has used Shilajit for centuries to promote longevity and general well-being.',
        '',
        '**Key Points:**',
        '- Boosts natural energy and endurance.',
        '- Supports cognitive function and focus.',
        '- Strengthens immune system and vitality.',
        '',
        'Incorporating Shilajit into your daily routine can significantly improve your health, energy levels, and overall wellness.',
      ].join('\n'),
      coverImage: { url: '/images/blog/img-1.jpg', alt: "Shilajit Resin: Nature's Energy Booster" },
      author: 'Anne William',
      publishedAt: new Date('2025-08-01'),
      published: true,
    },
    {
      slug: 'shilajit-capsules-daily-wellness',
      title: 'Shilajit Capsules: Convenient Daily Wellness',
      excerpt: 'Shilajit capsules provide all the benefits of resin in an easy-to-use form.',
      content: [
        'Shilajit capsules offer a modern, convenient way to enjoy the benefits of Himalayan Shilajit for energy, immunity, and vitality.',
        '',
        'Each capsule contains lab-tested Shilajit ensuring purity and potency.',
        'Capsules are ideal for busy lifestyles while maintaining consistent intake.',
        'Supports stamina, mental clarity, and hormonal balance when taken daily.',
        '',
        '**Key Points:**',
        '- Easy daily intake with precise dosage.',
        '- Supports overall energy and focus.',
        '- Lab-tested and GMP-certified for quality.',
        '',
        'Shilajit capsules are a practical solution for modern wellness, combining traditional benefits with convenience.',
      ].join('\n'),
      coverImage: { url: '/images/blog/img-2.jpg', alt: 'Shilajit Capsules: Convenient Daily Wellness' },
      author: 'Robert Fox',
      publishedAt: new Date('2025-08-05'),
      published: true,
    },
    {
      slug: 'shilajit-gummies-immunity-support',
      title: 'Shilajit Gummies: Tasty Immunity Support',
      excerpt: 'Delicious Shilajit gummies for energy, immunity, and daily health support.',
      content: [
        'Shilajit gummies provide a tasty and convenient way to support immunity, boost energy, and improve overall wellness.',
        '',
        'Each gummy contains a natural dose of Shilajit rich in minerals and fulvic acid.',
        'Perfect for adults and teenagers who prefer not to use powders or capsules.',
        'Supports mental clarity, stamina, and overall vitality with regular consumption.',
        '',
        '**Key Points:**',
        '- Delicious and easy to take daily.',
        '- Boosts immunity and natural energy.',
        '- Supports mental focus and vitality.',
        '',
        'Shilajit gummies are an enjoyable and effective way to maintain wellness and vitality every day.',
      ].join('\n'),
      coverImage: { url: '/images/blog/img-3.jpg', alt: 'Shilajit Gummies: Tasty Immunity Support' },
      author: 'Devon Lane',
      publishedAt: new Date('2025-08-10'),
      published: true,
    },
  ];

  let blogCount = 0;
  for (const bp of blogPosts) {
    const { slug, ...fields } = bp;
    await BlogPost.updateOne(
      { slug },
      { $set: fields, $setOnInsert: { slug } },
      { upsert: true }
    );
    blogCount++;
  }
  console.log(`BlogPosts upserted: ${blogCount}`);

  // ── 4. Testimonials ────────────────────────────────────────────────────────
  const testimonials = [
    {
      name: 'James Mwangi',
      role: 'High School Teacher',
      message: 'I started using Shilajit Resin to cope with long workdays as a teacher. I now feel more energized and focused, and my stamina has improved dramatically.',
      photo: { url: '/images/testimonial/1.png', alt: 'James Mwangi' },
      order: 1, published: true,
    },
    {
      name: 'Amina Njeri',
      role: 'Marketing Executive',
      message: 'Shilajit Gummies have been a game-changer for me. As a marketing executive, I need consistent energy and alertness throughout the day, and these gummies help me stay vibrant.',
      photo: { url: '/images/testimonial/2.png', alt: 'Amina Njeri' },
      order: 2, published: true,
    },
    {
      name: 'Daniel Otieno',
      role: 'Construction Foreman',
      message: 'As a construction foreman, my job is physically demanding. Shilajit 8-in-1 Capsules have boosted my energy and helped me recover faster after long shifts.',
      photo: { url: '/images/testimonial/3.png', alt: 'Daniel Otieno' },
      order: 3, published: true,
    },
  ];

  // Upsert by name (no unique slug on Testimonial)
  let testimonialCount = 0;
  for (const t of testimonials) {
    await Testimonial.updateOne(
      { name: t.name },
      { $set: t },
      { upsert: true }
    );
    testimonialCount++;
  }
  console.log(`Testimonials upserted: ${testimonialCount}`);

  // ── 5. FAQs ────────────────────────────────────────────────────────────────
  const faqs = [
    {
      question: 'What is Shilajit and how does it work?',
      answer: 'Shilajit is a natural resin packed with minerals and fulvic acid that helps boost energy, vitality, and overall wellness when taken consistently.',
      order: 1, published: true,
    },
    {
      question: 'Can Shilajit improve mental clarity?',
      answer: 'Many users report enhanced focus, memory, and mental clarity after using Shilajit regularly as part of their daily routine.',
      order: 2, published: true,
    },
    {
      question: 'How does Shilajit support energy and stamina?',
      answer: 'Shilajit helps improve physical performance and reduces fatigue by delivering essential minerals and nutrients to the body.',
      order: 3, published: true,
    },
    {
      question: 'Is Shilajit safe for daily use?',
      answer: 'When sourced from a reliable supplier and used as directed, Shilajit is safe and supports overall health and hormonal balance.',
      order: 4, published: true,
    },
  ];

  let faqCount = 0;
  for (const f of faqs) {
    await FAQ.updateOne(
      { question: f.question },
      { $set: f },
      { upsert: true }
    );
    faqCount++;
  }
  console.log(`FAQs upserted: ${faqCount}`);

  // ── 6. SiteSettings ────────────────────────────────────────────────────────
  // whatsappDefaultMessage decoded from the existing hero/header WhatsApp link.
  const waMessage = "Welcome!\n\nWe\u2019re now selling pure Himalayan Shilajit \u2013 known for boosting energy and vitality \u2013 for just 3500.\n100% natural, straight from the Himalayas mountains!\n\nWould you like to place an order?";

  await SiteSettings.findOneAndUpdate(
    { key: 'main' },
    {
      $set: {
        businessName:           'Shilajit Kenya',
        whatsappNumber:         '254793313743',
        whatsappDefaultMessage: waMessage,
        phone:                  '+254 793 313743',
        'socialLinks.facebook':  'https://facebook.com/shilajitkenya',
        'socialLinks.instagram': 'https://instagram.com/shilajitkenya',
        defaultSeoTitle:        'Kenya Shilajit - Natural Energy & Health Supplement',
        defaultSeoDescription:  'Boost your energy and health naturally with Kenya Shilajit \u2013 a powerful mineral resin packed with fulvic acid and minerals.',
      },
      $setOnInsert: { key: 'main' },
    },
    { upsert: true }
  );
  console.log('SiteSettings upserted: 1');

  console.log('\nSeed complete.');
  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
