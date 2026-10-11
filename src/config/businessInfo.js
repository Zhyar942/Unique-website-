// Centralized Business Information for UNIQUE FURNITURE
// Sulaymaniyah / Slemani, Kurdistan Region, Iraq

export const businessInfo = {
  name: 'UNIQUE FURNITURE',
  nameKu: 'یۆنیک مۆبیلیات',
  nameAr: 'يونيك للموبيليا',
  
  tagline: {
    ku: 'مۆبیلیاتی شاهانە بۆ ماڵ و ئۆفیس لە سلێمانی',
    ar: 'أثاث راقٍ للمنازل والمكاتب في السليمانية',
    en: 'Bespoke Home & Office Furniture in Sulaymaniyah',
  },

  // Social & Official Contact Numbers
  instagram: {
    url: 'https://www.instagram.com/unique.furniture.iq',
    handle: '@unique.furniture.iq',
    displayName: 'unique.furniture.iq'
  },
  
  // Real Local Display & International Technical Formats
  phoneDisplay: '0772 975 4844',
  phoneTechnical: '+9647729754844',
  phoneFormatted: '+964 772 975 4844',
  whatsappNumber: '9647729754844',
  whatsappDisplay: '0772 975 4844',
  email: 'contact@uniquefurniture.iq',

  // Showroom Location in Sulaymaniyah
  showroom: {
    cityKu: 'سلێمانی',
    cityAr: 'السليمانية',
    cityEn: 'Sulaymaniyah',
    addressKu: 'سلێمانی - شەقامی (60 مەتری) ڕزگاری تازە - بەرامبەر چوارچرای نوێ',
    addressAr: 'السليمانية - شارع (60 متري) رزكاري تازة - مقابل چوارچرا الجديد',
    addressEn: '60m Street, Rzgari Taza - Opposite New Chwarchra, Sulaymaniyah, Kurdistan Region',
    hoursKu: 'ڕۆژانە: ١٠:٠٠ی بەیانی تا ١٠:٠٠ی شەو',
    hoursAr: 'يومياً: ١٠:٠٠ صباحاً – ١٠:٠٠ مساءً',
    hoursEn: 'Daily: 10:00 AM – 10:00 PM',
    googleMapsUrl: 'https://maps.app.goo.gl/TXuuREBi743xUPQh9',
    appleMapsUrl: 'https://maps.apple.com/place?address=410-16,%20Iraq&coordinate=35.556753,45.405941&name=Unique%20Furniture&place-id=IE568D5D32F27F630&map=h',
    coordinates: { lat: 35.556753, lng: 45.405941 }
  }
};

/**
 * Generates a natural pre-filled WhatsApp inquiry link for a specific product
 */
export const getWhatsAppInquiryUrl = (productTitle, productCode = '', lang = 'ku', customNumber = null) => {
  let message = '';
  const codeText = productCode ? ` [${productCode}]` : '';

  if (lang === 'ku') {
    message = `سڵاو یۆنیک مۆبیلیات، دەمەوێت زانیاری زیاترم دەستبکەوێت دەربارەی ${productTitle}${codeText}.`;
  } else if (lang === 'ar') {
    message = `مرحباً يونيك للموبيليا، أود الحصول على مزيد من المعلومات حول ${productTitle}${codeText}.`;
  } else {
    message = `Hello Unique Furniture, I would like more information about ${productTitle}${codeText}.`;
  }

  const num = customNumber || businessInfo.whatsappNumber;
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
};

/**
 * Generates a natural generic WhatsApp consultation link
 */
export const getGeneralWhatsAppUrl = (lang = 'ku', customNumber = null) => {
  let message = '';
  if (lang === 'ku') {
    message = 'سڵاو یۆنیک مۆبیلیات، دەمەوێت زانیاری زیاترم دەستبکەوێت دەربارەی مۆبیلیاتەکانتان.';
  } else if (lang === 'ar') {
    message = 'مرحباً يونيك للموبيليا، أود الحصول على مزيد من المعلومات حول أثاثكم.';
  } else {
    message = 'Hello Unique Furniture, I would like more information about your furniture.';
  }

  const num = customNumber || businessInfo.whatsappNumber;
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
};

