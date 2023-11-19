import { Module } from '@nestjs/common';
import { AirportService } from './airport.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirportEntity } from './airport.entity';
import { AirportController } from './airport.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AirportEntity])],
  providers: [AirportService],
  controllers: [AirportController],
})
export class AirportModule {}
