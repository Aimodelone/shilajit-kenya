import React, { useState } from 'react'
import Link from 'next/link'
import MobileMenu from '../MobileMenu/MobileMenu'


const Header = (props) => {
    const [menuActive, setMenuState] = useState(false);
    const SubmitHandler = (e) => {
        e.preventDefault()
    }

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    return (
        <header id="header">
            <div className={`wpo-site-header ${props.hclass}`} style={{ background: '#000' }} >
                <nav className="navigation navbar navbar-expand-lg navbar-light">
                    <div className="container-fluid">
                        <div className="row align-items-center">
                            <div className="col-lg-3 col-md-4 col-3 d-lg-none dl-block">
                                <div className="mobail-menu">
                                    <MobileMenu />
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4 col-6">
                                <div className="navbar-header">
                                    <Link onClick={ClickHandler} className="navbar-brand" href="/"><img src={props.Logo}
                                        alt="logo"/></Link>
                                </div>
                            </div>
                            <div className="col-lg-8 col-md-1 col-1">
                                <div id="navbar" className="collapse navbar-collapse navigation-holder">
                                    <button className="menu-close"><i className="ti-close"></i></button>
                                    <ul className="nav navbar-nav mb-2 mb-lg-0">
                                        <li className="menu-item-has-children">
                                            <Link onClick={ClickHandler} href="/">Home</Link>
                                        </li>
                                        <li><Link onClick={ClickHandler} href="/about">About us</Link></li>
                                        <li className="menu-item-has-children">
                                            <Link onClick={ClickHandler} href="/">Pages</Link>
                                            <ul className="sub-menu">
                                                <li><Link onClick={ClickHandler} href="/gallery">Gallery</Link></li>
                                                <li><Link onClick={ClickHandler} href="/team">Products</Link></li>
                                                <li><Link onClick={ClickHandler} href="/faq">FAQ</Link></li>
                                            </ul>
                                        </li>
                                        <li className="menu-item-has-children">
                                            <Link onClick={ClickHandler} href="/blog">Blog</Link>
                                        </li>
                                        <li><Link onClick={ClickHandler} href="/contact">Contact</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-3 col-2">
                                <div className="header-right">
                                    <div className="close-form">
                                        <a
                                           href="https://wa.me/254793313743?text=Welcome!%0A%0AWe%E2%80%99re%20now%20selling%20pure%20Himalayan%20Shilajit%20%E2%80%93%20known%20for%20boosting%20energy%20and%20vitality%20%E2%80%93%20for%20just%203500.%0A100%25%20natural%2C%20straight%20from%20the%20Himalayas%20mountains!%0A%0AWould%20you%20like%20to%20place%20an%20order%3F"
                                            className="theme-btn"
                                            style={{ color: "#000" }}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <span className="text">Buy Now</span>
                                            <span className="mobile">
                                            <i className="fi flaticon-shopping-bag"></i>
                                            </span>
                                        </a>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    )
}

export default Header;
