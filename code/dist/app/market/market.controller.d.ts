import { MarketService } from './market.service';
export declare class MarketController {
    private readonly marketService;
    constructor(marketService: MarketService);
    uploadFile(files: any): Promise<string>;
    createProject(body: any): void;
}
