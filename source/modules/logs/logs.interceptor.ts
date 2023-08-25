import {
    CallHandler,
    ExecutionContext,
    HttpException,
    Injectable,
    Logger,
    NestInterceptor,
} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { Observable, catchError, tap } from 'rxjs';
import { ILogsEntity } from '../../database/models/logs.models';
import { ILogsStd } from './logs.models';
import { LogsRepository } from './logs.repository';
import { LogsUtilities } from './logs.utilities';

@Injectable()
export class LogsInterceptor implements NestInterceptor {

    private readonly logger: Logger;
    private readonly logsRepository: LogsRepository;

    constructor(logsRepository: LogsRepository) {
        this.logger = new Logger(LogsInterceptor.name);
        this.logsRepository = logsRepository;
    }

    public intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const startRequest = Date.now();

        const request = context.switchToHttp().getRequest<FastifyRequest>();
        const reqSizeBytes = LogsUtilities.getSizeBytes(request.body ?? request.query);

        const getEntity = (props: ILogsStd): ILogsEntity => ({
            ip: request.ip,
            code: props.status,
            route: request.routerPath,
            method: request.method,
            duration: props.duration,
            headers: JSON.stringify(request.headers ?? {}),
            body: JSON.stringify(request.body ?? {}),
            query: JSON.stringify(request.query ?? {}),
            req_bytes: reqSizeBytes,
            res_bytes: props.bytes,
            updated_at: new Date(),
        });

        const getLog = (props: ILogsStd): string => {
            const durationHuman = LogsUtilities.getDurationHuman(props.duration);
            const resSizeHuman = LogsUtilities.getBytesHuman(props.bytes);
            const reqSizeHuman = LogsUtilities.getBytesHuman(reqSizeBytes);

            const parts = [
                request.routerPath,
                request.method,
                props.status,
                resSizeHuman,
                reqSizeHuman,
                durationHuman,
            ].join('; ');

            return parts;
        };

        return next.handle().pipe(
            tap((payload) => {
                const reply = context.switchToHttp().getResponse<FastifyReply>();
                const bytesUInt = LogsUtilities.getSizeBytes(payload);

                const props: ILogsStd = {
                    status: reply.statusCode,
                    bytes: bytesUInt,
                    duration: Date.now() - startRequest,
                };

                const entity = getEntity(props);
                this.logsRepository
                    .upsert(entity)
                    .catch(this.logger.error);

                const std = getLog(props);
                this.logger.log(std);
            }),
            catchError((caught: HttpException) => {
                const bytesUInt = LogsUtilities.getSizeBytes(caught);

                const props: ILogsStd = {
                    status: LogsUtilities.getStatus(caught),
                    bytes: bytesUInt,
                    duration: Date.now() - startRequest,
                };

                const entity = getEntity(props);
                this.logsRepository
                    .upsert(entity)
                    .catch(this.logger.error);

                const std = getLog(props);
                this.logger.log(std);

                throw caught;
            }),
        );
    }

}
