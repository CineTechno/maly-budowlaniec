export interface PricingItem {
  id: number;
  service: string;
  price: string;
  unit: string;
  category: string;
}

export const pricingItems: PricingItem[] = [
  // Naprawy i usługi podstawowe
  {
    id: 1,
    service: "Podstawowe usługi",
    price: "90 zł",
    unit: "za godzinę",
    category: "podstawowe",
  },
  {
    id: 2,
    service: "Naprawa płyt gipsowo-kartonowych",
    price: "200 zł",
    unit: "za m2",
    category: "podstawowe",
  },
  {
    id: 3,
    service: "Montaż oświetlenia",
    price: "150 zł",
    unit: "za sztukę",
    category: "podstawowe",
  },
  {
    id: 4,
    service: "Malowanie wnętrz",
    price: "30 zł",
    unit: "za m²",
    category: "podstawowe",
  },
  {
    id: 5,
    service: "Montaż szafek",
    price: "250 zł",
    unit: "za szafkę",
    category: "podstawowe",
  },
  {
    id: 6,
    service: "Naprawa zamków",
    price: "120 zł",
    unit: "za sztukę",
    category: "podstawowe",
  },
  {
    id: 7,
    service: "Montaż karniszy",
    price: "80 zł",
    unit: "za sztukę",
    category: "podstawowe",
  },
  {
    id: 8,
    service: "Wymiana gniazdek/włączników",
    price: "60 zł",
    unit: "za sztukę",
    category: "podstawowe",
  },

  // Kuchnie i łazienki
  {
    id: 9,
    service: "Remont kuchni (mała)",
    price: "10 000 zł",
    unit: "10m2",
    category: "kuchnie-lazienki",
  },
  {
    id: 10,
    service: "Remont kuchni (duża)",
    price: "20 000 zł",
    unit: "20m2",
    category: "kuchnie-lazienki",
  },
  {
    id: 11,
    service: "Remont łazienki (mała)",
    price: "8 000 zł",
    unit: "6m2",
    category: "kuchnie-lazienki",
  },
  {
    id: 12,
    service: "Remont łazienki (duża)",
    price: "15 000 zł",
    unit: "12m2",
    category: "kuchnie-lazienki",
  },
  {
    id: 13,
    service: "Montaż kabiny prysznicowej",
    price: "500 zł",
    unit: "2m2",
    category: "kuchnie-lazienki",
  },
  {
    id: 14,
    service: "Montaż wanny",
    price: "450 zł",
    unit: "1",
    category: "kuchnie-lazienki",
  },
  {
    id: 15,
    service: "Montaż umywalki",
    price: "300 zł",
    unit: "1",
    category: "kuchnie-lazienki",
  },
  {
    id: 16,
    service: "Montaż toalety",
    price: "350 zł",
    unit: "1",
    category: "kuchnie-lazienki",
  },

  // Prace wykończeniowe
  {
    id: 17,
    service: "Układanie płytek",
    price: "120 zł",
    unit: "za m²",
    category: "wykonczeniowe",
  },
  {
    id: 18,
    service: "Wymiana drzwi wewnętrznych",
    price: "350 zł",
    unit: "za sztukę",
    category: "wykonczeniowe",
  },
  {
    id: 19,
    service: "Wymiana okien",
    price: "800 zł",
    unit: "za m²",
    category: "wykonczeniowe",
  },
  {
    id: 20,
    service: "Montaż paneli podłogowych",
    price: "60 zł",
    unit: "za m²",
    category: "wykonczeniowe",
  },
  {
    id: 21,
    service: "Układanie parkietu",
    price: "120 zł",
    unit: "za m²",
    category: "wykonczeniowe",
  },
  {
    id: 22,
    service: "Tynkowanie",
    price: "70 zł",
    unit: "za m²",
    category: "wykonczeniowe",
  },
  {
    id: 23,
    service: "Szpachlowanie",
    price: "40 zł",
    unit: "za m²",
    category: "wykonczeniowe",
  },
  {
    id: 24,
    service: "Tapetowanie",
    price: "50 zł",
    unit: "za m²",
    category: "wykonczeniowe",
  },

  // Instalacje
  {
    id: 25,
    service: "Instalacja elektryczna",
    price: "100 zł",
    unit: "m2",
    category: "instalacje",
  },
  {
    id: 26,
    service: "Instalacja hydrauliczna",
    price: "150 zł",
    unit: "m2",
    category: "instalacje",
  },
  {
    id: 27,
    service: "Montaż ogrzewania podłogowego",
    price: "200 zł",
    unit: "za m²",
    category: "instalacje",
  },
  {
    id: 28,
    service: "Wymiana grzejników",
    price: "300 zł",
    unit: "za sztukę",
    category: "instalacje",
  },
  {
    id: 29,
    service: "Instalacja odkurzacza centralnego",
    price: "za sztukę",
    unit: "od",
    category: "instalacje",
  },
  {
    id: 30,
    service: "Instalacja klimatyzacji",
    price: "3 500 zł",
    unit: "1",
    category: "instalacje",
  },

  // Prace zewnętrzne
  {
    id: 31,
    service: "Montaż ogrodzenia",
    price: "200 zł",
    unit: "za metr",
    category: "zewnetrzne",
  },
  {
    id: 32,
    service: "Budowa tarasu",
    price: "400 zł",
    unit: "za m²",
    category: "zewnetrzne",
  },
  {
    id: 33,
    service: "Układanie kostki brukowej",
    price: "150 zł",
    unit: "za m²",
    category: "zewnetrzne",
  },
  {
    id: 34,
    service: "Montaż rynien",
    price: "90 zł",
    unit: "za metr",
    category: "zewnetrzne",
  },
  {
    id: 35,
    service: "Montaż drzwi zewnętrznych",
    price: "700 zł",
    unit: "za sztukę",
    category: "zewnetrzne",
  },
  {
    id: 36,
    service: "Instalacja oświetlenia ogrodowego",
    price: "150 zł",
    unit: "za sztukę",
    category: "zewnetrzne",
  },
];
