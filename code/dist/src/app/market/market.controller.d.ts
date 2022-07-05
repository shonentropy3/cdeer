import { MarketService } from './market.service';
export declare class MarketController {
    private readonly marketService;
    constructor(marketService: MarketService);
    uploadFile(files: any): Promise<any>;
    createProject(body: any): void;
    getMarketList(): Promise<import("../../../entities/Order").Order[]>;
}
