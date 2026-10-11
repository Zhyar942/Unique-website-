// Utility to detect Apple devices (iOS / iPadOS / macOS) and resolve smart map destinations

export const isAppleDevice = () => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || navigator.vendor || window.opera || '';
  const platform = navigator.userAgentData?.platform || navigator.platform || '';
  
  // Check for iOS, iPadOS, macOS
  const isApplePlatform = /Mac|iPhone|iPod|iPad/i.test(platform);
  const isAppleUa = /Macintosh|iPhone|iPad|iPod/i.test(ua);
  const isIpadOS = navigator.maxTouchPoints > 1 && /Macintosh/i.test(ua);

  return isApplePlatform || isAppleUa || isIpadOS;
};

export const getSmartMapUrl = (showroomInfo) => {
  const isApple = isAppleDevice();
  if (isApple && showroomInfo?.appleMapsUrl) {
    return showroomInfo.appleMapsUrl;
  }
  return showroomInfo?.googleMapsUrl || 'https://maps.app.goo.gl/TXuuREBi743xUPQh9';
};
