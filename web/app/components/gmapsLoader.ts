let loadingPromise: Promise<void> | null = null;

export function loadGmaps(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject('no window');
  if ((window as any).google?.maps) return Promise.resolve();
  if (loadingPromise) return loadingPromise;
  loadingPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAz-iYhUlWrRAL7JiKm4rBYke3Oxah8trk&libraries=marker';
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Maps no cargó'));
    document.head.appendChild(s);
  });
  return loadingPromise;
}
