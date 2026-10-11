import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from '../context/RouterContext';
import { AppIcon } from './ui/Icon';

export default function ProductCard({ product }) {
  const { lang, t, isRtl } = useLanguage();
  if (!product) return null;
  const title = product.title?.[lang] || product.title?.ku || '';
  const category = product.category?.[lang] || product.category?.ku || '';
  const href = `/product/${product.slug || product.id}`;

  return (
    <article className="furniture-card">
      <Link className="product-card-link" href={href}>
        <div className="furniture-card-img-wrap">
          <img src={product.images?.[0] || '/product_placeholder.jpg'} alt={title} loading="lazy" />
          {product.isNew && <span className="product-tag-new card-badge">{t.productCard.newBadge}</span>}
        </div>
        <div className="furniture-card-info">
          <span className="furniture-card-category">{category}</span>
          <h3 className="furniture-card-title">{title}</h3>
        </div>
      </Link>
      <Link className="card-view-product" href={href}>
        <span>{t.productCard.viewDetails}</span>
        <AppIcon name={isRtl ? 'arrow-left' : 'arrow-right'} size={15} />
      </Link>
    </article>
  );
}

