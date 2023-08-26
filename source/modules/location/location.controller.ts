import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UseInterceptors, UsePipes, ValidationPipe, Version } from '@nestjs/common';
import { LogsInterceptor } from '../logs/logs.interceptor';
import { LocationFindDto } from './dto/find.dto';
import { LocationUpdateDto } from './dto/update.dto';
import { LocationService } from './location.service';
import { ILocationFindPlace } from './models/find.models';

@UsePipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
}))
@Controller()
export class LocationController {

    private readonly locationService: LocationService;

    constructor(locationService: LocationService) {
        this.locationService = locationService;
    }


    @UseInterceptors(LogsInterceptor)
    @HttpCode(HttpStatus.OK)
    @Version('1')
    @Get('location/find')
    public async find(@Query() query: LocationFindDto): Promise<ILocationFindPlace[]> {
        const location = await this.locationService.findProduct(query);
        return location;
    }


    @UseInterceptors(LogsInterceptor)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Version('1')
    @Post('location/income')
    public async income(@Body() body: LocationUpdateDto): Promise<void> {
        await this.locationService.incomeProducts(body);
    }


    @UseInterceptors(LogsInterceptor)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Version('1')
    @Post('location/order')
    public async order(@Body() body: LocationUpdateDto): Promise<void> {
        await this.locationService.orderProducts(body);
    }

}
