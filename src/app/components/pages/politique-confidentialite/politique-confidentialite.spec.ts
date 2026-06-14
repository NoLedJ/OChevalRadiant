import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolitiqueConfidentialite } from './politique-confidentialite';

describe('PolitiqueConfidentialite', () => {
  let component: PolitiqueConfidentialite;
  let fixture: ComponentFixture<PolitiqueConfidentialite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolitiqueConfidentialite]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolitiqueConfidentialite);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
