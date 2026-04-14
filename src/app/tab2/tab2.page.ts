import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonLabel, IonItem, IonItemDivider, IonIcon, IonDatetime, IonSpinner, IonToggle, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { HttpService } from '../services/http-service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, CommonModule, FormsModule, ReactiveFormsModule, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonLabel, IonItem, IonItemDivider, IonIcon, IonDatetime, IonSpinner, IonToggle, IonSelect, IonSelectOption],
})
export class Tab2Page {
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
  followUpForm: FormGroup;
  questions: { question: string, type: string, field_key: string, options: string }[] = [];

  constructor(private router: Router, private httpService: HttpService, private formBuilder: FormBuilder) {
    addIcons({
      'home-outline': homeOutline,
      'pulse-outline': pulseOutline,
      'bulb-outline': bulbOutline,
      'thermometer-outline': thermometerOutline,
      'water-outline': waterOutline,
      'calendar-outline': calendarOutline
    });
    this.followUpForm = new FormGroup({});
  }

  ionViewWillEnter() {
    const initialAIResponse = localStorage.getItem('initialAIResponse');
    this.questions = initialAIResponse ? JSON.parse(initialAIResponse).followup_questions || [] : [];
    // console.log('Follow-up questions:', this.questions);
    this.followUpForm = this.generateForm(this.questions);
  }

  generateForm(questions: { field_key: string }[]) {
    const formGroup: { [key: string]: FormControl } = {};
  
    questions.forEach(q => {
      formGroup[q.field_key] = new FormControl('');
    });
  
    return this.formBuilder.group(formGroup);
  }

  onSubmit() {  
    if (this.followUpForm.valid) {
      const followUpAnswers = this.followUpForm.value;
      // localStorage.setItem('followUpAnswers', JSON.stringify(followUpAnswers));
      let userInfo = localStorage.getItem('userInfo');
      let userData = userInfo ? JSON.parse(userInfo) : null;
      let healthForm = localStorage.getItem('healthForm');
      let healthData = healthForm ? JSON.parse(healthForm) : null;
      this.chat(userData?.age ?? 0, healthData?.symptoms ?? '', healthData?.duration ?? 0, healthData?.history ?? '', userData?.gender ?? '', JSON.stringify(followUpAnswers));
    }
  }

  chat(age: number, symptoms: string, duration: number, history: string, gender: string, followUpAnswers: string) {
    const prompt = `
    You are a medical assistant AI.

    Initial User Data:
    - Age: ${age} years old 
    - Gender: ${gender}
    - Symptoms: ${symptoms}
    - Duration: ${duration} days
    - Medical history: ${history}

    Follow-up Answers:
    ${followUpAnswers}

    Do NOT provide diagnosis or prescribe medication.
    Return ONLY result in JSON format with below keys:

    healthscore, summary, possible_cause, risk_level, concerns, doctor_appointment_need, advice (array), followup_questions.

    healthscore: A number between 0-100 indicating overall health.
    summary: A brief summary of the user's health based on the vitals.
    possible_cause: The most likely cause of the symptoms based on the information provided.
    risk_level: A simple categorization of risk (e.g., "low", "medium", "high") based on the symptoms.
    concerns: Any potential health concerns based on the vitals.
    doctor_appointment_need: A recommendation on whether the user should see a doctor based on the symptoms.
    advice: Specific advice or recommendations for the user.

    Keep it short and easy to understand. 
    `;
    this.loading = true;
    this.httpService.chatAPI(prompt).then(botReply => {
      localStorage.setItem('followUpAIResponse', botReply);
      this.loading = false;
      this.followUpForm.reset();
      this.router.navigate(['/tabs/tabs/tab3']);
    }).catch(err => {
      console.error('AI API error:', err);
      this.loading = false;
    });
  }

  goToHome(){
    this.router.navigate(['/tabs/tabs/tab1']);
  }
}
