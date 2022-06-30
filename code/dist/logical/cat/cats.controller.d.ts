import { CreateCatDto } from './create-cat-dto';
export declare class CatsController {
    createCat(createCatDto: CreateCatDto): string;
    findAllCats(): string;
    findWildcard(): string;
    findMore(params: any): string;
    findName(name: any): string;
}
