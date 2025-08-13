import React from 'react'
import Services from '../../api/service';
import Link from 'next/link'
import blogs from '../../api/blogs'
import Image from 'next/image';

const ServiceSidebar = (props) => {

    const SubmitHandler = (e) => {
        e.preventDefault()
    }

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    return (
        <div className="blog-sidebar">
            <div className="widget search-widget">
                <form onSubmit={SubmitHandler}>
                    <div>
                        <input type="text" className="form-control" placeholder="Search Post.." />
                        <button type="submit"><i className="ti-search"></i></button>
                    </div>
                </form>
            </div>
            <div className="widget category-widget">
                <h3>Services</h3>
                <ul>
                    {Services.slice(0, 5).map((service, Sitem) => (
                        <li key={Sitem}><Link onClick={ClickHandler} href={'/service-single/[slug]'} as={`/service-single/${service.slug}`}>{service.sTitle}</Link></li>
                    ))}
                </ul>
            </div>
            <div className="widget recent-post-widget">
                <h3>Related Posts</h3>
                <div className="posts">
                    {blogs.map((blog, bl) => (
                        <div className="post" key={bl}>
                            <div className="img-holder">
                                <Image src={blog.screens} alt="" />
                            </div>
                            <div className="details">
                                <h4><Link onClick={ClickHandler} href={'/blog-single/[slug]'} as={`/blog-single/${blog.slug}`}>{blog.title}</Link></h4>
                                <span className="date">{blog.create_at}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="widget tag-widget">
                <h3>Tags</h3>
                <ul>
                    <li><Link href="/">ELECTION</Link></li>
                    <li><Link href="/">Campaign</Link></li>
                    <li><Link href="/">STATEMENT</Link></li>
                    <li><Link href="/">POLITICS</Link></li>
                    <li><Link href="/">PRESS</Link></li>
                    <li><Link href="/">SOCIAL</Link></li>
                    <li><Link href="/">SECURITY</Link></li>
                    <li><Link href="/">VOTE</Link></li>
                </ul>
            </div>
        </div>

    )
}

export default ServiceSidebar;
