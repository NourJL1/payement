import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Fees } from '../../../entities/fees';
import { FeesService } from '../../../services/fees.service';
import { FeeSchemaService } from '../../../services/fee-schema.service';
import { FeeSchema } from '../../../entities/fee-schema';
import { FeeRuleTypeService } from '../../../services/fee-rule-type.service';
import { FeeRuleType } from '../../../entities/fee-rule-type';
import { FeeRuleService } from '../../../services/fee-rule.service';
import { FeeRule } from '../../../entities/fee-rule';
import { HttpHeaders } from '@angular/common/http';
import { OperationTypeService } from '../../../services/operation-type.service';
import { OperationType } from '../../../entities/operation-type';
import { PeriodicityService } from '../../../services/periodicity.service';
import { Periodicity } from '../../../entities/periodicity';
import { VatRateService } from '../../../services/vat-rate.service';
import { VatRate } from '../../../entities/vat-rate';
import { WalletService } from '../../../services/wallet.service';
import { Wallet } from '../../../entities/wallet';
import { WalletOperationTypeMap } from '../../../entities/wallet-operation-type-map';
import { WalletCategoryOperationTypeMap } from '../../../entities/wallet-category-operation-type-map';
import { WalletCategoryOperationTypeMapService } from '../../../services/wallet-category-operation-type-map.service';
import { WalletOperationTypeMapService } from '../../../services/wallet-operation-type-map.service';
import { WalletCategory } from '../../../entities/wallet-category';
import { WalletCategoryService } from '../../../services/wallet-category.service';

@Component({
  selector: 'app-accounting',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './accounting.component.html',
  styleUrls: ['./accounting.component.css']
})
export class AccountingComponent implements OnInit {
  feesList: Fees[] = [];
  searchFeesTerm: string = '';
filteredFeesList: Fees[] = [];
  newFee: Fees = new Fees();
  selectedFee: Fees | null = null;

  feeSchemasList: FeeSchema[] = [];
  searchFeeSchemaTerm: string = '';
filteredFeeSchemasList: FeeSchema[] = [];
  newFeeSchema: FeeSchema = new FeeSchema();
  selectedFeeSchema: FeeSchema | null = null;

  feeRuleTypesList: FeeRuleType[] = [];
  newFeeRuleType: FeeRuleType = new FeeRuleType();
  selectedFeeRuleType: FeeRuleType | null = null;

  feeRulesList: FeeRule[] = [];
  newFeeRule: FeeRule = new FeeRule();
  selectedFeeRule: FeeRule | null = null;

  operationTypesList: OperationType[] = [];
  newOperationType: OperationType = new OperationType({ feeSchema: new FeeSchema() });
  selectedOperationType: OperationType | null = null;

  periodicitiesList: Periodicity[] = [];
  newPeriodicity: Periodicity = new Periodicity();
  selectedPeriodicity: Periodicity | null = null;

  vatRatesList: VatRate[] = [];

  walletsList: Wallet[] = [];

  walletCategories: WalletCategory[] = []

  
  wotmList: WalletOperationTypeMap[] = []
  newWotm: WalletOperationTypeMap = new WalletOperationTypeMap()
  selectedWotm?: WalletOperationTypeMap | null = null

  wcotmList: WalletCategoryOperationTypeMap[] = []
  // In your component class
  // Add this to your component class
searchWcotmTerm: string = '';
filteredWcotmList: WalletCategoryOperationTypeMap[] = [];
  newWcotm: WalletCategoryOperationTypeMap = new WalletCategoryOperationTypeMap()
  selectedWcotm?: WalletCategoryOperationTypeMap | null = null


  successMessage: string | null = null;
  errorMessage: string | null = null;

  isFeeVisible: boolean = false;
  isFeeSchemaVisible: boolean = false;
  isFeeRuleVisible: boolean = false;
  isFeeRuleTypeVisible: boolean = false;
  isOperationTypeVisible: boolean = false;
  isWotmVisible: boolean = false;
  isWcotmVisible: boolean = false;
  isPeriodicityVisible: boolean = false;

  constructor(
    private feesService: FeesService,
    private feeSchemaService: FeeSchemaService,
    private feeRuleTypeService: FeeRuleTypeService,
    private feeRuleService: FeeRuleService,
    private operationTypeService: OperationTypeService,
    private wotmService: WalletOperationTypeMapService,
    private wcotmService: WalletCategoryOperationTypeMapService,
    private periodicityService: PeriodicityService,
    private vatRateService: VatRateService,
    private walletService: WalletService,
    private walletCategoryService: WalletCategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // console.log('ngOnInit: Initializing component...');
    this.loadFees();
    this.loadFeeSchemas();
    this.loadFeeRuleTypes();
    this.loadFeeRules();
    this.loadOperationTypes();
    this.loadWalletOperationTypeMap()
    this.loadWalletCategoryOperationTypeMap()
    this.loadPeriodicities();
    this.loadVatRates();
    this.loadWallets();
    this.loadWalletCategories();
  }

  private getHttpOptions(): { headers: HttpHeaders } {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('role') || 'CUSTOMER';
    const rolesHeader = `ROLE_${role.toUpperCase()}`;

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Roles': rolesHeader
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return { headers }; // Correctly return object with headers property
  }

