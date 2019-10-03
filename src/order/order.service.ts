import { ProductToOrder } from './productToOrder.entity';
import { Product } from '../product/product.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository, getRepository } from 'typeorm';
import { OrderDTO } from './order.dto';
import { User } from '../user/user.entity';
import { AppGateway } from '../app.gateway';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        private gateway: AppGateway,
    ) {}

    async getOrders(): Promise<Order[]> {
        const orders = await this.orderRepository.find();
        return orders;
    }

    async getOrder(orderId: number): Promise<Order> {
        const order = await this.orderRepository.findOne({ where: { id: orderId } });
        if (!order) {
            throw new NotFoundException('No se encontró al orden');
        }
        return order;
    }

    async getOrderByDate(date: Date): Promise<Order[]> {
        const order = await this.orderRepository.find({ where: { date } });
        if (!order) {
            throw new NotFoundException('No se encontró al orden');
        }
        return order;
    }

    async createOrder(orderDTO: OrderDTO): Promise<any> {
        const { address, neigh, total, userId, data } = orderDTO;
        const user = await getRepository(User)
            .createQueryBuilder('user')
            .where('user.id = :id', {id: userId})
            .getOne();
        if (!user) {
            throw new NotFoundException('No se encontró al usuario');
        }
        const order = await this.orderRepository.create({ address, neigh, total, user});
        await this.orderRepository.save(order);
        await this.createDetail(data);
        const lastOrder = await this.searchLastOrder();
        const counter = await this.getCountOrders();
        this.gateway.wss.emit('countOrders', counter); // evento websocket
        this.gateway.wss.emit('userOrder', user);
        this.gateway.wss.emit('newOrder', lastOrder);
        return lastOrder;
    }

    async searchLastOrder() {
        const order = await getRepository(Order)
            .createQueryBuilder('order')
            .orderBy('order.id', 'DESC')
            .limit(1)
            .getOne();

        return order;
    }

    async getCountOrders() {
        const count = await getRepository(Order)
            .createQueryBuilder('order')
            .select('COUNT(*) as count')
            .groupBy('order.id')
            .getRawOne();

        return count;
    }

    async createDetail(data: any[]) {
        const order = await this.searchLastOrder();
        // data = [ { productID: ?, quantity: ?, price: ? } ]
        data.forEach(async (el) => {
            const product = await getRepository(Product)
                .createQueryBuilder('product')
                .where('product.id = :id', { id: el.productID })
                .getOne();
            const pto = new ProductToOrder();
            pto.price = el.price;
            pto.quantity = el.quantity;
            pto.order = order;
            pto.product = product;
            await getRepository(ProductToOrder).save(pto);
        });
    }

    async deleteOrder(orderId: number): Promise<any> {
        await getRepository(ProductToOrder).delete({ orderId });
        const order = this.orderRepository.delete({ id: orderId });
        return order;
    }
}
