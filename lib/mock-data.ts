import type { Itinerary } from "@/types";

export const birminghamMockData: Itinerary = {
  city: "Birmingham",
  country: "United Kingdom",
  highlights: [
    "Bullring & Grand Central",
    "Library of Birmingham",
    "Birmingham Museum and Art Gallery",
    "Cadbury World",
    "Gas Street Basin Canal",
  ],
  itineraries: {
    "1day": {
      title: "Best of Birmingham in 1 Day",
      days: [
        {
          day: 1,
          theme: "Essential Highlights",
          activities: [
            {
              time: "09:00",
              title: "Bullring & Grand Central",
              description:
                "Start your day visiting the famous shopping center, which combines modern architecture with a variety of shops.",
              tip: "Arrive early to avoid crowds, shops open at 10am. Parking available on site.",
              emoji: "🛍️",
            },
            {
              time: "11:00",
              title: "Birmingham Museum and Art Gallery",
              description:
                "Explore one of the UK's leading museums, with a notable Pre-Raphaelite art collection.",
              tip: "Free admission. 10-minute walk from Bullring.",
              emoji: "🎨",
            },
            {
              time: "13:00",
              title: "Library of Birmingham",
              description:
                "Visit one of Europe's most important public libraries. Don't miss the rooftop garden terrace.",
              tip: "Free entry. Great opportunity to take photos of Birmingham's skyline.",
              emoji: "📚",
            },
            {
              time: "15:00",
              title: "Cadbury World",
              description:
                "Explore the world of chocolate at the Cadbury factory and learn about its delicious history.",
              tip: "Paid entry, booking in advance recommended. Buses available from the city center.",
              emoji: "🍫",
            },
            {
              time: "18:00",
              title: "Gas Street Basin Canal",
              description:
                "End the day with a relaxing walk along the canals, filled with bars and restaurants.",
              tip: "Perfect for a casual dinner. Boat tours are available.",
              emoji: "🚤",
            },
          ],
        },
      ],
    },
    "3days": {
      title: "Exploring Birmingham in 3 Days",
      days: [
        {
          day: 1,
          theme: "Cultural and Historical Center",
          activities: [
            {
              time: "09:00",
              title: "Birmingham Museum and Art Gallery",
              description: "Explore the rich collections of art and social history.",
              tip: "Free admission. Consider a guided tour of the museum.",
              emoji: "🖼️",
            },
            {
              time: "11:30",
              title: "Birmingham Cathedral",
              description:
                "Visit the 18th-century Anglican cathedral with beautiful stained glass.",
              tip: "Just a 5-minute walk from the museum.",
              emoji: "⛪",
            },
            {
              time: "13:00",
              title: "Library of Birmingham",
              description:
                "Explore the impressive architecture and terraced gardens.",
              tip: "Don't miss the panoramic view from the rooftop terrace.",
              emoji: "🌿",
            },
            {
              time: "15:00",
              title: "Ikon Gallery",
              description:
                "Discover the best of contemporary art at this renowned gallery.",
              tip: "Free entry, donations suggested. Café on site.",
              emoji: "🖌️",
            },
          ],
        },
        {
          day: 2,
          theme: "Discovering Industrial Birmingham",
          activities: [
            {
              time: "09:30",
              title: "Black Country Living Museum",
              description:
                "Immerse yourself in industrial history with authentic buildings and costumed actors.",
              tip: "Entry ticket required. Accessible by car or bus.",
              emoji: "🏭",
            },
            {
              time: "13:00",
              title: "Gas Street Basin Canal",
              description:
                "Stroll along the historic canals that were vital during the Industrial Revolution.",
              tip: "Near lunch and café spots.",
              emoji: "🚶‍♂️",
            },
            {
              time: "15:30",
              title: "Thinktank - Science Museum",
              description: "Explore the interactive exhibits and planetarium.",
              tip: "Paid ticket, ideal for families. 10 minutes from New Street station.",
              emoji: "🔭",
            },
          ],
        },
        {
          day: 3,
          theme: "Fun and Entertainment",
          activities: [
            {
              time: "10:00",
              title: "Cadbury World",
              description:
                "Learn about chocolate production and enjoy delicious samples.",
              tip: "Advanced ticket purchase recommended. Easy public transport access.",
              emoji: "🍬",
            },
            {
              time: "13:00",
              title: "Barber Institute of Fine Arts",
              description:
                "Admire the European art collection in a beautiful setting.",
              tip: "Free admission. Located at the University of Birmingham.",
              emoji: "🏛️",
            },
            {
              time: "15:30",
              title: "Shopping at The Mailbox",
              description:
                "Enjoy luxury shopping and canalside restaurants.",
              tip: "Great option for dinner or afternoon tea.",
              emoji: "🛒",
            },
            {
              time: "18:00",
              title: "China Town",
              description:
                "Explore the vibrant area with authentic Chinese restaurants and shops.",
              tip: "Try the authentic local cuisine for dinner.",
              emoji: "🥡",
            },
          ],
        },
      ],
    },
    "7days": {
      title: "Complete Birmingham Immersion: 7 Days",
      days: [
        {
          day: 1,
          theme: "Introduction to Local Culture",
          activities: [
            {
              time: "09:30",
              title: "Birmingham Museum and Art Gallery",
              description:
                "An initial dive into Birmingham's art and social history collections.",
              tip: "Free tour with audio guide available.",
              emoji: "🎨",
            },
            {
              time: "12:00",
              title: "Lunch at historic St. Paul's Square",
              description:
                "Enjoy restaurants and cafés in a historic setting.",
              tip: "Book a table to secure a spot at busier venues.",
              emoji: "🍽️",
            },
            {
              time: "14:30",
              title: "Pen Museum",
              description:
                "Discover the history of pen manufacturing in Birmingham.",
              tip: "Less well-known but fascinating. Check opening hours.",
              emoji: "✒️",
            },
          ],
        },
      ],
    },
  },
};
