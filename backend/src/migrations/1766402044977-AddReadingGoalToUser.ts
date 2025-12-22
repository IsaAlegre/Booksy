import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReadingGoalToUser1766402044977 implements MigrationInterface {
    name = 'AddReadingGoalToUser1766402044977'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "yearlyGoal" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "goalYear" integer NOT NULL DEFAULT '2025'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "goalYear"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "yearlyGoal"`);
    }

}
