import {EventSubscriber, EntitySubscriberInterface, InsertEvent} from 'typeorm';
import { User } from '../user.entity';
import bcrypt from 'bcrypt';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
    listenTo() {
        return User;
    }

    async beforeInsert(event: InsertEvent<User>) {
        event.entity.password = await bcrypt.hash(event.entity.password, 12);
    }

}
