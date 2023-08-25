import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfig } from './app.config';
import { DatabaseConfig } from './database.config';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            cache: true,
        }),
    ],
    providers: [
        AppConfig,
        DatabaseConfig,
    ],
    exports: [
        AppConfig,
        DatabaseConfig,
    ],
})
export class EnvModule {}
