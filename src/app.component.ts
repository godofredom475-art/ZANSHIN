
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupportChatComponent } from './components/support-chat.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SupportChatComponent, NgOptimizedImage, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
})
export class AppComponent {
  currentYear = new Date().getFullYear();
  
  // 'home' = Landing Page, 'bypass' = AdBlocker/LinkBypasser Tool
  view = signal<'home' | 'bypass'>('home');

  // Modal State
  activeModal = signal<'about' | 'privacy' | 'roadmap' | null>(null);

  // Bypasser State
  bypassUrl = signal('');
  bypassResult = signal('');
  isBypassing = signal(false);
  
  features = [
    {
      title: 'Execução 100% UNC',
      desc: 'Suporte completo para scripts complexos. Estabilidade total.',
      icon: 'zap'
    },
    {
      title: 'Sem Travamentos',
      desc: 'Otimizado para rodar liso em dispositivos Android modestos.',
      icon: 'shield'
    },
    {
      title: 'Interface Dark',
      desc: 'Design minimalista monocromático para menor cansaço visual.',
      icon: 'layout'
    },
    {
      title: 'Key Rápida',
      desc: 'Sistema de chaves simplificado para você jogar mais rápido.',
      icon: 'key'
    }
  ];

  downloads = [
    {
      platform: 'Android',
      version: 'v2.704 (Atualizado)',
      size: '145 MB',
      icon: 'android',
      primary: true,
      url: 'https://br.deltaexecutr.com.br/Delta-Executor-2026-2.704.apk'
    }
  ];

  faq = [
    {
      q: "O Zanshin é seguro?",
      a: "Sim. Nossa versão é verificada. O tema dark ajuda a identificar nossa marca oficial."
    },
    {
      q: "Funciona no PC?",
      a: "Atualmente, o foco é 100% na experiência mobile Android."
    }
  ];

  toggleView(viewName: 'home' | 'bypass') {
    this.view.set(viewName);
    window.scrollTo(0,0);
  }

  scrollToDownload() {
    if (this.view() !== 'home') {
      this.toggleView('home');
      setTimeout(() => {
        document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Modal Actions
  openModal(type: 'about' | 'privacy' | 'roadmap') {
    this.activeModal.set(type);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  closeModal() {
    this.activeModal.set(null);
    document.body.style.overflow = ''; // Restore scrolling
  }

  // Bypasser Logic (Simulation)
  runBypass() {
    if (!this.bypassUrl()) return;
    
    this.isBypassing.set(true);
    this.bypassResult.set('');

    setTimeout(() => {
      this.isBypassing.set(false);
      this.bypassResult.set(`Link Liberado: ${this.bypassUrl()}?bypass=success\n(Simulação: Em um app real, aqui estaria o link direto)`);
    }, 2000);
  }
}
