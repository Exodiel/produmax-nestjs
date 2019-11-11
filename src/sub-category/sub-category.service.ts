import { SubCategoryDTO } from './sub-category.dto';
import { SubCategory } from './sub.category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { Repository, getRepository } from 'typeorm';
import { Category } from '../category/category.entity';
import { deletePhoto } from '../utils/file-uploading';

@Injectable()
export class SubCategoryService {
    constructor(
        @InjectRepository(SubCategory)
        private readonly subcategoryRepository: Repository<SubCategory>,
    ) {}

    async getSubcategories(): Promise<SubCategory[]> {
        const subcategories = await this.subcategoryRepository.find({ relations: ['products'] });
        return subcategories;
    }

    async getSubcategory(id: number): Promise<SubCategory> {
        const subcategory = await this.subcategoryRepository.findOneOrFail(id, { relations: ['products'] });
        return subcategory;
    }

    async createSubcategory(subCategoryDTO: SubCategoryDTO): Promise<SubCategory> {
        const { name, imagePath, categoryId } = subCategoryDTO;
        const category = await getRepository(Category)
            .createQueryBuilder('category')
            .where('category.id = :id', { id: categoryId })
            .getOne();
        if (!category) {
            throw new NotFoundException('Categoría no encontrada');
        }
        const subcategory = this.subcategoryRepository.create({ name, imagePath, category });
        await this.subcategoryRepository.save(subcategory);
        const lastSubcategory = await this.getLastSubcategory();
        return lastSubcategory;
    }

    async getLastSubcategory() {
        const subcategory = await getRepository(SubCategory)
            .createQueryBuilder('subcategory')
            .orderBy('subcategory.id', 'DESC')
            .limit(1)
            .getOne();
        return subcategory;
    }

    async updateSubCategory(subcategoryID: number, subCategoryDTO: SubCategoryDTO): Promise<SubCategory> {
        let subcategory = await this.subcategoryRepository.findOneOrFail(subcategoryID);
        if (!subcategory) {
            throw new HttpException('No se encontró la categoría', HttpStatus.NOT_FOUND);
        }
        const { name, imagePath } = subCategoryDTO;
        if (subcategory.imagePath !== imagePath) {
            await deletePhoto(subcategory.imagePath);
        }
        await this.subcategoryRepository.update(subcategoryID, {
            name,
            imagePath,
        });
        subcategory = await this.subcategoryRepository.findOneOrFail(subcategoryID);
        return subcategory;
    }

    async deleteSubCategory(subcategoryID: number): Promise<any> {
        const subcategory = await this.subcategoryRepository.findOneOrFail(subcategoryID);
        if (!subcategory) {
            throw new HttpException('No se encontró la categoría', HttpStatus.NOT_FOUND);
        }
        await deletePhoto(subcategory.imagePath);
        await this.subcategoryRepository.delete(subcategoryID);
        return subcategory;
    }

    async searchCategory(subcategoryId: number): Promise<Category> {
        const category = await getRepository(Category)
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
