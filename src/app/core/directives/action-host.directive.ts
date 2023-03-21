import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appActionHost]'
})
export class ActionHostDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
