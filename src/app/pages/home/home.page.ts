import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { documentOutline, warningOutline, bulbOutline } from 'ionicons/icons';
import { CommonHeaderComponent } from 'src/app/components/common-header/common-header.component';
import { HttpService } from 'src/app/services/http-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, CommonHeaderComponent]
})
export class HomePage implements OnInit {
  healthScore = 0;
  vitalsAdded = false;
  aiSummary = "";
  healthData: any = {};

  loading = false;

  vitals = {
    heartRate: null,
    systolic: null,
    diastolic: null,
    temperature: null,
    oxygen: null,
    date: new Date().toISOString()
  };

  constructor(private router: Router, private httpService: HttpService) {
    addIcons({
      'document-text-outline': documentOutline,
      'warning-outline': warningOutline,
      'bulb-outline': bulbOutline
    });
  }

  ngOnInit() {
    console.log('HomePage initialized');

    this.httpService.initiateJWT().then(() => {
      
    }).catch(err => {
      console.log('Error initiating JWT:', err);
    });
  }

  ionViewWillEnter() {
    const savedVitals = localStorage.getItem('vitals');
    if (savedVitals) {
      this.vitals = JSON.parse(savedVitals);
    }
    const aiSummary = localStorage.getItem('aiSummary') || "";
    if (aiSummary) {
      this.aiSummary = aiSummary;
      this.healthData = JSON.parse(aiSummary);
      this.healthScore = this.healthData?.healthscore || 0;
    }
  }

  goToVitals() {
    // Logic to navigate to vitals page
    this.router.navigate(['/tabs/tab2']);
  }

  goToInsights() {
    // Logic to navigate to insights page
    this.router.navigate(['/tabs/tab3']);

  }
}
