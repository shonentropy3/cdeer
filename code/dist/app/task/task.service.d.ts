import { Repository } from 'typeorm';
import { BlockLog } from '../../entity/BlockLog';
export declare class TaskService {
    private readonly blockLogRepository;
    constructor(blockLogRepository: Repository<BlockLog>);
    private readonly logger;
    _insertLog: () => Promise<void>;
    handleInterval(): void;
    init(): void;
    handleTimeout(): void;
}
