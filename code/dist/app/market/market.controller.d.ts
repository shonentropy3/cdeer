import { MarketService } from './market.service';
export declare class MarketController {
    private readonly marketService;
    constructor(marketService: MarketService);
    uploadFile(files: any): Promise<any>;
    createProject(body: any): Promise<import("../../entity/Project").Project[]>;
    getMarketData(): Promise<import("../../entity/Project").Project[]>;
    getMarketList(): Promise<import("../../entity/Order").Order[]>;
    createCat(body: any): string;
}
