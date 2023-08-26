import { Controller, Get, HttpCode, HttpStatus, Query, UsePipes, ValidationPipe, Version } from '@nestjs/common';
import { IProductEntity } from '../../database/models/product.models';
import { ProductsListDto } from './dto/list.dto';
import { ProductsService } from './products.service';

@UsePipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
}))
@Controller()
export class ProductsController {

    private readonly productsService: ProductsService;

    constructor(productsService: ProductsService) {
        this.productsService = productsService;
    }

    @HttpCode(HttpStatus.OK)
    @Version('1')
    @Get('products/list')
    public getListPaginated(@Query() query: ProductsListDto): Promise<IProductEntity[]> {
        return this.productsService.getListPaginated(query);
    }

}
