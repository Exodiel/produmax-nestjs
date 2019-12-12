import { CategoryDTO } from './category.dto';
import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';
import { Category } from './category.entity';
import { Image } from '../image/image.entity';
import { deletePhoto } from '../utils/file-uploading';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Image)
        private readonly imageRepository: Repository<Image>,
    ) {}

    async getCategories(): Promise<Category[]> {
        const categories = await this.categoryRepository.find({ relations: ['image'] });
        return categories;
    }

    async getCategory(categoryId: number): Promise<Category> {
        const category = await this.categoryRepository.findOneOrFail(categoryId, { relations: ['image'] });
        return category;
    }

    async getCategoryByName(name: string): Promise<Category> {
        const category = await this.categoryRepository.findOneOrFail({ name }, { relations: ['image'] });
        return category;
    }

    async createCategory(categoryDTO: CategoryDTO): Promise<Category> {
        const { name, imageId} = categoryDTO;
        const image = await this.searchImage(imageId);
        const category = this.categoryRepository.create({ name, image });
        await this.categoryRepository.save(category);
        return category;
    }

    private async searchImage(imageId: number): Promise<Image> {
        const image = await this.imageRepository.findOne({ where: { id: imageId } });
        if (!image) {
            throw new NotFoundException('No se encontró la imagen');
        }

        return image;
    }

    async deleteCategory(categoryId: number): Promise<Category> {
        const category = await this.categoryRepository.findOneOrFail({ id: categoryId });
        if (!category) {
            throw new HttpException('No se encontró la categoría', HttpStatus.NOT_FOUND);
        }
        await deletePhoto(category.image.filepath);
        await this.categoryRepository.delete({id: categoryId});
        return category;
    }

    async updateCategory(categoryId: number, categoryDTO: Partial<CategoryDTO>): Promise<Category> {
        const category = await this.categoryRepository.findOneOrFail({ id: categoryId });
        const { name, imageId } = categoryDTO;
        if (!category) {
            throw new HttpException('No se encontró la categoría', HttpStatus.NOT_FOUND);
        }
        const image = await this.searchImage(imageId);
        const imageCategory = await this.imageRepository.findOneOrFail(category.image.id);
        if (category.image.filepath !== image.filepath) {
            await this.imageRepository.remove(imageCategory);
            await deletePhoto(category.image.filepath);
        }
        await this.categoryRepository.update({id: categoryId},
            {
                name,
                image,
            },
        );
        return category;
    }

    async getCountCategories() {
        const count = await getRepository(Category)
            .createQueryBuilder('category')
            .select('COUNT(id) as counter')
            .getRawOne();

        return !count ? 0 : count;
    }
}
