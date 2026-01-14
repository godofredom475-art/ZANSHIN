
import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env['API_KEY']! });
  }

  async sendMessage(message: string): Promise<string> {
    try {
      const result = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: message,
        config: {
          systemInstruction: `Você é o "ZanshinBot", o assistente oficial de suporte técnico do Zanshin Executor. 
      Sua missão é ajudar jogadores de Roblox a baixar, instalar e usar o Zanshin (que contém o Delta) exclusivamente para Android.
      
      Informações Chave:
      - O Zanshin é exclusivo para Celular (Android).
      - Versão PC: Não está disponível no momento.
      - Versão iOS: Não está disponível.
      - Instalação: Baixe o APK no botão "Baixar Agora", instale, obtenha a Key no link gerado e divirta-se.
      - Se o usuário perguntar por PC ou iOS, diga educadamente que o Zanshin foca na melhor experiência mobile atualmente.
      
      Diretrizes de resposta:
      - Responda sempre em Português do Brasil.
      - Seja breve, técnico mas amigável (linguagem gamer).
      - Use emojis ocasionalmente.
      - Não invente links, diga "use o botão de download acima".`,
          thinkingConfig: { thinkingBudget: 0 } // Low latency for chat
        }
      });
      return result.text || 'Desculpe, tive um erro ao processar sua resposta. Tente novamente.';
    } catch (error) {
      console.error('Gemini Error:', error);
      return 'Erro de conexão com o servidor de IA. Verifique sua chave API ou internet.';
    }
  }
}
