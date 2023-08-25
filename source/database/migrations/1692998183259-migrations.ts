import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1692998183259 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE IF NOT EXISTS `warehouse`.`logs` (`id` varchar(36) NOT NULL, `ip` varchar(15) NOT NULL, `code` int NOT NULL, `route` text NOT NULL, `method` varchar(100) NOT NULL, `duration` int NOT NULL, `headers` json NOT NULL, `body` json NOT NULL, `query` json NOT NULL, `req_bytes` int NOT NULL, `res_bytes` int NOT NULL, `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE IF EXISTS `warehouse`.`logs`');
    }

}
