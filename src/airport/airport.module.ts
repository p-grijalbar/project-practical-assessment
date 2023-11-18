import { Module } from '@nestjs/common';
import { AirportService } from './airport.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirportEntity } from './airport.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AirportEntity])],
  providers: [AirportService],
})
export class AirportModule {}
