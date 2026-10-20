import React, { Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navbar/Navbar';
import About from '../components/about/about';
import ServiceSection from '../components/ServiceSection/ServiceSection';
import FunFact from '../components/FunFact/FunFact';
import Donors from '../components/Donors/Donors';
import PartnerSection from '../components/PartnerSection/PartnerSection';
import Footer from '../components/footer/Footer';
import Scrollbar from '../components/scrollbar/scrollbar';
import Seo from '../components/Seo/Seo';
import abimg from '/public/images/about.jpg';
import hero1 from '/public/images/slider/1.png';
import { getSettings, getProducts, getTestimonials, getFaqs, getLatestPosts } from '../lib/data';
import { whatsappLink, absoluteUrl } from '../lib/site';
import Slider from 'react-slick';

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ settings }) {
  const waLink = whatsappLink(settings, settings?.whatsappDefaultMessage);

  return (
    <section className="static-hero" style={{ background: '#000', color: '#fff' }}>
      <div className="hero-container">
        <div className="hero-inner">
          <div className="container-fluid">
            <div className="hero-content">
              <div data-swiper-parallax="300" className="slide-title-sub">
                <span style={{ color: '#fff' }}>Pure Himalayan Power</span>
              </div>
              <div data-swiper-parallax="300" className="slide-title">
                <h1 style={{ color: '#fff' }}>Unlock Your Energy &amp; Vitality</h1>
              </div>
              <div data-swiper-parallax="400" className="slide-text">
                <p style={{ color: '#fff' }}>
                  Experience the ancient natural supplement Shilajit — packed with minerals and fulvic acid
                  to boost stamina, focus, and overall wellness every day.
                </p>
              </div>
              <div className="clearfix"></div>
              <div data-swiper-parallax="500" className="slide-btns">
                <a
                  href={waLink}
                  className="theme-btn"
                  style={{ color: '#000' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shop Shilajit Now
                </a>
              </div>

              <div className="politian-pic">
                <Image src={hero1} alt="Shilajit Hero" />
                <div className="politian-shape">
                  <div className="shape-1"></div>
                  <div className="shape-2"></div>
                  <div className="shape-3"></div>
                  <div className="shape-4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Products grid ─────────────────────────────────────────────────────────────
function ProductsSection({ products }) {
  const ClickHandler = () => { window.scrollTo(0, 0); };
  if (!products?.length) return null;
  return (
    <section className="wpo-team-section section-padding">
      <div className="container">
        <div className="wpo-section-title">
          <span>PRODUCTS</span>
          <h2>Our Popular Products</h2>
        </div>
        <div className="wpo-team-wrap">
          <div className="row">
            {products.map((product) => (
              <div className="col col-lg-3 col-md-6 col-12" key={product._id}>
                <div className="wpo-team-item">
                  <div className="wpo-team-img">
                    <div className="wpo-team-img-box">
                      {product.coverImage?.url ? (
                        <Image
                          src={product.coverImage.url}
                          alt={product.coverImage.alt || product.name}
                          width={400}
                          height={400}
                          style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                        />
                      ) : null}
                    </div>
                  </div>
                  <div className="wpo-team-text">
                    <h2>
                      <Link onClick={ClickHandler} href={`/products/${product.slug}`}>
                        {product.name}
                      </Link>
                    </h2>
                    <span style={{ fontSize: '24px', fontWeight: 'bold' }}>
                      KES {product.price?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Testimonial ────────────────────────────────────────────────────────────────
function TestimonialSection({ testimonials }) {
  const [nav1, setNav1] = React.useState();
  const [nav2, setNav2] = React.useState();

  if (!testimonials?.length) return null;

  return (
    <section className="wpo-testimonial-section">
      <div className="container">
        <div className="wpo-testimonial-wrap">
          <div className="row align-items-center">
            <div className="col-lg-6 col-12 order-lg-1 order-2">
              <div className="testimonial-left">
                <div className="testimonial-left-inner">
                  <div className="left-slide">
                    <Slider
                      asNavFor={nav1}
                      ref={(slider2) => setNav2(slider2)}
                      slidesToShow={1}
                      fade={true}
                      dots={false}
                      arrows={false}
                      swipeToSlide={true}
                      focusOnSelect={true}
                    >
                      {testimonials.map((t, i) => (
                        <div className="testimonial-img" key={i}>
                          {t.photo?.url ? (
                            <Image src={t.photo.url} alt={t.photo.alt || t.name} width={400} height={500} />
                          ) : null}
                        </div>
                      ))}
                    </Slider>
                  </div>
                  <div className="shape-1"></div>
                  <div className="border-s1"></div>
                  <div className="border-s2"></div>
                  <div className="border-s3"></div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-12 order-lg-1 order-1">
              <div className="wpo-testimonial-items">
                <div className="right-slide">
                  <Slider asNavFor={nav2} ref={(slider1) => setNav1(slider1)} dots={true} arrows={false}>
                    {testimonials.map((t, i) => (
                      <div className="wpo-testimonial-item" key={i}>
                        <div className="wpo-testimonial-text">
                          <i className="fi flaticon-right-quote-sign"></i>
                          <p>"{t.message}"</p>
                          <div className="wpo-testimonial-text-btm">
                            <div className="wpo-testimonial-text-btm-info">
                              <h3>{t.name}</h3>
                              <span>{t.role}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Blog preview ───────────────────────────────────────────────────────────────
function BlogPreviewSection({ posts }) {
  const ClickHandler = () => { window.scrollTo(0, 0); };
  if (!posts?.length) return null;
  return (
    <section className="wpo-blog-section section-padding" id="blog">
      <div className="container">
        <div className="wpo-section-title">
          <span>Our Blog</span>
          <h2>Latest News &amp; Press</h2>
        </div>
        <div className="wpo-blog-items">
          <div className="row">
            {posts.map((post) => (
              <div className="col col-lg-4 col-md-6 col-12" key={post._id}>
                <div className="wpo-blog-item">
                  <div className="wpo-blog-img">
                    {post.coverImage?.url && (
                      <Image
                        src={post.coverImage.url}
                        alt={post.coverImage.alt || post.title}
                        width={400}
                        height={260}
                        style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                      />
                    )}
                  </div>
                  <div className="wpo-blog-content">
                    <ul>
                      <li>
                        <Link href={`/blog/${post.slug}`} onClick={ClickHandler}>
                          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}
                        </Link>
                      </li>
                      <li>by: <Link onClick={ClickHandler} href={`/blog/${post.slug}`}>{post.author}</Link></li>
                    </ul>
                    <h2>
                      <Link onClick={ClickHandler} href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <Link className="more" onClick={ClickHandler} href={`/blog/${post.slug}`}>
                      Continue Reading
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Home page ─────────────────────────────────────────────────────────────────
export default function HomePage({ settings, products, testimonials, posts }) {

  // JSON-LD
  const siteName = settings?.businessName || 'Shilajit Kenya';
  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: absoluteUrl('/'),
    logo: absoluteUrl('/images/logo.png'),
    telephone: settings?.phone || '',
    sameAs: [
      settings?.socialLinks?.facebook,
      settings?.socialLinks?.instagram,
      settings?.socialLinks?.tiktok,
      settings?.socialLinks?.twitter,
      settings?.socialLinks?.youtube,
    ].filter(Boolean),
  };
  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: absoluteUrl('/'),
  };

  return (
    <Fragment>
      <Seo
        title="Kenya Shilajit | Pure Himalayan Shilajit Resin, Capsules & Gummies"
        description="Buy pure Himalayan Shilajit in Kenya — Resin, Capsules, Gummies and 8-in-1 Capsules. Natural energy booster, immunity support and wellness supplement."
        path="/"
        settings={settings}
        jsonLd={[orgLd, websiteLd]}
      />
      <Navbar hclass="wpo-site-header-s1" topbarNone="topbar-none" Logo="/images/logo.png" />
      <Hero settings={settings} />
      <About abimg={abimg} />
      <ServiceSection />
      <TestimonialSection testimonials={testimonials} />
      <FunFact />
      <ProductsSection products={products} />
      <Donors />
      <BlogPreviewSection posts={posts} />
      <PartnerSection />
      <Footer />
      <Scrollbar />
    </Fragment>
  );
}

export async function getStaticProps() {
  try {
    const [settings, products, testimonials, posts] = await Promise.all([
      getSettings(),
      getProducts({ featuredOnly: true }),
      getTestimonials(),
      getLatestPosts(3),
    ]);
    return {
      props: { settings, products, testimonials, posts },
      revalidate: 60,
    };
  } catch (err) {
    console.error('Home getStaticProps error:', err.message);
    return {
      props: { settings: {}, products: [], testimonials: [], posts: [] },
      revalidate: 60,
    };
  }
}
