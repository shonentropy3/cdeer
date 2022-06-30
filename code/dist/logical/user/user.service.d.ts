import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { Observable } from 'rxjs';
export declare class UserService {
    private readonly http;
    constructor(http: HttpService);
    findOne(body: any): any;
    testPort(): Observable<any>;
    getFile(files: any): void;
    add(time: any): Promise<unknown>;
    handleError(error: AxiosError): Observable<never>;
}
