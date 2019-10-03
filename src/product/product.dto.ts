import { Category } from '../category/category.entity';
import { Unit } from '../unit/unit.entity';
export class ProductRO {
    id: number;
    name: string;
    details?: string;
    stock: number;
    unitPrice: number;
    comboPrice?: number;
    imagePath: string;
    unit: Unit;
    category: Category;
}

// tslint:disable-next-line: max-classes-per-file
export class ProductDTO {
    name: string;
    details?: string;
    stock: number;
    unitPrice: number;
    comboPrice?: number;
    unitId: number;
    categoryId: number;
}
