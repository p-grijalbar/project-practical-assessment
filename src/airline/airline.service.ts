import { HttpStatus, Injectable } from '@nestjs/common';
import { AirlineEntity } from './airline.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessException } from '../exceptions/business.exception';

@Injectable()
export class AirlineService {
  constructor(
    @InjectRepository(AirlineEntity)
    private readonly airlineRepository: Repository<AirlineEntity>,
  ) {}

  async findAll(): Promise<AirlineEntity[]> {
    return await this.airlineRepository.find({ relations: ['airports'] });
  }

  async findOne(id: string): Promise<AirlineEntity> {
    const airline: AirlineEntity = await this.airlineRepository.findOne({
      where: { id },
      relations: ['airports'],
    });
    if (!airline)
      throw new BusinessException(
        `La aerolínea con id ${id} no existe`,
        HttpStatus.NOT_FOUND,
      );

    return airline;
  }

  async create(airline: AirlineEntity): Promise<AirlineEntity> {
    if (new Date(airline.foundationDate) > new Date())
      throw new BusinessException(
        `La fecha de fundación no puede ser mayor a la fecha actual`,
        HttpStatus.PRECONDITION_FAILED,
      );
    return await this.airlineRepository.save(airline);
  }

  async update(id: string, airline: AirlineEntity): Promise<AirlineEntity> {
    const persistedAirline = await this.airlineRepository.findOne({
      where: { id },
      relations: ['airports'],
    });
    if (!persistedAirline) {
      throw new BusinessException(
        `La aerolínea con id ${id} no existe`,
        HttpStatus.NOT_FOUND,
      );
    }
    if (airline.foundationDate > new Date())
      throw new BusinessException(
        `La fecha de fundación no puede ser mayor a la fecha actual`,
        HttpStatus.PRECONDITION_FAILED,
      );
    return await this.airlineRepository.save({
      ...persistedAirline,
      ...airline,
    });
  }

  async delete(id: string) {
    const airline = await this.airlineRepository.findOne({
      where: { id },
    });
    if (!airline) {
      throw new BusinessException(
        `La aerolínea con id ${id} no existe`,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.airlineRepository.remove(airline);
  }
}
