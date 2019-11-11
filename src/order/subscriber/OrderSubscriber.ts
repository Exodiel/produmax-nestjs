import {EventSubscriber, EntitySubscriberInterface, getRepository, RemoveEvent} from 'typeorm';
import { Order } from '../order.entity';
import { Details } from '../details.entity';

@EventSubscriber()
export class OrderSubscriber implements EntitySubscriberInterface<Order> {

    listenTo() {
        return Order;
    }

    async beforeRemove(event: RemoveEvent<Order>) {
        const { id } = event.entity;
        const details = await getRepository(Details)
            .createQueryBuilder('details')
            .leftJoinAndSelect('details.order', 'order')
            .leftJoinAndSelect('details.product', 'product')
            .where('details.orderId = :id', { id })
            .getMany();
        await getRepository(Details).remove(details);
    }
}
