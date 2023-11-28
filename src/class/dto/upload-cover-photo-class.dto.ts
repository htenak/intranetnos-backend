import { IsString } from 'class-validator';

export class UploadCoverPhotoClass {
  @IsString({ message: 'El nombre de la foto debe ser texto' })
  filename: string;
}
