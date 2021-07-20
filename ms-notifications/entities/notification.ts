import {Column, Entity, ObjectIdColumn} from "typeorm";

@Entity()
export class Notification {
    @ObjectIdColumn()
    id: string;

    @Column()
    type: string;

    @Column()
    content: string;
}