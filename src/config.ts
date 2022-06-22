const config = {
  routerBaseName: process.env.FEATURE_CONTEXT,
  version: VERSION,
  isSnapping: navigator.userAgent === "ReactSnap",
  oauth: {
    basePath: process.env.OAUTH_BASE_PATH,
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
  },
  googleAnalytics: {
    trackingId: process.env.GOOGLE_ANALYTICS_TRACKING_ID,
  },
};

export default config;
