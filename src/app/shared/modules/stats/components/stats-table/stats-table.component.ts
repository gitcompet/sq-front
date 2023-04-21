import { KeyValue } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stats-table',
  templateUrl: './stats-table.component.html',
  styleUrls: ['./stats-table.component.css']
})
export class StatsTableComponent {
 @Input() headers!: string[];
 @Input() data!: any;
 @Input()title!: string;
  // Preserve original property order
  originalOrder = (
    a: KeyValue<number, any>,
    b: KeyValue<number, any>
  ): number => {
    return 0;
  };

}
