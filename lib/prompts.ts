import type { City } from "@/types";

export function buildItineraryPrompt(city: City): string {
  return `Você é um especialista em turismo com conhecimento atualizado sobre destinos ao redor do mundo.

Crie roteiros de turismo detalhados e práticos para **${city.name}, ${city.country}**.

Retorne APENAS um JSON válido, sem texto adicional, com esta estrutura exata:

{
  "city": "${city.name}",
  "country": "${city.country}",
  "highlights": [
    "Nome do ponto turístico 1",
    "Nome do ponto turístico 2",
    "Nome do ponto turístico 3",
    "Nome do ponto turístico 4",
    "Nome do ponto turístico 5"
  ],
  "itineraries": {
    "1day": {
      "title": "O Melhor de ${city.name} em 1 Dia",
      "days": [
        {
          "day": 1,
          "theme": "Destaques Essenciais",
          "activities": [
            {
              "time": "09:00",
              "title": "Nome do local",
              "description": "Descrição do que fazer e ver neste local.",
              "tip": "Dica prática (preço, horário, como chegar, reserva, etc.)",
              "emoji": "🏛️"
            }
          ]
        }
      ]
    },
    "3days": {
      "title": "Explorando ${city.name} em 3 Dias",
      "days": [
        {
          "day": 1,
          "theme": "Tema do dia 1",
          "activities": [...]
        },
        {
          "day": 2,
          "theme": "Tema do dia 2",
          "activities": [...]
        },
        {
          "day": 3,
          "theme": "Tema do dia 3",
          "activities": [...]
        }
      ]
    },
    "7days": {
      "title": "Imersão Completa em ${city.name}: 7 Dias",
      "days": [
        {
          "day": 1,
          "theme": "Tema do dia 1",
          "activities": [...]
        }
      ]
    }
  }
}

Regras importantes:
- Cada roteiro de 1 dia deve ter 5 a 6 atividades
- Cada dia no roteiro de 3 dias deve ter 4 a 5 atividades
- Cada dia no roteiro de 7 dias deve ter 3 a 4 atividades
- Inclua emojis relevantes para cada atividade
- Horários devem ser realistas e considerar tempo de deslocamento
- Dicas devem ser práticas e úteis (preços aproximados, dicas de transporte, etc.)
- Use linguagem em Português do Brasil
- Retorne APENAS o JSON, sem markdown, sem texto antes ou depois`;
}
