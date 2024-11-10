import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserTable1629476208300 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: `uuid_generate_v4()`,
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'city',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'age',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'favoriteEvents',
            type: 'text',
            isArray: true,
            isNullable: true,
          },
          {
            name: 'privileges',
            type: 'varchar',
            default: `'User'`,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: `now()`,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: `now()`,
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
