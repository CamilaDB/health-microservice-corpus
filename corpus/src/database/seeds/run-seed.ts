import { DataSource } from 'typeorm';
import { Patient } from 'src/patient/entities/patient.entity';
import { Encounter } from 'src/encounter/entities/encounter.entity';
import { Order } from 'src/order/entities/order.entity';
import { Result } from 'src/result/entities/result.entity';
import { seed } from './seed';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? '5432'),
  username: process.env.DB_USER ?? 'health',
  password: process.env.DB_PASSWORD ?? 'health',
  database: process.env.DB_NAME ?? 'health_corpus',
  entities: [Patient, Encounter, Order, Result],
  synchronize: false,
});

dataSource
  .initialize()
  .then(() => seed(dataSource))
  .then(() => dataSource.destroy())
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
