import { Project } from 'src/entity/Project';
import { BlockLog } from 'src/entity/BlockLog';
import 'ethers';
import { Repository } from 'typeorm';
export declare class TaskService {
    private readonly projectRepository;
    private readonly blockLogRepository;
    constructor(projectRepository: Repository<Project>, blockLogRepository: Repository<BlockLog>);
    private readonly logger;
    _insertLog: () => Promise<void>;
    modifyDemandLog: () => Promise<void>;
    handleInterval(): void;
    handleTimeout(): Promise<void>;
}
