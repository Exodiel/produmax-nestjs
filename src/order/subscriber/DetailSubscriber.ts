import {EventSubscriber, EntitySubscriberInterface, InsertEvent, getRepository, RemoveEvent} from 'typeorm';
import { Details } from '../details.entity';
import { Product } from '../../product/product.entity';

@EventSubscriber()
export class DetailSubscriber implements EntitySubscriberInterface<Details> {
    listenTo() {
        return Details;
    }

    async afterInsert(event: InsertEvent<Details>) {
        const { quantity, product } = event.entity;
        const newStock = product.stock - quantity;
        await getRepository(Product)
            .createQueryBuilder()
            .update(Product)
            .set({ stock:  newStock})
            .where('id = :id', { id: product.id })
            .execute();
    }

    async beforeRemove(event: RemoveEvent<Details>) {
        const { product, quantity } = event.entity;
        const updatedStock = product.stock + quantity;
        await getRepository(Product)
            .createQueryBuilder('product')
            .update(Product)
            .set({ stock:  updatedStock})
            .where('product.id = :id', { id: product.id })
            .execute();
    }
}
