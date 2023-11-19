import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AirportService } from './airport.service';
import { AirportEntity } from './airport.entity';
import { AirportDto } from './dto/airport.dto';
import { plainToInstance } from 'class-transformer';

@Controller('airports')
export class AirportController {
  constructor(private readonly airportService: AirportService) {}

  @Get()
  async findAll(): Promise<AirportEntity[]> {
    return await this.airportService.findAll();
  }

  @Get(':airportId')
  async findOne(@Param('airportId') airportId: string): Promise<AirportEntity> {
    return await this.airportService.findOne(airportId);
  }

  @Post()
  async create(airportDto: AirportDto): Promise<AirportEntity> {
    const airport: AirportEntity = plainToInstance(AirportEntity, airportDto);
    return await this.airportService.create(airport);
  }

  @Put(':airportId')
  async update(
    @Param('airportId') airportId: string,
    @Body() airportDto: AirportDto,
  ): Promise<AirportEntity> {
    const airport: AirportEntity = plainToInstance(AirportEntity, airportDto);
    return await this.airportService.update(airportId, airport);
  }

  @Delete(':airportId')
  @HttpCode(204)
  async delete(@Param('airportId') airportId: string): Promise<void> {
    await this.airportService.delete(airportId);
  }
}
