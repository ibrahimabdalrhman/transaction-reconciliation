import { Module } from '@nestjs/common';
import { ReconcileService } from './reconcile.service';
import { ReconcileController } from './reconcile.controller';

@Module({
  controllers: [ReconcileController],
  providers: [ReconcileService],
})
export class ReconcileModule {}
