import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionsUtilisation } from './conditions-utilisation';

describe('ConditionUtilisation', () => {
  let component: ConditionsUtilisation;
  let fixture: ComponentFixture<ConditionsUtilisation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConditionsUtilisation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConditionsUtilisation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
