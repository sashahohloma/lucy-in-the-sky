import { serialize } from 'v8';
import { HttpException, HttpStatus } from '@nestjs/common';
import bytes from 'bytes';

export class LogsUtilities {

    public static getSizeBytes(data: unknown): number {
        const size = serialize(data).byteLength;
        return size;
    }

    public static getBytesHuman(size: number): string {
        const human = bytes(size, {
            fixedDecimals: true,
        });
        return human;
    }

    public static getDurationHuman(value: number): string {
        const result = value.toString().concat(' ms');
        return result;
    }

    public static getStatus(reply: unknown): number {
        if (reply instanceof HttpException) {
            return reply.getStatus();
        }
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }

}
