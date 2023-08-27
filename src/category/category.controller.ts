import { Response } from 'express';
import { Controller, Get, Res, HttpStatus, Post, Body, NotFoundException, Put, Delete, Query } from '@nestjs/common';
import { Roles, Unprotected } from 'nest-keycloak-connect';
import { CategoryService } from './category.service';
import { CategoryDTO } from './category.dto';

@Controller('categories')
export class CategoryController {
    constructor(private categoryService: CategoryService) { }

    @Get('/')
    @Unprotected()
    async getCategories(@Res() res: Response) {
        const categories = await this.categoryService.getCategories();
        return res.status(HttpStatus.OK).json(categories);
    }

    @Post('/')
    @Roles({
        roles: ['app-admin']
    })
    async createCategory(@Res() res: Response, @Body() categoryDTO: CategoryDTO) {
        await this.categoryService.createCategory(categoryDTO);
        return res.status(HttpStatus.CREATED).json({
            message: 'Categoría creada',
        });
    }

    @Get('/counter')
    @Roles({
        roles: ['app-admin']
    })
    async getUserCounter(@Res() res: Response) {
        const counter = await this.categoryService.getCountCategories();
        return res.status(HttpStatus.OK).json(counter);
    }

    @Get('/single-category')
    @Unprotected()
    async getCategory(@Res() res: Response, @Query('id') id: string) {
        const category = await this.categoryService.getCategory(id);
        if (!category) {
            throw new NotFoundException('No se encontró la categoría');
        }
        return res.status(HttpStatus.OK).json(category);
    }

    @Get('/search-by-name')
    @Roles({
        roles: ['app-admin']
    })
    async getCategoryByName(@Res() res: Response, @Query('name') name: string) {
        const category = await this.categoryService.getCategoryByName(name);
        if (!category) {
            throw new NotFoundException('No se encontró la categoría');
        }
        return res.status(HttpStatus.OK).json(category);
    }

    @Put('/update')
    @Roles({
        roles: ['app-admin']
    })
    async updateCategory(@Res() res: Response, @Body() categoryDTO: CategoryDTO, @Query('id') id: string) {
        await this.categoryService.updateCategory(id, categoryDTO);
        return res.status(HttpStatus.OK).json({
            message: 'Categoría actualizada',
        });
    }

    @Delete('/delete')
    @Roles({
        roles: ['app-admin']
    })
    async deleteCategory(@Res() res: Response, @Query('id') id: string) {
        await this.categoryService.deleteCategory(id);
        return res.status(HttpStatus.OK).json({
            message: 'Categoría eliminada',
        });
    }
}
