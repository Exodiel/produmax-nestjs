import { CategoryDTO } from './category.dto';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Category } from './category.entity';
import { deletePhoto } from '../utils/file-uploading';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        private dataSource: DataSource
    ) {}

    async getCategories(): Promise<Category[]> {
        const categories = await this.categoryRepository.find();
        return categories;
    }

    async getCategory(categoryId: number): Promise<Category> {
        const category = await this.categoryRepository.findOneByOrFail({ id: categoryId });
        return category;
    }

    async getCategoryByName(name: string): Promise<Category> {
        const category = await this.categoryRepository.findOneByOrFail({ name });
        return category;
    }

    async createCategory(categoryDTO: CategoryDTO): Promise<Category> {
        const { name, imageUrl} = categoryDTO;
        const category = this.categoryRepository.create({ name, imageUrl });
        await this.categoryRepository.save(category);
        return category;
    }

    async deleteCategory(categoryId: number): Promise<Category> {
        const category = await this.categoryRepository.findOneByOrFail({ id: categoryId });
        if (!category) {
            throw new HttpException('No se encontró la categoría', HttpStatus.NOT_FOUND);
        }
        await deletePhoto(category.imageUrl);
        await this.categoryRepository.delete({id: categoryId});
        return category;
    }

    async updateCategory(categoryId: number, categoryDTO: Partial<CategoryDTO>): Promise<Category> {
        let category = await this.categoryRepository.findOneByOrFail({ id: categoryId });
        if (!category) {
            throw new HttpException('No se encontró la categoría', HttpStatus.NOT_FOUND);
        }
        const { name, imageUrl } = categoryDTO;
        if (category.imageUrl !== imageUrl) {
            await deletePhoto(category.imageUrl);
        }
        await this.categoryRepository.update({id: categoryId},
            {
                name,
                imageUrl,
            },
        );
        category = await this.categoryRepository.findOneByOrFail({ id: categoryId });
        return category;
    }

    async getCountCategories() {
        const count = await this.dataSource.getRepository(Category)
            .createQueryBuilder('category')
            .select('COUNT(id) as counter')
            .getRawOne();

        return !count ? 0 : count;
    }
}
