import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-common-header',
  imports: [IonHeader, IonToolbar, IonTitle],
  templateUrl: './common-header.component.html',
  styleUrls: ['./common-header.component.scss'],
})
export class CommonHeaderComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
