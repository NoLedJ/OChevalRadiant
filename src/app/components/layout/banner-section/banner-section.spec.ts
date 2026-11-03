import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerSection } from './banner-section';

describe('BannerSection', () => {
  let component: BannerSection;
  let fixture: ComponentFixture<BannerSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerSection],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannerSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
