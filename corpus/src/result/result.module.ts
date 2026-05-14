import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Result } from './entities/result.entity';
import { ResultService } from './result.service';
import { ResultController } from './result.controller';
import { OrderModule } from '../order/order.module';
import { ResultRepository } from './result.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Result]), OrderModule],
  controllers: [ResultController],
  providers: [ResultService, ResultRepository],
  exports: [ResultService],
})
export class ResultModule {}
