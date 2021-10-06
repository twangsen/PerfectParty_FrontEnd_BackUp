import { Component, OnInit } from '@angular/core';
import {DbService} from '../db.service';

@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.css']
})
export class SampleComponent implements OnInit {

  value = 'value';

  constructor(private dbservice: DbService) { }

  ngOnInit() {
  }

  /* toggle element */
  toggle(givenEid) {
    var x = document.getElementById(givenEid);
    if (x.style.display === 'none') {
      x.style.display = 'block';
    } else {
      x.style.display = 'none';
    }
  }

  /* update value */
  updateValue(givenEid, value) {
    if (givenEid === 'updateFirstName') {
      /* update value in this class */
      this.value = value;
      /* then should update value in DB postData function need to return Observable<type>*/
      this.dbservice.postData(this.value)
          .subscribe(data => {
            /* post result */
            console.log(JSON.stringify(data));
          });
    }

  }

}
