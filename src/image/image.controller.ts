import { Controller, Post, UseInterceptors, UploadedFile, Res, HttpStatus, Body, Req, Delete, Query, Put } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { imageFileFilter, editFileName } from '../utils/file-uploading';
import { diskStorage } from 'multer';
import { ImageService } from './image.service';
import { ImageDTO } from './image.dto';

@Controller('image')
export class ImageController {
    constructor(private imageService: ImageService) {}

    @Post('/upload')
    @UseInterceptors(FileInterceptor('image', {
        limits: {
            fileSize: 1 * 1000 * 1000,
        },
        fileFilter: imageFileFilter,
        storage: diskStorage({
            destination: './uploads',
            filename: editFileName,
        }),
    }))
    async uploadPhoto( @UploadedFile() file, @Res() res: Response, @Body() data) {
        const response: ImageDTO =  {
            typeEntity   : data.typeEntity,
            filepath     : file.path,
        };
        const image = await this.imageService.createImage(response);

        return res.status(HttpStatus.CREATED).json(image);
    }

    @Delete('/delete')
    async deleteImage(@Res() res: Response, @Query('id') id: number) {
        const image = await this.imageService.deleteImage(id);

        return res.status(HttpStatus.OK).json({ message: 'Imagen eliminada' });
    }
}
