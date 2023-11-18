import { Test, TestingModule } from '@nestjs/testing';
import { AirportService } from './airport.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { AirportEntity } from './airport.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AirportService', () => {
  let service: AirportService;
  let repositoryAirport: Repository<AirportEntity>;
  let airportList: AirportEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirportService],
    }).compile();

    service = module.get<AirportService>(AirportService);
    repositoryAirport = module.get<Repository<AirportEntity>>(
      getRepositoryToken(AirportEntity),
    );
    await seedData();
  });

  const seedData = async () => {
    await repositoryAirport.clear();
    airportList = [];
    for (let i = 0; i < 5; i++) {
      const airport = await repositoryAirport.save({
        name: faker.company.name(),
        code: faker.string.alpha(3),
        country: faker.location.country(),
        city: faker.location.city(),
      });
      airportList.push(airport);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all airports', async () => {
    const result: AirportEntity[] = await service.findAll();
    expect(result).not.toBeNull();
    expect(result).toHaveLength(5);
  });

  it('findOne should return an airport by id', async () => {
    const storedAirport = airportList[0];
    const result: AirportEntity = await service.findOne(storedAirport.id);
    expect(result).not.toBeNull();
    expect(result.id).toEqual(storedAirport.id);
  });

  it('findOne should throw an exception when the airport does not exist', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'El aeropuerto con id 0 no existe',
    );
  });

  it('create should return an airport', async () => {
    const airport: AirportEntity = {
      id: '',
      name: faker.company.name(),
      code: faker.string.alpha(3),
      country: faker.location.country(),
      city: faker.location.city(),
      airlines: [],
    };
    const result: AirportEntity = await service.create(airport);
    expect(result).not.toBeNull();
    expect(result.id).not.toBeNull();
    expect(result.name).toEqual(airport.name);
    expect(result.code).toEqual(airport.code);
    expect(result.country).toEqual(airport.country);
    expect(result.city).toEqual(airport.city);
  });

  it('create should throw an exception when the airport code is not 3 characters long', async () => {
    const airport: AirportEntity = {
      id: '',
      name: faker.company.name(),
      code: faker.string.alpha(2),
      country: faker.location.country(),
      city: faker.location.city(),
      airlines: [],
    };
    await expect(() => service.create(airport)).rejects.toHaveProperty(
      'message',
      'El código del aeropuerto debe tener 3 caracteres',
    );
  });

  it('update should update an airport', async () => {
    const storedAirport = airportList[0];
    const airport: AirportEntity = {
      id: storedAirport.id,
      name: faker.company.name(),
      code: faker.string.alpha(3),
      country: faker.location.country(),
      city: faker.location.city(),
      airlines: [],
    };
    const result: AirportEntity = await service.update(
      storedAirport.id,
      airport,
    );
    expect(result).not.toBeNull();
    expect(result.id).toEqual(airport.id);
    expect(result.name).toEqual(airport.name);
    expect(result.code).toEqual(airport.code);
    expect(result.country).toEqual(airport.country);
    expect(result.city).toEqual(airport.city);
  });

  it('update should throw an exception when the airport does not exist', async () => {
    const airport: AirportEntity = {
      id: '0',
      name: faker.company.name(),
      code: faker.string.alpha(3),
      country: faker.location.country(),
      city: faker.location.city(),
      airlines: [],
    };
    await expect(() => service.update('0', airport)).rejects.toHaveProperty(
      'message',
      'El aeropuerto con id 0 no existe',
    );
  });

  it('update should throw an exception when the airport code is not 3 characters long', async () => {
    const storedAirport = airportList[0];
    const airport: AirportEntity = {
      id: storedAirport.id,
      name: faker.company.name(),
      code: faker.string.alpha(2),
      country: faker.location.country(),
      city: faker.location.city(),
      airlines: [],
    };
    await expect(() =>
      service.update(storedAirport.id, airport),
    ).rejects.toHaveProperty(
      'message',
      'El código del aeropuerto debe tener 3 caracteres',
    );
  });

  it('delete should delete an airport', async () => {
    const storedAirport = airportList[0];
    await service.delete(storedAirport.id);
    const result: AirportEntity[] = await service.findAll();
    expect(result).toHaveLength(4);
  });

  it('delete should throw an exception when the airport does not exist', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'El aeropuerto con id 0 no existe',
    );
  });
});
