import { AxiosError } from 'axios';
import { Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { Order } from '../../entity/Order';
import { Project } from '../../entity/Project';
export declare class MarketService {
    private readonly orderRepository;
    private readonly projectRepository;
    constructor(orderRepository: Repository<Order>, projectRepository: Repository<Project>);
    getFile(files: any): false | Promise<unknown>;
    pushFile(file: any, obj: any): any;
    test(): Promise<Order[]>;
    getPjc(): Promise<Project[]>;
    createPjc(body: any): Promise<Project[]>;
    handleError(error: AxiosError): Observable<never>;
}
