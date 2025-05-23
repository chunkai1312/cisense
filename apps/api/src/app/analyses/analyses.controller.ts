import * as path from 'path';
import { Controller, Post, UploadedFile, UseInterceptors, HttpException, HttpStatus, Get, Param, Delete, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { AnalysesService } from './analyses.service';

@Controller('analyses')
export class AnalysesController {
  constructor(private readonly analysesService: AnalysesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: path.join(__dirname, '..', 'uploads', 'img'),
      filename: (_, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`),
    }),
    fileFilter: (_, file, cb) => {
      const allowedMime = ['image/png', 'image/jpeg', 'image/svg+xml'];
      if (!allowedMime.includes(file.mimetype)) cb(new Error('Unsupported file type'), false);
      else cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  }))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }
    return this.analysesService.analyzeImage(file.path, process.env.CIS_NAME);
  }

  @Get()
  async findAll(@Req() request: Request) {
    const analyses = await this.analysesService.findAll();
    const data = analyses.map(analysis => ({
      ...analysis,
      imagePath: `${request.protocol}://${request.get('host')}/uploads/img/${path.basename(analysis.imagePath)}`,
    }));
    return data;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.analysesService.remove(id);
  }
}
