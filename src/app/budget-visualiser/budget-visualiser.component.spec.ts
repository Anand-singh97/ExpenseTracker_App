import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetVisualiserComponent } from './budget-visualiser.component';

describe('BudgetVisualiserComponent', () => {
  let component: BudgetVisualiserComponent;
  let fixture: ComponentFixture<BudgetVisualiserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetVisualiserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BudgetVisualiserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