  searchFees(): void {
  console.log('Search term:', this.searchFeesTerm);
  if (!this.searchFeesTerm || this.searchFeesTerm.trim() === '') {
    this.filteredFeesList = [...this.feesList]; // Show all when search is empty
    this.cdr.detectChanges();
  } else {
    this.feesService.search(this.searchFeesTerm).subscribe({
      next: (searchResults: Fees[]) => {
        console.log('Search results:', searchResults);
        this.filteredFeesList = searchResults;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Search error:', error);
        const message = error.status
          ? `Failed to search fees: ${error.status} ${error.statusText}`
          : 'Failed to search fees: Server error';
        this.showErrorMessage(message);
      }
    });
  }
}
searchFeeSchemas(): void {
  console.log('Search term:', this.searchFeeSchemaTerm);
  if (!this.searchFeeSchemaTerm || this.searchFeeSchemaTerm.trim() === '') {
    this.filteredFeeSchemasList = [...this.feeSchemasList]; // Show all when search is empty
    this.cdr.detectChanges();
  } else {
    this.feeSchemaService.search(this.searchFeeSchemaTerm, this.getHttpOptions()).subscribe({
      next: (searchResults: FeeSchema[]) => {
        console.log('Search results:', searchResults);
        this.filteredFeeSchemasList = searchResults;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Search error:', error);
        const message = error.status
          ? `Failed to search fee schemas: ${error.status} ${error.statusText}`
          : 'Failed to search fee schemas: Server error';
        this.showErrorMessage(message);
      }
    });
  }
}

  loadFees(): void {
  this.searchFeesTerm = ''; // Reset search term
  this.errorMessage = null;
  this.feesService.getAll().subscribe({
    next: (data: Fees[]) => {
      this.feesList = data;
      this.filteredFeesList = [...data]; // Initialize filtered list
      this.cdr.detectChanges();
    },
    error: (err: any) => {
      console.error('loadFees: Error:', err.status, err.message);
      this.showErrorMessage('Failed to load fees.');
    }
  });
}

  loadFeeSchemas(): void {
  this.searchFeeSchemaTerm = ''; // Reset search term
  this.errorMessage = null;
  this.feeSchemaService.getAll().subscribe({
    next: (data: FeeSchema[]) => {
      this.feeSchemasList = data || [];
      this.filteredFeeSchemasList = [...this.feeSchemasList]; // Initialize filtered list
      this.cdr.detectChanges();
    },
    error: (err: any) => {
      console.error('loadFeeSchemas: Error:', err.status, err.message);
      this.feeSchemasList = [];
      this.filteredFeeSchemasList = [];
      this.showErrorMessage('Failed to load fee schemas.');
    }
  });
}

  loadFeeRuleTypes(): void {
    // console.log('loadFeeRuleTypes: Fetching fee rule types...');
    this.feeRuleTypeService.getAll().subscribe({
      next: (data: FeeRuleType[]) => {
        // console.log('loadFeeRuleTypes: Fee rule types received:', data);
        this.feeRuleTypesList = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('loadFeeRuleTypes: Error:', err.status, err.message);
        this.showErrorMessage('Failed to load fee rule types.');
      }
    });
  }

  loadFeeRules(): void {
    // console.log('loadFeeRules: Fetching fee rules...');
    this.feeRuleService.getAll().subscribe({
      next: (data: FeeRule[]) => {
        // console.log('loadFeeRules: Fee rules received:', data);
        this.feeRulesList = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('loadFeeRules: Error:', err.status, err.message);
        this.showErrorMessage('Failed to load fee rules.');
      }
    });
  }

  loadOperationTypes(): void {
    // console.log('loadOperationTypes: Fetching operation types...');
    this.operationTypeService.getAll().subscribe({
      next: (data: OperationType[]) => {
        // console.log('loadOperationTypes: Operation types received:', data);
        this.operationTypesList = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('loadOperationTypes: Error:', err.status, err.message);
        this.showErrorMessage('Failed to load operation types.');
      }
    });
  }

  loadWalletOperationTypeMap(): void {
    // console.log('loadWalletOperationTypeMap: Fetching ...');
    this.wotmService.getAll(this.getHttpOptions()).subscribe({
      next: (data: WalletOperationTypeMap[]) => {
        // console.log('loadOperationTypes: wallet operation type map received:', data);
        this.wotmList = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('loadWalletOperationTypeMap: Error:', err.status, err.message);
        this.showErrorMessage('Failed to load wallet operation type map.');
      }
    });
  }

  loadWalletCategoryOperationTypeMap(): void {
    // console.log('loadWalletCategoryOperationTypeMap: Fetching ...');
    this.wcotmService.getAll(this.getHttpOptions()).subscribe({
      next: (data: WalletCategoryOperationTypeMap[]) => {
        console.log('loadWalletOperationTypeMap: Wallet xategory operation type map received:', data);
        this.wcotmList = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('loadWalletOperationTypeMap: Error:', err.status, err.message);
        this.showErrorMessage('Failed to load wallet operation type map.');
      }
    });
  }

  loadPeriodicities(): void {
    // console.log('loadPeriodicities: Fetching periodicities...');
    this.periodicityService.getAll().subscribe({
      next: (data: Periodicity[]) => {
        // console.log('loadPeriodicities: Periodicities received:', data);
        this.periodicitiesList = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('loadPeriodicities: Error:', err.status, err.message);
        this.showErrorMessage('Failed to load periodicities.');
      }
    });
  }

