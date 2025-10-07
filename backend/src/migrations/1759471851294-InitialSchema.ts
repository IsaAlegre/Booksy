import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1759471851294 implements MigrationInterface {
    name = 'InitialSchema1759471851294'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`CREATE TYPE "public"."libraries_status_enum" AS ENUM('to-read', 'reading', 'read')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_450a05c0c4de5b75ac8d34835b9" UNIQUE ("password"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "books" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "author" character varying NOT NULL, "genre" character varying, "year" integer, "pages" integer, "description" character varying, "coverUrl" character varying, CONSTRAINT "PK_f3f2f25a099d24e12545b70b022" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reviews" ("id" SERIAL NOT NULL, "comment" text, "rating" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "bookId" integer, CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "libraries" ("id" SERIAL NOT NULL, "status" "public"."libraries_status_enum" NOT NULL DEFAULT 'to-read', "userId" integer, "bookId" integer, CONSTRAINT "PK_505fedfcad00a09b3734b4223de" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "suggestions" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "author" character varying, "genre" character varying, "suggestion" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "seen" boolean NOT NULL DEFAULT false, "userId" integer, CONSTRAINT "PK_745bbcb037ac379969b5fc7b352" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_cab4e55252a9c18a27e81415299" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "libraries" ADD CONSTRAINT "FK_e55a7b19f5366a03f538b8177da" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "libraries" ADD CONSTRAINT "FK_10738449337f239af3b81e298b5" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "suggestions" ADD CONSTRAINT "FK_ea6bc51ad9de266b0c8bb46230b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "suggestions" DROP CONSTRAINT "FK_ea6bc51ad9de266b0c8bb46230b"`);
        await queryRunner.query(`ALTER TABLE "libraries" DROP CONSTRAINT "FK_10738449337f239af3b81e298b5"`);
        await queryRunner.query(`ALTER TABLE "libraries" DROP CONSTRAINT "FK_e55a7b19f5366a03f538b8177da"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_cab4e55252a9c18a27e81415299"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f"`);
        await queryRunner.query(`DROP TABLE "suggestions"`);
        await queryRunner.query(`DROP TABLE "libraries"`);
        await queryRunner.query(`DROP TABLE "reviews"`);
        await queryRunner.query(`DROP TABLE "books"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."libraries_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
