import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsEntity } from '../../database/entities/logs.entity';
import { LogsInterceptor } from './logs.interceptor';
import { LogsRepository } from './logs.repository';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([
            LogsEntity,
        ]),
    ],
    providers: [
        LogsInterceptor,
        LogsRepository,
    ],
    exports: [
        LogsRepository,
    ],
})
export class LogsModule {}
