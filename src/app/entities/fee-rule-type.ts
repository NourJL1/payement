export class FeeRuleType {

    frtCode?: number;
  frtIden!: string;
  frtLabe!: string;

  constructor(init?: Partial<FeeRuleType>) {
    Object.assign(this, init);
  }
}
