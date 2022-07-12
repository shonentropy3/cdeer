import { MarketService } from './market.service';
export declare class MarketController {
    private readonly marketService;
    constructor(marketService: MarketService);
    uploadFile(files: any): Promise<any>;
    createProject(body: any): Promise<import("../../entity/Project").Project[]>;
    modifyDemand(body: any): Promise<import("../../entity/Project").Project[]>;
    getMarketData(): Promise<import("../../entity/Project").Project[]>;
    projectDetail(body: any): Promise<import("../../entity/Project").Project[]>;
    createCat(body: any): string;
}
