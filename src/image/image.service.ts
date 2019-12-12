import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './image.entity';
import { Repository } from 'typeorm';
import { ImageDTO } from './image.dto';
import { deletePhoto } from '../utils/file-uploading';

@Injectable()
export class ImageService {
    constructor(@InjectRepository(Image) private readonly imageRepository: Repository<Image>) {}

    async createImage(imageDTO: ImageDTO): Promise<Image> {
        const image = this.imageRepository.create(imageDTO);
        await this.imageRepository.save(image);
        return image;
    }

    async deleteImage(imageId: number) {
        const image = await this.imageRepository.findOne(imageId);
        if (!image) {
            throw new NotFoundException('No se encontró la imagen');
        }
        await deletePhoto(image.filepath);
        await this.imageRepository.remove(image);

        return image;
    }
}
