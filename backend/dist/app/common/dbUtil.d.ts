import { Repository } from 'typeorm';
import { BlockLog } from '../demand/entity/BlockLog';
export declare class dbutils {
    private readonly blockLogRepository;
    constructor(blockLogRepository: Repository<BlockLog>);
    get(): Promise<any[]>;
    getLabel(proContent: any): Promise<any[]>;
    insert(table: any, keys: any, values: any): Promise<void>;
}
export default function _get(): Promise<any[]>;
