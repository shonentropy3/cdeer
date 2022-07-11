import { Repository } from 'typeorm';
import 'ethers';
import { BlockLog } from '../../entity/BlockLog';
import { Project } from '../../entity/Project';
export declare class TaskService {
    private readonly projectRepository;
    private readonly blockLogRepository;
    constructor(projectRepository: Repository<Project>, blockLogRepository: Repository<BlockLog>);
    private readonly logger;
    _insertLog: () => Promise<void>;
    handleInterval(): void;
    init(): void;
    handleTimeout(): void;
}
