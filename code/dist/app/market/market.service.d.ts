import { AxiosError } from 'axios';
import { Observable } from 'rxjs';
export declare class MarketService {
    getFile(files: any): false | Promise<unknown>;
    pushFile(file: any, obj: any): any;
    createPjc(body: any): Promise<void>;
    handleError(error: AxiosError): Observable<never>;
}
