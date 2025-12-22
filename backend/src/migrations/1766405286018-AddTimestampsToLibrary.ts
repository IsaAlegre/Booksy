import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTimestampsToLibrary1766405286018 implements MigrationInterface {
    name = 'AddTimestampsToLibrary1766405286018'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "libraries" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "libraries" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "libraries" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "libraries" DROP COLUMN "createdAt"`);
    }

}
