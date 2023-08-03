import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigration implements MigrationInterface {
  name = '$npmConfigName1690806626757';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "login" character varying NOT NULL, "password" character varying NOT NULL, "hashedRt" character varying, "version" integer NOT NULL, "online" boolean NOT NULL, "targetForMessage" character varying, "messageForWho" text NOT NULL, "socketID" character varying, "avatar" character varying, "createdAt" bigint NOT NULL, "updatedAt" bigint NOT NULL, CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "message_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "senderName" character varying NOT NULL, "receiverName" character varying NOT NULL, "senderId" character varying NOT NULL, "receiverId" character varying NOT NULL, "imageSrc" character varying NOT NULL, "fileId" integer NOT NULL, "fileName" character varying NOT NULL, "fileSize" integer NOT NULL, "message" character varying NOT NULL, "likeCount" integer NOT NULL DEFAULT '0', "whoLiked" text NOT NULL DEFAULT '', "createdAt" character varying NOT NULL, "createdDateForSort" bigint NOT NULL, CONSTRAINT "PK_45bb3707fbb99a73e831fee41e0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "private_message_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "senderName" character varying NOT NULL, "receiverName" character varying NOT NULL, "message" character varying NOT NULL, "senderId" character varying NOT NULL, "receiverId" character varying NOT NULL, "imageSrc" character varying NOT NULL, "fileId" integer NOT NULL, "fileName" character varying NOT NULL, "fileSize" integer NOT NULL, "likeCount" integer NOT NULL DEFAULT '0', "whoLiked" text NOT NULL DEFAULT '', "createdAt" character varying NOT NULL, "createdDateForSort" bigint NOT NULL, CONSTRAINT "PK_baca27b37c043805a704c3d8950" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "local_file" ("id" SERIAL NOT NULL, "filename" character varying NOT NULL, "path" character varying NOT NULL, "mimetype" character varying NOT NULL, CONSTRAINT "PK_e391e00bc7475063fd45ee3f38d" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "local_file"`);
    await queryRunner.query(`DROP TABLE "private_message_entity"`);
    await queryRunner.query(`DROP TABLE "message_entity"`);
    await queryRunner.query(`DROP TABLE "user_entity"`);
  }
}
