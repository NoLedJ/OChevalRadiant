import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefinitionCard } from './definition-card';

describe('DefinitionCard', () => {
  let component: DefinitionCard;
  let fixture: ComponentFixture<DefinitionCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefinitionCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefinitionCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
