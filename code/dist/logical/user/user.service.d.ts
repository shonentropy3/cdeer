export declare class UserService {
    getFile(files: any): Promise<unknown>;
    addFile(file: any, hash: any): {
        code: number;
        message: string;
        data: {
            hash: any;
        };
    };
}
