import { SubCategoryDTO } from './sub-category.dto';
import { SubCategory } from './sub.category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Category } from '../category/category.entity';
import { deletePhoto } from '../utils/file-uploading';

@Injectable()
export class SubCategoryService {
    constructor(
        @InjectRepository(SubCategory)
        private readonly subcategoryRepository: Repository<SubCategory>,
        private dataSource: DataSource,
    ) { }

    async getSubcategories(): Promise<SubCategory[]> {
        const subcategories = await this.subcategoryRepository.find({ relations: ['products'] });
        return subcategories;
    }

    async getSubCategoriesRelationated(categoryId: string): Promise<SubCategory[]> {
        const subcategories = await this.subcategoryRepository.find({ where: { categoryId } });

        return subcategories;
    }

    async getSubcategory(id: string): Promise<SubCategory> {
        const subcategory = await this.subcategoryRepository.findOneOrFail({ where: { id }, relations: ['products'] });
        return subcategory;
    }

    async createSubcategory(subCategoryDTO: SubCategoryDTO): Promise<SubCategory> {
        const { name, categoryId, imageUrl } = subCategoryDTO;
        const category = await this.dataSource.getRepository(Category)
            .createQueryBuilder('category')
            .where('category.id = :id', { id: categoryId })
            .getOne();
        if (!category) {
            throw new NotFoundException('Categoría no encontrada');
        }
        const subcategory = this.subcategoryRepository.create({ name, categoryId, imageUrl });
        const lastSubcategory = await this.subcategoryRepository.save(subcategory);
        return lastSubcategory;
    }

    async updateSubCategory(subcategoryID: string, subCategoryDTO: SubCategoryDTO): Promise<SubCategory> {
        let subcategory = await this.subcategoryRepository.findOneByOrFail({ id: subcategoryID });
        if (!subcategory) {
            throw new HttpException('No se encontró la categoría', HttpStatus.NOT_FOUND);
        }
        const { name, imageUrl } = subCategoryDTO;
        if (subcategory.imageUrl !== imageUrl) {
            await deletePhoto(subcategory.imageUrl);
        }
        await this.subcategoryRepository.update(subcategoryID, {
            name,
            imageUrl,
        });
        subcategory = await this.subcategoryRepository.findOneByOrFail({ id: subcategoryID });
        return subcategory;
    }

    async deleteSubCategory(subcategoryID: string): Promise<any> {
        const subcategory = await this.subcategoryRepository.findOneByOrFail({ id: subcategoryID });
        if (!subcategory) {
            throw new HttpException('No se encontró la categoría', HttpStatus.NOT_FOUND);
        }
        await deletePhoto(subcategory.imageUrl);
        await this.subcategoryRepository.delete(subcategoryID);
        return subcategory;
    }

    async searchCategory(subcategoryId: string): Promise<Category> {
        const category = await this.dataSource.getRepository(Category)
            .createQueryBuilder('category')
            .innerJoin('category.subcategories', 'subcategory')
            .where('subcategory.id = :id', { id: subcategoryId })
            .getOne();
        if (!category) {
            throw new NotFoundException('No se encontró la categoria');
        }

        return category;
    }
}
