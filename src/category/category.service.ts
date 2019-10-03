import { CategoryDTO } from './category.dto';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {
    constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>) {}

    async getCategories(): Promise<Category[]> {
        const categories = await this.categoryRepository.find();
        return categories;
    }

    async getCategory(categoryId: number): Promise<Category> {
        const category = await this.categoryRepository.findOneOrFail(categoryId);
        return category;
    }

    async getCategoryByName(name: string): Promise<Category> {
        const category = await this.categoryRepository.findOne({ name });
        return category;
    }

    async createCategory(categoryDTO: CategoryDTO): Promise<Category> {
        const category = await this.categoryRepository.save(categoryDTO);
        return category;
    }

    async deleteCategory(categoryId: number): Promise<Category> {
        let category = await this.categoryRepository.findOneOrFail({ id: categoryId });
        if (!category) {
            throw new HttpException('No se encontró la categoría', HttpStatus.NOT_FOUND);
        }
        await this.categoryRepository.delete({id: categoryId});
        category = await this.categoryRepository.findOneOrFail({ id: categoryId });
        return category;
    }

    async updateCategory(categoryId: number, categoryDTO: Partial<CategoryDTO>): Promise<Category> {
        let category = await this.categoryRepository.findOneOrFail({ id: categoryId });
        if (!category) {
            throw new HttpException('No se encontró la categoría', HttpStatus.NOT_FOUND);
        }
        await this.categoryRepository.update({id: categoryId}, categoryDTO);
        category = await this.categoryRepository.findOneOrFail({ id: categoryId });
        return category;
    }
}
