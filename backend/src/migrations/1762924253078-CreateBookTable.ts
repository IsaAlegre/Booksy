import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBookTable1762924253078 implements MigrationInterface {
    name = 'CreateBookTable1762924253078'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "books" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "books" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "books" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "books" ADD "title" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "books" DROP COLUMN "author"`);
        await queryRunner.query(`ALTER TABLE "books" ADD "author" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "books" DROP COLUMN "coverUrl"`);
        await queryRunner.query(`ALTER TABLE "books" ADD "coverUrl" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "books" DROP COLUMN "coverUrl"`);
        await queryRunner.query(`ALTER TABLE "books" ADD "coverUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "books" DROP COLUMN "author"`);
        await queryRunner.query(`ALTER TABLE "books" ADD "author" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "books" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "books" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "books" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "books" DROP COLUMN "createdAt"`);
    }

}
