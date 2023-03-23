import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token-interceptor.interceptor';
import { ActionHostDirective } from './directives/action-host.directive';
import { ErrorHandlerComponent } from './exceptions/error-handler/error-handler.component';

@NgModule({
  declarations: [
    ActionHostDirective,
  ],
  imports: [
    CommonModule
  ],
  exports :[ActionHostDirective],
  providers: [{provide: HTTP_INTERCEPTORS,useClass: TokenInterceptor,multi:true},{provide: ErrorHandler, useClass: ErrorHandlerComponent}]
})
export class CoreModule { }
