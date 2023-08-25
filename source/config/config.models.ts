export interface IEnv {
    APP_PORT: number;

    DATABASE_HOST: string;
    DATABASE_PORT: number;
    DATABASE_USER: string;
    DATABASE_PASS: string;
    DATABASE_DB: string;
    DATABASE_SYNC: boolean;
}
