const fs = require('fs');
const path = require('path');

// Lire le cards.json existant
const cardsPath = path.join(__dirname, 'public/data/cards.json');
const existingCards = JSON.parse(fs.readFileSync(cardsPath, 'utf8'));

// Grouper les cartes existantes par série
const cardsBySeries = {};
existingCards.forEach(card => {
  const seriesId = card.seriesId;
  if (!cardsBySeries[seriesId]) {
    cardsBySeries[seriesId] = [];
  }
  cardsBySeries[seriesId].push(card);
});

// Fonction pour scanner les images d'une série
function scanSeriesImages(seriesName) {
  const seriesPath = path.join(__dirname, 'public/images/cards', seriesName);
  const altsPath = path.join(seriesPath, 'ALTs');

  const cards = [];
  const cardMap = new Map(); // Pour éviter les doublons et gérer les alts

  // Scanner les images principales
  const mainFiles = fs.readdirSync(seriesPath).filter(f => f.endsWith('.jpg') && !f.startsWith('.'));

  mainFiles.forEach(file => {
    const match = file.match(/^(OP\d+)-(\d+)\.jpg$/i);
    if (match) {
      const cardNumber = `${match[1]}-${match[2]}`;
      const id = cardNumber.toLowerCase();

      cards.push({
        id: id,
        cardNumber: cardNumber,
        seriesId: seriesName.toLowerCase(),
        image: `/images/cards/${seriesName}/${file}`,
        status: "wanted",
        duplicates: 0
      });

      cardMap.set(match[2], true); // Marquer ce numéro comme existant
    }
  });

  // Scanner les images alternatives si le dossier existe
  if (fs.existsSync(altsPath)) {
    const altFiles = fs.readdirSync(altsPath).filter(f => f.endsWith('.jpg') && !f.startsWith('.'));

    altFiles.forEach(file => {
      const match = file.match(/^(OP\d+)-(\d+)\(([^)]+)\)\.jpg$/i);
      if (match) {
        const cardNumber = `${match[1]}-${match[2]}`;
        const variant = match[3];
        const id = `${cardNumber.toLowerCase()}-${variant.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

        cards.push({
          id: id,
          cardNumber: cardNumber,
          seriesId: seriesName.toLowerCase(),
          image: `/images/cards/${seriesName}/ALTs/${file}`,
          status: "wanted",
          duplicates: 0
        });
      }
    });
  }

  return cards.sort((a, b) => {
    const numA = parseInt(a.cardNumber.split('-')[1]);
    const numB = parseInt(b.cardNumber.split('-')[1]);
    if (numA !== numB) return numA - numB;
    return a.id.localeCompare(b.id);
  });
}

// Générer les fichiers pour toutes les séries
const seriesToGenerate = ['OP10', 'OP11', 'OP12', 'OP13', 'OP14'];

seriesToGenerate.forEach(seriesName => {
  const seriesId = seriesName.toLowerCase();

  // Si la série existe déjà dans cards.json, utiliser ces données
  let seriesCards = cardsBySeries[seriesId];

  // Sinon, scanner les images
  if (!seriesCards || seriesCards.length === 0) {
    console.log(`Generating ${seriesName} from images...`);
    seriesCards = scanSeriesImages(seriesName);
  } else {
    console.log(`Using existing data for ${seriesName}`);
  }

  // Écrire le fichier JSON
  const outputPath = path.join(__dirname, 'public/data/series', `${seriesId}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(seriesCards, null, 2), 'utf8');
  console.log(`✓ Created ${outputPath} (${seriesCards.length} cards)`);
});

console.log('\n✓ All series files generated successfully!');
