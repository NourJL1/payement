export class VatRate {
  vatCode: number;
  vatLabe: string;
  vatRate: number;

  constructor(data: Partial<VatRate> = {}) {
    this.vatCode = data.vatCode || 0;
    this.vatLabe = data.vatLabe || '';
    this.vatRate = data.vatRate || 0;
  }
}