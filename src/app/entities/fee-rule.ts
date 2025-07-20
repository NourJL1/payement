import { FeeRuleType } from './fee-rule-type';
import { FeeSchema } from './fee-schema';
import { VatRate } from './vat-rate';

export class FeeRule {
  fruCode?: number;
  fruIden: string;
  fruLabe: string;
  fruPrimaryWalletId: string;
  fruPrimaryAmount: number;
  fruPrimaryFeesId: number;
  fruFeesWalletId: string;
  fruFeesAmount: number;
  fruTva: VatRate;
  fruTvaWalletId: string;
  fruTvaAmount: number;
  fruSens: string;
  feeRuleType: FeeRuleType;
  feeSchema: FeeSchema;

  constructor(data: Partial<FeeRule> = {}) {
    this.fruCode = data.fruCode;
    this.fruIden = data.fruIden || '';
    this.fruLabe = data.fruLabe || '';
    this.fruPrimaryWalletId = data.fruPrimaryWalletId || '';
    this.fruPrimaryAmount = data.fruPrimaryAmount || 0;
    this.fruPrimaryFeesId = data.fruPrimaryFeesId || 0;
    this.fruFeesWalletId = data.fruFeesWalletId || '';
    this.fruFeesAmount = data.fruFeesAmount || 0;
    this.fruTva = data.fruTva || new VatRate();
    this.fruTvaWalletId = data.fruTvaWalletId || '';
    this.fruTvaAmount = data.fruTvaAmount || 0;
    this.fruSens = data.fruSens || '';
    this.feeRuleType = data.feeRuleType || new FeeRuleType();
    this.feeSchema = data.feeSchema || new FeeSchema();
  }
}