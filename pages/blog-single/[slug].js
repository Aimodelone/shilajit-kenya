import React, { Fragment } from 'react';
import { useRouter } from 'next/router';
import blogs from '../../api/blogs';
import Link from 'next/link';
import PageTitle from '../../components/pagetitle/PageTitle';
import Navbar2 from '../../components/Navbar2/Navbar2';
import Footer from '../../components/footer/Footer';
import BlogSidebar from '../../components/BlogSidebar/BlogSidebar';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Image from 'next/image';

// Comment author images
import blog3 from '/public/images/blog-details/comments-author/img-1.jpg';
import blog4 from '/public/images/blog-details/comments-author/img-2.jpg';
import blog5 from '/public/images/blog-details/comments-author/img-3.jpg';

// Default author avatar fallback
import blog6 from '/public/images/blog-details/author.jpg';

const submitHandler = (e) => {
  e.preventDefault();
};

const BlogSingle = (props) => {
  const router = useRouter();

  const BlogDetails = blogs.find(item => item.slug === router.query.slug);

  if (!BlogDetails) {
    return <p style={{ padding: '20px' }}>Blog post not found.</p>;
  }

  return (
    <Fragment>
      <Navbar2 />
      <PageTitle pageTitle={BlogDetails.title} pagesub={'Blog'} />

      <section className="wpo-blog-single-section section-padding">
        <div className="container">
          <div className="row">
            <div className={`col col-lg-8 col-12 ${props.blRight}`}>
              <div className="wpo-blog-content">
                <div className={`post ${BlogDetails.blClass || 'format-standard-image'}`}>
                  {/* Main Blog Image */}
                  <div className="entry-media">
                    <Image src={BlogDetails.blogSingleImg} alt={BlogDetails.title} />
                  </div>

                  {/* Meta Info */}
                  <div className="entry-meta">
                    <ul>
                      <li>
                        <i className="fi ti-user"></i> By <Link href="/">{BlogDetails.author}</Link>
                      </li>
                      <li>
                        <i className="fi ti-comment-alt"></i> Comments {BlogDetails.comment}
                      </li>
                      <li>
                        <i className="fi flaticon-calendar"></i> {BlogDetails.create_at}
                      </li>
                    </ul>
                  </div>

                  {/* Blog Title */}
                  <h2>{BlogDetails.title}</h2>

                  {/* Dynamic content intro */}
                  <p>{BlogDetails.contentIntro}</p>

                  {/* Dynamic content paragraphs */}
                  {BlogDetails.contentBody?.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}

                  {/* Optional Blockquote if you want to keep it as static or dynamic */}
                  <blockquote>
                    Combined with a handful of model sentence structures, generate Lorem Ipsum which looks reasonable.
                    The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.
                  </blockquote>

                  {/* Key points as list */}
                  {BlogDetails.keyPoints && BlogDetails.keyPoints.length > 0 && (
                    <div className="wpo-service-single-item list-widget">
                      <div className="wpo-service-single-title">
                        <h3>Key Points</h3>
                      </div>
                      <ul>
                        {BlogDetails.keyPoints.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Conclusion paragraph */}
                  {BlogDetails.conclusion && <p>{BlogDetails.conclusion}</p>}

                  {/* Extra gallery images */}
                  {BlogDetails.extraImages && BlogDetails.extraImages.length > 0 && (
                    <div className="gallery">
                      {BlogDetails.extraImages.map((img, i) => (
                        <div key={i}>
                          <Image src={img} alt={`Gallery image ${i + 1}`} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tags & Share */}
                <div className="tag-share clearfix">
                  <div className="tag">
                    <span>Share: </span>
                    <ul>
                      {/* Ideally tags would be dynamic; here I'm using static example tags */}
                      <li><Link href="/blog-single/support-progressive-change">Election</Link></li>
                      <li><Link href="/blog-single/support-progressive-change">Vote</Link></li>
                      <li><Link href="/blog-single/support-progressive-change">Political</Link></li>
                    </ul>
                  </div>
                </div>

                <div className="tag-share-s2 clearfix">
                  <div className="tag">
                    <span>Share: </span>
                    <ul>
                      <li><Link href="/">facebook</Link></li>
                      <li><Link href="/">twitter</Link></li>
                      <li><Link href="/">linkedin</Link></li>
                      <li><Link href="/">pinterest</Link></li>
                    </ul>
                  </div>
                </div>

                {/* Author Box */}
                <div className="author-box">
                  <div className="author-avatar">
                    <Link href="/" target="_blank">
                      <Image
                        src={BlogDetails.authorAvatar || blog6}
                        alt={`Author avatar of ${BlogDetails.author}`}
                      />
                    </Link>
                  </div>
                  <div className="author-content">
                    <Link href="/" className="author-name">Author: {BlogDetails.author}</Link>
                    <p>{BlogDetails.authorDescription || 'No author description provided.'}</p>
                    <div className="socials">
                      <ul className="social-link">
                        <li><Link href="/"><i className="ti-facebook"></i></Link></li>
                        <li><Link href="/"><i className="ti-twitter-alt"></i></Link></li>
                        <li><Link href="/"><i className="ti-linkedin"></i></Link></li>
                        <li><Link href="/"><i className="ti-instagram"></i></Link></li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Previous & Next Posts */}
                <div className="more-posts">
                  <div className="previous-post">
                    <Link href="/">
                      <span className="post-control-link">Previous Post</span>
                      <span className="post-name">
                        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.
                      </span>
                    </Link>
                  </div>
                  <div className="next-post">
                    <Link href="/">
                      <span className="post-control-link">Next Post</span>
                      <span className="post-name">
                        Dignissimos ducimus qui blanditiis praesentiu deleniti atque corrupti quos dolores
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="comments-area">
                  <div className="comments-section">
                    <h3 className="comments-title">Comments</h3>
                    <ol className="comments">
                      <li className="comment even thread-even depth-1" id="comment-1">
                        <div id="div-comment-1">
                          <div className="comment-theme">
                            <div className="comment-image"><Image src={blog3} alt="" /></div>
                          </div>
                          <div className="comment-main-area">
                            <div className="comment-wrapper">
                              <div className="comments-meta">
                                <h4>John Abraham <span className="comments-date">January 12,2022 At 9.00am</span></h4>
                              </div>
                              <div className="comment-area">
                                <p>I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, </p>
                                <div className="comments-reply">
                                  <Link href="/" className="comment-reply-link"><span>Reply</span></Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <ul className="children">
                          <li className="comment">
                            <div>
                              <div className="comment-theme">
                                <div className="comment-image"><Image src={blog4} alt="" /></div>
                              </div>
                              <div className="comment-main-area">
                                <div className="comment-wrapper">
                                  <div className="comments-meta">
                                    <h4>Lily Watson <span className="comments-date">January 12,2022 At 9.00am</span></h4>
                                  </div>
                                  <div className="comment-area">
                                    <p>I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, </p>
                                    <div className="comments-reply">
                                      <Link href="/" className="comment-reply-link"><span>Reply</span></Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <ul>
                              <li className="comment">
                                <div>
                                  <div className="comment-theme">
                                    <div className="comment-image"><Image src={blog5} alt="" /></div>
                                  </div>
                                  <div className="comment-main-area">
                                    <div className="comment-wrapper">
                                      <div className="comments-meta">
                                        <h4>John Abraham <span className="comments-date">January 12,2022 At 9.00am</span></h4>
                                      </div>
                                      <div className="comment-area">
                                        <p>I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, </p>
                                        <div className="comments-reply">
                                          <Link href="/" className="comment-reply-link"><span>Reply</span></Link>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </li>
                      <li className="comment">
                        <div>
                          <div className="comment-theme">
                            <div className="comment-image"><Image src={blog3} alt="" /></div>
                          </div>
                          <div className="comment-main-area">
                            <div className="comment-wrapper">
                              <div className="comments-meta">
                                <h4>John Abraham <span className="comments-date">January 12,2022 At 9.00am</span></h4>
                              </div>
                              <div className="comment-area">
                                <p>I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, </p>
                                <div className="comments-reply">
                                  <Link href="/" className="comment-reply-link"><span>Reply</span></Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ol>
                  </div>

                  {/* Comment form */}
                  <div className="comment-respond">
                    <h3 className="comment-reply-title">Post Comments</h3>
                    <form onSubmit={submitHandler} id="commentform" className="comment-form">
                      <div className="form-textarea">
                        <textarea id="comment" placeholder="Write Your Comments..."></textarea>
                      </div>
                      <div className="form-inputs">
                        <input placeholder="Website" type="url" />
                        <input placeholder="Name" type="text" />
                        <input placeholder="Email" type="email" />
                      </div>
                      <div className="form-submit">
                        <input id="submit" value="Post Comment" type="submit" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <BlogSidebar blLeft={props.blLeft} />
          </div>
        </div>
      </section>

      <Footer />
      <Scrollbar />
    </Fragment>
  );
};

export default BlogSingle;
