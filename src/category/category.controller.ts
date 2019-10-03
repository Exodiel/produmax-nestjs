import { CategoryDTO } from './category.dto';
import { CategoryService } from './category.service';
import { Response } from 'express';
import { Controller, Get, Res, HttpStatus, Post, Body, Param, NotFoundException, Put, Delete } from '@nestjs/common';

@Controller('categories')
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    @Get('/')
    async getCategories(@Res() res: Response) {
        const categories = await this.categoryService.getCategories();
        return res.status(HttpStatus.OK).json(categories);
    }

    @Post('/')
    async createCategory(@Res() res: Response, @Body() categoryDTO: CategoryDTO) {
        const category = await this.categoryService.createCategory(categoryDTO);
        return res.status(HttpStatus.OK).json({
            message: 'Categoría creada',
            category,
        });
    }

    @Get('/:id')
    async getCategory(@Res() res: Response, @Param('id') id: number) {
        const category = await this.categoryService.getCategory(id);
        if (!category) {
            throw new NotFoundException('No se encontró la categoría');
        }
        return res.status(HttpStatus.OK).json(category);
    }

    @Put('/:id')
    async updateCategory(@Res() res: Response, @Body() categoryDTO: CategoryDTO, @Param('id') id: number) {
        const category = await this.categoryService.updateCategory(id, categoryDTO);
        return res.status(HttpStatus.OK).json({
            message: 'Categoría actualizada',
            category,
        });
    }

    @Delete('/:id')
    async deleteCategory(@Res() res: Response, @Param('id') id: number) {
        const category = await this.categoryService.deleteCategory(id);
        return res.status(HttpStatus.OK).json({
            message: 'Categoría eliminada',
            category,
        });
    }
}
