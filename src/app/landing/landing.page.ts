import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonLabel, IonInput, IonItem, IonText, IonDatetime, IonSelect, IonButton, IonSelectOption, IonList, IonSpinner, IonModal, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { fitnessOutline, medkitOutline } from 'ionicons/icons';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
  imports: [IonLabel, IonInput, IonItem, IonText, IonDatetime, IonSelect, IonButton, IonSelectOption, FormsModule, ReactiveFormsModule, CommonModule, IonModal, IonIcon]
})
export class LandingPage {
  landingForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router) {
    addIcons({
      'fitness-outline': fitnessOutline
    });

    this.landingForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      age: ['', Validators.required],
      gender: ['', Validators.required],
    });
  }

  get name() {
    return this.landingForm.get('name');
  }

  get dob() {
    return this.landingForm.get('dob');
  }

  get gender() {
    return this.landingForm.get('gender');
  }

  onSubmit() {
    if (this.landingForm.valid) {
      console.log('Form Submitted!', this.landingForm.value);
      localStorage.setItem('userInfo', JSON.stringify(this.landingForm.value));
      this.router.navigate(['/tabs']);
    } else {
      console.log('Form is invalid');
    }
  }

  closeModal() {
    const modal = document.querySelector('ion-modal');
    modal?.dismiss();
  }
}