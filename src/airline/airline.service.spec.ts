import { Test, TestingModule } from '@nestjs/testing';
import { AirlineService } from './airline.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { AirlineEntity } from './airline.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AirlineService', () => {
  let service: AirlineService;
  let repositoryAirline: Repository<AirlineEntity>;
  let airlineList: AirlineEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirlineService],
    }).compile();

    service = module.get<AirlineService>(AirlineService);
    repositoryAirline = module.get<Repository<AirlineEntity>>(
      getRepositoryToken(AirlineEntity),
    );
    await sedData();
  });

  const sedData = async () => {
    await repositoryAirline.clear();
    airlineList = [];
    for (let i = 0; i < 5; i++) {
      const airline = await repositoryAirline.save({
        name: faker.company.name(),
        description: faker.lorem.paragraph(),
        foundationDate: faker.date.past(),
        website: faker.internet.url(),
      });
      airlineList.push(airline);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all airlines', async () => {
    const result: AirlineEntity[] = await service.findAll();
    expect(result).not.toBeNull();
    expect(result).toHaveLength(5);
  });

  it('findOne should return an airline by id', async () => {
    const storedAirline = airlineList[0];
    const result: AirlineEntity = await service.findOne(storedAirline.id);
    expect(result).not.toBeNull();
    expect(result.id).toEqual(storedAirline.id);
  });

  it('findOne should throw an exception when the airline does not exist', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'La aerolínea con id 0 no existe',
    );
  });

  it('create should return the created airline', async () => {
    const airline: AirlineEntity = {
      id: '',
      name: faker.company.name(),
      description: faker.lorem.paragraph(),
      foundationDate: faker.date.past(),
      website: faker.internet.url(),
      airports: [],
    };
    const newAirline: AirlineEntity = await service.create(airline);
    expect(airline).not.toBeNull();
    expect(airline.id).not.toBeNull();
    expect(airline.name).toEqual(newAirline.name);
    expect(airline.description).toEqual(newAirline.description);
    expect(airline.foundationDate).toEqual(newAirline.foundationDate);
  });

  it('create should throw an exception when the foundation date is greater than the current date', async () => {
    const airline: AirlineEntity = {
      id: '',
      name: faker.company.name(),
      description: faker.lorem.paragraph(),
      foundationDate: faker.date.future(),
      website: faker.internet.url(),
      airports: [],
    };
    await expect(() => service.create(airline)).rejects.toHaveProperty(
      'message',
      'La fecha de fundación no puede ser mayor a la fecha actual',
    );
  });

  it('update should update an airline', async () => {
    const storedAirline = airlineList[0];
    const airline: AirlineEntity = {
      id: storedAirline.id,
      name: faker.company.name(),
      description: faker.lorem.paragraph(),
      foundationDate: faker.date.past(),
      website: faker.internet.url(),
      airports: [],
    };
    const updatedAirline: AirlineEntity = await service.update(
      storedAirline.id,
      airline,
    );
    expect(updatedAirline).not.toBeNull();
    expect(updatedAirline.id).toEqual(airline.id);
    expect(updatedAirline.name).toEqual(airline.name);
    expect(updatedAirline.description).toEqual(airline.description);
    expect(updatedAirline.foundationDate).toEqual(airline.foundationDate);
  });

  it('update should throw an exception when the foundation date is greater than the current date', async () => {
    const storedAirline = airlineList[0];
    const airline: AirlineEntity = {
      id: storedAirline.id,
      name: faker.company.name(),
      description: faker.lorem.paragraph(),
      foundationDate: faker.date.future(),
      website: faker.internet.url(),
      airports: [],
    };
    await expect(() =>
      service.update(storedAirline.id, airline),
    ).rejects.toHaveProperty(
      'message',
      'La fecha de fundación no puede ser mayor a la fecha actual',
    );
  });

  it('update should throw an exception when the airline does not exist', async () => {
    const airline: AirlineEntity = {
      id: '0',
      name: faker.company.name(),
      description: faker.lorem.paragraph(),
      foundationDate: faker.date.past(),
      website: faker.internet.url(),
      airports: [],
    };
    await expect(() => service.update('0', airline)).rejects.toHaveProperty(
      'message',
      'La aerolínea con id 0 no existe',
    );
  });

  it('delete should delete an airline', async () => {
    const storedAirline = airlineList[0];
    await service.delete(storedAirline.id);
    const deletedAirline = await repositoryAirline.findOne({
      where: { id: storedAirline.id },
    });
    expect(deletedAirline).toBeNull();
  });

  it('delete should throw an exception when the airline does not exist', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'La aerolínea con id 0 no existe',
    );
  });
});
