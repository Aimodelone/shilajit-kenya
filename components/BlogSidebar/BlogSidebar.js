import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import about from '/public/images/blog/about-widget.jpg';

const ClickHandler = () => { window.scrollTo(10, 0); };

/**
 * BlogSidebar
 * @param {Object}  props
 * @param {string}  props.blLeft     - optional CSS class for column alignment
 * @param {Array}   props.recentPosts - DB posts to show in "Recent Posts" (optional)
 */
const BlogSidebar = (props) => {
  const posts = props.recentPosts || [];

  return (
    <div className={`col col-lg-4 col-12 ${props.blLeft || ''}`}>
      <div className="blog-sidebar">

        {/* About widget */}
        <div className="widget about-widget">
          <div className="img-holder">
            <Image src={about} alt="Shilajit Kenya blog" />
          </div>
          <h4>Shilajit Kenya Blog</h4>
          <p>Research-backed insights on Shilajit benefits, natural wellness and how to get the most from your daily routine.</p>
          <div className="aw-shape"></div>
        </div>

        {/* Recent posts */}
        {posts.length > 0 && (
          <div className="widget recent-post-widget">
            <h3>Recent Posts</h3>
            <div className="posts">
              {posts.map((post) => (
                <div className="post" key={post._id}>
                  <div className="details" style={{ padding: '4px 0' }}>
                    <h4>
                      <Link onClick={ClickHandler} href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h4>
                    {post.publishedAt && (
                      <span className="date">
                        {new Date(post.publishedAt).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tag / topics widget */}
        <div className="widget tag-widget">
          <h3>Topics</h3>
          <ul>
            <li><Link onClick={ClickHandler} href="/blog">Energy &amp; Vitality</Link></li>
            <li><Link onClick={ClickHandler} href="/blog">Mental Clarity</Link></li>
            <li><Link onClick={ClickHandler} href="/blog">Immunity Boost</Link></li>
            <li><Link onClick={ClickHandler} href="/blog">Hormonal Balance</Link></li>
            <li><Link onClick={ClickHandler} href="/blog">Overall Wellness</Link></li>
            <li><Link onClick={ClickHandler} href="/blog">Physical Performance</Link></li>
          </ul>
        </div>

        {/* Products CTA */}
        <div className="wpo-contact-widget widget">
          <div className="wpo-contact-widget-inner">
            <h2><Link onClick={ClickHandler} href="/products">Shop Shilajit Products</Link></h2>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BlogSidebar;
