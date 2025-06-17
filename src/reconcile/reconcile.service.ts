import { Injectable } from '@nestjs/common';
import { CreateReconcileDto } from './dto/create-reconcile.dto';
import { UpdateReconcileDto } from './dto/update-reconcile.dto';

@Injectable()
export class ReconcileService {
  create(createReconcileDto: CreateReconcileDto) {
    return 'This action adds a new reconcile';
  }

  findAll() {
    return `This action returns all reconcile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reconcile`;
  }

  update(id: number, updateReconcileDto: UpdateReconcileDto) {
    return `This action updates a #${id} reconcile`;
  }

  remove(id: number) {
    return `This action removes a #${id} reconcile`;
  }
}
