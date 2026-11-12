// Données de démonstration — TOUT EST FICTIF.
// Remplacez la ville, les activités, les prix et les durées avant un usage réel.
window.ESCAPADE_DATA = {
  destination: "Port-Lumière (exemple)",
  categories: {
    culture: "Culture",
    "plein-air": "Plein air",
    repas: "Repas",
    detente: "Détente",
    creatif: "Atelier créatif"
  },
  activites: [
    { id: "musee-phares", titre: "Musée des Phares imaginaires", categorie: "culture",
      description: "Une visite guidée de maquettes et de lanternes anciennes, idéale par temps gris.",
      duree: 90, cout: 12, motif: "#e8b86a", icone: "🏛️" },
    { id: "sentier-falaises", titre: "Sentier des falaises", categorie: "plein-air",
      description: "Une boucle balisée avec vue sur la baie ; prévoyez de bonnes chaussures.",
      duree: 150, cout: 0, motif: "#9cc7a4", icone: "🥾" },
    { id: "marche-port", titre: "Déjeuner au marché du port", categorie: "repas",
      description: "Goûtez des spécialités locales (fictives !) auprès des petits stands.",
      duree: 60, cout: 18, motif: "#f0a07a", icone: "🍤" },
    { id: "bains-chauds", titre: "Bains chauds de la Marée", categorie: "detente",
      description: "Une pause bien-être de deux heures avec bassins et tisanes.",
      duree: 120, cout: 35, motif: "#9fc3e0", icone: "♨️" },
    { id: "atelier-ceramique", titre: "Atelier de céramique", categorie: "creatif",
      description: "Modelez un petit bol avec une artisane ; la pièce est à récupérer plus tard.",
      duree: 180, cout: 45, motif: "#d6a6c9", icone: "🏺" },
    { id: "balade-quais", titre: "Balade sur les quais", categorie: "plein-air",
      description: "Une flânerie libre entre bateaux colorés et ruelles pavées.",
      duree: 60, cout: 0, motif: "#a8d3c9", icone: "⛵" },
    { id: "cafe-lecture", titre: "Café-librairie du Phare", categorie: "detente",
      description: "Un chocolat chaud et un livre dans un fauteuil près de la fenêtre.",
      duree: 60, cout: 8, motif: "#e3c7a0", icone: "☕" },
    { id: "diner-criee", titre: "Dîner « criée du soir »", categorie: "repas",
      description: "Un menu de poissons du jour dans une salle animée face au port.",
      duree: 120, cout: 55, motif: "#f2b48f", icone: "🐟" }
  ],
  checklist: [
    "Chaussures confortables",
    "Bouteille d’eau",
    "Billets ou réservations",
    "Chargeur de téléphone",
    "Vêtement de pluie"
  ]
};
