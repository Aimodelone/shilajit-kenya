// images
import blogImg1 from "/public/images/blog/img-1.jpg";
import blogImg2 from "/public/images/blog/img-2.jpg";
import blogImg3 from "/public/images/blog/img-3.jpg";

import blogSingleImg1 from "/public/images/blog/blog-single/img-1.jpg";
import blogSingleImg2 from "/public/images/blog/blog-single/img-2.jpg";
import blogSingleImg3 from "/public/images/blog/blog-single/img-3.jpg";

// author avatars (you can add more if needed)
import authorImg1 from "/public/images/blog-details/author.jpg"; // reuse your existing image or add new ones
import authorImg2 from "/public/images/blog-details/author.jpg";
import authorImg3 from "/public/images/blog-details/author.jpg";

const blogs = [
  {
    id: '1',
    title: 'We’re the people who don’t just support progressive change.',
    slug: 'support-progressive-change',
    screens: blogImg1,
    description: 'Consectetur adipiscing elit. Purusout phasellus malesuada lectus.',
    author: 'Anne William',
    authorTitle: 'Senior Consultant',
    create_at: '25 Sep 2023',
    blogSingleImg: blogSingleImg1,
    comment: '35',
    blClass: 'format-standard-image',

    contentIntro: "We have  many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words.",
    contentBody: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "Purusout phasellus malesuada lectus, sed varius odio imperdiet et.",
      "If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text."
    ],
    keyPoints: [
      "Supports progressive change in every sector.",
      "Driven by community-focused initiatives.",
      "Embraces innovation and transparency."
    ],
    conclusion: "This approach guarantees sustainable development and fosters trust within the community.",
    extraImages: [blogSingleImg2, blogSingleImg3],
    authorAvatar: authorImg1,
    authorDescription: "Anne is a senior consultant with over 10 years of experience in social change and policy advocacy."
  },
  {
    id: '2',
    title: "Politics is why we can’t have nice things. Like the internet.",
    slug: 'Like-the-internet',
    screens: blogImg2,
    description: "Consectetur adipiscing elit. Purusout phasellus malesuada lectus.",
    author: "Robert Fox",
    authorTitle: "Creative Director",
    create_at: "26 Sep 2023",
    blogSingleImg: blogSingleImg2,
    comment: "80",
    blClass: "format-standard-image",

    contentIntro: "Politics often interferes with the development and freedom of the internet.",
    contentBody: [
      "This blog explores the reasons behind internet censorship and control.",
      "We analyze the impact on digital rights and freedoms.",
      "Possible solutions and activism for a freer internet are also discussed."
    ],
    keyPoints: [
      "Internet censorship restricts free expression.",
      "Governments play a big role in limiting access.",
      "Activism is essential to maintain open digital spaces."
    ],
    conclusion: "Understanding these dynamics helps users stay informed and active in protecting internet freedom.",
    extraImages: [blogSingleImg1, blogSingleImg3],
    authorAvatar: authorImg2,
    authorDescription: "Robert is a creative director passionate about technology and digital rights."
  },
  {
    id: '3',
    title: "Liberty Divided Over Criticism Justice League",
    slug: 'Criticism-Justice',
    screens: blogImg3,
    description: "Consectetur adipiscing elit. Purusout phasellus malesuada lectus.",
    author: "Devon Lane",
    authorTitle: "Art Director",
    create_at: "28 Sep 2023",
    blogSingleImg: blogSingleImg3,
    comment: "95",
    blClass: "format-video",

    contentIntro: "Liberty and justice are often debated topics with diverse opinions.",
    contentBody: [
      "Criticism of the justice system highlights many societal challenges.",
      "The concept of liberty varies between cultures and legal frameworks.",
      "This article dives into how criticism shapes reforms and public opinion."
    ],
    keyPoints: [
      "Justice systems must be transparent and accountable.",
      "Liberty must be balanced with social responsibility.",
      "Public criticism drives positive reforms."
    ],
    conclusion: "Engaging in informed debates about liberty and justice strengthens democracy.",
    extraImages: [blogSingleImg1, blogSingleImg2],
    authorAvatar: authorImg3,
    authorDescription: "Devon is an art director with a keen interest in social justice and culture."
  }
];

export default blogs;
