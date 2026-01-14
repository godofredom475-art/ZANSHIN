
import { Component, signal, inject, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../services/gemini.service';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  time: Date;
}

@Component({
  selector: 'app-support-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Chat Toggle Button -->
    <button 
      (click)="toggleChat()"
      class="fixed bottom-6 right-6 z-50 p-4 bg-white hover:bg-gray-200 text-black rounded-full shadow-lg shadow-white/10 transition-transform hover:scale-110 flex items-center justify-center group animate-pulse-glow"
      aria-label="Abrir Suporte"
    >
      @if (!isOpen()) {
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      } @else {
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      }
    </button>

    <!-- Chat Window -->
    @if (isOpen()) {
      <div class="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-float">
        <!-- Header -->
        <div class="bg-neutral-800 border-b border-neutral-700 p-4 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-white animate-pulse"></div>
            <h3 class="font-bold text-white">Suporte Zanshin IA</h3>
          </div>
          <span class="text-xs text-neutral-400 bg-black/20 px-2 py-1 rounded border border-neutral-700">Online</span>
        </div>

        <!-- Messages Area -->
        <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-black" #scrollContainer>
          @for (msg of messages(); track msg.time) {
            <div [class]="'flex ' + (msg.sender === 'user' ? 'justify-end' : 'justify-start')">
              <div [class]="'max-w-[85%] rounded-2xl p-3 text-sm border ' + (msg.sender === 'user' ? 'bg-neutral-100 text-black border-white rounded-br-none' : 'bg-neutral-900 text-neutral-200 border-neutral-700 rounded-bl-none')">
                {{ msg.text }}
                <div [class]="'text-[10px] opacity-50 mt-1 text-right ' + (msg.sender === 'user' ? 'text-black' : 'text-gray-400')">{{ msg.time | date:'HH:mm' }}</div>
              </div>
            </div>
          }
          
          @if (isLoading()) {
            <div class="flex justify-start">
              <div class="bg-neutral-900 border border-neutral-700 rounded-2xl rounded-bl-none p-3 flex gap-1 items-center">
                <div class="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.1s]"></div>
                <div class="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></div>
              </div>
            </div>
          }
        </div>

        <!-- Input Area -->
        <div class="p-3 bg-neutral-900 border-t border-neutral-700">
          <form (submit)="sendMessage($event)" class="flex gap-2">
            <input 
              type="text" 
              [(ngModel)]="currentMessage" 
              name="message" 
              placeholder="Digite aqui..." 
              class="flex-1 bg-black border border-neutral-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors placeholder-neutral-500"
              [disabled]="isLoading()"
            >
            <button 
              type="submit" 
              [disabled]="!currentMessage || isLoading()"
              class="bg-white hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-black p-2 rounded-xl transition-colors font-bold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </form>
        </div>
      </div>
    }
  `
})
export class SupportChatComponent implements AfterViewChecked {
  private geminiService = inject(GeminiService);
  
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  isOpen = signal(false);
  isLoading = signal(false);
  messages = signal<Message[]>([
    { text: "Olá! Sou o ZanshinBot. Precisa de ajuda com o download?", sender: 'bot', time: new Date() }
  ]);
  currentMessage = '';

  toggleChat() {
    this.isOpen.update(v => !v);
  }

  async sendMessage(event: Event) {
    event.preventDefault();
    if (!this.currentMessage.trim() || this.isLoading()) return;

    const userMsg = this.currentMessage;
    this.currentMessage = '';
    
    // Add user message
    this.messages.update(msgs => [...msgs, { text: userMsg, sender: 'user', time: new Date() }]);
    this.isLoading.set(true);

    // Call API
    const response = await this.geminiService.sendMessage(userMsg);

    // Add bot response
    this.messages.update(msgs => [...msgs, { text: response, sender: 'bot', time: new Date() }]);
    this.isLoading.set(false);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    if (this.scrollContainer) {
      try {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      } catch(err) { }
    }
  }
}
