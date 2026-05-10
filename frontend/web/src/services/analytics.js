// Servicio de analytics simple
export function trackPageView(page) {
  if (typeof window !== 'undefined') {
    console.log('[Analytics] Page view:', page);
    // Aquí iría Google Analytics o Plausible
  }
}

export function trackEvent(category, action, label) {
  if (typeof window !== 'undefined') {
    console.log('[Analytics] Event:', category, action, label);
  }
}
