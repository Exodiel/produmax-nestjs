import { extname, resolve } from 'path';
import { unlink } from 'fs-extra';
import { v4 as uuid } from 'uuid';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

export const imageFileFilter = async (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        // Allow storage of file
        cb(null, true);
    } else {
        // Reject file
        await unlink(resolve(file.path));
        cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
    }
};

export const editFileName = (req, file, cb) => {
    // Calling the callback passing the random name generated with the original extension name
    cb(null, `${uuid()}${extname(file.originalname)}`);
};

export const deletePhoto = async (path: string) => {
    const existPath = resolve(path);
    if (!existPath) {
        throw new NotFoundException('No se encontró la imagen');
    }
    await unlink(existPath);
};
