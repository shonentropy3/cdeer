import { AxiosError } from 'axios';
import { Observable } from 'rxjs';
export declare class MarketService {
    getFile(files: any): Promise<unknown>;
    pushFile(file: any, obj: any): string;
    createPjc(body: any): Promise<void>;
    handleError(error: AxiosError): Observable<never>;
}