  loadVatRates(): void {
    // console.log('loadVatRates: Fetching VAT rates...');
    this.vatRateService.getAll().subscribe({
      next: (data: VatRate[]) => {
        // console.log('loadVatRates: VAT rates received:', data);
        this.vatRatesList = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('loadVatRates: Error:', err.status, err.message);
        this.showErrorMessage('Failed to load VAT rates.');
      }
    });
  }

  loadWallets(): void {
    // console.log('loadWallets: Fetching wallets...');
    this.walletService.getAll().subscribe({
      next: (data: Wallet[]) => {
        // console.log('loadWallets: Wallets received:', data);
        this.walletsList = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('loadWallets: Error:', err.status, err.message);
        this.showErrorMessage('Failed to load wallets.');
      }
    });
  }

  loadWalletCategories(){
    this.walletCategoryService.getAll().subscribe({
      next: (categories: WalletCategory[]) => {
        // console.log('loadWalletCategories: Wallet categories received:', data);
        this.walletCategories = categories;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('loadWalletCategories: Error:', err.status, err.message);
        this.showErrorMessage('Failed to load wallet categories.');
      }
    })
  }

  addFee(): void {
    // console.log('addFee: Adding fee:', this.newFee);
    this.feesService.create(this.newFee, this.getHttpOptions()).subscribe({
      next: (createdFee: Fees) => {
        // console.log('addFee: Fee added:', createdFee);
        this.feesList.push(createdFee);
        this.newFee = new Fees();
        this.isFeeVisible = false;
        this.  showSuccessMessage('Fee added successfully');
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('addFee: Error:', err);
        this.showErrorMessage('Failed to add fee: ' + (err.error?.message || 'Please check the form.'));
      }
    });
  }

  editFee(fee: Fees): void {
    // console.log('editFee: Fee object:', fee);
    this.selectedFee = fee;
    this.newFee = { ...fee };
    this.isFeeVisible = true;
    this.cdr.detectChanges();
  }

  updateFee(): void {
    // console.log('updateFee: Updating fee:', this.newFee);
    if (this.selectedFee?.feeCode) {
      this.feesService.update(this.selectedFee.feeCode, this.newFee, this.getHttpOptions()).subscribe({
        next: (updatedFee: Fees) => {
          // console.log('updateFee: Fee updated:', updatedFee);
          const index = this.feesList.findIndex(f => f.feeCode === updatedFee.feeCode);
          if (index !== -1) {
            this.feesList[index] = updatedFee;
            this.feesList = [...this.feesList];
          }
          this.newFee = new Fees();
          this.selectedFee = null;
          this.isFeeVisible = false;
          this.  showSuccessMessage('Fee updated successfully');
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('updateFee: Error:', err);
          this.showErrorMessage('Failed to update fee: ' + (err.error?.message || 'Please try again.'));
        }
      });
    } else {
      this.showErrorMessage('No fee selected for update.');
    }
  }

  deleteFee(feeCode: number | undefined): void {
    // console.log('deleteFee: feeCode:', feeCode);
    if (feeCode && confirm('Are you sure you want to delete this fee?')) {
      this.feesService.delete(feeCode, this.getHttpOptions()).subscribe({
        next: () => {
          // console.log('deleteFee: Success, feeCode:', feeCode);
          this.feesList = this.feesList.filter(f => f.feeCode !== feeCode);
          this.  showSuccessMessage('Fee deleted successfully');
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('deleteFee: Error:', err);
          this.showErrorMessage('Failed to delete fee: ' + (err.error?.message || 'Please try again.'));
        }
      });
    }
  }

  addFeeSchema(): void {
    // console.log('addFeeSchema: Adding fee schema:', this.newFeeSchema);
    this.feeSchemaService.create(this.newFeeSchema, this.getHttpOptions()).subscribe({
      next: (createdFeeSchema: FeeSchema) => {
        // console.log('addFeeSchema: Fee schema added:', createdFeeSchema);
        this.feeSchemasList.push(createdFeeSchema);
        this.newFeeSchema = new FeeSchema();
        this.isFeeSchemaVisible = false;
        this.  showSuccessMessage('Fee schema added successfully');
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('addFeeSchema: Error:', err);
        this.showErrorMessage('Failed to add fee schema: ' + (err.error?.message || 'Please check the form.'));
      }
    });
  }

  editFeeSchema(schema: FeeSchema): void {
    // console.log('editFeeSchema: Fee schema object:', schema);
    this.selectedFeeSchema = schema;
    this.newFeeSchema = { ...schema };
    this.isFeeSchemaVisible = true;
    this.cdr.detectChanges();
  }

  updateFeeSchema(): void {
    // console.log('updateFeeSchema: Updating fee schema:', this.newFeeSchema);
    if (this.selectedFeeSchema?.fscCode) {
      this.feeSchemaService.update(this.selectedFeeSchema.fscCode, this.newFeeSchema, this.getHttpOptions()).subscribe({
        next: (updatedFeeSchema: FeeSchema) => {
          // console.log('updateFeeSchema: Fee schema updated:', updatedFeeSchema);
          const index = this.feeSchemasList.findIndex(f => f.fscCode === updatedFeeSchema.fscCode);
          if (index !== -1) {
            this.feeSchemasList[index] = updatedFeeSchema;
            this.feeSchemasList = [...this.feeSchemasList];
          }
          this.newFeeSchema = new FeeSchema();
          this.selectedFeeSchema = null;
          this.isFeeSchemaVisible = false;
          this.  showSuccessMessage('Fee schema updated successfully');
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('updateFeeSchema: Error:', err);
          this.showErrorMessage('Failed to update fee schema: ' + (err.error?.message || 'Please try again.'));
        }
      });
    } else {
      this.showErrorMessage('No fee schema selected for update.');
    }
  }

