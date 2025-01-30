interface EnvConfig {
    BASE_URL: string;
    FILE_UPLOAD_URL: string;
    APP_ID: string;
    ENV: string;
    LOGIN_URL: string;
}

export const envConfig: EnvConfig = {
    LOGIN_URL: import.meta.env.VITE_LOGIN_URL || '',
    BASE_URL: import.meta.env.VITE_BASE_URL || '',
    APP_ID: import.meta.env.VITE_APP_ID || '',
    FILE_UPLOAD_URL: import.meta.env.VITE_FILE_UPLOAD_URL,
    ENV: import.meta.env.VITE_APP_ENV,
}

export const isDev = envConfig.ENV === 'dev'
export const isProd = envConfig.ENV === 'prod'