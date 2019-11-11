import { Response } from 'express';
import { ProductService } from './product.service';
import { Controller, Get, Res, HttpStatus, NotFoundException, Post, Body, Delete, Put, Query } from '@nestjs/common';
import { ProductDTO } from './product.dto';

@Controller('products')
export class ProductController {
    constructor(
        private productService: ProductService,
    ) {}

    @Get('/')
    async getProducts(@Res() res: Response) {
        const products = await this.productService.getProducts();
        return res.status(HttpStatus.OK).json(products);
    }

    @Get('/single')
    async getProduct(@Res() res: Response, @Query('id') id: number) {
        const product = await this.productService.getProduct(id);
        if (!product) { throw new NotFoundException('No se encontró el producto'); }

        return res.status(HttpStatus.OK).json(product);
    }

    @Get('/counter')
    async getProductsCount(@Res() res: Response) {
        const counter = await this.productService.getCountProducts();

        return res.status(HttpStatus.OK).json(counter);
    }

    @Get('/single/unit')
    async getUnit(@Res() res: Response, @Query('productId') productId: number) {
        const unit = await this.productService.searchUnit(productId);

        return res.status(HttpStatus.OK).json(unit);
    }

    @Get('/single/subcategory')
    async getSubCategory(@Res() res: Response, @Query('productId') productId: number) {
        const subcategory = await this.productService.searchSubCategory(productId);
        return res.status(HttpStatus.OK).json(subcategory);
    }

    @Get('/search-name')
    async getProductByName(@Res() res: Response, @Query('name') name: string) {
        const product = await this.productService.getProductByName(name);
        if (!product) { throw new NotFoundException('No se encontró el producto'); }

        return res.status(HttpStatus.OK).json(product);
    }

    @Post('/create')
    async createProduct(@Res() res: Response, @Body() productDTO: ProductDTO) {
        const newProduct = await this.productService.createProduct(productDTO);
        return res.status(HttpStatus.CREATED).json({
            message: 'Producto Creado',
        });
    }

    @Delete('/delete')
    async deleteProduct(@Res() res: Response, @Query('id') id: number) {
        const deletedProduct = await this.productService.deleteProduct(id);
        return res.status(HttpStatus.OK).json({message: 'Producto Eliminado'});
    }

    @Put('/update')
    async updateProduct(@Res() res: Response, @Query('id') id: number, @Body() productDTO: ProductDTO) {
        const updatedProduct = await this.productService.updateProduct(id, productDTO);
        return res.status(HttpStatus.OK).json({
            message: 'Producto actualizado',
        });
    }

}
