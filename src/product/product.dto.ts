
import { Unit } from '../unit/unit.entity';
import { SubCategory } from '../sub-category/sub.category.entity';
export class ProductRO {
    id: number;
    name: string;
    detail?: string;
    stock: number;
    unitPrice: number;
    weight: number;
    unit: Unit;
    subcategory: SubCategory;
}

// tslint:disable-next-line: max-classes-per-file
export class ProductDTO {
    name: string;
    detail?: string;
    stock: number;
    unitPrice: number;
    weight: number;
    unitId: number;
    subcategoryId: number;
    imageUrl: string;
}
