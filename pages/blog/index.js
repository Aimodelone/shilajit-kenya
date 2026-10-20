/**
 * pages/blog/index.js
 * Database-driven blog list page with ISR.
 */
import React, { Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar2 from '../../components/Navbar2/Navbar2';
import PageTitle from '../../components/pagetitle/PageTitle';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Seo from '../../components/Seo/Seo';
import { getBlogPosts, getSettings } from '../../lib/data';

export default function BlogPage({ posts, settings }) {
  return (
    <Fragment>
      <Seo
        title="Shilajit Blog: Benefits, Use and Guides | Shilajit Kenya"
        description="Read our latest articles on Shilajit benefits, how to use it, safety, and natural wellness guides for Kenyans."
        path="/blog"
        settings={settings}
      />
      <Navbar2 />
      <PageTitle pageTitle="Latest Posts" pagesub="Blog" />

      <section className="wpo-blog-pg-section section-padding">
        <div className="container">
          <div className="wpo-section-title" style={{ marginBottom: '8px' }}>
            <h1 style={{ fontSize: '2rem' }}>Shilajit Blog</h1>
          </div>
          <div className="row">
            <div className="col col-lg-8 col-12">
              <div className="wpo-blog-content">
                {posts.length === 0 && <p>No posts published yet. Check back soon!</p>}
                {posts.map((post) => {
                  const pubDate = post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })
                    : '';
                  return (
                    <div className="post format-standard-image" key={post._id}>
                      {post.coverImage?.url && (
                        <div className="entry-media">
                          <Link href={`/blog/${post.slug}`}>
                            <Image
                              src={post.coverImage.url}
                              alt={post.coverImage.alt || post.title}
                              width={800}
                              height={450}
                              style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                            />
                          </Link>
                        </div>
                      )}
                      <div className="entry-meta">
                        <ul>
                          <li><i className="fi flaticon-user"></i> By <Link href={`/blog/${post.slug}`}>{post.author || 'Shilajit Kenya'}</Link></li>
                          {pubDate && <li><i className="fi flaticon-calendar"></i> {pubDate}</li>}
                          {post.category && <li><i className="fi flaticon-tag"></i> {post.category}</li>}
                        </ul>
                      </div>
                      <div className="entry-details">
                        <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
                        <p>{post.excerpt}</p>
                        <Link href={`/blog/${post.slug}`} className="read-more">READ MORE...</Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Simple sidebar */}
            <div className="col col-lg-4 col-12">
              <div className="blog-sidebar" style={{ paddingTop: '24px' }}>
                <div style={{ background: '#f8f8f8', padding: '24px', borderRadius: '8px', marginBottom: '24px' }}>
                  <h3 style={{ marginBottom: '16px' }}>Recent Posts</h3>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {posts.slice(0, 4).map((p) => (
                      <li key={p._id} style={{ marginBottom: '8px' }}>
                        <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ background: '#f8f8f8', padding: '24px', borderRadius: '8px' }}>
                  <h3 style={{ marginBottom: '16px' }}>Our Products</h3>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '8px' }}><Link href="/products/shilajit-resin">Shilajit Resin</Link></li>
                    <li style={{ marginBottom: '8px' }}><Link href="/products/shilajit-capsules">Shilajit Capsules</Link></li>
                    <li style={{ marginBottom: '8px' }}><Link href="/products/shilajit-gummies">Shilajit Gummies</Link></li>
                    <li style={{ marginBottom: '8px' }}><Link href="/products/shilajit-8-in-1-capsules">8-in-1 Capsules</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <Scrollbar />
    </Fragment>
  );
}

export async function getStaticProps() {
  try {
    const [posts, settings] = await Promise.all([getBlogPosts(), getSettings()]);
    return { props: { posts, settings }, revalidate: 60 };
  } catch {
    return { props: { posts: [], settings: {} }, revalidate: 60 };
  }
}
