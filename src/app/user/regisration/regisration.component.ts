import { Component } from '@angular/core';
import { UserService } from 'src/app/chared/user.service';

@Component({
  selector: 'app-regisration',
  templateUrl: './regisration.component.html',
  styles: [
  ]
})
export class RegisrationComponent {
  constructor( public service:UserService)
  {}
  ngOnInit(){
this.service.formModel.reset();
  }
onsubmit1()
{
  this.service.register().subscribe(
    (res:any)=>{
      if(res.succeded)
      {      this.service.formModel.reset();
        console.log("res:"+res);
      }
    },
    error=>{
      console.log(error);
    }
  );
}
  onsubmit()
{
  this.service.register()
  .subscribe({
    next: (res)=>
    {console.log('res :',res);
  if(res){
    this.service.formModel.reset();

  }
  },
  
    error: (err)=> console.log(err),
    complete: ()=>console.log('completed')
  });
}

}

