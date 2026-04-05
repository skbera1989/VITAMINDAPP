import { Injectable } from '@angular/core';
import { ENDPOINTS } from '../endpoints';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  async initiateJWT() {
    const res = await fetch(ENDPOINTS.AUTH.init);
    const data = await res.json();
    localStorage.setItem('token', data.token);
  }

  async chatAPI(prompt: string): Promise<string> {
    const token = localStorage.getItem('token');
    // if (!token) {
    //   await this.initiateJWT();
    // }
    const response = await fetch(ENDPOINTS.CHAT.chat, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message: prompt })
    });

    const data = await response.json();
    console.log('AI API raw response:', data);
    if (data.error === "Invalid or expired token") {
      console.warn('Token expired, fetching new token...');
      await this.initiateJWT();
      return this.chatAPI(prompt); // Retry after getting new token
    }
    return data.reply;
  }
}