  deleteFeeSchema(fscCode: number | undefined): void {
    // console.log('deleteFeeSchema: fscCode:', fscCode);
    if (fscCode && confirm('Are you sure you want to delete this fee schema?')) {
      this.feeSchemaService.delete(fscCode, this.getHttpOptions()).subscribe({
        next: () => {
          // console.log('deleteFeeSchema: Success, fscCode:', fscCode);
          this.feeSchemasList = this.feeSchemasList.filter(f => f.fscCode !== fscCode);
          this.  showSuccessMessage('Fee schema deleted successfully');
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('deleteFeeSchema: Error:', err);
          this.showErrorMessage('Failed to delete fee schema: ' + (err.error?.message || 'Please try again.'));
        }
      });
    }
  }

  addFeeRuleType(): void {
    // console.log('addFeeRuleType: Adding fee rule type:', this.newFeeRuleType);
    this.feeRuleTypeService.create(this.newFeeRuleType, this.getHttpOptions()).subscribe({
      next: (createdFeeRuleType: FeeRuleType) => {
        // console.log('addFeeRuleType: Fee rule type added:', createdFeeRuleType);
        this.feeRuleTypesList.push(createdFeeRuleType);
        this.newFeeRuleType = new FeeRuleType();
        this.isFeeRuleTypeVisible = false;
        this.  showSuccessMessage('Fee rule type added successfully');
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('addFeeRuleType: Error:', err);
        this.showErrorMessage('Failed to add fee rule type: ' + (err.error?.message || 'Please check the form.'));
      }
    });
  }

  editFeeRuleType(type: FeeRuleType): void {
    // console.log('editFeeRuleType: Fee rule type object:', type);
    this.selectedFeeRuleType = type;
    this.newFeeRuleType = { ...type };
    this.isFeeRuleTypeVisible = true;
    this.cdr.detectChanges();
  }

  updateFeeRuleType(): void {
    // console.log('updateFeeRuleType: Updating fee rule type:', this.newFeeRuleType);
    if (this.selectedFeeRuleType?.frtCode) {
      this.feeRuleTypeService.update(this.selectedFeeRuleType.frtCode, this.newFeeRuleType, this.getHttpOptions()).subscribe({
        next: (updatedFeeRuleType: FeeRuleType) => {
          // console.log('updateFeeRuleType: Fee rule type updated:', updatedFeeRuleType);
          const index = this.feeRuleTypesList.findIndex(t => t.frtCode === updatedFeeRuleType.frtCode);
          if (index !== -1) {
            this.feeRuleTypesList[index] = updatedFeeRuleType;
            this.feeRuleTypesList = [...this.feeRuleTypesList];
          }
          this.newFeeRuleType = new FeeRuleType();
          this.selectedFeeRuleType = null;
          this.isFeeRuleTypeVisible = false;
          this.  showSuccessMessage('Fee rule type updated successfully');
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('updateFeeRuleType: Error:', err);
          this.showErrorMessage('Failed to update fee rule type: ' + (err.error?.message || 'Please try again.'));
        }
      });
    } else {
      this.showErrorMessage('No fee rule type selected for update.');
    }
  }

  deleteFeeRuleType(frtCode: number | undefined): void {
    // console.log('deleteFeeRuleType: frtCode:', frtCode);
    if (frtCode && confirm('Are you sure you want to delete this fee rule type?')) {
      this.feeRuleTypeService.delete(frtCode, this.getHttpOptions()).subscribe({
        next: () => {
          // console.log('deleteFeeRuleType: Success, frtCode:', frtCode);
          this.feeRuleTypesList = this.feeRuleTypesList.filter(t => t.frtCode !== frtCode);
          this.  showSuccessMessage('Fee rule type deleted successfully');
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('deleteFeeRuleType: Error:', err);
          this.showErrorMessage('Failed to delete fee rule type: ' + (err.error?.message || 'Please try again.'));
        }
      });
    }
  }

  addFeeRule(): void {
    // console.log('addFeeRule: Adding fee rule:', this.newFeeRule);
    if (/* !this.newFeeRule.fruIden ||  */!this.newFeeRule.fruLabe || !this.newFeeRule.feeRuleType?.frtCode || !this.newFeeRule.feeSchema?.fscCode || !this.newFeeRule.fruTva?.vatCode) {
      this.showErrorMessage('Please fill in all required fields.');
      return;
    }
    this.feeRuleService.create(this.newFeeRule, this.getHttpOptions()).subscribe({
      next: (createdFeeRule: FeeRule) => {
        // console.log('addFeeRule: Fee rule added:', createdFeeRule);
        this.feeRulesList.push(createdFeeRule);
        this.newFeeRule = new FeeRule();
        this.isFeeRuleVisible = false;
        this.  showSuccessMessage('Fee rule added successfully');
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('addFeeRule: Error:', err);
        this.showErrorMessage('Failed to add fee rule: ' + (err.error?.message || 'Please check the form.'));
      }
    });
  }

  editFeeRule(rule: FeeRule): void {
    // console.log('editFeeRule: Fee rule object:', rule);
    this.selectedFeeRule = rule;
    this.newFeeRule = { ...rule, feeRuleType: { ...rule.feeRuleType }, feeSchema: { ...rule.feeSchema }, fruTva: { ...rule.fruTva } };
    this.isFeeRuleVisible = true;
    this.cdr.detectChanges();
  }

