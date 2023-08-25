import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IEnv } from './config.models';

@Injectable()
export class AppConfig {

    private readonly configService: ConfigService<IEnv>;

    constructor(configService: ConfigService<IEnv>) {
        this.configService = configService;
    }

    public get port(): number {
        const val = this.configService.getOrThrow('APP_PORT', { infer: true });
        return val;
    }

}
