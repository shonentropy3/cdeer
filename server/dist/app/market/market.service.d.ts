import { AxiosError } from 'axios';
import { Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { Project } from '../../entity/Project';
export declare class MarketService {
    private readonly projectRepository;
    constructor(projectRepository: Repository<Project>);
    getFile(files: any): false | Promise<unknown>;
    pushFile(file: any, obj: any): any;
    getMarketData(): Promise<Project[]>;
    getProjectDetail(body: any): Promise<Project[]>;
    createDemand(body: any): Promise<Project[]>;
    modifyDemand(body: any): Promise<Project[]>;
    handleError(error: AxiosError): Observable<never>;
}
