import { Test, TestingModule } from '@nestjs/testing';
import { AirlineAirportService } from './airline-airport.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { AirportEntity } from '../airport/airport.entity';
import { AirlineEntity } from '../airline/airline.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AirportAirlineService', () => {
  let service: AirlineAirportService;
  let repositoryAirport: Repository<AirportEntity>;
  let repositoryAirline: Repository<AirlineEntity>;
  let airportList: AirportEntity[];
  let airline: AirlineEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirlineAirportService],
    }).compile();

    service = module.get<AirlineAirportService>(AirlineAirportService);
    repositoryAirport = module.get<Repository<AirportEntity>>(
      getRepositoryToken(AirportEntity),
    );
    repositoryAirline = module.get<Repository<AirlineEntity>>(
      getRepositoryToken(AirlineEntity),
    );
    await seedData();
  });

  const seedData = async () => {
    await repositoryAirport.clear();
    await repositoryAirline.clear();

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

    airline = await repositoryAirline.save({
      name: faker.company.name(),
      description: faker.lorem.paragraph(),
      foundationDate: faker.date.past(),
      website: faker.internet.url(),
      airports: airportList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAirportToAirline should add an airport to an airline', async () => {
    const airport = await repositoryAirport.save({
      name: faker.company.name(),
      code: faker.string.alpha(3),
      country: faker.location.country(),
      city: faker.location.city(),
    });
    const result: AirlineEntity = await service.addAirportToAirline(
      airport.id,
      airline.id,
    );
    expect(result).not.toBeNull();
    expect(result.airports).toHaveLength(6);
  });

  it('addAirportToAirline should throw an exception when the airport does not exist', async () => {
    await expect(() =>
      service.addAirportToAirline('0', airline.id),
    ).rejects.toHaveProperty('message', 'El aeropuerto con id 0 no existe');
  });

  it('addAirportToAirline should throw an exception when the airline does not exist', async () => {
    const airport = await repositoryAirport.save({
      name: faker.company.name(),
      code: faker.string.alpha(3),
      country: faker.location.country(),
      city: faker.location.city(),
    });
    await expect(() =>
      service.addAirportToAirline(airport.id, '0'),
    ).rejects.toHaveProperty('message', 'La aerolínea con id 0 no existe');
  });

  it('findAirportsFromAirline should return all airports from an airline', async () => {
    const result: AirportEntity[] = await service.findAirportsFromAirline(
      airline.id,
    );
    expect(result).not.toBeNull();
    expect(result).toHaveLength(5);
  });

  it('findAirportsFromAirline should throw an exception when the airline does not exist', async () => {
    await expect(() =>
      service.findAirportsFromAirline('0'),
    ).rejects.toHaveProperty('message', 'La aerolínea con id 0 no existe');
  });

  it('findAirportFromAirline should return an airport from an airline', async () => {
    const airport = airportList[0];
    const result: AirportEntity = await service.findAirportFromAirline(
      airline.id,
      airport.id,
    );
    expect(result).not.toBeNull();
    expect(result.id).toEqual(airport.id);
  });

  it('findAirportFromAirline should throw an exception when the airline does not exist', async () => {
    const airport = airportList[0];
    await expect(() =>
      service.findAirportFromAirline('0', airport.id),
    ).rejects.toHaveProperty('message', 'La aerolínea con id 0 no existe');
  });

  it('findAirportFromAirline should throw an exception when the airport does not exist', async () => {
    await expect(() =>
      service.findAirportFromAirline(airline.id, '0'),
    ).rejects.toHaveProperty('message', 'El aeropuerto con id 0 no existe');
  });

  it('findAirportFromAirline should throw an exception when the airport does not belong to the airline', async () => {
    const airport = await repositoryAirport.save({
      name: faker.company.name(),
      code: faker.string.alpha(3),
      country: faker.location.country(),
      city: faker.location.city(),
    });
    await expect(() =>
      service.findAirportFromAirline(airline.id, airport.id),
    ).rejects.toHaveProperty(
      'message',
      `El aeropuerto con id ${airport.id} no pertenece a la aerolínea con id ${airline.id}`,
    );
  });

  it('updateAirportsFromAirline should update the airports from an airline', async () => {
    const airport = airportList[0];
    const result: AirlineEntity = await service.updateAirportsFromAirline(
      airline.id,
      [airport],
    );
    expect(result).not.toBeNull();
    expect(result.airports).toHaveLength(1);
  });

  it('updateAirportsFromAirline should throw an exception when the airline does not exist', async () => {
    const airport = airportList[0];
    await expect(() =>
      service.updateAirportsFromAirline('0', [airport]),
    ).rejects.toHaveProperty('message', 'La aerolínea con id 0 no existe');
  });

  it('updateAirportsFromAirline should throw an exception when the airport does not exist', async () => {
    const airportEntity: AirportEntity = {
      id: '0',
      name: faker.company.name(),
      code: faker.string.alpha(3),
      country: faker.location.country(),
      city: faker.location.city(),
      airlines: [],
    };
    await expect(() =>
      service.updateAirportsFromAirline(airline.id, [airportEntity]),
    ).rejects.toHaveProperty('message', 'El aeropuerto con id 0 no existe');
  });

  it('deleteAirportFromAirline should delete an airport from an airline', async () => {
    const airport = airportList[0];
    const result: AirlineEntity = await service.deleteAirportFromAirline(
      airline.id,
      airport.id,
    );
    expect(result).not.toBeNull();
    expect(result.airports).toHaveLength(4);
  });

  it('deleteAirportFromAirline should throw an exception when the airline does not exist', async () => {
    const airport = airportList[0];
    await expect(() =>
      service.deleteAirportFromAirline('0', airport.id),
    ).rejects.toHaveProperty('message', 'La aerolínea con id 0 no existe');
  });

  it('deleteAirportFromAirline should throw an exception when the airport does not exist', async () => {
    await expect(() =>
      service.deleteAirportFromAirline(airline.id, '0'),
    ).rejects.toHaveProperty('message', 'El aeropuerto con id 0 no existe');
  });

  it('deleteAirportFromAirline should throw an exception when the airport does not belong to the airline', async () => {
    const airport = await repositoryAirport.save({
      name: faker.company.name(),
      code: faker.string.alpha(3),
      country: faker.location.country(),
      city: faker.location.city(),
    });
    await expect(() =>
      service.deleteAirportFromAirline(airline.id, airport.id),
    ).rejects.toHaveProperty(
      'message',
      `El aeropuerto con id ${airport.id} no pertenece a la aerolínea con id ${airline.id}`,
    );
  });
});
