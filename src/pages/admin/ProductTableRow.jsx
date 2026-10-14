import React from 'react';
import { AppIcon } from '../../components/ui/Icon';

const ProductTableRow = React.memo(function ProductTableRow({
  product,
  onEdit,
  onDuplicate,
  onDelete,
  onTogglePublish,
  onToggleFeatured,
  onToggleNew
}) {
  const isPublished = product.published !== false;
  const isFeatured = Boolean(product.featured);
  const isNew = Boolean(product.isNew);
  const isBestseller = Boolean(product.isBestseller);
  const slug = product.slug || product.id;

  return (
    <tr className={`admin-table-row ${!isPublished ? 'is-draft' : ''}`}>
      {/* 1. Thumbnail */}
      <td style={{ width: '70px' }}>
        <div className="admin-product-thumb">
          <img
            src={product.images?.[0] || '/product_placeholder.jpg'}
            alt={product.title?.en || 'Product'}
            loading="lazy"
          />
        </div>
      </td>

      {/* 2. Product Title & Code */}
      <td>
        <div className="admin-title-cell">
          <div className="admin-title-primary">
            {product.title?.en || '(Untitled Product)'}
          </div>
          <div className="admin-title-secondary">
            <span className="admin-sku-pill">{product.code || 'NO-SKU'}</span>
            {product.title?.ku && (
              <>
                <span>·</span>
                <span className="admin-kurdish-subtitle">{product.title.ku}</span>
              </>
            )}
            {product.productType && (
              <>
                <span>·</span>
                <span style={{ fontSize: '0.74rem', color: '#71717a' }}>{product.productType}</span>
              </>
            )}
          </div>
        </div>
      </td>

      {/* 3. Type & Category */}
      <td>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span className={`admin-badge-type ${product.type || 'home'}`}>
              {product.type === 'office' ? 'Office' : 'Home'}
            </span>
            <span className="admin-badge-category">
              {product.category?.ku || product.category?.en || product.categoryKey || 'General'}
            </span>
          </div>
          {product.category?.en && product.category?.ku && (
            <span style={{ fontSize: '0.74rem', color: '#a1a1aa' }}>
              {product.category.en}
            </span>
          )}
          {Array.isArray(product.collections) && product.collections.length > 0 && (
            <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', marginTop: '2px' }}>
              {product.collections.slice(0, 2).map((col, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.68rem',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    backgroundColor: '#f4f4f5',
                    color: '#52525b'
                  }}
                >
                  {col}
                </span>
              ))}
            </div>
          )}
        </div>
      </td>

      {/* 4. Visibility (1-Click Toggle) */}
      <td>
        <button
          type="button"
          onClick={() => onTogglePublish(product.id)}
          className={`admin-toggle-btn ${isPublished ? 'published' : 'draft'}`}
          title={isPublished ? 'Click to unpublish (hide from website)' : 'Click to publish on website'}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: isPublished ? '#10b981' : '#a1a1aa'
            }}
          />
          <span>{isPublished ? 'Published' : 'Draft'}</span>
        </button>
      </td>

      {/* 5. Featured on Home (1-Click Toggle) */}
      <td>
        <button
          type="button"
          onClick={() => onToggleFeatured(product.id)}
          className="admin-star-btn"
          title={isFeatured ? 'Featured on homepage (click to remove)' : 'Click to feature on homepage'}
        >
          <AppIcon
            name="star"
            set={isFeatured ? 'bold' : 'light'}
            color={isFeatured ? '#f59e0b' : '#a1a1aa'}
            size={18}
          />
        </button>
      </td>

      {/* 6. New Arrival & Bestseller */}
      <td>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <button
            type="button"
            onClick={() => onToggleNew(product.id)}
            className={`admin-toggle-btn ${isNew ? 'new-active' : 'new-inactive'}`}
            title={isNew ? 'Marked as New (click to change)' : 'Standard item (click to mark as New)'}
          >
            <span>{isNew ? 'NEW' : '—'}</span>
          </button>
          {isBestseller && (
            <span
              style={{
                fontSize: '0.68rem',
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: '#ede9fe',
                color: '#6d28d9'
              }}
              title="Marked as Bestseller"
            >
              Top
            </span>
          )}
        </div>
      </td>

      {/* 7. Quick Actions */}
      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
        <div className="admin-action-btn-group">
          {/* View Live on Website */}
          <a
            href={`/product/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="admin-icon-btn"
            title="View Live on Website"
          >
            <AppIcon name="discovery" size={15} />
          </a>

          {/* Quick Duplicate */}
          <button
            type="button"
            onClick={() => onDuplicate(product)}
            className="admin-icon-btn"
            title="Duplicate piece (quick copy)"
          >
            <AppIcon name="document" size={15} />
          </button>

          {/* Edit */}
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="admin-icon-btn"
            title="Edit all fields"
          >
            <AppIcon name="edit" size={15} />
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={() => onDelete(product)}
            className="admin-icon-btn danger"
            title="Delete piece"
          >
            <AppIcon name="trash" size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
});

export default ProductTableRow;
