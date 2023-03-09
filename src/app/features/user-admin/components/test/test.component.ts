import { Component, OnInit } from '@angular/core';
import { Quiz } from 'src/app/core/models/quiz.model';
import { QuizService } from '../../services/quiz.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

   quizzes:Quiz[] = [{title:"Title 1"} as Quiz, {title:"Title 2"} as Quiz]
   headers: string[]= ['Title','Domain','Subdomain','Action'];
   constructor(private quizService: QuizService){

   }
   ngOnInit(): void {
   this.quizService.getAvailableQuizzes().subscribe((res)=>{
     this.quizzes = res;
   })
  }
}
