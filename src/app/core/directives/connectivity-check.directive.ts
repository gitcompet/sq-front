import { Directive, HostBinding } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Directive({
  selector: '[appConnectivityCheck]',
})
export class ConnectivityCheckDirective {
  constructor(private localStorageService: LocalStorageService) {}
  @HostBinding('window:offline')
  onLostNetwork() {}
  @HostBinding('window:online')
  onBackNetwork() {}
}
