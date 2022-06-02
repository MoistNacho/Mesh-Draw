declare namespace NodeJS {
  export interface ProcessEnv {
    ENV: "local" | "dev1" | "qa1" | "qa2" | "qa3" | "prod" | "prod-beta";
    SENTRY_URL: string;
    OAUTH_BASE_PATH: string;
    OAUTH_CLIENT_ID: string;
    OAUTH_CLIENT_SECRET: string;
    GOOGLE_ANALYTICS_TRACKING_ID: string;
    NCP_CLIENT_ID: string;
    NODE_ENV: string;
    FEATURE_CONTEXT?: string;
  }
}
