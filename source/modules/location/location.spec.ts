import { Readable } from 'stream';
import { faker } from '@faker-js/faker';
import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { HttpStatus, NotFoundException, ValueProvider } from '@nestjs/common';
import { LocationFactory } from '../../database/factories/location.factory';
import { ProductsFactory } from '../../database/factories/product.factory';
import { RackFactory } from '../../database/factories/rack.factory';
import { SectionFactory } from '../../database/factories/section.factory';
import { ApplicationFactory } from '../../tests/tests.factory';
import { MocksFactory } from '../../tests/tests.mocks';
import { IMock } from '../../tests/tests.models';
import { LocationController } from './location.controller';
import { LocationRepository } from './location.repository';
import { LocationService } from './location.service';
import { LocationUtils } from './location.utils';
import { ILocationFindPlace } from './models/find.models';
import { IProductReq } from './models/product.models';
import { ILocationRepository } from './models/repository.models';
import { ILocationUpdate } from './models/update.models';

describe('Location e2e', () => {
    const app = new ApplicationFactory();

    const locationRepositoryMock: IMock<ILocationRepository> = {
        transaction: jest.fn().mockImplementation(MocksFactory.transaction as never),
        streamByProduct: jest.fn(),
        findPrevious: jest.fn(),
        getTotal: jest.fn(),
        findRackOrNotFound: jest.fn(),
        findSectionOrNotFound: jest.fn(),
        findProductOrNotFound: jest.fn(),
        findProducts: jest.fn(),
    };

    beforeAll(async() => {
        const LocationRepositoryProvider: ValueProvider = {
            provide: LocationRepository,
            useValue: locationRepositoryMock,
        };
        await app.init({
            providers: [
                LocationRepositoryProvider,
                LocationService,
            ],
            controllers: [
                LocationController,
            ],
        });
    });

    afterAll(async() => {
        await app.close();
    });

    describe('Find', () => {
        it('Should find location of product', async() => {
            const racks = RackFactory.getEntities();
            const sections = SectionFactory.getEntities();
            const product = ProductsFactory.getEntity();
            const locations = LocationFactory.getEntities({
                racks,
                sections,
                products: [product],
                limit: 10,
            });

            const stream = Readable.from(locations);
            const total = locations.reduce((acc, l) => acc + l.quantity, 0);
            const quantity = 10;

            locationRepositoryMock.findProductOrNotFound.mockResolvedValue(product);
            locationRepositoryMock.getTotal.mockResolvedValue(total);
            locationRepositoryMock.streamByProduct.mockReturnValue(stream);

            const response = await app.instance.inject({
                url: 'v1/location/find',
                query: {
                    product: product.id,
                    quantity: String(quantity),
                },
            });
            const body = response.json<ILocationFindPlace[]>();
            const sum = body.reduce((acc, l) => acc + l.order, 0);

            expect(response.statusCode).toBe(HttpStatus.OK);
            expect(sum).toBe(quantity);
        });

        it('Too low stocks', async() => {
            const racks = RackFactory.getEntities();
            const sections = SectionFactory.getEntities();
            const product = ProductsFactory.getEntity();
            const locations = LocationFactory.getEntities({
                racks,
                sections,
                products: [product],
                limit: 1,
            });

            const total = locations.reduce((acc, l) => acc + l.quantity, 0);
            const quantity = 1000;

            locationRepositoryMock.findProductOrNotFound.mockResolvedValue(product);
            locationRepositoryMock.getTotal.mockResolvedValue(total);

            const response = await app.instance.inject({
                url: 'v1/location/find',
                query: {
                    product: product.id,
                    quantity: String(quantity),
                },
            });

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
            expect(total).toBeLessThan(quantity);
        });

        it('Product not found', async() => {
            const product = ProductsFactory.getEntity();
            const query = ProductsFactory.getEntity();

            const notFoundError = new NotFoundException();
            locationRepositoryMock.findProductOrNotFound.mockRejectedValue(notFoundError);

            const response = await app.instance.inject({
                url: 'v1/location/find',
                query: {
                    product: query.id,
                    quantity: '10',
                },
            });

            expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
            expect(product.id).not.toBe(query.id);
        });
    });

    describe('Income', () => {
        it('Success', async() => {
            const racks = RackFactory.getEntities();
            const sections = SectionFactory.getEntities();
            const products = ProductsFactory.getEntities(10);
            const locations = LocationFactory.getEntities({
                racks,
                sections,
                products,
                limit: 10,
            });

            const rackRandom = faker.helpers.arrayElement(racks);
            const sectionRandom = faker.helpers.arrayElement(sections);

            locationRepositoryMock.findProducts.mockResolvedValue(products);
            locationRepositoryMock.findRackOrNotFound.mockResolvedValue(rackRandom);
            locationRepositoryMock.findSectionOrNotFound.mockResolvedValue(sectionRandom);
            locationRepositoryMock.findPrevious.mockResolvedValue(locations);

            const request: ILocationUpdate = {
                location: LocationUtils.getID(rackRandom.id, sectionRandom.id),
                products: products.map<IProductReq>((p) => ({
                    id: p.id,
                    quantity: faker.number.int({ min: 1, max: 10 }),
                })),
            };
            const response = await app.instance.inject({
                method: 'POST',
                url: 'v1/location/income',
                body: request,
            });

            expect(response.statusCode).toBe(HttpStatus.NO_CONTENT);
        });

        it('Request non-existing location', async() => {
            const racks = RackFactory.getEntities();
            const sections = SectionFactory.getEntities();
            const products = ProductsFactory.getEntities(10);
            const locations = LocationFactory.getEntities({
                racks,
                sections,
                products,
                limit: 10,
            });

            const notFoundError = new NotFoundException();

            locationRepositoryMock.findProducts.mockResolvedValue(products);
            locationRepositoryMock.findRackOrNotFound.mockRejectedValue(notFoundError);
            locationRepositoryMock.findSectionOrNotFound.mockRejectedValue(notFoundError);
            locationRepositoryMock.findPrevious.mockResolvedValue(locations);

            const request: ILocationUpdate = {
                location: faker.string.uuid(),
                products: products.map<IProductReq>((p) => ({
                    id: p.id,
                    quantity: faker.number.int({ min: 1, max: 10 }),
                })),
            };
            const response = await app.instance.inject({
                method: 'POST',
                url: 'v1/location/income',
                body: request,
            });

            expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
        });

        it('Request non-existing product', async() => {
            const racks = RackFactory.getEntities();
            const sections = SectionFactory.getEntities();
            const products = ProductsFactory.getEntities(10);

            const rackRandom = faker.helpers.arrayElement(racks);
            const sectionRandom = faker.helpers.arrayElement(sections);

            const notFoundError = new NotFoundException();

            locationRepositoryMock.findProducts.mockRejectedValue(notFoundError);

            const request: ILocationUpdate = {
                location: LocationUtils.getID(rackRandom.id, sectionRandom.id),
                products: products.map<IProductReq>((p) => ({
                    id: p.id.replaceAll(/\d/g, '1'),
                    quantity: faker.number.int({ min: 1, max: 10 }),
                })),
            };
            const response = await app.instance.inject({
                method: 'POST',
                url: 'v1/location/income',
                body: request,
            });

            expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
        });
    });

    describe('Orders', () => {
        it('Success', async() => {
            const racks = RackFactory.getEntities();
            const sections = SectionFactory.getEntities();
            const products = ProductsFactory.getEntities(10);
            const locations = LocationFactory.getEntities({
                racks,
                sections,
                products,
                limit: 100,
            });

            const randomLocation = faker.helpers.arrayElement(locations);

            locationRepositoryMock.findProducts.mockResolvedValue(products);
            locationRepositoryMock.findRackOrNotFound.mockResolvedValue(randomLocation.rack);
            locationRepositoryMock.findSectionOrNotFound.mockResolvedValue(randomLocation.section);
            locationRepositoryMock.findPrevious.mockResolvedValue(locations);

            const request: ILocationUpdate = {
                location: LocationUtils.getID(randomLocation.rack.id, randomLocation.section.id),
                products: [{
                    id: randomLocation.product.id,
                    quantity: faker.number.int({ min: 1, max: 4 }),
                }],
            };
            const response = await app.instance.inject({
                method: 'POST',
                url: 'v1/location/order',
                body: request,
            });

            expect(response.statusCode).toBe(HttpStatus.NO_CONTENT);
        });

        it('Request too many quantity', async() => {
            const racks = RackFactory.getEntities();
            const sections = SectionFactory.getEntities();
            const products = ProductsFactory.getEntities(10);
            const locations = LocationFactory.getEntities({
                racks,
                sections,
                products,
                limit: 1,
            });

            const randomLocation = faker.helpers.arrayElement(locations);

            locationRepositoryMock.findProducts.mockResolvedValue(products);
            locationRepositoryMock.findRackOrNotFound.mockResolvedValue(randomLocation.rack);
            locationRepositoryMock.findSectionOrNotFound.mockResolvedValue(randomLocation.section);
            locationRepositoryMock.findPrevious.mockResolvedValue(locations);

            const request: ILocationUpdate = {
                location: LocationUtils.getID(randomLocation.rack.id, randomLocation.section.id),
                products: [{
                    id: randomLocation.product.id,
                    quantity: faker.number.int({ min: 1000, max: 4000 }),
                }],
            };
            const response = await app.instance.inject({
                method: 'POST',
                url: 'v1/location/order',
                body: request,
            });

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        });

        it('Request non-existing product', async() => {
            const racks = RackFactory.getEntities();
            const sections = SectionFactory.getEntities();
            const products = ProductsFactory.getEntities(10);

            const rackRandom = faker.helpers.arrayElement(racks);
            const sectionRandom = faker.helpers.arrayElement(sections);

            const notFoundError = new NotFoundException();

            locationRepositoryMock.findProducts.mockRejectedValue(notFoundError);

            const request: ILocationUpdate = {
                location: LocationUtils.getID(rackRandom.id, sectionRandom.id),
                products: products.map<IProductReq>((p) => ({
                    id: p.id.replace(/\d+/, '1'),
                    quantity: faker.number.int({ min: 1, max: 10 }),
                })),
            };
            const response = await app.instance.inject({
                method: 'POST',
                url: 'v1/location/orders',
                body: request,
            });

            expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
        });
    });
});
