import { HttpStatus, Injectable } from '@nestjs/common';
import { AirportEntity } from '../airport/airport.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AirlineEntity } from '../airline/airline.entity';
import { BusinessException } from '../exceptions/business.exception';

@Injectable()
export class AirlineAirportService {
  constructor(
    @InjectRepository(AirportEntity)
    private readonly airportRepository: Repository<AirportEntity>,
    @InjectRepository(AirlineEntity)
    private readonly airlineRepository: Repository<AirlineEntity>,
  ) {}

  async addAirportToAirline(
    airportId: string,
    airlineId: string,
  ): Promise<AirlineEntity> {
    const airport = await this.airportRepository.findOne({
      where: { id: airportId },
    });
    if (!airport)
      throw new BusinessException(
        `El aeropuerto con id ${airportId} no existe`,
        HttpStatus.NOT_FOUND,
      );
    const airline = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: ['airports'],
    });
    if (!airline)
      throw new BusinessException(
        `La aerolínea con id ${airlineId} no existe`,
        HttpStatus.NOT_FOUND,
      );
    airline.airports.push(airport);
    return await this.airlineRepository.save(airline);
  }

  async findAirportsFromAirline(airlineId: string): Promise<AirportEntity[]> {
    const airline = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: ['airports'],
    });
    if (!airline)
      throw new BusinessException(
        `La aerolínea con id ${airlineId} no existe`,
        HttpStatus.NOT_FOUND,
      );
    return airline.airports;
  }

  async findAirportFromAirline(
    airlineId: string,
    airportId: string,
  ): Promise<AirportEntity> {
    const airline = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: ['airports'],
    });

    if (!airline)
      throw new BusinessException(
        `La aerolínea con id ${airlineId} no existe`,
        HttpStatus.NOT_FOUND,
      );

    const airport = await this.airportRepository.findOne({
      where: { id: airportId },
    });

    if (!airport)
      throw new BusinessException(
        `El aeropuerto con id ${airportId} no existe`,
        HttpStatus.NOT_FOUND,
      );

    const airportAirline = airline.airports.find((a) => a.id === airportId);
    if (!airportAirline)
      throw new BusinessException(
        `El aeropuerto con id ${airportId} no pertenece a la aerolínea con id ${airlineId}`,
        HttpStatus.NOT_FOUND,
      );
    return airportAirline;
  }

  async updateAirportsFromAirline(
    airlineId: string,
    airports: AirportEntity[],
  ) {
    const airline = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: ['airports'],
    });
    if (!airline)
      throw new BusinessException(
        `La aerolínea con id ${airlineId} no existe`,
        HttpStatus.NOT_FOUND,
      );

    for (let i = 0; i < airports.length; i++) {
      const airport = await this.airportRepository.findOne({
        where: { id: airports[i].id },
      });
      if (!airport)
        throw new BusinessException(
          `El aeropuerto con id ${airports[i].id} no existe`,
          HttpStatus.NOT_FOUND,
        );
      airports[i] = airport;
    }

    airline.airports = airports;
    return await this.airlineRepository.save(airline);
  }

  async deleteAirportFromAirline(airlineId: string, airportId: string) {
    const airline = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: ['airports'],
    });
    if (!airline)
      throw new BusinessException(
        `La aerolínea con id ${airlineId} no existe`,
        HttpStatus.NOT_FOUND,
      );
    const airport = await this.airportRepository.findOne({
      where: { id: airportId },
    });
    if (!airport)
      throw new BusinessException(
        `El aeropuerto con id ${airportId} no existe`,
        HttpStatus.NOT_FOUND,
      );
    const airportAirline = airline.airports.find((a) => a.id === airportId);
    if (!airportAirline)
      throw new BusinessException(
        `El aeropuerto con id ${airportId} no pertenece a la aerolínea con id ${airlineId}`,
        HttpStatus.NOT_FOUND,
      );
    airline.airports = airline.airports.filter((a) => a.id !== airportId);
    return await this.airlineRepository.save(airline);
  }
}
