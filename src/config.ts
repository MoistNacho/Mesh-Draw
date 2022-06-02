import { Configuration as NaverOpenApiConfig } from "apiClients/naverOpenApi";

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
  naverOpenApi: {
    basePath: "https://openapi.naver.com/v1/",
    ncpClientId: process.env.NCP_CLIENT_ID,
    maps: {
      basePath: "https://openapi.map.naver.com/openapi/v3/maps.js",
      submodules: "geocoder",
    },
  },
};

export default config;

export const naverOpenApiConfig = new NaverOpenApiConfig({
  basePath: config.naverOpenApi.basePath,
});

const { ncpClientId, maps } = config.naverOpenApi;

export const getNaverMapsApiUrl = () =>
  `${maps.basePath}?ncpClientId=${ncpClientId}&submodules=${maps.submodules}`;
