import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogsEntity } from '../../database/entities/logs.entity';
import { ILogsEntity } from '../../database/models/logs.models';

@Injectable()
export class LogsRepository {

    private readonly logsRepository: Repository<LogsEntity>;

    constructor(
        @InjectRepository(LogsEntity)
        logsRepository: Repository<LogsEntity>,
    ) {
        this.logsRepository = logsRepository;
    }

    public async upsert(record: ILogsEntity): Promise<void> {
        const entity = this.logsRepository.create(record);
        await this.logsRepository.insert(entity);
    }

}
