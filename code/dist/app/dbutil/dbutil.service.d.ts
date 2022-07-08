import { Project } from '../../entity/Project';
import { BlockLog } from '../../entity/BlockLog';
import { Repository } from 'typeorm';
export declare class DbutilService {
    private readonly projectRepository;
    private readonly blockLogRepository;
    constructor(projectRepository: Repository<Project>, blockLogRepository: Repository<BlockLog>);
    Insert(): Promise<void>;
    Select(): Promise<void>;
    Update(): Promise<void>;
}
