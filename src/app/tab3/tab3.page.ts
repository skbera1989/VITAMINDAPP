import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon, IonProgressBar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { documentOutline, warningOutline, bulbOutline, analyticsOutline, checkmarkCircle } from 'ionicons/icons';
import { HttpService } from 'src/app/services/http-service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, CommonModule, FormsModule, ReactiveFormsModule, IonHeader, IonToolbar, IonTitle, IonContent, CommonModule, FormsModule, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon,IonProgressBar],
})
export class Tab3Page {
  healthData: any = {};
  loading = false;

  constructor(private router: Router, private httpService: HttpService) {
    addIcons({
      'analytics-outline': analyticsOutline,
      'document-text-outline': documentOutline,
      'warning-outline': warningOutline,
      'bulb-outline': bulbOutline,
      'checkmark-circle': checkmarkCircle
    });
  }


  ionViewWillEnter() {
    let aiSummaryInitial = localStorage.getItem('initialAIResponse') || "";
    let aiSummaryFollowUp = localStorage.getItem('followUpAIResponse') || "";
    if(JSON.parse(aiSummaryInitial).risk_level === "low"){
      this.healthData = JSON.parse(aiSummaryInitial);
    }else{
      this.healthData = JSON.parse(aiSummaryFollowUp);
    }
  }

  goToHome(){
    this.router.navigate(['/tabs/tabs/tab1']);
  }
}