  updateFeeRule(): void {
    // console.log('updateFeeRule: Updating fee rule:', this.newFeeRule);
    if (/* !this.newFeeRule.fruIden ||  */!this.newFeeRule.fruLabe || !this.newFeeRule.feeRuleType?.frtCode || !this.newFeeRule.feeSchema?.fscCode || !this.newFeeRule.fruTva?.vatCode) {
      this.showErrorMessage('Please fill in all required fields.');
      return;
    }
    if (this.selectedFeeRule?.fruCode) {
      this.feeRuleService.update(this.selectedFeeRule.fruCode, this.newFeeRule, this.getHttpOptions()).subscribe({
        next: (updatedFeeRule: FeeRule) => {
          // console.log('updateFeeRule: Fee rule updated:', updatedFeeRule);
          const index = this.feeRulesList.findIndex(r => r.fruCode === updatedFeeRule.fruCode);
          if (index !== -1) {
            this.feeRulesList[index] = updatedFeeRule;
            this.feeRulesList = [...this.feeRulesList];
          }
          this.newFeeRule = new FeeRule();
          this.selectedFeeRule = null;
          this.isFeeRuleVisible = false;
          this.  showSuccessMessage('Fee rule updated successfully');
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('updateFeeRule: Error:', err);
          this.showErrorMessage('Failed to update fee rule: ' + (err.error?.message || 'Please try again.'));
        }
      });
    } else {
      this.showErrorMessage('No fee rule selected for update.');
    }
  }

  deleteFeeRule(fruCode: number | undefined): void {
    // console.log('deleteFeeRule: fruCode:', fruCode);
    if (fruCode && confirm('Are you sure you want to delete this fee rule?')) {
      this.feeRuleService.delete(fruCode, this.getHttpOptions()).subscribe({
        next: () => {
          // console.log('deleteFeeRule: Success, fruCode:', fruCode);
          this.feeRulesList = this.feeRulesList.filter(r => r.fruCode !== fruCode);
          this.  showSuccessMessage('Fee rule deleted successfully');
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('deleteFeeRule: Error:', err);
          this.showErrorMessage('Failed to delete fee rule: ' + (err.error?.message || 'Please try again.'));
        }
      });
    }
  }

  addOperationType(): void {
    // console.log('addOperationType: Adding operation type:', this.newOperationType);
    if (/* !this.newOperationType.optIden ||  */!this.newOperationType.optLabe || !this.newOperationType.feeSchema?.fscCode) {
      this.showErrorMessage('Please fill in all required fields, including Fee Schema.');
      return;
    }
    this.operationTypeService.create(this.newOperationType, this.getHttpOptions()).subscribe({
      next: (createdOperationType: OperationType) => {
        // console.log('addOperationType: Operation type added:', createdOperationType);
        this.operationTypesList = [...this.operationTypesList, createdOperationType];
        this.newOperationType = new OperationType({ feeSchema: new FeeSchema() });
        this.isOperationTypeVisible = false;
        this.  showSuccessMessage('Operation type added successfully');
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('addOperationType: Error:', err.status, err.error);
        this.showErrorMessage('Failed to add operation type: ' + (err.error?.message || 'Please check the form.'));
      }
    });
  }

  editOperationType(type: OperationType): void {
    // console.log('editOperationType: Operation type object:', type);
    this.selectedOperationType = type;
    this.newOperationType = { ...type, feeSchema: type.feeSchema ? { ...type.feeSchema } : new FeeSchema() };
    this.isOperationTypeVisible = true;
    this.cdr.detectChanges();
  }

  updateOperationType(): void {
    // console.log('updateOperationType: Updating operation type:', this.newOperationType);
    if (/* !this.newOperationType.optIden ||  */!this.newOperationType.optLabe || !this.newOperationType.feeSchema?.fscCode) {
      this.showErrorMessage('Please fill in all required fields, including Fee Schema.');
      return;
    }
    if (this.selectedOperationType?.optCode) {
      this.operationTypeService.update(this.selectedOperationType.optCode, this.newOperationType, this.getHttpOptions()).subscribe({
        next: (updatedOperationType: OperationType) => {
          // console.log('updateOperationType: Operation type updated:', updatedOperationType);
          const index = this.operationTypesList.findIndex(t => t.optCode === updatedOperationType.optCode);
          if (index !== -1) {
            this.operationTypesList[index] = updatedOperationType;
            this.operationTypesList = [...this.operationTypesList];
          }
          this.newOperationType = new OperationType({ feeSchema: new FeeSchema() });
          this.selectedOperationType = null;
          this.isOperationTypeVisible = false;
          this.  showSuccessMessage('Operation type updated successfully');
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('updateOperationType: Error:', err.status, err.error);
          this.showErrorMessage('Failed to update operation type: ' + (err.error?.message || 'Please try again.'));
        }
      });
    } else {
      this.showErrorMessage('No operation type selected for update.');
    }
  }

