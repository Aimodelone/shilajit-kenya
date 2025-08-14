// images
import blogImg1 from "/public/images/blog/img-1.jpg";
import blogImg2 from "/public/images/blog/img-2.jpg";
import blogImg3 from "/public/images/blog/img-3.jpg";

import blogSingleImg1 from "/public/images/blog/blog-single/img-1.jpg";
import blogSingleImg2 from "/public/images/blog/blog-single/img-2.jpg";
import blogSingleImg3 from "/public/images/blog/blog-single/img-3.jpg";

// author avatars
import authorImg1 from "/public/images/blog-details/author.jpg";
import authorImg2 from "/public/images/blog-details/author.jpg";
import authorImg3 from "/public/images/blog-details/author.jpg";

const blogs = [
  {
    id: '1',
    title: 'Shilajit Resin: Nature’s Energy Booster',
    slug: 'shilajit-resin-energy-booster',
    screens: blogImg1,
    description: 'Discover the benefits of pure Himalayan Shilajit Resin for energy, immunity, and vitality.',
    author: 'Anne William',
    authorTitle: 'Herbal Wellness Expert',
    create_at: '01 Aug 2025',
    blogSingleImg: blogSingleImg1,
    comment: '35',
    blClass: 'format-standard-image',

    contentIntro: "Shilajit is a natural resin found in the Himalayas, known for boosting energy, supporting immunity, and enhancing overall wellness.",
    contentBody: [
      "Rich in fulvic acid and minerals, Shilajit improves physical performance and mental clarity.",
      "Daily intake can support stamina, vitality, and recovery from fatigue.",
      "Traditional medicine has used Shilajit for centuries to promote longevity and general well-being."
    ],
    keyPoints: [
      "Boosts natural energy and endurance.",
      "Supports cognitive function and focus.",
      "Strengthens immune system and vitality."
    ],
    conclusion: "Incorporating Shilajit into your daily routine can significantly improve your health, energy levels, and overall wellness.",
    extraImages: [blogSingleImg2, blogSingleImg3],
    authorAvatar: authorImg1,
    authorDescription: "Anne is a wellness expert specializing in herbal supplements and natural remedies."
  },
  {
    id: '2',
    title: 'Shilajit Capsules: Convenient Daily Wellness',
    slug: 'shilajit-capsules-daily-wellness',
    screens: blogImg2,
    description: 'Shilajit capsules provide all the benefits of resin in an easy-to-use form.',
    author: 'Robert Fox',
    authorTitle: 'Herbal Nutritionist',
    create_at: '05 Aug 2025',
    blogSingleImg: blogSingleImg2,
    comment: '80',
    blClass: 'format-standard-image',

    contentIntro: "Shilajit capsules offer a modern, convenient way to enjoy the benefits of Himalayan Shilajit for energy, immunity, and vitality.",
    contentBody: [
      "Each capsule contains lab-tested Shilajit ensuring purity and potency.",
      "Capsules are ideal for busy lifestyles while maintaining consistent intake.",
      "Supports stamina, mental clarity, and hormonal balance when taken daily."
    ],
    keyPoints: [
      "Easy daily intake with precise dosage.",
      "Supports overall energy and focus.",
      "Lab-tested and GMP-certified for quality."
    ],
    conclusion: "Shilajit capsules are a practical solution for modern wellness, combining traditional benefits with convenience.",
    extraImages: [blogSingleImg1, blogSingleImg3],
    authorAvatar: authorImg2,
    authorDescription: "Robert is a nutritionist focused on herbal supplements and daily wellness solutions."
  },
  {
    id: '3',
    title: 'Shilajit Gummies: Tasty Immunity Support',
    slug: 'shilajit-gummies-immunity-support',
    screens: blogImg3,
    description: 'Delicious Shilajit gummies for energy, immunity, and daily health support.',
    author: 'Devon Lane',
    authorTitle: 'Herbal Health Coach',
    create_at: '10 Aug 2025',
    blogSingleImg: blogSingleImg3,
    comment: '95',
    blClass: 'format-video',

    contentIntro: "Shilajit gummies provide a tasty and convenient way to support immunity, boost energy, and improve overall wellness.",
    contentBody: [
      "Each gummy contains a natural dose of Shilajit rich in minerals and fulvic acid.",
      "Perfect for adults and teenagers who prefer not to use powders or capsules.",
      "Supports mental clarity, stamina, and overall vitality with regular consumption."
    ],
    keyPoints: [
      "Delicious and easy to take daily.",
      "Boosts immunity and natural energy.",
      "Supports mental focus and vitality."
    ],
    conclusion: "Shilajit gummies are an enjoyable and effective way to maintain wellness and vitality every day.",
    extraImages: [blogSingleImg1, blogSingleImg2],
    authorAvatar: authorImg3,
    authorDescription: "Devon is a health coach specializing in natural supplements and wellness guidance."
  }
];

export default blogs;
