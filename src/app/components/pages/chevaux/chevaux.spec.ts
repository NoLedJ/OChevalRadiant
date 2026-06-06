import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chevaux } from './chevaux';

describe('Chevaux', () => {
  let component: Chevaux;
  let fixture: ComponentFixture<Chevaux>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chevaux]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chevaux);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
