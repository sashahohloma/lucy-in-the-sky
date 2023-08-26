import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../../database/entities/product.entity';
import { IProductEntity } from '../../database/models/product.models';
import { IProductsListReq } from './models/list.models';

@Injectable()
export class ProductsService {

    private readonly productsRepository: Repository<ProductEntity>;

    constructor(
        @InjectRepository(ProductEntity)
        productsRepository: Repository<ProductEntity>,
    ) {
        this.productsRepository = productsRepository;
    }

    public async getListPaginated(query: IProductsListReq): Promise<IProductEntity[]> {
        const offset = query.limit * (query.page - 1);
        const list = await this.productsRepository.find({
            order: { id: 'ASC' },
            skip: offset,
            take: query.limit,
        });
        return list;
    }

}
