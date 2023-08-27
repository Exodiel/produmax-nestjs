import { SubCategoryService } from './sub-category.service';
import {
    Controller,
    Get,
    Res,
    HttpStatus,
    Query,
    Post,
    Body,
    Put,
    Delete,
} from '@nestjs/common';
import { Response } from 'express';
import { Roles, Unprotected } from 'nest-keycloak-connect';
import { SubCategoryDTO } from './sub-category.dto';

@Controller('subcategories')
export class SubCategoryController {
    constructor(private subCategoryService: SubCategoryService) { }

    @Get('/')
    @Unprotected()
    async getSubCategories(@Res() res: Response) {
        const subcategories = await this.subCategoryService.getSubcategories();
        res.status(HttpStatus.OK).json(subcategories);
    }

    @Get('/relationated')
    @Unprotected()
    async getSubCategoriesRelationated(@Res() res: Response, @Query('categoryId') categoryId: string) {
        const subcategories = await this.subCategoryService.getSubCategoriesRelationated(categoryId);
        res.status(HttpStatus.OK).json(subcategories);
    }

    @Get('/single')
    @Unprotected()
    async getSubCategory(@Res() res: Response, @Query('id') id: string) {
        const subcategory = await this.subCategoryService.getSubcategory(id);
        res.status(HttpStatus.OK).json(subcategory);
    }

    @Get('/single/category')
    @Unprotected()
    async getCategory(@Res() res: Response, @Query('subcategoryId') subcategoryId: string) {
        const category = await this.subCategoryService.searchCategory(subcategoryId);
        res.status(HttpStatus.OK).json(category);
    }

    @Post('/')
    @Roles({
        roles: ['app-admin']
    })
    async createSubCategory(@Res() res: Response, @Body() subcategoryDTO: SubCategoryDTO) {
        const subcategory = await this.subCategoryService.createSubcategory(subcategoryDTO);
        res.status(HttpStatus.CREATED).json({
            message: 'SubCategoría creada',
        });
    }

    @Put('/update-subcategory')
    @Roles({
        roles: ['app-admin']
    })
    async updateSubCategory(@Res() res: Response, @Body() subcategoryDTO: SubCategoryDTO, @Query('id') id: string) {
        const subcategory = await this.subCategoryService.updateSubCategory(id, subcategoryDTO);
        return res.status(HttpStatus.OK).json({
            message: 'SubCategoría actualizada',
        });
    }

    @Delete('/delete-subcategory')
    @Roles({
        roles: ['app-admin']
    })
    async deleteSubCategory(@Res() res: Response, @Query('id') id: string) {
        const subcategory = await this.subCategoryService.deleteSubCategory(id);
        return res.status(HttpStatus.OK).json({
            message: 'Categoría actualizada',
        });
    }
}
