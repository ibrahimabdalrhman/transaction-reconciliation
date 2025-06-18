import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import { SourceMap } from 'module';

@Injectable()
export class ReconcileService {


  private async readCSV<T>(filePath: string): Promise<T[]> {
    const results: T[] = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          data.amount = parseFloat(data.amount);
          data.status = data.status.toLowerCase();
          results.push(data);
        })
        .on('end', () => resolve(results))
        .on('error', reject);
    });
  }

  async reconcileTranscation(sourcePath: string, systemPath: string) {

    const source = await this.readCSV<any>(sourcePath);
    const system = await this.readCSV<any>(systemPath);

    const sourceMap = new Map<string, any>(source.map((tx) => [tx.providerTransactionId, tx]));
    const systemMap = new Map<string, any>(system.map((tx) => [tx.transactionId, tx]));

    const missingInInternal: any[] = [];
    const missingInSource: any[] = [];
    const mismatched: {
      transactionId: string;
      discrepancies: {
        amount?: { source: number; system: number };
        status?: { source: string; system: string };
      };
    }[] = [];

    for (const [id, sourceTx] of sourceMap) {
      const systemTx = systemMap.get(id);
      if (!systemTx) {
        missingInInternal.push(sourceTx);
      } else {
        const discrepancies: any = {};
        if (sourceTx.amount !== systemTx.amount) {
          discrepancies['amount'] = {
            source: sourceTx.amount,
            system: systemTx.amount,
          };
        }
        if (sourceTx.status !== systemTx.status) {
          discrepancies['status'] = {
            source: sourceTx.status,
            system: systemTx.status,
          };
        }
        if (Object.keys(discrepancies).length > 0) {
          mismatched.push({ transactionId: id, discrepancies });
        }
      }
    }

    for (const [id, systemTx] of systemMap) {
      if (!sourceMap.has(id)) {
        missingInSource.push(systemTx);
      }
    }

    return {
      missing_in_internal: missingInInternal,
      missing_in_source: missingInSource,
      mismatched_transactions: mismatched,
    };
  }

}
