import { AppGateway } from '../app.gateway';
import { Unit } from '../unit/unit.entity';
import { ProductDTO } from './product.dto';
import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository, DataSource } from 'typeorm';
import { SubCategory } from '../sub-category/sub.category.entity';
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
        private gateway: AppGateway,
        private dataSource: DataSource,
    ) { }

    async getProducts(): Promise<Product[]> {
        const products = await this.productRepository.find();
        return products;
    }

    async getProduct(id: string): Promise<Product> {
        const product = await this.productRepository.findOneByOrFail({ id });
        return product;
    }

    async getProductByName(productName: string): Promise<Product[]> {
        const products = await this.dataSource.getRepository(Product)
            .createQueryBuilder('products')
            .where('products.name like :name', { name: '%' + productName + '%' })
            .getMany();
        if (!products) {
            throw new NotFoundException('No se encontraron coincidencias');
        }
        return products;
    }

    async createProduct(productDTO: ProductDTO): Promise<Product> {
        const { name, detail, stock, unitPrice, weight, unitId, subcategoryId, imageUrl, productId } = productDTO;
        const product = this.productRepository.create({ id: productId, name, detail, stock, unitPrice, weight, unitId, subcategoryId, imageUrl });
        const newProduct = await this.productRepository.save(product);
        const counter = await this.getCountProducts();
        this.gateway.wss.emit('newProduct', newProduct);
        this.gateway.wss.emit('countProducts', counter);
        return newProduct;
    }

    async getCountProducts() {
        const count = await this.dataSource.getRepository(Product)
            .createQueryBuilder('product')
            .select('COUNT(id) as counter')
            .getRawOne();

        return !count ? 0 : count;
    }

    async deleteProduct(productId: string): Promise<any> {
        const product = await this.productRepository.findOneOrFail({ where: { id: productId }, relations: ['image'] });
        if (!product) {
            throw new HttpException('No se encontró la unidad', HttpStatus.NOT_FOUND);
        }
        await deletePhoto(product.imageUrl);
        await this.productRepository.remove(product);
        return product;
    }

    async updateProduct(productId: string, productDTO: ProductDTO): Promise<Product> {
        let product = await this.productRepository.findOne({ where: { id: productId } });
        if (!product) {
            throw new HttpException('No se encontró el producto', HttpStatus.NOT_FOUND);
        }
        const { unitId, subcategoryId, name, detail, stock, unitPrice, weight, imageUrl } = productDTO;

        if (product.imageUrl !== imageUrl) {
            await deletePhoto(product.imageUrl);
        }

        await this.productRepository.update({ id: productId }, {
            name,
            detail,
            stock,
            unitPrice,
            weight,
            imageUrl: !imageUrl ? product.imageUrl : imageUrl,
            unitId,
            subcategoryId,
        });
        product = await this.productRepository.findOneOrFail({ where: { id: productId } });

        return product;
    }

    async searchUnit(productId: string): Promise<Unit> {
        const unit = await this.dataSource.getRepository(Unit)
            .createQueryBuilder('unit')
            .innerJoin('unit.products', 'product', 'product.id = :id', { id: productId })
            .getOne();
        if (!unit) {
            throw new NotFoundException('No se encontró la unidad');
        }

        return unit;
    }

    async searchSubCategory(productId: string): Promise<SubCategory> {
        const subcategory = await this.dataSource.getRepository(SubCategory)
            .createQueryBuilder('subcategory')
            .innerJoin('subcategory.products', 'product')
            .where('product.id = :id', { id: productId })
            .getOne();
        if (!subcategory) {
            throw new NotFoundException('No se encontró la subcategoría');
        }
        return subcategory;
    }

}