  deleteOperationType(typeCode: number | undefined): void {
    // console.log('deleteOperationType: typeCode:', typeCode);
    if (typeCode && confirm('Are you sure you want to delete this operation type?')) {
      this.operationTypeService.delete(typeCode, this.getHttpOptions()).subscribe({
        next: () => {
          // console.log('deleteOperationType: Success, typeCode:', typeCode);
          this.operationTypesList = this.operationTypesList.filter(t => t.optCode !== typeCode);
          this.  showSuccessMessage('Operation type deleted successfully');
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('deleteOperationType: Error:', err.status, err.message, err.error);
          this.showErrorMessage('Failed to delete operation type: ' + (err.error?.message || 'Please try again.'));
        }
      });
    }
  }

  addWotm(): void {
    // console.log('addWotm: Adding wotm:', this.newWotm);
    if (!this.newWotm.wallet || !this.newWotm.operationType || !this.newWotm.wotmLimitMax || !this.newWotm.periodicity || !this.newWotm.fees) {
      this.showErrorMessage('Please fill in all required fields, including Fee Schema.');
      return;
    }
    this.wotmService.create(this.newWotm,this.getHttpOptions()).subscribe({
      next: (createdWotm: WalletOperationTypeMap) => {
        // console.log('addWotm: wotm added:', createdWotm);
        this.wotmList = [...this.wotmList, createdWotm];
        this.newWotm = new WalletOperationTypeMap();
        this.isWotmVisible = false;
        this.  showSuccessMessage('Mapping added successfully');
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('addWotm: Error:', err.status, err.error);
        this.showErrorMessage('Failed to add mapping: ' + (err.error?.message || 'Please check the form.'));
      }
    });
  }

  editWotm(wotm: WalletOperationTypeMap): void {
    // console.log('editWotm: mapping object:', wotm);
    this.selectedWotm = wotm;
    this.newWotm = { ...wotm }
    this.isWotmVisible = true;
    this.cdr.detectChanges();
  }

  updateWotm(): void {
    // console.log('addWotm: Adding wotm:', this.newWotm);
    if (!this.newWotm.wallet || !this.newWotm.operationType || !this.newWotm.wotmLimitMax || !this.newWotm.periodicity || !this.newWotm.fees) {
      this.showErrorMessage('Please fill in all required fields, including Fee Schema.');
      return;
    }
    if (this.selectedWotm?.wotmCode) {
      this.wotmService.update(this.selectedWotm.wotmCode, this.newWotm,this.getHttpOptions()).subscribe({
        next: (updatedWotm: WalletOperationTypeMap) => {
          // console.log('updateWotm: Mapping updated:', updatedWotm);
          const index = this.wotmList.findIndex(wotm => wotm.wotmCode === updatedWotm.wotmCode);
          if (index !== -1) {
            this.wotmList[index] = updatedWotm;
            this.wotmList = [...this.wotmList];
          }
          this.newWotm = new WalletOperationTypeMap();
          this.selectedWotm = null;
          this.isWotmVisible = false;
          this.  showSuccessMessage('Mapping type updated successfully');
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('updateWotm: Error:', err.status, err.error);
          this.showErrorMessage('Failed to update Mapping: ' + (err.error?.message || 'Please try again.'));
        }
      });
    } else {
      this.showErrorMessage('No mapping selected for update.');
    }
  }

  deleteWotm(wotmCode: number | undefined): void {
    // console.log('deleteOperationType: wotm:', wotmCode);
    if (wotmCode && confirm('Are you sure you want to delete this mapping?')) {
      this.wotmService.delete(wotmCode, this.getHttpOptions()).subscribe({
        next: () => {
          // console.log('deleteOperationType: Success, wotmCode:', wotmCode);
          this.wotmList = this.wotmList.filter(wotm => wotm.wotmCode !== wotmCode);
          this.  showSuccessMessage('Mapping deleted successfully');
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('deleteMapping: Error:', err.status, err.message, err.error);
          this.showErrorMessage('Failed to delete mapping: ' + (err.error?.message || 'Please try again.'));
        }
      });
    }
  }

  addWcotm(): void {
    // console.log('addWcotm: Adding wcotm:', this.newWcotm);
    if (!this.newWcotm.walletCategory || !this.newWcotm.operationType || !this.newWcotm.limitMax || !this.newWcotm.periodicity || !this.newWcotm.fees) {
      this.showErrorMessage('Please fill in all required fields, including Fee Schema.');
      return;
    }
    this.wcotmService.create(this.newWcotm).subscribe({
      next: (createdWcotm: WalletCategoryOperationTypeMap) => {
        // console.log('addWcotm: wcotm added:', createdWcotm);
        this.wcotmList = [...this.wcotmList, createdWcotm];
        this.newWcotm = new WalletCategoryOperationTypeMap();
        this.isWcotmVisible = false;
        this.  showSuccessMessage('Mapping added successfully');
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('addWcotm: Error:', err.status, err.error);
        this.showErrorMessage('Failed to add mapping: ' + (err.error?.message || 'Please check the form.'));
      }
    });
  }

  editWcotm(wcotm: WalletCategoryOperationTypeMap): void {
    // console.log('editWcotm: mapping object:', wcotm);
    this.selectedWcotm = wcotm;
    this.newWcotm = { ...wcotm }
    this.isWcotmVisible = true;
    this.cdr.detectChanges();
  }

