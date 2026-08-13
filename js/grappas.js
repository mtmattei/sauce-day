// ============================================================================
//  The shortlist — bottles in the running for this year.
//
//  Reference data, not crew data: it is a catalogue of products, so it lives
//  in the repo rather than in Supabase. Everything here was read off the SAQ
//  product pages on 2026-08-05. Prices move; RECHECK BEFORE ANYONE DRIVES OUT.
//
//  Image paths are RELATIVE on purpose. GitHub Pages serves this site from
//  /sauce-day/, so a leading slash would 404 there while working locally.
// ============================================================================

export const SHORTLIST = [
  {
    id: "11003338",
    name: "Bassano Del Grappa",
    range: "Grappa Classica",
    producer: "Poli Distillerie",
    region: "Veneto, Italy",
    size: "500 ml",
    abv: 40,
    price: 32.75,
    colour: "clear",
    photo: "img/grappa/poli-bassano-classica.png",
    url: "https://www.saq.com/en/11003338",
    note: "The house pour. Unaged, straight out of the still."
  },
  {
    id: "13860034",
    name: "Bassano 24 Carati",
    range: "Grappa 24 Carati",
    producer: "Poli Distillerie",
    region: "Veneto, Italy",
    size: "500 ml",
    abv: 40,
    price: 41.50,
    colour: "amber",
    photo: "img/grappa/poli-bassano-24-carati.png",
    url: "https://www.saq.com/en/13860034",
    note: "Barrel time, hence the colour. In store only — not sold online."
  },
  {
    id: "540955",
    name: "Torcolato",
    range: "Jacopo Poli",
    producer: "Poli Distillerie",
    region: "Veneto, Italy",
    size: "500 ml",
    abv: 40,
    price: 107.50,
    colour: "clear",
    photo: "img/grappa/jacopo-poli-torcolato.png",
    url: "https://www.saq.com/en/540955",
    note: "The long-necked flask. Dearest on the list and still short of the record. In store only."
  },
  {
    id: "11532571",
    name: "Cleopatra Moscato Oro",
    range: "Poli Cleopatra",
    producer: "Poli Distillerie",
    region: "Veneto, Italy",
    size: "700 ml",
    abv: 40,
    price: 91.75,
    colour: "gold",
    photo: "img/grappa/poli-cleopatra-moscato-oro.png",
    url: "https://www.saq.com/en/11532571",
    note: "Squat decanter, 700 ml. Best litre-for-litre value of the five."
  },
  {
    id: "597534",
    name: "Monovitigno di Prosecco",
    range: "De Negri",
    producer: "F. De Negri & C. SAS",
    region: "Veneto, Italy",
    size: "700 ml",
    abv: 40,
    price: 42.25,
    colour: "clear",
    photo: "img/grappa/de-negri-monovitigno-prosecco.png",
    url: "https://www.saq.com/en/597534",
    note: "The only non-Poli on the list."
  },
  {
    id: "15082133",
    name: "Barrique 1898",
    range: "Poli Barrique",
    producer: "Poli Distillerie",
    region: "Veneto, Italy",
    size: "700 ml",
    abv: 55,
    price: 144.75,
    colour: "amber",
    photo: "img/grappa/poli-barrique-1898.png",
    url: "https://www.saq.com/en/15082133",
    note: "The first bottle on this list that clears the record. 55%, so it is "
        + "a sipper and not a pourer. Online stock was down to one on 11 Aug."
  }
];

// The suggestion for this year's empty slot. Read off the SAQ on 2026-08-13:
// the only in-stock grappas clearing the 1898's $144.75 were this, the Villa
// de Varda Sherry Cask ($164.50, non-Poli), the Cornelissen MunJebel ($228)
// and the Distillato di Magma ($503.50, for the year the crew loses its mind).
// This one keeps the Poli line going and clears the record by $19.25.
export const SUGGESTION = {
  id: "11435211",
  name: "Barili di Sassicaia",
  range: "Jacopo Poli",
  producer: "Poli Distillerie",
  region: "Veneto, Italy",
  size: "500 ml",
  abv: 40,
  price: 164.00,
  url: "https://www.saq.com/en/11435211",
  note: "Aged in Sassicaia barriques, 5/5 on the SAQ. In store only — check stock before David drives out."
};

/** Price per litre — the five bottles are not all the same size. */
export const perLitre = g => g.price / (parseInt(g.size, 10) / 1000);

/** Everything the shortlist says about itself, against the standing record. */
export function shortlistVerdict(record) {
  const clears = SHORTLIST.filter(g => g.price > record);
  const best = SHORTLIST.reduce((a, g) => (g.price > a.price ? g : a), SHORTLIST[0]);
  return {
    clears,
    anyClears: clears.length > 0,
    best,
    gap: record - best.price,          // positive means the whole list falls short
    count: SHORTLIST.length,
    cheapest: SHORTLIST.reduce((a, g) => (g.price < a.price ? g : a), SHORTLIST[0])
  };
}
