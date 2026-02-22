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
              lat: 52.4775,
              lng: -1.8934,
            },
            {
              time: "11:00",
              title: "Birmingham Museum and Art Gallery",
              description:
                "Explore one of the UK's leading museums, with a notable Pre-Raphaelite art collection.",
              tip: "Free admission. 10-minute walk from Bullring.",
              emoji: "🎨",
              lat: 52.4800,
              lng: -1.9027,
            },
            {
              time: "13:00",
              title: "Library of Birmingham",
              description:
                "Visit one of Europe's most important public libraries. Don't miss the rooftop garden terrace.",
              tip: "Free entry. Great opportunity to take photos of Birmingham's skyline.",
              emoji: "📚",
              lat: 52.4793,
              lng: -1.9114,
            },
            {
              time: "15:00",
              title: "Cadbury World",
              description:
                "Explore the world of chocolate at the Cadbury factory and learn about its delicious history.",
              tip: "Paid entry, booking in advance recommended. Buses available from the city center.",
              emoji: "🍫",
              lat: 52.4320,
              lng: -1.9199,
            },
            {
              time: "18:00",
              title: "Gas Street Basin Canal",
              description:
                "End the day with a relaxing walk along the canals, filled with bars and restaurants.",
              tip: "Perfect for a casual dinner. Boat tours are available.",
              emoji: "🚤",
              lat: 52.4766,
              lng: -1.9083,
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
              lat: 52.4800,
              lng: -1.9027,
            },
            {
              time: "11:30",
              title: "Birmingham Cathedral",
              description:
                "Visit the 18th-century Anglican cathedral with beautiful stained glass.",
              tip: "Just a 5-minute walk from the museum.",
              emoji: "⛪",
              lat: 52.4817,
              lng: -1.8989,
            },
            {
              time: "13:00",
              title: "Library of Birmingham",
              description:
                "Explore the impressive architecture and terraced gardens.",
              tip: "Don't miss the panoramic view from the rooftop terrace.",
              emoji: "🌿",
              lat: 52.4793,
              lng: -1.9114,
            },
            {
              time: "15:00",
              title: "Ikon Gallery",
              description:
                "Discover the best of contemporary art at this renowned gallery.",
              tip: "Free entry, donations suggested. Café on site.",
              emoji: "🖌️",
              lat: 52.4776,
              lng: -1.9118,
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
              lat: 52.5111,
              lng: -2.0811,
            },
            {
              time: "13:00",
              title: "Gas Street Basin Canal",
              description:
                "Stroll along the historic canals that were vital during the Industrial Revolution.",
              tip: "Near lunch and café spots.",
              emoji: "🚶‍♂️",
              lat: 52.4766,
              lng: -1.9083,
            },
            {
              time: "15:30",
              title: "Thinktank - Science Museum",
              description: "Explore the interactive exhibits and planetarium.",
              tip: "Paid ticket, ideal for families. 10 minutes from New Street station.",
              emoji: "🔭",
              lat: 52.4786,
              lng: -1.8907,
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
              lat: 52.4320,
              lng: -1.9199,
            },
            {
              time: "13:00",
              title: "Barber Institute of Fine Arts",
              description:
                "Admire the European art collection in a beautiful setting.",
              tip: "Free admission. Located at the University of Birmingham.",
              emoji: "🏛️",
              lat: 52.4505,
              lng: -1.9302,
            },
            {
              time: "15:30",
              title: "Shopping at The Mailbox",
              description:
                "Enjoy luxury shopping and canalside restaurants.",
              tip: "Great option for dinner or afternoon tea.",
              emoji: "🛒",
              lat: 52.4750,
              lng: -1.9058,
            },
            {
              time: "18:00",
              title: "China Town",
              description:
                "Explore the vibrant area with authentic Chinese restaurants and shops.",
              tip: "Try the authentic local cuisine for dinner.",
              emoji: "🥡",
              lat: 52.4773,
              lng: -1.8975,
            },
          ],
        },
      ],
    },
    "5days": {
      title: "Complete Birmingham Immersion: 5 Days",
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
              lat: 52.4800,
              lng: -1.9027,
            },
            {
              time: "12:00",
              title: "Lunch at historic St. Paul's Square",
              description:
                "Enjoy restaurants and cafés in a historic setting.",
              tip: "Book a table to secure a spot at busier venues.",
              emoji: "🍽️",
              lat: 52.4847,
              lng: -1.9055,
            },
            {
              time: "14:30",
              title: "Pen Museum",
              description:
                "Discover the history of pen manufacturing in Birmingham.",
              tip: "Less well-known but fascinating. Check opening hours.",
              emoji: "✒️",
              lat: 52.4870,
              lng: -1.9095,
            },
          ],
        },
        {
          day: 2,
          theme: "Industrial Heritage",
          activities: [
            {
              time: "09:30",
              title: "Black Country Living Museum",
              description:
                "Step back in time at this open-air museum depicting life in the Black Country during the Industrial Revolution.",
              tip: "Ticket required. Wear comfortable shoes — lots of walking.",
              emoji: "🏭",
              lat: 52.5111,
              lng: -2.0811,
            },
            {
              time: "13:00",
              title: "Gas Street Basin Canal",
              description:
                "Stroll along the historic canals, heart of Birmingham's industrial past.",
              tip: "Multiple café options nearby. Boat tours available.",
              emoji: "🚤",
              lat: 52.4766,
              lng: -1.9083,
            },
            {
              time: "15:30",
              title: "Jewellery Quarter",
              description:
                "Explore the world-famous Jewellery Quarter, home to hundreds of workshops and unique boutiques.",
              tip: "Museum of the Jewellery Quarter offers free entry.",
              emoji: "💎",
              lat: 52.4870,
              lng: -1.9095,
            },
          ],
        },
        {
          day: 3,
          theme: "Arts and Contemporary Culture",
          activities: [
            {
              time: "10:00",
              title: "Library of Birmingham",
              description:
                "Explore one of Europe's most impressive public libraries and enjoy the rooftop garden terrace.",
              tip: "Free entry. Don't miss the panoramic view from the top floor.",
              emoji: "📚",
              lat: 52.4793,
              lng: -1.9114,
            },
            {
              time: "12:30",
              title: "Ikon Gallery",
              description:
                "Discover contemporary art from leading international and local artists.",
              tip: "Free admission. Lovely café on the ground floor.",
              emoji: "🖌️",
              lat: 52.4776,
              lng: -1.9118,
            },
            {
              time: "15:00",
              title: "Brindleyplace",
              description:
                "Enjoy a leisurely walk around the vibrant canalside district filled with restaurants and bars.",
              tip: "Perfect spot for an afternoon coffee or early dinner.",
              emoji: "☕",
              lat: 52.4776,
              lng: -1.9120,
            },
          ],
        },
        {
          day: 4,
          theme: "Day Trip & Nature",
          activities: [
            {
              time: "09:00",
              title: "Cadbury World",
              description:
                "Immerse yourself in the world of chocolate at the historic Cadbury factory in Bournville.",
              tip: "Book tickets online in advance. Easy bus access from city centre.",
              emoji: "🍫",
              lat: 52.4320,
              lng: -1.9199,
            },
            {
              time: "12:30",
              title: "Bournville Village",
              description:
                "Stroll through this charming model village built for Cadbury workers.",
              tip: "Great for a picnic — pick up food from local bakeries.",
              emoji: "🌳",
              lat: 52.4300,
              lng: -1.9280,
            },
            {
              time: "15:00",
              title: "Cannon Hill Park",
              description:
                "Relax in one of Birmingham's most beloved parks, home to the MAC arts centre.",
              tip: "The MAC has free exhibitions and a great café.",
              emoji: "🌿",
              lat: 52.4490,
              lng: -1.9018,
            },
          ],
        },
        {
          day: 5,
          theme: "Food, Shopping & Farewell",
          activities: [
            {
              time: "10:00",
              title: "Bullring & Grand Central",
              description:
                "Explore Birmingham's iconic shopping hub with hundreds of stores.",
              tip: "The Selfridges building is architecturally stunning — worth seeing even if you don't shop.",
              emoji: "🛍️",
              lat: 52.4775,
              lng: -1.8934,
            },
            {
              time: "13:00",
              title: "Digbeth Street Food",
              description:
                "Head to the trendy Digbeth area for some of Birmingham's best street food vendors.",
              tip: "The Custard Factory area nearby is great for independent shops.",
              emoji: "🌮",
              lat: 52.4738,
              lng: -1.8891,
            },
            {
              time: "16:00",
              title: "Birmingham Cathedral",
              description:
                "End your visit at the beautiful 18th-century Anglican cathedral in the city centre.",
              tip: "Free entry. A peaceful spot to reflect before heading home.",
              emoji: "⛪",
              lat: 52.4817,
              lng: -1.8989,
            },
          ],
        },
      ],
    },
  },
};
