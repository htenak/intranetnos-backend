import { IsString } from 'class-validator';

export class UploadMyPhotoDto {
  @IsString({ message: 'El nombre de la foto debe ser texto' })
  filename: string;
}
