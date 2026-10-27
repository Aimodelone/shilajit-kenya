/**
 * components/BenefitsSection/BenefitsSection.js
 * Presentational section that renders Shilajit benefit cards.
 *
 * Props:
 *   benefits    — array of benefit objects from getStaticProps
 *   heading     — h2 section heading (shown inside wpo-section-title; omitted when falsy)
 *   label       — small <span> above heading (e.g. "Benefits")
 *   showViewAll — if true, show a "View all benefits" button below the cards
 */
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './BenefitsSection.module.css';

export default function BenefitsSection({
  benefits = [],
  heading = '',
  label = '',
  showViewAll = false,
}) {
  return (
    <div className={`wpo-campaign-area section-padding ${styles.section}`}>
      <div className="container">
        {heading && (
          <div className="wpo-section-title">
            {label && <span>{label}</span>}
            <h2>{heading}</h2>
          </div>
        )}

        <div className={styles.grid}>
          {benefits.map((benefit) => (
            <article key={benefit._id} className={styles.card}>
              {/* clickable image — aria-hidden so screen readers use the text link below */}
              <Link
                href={`/benefits/${benefit.slug}`}
                className={styles.imgLink}
                tabIndex={-1}
                aria-hidden="true"
              >
                <div className={styles.imgWrap}>
                  {benefit.image?.url ? (
                    <Image
                      src={benefit.image.url}
                      alt={benefit.image.alt || benefit.title}
                      fill
                      sizes="(max-width: 575px) 100vw, (max-width: 991px) 50vw, 33vw"
                      className={styles.img}
                    />
                  ) : (
                    <div className={styles.placeholder} aria-hidden="true" />
                  )}
                </div>
              </Link>

              <div className={styles.content}>
                {benefit.category && (
                  <small className={styles.category}>{benefit.category}</small>
                )}
                <h3 className={styles.title}>
                  <Link href={`/benefits/${benefit.slug}`}>{benefit.title}</Link>
                </h3>
                <p className={styles.desc}>{benefit.shortDescription}</p>
                <Link href={`/benefits/${benefit.slug}`} className={styles.readMore}>
                  Learn more →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {showViewAll && (
          <div className={styles.viewAll}>
            <Link href="/benefits" className="theme-btn">
              View all benefits
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
