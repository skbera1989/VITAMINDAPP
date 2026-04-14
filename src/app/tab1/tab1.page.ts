import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonCol, IonRow, IonSpinner, IonProgressBar, IonIcon, IonItem, IonLabel,
  IonInput,
  IonTextarea, IonText, IonRadio, IonRadioGroup} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { documentOutline, warningOutline, bulbOutline, fitnessOutline } from 'ionicons/icons';
import { HttpService } from 'src/app/services/http-service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, CommonModule, FormsModule, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonCol, IonRow, IonSpinner, IonProgressBar, IonIcon, IonItem, ReactiveFormsModule, CommonModule,
    ReactiveFormsModule,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonButton,
    IonText, IonRadioGroup,
    IonRadio,],
})
export class Tab1Page {
  userName: string = "";

  loading = false;

  healthForm = this.fb.group({
    forWhom: ['', Validators.required],
    name: ['', Validators.required],
    age: ['', [Validators.required, Validators.min(1)]],
    symptoms: ['', Validators.required],
    duration: ['', Validators.required],
    history: ['']
  });

  constructor(private router: Router, private httpService: HttpService, private fb: FormBuilder) {
    addIcons({
      'document-text-outline': documentOutline,
      'warning-outline': warningOutline,
      'bulb-outline': bulbOutline,
      'fitness-outline': fitnessOutline
    });

    let userInfo = localStorage.getItem('userInfo');
    this.userName = userInfo ? JSON.parse(userInfo).name : "";
    if(this.healthForm.get('forWhom')?.value === '' && userInfo){
      const user = JSON.parse(userInfo);
      this.healthForm.patchValue({
        forWhom: 'me',
        name: user.name,
        age: user.age,
      });
    }
  }

  ngOnInit() {
    // console.log('HomePage initialized');
    this.healthForm.get('forWhom')?.valueChanges.subscribe(value => {

      if (value === 'others') {
        this.healthForm.patchValue({
          name: '',
          age: ''
        });
        const name = this.healthForm.get('name');
        const age = this.healthForm.get('age');
        name?.markAsPristine();
        name?.markAsUntouched();

      age?.markAsPristine();
      age?.markAsUntouched();
      } else if (value === 'me') {
        const userInfo = localStorage.getItem('userInfo');
  
        if (userInfo) {
          const user = JSON.parse(userInfo);
  
          this.healthForm.patchValue({
            name: user.name,
            age: user.age
          });
        }
      }
  
    });

    this.httpService.initiateJWT().then(() => {
      
    }).catch((err: any) => {
      console.log('Error initiating JWT:', err);
    });
  }

  ionViewWillEnter() {

  }

  onSubmit() {
    if (this.healthForm.valid) {
      // console.log(this.healthForm.value);
      localStorage.setItem('healthForm', JSON.stringify(this.healthForm.value));
      let userInfo = localStorage.getItem('userInfo');
      const user = JSON.parse(userInfo || "{}");
      this.chat(
        Number(this.healthForm.get('age')?.value ?? 0),
        this.healthForm.get('symptoms')?.value ?? '',
        Number(this.healthForm.get('duration')?.value ?? 0),
        this.healthForm.get('history')?.value ?? '',
        this.healthForm.get('forWhom')?.value ?? ''
      );
    }
  }

  chat(age: number, symptoms: string, duration: number, history: string, gender: string) {
    const prompt = `
    You are a medical assistant AI.
    User is a ${age} years old ${gender} with symptoms:
    - Symptoms: ${symptoms}
    - Duration: ${duration} days
    - Medical history: ${history}

    Based on the user data below, do NOT provide diagnosis.
    Return response ONLY in valid JSON format.

    Return the result in JSON format with keys:
    healthscore, summary, possible_cause, risk_level, concerns, doctor_appointment_need, advice (array), followup_questions.

    healthscore: A number between 0-100 indicating overall health.
    summary: A brief summary of the user's health based on the vitals.
    possible_cause: The most likely cause of the symptoms based on the information provided.
    risk_level: A simple categorization of risk (e.g., "low", "medium", "high") based on the symptoms.
    concerns: Any potential health concerns based on the vitals.
    doctor_appointment_need: A recommendation on whether the user should see a doctor based on the symptoms.
    advice: Specific advice or recommendations for the user.
    followup_questions: A list of 3-5 follow-up questions for better assesment only if risk level is "medium" or "high".
    
    Rules for follow-up questions:
    - Must be simple
    - Must be safe (no diagnosis)
    - Use field types: boolean, number, select, text
    - For field type select give predefined options (e.g., "Do you have a fever?" with options "Yes" or "No").
    - Keep it relevant

    Return JSON with:
    - analysis
    - follow_up_questions (array of objects with question and type)

    Do NOT give final diagnosis. Keep it short and easy to understand. 
    `;
    this.loading = true;
    this.httpService.chatAPI(prompt).then(botReply => {
      localStorage.setItem('initialAIResponse', botReply);
      localStorage.setItem('followUpAIResponse', '');
      this.loading = false;
      this.healthForm.reset();
      if(JSON.parse(botReply).risk_level === 'medium' || JSON.parse(botReply).risk_level === 'high'){
        this.router.navigate(['/tabs/tabs/tab2']);
      }else{
        this.router.navigate(['/tabs/tabs/tab3']);
      }
      
    }).catch(err => {
      console.error('AI API error:', err);
      this.loading = false;
    });
  }
}
