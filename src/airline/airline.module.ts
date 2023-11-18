import { Module } from '@nestjs/common';
import { AirlineService } from './airline.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirlineEntity } from './airline.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AirlineEntity])],
  providers: [AirlineService],
})
export class AirlineModule {}
