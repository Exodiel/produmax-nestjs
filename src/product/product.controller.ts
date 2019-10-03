import { Response } from 'express';
import { ProductService } from './product.service';
import { FileInterceptor } from '@nestjs/platform-express';
// tslint:disable-next-line: max-line-length
import { Controller, Get, Res, HttpStatus, Param, NotFoundException, Post, UseInterceptors, UploadedFile, Body, HttpException, Delete, Put, Query } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname, resolve } from 'path';
import { v4 as uuid } from 'uuid';
import { ProductDTO } from './product.dto';
import { unlink } from 'fs-extra';

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

    @Get('/search-name')
    async getProductByName(@Res() res: Response, @Query('name') name: string) {
        const product = await this.productService.getProductByName(name);
        if (!product) { throw new NotFoundException('No se encontró el producto'); }

        return res.status(HttpStatus.OK).json(product);
    }

    @Post('/create')
    @UseInterceptors(FileInterceptor('image', {
        limits: {
            fileSize: 1 * 1000 * 1000,
        },
        fileFilter: async (req: any, file: any, cb: any) => {
            if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                // Allow storage of file
                cb(null, true);
            } else {
                // Reject file
                await unlink(resolve(file.path));
                cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
            }
        },
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
              // Calling the callback passing the random name generated with the original extension name
              cb(null, `${uuid()}${extname(file.originalname)}`);
            },
        }),
    }))
    async createProduct(@Res() res: Response, @UploadedFile() file, @Body() productDTO: ProductDTO) {
        const imagePath = file.path;
        const newProduct = await this.productService.createProduct(productDTO, imagePath);
        return res.status(HttpStatus.CREATED).json({
            message: 'Producto Creado',
            newProduct,
        });
    }

    @Delete('/delete')
    async deleteProduct(@Res() res: Response, @Query('id') id: number) {
        const deletedProduct = await this.productService.deleteProduct(id);
        return res.status(HttpStatus.OK).json({message: 'Producto Eliminado'});
    }

    @Put('/update')
    @UseInterceptors(FileInterceptor('image', {
        limits: {
            fileSize: 1 * 1000 * 1000,
        },
        fileFilter: async (req: any, file: any, cb: any) => {
            if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                // Allow storage of file
                cb(null, true);
            } else {
                // Reject file
                await unlink(resolve(file.path));
                cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
            }
        },
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
              // Calling the callback passing the random name generated with the original extension name
              cb(null, `${uuid()}${extname(file.originalname)}`);
            },
        }),
    }))
    async updateProduct(@Res() res: Response, @UploadedFile() file, @Query('id') id: number, @Body() productDTO: ProductDTO) {
        const imagePath = file.path;
        const updatedProduct = await this.productService.updateProduct(id, imagePath, productDTO);
        return res.status(HttpStatus.OK).json({
            message: 'Producto actualizado',
            updatedProduct,
        });
    }
}
