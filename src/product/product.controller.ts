import { Response } from 'express';
import { Controller, Get, Res, HttpStatus, NotFoundException, Post, Body, Delete, Put, Query } from '@nestjs/common';
import { Roles, Unprotected } from 'nest-keycloak-connect';
import { ProductService } from './product.service';
import { ProductDTO } from './product.dto';

@Controller('products')
export class ProductController {
    constructor(
        private productService: ProductService,
    ) { }

    @Get('/')
    @Unprotected()
    async getProducts(@Res() res: Response) {
        const products = await this.productService.getProducts();
        return res.status(HttpStatus.OK).json(products);
    }

    @Get('/single')
    @Unprotected()
    async getProduct(@Res() res: Response, @Query('id') id: string) {
        const product = await this.productService.getProduct(id);
        if (!product) { throw new NotFoundException('No se encontró el producto'); }

        return res.status(HttpStatus.OK).json(product);
    }

    @Get('/counter')
    @Unprotected()
    async getProductsCount(@Res() res: Response) {
        const counter = await this.productService.getCountProducts();

        return res.status(HttpStatus.OK).json(counter);
    }

    @Get('/single/unit')
    @Unprotected()
    async getUnit(@Res() res: Response, @Query('productId') productId: string) {
        const unit = await this.productService.searchUnit(productId);

        return res.status(HttpStatus.OK).json(unit);
    }

    @Get('/single/subcategory')
    @Unprotected()
    async getSubCategory(@Res() res: Response, @Query('productId') productId: string) {
        const subcategory = await this.productService.searchSubCategory(productId);
        return res.status(HttpStatus.OK).json(subcategory);
    }

    @Get('/search-name')
    @Unprotected()
    async getProductByName(@Res() res: Response, @Query('name') name: string) {
        const product = await this.productService.getProductByName(name);
        if (!product) { throw new NotFoundException('No se encontró el producto'); }

        return res.status(HttpStatus.OK).json(product);
    }

    @Post('/create')
    @Roles({
        roles: ['app-admin']
    })
    async createProduct(@Res() res: Response, @Body() productDTO: ProductDTO) {
        const newProduct = await this.productService.createProduct(productDTO);
        return res.status(HttpStatus.CREATED).json({
            message: 'Producto Creado',
            data: newProduct
        });
    }

    @Delete('/delete')
    @Roles({
        roles: ['app-admin']
    })
    async deleteProduct(@Res() res: Response, @Query('id') id: string) {
        await this.productService.deleteProduct(id);
        return res.status(HttpStatus.OK).json({ message: 'Producto Eliminado' });
    }

    @Put('/update')
    @Roles({
        roles: ['app-admin']
    })
    async updateProduct(@Res() res: Response, @Query('id') id: string, @Body() productDTO: ProductDTO) {
        await this.productService.updateProduct(id, productDTO);
        return res.status(HttpStatus.OK).json({
            message: 'Producto actualizado',
        });
    }

}
