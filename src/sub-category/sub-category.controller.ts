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
    Param,
    Delete,
} from '@nestjs/common';
import { Response } from 'express';
import { SubCategoryDTO } from './sub-category.dto';

@Controller('subcategories')
export class SubCategoryController {
    constructor(private subCategoryService: SubCategoryService) {}

    @Get('/')
    async getSubCategories(@Res() res: Response) {
        const subcategories = await this.subCategoryService.getSubcategories();
        res.status(HttpStatus.OK).json(subcategories);
    }

    @Get('/single')
    async getSubCategory(@Res() res: Response, @Query('id') id: number) {
        const subcategory = await this.subCategoryService.getSubcategory(id);
        res.status(HttpStatus.OK).json(subcategory);
    }

    @Get('/single/category')
    async getCategory(@Res() res: Response, @Query('subcategoryId') subcategoryId: number) {
        const category = await this.subCategoryService.searchCategory(subcategoryId);
        res.status(HttpStatus.OK).json(category);
    }

    @Post('/')
    async createSubCategory(@Res() res: Response, @Body() subcategoryDTO: SubCategoryDTO) {
        const subcategory = await this.subCategoryService.createSubcategory(subcategoryDTO);
        res.status(HttpStatus.OK).json({
            message: 'SubCategoría creada',
        });
    }

    @Put('/update-subcategory')
    async updateSubCategory(@Res() res: Response, @Body() subcategoryDTO: SubCategoryDTO, @Param('id') id: number) {
        const subcategory = await this.subCategoryService.updateSubCategory(id, subcategoryDTO);
        return res.status(HttpStatus.OK).json({
            message: 'SubCategoría actualizada',
        });
    }

    @Delete('/delete-subcategory')
    async deleteSubCategory(@Res() res: Response, @Query('id') id: number) {
        const subcategory = await this.subCategoryService.deleteSubCategory(id);
        return res.status(HttpStatus.OK).json({
            message: 'Categoría actualizada',
        });
    }
}
