import React from 'react'
import Link from 'next/link'
import styles from './PageTitle.module.css'

const PageTitle = (props) => {
    const Heading = props.as || 'h2';
    return (
        <section className="wpo-page-title">
            <div className="container">
                <div className="row">
                    <div className="col col-xs-12">
                        <div className="wpo-breadcumb-wrap">
                            <Heading className={styles.title}>{props.pageTitle}</Heading>
                            <ol className={`wpo-breadcumb-wrap ${styles.crumbs}`}>
                                <li><Link href="/">Home</Link></li>
                                <li><span>{props.pagesub}</span></li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PageTitle;
