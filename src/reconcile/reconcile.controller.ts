import {
  BadRequestException,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ReconcileService } from './reconcile.service';
import { diskStorage } from 'multer';
import * as path from 'path';

@Controller('reconcile')
export class ReconcileController {
  constructor(private readonly reconcileService: ReconcileService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'source', maxCount: 1 },
        { name: 'system', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const name = `${file.fieldname}-${Date.now()}${ext}`;
            cb(null, name);
          },
        }),

        fileFilter: (req, file, cb) => {
          if (path.extname(file.originalname).toLowerCase() !== '.csv') {
            return cb(
              new BadRequestException(
                `Invalid file type for ${file.fieldname}. Only CSV files are allowed.`,
              ),
              false,
            );
          }
          cb(null, true);
        },
      },
    ),
  )
  async uploadAndReconcile(
    @UploadedFiles()
    files: {
      source?: Express.Multer.File[];
      system?: Express.Multer.File[];
    },
  ) {
    if (!files.source?.[0]?.path || !files.system?.[0]?.path) {
      throw new BadRequestException('Both source and system CSV files are required.');
    }

    const sourcePath = files.source[0].path;
    const systemPath = files.system[0].path;

    return this.reconcileService.reconcileTranscation(sourcePath, systemPath);
  }
}
