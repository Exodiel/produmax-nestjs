import { SubCategoryDTO } from './sub-category.dto';
import { SubCategory } from './sub.category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { Repository, getRepository } from 'typeorm';
import { Category } from '../category/category.entity';
import { Image } from '../image/image.entity';
import { deletePhoto } from '../utils/file-uploading';

@Injectable()
export class SubCategoryService {
    constructor(
        @InjectRepository(SubCategory)
        private readonly subcategoryRepository: Repository<SubCategory>,
        @InjectRepository(Image)
        private readonly imageRepository: Repository<Image>,
    ) {}

    async getSubcategories(): Promise<SubCategory[]> {
        const subcategories = await this.subcategoryRepository.find({ relations: ['image', 'products'] });
        return subcategories;
    }

    async getSubCategoriesRelationated(categoryId: number): Promise<SubCategory[]> {
        const subcategories = await this.subcategoryRepository.find({ relations: ['image', 'products'], where: { category: categoryId } });

        return subcategories;
    }

    async getSubcategory(id: number): Promise<SubCategory> {
        const subcategory = await this.subcategoryRepository.findOneOrFail(id, { relations: ['image', 'products'] });
        return subcategory;
    }

    async createSubcategory(subCategoryDTO: SubCategoryDTO): Promise<SubCategory> {
        const { name, categoryId, imageId } = subCategoryDTO;
        const category = await getRepository(Category)
            .createQueryBuilder('category')
            .where('category.id = :id', { id: categoryId })
            .getOne();
        if (!category) {
            throw new NotFoundException('Categoría no encontrada');
        }
        const image = await this.searchImage(imageId);
        const subcategory = this.subcategoryRepository.create({ name, category, image });
        await this.subcategoryRepository.save(subcategory);
        const lastSubcategory = await this.getLastSubcategory();
        return lastSubcategory;
    }

    private async searchImage(imageId: number): Promise<Image> {
        const image = await this.imageRepository.findOne({ where: { id: imageId } });
        if (!image) {
            throw new NotFoundException('No se encontró la imagen');
        }

        return image;
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
        const { name, imageId } = subCategoryDTO;
        const image = await this.searchImage(imageId);
        const imageSub = await this.imageRepository.findOneOrFail(subcategory.image.id);
        if (subcategory.image.filepath !== image.filepath) {
            await this.imageRepository.remove(imageSub);
            await deletePhoto(subcategory.image.filepath);
        }
        await this.subcategoryRepository.update(subcategoryID, {
            name,
            image,
        });
        subcategory = await this.subcategoryRepository.findOneOrFail(subcategoryID);
        return subcategory;
    }

    async deleteSubCategory(subcategoryID: number): Promise<any> {
        const subcategory = await this.subcategoryRepository.findOneOrFail(subcategoryID);
        if (!subcategory) {
            throw new HttpException('No se encontró la categoría', HttpStatus.NOT_FOUND);
        }
        await deletePhoto(subcategory.image.filepath);
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
