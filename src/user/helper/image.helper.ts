import { BadRequestException } from '@nestjs/common';

export const renameImage = (req: any, file: any, callback: any) => {
  const name = file.originalname.split('.')[0];
  const fileName = file.originalname;
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');

  callback(null, `${name}-${randomName}-${fileName}`);
};

export const fileFilter = (req: any, file: any, callback: any) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    callback(new BadRequestException('El tipo de imagen no es válido'), false);
  } else {
    callback(null, true);
  }
};
