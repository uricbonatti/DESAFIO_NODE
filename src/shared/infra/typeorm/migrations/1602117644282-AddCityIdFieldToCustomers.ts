import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  TableColumn,
} from 'typeorm';

export default class AddCityIdFieldToCustomers1602117644282
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'customers',
      new TableColumn({
        name: 'city_id',
        type: 'uuid',
        isNullable: true,
      }),
    );
    await queryRunner.createForeignKey(
      'customers',
      new TableForeignKey({
        name: 'CustomerCity',
        columnNames: ['city_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'cities',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('customers', 'CustomerCity');
    await queryRunner.dropColumn('customers', 'city_id');
  }
}
