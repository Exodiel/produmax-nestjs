import { AppGateway } from '../app.gateway';
import { Unit } from '../unit/unit.entity';
import { ProductDTO } from './product.dto';
import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository, getRepository } from 'typeorm';
import { SubCategory } from '../sub-category/sub.category.entity';
import { Image } from '../image/image.entity';
import { deletePhoto } from '../utils/file-uploading';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(SubCategory)
        private readonly subcategoryRepository: Repository<SubCategory>,
        @InjectRepository(Unit)
        private readonly unitRepository: Repository<Unit>,
        @InjectRepository(Image)
        private readonly imageRepository: Repository<Image>,
        private gateway: AppGateway,
    ) {}

    async getProducts(): Promise<Product[]> {
        const products = await this.productRepository.find({ relations: ['image'] });
        return products;
    }

    async getProduct(id: number): Promise<Product> {
        const product = await this.productRepository.findOneOrFail(id, { relations: ['image'] });
        return product;
    }

    async getProductByName(productName: string): Promise<Product[]> {
        const products = await getRepository(Product)
            .createQueryBuilder('products')
            .leftJoinAndSelect('products.image', 'image')
            .where('products.name like :name', { name: '%' + productName + '%' })
            .getMany();
        if (!products) {
            throw new NotFoundException('No se encontraron coincidencias');
        }
        return products;
    }

    async createProduct(productDTO: ProductDTO): Promise<Product> {
        const { name, detail, stock, unitPrice, weight, unitId, subcategoryId, imageId } = productDTO;
        const unit = await this.getUnit(unitId);
        const subcategory = await this.getSubCategory(subcategoryId);
        const image = await this.searchImage(imageId);
        const product = this.productRepository.create({ name, detail, stock, unitPrice, weight, unit, subcategory, image });
        await this.productRepository.save(product);
        const lastProduct = await this.getLastProduct();
        const counter = await this.getCountProducts();
        this.gateway.wss.emit('newProduct', lastProduct);
        this.gateway.wss.emit('countProducts', counter);
        return lastProduct;
    }

    private async searchImage(imageId: number): Promise<Image> {
        const image = await this.imageRepository.findOne({ where: { id: imageId } });
        if (!image) {
            throw new NotFoundException('No se encontró la imagen');
        }

        return image;
    }

    async getCountProducts() {
        const count = await getRepository(Product)
            .createQueryBuilder('product')
            .select('COUNT(id) as counter')
            .getRawOne();

        return !count ? 0 : count;
    }

    async getLastProduct() {
        const product = await getRepository(Product)
            .createQueryBuilder('product')
            .orderBy('product.id', 'DESC')
            .limit(1)
            .getOne();
        return product;
    }

    async deleteProduct(productId: number): Promise<any> {
        const product = await this.productRepository.findOneOrFail({ id: productId });
        if (!product) {
            throw new HttpException('No se encontró la unidad', HttpStatus.NOT_FOUND);
        }
        await deletePhoto(product.image.filepath);
        await this.productRepository.delete({id: productId});
        return product;
    }

    async updateProduct(productId: number, productDTO: ProductDTO): Promise<Product> {
        let product = await this.productRepository.findOne({ where: { id: productId } });
        if (!product) {
            throw new HttpException('No se encontró el producto', HttpStatus.NOT_FOUND);
        }
        const { unitId, subcategoryId, name, detail, stock, unitPrice, weight, imageId } = productDTO;
        const unit = await this.getUnit(unitId);
        const subcategory = await this.getSubCategory(subcategoryId);
        const image = await this.searchImage(imageId);
        const imageProduct = await this.imageRepository.findOneOrFail(product.image.id);
        if (product.image.filepath !== image.filepath) {
            await this.imageRepository.remove(imageProduct);
            await deletePhoto(product.image.filepath);
        }
        await this.productRepository.update({id: productId}, {
            name,
            detail,
            stock,
            unitPrice,
            weight,
            image,
            unit,
            subcategory,
        });
        product = await this.productRepository.findOneOrFail({ where: { id: productId } });
        return product;
    }

    private async getUnit(unitId: number): Promise<Unit> {
        const unit = await this.unitRepository.findOne({ where: { id: unitId } });
        if (!unit) {
            throw new NotFoundException('No se encontró la unidad');
        }
        return unit;
    }

    private async getSubCategory(subcategoryId: number): Promise<SubCategory> {
        const subcategory = await this.subcategoryRepository.findOne({ where: { id: subcategoryId } });
        if (!subcategory) {
            throw new NotFoundException('No se encontró la categoría');
        }
        return subcategory;
    }

    async searchUnit(productId: number): Promise<Unit> {
        const unit = await getRepository(Unit)
            .createQueryBuilder('unit')
            .innerJoin('unit.products', 'product', 'product.id = :id', { id: productId })
            .getOne();
        if (!unit) {
            throw new NotFoundException('No se encontró la unidad');
        }

        return unit;
    }

    async searchSubCategory(productId: number): Promise<SubCategory> {
        const subcategory = await getRepository(SubCategory)
            .createQueryBuilder('subcategory')
            .innerJoin('subcategory.products', 'product')
            .where('product.id = :id', { id:  productId})
            .getOne();
        if (!subcategory) {
            throw new NotFoundException('No se encontró la subcategoría');
        }
        return subcategory;
    }

}
