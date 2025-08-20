import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SysSettingsComponent } from './sys-settings.component';

describe('SysSettingsComponent', () => {
  let component: SysSettingsComponent;
  let fixture: ComponentFixture<SysSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SysSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SysSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
