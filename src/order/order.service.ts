import { Details } from './details.entity';
import { Product } from '../product/product.entity';
import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository, DataSource } from 'typeorm';
import { OrderDTO } from './order.dto';
import { User } from '../user/user.entity';
import { AppGateway } from '../app.gateway';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        private dataSource: DataSource,
        private gateway: AppGateway,
    ) {}

    async getOrders(): Promise<Order[]> {
        const orders = await this.orderRepository.find({ relations: ['user', 'user.rol'] });
        return orders;
    }

    async getOrder(orderId: number): Promise<Order> {
        const order = await this.orderRepository.findOne({ where: { id: orderId }, relations: ['user', 'user.rol'] });
        if (!order) {
            throw new NotFoundException('No se encontró al orden');
        }
        return order;
    }

    async getOrderByDate(date: string): Promise<Order[]> {
        const order = await this.orderRepository.find({ where: { date } });
        if (!order) {
            throw new NotFoundException('No se encontró al orden');
        }
        return order;
    }

    async createOrder(orderDTO: OrderDTO): Promise<any> {
        const { address, neigh, total, dateDelivery, userId, data } = orderDTO;
        const user = await this.getUser(userId);
        const order = this.orderRepository.create({ address, neigh, total, dateDelivery, user});
        await this.orderRepository.save(order);
        const lastOrder = await this.searchLastOrder();
        await this.createDetails(data, lastOrder);
        const counter = await this.getCountOrders();
        this.gateway.wss.emit('countOrders', counter); // evento websocket
        this.gateway.wss.emit('userOrder', user);
        this.gateway.wss.emit('newOrder', lastOrder);
        return lastOrder;
    }

    private async createDetails(data: any[], order: Order) {
        // data = [ { productID: ?, quantity: ?, price: ? } ]
        data.forEach(async (el, index) => {
            try {
                const product = await this.getProductFromDetail(el.productID);
                await this.createDetail(el.price, el.quantity, order, product);
            } catch (error) {
                throw new HttpException('No se puede realizar la operación', HttpStatus.BAD_REQUEST);
            }
        });
    }

    private async createDetail(price: number, quantity: number, order: Order, product: Product) {
        await this.dataSource.getRepository(Details)
            .createQueryBuilder()
            .insert()
            .into(Details)
            .values({
                price,
                quantity,
                order,
                product,
            })
            .execute();
    }

    private async getProductFromDetail(productID: number): Promise<Product> {
        const product = await this.dataSource.getRepository(Product)
                .createQueryBuilder('product')
                .where('product.id = :id', { id: productID })
                .getOne();
        if (!product) {
            throw new NotFoundException('No se encontró el producto');
        }

        return product;
    }

    private async getUser(userId: number): Promise<User> {
        const user = await this.dataSource.getRepository(User)
            .createQueryBuilder('user')
            .where('user.id = :id', {id: userId})
            .getOne();
        if (!user) {
            throw new NotFoundException('No se encontró al usuario');
        }

        return user;
    }

    private async searchLastOrder() {
        const order = await this.dataSource.getRepository(Order)
            .createQueryBuilder('order')
            .orderBy('order.id', 'DESC')
            .limit(1)
            .getOne();

        return order;
    }

    async getAmount() {
        const amount = await this.dataSource.getRepository(Order)
            .createQueryBuilder('order')
            .select('SUM(total) as amount')
            .where('order.state = :state', { state: 'vendido' })
            .getRawOne();

        return !amount ? 0 : amount;
    }

    async getCountOrders() {
        const count = await this.dataSource.getRepository(Order)
            .createQueryBuilder('order')
            .select('COUNT(*) as counter')
            .where('order.state = :state', { state: 'procesando' })
            .getRawOne();

        return !count ? 0 : count;
    }

    async getCountOrdersSell() {
        const count = await this.dataSource.getRepository(Order)
            .createQueryBuilder('order')
            .select('COUNT(*) as counter')
            .where('order.state = :state', { state: 'vendido' })
            .getRawOne();

        return !count ? 0 : count;
    }

    async getCountOrdersCancel() {
        const count = await this.dataSource.getRepository(Order)
            .createQueryBuilder('order')
            .select('COUNT(*) as counter')
            .where('order.state = :state', { state: 'cancelado' })
            .getRawOne();

        return !count ? 0 : count;
    }

    async updateStateOrder(orderID: number, newState: string) {
        await this.searchOrder(orderID);

        await this.dataSource
            .createQueryBuilder()
            .update(Order)
            .set({ state: newState })
            .where('id = :id', { id: orderID })
            .execute();
        this.gateway.wss.emit('updateOrder', 'Orden actualizada');
    }

    async deleteOrder(orderId: number): Promise<any> {
        const or = await this.searchOrder(orderId);
        await this.orderRepository.remove(or);
        return or;
    }

    private async searchOrder(orderId: number): Promise<Order> {
        const or = await this.dataSource.getRepository(Order)
            .createQueryBuilder('order')
            .where('order.id = :id', { id: orderId })
            .getOne();
        if (!or) {
            throw new NotFoundException('Orden no encontrada');
        }
        return or;
    }

}
