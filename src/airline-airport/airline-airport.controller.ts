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
import { AirlineAirportService } from './airline-airport.service';
import { AirlineEntity } from '../airline/airline.entity';
import { AirportEntity } from '../airport/airport.entity';
import { AirportDto } from '../airport/dto/airport.dto';
import { plainToInstance } from 'class-transformer';

@Controller('airlines')
export class AirlineAirportController {
  constructor(private readonly airlineAirportService: AirlineAirportService) {}

  @Post(':airlineId/airports/:airportId')
  async addAirportToAirline(
    @Param('airportId') airportId: string,
    @Param('airlineId') airlineId: string,
  ): Promise<AirlineEntity> {
    return this.airlineAirportService.addAirportToAirline(airportId, airlineId);
  }

  @Get(':airlineId/airports')
  async findAirportsFromAirline(
    @Param('airlineId') airlineId: string,
  ): Promise<AirportEntity[]> {
    return this.airlineAirportService.findAirportsFromAirline(airlineId);
  }

  @Get(':airlineId/airports/:airportId')
  async findAirportFromAirline(
    @Param('airlineId') airlineId: string,
    @Param('airportId') airportId: string,
  ): Promise<AirportEntity> {
    return this.airlineAirportService.findAirportFromAirline(
      airlineId,
      airportId,
    );
  }

  @Put(':airlineId/airports')
  async updateAirportsFromAirline(
    @Param('airlineId') airlineId: string,
    @Body() airportsDto: AirportDto[],
  ): Promise<AirlineEntity> {
    const airports = plainToInstance(AirportEntity, airportsDto);
    return this.airlineAirportService.updateAirportsFromAirline(
      airlineId,
      airports,
    );
  }

  @Delete(':airlineId/airports/:airportId')
  @HttpCode(204)
  async deleteAirportFromAirline(
    @Param('airlineId') airlineId: string,
    @Param('airportId') airportId: string,
  ) {
    return this.airlineAirportService.deleteAirportFromAirline(
      airlineId,
      airportId,
    );
  }
}
