export interface PricingItem {

  service: string;
  price: string;
  unit: string;
  category: string;
}

export const pricingItems: PricingItem[] = [
  // Naprawy i usługi podstawowe
  {
    service: "Podstawowe usługi",
    price: "90 zł",
    unit: "za godzinę",
    category: "podstawowe",
  },
  {
    service: "Naprawa płyt gipsowo-kartonowych",
    price: "200 zł",
    unit: "za m2",
    category: "podstawowe",
  },
  {

    service: "Montaż oświetlenia",
    price: "150 zł",
    unit: "za sztukę",
    category: "podstawowe",
  },
  {

    service: "Malowanie wnętrz",
    price: "30 zł",
    unit: "za m²",
    category: "podstawowe",
  },
  {

    service: "Montaż szafek",
    price: "250 zł",
    unit: "za szafkę",
    category: "podstawowe",
  },
  {

    service: "Naprawa zamków",
    price: "120 zł",
    unit: "za sztukę",
    category: "podstawowe",
  },
  {

    service: "Montaż karniszy",
    price: "80 zł",
    unit: "za sztukę",
    category: "podstawowe",
  },
  {

    service: "Wymiana gniazdek/włączników",
    price: "60 zł",
    unit: "za sztukę",
    category: "podstawowe",
  },

  // Kuchnie i łazienki
  {

    service: "Remont kuchni (mała)",
    price: "10 000 zł",
    unit: "10m2",
    category: "kuchnie-lazienki",
  },
  {

    service: "Remont kuchni (duża)",
    price: "20 000 zł",
    unit: "20m2",
    category: "kuchnie-lazienki",
  },
  {

    service: "Remont łazienki (mała)",
    price: "8 000 zł",
    unit: "6m2",
    category: "kuchnie-lazienki",
  },
  {

    service: "Remont łazienki (duża)",
    price: "15 000 zł",
    unit: "12m2",
    category: "kuchnie-lazienki",
  },
  {

    service: "Montaż kabiny prysznicowej",
    price: "500 zł",
    unit: "2m2",
    category: "kuchnie-lazienki",
  },
  {

    service: "Montaż wanny",
    price: "450 zł",
    unit: "1",
    category: "kuchnie-lazienki",
  },
  {

    service: "Montaż umywalki",
    price: "300 zł",
    unit: "1",
    category: "kuchnie-lazienki",
  },
  {

    service: "Montaż toalety",
    price: "350 zł",
    unit: "1",
    category: "kuchnie-lazienki",
  },

  // Prace wykończeniowe
  {
    service: "Układanie płytek",
    price: "120 zł",
    unit: "za m²",
    category: "wykonczeniowe",
  },
  {

    service: "Wymiana drzwi wewnętrznych",
    price: "350 zł",
    unit: "za sztukę",
    category: "wykonczeniowe",
  },
  {

    service: "Wymiana okien",
    price: "800 zł",
    unit: "za m²",
    category: "wykonczeniowe",
  },
  {

    service: "Montaż paneli podłogowych",
    price: "60 zł",
    unit: "za m²",
    category: "wykonczeniowe",
  },
  {

    service: "Układanie parkietu",
    price: "120 zł",
    unit: "za m²",
    category: "wykonczeniowe",
  },
  {

    service: "Tynkowanie",
    price: "70 zł",
    unit: "za m²",
    category: "wykonczeniowe",
  },
  {

    service: "Szpachlowanie",
    price: "40 zł",
    unit: "za m²",
    category: "wykonczeniowe",
  },
  {

    service: "Tapetowanie",
    price: "50 zł",
    unit: "za m²",
    category: "wykonczeniowe",
  },

  // Instalacje
  {

    service: "Instalacja elektryczna",
    price: "100 zł",
    unit: "m2",
    category: "instalacje",
  },
  {

    service: "Instalacja hydrauliczna",
    price: "150 zł",
    unit: "m2",
    category: "instalacje",
  },
  {

    service: "Montaż ogrzewania podłogowego",
    price: "200 zł",
    unit: "za m²",
    category: "instalacje",
  },
  {

    service: "Wymiana grzejników",
    price: "300 zł",
    unit: "za sztukę",
    category: "instalacje",
  },
  {

    service: "Instalacja odkurzacza centralnego",
    price: "za sztukę",
    unit: "od",
    category: "instalacje",
  },
  {

    service: "Instalacja klimatyzacji",
    price: "3 500 zł",
    unit: "1",
    category: "instalacje",
  },

  // Prace zewnętrzne
  {

    service: "Montaż ogrodzenia",
    price: "200 zł",
    unit: "za metr",
    category: "zewnetrzne",
  },
  {

    service: "Budowa tarasu",
    price: "400 zł",
    unit: "za m²",
    category: "zewnetrzne",
  },
  {

    service: "Układanie kostki brukowej",
    price: "150 zł",
    unit: "za m²",
    category: "zewnetrzne",
  },
  {

    service: "Montaż rynien",
    price: "90 zł",
    unit: "za metr",
    category: "zewnetrzne",
  },
  {

    service: "Montaż drzwi zewnętrznych",
    price: "700 zł",
    unit: "za sztukę",
    category: "zewnetrzne",
  },
  {

    service: "Instalacja oświetlenia ogrodowego",
    price: "150 zł",
    unit: "za sztukę",
    category: "zewnetrzne",
  },
];
