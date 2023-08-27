import { Controller, Get, Res, HttpStatus, Query, Post, Body, Delete, Req, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { Response, Request } from 'express';
import { OrderDTO } from './order.dto';

@Controller('order')
export class OrderController {
    constructor(private orderService: OrderService) { }

    @Get('/')
    async getOrders(@Res() res: Response, @Req() req: Request) {
        const orders = await this.orderService.getOrders();
        return res.status(HttpStatus.OK).json(orders);
    }

    @Get('/single')
    async getOrder(@Res() res: Response, @Req() req: Request, @Query('id') id: string) {
        const order = await this.orderService.getOrder(id);
        return res.status(HttpStatus.OK).json(order);
    }

    @Get('/search-by-date')
    async getOrderByDate(@Res() res: Response, @Req() req: Request, @Query('date') date: string) {
        const order = await this.orderService.getOrderByDate(date);
        return res.status(HttpStatus.OK).json(order);
    }

    @Get('/counter')
    async getOrderCount(@Res() res: Response) {
        const count = await this.orderService.getCountOrders();
        return res.status(HttpStatus.OK).json(count);
    }

    @Get('/counter-sell')
    async getOrderCountSell(@Res() res: Response) {
        const count = await this.orderService.getCountOrdersSell();
        return res.status(HttpStatus.OK).json(count);
    }

    @Get('/counter-cancel')
    async getOrderCountCancel(@Res() res: Response) {
        const count = await this.orderService.getCountOrdersCancel();
        return res.status(HttpStatus.OK).json(count);
    }

    @Get('/amount')
    async getOrderAmount(@Res() res: Response) {
        const amount = await this.orderService.getAmount();
        return res.status(HttpStatus.OK).json(amount);
    }

    @Post('/create')
    async createOrder(@Res() res: Response, @Req() req: Request, @Body() orderDTO: OrderDTO) {
        const order = await this.orderService.createOrder(orderDTO);
        return res.status(HttpStatus.CREATED).json({
            message: 'Orden creada',
            order,
        });
    }

    @Put('/update-order')
    async updateOrder(@Res() res: Response, @Req() req: Request, @Query('id') id: string, @Body() data) {
        const { state } = data;
        await this.orderService.updateStateOrder(id, state);
        return res.status(HttpStatus.OK).json({
            message: 'Orden actualizada',
        });
    }

    @Delete('/delete')
    async deleteOrder(@Res() res: Response, @Req() req: Request, @Query('id') id: string) {
        await this.orderService.deleteOrder(id);
        return res.status(HttpStatus.OK).json({ message: 'Orden Eliminada' });
    }
}
