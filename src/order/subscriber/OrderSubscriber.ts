import {EventSubscriber, EntitySubscriberInterface, DataSource, RemoveEvent} from 'typeorm';
import { Order } from '../order.entity';
import { Details } from '../details.entity';

@EventSubscriber()
export class OrderSubscriber implements EntitySubscriberInterface<Order> {
    // constructor(dataSource: DataSource) {
    //     dataSource.subscribers.push(this);
    // }

    listenTo() {
        return Order;
    }

    async beforeRemove(event: RemoveEvent<Order>) {
        const { id } = event.entity;
        const details = await event.connection.getRepository(Details)
            .createQueryBuilder('details')
            .leftJoinAndSelect('details.order', 'order')
            .leftJoinAndSelect('details.product', 'product')
            .where('details.orderId = :id', { id })
            .getMany();
        await event.connection.getRepository(Details).remove(details);
    }
}
