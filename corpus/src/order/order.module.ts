import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { EncounterModule } from 'src/encounter/encounter.module';
import { OrderRepository } from './order.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), EncounterModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
  exports: [OrderService],
})
export class OrderModule {}
