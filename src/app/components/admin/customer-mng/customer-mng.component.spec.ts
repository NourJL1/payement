import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerMngComponent } from './customer-mng.component';

describe('CustomerMngComponent', () => {
  let component: CustomerMngComponent;
  let fixture: ComponentFixture<CustomerMngComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerMngComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerMngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