  updateWcotm(): void {
    // console.log('addWcotm: Adding wcotm:', this.newWcotm);
    if (!this.newWcotm.walletCategory || !this.newWcotm.operationType || !this.newWcotm.limitMax || !this.newWcotm.periodicity || !this.newWcotm.fees) {
      this.showErrorMessage('Please fill in all required fields, including Fee Schema.');
      return;
    }
    if (this.selectedWcotm?.id) {
      this.wcotmService.update(this.selectedWcotm.id, this.newWcotm).subscribe({
        next: (updatedWcotm: WalletCategoryOperationTypeMap) => {
          // console.log('updateWcotm: Mapping updated:', updatedWcotm);
          const index = this.wcotmList.findIndex(wcotm => wcotm.id === updatedWcotm.id);
          if (index !== -1) {
            this.wcotmList[index] = updatedWcotm;
            this.wcotmList = [...this.wcotmList];
          }
          this.newWcotm = new WalletCategoryOperationTypeMap();
          this.selectedWcotm = null;
          this.isWcotmVisible = false;
          this.  showSuccessMessage('Mapping type updated successfully');
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('updateWcotm: Error:', err.status, err.error);
          this.showErrorMessage('Failed to update Mapping: ' + (err.error?.message || 'Please try again.'));
        }
      });
    } else {
      this.showErrorMessage('No mapping selected for update.');
    }
  }

  deleteWcotm(wcotmCode: number | undefined): void {
    // console.log('deleteOperationType: wcotm:', wcotmCode);
    if (wcotmCode && confirm('Are you sure you want to delete this mapping?')) {
      this.wcotmService.delete(wcotmCode).subscribe({
        next: () => {
          // console.log('deleteOperationType: Success, wcotmCode:', wcotmCode);
          this.wcotmList = this.wcotmList.filter(wcotm => wcotm.id !== wcotmCode);
          this.  showSuccessMessage('Mapping deleted successfully');
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('deleteMapping: Error:', err.status, err.message, err.error);
          this.showErrorMessage('Failed to delete mapping: ' + (err.error?.message || 'Please try again.'));
        }
      });
    }
  }

  addPeriodicity(): void {
    // console.log('addPeriodicity: Adding periodicity:', this.newPeriodicity);
    if (/* !this.newPeriodicity.perIden ||  */!this.newPeriodicity.perLabe) {
      this.showErrorMessage('Please fill in all required fields.');
      return;
    }
    this.periodicityService.create(this.newPeriodicity, this.getHttpOptions()).subscribe({
      next: (createdPeriodicity: Periodicity) => {
        // console.log('addPeriodicity: Periodicity added:', createdPeriodicity);
        this.periodicitiesList.push(createdPeriodicity);
        this.newPeriodicity = new Periodicity();
        this.isPeriodicityVisible = false;
        this.  showSuccessMessage('Periodicity added successfully');
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('addPeriodicity: Error:', err);
        this.showErrorMessage('Failed to add periodicity: ' + (err.error?.message || 'Please check the form.'));
      }
    });
  }

  editPeriodicity(periodicity: Periodicity): void {
    // console.log('editPeriodicity: Periodicity object:', periodicity);
    this.selectedPeriodicity = periodicity;
    this.newPeriodicity = { ...periodicity };
    this.isPeriodicityVisible = true;
    this.cdr.detectChanges();
  }

  updatePeriodicity(): void {
    // console.log('updatePeriodicity: Updating periodicity:', this.newPeriodicity);
    if (/* !this.newPeriodicity.perIden ||  */!this.newPeriodicity.perLabe) {
      this.showErrorMessage('Please fill in all required fields.');
      return;
    }
    if (this.selectedPeriodicity?.perCode) {
      this.periodicityService.update(this.selectedPeriodicity.perCode, this.newPeriodicity, this.getHttpOptions()).subscribe({
        next: (updatedPeriodicity: Periodicity) => {
          // console.log('updatePeriodicity: Periodicity updated:', updatedPeriodicity);
          const index = this.periodicitiesList.findIndex(p => p.perCode === updatedPeriodicity.perCode);
          if (index !== -1) {
            this.periodicitiesList[index] = updatedPeriodicity;
            this.periodicitiesList = [...this.periodicitiesList];
          }
          this.newPeriodicity = new Periodicity();
          this.selectedPeriodicity = null;
          this.isPeriodicityVisible = false;
          this.  showSuccessMessage('Periodicity updated successfully');
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('updatePeriodicity: Error:', err);
          this.showErrorMessage('Failed to update periodicity: ' + (err.error?.message || 'Please try again.'));
        }
      });
    } else {
      this.showErrorMessage('No periodicity selected for update.');
    }
  }

  deletePeriodicity(perCode: number | undefined): void {
    // console.log('deletePeriodicity: perCode:', perCode);
    if (perCode && confirm('Are you sure you want to delete this periodicity?')) {
      this.periodicityService.delete(perCode, this.getHttpOptions()).subscribe({
        next: () => {
          // console.log('deletePeriodicity: Success, perCode:', perCode);
          this.periodicitiesList = this.periodicitiesList.filter(p => p.perCode !== perCode);
          this.  showSuccessMessage('Periodicity deleted successfully');
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('deletePeriodicity: Error:', err);
          this.showErrorMessage('Failed to delete periodicity: ' + (err.error?.message || 'Please try again.'));
        }
      });
    }
  }

  showSuccessMessage(message: string): void {
    console.log('showSuccessMessage:', message);
      (new Audio('assets/notification.mp3')).play()
    this.successMessage = message;
    this.errorMessage = null;
    setTimeout(() => {
      this.successMessage = null;
      this.cdr.detectChanges();
    }, 3000);
  }

