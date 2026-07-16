import import_navigation_links_json from '../navbar-items/navigation-link.json';
import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { AnimateOnVisibleDirective } from '../../../directives/animate-on-visible.directive';
import { FacebookButton } from '../../shared/facebook-button/facebook-button';
import { RouterLink } from '@angular/router';
import { SafeHtmlPipe } from "../../../pipes/safe-html-pipe";

@Component({
  selector: 'app-banner-section',
  imports: [FacebookButton, AnimateOnVisibleDirective, RouterLink, SafeHtmlPipe],
  templateUrl: './banner-section.html',
  styleUrl: './banner-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BannerSection {

  navigation_links = import_navigation_links_json;

  bannerImage = input<string>("");
  bannerTitle = input<string>("");
  bannerSubtitle = input<string>("");
  heroHeader = input<boolean>(false);

  banner_2xl = "";
  banner_xl = "";
  banner_large = "";
  banner_medium = "";

  constructor() {
    effect(() => {
      const img = this.bannerImage();
      if (img) {
        this.banner_2xl = `${img}` + '-2xl.webp';
        this.banner_xl = `${img}` + '-xl.webp';
        this.banner_large = `${img}` + '-large.webp';
        this.banner_medium = `${img}` + '-medium.webp';
      }
    });
  }

}
