import { AppGateway } from '../app.gateway';
import { Unit } from '../unit/unit.entity';
import { ProductDTO } from './product.dto';
import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository, getRepository } from 'typeorm';
import { Category } from '../category/category.entity';
import { unlink } from 'fs-extra';
import { resolve } from 'path';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Unit)
        private readonly unitRepository: Repository<Unit>,
        private gateway: AppGateway,
    ) {}

    async getProducts(): Promise<Product[]> {
        const products = await this.productRepository.find();
        return products;
    }

    async getProduct(id: number): Promise<Product> {
        const product = await this.productRepository.findOneOrFail(id);
        return product;
    }

    async getProductByName(productName: string): Promise<Product[]> {
        const products = await getRepository(Product)
            .createQueryBuilder('products')
            .where('products.name like :name', { name: '%' + productName + '%' })
            .getMany();
        if (!products) {
            throw new NotFoundException('No se encontró la unidad');
        }
        return products;
    }

    async createProduct(productDTO: ProductDTO, imagePath: string): Promise<Product> {
        const { name, detail, stock, unitPrice, comboPrice, unitId, categoryId} = productDTO;
        const unit = await this.unitRepository.findOne({ where: { id: unitId } });
        if (!unit) {
            throw new NotFoundException('No se encontró la unidad');
        }
        const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
        if (!category) {
            throw new NotFoundException('No se encontró la categoría');
        }
        const product = this.productRepository.create({ name, detail, stock, unitPrice, comboPrice, imagePath, unit, category });
        await this.productRepository.save(product);
        const lastProduct = await this.getLastProduct();
        this.gateway.wss.emit('newProduct', lastProduct);
        return lastProduct;
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
        await unlink(resolve(product.imagePath));
        await this.productRepository.delete({id: productId});
        return product;
    }

    async updateProduct(productId: number, imagePath: string, productDTO: ProductDTO): Promise<Product> {
        let product = await this.productRepository.findOneOrFail({ where: { id: productId } });
        if (!product) {
            await unlink(imagePath);
            throw new HttpException('No se encontró el producto', HttpStatus.NOT_FOUND);
        }
        const existPath = resolve(product.imagePath);
        const { unitId, categoryId, name, detail, stock, unitPrice, comboPrice } = productDTO;
        const unit = await this.unitRepository.findOne({ where: { id: unitId } });
        if (!unit) {
            throw new NotFoundException('No se encontró la unidad');
        }
        const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
        if (!category) {
            throw new NotFoundException('No se encontró la categoría');
        }
        if (!existPath) {
            throw new NotFoundException('No se encontró la imagen');
        }
        await this.productRepository.update({id: productId}, {
            name,
            detail,
            stock,
            unitPrice,
            imagePath: !imagePath ? product.imagePath : imagePath,
            comboPrice,
            unit,
            category,
        });
        await unlink(existPath);
        product = await this.productRepository.findOneOrFail({ where: { id: productId } });
        return product;
    }

}
