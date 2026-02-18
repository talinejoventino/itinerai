import type { Itinerary } from "@/types";

export const birminghamMockData: Itinerary = {
  city: "Birmingham",
  country: "Reino Unido",
  highlights: [
    "Bullring & Grand Central",
    "Biblioteca de Birmingham",
    "Museu e Galeria de Arte de Birmingham",
    "Cadbury World",
    "Canal de Gas Street Basin",
  ],
  itineraries: {
    "1day": {
      title: "O Melhor de Birmingham em 1 Dia",
      days: [
        {
          day: 1,
          theme: "Destaques Essenciais",
          activities: [
            {
              time: "09:00",
              title: "Bullring & Grand Central",
              description:
                "Comece o dia visitando o famoso centro comercial, que combina arquitetura moderna com uma variedade de lojas.",
              tip: "Chegue cedo para evitar multidões, lojas abrem às 10h. Estacionamento disponível no local.",
              emoji: "🛍️",
            },
            {
              time: "11:00",
              title: "Museu e Galeria de Arte de Birmingham",
              description:
                "Explore um dos principais museus do Reino Unido, com uma coleção notável de arte pré-rafaelita.",
              tip: "Acesso gratuito. Fica a 10 minutos a pé do Bullring.",
              emoji: "🎨",
            },
            {
              time: "13:00",
              title: "Biblioteca de Birmingham",
              description:
                "Visite uma das bibliotecas públicas mais importantes da Europa. Não perca o terraço do jardim superior.",
              tip: "Entrada gratuita. Aproveite para tirar fotos do horizonte de Birmingham.",
              emoji: "📚",
            },
            {
              time: "15:00",
              title: "Cadbury World",
              description:
                "Explore o mundo do chocolate na fábrica da Cadbury e aprenda sobre sua história deliciosa.",
              tip: "Entrada paga, recomenda-se reservar com antecedência. Ônibus disponíveis do centro.",
              emoji: "🍫",
            },
            {
              time: "18:00",
              title: "Canal de Gas Street Basin",
              description:
                "Termine o dia com um passeio relaxante ao longo dos canais, repletos de bares e restaurantes.",
              tip: "Ideal para um jantar descontraído. Os passeios de barco estão disponíveis.",
              emoji: "🚤",
            },
          ],
        },
      ],
    },
    "3days": {
      title: "Explorando Birmingham em 3 Dias",
      days: [
        {
          day: 1,
          theme: "Centro Cultural e Histórico",
          activities: [
            {
              time: "09:00",
              title: "Museu e Galeria de Arte de Birmingham",
              description: "Explore as ricas coleções de arte e história social.",
              tip: "Entrada gratuita. Considere uma visita guiada pelo museu.",
              emoji: "🖼️",
            },
            {
              time: "11:30",
              title: "Catedral de Birmingham",
              description:
                "Visite a catedral anglicana do século XVIII com belos vitrais.",
              tip: "Apenas a 5 minutos a pé do museu.",
              emoji: "⛪",
            },
            {
              time: "13:00",
              title: "Biblioteca de Birmingham",
              description:
                "Explore a arquitetura impressionante e os jardins nos terraços.",
              tip: "Não perca a vista panorâmica do terraço superior.",
              emoji: "🌿",
            },
            {
              time: "15:00",
              title: "Galeria Ikon",
              description:
                "Descubra o melhor da arte contemporânea nesta renomada galeria.",
              tip: "Entrada gratuita, doações sugeridas. Café no local.",
              emoji: "🖌️",
            },
          ],
        },
        {
          day: 2,
          theme: "Descobrindo Birmingham Industrial",
          activities: [
            {
              time: "09:30",
              title: "Black Country Living Museum",
              description:
                "Mergulhe na história industrial com edifícios autênticos e atores em trajes de época.",
              tip: "Requer bilhete de entrada. Pode-se chegar de carro ou ônibus.",
              emoji: "🏭",
            },
            {
              time: "13:00",
              title: "Canal de Gas Street Basin",
              description:
                "Passeie pelos históricos canais que foram vitais durante a Revolução Industrial.",
              tip: "Próximo a locais para almoço e café.",
              emoji: "🚶‍♂️",
            },
            {
              time: "15:30",
              title: "Thinktank - Museu de Ciência",
              description: "Explore as exposições interativas e o planetário.",
              tip: "Bilhete pago, ideal para famílias. Fica a 10 minutos da estação New Street.",
              emoji: "🔭",
            },
          ],
        },
        {
          day: 3,
          theme: "Diversão e Entretenimento",
          activities: [
            {
              time: "10:00",
              title: "Cadbury World",
              description:
                "Aprenda sobre a produção de chocolate e desfrute de amostras deliciosas.",
              tip: "Compras de ingressos antecipadas recomendadas. Fácil acesso de transporte público.",
              emoji: "🍬",
            },
            {
              time: "13:00",
              title: "Barber Institute of Fine Arts",
              description:
                "Admire a coleção de arte europeia em um belo entorno.",
              tip: "Entrada gratuita. Localizado na Universidade de Birmingham.",
              emoji: "🏛️",
            },
            {
              time: "15:30",
              title: "Shopping no Mailbox",
              description:
                "Desfrute de compras de luxo e restaurantes à beira do canal.",
              tip: "Boa opção para um jantar ou café à tarde.",
              emoji: "🛒",
            },
            {
              time: "18:00",
              title: "China Town",
              description:
                "Explore a área vibrante com restaurantes e lojas autênticas chinesas.",
              tip: "Experimente a culinária local autêntica para o jantar.",
              emoji: "🥡",
            },
          ],
        },
      ],
    },
    "7days": {
      title: "Imersão Completa em Birmingham: 7 Dias",
      days: [
        {
          day: 1,
          theme: "Introdução à Cultura Local",
          activities: [
            {
              time: "09:30",
              title: "Museu e Galeria de Arte de Birmingham",
              description:
                "Um mergulho inicial nas coleções de arte e história social de Birmingham.",
              tip: "Passeio gratuito com áudio-guia disponível.",
              emoji: "🎨",
            },
            {
              time: "12:00",
              title: "Almoço no local histórico de St. Paul's Square",
              description:
                "Desfrute de restaurantes e cafés em um ambiente histórico.",
              tip: "Reserve uma mesa para garantir lugar em locais mais movimentados.",
              emoji: "🍽️",
            },
            {
              time: "14:30",
              title: "Pen Museum",
              description:
                "Descubra a história da fabricação de canetas em Birmingham.",
              tip: "Menos conhecido, mas fascinante. Verifique os horários de funcionamento.",
              emoji: "✒️",
            },
          ],
        },
      ],
    },
  },
};
