import { Directive, HostBinding, HostListener } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Directive({
  selector: '[appConnectivityCheck]',
})
export class ConnectivityCheckDirective {
  constructor(private localStorageService: LocalStorageService) {}
  @HostListener('window:offline')
  onLostNetwork() {
    console.log
    ("Connection Lost");
  }
  @HostListener('window:online')
  onBackNetwork() {
    console.log("Connection Back");

  }
}
