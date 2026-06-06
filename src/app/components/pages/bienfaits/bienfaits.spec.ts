import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bienfaits } from './bienfaits';

describe('Bienfaits', () => {
  let component: Bienfaits;
  let fixture: ComponentFixture<Bienfaits>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bienfaits]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bienfaits);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
