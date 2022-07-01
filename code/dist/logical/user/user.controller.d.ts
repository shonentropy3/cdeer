import { UserService } from './user.service';
export declare class UserController {
    private readonly usersService;
    constructor(usersService: UserService);
    findOne(body: any): string;
    testPort(): import("rxjs").Observable<any>;
    uploadFile(files: any): Promise<{
        code: number;
        message: string;
        data: {
            hash: any;
        };
    }>;
    xx(): string;
}
