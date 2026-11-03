import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { APropos } from './a-propos';

describe('APropos', () => {
  let component: APropos;
  let fixture: ComponentFixture<APropos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [APropos],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(APropos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
