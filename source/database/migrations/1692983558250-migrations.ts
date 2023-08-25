import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1692983558250 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE IF NOT EXISTS `product` (`id` varchar(9) NOT NULL, `title` text NOT NULL, `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB');
        await queryRunner.query('CREATE TABLE IF NOT EXISTS `rack` (`id` varchar(200) NOT NULL, `title` text NOT NULL, `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB');
        await queryRunner.query('CREATE TABLE IF NOT EXISTS `section` (`id` int NOT NULL, `title` text NOT NULL, `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB');
        await queryRunner.query('CREATE TABLE IF NOT EXISTS `location` (`id` int NOT NULL AUTO_INCREMENT, `quantity` int NOT NULL, `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `rack` varchar(200) NULL, `section` int NULL, `product` varchar(9) NULL, INDEX `location_product_index` (`product`), UNIQUE INDEX `location_unique_index` (`rack`, `section`, `product`), PRIMARY KEY (`id`)) ENGINE=InnoDB');
        await queryRunner.query('ALTER TABLE `location` ADD CONSTRAINT `FK_f29e548c28c84fef2d70c126bd3` FOREIGN KEY (`rack`) REFERENCES `rack`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `location` ADD CONSTRAINT `FK_f6db47b3c05309b335d8a5c32f2` FOREIGN KEY (`section`) REFERENCES `section`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE `location` ADD CONSTRAINT `FK_9f937343f315ad6218fff9a1ac7` FOREIGN KEY (`product`) REFERENCES `product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `location` DROP FOREIGN KEY `FK_9f937343f315ad6218fff9a1ac7`');
        await queryRunner.query('ALTER TABLE `location` DROP FOREIGN KEY `FK_f6db47b3c05309b335d8a5c32f2`');
        await queryRunner.query('ALTER TABLE `location` DROP FOREIGN KEY `FK_f29e548c28c84fef2d70c126bd3`');
        await queryRunner.query('DROP INDEX IF EXISTS `location_unique_index` ON `location`');
        await queryRunner.query('DROP INDEX IF EXISTS `location_product_index` ON `location`');
        await queryRunner.query('DROP TABLE IF EXISTS `location`');
        await queryRunner.query('DROP TABLE IF EXISTS `section`');
        await queryRunner.query('DROP TABLE IF EXISTS `rack`');
        await queryRunner.query('DROP TABLE IF EXISTS `product`');
    }

}