  showErrorMessage(message: string): void {
    console.log('showErrorMessage:', message);
      (new Audio('assets/notification.mp3')).play()
    this.errorMessage = message;
    this.successMessage = null;
    setTimeout(() => {
      this.errorMessage = null;
      this.cdr.detectChanges();
    }, 3000);
  }

  clearMessage(): void {
    // console.log('clearMessage: Clearing messages');
    this.successMessage = null;
    this.errorMessage = null;
    this.cdr.detectChanges();
  }

  toggleForm(modal: string): void {
    // console.log('toggleForm: Opening modal:', modal);
    if (modal === 'operation-type' && this.feeSchemasList.length === 0) {
      // console.log('toggleForm: No fee schemas loaded, attempting to load...');
      this.loadFeeSchemas();
    }
    if (modal === 'fee-rule' && (this.feeSchemasList.length === 0 || this.feeRuleTypesList.length === 0 || this.vatRatesList.length === 0 || this.walletsList.length === 0)) {
      // console.log('toggleForm: Loading dependencies for fee rule...');
      this.loadFeeSchemas();
      this.loadFeeRuleTypes();
      this.loadVatRates();
      this.loadWallets();
    }
    if (modal !== 'fee-schema' || !this.selectedFeeSchema) {
      this.newFeeSchema = new FeeSchema();
    }
    if (modal !== 'fee-rule-type' || !this.selectedFeeRuleType) {
      this.newFeeRuleType = new FeeRuleType();
    }
    this.newFee = new Fees();
    this.selectedFee = null;
    this.selectedFeeRuleType = null;
    this.newFeeRule = new FeeRule();
    this.selectedFeeRule = null;
    this.newOperationType = new OperationType({ feeSchema: new FeeSchema() });
    this.selectedOperationType = null;
    this.newPeriodicity = new Periodicity();
    this.selectedPeriodicity = null;
    switch (modal) {
      case 'fee':
        this.isFeeVisible = true;
        break;
      case 'fee-schema':
        this.isFeeSchemaVisible = true;
        break;
      case 'fee-rule':
        this.isFeeRuleVisible = true;
        break;
      case 'fee-rule-type':
        this.isFeeRuleTypeVisible = true;
        break;
      case 'operation-type':
        this.isOperationTypeVisible = true;
        break;
      case 'operation-wotm':
        this.isWotmVisible = true;
        break;
      case 'operation-wcotm':
        this.isWcotmVisible = true;
        break;
      case 'operation-periodicity':
        this.isPeriodicityVisible = true;
        break;
    }
    this.cdr.detectChanges();
  }

  closeForm(modal: string): void {
    // console.log('closeForm: Closing modal:', modal);
    switch (modal) {
      case 'fee':
        this.newFee = new Fees();
        this.selectedFee = null;
        this.isFeeVisible = false;
        break;
      case 'fee-schema':
        this.newFeeSchema = new FeeSchema();
        this.selectedFeeSchema = null;
        this.isFeeSchemaVisible = false;
        break;
      case 'fee-rule':
        this.newFeeRule = new FeeRule();
        this.selectedFeeRule = null;
        this.isFeeRuleVisible = false;
        break;
      case 'fee-rule-type':
        this.newFeeRuleType = new FeeRuleType();
        this.selectedFeeRuleType = null;
        this.isFeeRuleTypeVisible = false;
        break;
      case 'operation-type':
        this.newOperationType = new OperationType({ feeSchema: new FeeSchema() });
        this.selectedOperationType = null;
        this.isOperationTypeVisible = false;
        break;
      case 'operation-wotm':
        this.isWotmVisible = false;
        break;
      case 'operation-wcotm':
        this.isWcotmVisible = false;
        break;
      case 'operation-periodicity':
        this.newPeriodicity = new Periodicity();
        this.selectedPeriodicity = null;
        this.isPeriodicityVisible = false;
        break;
    }
    this.cdr.detectChanges();
  }

  get isAnyModalVisible(): boolean {
    return (
      this.isFeeVisible ||
      this.isFeeSchemaVisible ||
      this.isFeeRuleVisible ||
      this.isFeeRuleTypeVisible ||
      this.isOperationTypeVisible ||
      this.isWotmVisible ||
      this.isWcotmVisible ||
      this.isPeriodicityVisible
    );
  }

  

  showTab(tabId: string, tabType?: string): void {

    const buttonClass = tabType ? `${tabType}-tab-button` : 'tab-button';
    const contentClass = tabType ? `${tabType}-tab-content` : 'tab-content';
    const tabButtons = document.querySelectorAll(`.${buttonClass}`);
    const tabContents = document.querySelectorAll(`.${contentClass}`);

    // Reset all buttons and contents
    tabButtons.forEach(btn => {
      btn.classList.remove('active', 'text-primary', 'font-medium', 'border-b-2', 'border-primary', 'transition-colors');
      btn.classList.add('text-gray-500');
    });

    tabContents.forEach(content => content.classList.add('hidden'));

    // Activate the clicked button and show its tab content
    const activeButton = tabType ? document.getElementById(tabType + '-' + tabId) : document.getElementById(tabId);
    activeButton?.classList.add('active', 'text-primary', 'font-medium', 'border-b-2', 'border-primary', 'transition-colors');
    activeButton?.classList.remove('text-gray-500');

    const activeId = tabType ? `${tabType}-tab-${tabId}` : `tab-${tabId}`;
    const activeContent = document.getElementById(activeId);
    activeContent?.classList.remove('hidden');
  }
}