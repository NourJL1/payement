import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletMngComponent } from './wallet-mng.component';

describe('WalletMngComponent', () => {
  let component: WalletMngComponent;
  let fixture: ComponentFixture<WalletMngComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletMngComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
