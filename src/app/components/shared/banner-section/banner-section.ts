import { Component, effect, input } from '@angular/core';
import { AnimateOnVisibleDirective } from '../../../directives/animate-on-visible.directive';
import { FacebookButton } from '../facebook-button/facebook-button';

@Component({
  selector: 'app-banner-section',
  imports: [FacebookButton, AnimateOnVisibleDirective],
  templateUrl: './banner-section.html',
  styleUrl: './banner-section.scss',
})
export class BannerSection {

  bannerImage = input<string>();
  bannerTitle = input<string>();
  bannerSubtitle = input<string>();
  heroHeader = input<boolean>(false);

  banner_2xl = "";
  banner_xl = "";
  banner_large = "";
  banner_medium = "";

  constructor() {
    effect(() => {
      const img = this.bannerImage();
      if (img) {
        this.banner_2xl = `${img}` + '-2xl.jpg';
        this.banner_xl = `${img}` + '-xl.jpg';
        this.banner_large = `${img}` + '-large.jpg';
        this.banner_medium = `${img}` + '-medium.jpg';
      }
    });
  }

}
