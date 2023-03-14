import { DatePipe } from '@angular/common';
import { Component,  OnInit } from '@angular/core';


@Component({
  selector: 'app-add-new',
  templateUrl: './add-new.page.html',
  styleUrls: ['./add-new.page.scss'],
})
export class AddNewPage implements OnInit {
 

  ngOnInit() {}

  constructor(
    private datePipe: DatePipe
  ) {}

  change(event) {
    console.log(event);
  }

  dateFormat(date, format) {
    return this.datePipe.transform(date, format);
  }
  

}