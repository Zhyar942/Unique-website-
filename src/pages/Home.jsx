import React, { useState } from 'react';
import { AppIcon } from '../components/ui/Icon';
import RoomIcon from '../components/ui/RoomIcon';
import CollectionFilters from '../components/ui/CollectionFilters';
import { WhatsAppIcon } from '../components/Icons';
import { useLanguage } from '../context/LanguageContext';
import { Link } from '../context/RouterContext';
import { useCatalog } from '../context/CatalogContext';
import { useMapModal } from '../context/MapModalContext';
import { businessInfo, getGeneralWhatsAppUrl } from '../config/businessInfo';
import { homeCopy } from '../data/homeCopy';
import ShoppingHero from '../components/ShoppingHero';
import ProductCard from '../components/ProductCard';
import useScrollReveal from '../hooks/useScrollReveal';

export default function Home() {
  const { lang, t, isRtl } = useLanguage();
  const { products, settings } = useCatalog();
  const { openMapModal } = useMapModal();
  const info = settings || businessInfo;
  const [filter, setFilter] = useState('home');
  const revealRef = useScrollReveal(`${filter}:${products.length}`);
  const copy = homeCopy[lang] || homeCopy.en;
  const published = products.filter(product => product.published !== false);
  const selection = published.filter(product => filter === 'new' ? product.isNew : product.type === filter);
  const featured = [...selection].sort((a, b) => Number(!!b.featured) - Number(!!a.featured)).slice(0, 4);
  const arrow = isRtl ? 'arrow-left' : 'arrow-right';
  const address = info.showroom[lang === 'ku' ? 'addressKu' : lang === 'ar' ? 'addressAr' : 'addressEn'];
  const hours = info.showroom[lang === 'ku' ? 'hoursKu' : lang === 'ar' ? 'hoursAr' : 'hoursEn'];


  return <div className="home-page refined-home" ref={revealRef}>
    <ShoppingHero />
    <div className="service-strip container">
      {[
        { name: 'star', key: 'heritage' },
        { name: 'discovery', key: 'materials' },
        { name: 'shield-done', key: 'guarantee' }
      ].map(({ name, key }, index) => (
        <div className="service-item" data-reveal key={key}>
          <AppIcon name={name} size={26} color="#8b7354" />
          <div>
            <strong>{copy.service[index]}</strong>
            <span>{copy.serviceNotes[index]}</span>
          </div>
        </div>
      ))}
    </div>
    <section className="home-section container" aria-labelledby="rooms-title">
      <div className="section-heading" data-reveal>
        <div><span className="section-kicker">01 / {t.rooms.title}</span><h2 id="rooms-title">{copy.rooms}</h2></div><p>{copy.roomIntro}</p>
      </div>
      <nav className="room-nav" aria-label={t.rooms.title}>
        {['living', 'dining', 'bedroom', 'executive', 'meeting'].map(key => <Link key={key} data-reveal className="room-link"
          href={`/products?cat=${key}`}>
          <RoomIcon name={key} /><span>{t.categories[key]}</span><AppIcon name={arrow} size={16} />
        </Link>)}
      </nav>
    </section>
    <section className="home-section collection-section container" aria-labelledby="collection-title">
      <div className="section-heading" data-reveal>
        <div><span className="section-kicker">02 / {t.featured.title}</span><h2 id="collection-title">{copy.collection}</h2></div>
        <Link className="editorial-link" href="/products">{copy.all}<AppIcon name={arrow} size={18} /></Link>
      </div>
      <div className="collection-toolbar">
        <CollectionFilters options={[{ id: 'home', label: copy.home }, { id: 'office', label: copy.work }, { id: 'new', label: copy.new }]}
          value={filter} onChange={setFilter} label={copy.collection} /><p role="status">{selection.length} {copy.pieces}</p>
      </div>
      <div className="home-product-grid" data-count={featured.length}>{featured.map(product => <ProductCard key={`${filter}:${product.id}`} product={product} />)}</div>
      {!featured.length && <p className="collection-empty">{copy.empty}</p>}
    </section>
    <section className="home-section container" aria-labelledby="visit-title">
      <div className="visit-panel">
        <div className="visit-image" data-reveal>
          <img src="/banner_interior.jpg" alt={t.brandName} loading="lazy" className="parallax-layer" />
        </div>
        <div className="visit-copy" data-reveal>
          <span className="section-kicker">03 / {copy.visitLabel}</span>
          <h2 id="visit-title">{copy.visitTitle}</h2>
          <p>{copy.visitBody}</p>
          <dl className="visit-details">
            <div><dt><AppIcon name="location" size={19} />{t.showroom.addressLabel}</dt><dd>{address}</dd></div>
            <div><dt><AppIcon name="time" size={19} />{t.showroom.hoursLabel}</dt><dd>{hours}</dd></div>
          </dl>
          <div className="visit-actions">
            <button type="button" className="btn btn-primary btn-lift" onClick={openMapModal} style={{ cursor: 'pointer' }}>
              {copy.directions}
              <AppIcon name={arrow} size={17} />
            </button>
            <a
              className="btn btn-lift btn-visit-whatsapp"
              href={getGeneralWhatsAppUrl(lang, info.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={copy.question}
            >
              <span className="btn-whatsapp-icon-wrap" aria-hidden="true">
                <WhatsAppIcon size={18} color="#25d366" />
              </span>
              <span>{copy.question}</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  </div>;
}
