/**
 * pages/blog/[slug].js
 * Database-driven blog post detail page with ISR.
 * - Content rendered from Markdown via marked + sanitize-html
 * - No fake comments or comment form
 * - SEO: Article JSON-LD + BreadcrumbList
 */
import React, { Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import Navbar2 from '../../components/Navbar2/Navbar2';
import PageTitle from '../../components/pagetitle/PageTitle';
import Footer from '../../components/footer/Footer';
import BlogSidebar from '../../components/BlogSidebar/BlogSidebar';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Seo from '../../components/Seo/Seo';
import { getBlogPostBySlug, getAllBlogSlugs, getSettings, getLatestPosts } from '../../lib/data';
import { absoluteUrl } from '../../lib/site';

/** Allowed HTML config for sanitize-html. */
const SANITIZE_OPTS = {
  allowedTags: ['p', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'strong', 'em', 'a',
                'blockquote', 'br', 'img', 'figure', 'figcaption', 'code', 'pre'],
  allowedAttributes: {
    a:   ['href', 'title', 'rel', 'target'],
    img: ['src', 'alt', 'width', 'height'],
  },
  transformTags: {
    a: (tagName, attribs) => {
      const href = attribs.href || '';
      if (!/^https?:\/\//.test(href) && !href.startsWith('/')) {
        return { tagName: 'span', attribs: {} };
      }
      return { tagName, attribs: { ...attribs, rel: 'noopener noreferrer', target: '_blank' } };
    },
    img: (tagName, attribs) => {
      const src = attribs.src || '';
      if (!/^https?:\/\//.test(src) && !src.startsWith('/')) {
        return { tagName: 'span', attribs: {} };
      }
      return { tagName, attribs };
    },
  },
};

function renderMarkdown(md) {
  if (!md) return '';
  return sanitizeHtml(marked(md), SANITIZE_OPTS);
}

export default function BlogPostPage({ post, settings, recentPosts }) {
  if (!post) return null;

  const seoTitle  = post.seoTitle || `${post.title} | Shilajit Kenya`;
  const seoDesc   = post.seoDescription || post.excerpt;
  const seoImage  = post.coverImage?.url || null;
  const postUrl   = absoluteUrl(`/blog/${post.slug}`);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    ...(seoImage ? { image: absoluteUrl(seoImage) } : {}),
    datePublished: post.publishedAt,
    dateModified:  post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author || 'Shilajit Kenya',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Shilajit Kenya',
      url: absoluteUrl('/'),
    },
    url: postUrl,
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',  item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Blog',  item: absoluteUrl('/blog') },
      { '@type': 'ListItem', position: 3, name: post.title, item: postUrl },
    ],
  };

  const pubDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  const contentHtml = renderMarkdown(post.content);

  return (
    <Fragment>
      <Seo
        title={seoTitle}
        description={seoDesc}
        path={`/blog/${post.slug}`}
        image={seoImage}
        type="article"
        settings={settings}
        jsonLd={[articleLd, breadcrumbLd]}
      />
      <Navbar2 />
      <PageTitle pageTitle={post.title} pagesub="Blog" />

      <section className="wpo-blog-single-section section-padding">
        <div className="container">
          <div className="row">
            <div className="col col-lg-8 col-12">
              <div className="wpo-blog-content">
                <div className="post format-standard-image">

                  {/* Main h1 — the post title (PageTitle uses h2) */}
                  <h1 className="wpo-blog-title" style={{ fontSize: '2rem', marginBottom: '16px' }}>
                    {post.title}
                  </h1>

                  {/* Cover image */}
                  {post.coverImage?.url && (
                    <div className="entry-media">
                      <Image
                        src={post.coverImage.url}
                        alt={post.coverImage.alt || post.title}
                        width={800}
                        height={450}
                        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                        priority
                      />
                    </div>
                  )}

                  {/* Meta */}
                  <div className="entry-meta">
                    <ul>
                      <li><i className="fi ti-user"></i> By {post.author || 'Shilajit Kenya'}</li>
                      {pubDate && <li><i className="fi flaticon-calendar"></i> {pubDate}</li>}
                      {post.category && <li><i className="fi flaticon-tag"></i> {post.category}</li>}
                    </ul>
                  </div>

                  {/* Excerpt */}
                  {post.excerpt && <p className="lead" style={{ fontStyle: 'italic', margin: '16px 0' }}>{post.excerpt}</p>}

                  {/* Markdown content — sanitized */}
                  {contentHtml && (
                    <div
                      className="wpo-blog-body"
                      dangerouslySetInnerHTML={{ __html: contentHtml }}
                    />
                  )}

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="tag-share clearfix" style={{ marginTop: '24px' }}>
                      <div className="tag">
                        <span>Tags: </span>
                        <ul>
                          {post.tags.map((t) => (
                            <li key={t}><Link href="/blog">{t}</Link></li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Share */}
                  <div className="tag-share-s2 clearfix" style={{ marginTop: '12px' }}>
                    <div className="tag">
                      <span>Share: </span>
                      <ul>
                        <li><Link href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`} rel="noopener noreferrer" target="_blank">Facebook</Link></li>
                        <li><Link href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title)}`} rel="noopener noreferrer" target="_blank">Twitter</Link></li>
                      </ul>
                    </div>
                  </div>

                  {/* Author box */}
                  <div className="author-box" style={{ margin: '32px 0' }}>
                    <div className="author-content">
                      <span className="author-name" style={{ fontWeight: 700 }}>Author: {post.author || 'Shilajit Kenya'}</span>
                      <p>The Shilajit Kenya editorial team — sharing research-backed insights on natural wellness and Shilajit benefits.</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <BlogSidebar recentPosts={recentPosts} />
          </div>
        </div>
      </section>

      <Footer />
      <Scrollbar />
    </Fragment>
  );
}

export async function getStaticPaths() {
  try {
    const slugs = await getAllBlogSlugs();
    return {
      paths: slugs.map((slug) => ({ params: { slug } })),
      fallback: 'blocking',
    };
  } catch {
    return { paths: [], fallback: 'blocking' };
  }
}

export async function getStaticProps({ params }) {
  try {
    const [post, settings, recentPosts] = await Promise.all([
      getBlogPostBySlug(params.slug),
      getSettings(),
      getLatestPosts(4),
    ]);
    if (!post) return { notFound: true };
    return { props: { post, settings, recentPosts }, revalidate: 60 };
  } catch {
    return { notFound: true };
  }
}
