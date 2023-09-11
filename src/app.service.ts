import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk'

@Injectable()
export class AppService {
  private AWS_S3_BUCKET: string = process.env.AWS_S3_BUCKET;
  private s3: S3 = new S3({
    accessKeyId: process.env.AWS_S3_ACCESSKEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESSKEY,
  });

  async uploadFile(file: Express.Multer.File) {
    return await this.s3Upload(
      file,
      this.AWS_S3_BUCKET,
    );
  }

  async s3Upload(file: Express.Multer.File, bucket: string) {
    const params: S3.PutObjectRequest = {
      Bucket: bucket,
      Key: file.originalname,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: file.mimetype,
      ContentDisposition: 'inline',
      // CreateBucketConfiguration: {
      //   LocationConstraint: 'ap-south-1',
      // },
    }

    try {
      const s3Response = await this.s3.upload(params).promise();
      return s3Response;
    } catch (e) {
      console.log(e);
    }
  }
  getHello(): string {
    return 'Hello World!';
  }
}
