import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Accompagnements } from './accompagnements';

describe('Accompagnements', () => {
  let component: Accompagnements;
  let fixture: ComponentFixture<Accompagnements>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Accompagnements]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Accompagnements);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
