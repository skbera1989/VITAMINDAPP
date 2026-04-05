import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ToastController, IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  pulseOutline,
  bulbOutline,
  thermometerOutline,
  waterOutline,
  calendarOutline
} from 'ionicons/icons';
import { CommonHeaderComponent } from 'src/app/components/common-header/common-header.component';
import { HttpService } from '../../services/http-service';

@Component({
  selector: 'app-vitals',
  templateUrl: './vitals.page.html',
  styleUrls: ['./vitals.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, CommonHeaderComponent]
})
export class VitalsPage {
  loading = false;
  vitals = {
    heartRate: null,
    systolic: null,
    diastolic: null,
    temperature: null,
    oxygen: null,
    date: new Date().toISOString()
  };

  vitalsAdded = false;

  constructor(private toastCtrl: ToastController, private router: Router, private httpService: HttpService) {
    addIcons({
      'home-outline': homeOutline,
      'pulse-outline': pulseOutline,
      'bulb-outline': bulbOutline,
      'thermometer-outline': thermometerOutline,
      'water-outline': waterOutline,
      'calendar-outline': calendarOutline
    });
  }

  async saveVitals() {
    if (!this.vitals.heartRate) {
      this.showToast("Heart Rate is required");
      return;
    }

    if (!this.vitals.systolic || !this.vitals.diastolic) {
      this.showToast("Blood Pressure is required");
      return;
    }

    this.chat();
  }

  async showToast(message: string, color: string = 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color: color
    });
    toast.present();
  }

  chat() {
    if (this.vitals.heartRate === null && this.vitals.systolic === null && this.vitals.diastolic === null) return;
    const userMsg = "Analyze my vitals and give me a health summary.";
    const prompt = `
  Act as a health assistant. 

  Here are the user's vitals:
  ${JSON.stringify(this.vitals, null, 2)}

  User asked:
  "${userMsg}"
  
  Return the result in JSON format with keys:
  healthscore, summary, concerns, advice (array).

  healthscore: A number between 0-100 indicating overall health.
  summary: A brief summary of the user's health based on the vitals.
  concerns: Any potential health concerns based on the vitals.
  advice: Specific advice or recommendations for the user.
  
  Keep it short and easy to understand.
  `;
    this.loading = true;
    this.httpService.chatAPI(prompt).then(botReply => {
      localStorage.setItem('aiSummary', botReply);
      localStorage.setItem('vitals', JSON.stringify(this.vitals));
      this.showToast('Vitals saved successfully!', 'success');

      // Reset form (optional)
      this.vitals = {
        heartRate: null,
        systolic: null,
        diastolic: null,
        temperature: null,
        oxygen: null,
        date: new Date().toISOString()
      };
      this.loading = false;
      this.router.navigate(['/tabs/tab3']);
    }).catch(err => {
      console.error('AI API error:', err);
      this.loading = false;
    });
  }
}
