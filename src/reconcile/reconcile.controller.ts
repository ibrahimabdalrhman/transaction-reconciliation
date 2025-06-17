import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReconcileService } from './reconcile.service';
import { CreateReconcileDto } from './dto/create-reconcile.dto';
import { UpdateReconcileDto } from './dto/update-reconcile.dto';

@Controller('reconcile')
export class ReconcileController {
  constructor(private readonly reconcileService: ReconcileService) {}

  @Post()
  create(@Body() createReconcileDto: CreateReconcileDto) {
    return this.reconcileService.create(createReconcileDto);
  }

  @Get()
  findAll() {
    return this.reconcileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reconcileService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReconcileDto: UpdateReconcileDto) {
    return this.reconcileService.update(+id, updateReconcileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reconcileService.remove(+id);
  }
}
