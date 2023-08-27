import { EventSubscriber, EntitySubscriberInterface, InsertEvent, DataSource, RemoveEvent } from 'typeorm';
import { Details } from '../details.entity';
import { Product } from '../../product/product.entity';

@EventSubscriber()
export class DetailSubscriber implements EntitySubscriberInterface<Details> {
    // constructor(dataSource: DataSource) {
    //     dataSource.subscribers.push(this);
    // }

    listenTo() {
        return Details;
    }

    async afterInsert(event: InsertEvent<Details>) {
        const { quantity, productId } = event.entity;
        const product = await event.connection.getRepository(Product)
            .createQueryBuilder()
            .where('id = :id', { id: productId })
            .execute()
        const newStock = product.stock - quantity;
        await event.connection.getRepository(Product)
            .createQueryBuilder()
            .update(Product)
            .set({ stock: newStock })
            .where('id = :id', { id: productId })
            .execute();
    }

    async beforeRemove(event: RemoveEvent<Details>) {
        const { productId, quantity } = event.entity;
        const product = await event.connection.getRepository(Product)
            .createQueryBuilder()
            .where('id = :id', { id: productId })
            .execute()
        const updatedStock = product.stock + quantity;
        await event.connection.getRepository(Product)
            .createQueryBuilder('product')
            .update(Product)
            .set({ stock: updatedStock })
            .where('product.id = :id', { id: product.id })
            .execute();
    }
}
