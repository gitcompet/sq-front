import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token-interceptor.interceptor';
import { ActionHostDirective } from './directives/action-host.directive';

@NgModule({
  declarations: [
    ActionHostDirective
  ],
  imports: [
    CommonModule
  ],
  exports :[ActionHostDirective],
  providers: [{provide: HTTP_INTERCEPTORS,useClass: TokenInterceptor,multi:true}]
})
export class CoreModule { }
