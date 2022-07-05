import { Timestamp } from 'typeorm';
export declare class Market {
    id: number;
    uuid: string;
    name: string;
    age: number;
    color: string;
    createAt: Timestamp;
    updateAt: Timestamp;
}
