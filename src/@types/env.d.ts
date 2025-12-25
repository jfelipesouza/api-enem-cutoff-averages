namespace NodeJS {
  export interface ProcessEnv {
    PORT: number
    ORIGIN: string
    JWT_SECRET: string
    JWT_EXPIRES_IN: string
    JWT_REFRESH_SECRET: string
    JWT_REFRESH_EXPIRES_IN: string
  }
}
