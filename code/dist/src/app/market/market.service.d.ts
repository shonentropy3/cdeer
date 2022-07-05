import { AxiosError } from 'axios';
import { Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { Order } from '../../../entities/Order';
export declare class MarketService {
    private readonly orderRepository;
    constructor(orderRepository: Repository<Order>);
    getFile(files: any): false | Promise<unknown>;
    pushFile(file: any, obj: any): any;
    test(): Promise<Order[]>;
    createPjc(body: any): Promise<void>;
    handleError(error: AxiosError): Observable<never>;
}
