import React, { useState } from 'react'
import Link from 'next/link'
import HeaderTopbar from '../HeaderTopbar/HeaderTopbar'
import MobileMenu from '../MobileMenu/MobileMenu'
import Logo from '/public/images/logo2.png'
import Image from 'next/image'

const Header2 = (props) => {
    const [menuActive, setMenuState] = useState(false);
    const SubmitHandler = (e) => {
        e.preventDefault()
    }

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    return (
        <header id="header">
            <HeaderTopbar />
            <div className="wpo-site-header wpo-site-header-s2">
                <nav className="navigation navbar navbar-expand-lg navbar-light">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-3 col-md-3 col-3 d-lg-none dl-block">
                                <div className="mobail-menu">
                                    <MobileMenu />
                                </div>
                            </div>
                            <div className="col-md-6 col-6 d-lg-none dl-block">
                                <div className="navbar-header">
                                    <Link onClick={ClickHandler} className="navbar-brand" href="/"><Image src={Logo}
                                        alt="logo" /></Link>
                                </div>
                            </div>
                            <div className="col col-lg-7 col-md-1 col-1">
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
                            <div className="col-lg-5 col-md-2 col-2">
                                <div className="header-right">
                                    <div className="social">
                                        <ul>
                                            <li><Link href="https://facebook.com/shilajitkenya"><i className="fi flaticon-facebook-app-symbol"></i></Link></li>
                                            <li><Link href="https://instagram.com/shilajitkenya"><i className="fi flaticon-instagram-1"></i></Link></li>
                                        </ul>
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

export default Header2;
