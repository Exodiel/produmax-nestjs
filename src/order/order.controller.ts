import { Controller, Get, Res, HttpStatus, Query, Post, Body, Delete } from '@nestjs/common';
import { OrderService } from './order.service';
import { Response } from 'express';
import { OrderDTO } from './order.dto';

@Controller('order')
export class OrderController {
    constructor(private orderService: OrderService) {}

    @Get('/')
    async getOrders(@Res() res: Response) {
        const orders = await this.orderService.getOrders();
        return res.status(HttpStatus.OK).json(orders);
    }

    @Get('/single')
    async getOrder(@Res() res: Response, @Query('id') id: number) {
        const order = await this.orderService.getOrder(id);
        return res.status(HttpStatus.OK).json(order);
    }

    @Get('/search-by-date')
    async getOrderByDate(@Res() res: Response, @Query('date') date: Date) {
        const order = await this.orderService.getOrderByDate(date);
        return res.status(HttpStatus.OK).json(order);
    }

    @Post('/create')
    async createOrder(@Res() res: Response, @Body() orderDTO: OrderDTO) {
        const order = await this.orderService.createOrder(orderDTO);
        return res.status(HttpStatus.CREATED).json({
            message: 'Orden creada',
            order,
        });
    }

    @Delete('/delete')
    async deleteOrder(@Res() res: Response, @Query('id') id: number) {
        await this.orderService.deleteOrder(id);
        return res.status(HttpStatus.OK).json({ message: 'Orden Eliminada' });
    }
}
