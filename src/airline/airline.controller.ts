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
import { plainToInstance } from 'class-transformer';
import { AirlineService } from './airline.service';
import { AirlineEntity } from './airline.entity';
import { AirlineDto } from './dto/airline.dto';

@Controller('airlines')
export class AirlineController {
  constructor(private readonly airlineService: AirlineService) {}

  @Get()
  async findAll(): Promise<AirlineEntity[]> {
    return await this.airlineService.findAll();
  }

  @Get(':airlineId')
  async findOne(@Param('airlineId') airlineId: string): Promise<AirlineEntity> {
    return await this.airlineService.findOne(airlineId);
  }

  @Post()
  async create(@Body() airlineDto: AirlineDto): Promise<AirlineEntity> {
    const airline: AirlineEntity = plainToInstance(AirlineEntity, airlineDto);
    return await this.airlineService.create(airline);
  }

  @Put(':airlineId')
  async update(
    @Param('airlineId') airlineId: string,
    @Body() airlineDto: AirlineDto,
  ): Promise<AirlineEntity> {
    const airline: AirlineEntity = plainToInstance(AirlineEntity, airlineDto);
    return await this.airlineService.update(airlineId, airline);
  }

  @Delete(':airlineId')
  @HttpCode(204)
  async delete(@Param('airlineId') airlineId: string): Promise<void> {
    await this.airlineService.delete(airlineId);
  }
}
