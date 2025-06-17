import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReconcileModule } from './reconcile/reconcile.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      ignoreEnvFile: false,
      validationSchema: null,
    }),
    ReconcileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
