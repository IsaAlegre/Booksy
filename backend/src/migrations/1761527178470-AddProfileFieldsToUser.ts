import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProfileFieldsToUser1761527178470 implements MigrationInterface {
    name = 'AddProfileFieldsToUser1761527178470'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "profilePicture" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD "description" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profilePicture"`);
    }

}
