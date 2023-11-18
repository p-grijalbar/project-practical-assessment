import { HttpStatus, Injectable } from '@nestjs/common';
import { AirportEntity } from './airport.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessException } from '../exceptions/business.exception';

@Injectable()
export class AirportService {
  constructor(
    @InjectRepository(AirportEntity)
    private readonly airportRepository: Repository<AirportEntity>,
  ) {}

  async findAll(): Promise<AirportEntity[]> {
    return await this.airportRepository.find({ relations: ['airlines'] });
  }

  async findOne(id: string): Promise<AirportEntity> {
    const airport: AirportEntity = await this.airportRepository.findOne({
      where: { id },
      relations: ['airlines'],
    });

    if (!airport)
      throw new BusinessException(
        `El aeropuerto con id ${id} no existe`,
        HttpStatus.NOT_FOUND,
      );

    return airport;
  }

  async create(airport: AirportEntity): Promise<AirportEntity> {
    if (airport.code.length !== 3)
      throw new BusinessException(
        `El código del aeropuerto debe tener 3 caracteres`,
        HttpStatus.PRECONDITION_FAILED,
      );
    return await this.airportRepository.save(airport);
  }

  async update(id: string, airport: AirportEntity): Promise<AirportEntity> {
    const persistedAirport = await this.airportRepository.findOne({
      where: { id },
      relations: ['airlines'],
    });
    if (!persistedAirport) {
      throw new BusinessException(
        `El aeropuerto con id ${id} no existe`,
        HttpStatus.NOT_FOUND,
      );
    }
    if (airport.code.length !== 3)
      throw new BusinessException(
        `El código del aeropuerto debe tener 3 caracteres`,
        HttpStatus.PRECONDITION_FAILED,
      );
    return await this.airportRepository.save({
      ...persistedAirport,
      ...airport,
    });
  }

  async delete(id: string) {
    const airport = await this.airportRepository.findOne({
      where: { id },
    });
    if (!airport) {
      throw new BusinessException(
        `El aeropuerto con id ${id} no existe`,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.airportRepository.remove(airport);
  }
}
