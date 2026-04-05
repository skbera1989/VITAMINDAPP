import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { documentOutline, warningOutline, bulbOutline, analyticsOutline } from 'ionicons/icons';
import { CommonHeaderComponent } from 'src/app/components/common-header/common-header.component';
import { HttpService } from 'src/app/services/http-service';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.page.html',
  styleUrls: ['./insights.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, CommonHeaderComponent]
})
export class InsightsPage implements OnInit {
  aiSummary = "";
  healthData: any = {};
  userInput = '';
  loading = false;

  messages: any[] = [
    { role: 'bot', text: 'Hello! Ask me about your health 😊' }
  ];

  constructor(private router: Router, private httpService: HttpService) {
    addIcons({
      'analytics-outline': analyticsOutline,
      'document-text-outline': documentOutline,
      'warning-outline': warningOutline,
      'bulb-outline': bulbOutline
    });
  }

  ngOnInit(): void {
    
  }

  ionViewWillEnter() {
    this.aiSummary = localStorage.getItem('aiSummary') || "";
    if(this.aiSummary ){
      this.healthData = JSON.parse(this.aiSummary);
    }
  }
  
  async sendMessage() {
    if (!this.userInput.trim()) return;

    const userMsg = this.userInput;

    // Add user message
    this.messages.push({ role: 'user', text: userMsg });

    this.userInput = '';
    this.loading = true;

    this.httpService.chatAPI(userMsg).then(botReply => {
      console.log('AI API response:', botReply);
      // Remove simulated response
      this.messages = this.messages.filter(msg => msg.text !== 'Simulated AI response');
      console.log('Messages after removing simulated response:', this.messages);
      // Add actual AI response
      this.messages.push({ role: 'bot', text: botReply });
      this.loading = false;
    }).catch(err => {
      console.error('AI API error:', err);
      this.loading = false;
    });
  }
  
  goToVitals(){ 
    this.router.navigate(['/tabs/tab2']);
  }
}
