/* ===========================================================================
   SAUCE DAY — shared prototype data
   Real numbers, lifted from supabase/seed.sql (2020-2025 sheets + 2026 plan).
   Loaded as a classic script; everything hangs off window.SAUCE.

   The only invented figures are the eight 2026 expense rows in SAUCE.expenses,
   which exist so Settlement and the Dashboard have something to show. They are
   marked `demo:true` and are consistent with who is assigned what in the ledger.
   =========================================================================== */
(function (global) {
"use strict";

// ---------------------------------------------------------------- settings
const settings = {
  year: 2026, edition: 7, sauceDate: "2026-08-29", crewSize: 5,
  litresPerBushel: 14.0, bufferPct: 0.10,
  pricePerBushel: 25.00, jarPrice: 19.99, bandPrice: 8.79, lidPrice: 4.99,
  packSize: 12,
  tagline: "cut the bad"
};

const crew = [
  { name: "Matt",  role: "host · the gear",       admin: true  },
  { name: "David", role: "SAQ · hardware",        admin: false },
  { name: "Nate",  role: "market · bakery",       admin: false },
  { name: "Chris", role: "breakfast · grocery",   admin: false },
  { name: "Mike",  role: "focaccia",              admin: false }
];

// ---------------------------------------------------------------- ledger
// [name, kind, qty, budget, who, store, repeat, note]
const L = (c) => (a) => ({
  cat: c, name: a[0], kind: a[1], qty: a[2], budget: a[3],
  who: a[4], store: a[5], repeat: a[6], note: a[7] || null
});

const toolkit = [
  ["Table blanket","Owned","1",0,"Matt",null,"Yes"],
  ["Food mill","Owned","1",0,"Matt",null,"Yes","2025 note: consider a new mill"],
  ["Cauldrons","Owned","3",0,"Matt (2) / David (1) / Chris (2)",null,"Yes"],
  ["Mason jars","Owned",null,39.98,"David / Matt","Canadian Tire","Yes","Count comes from Yield & Jars"],
  ["Funnel (wide mouth)","Owned","1",0,"Matt",null,"Yes"],
  ["Cheesecloth","Need","4",0,"Matt","Market","No"],
  ["Ladle","Owned","1",0,"Matt",null,"Yes"],
  ["Cutting boards","Owned","5",0,"Matt",null,"Yes"],
  ["Knives","Owned","5",0,"BYOK / Matt",null,"Yes"],
  ["Kiddie pool","Owned","1",0,"Matt",null,"Yes"],
  ["Chairs","Owned","5",0,"David (4) / Matt (2)",null,"Yes"],
  ["Tables","Owned","2",0,"Matt (1) / Chris (1)",null,"Yes"],
  ["Rims","Need",null,0,"David / Matt","Canadian Tire","No","All new sets"],
  ["Buckets (Canadian Tire)","Owned","6",0,"David","Canadian Tire","Buy"],
  ["Lids","Need","2",14.97,"David","Canadian Tire","No","See Yield & Jars"],
  ["Burners","Owned","3",0,"David (2) / Matt (1)","Home Depot","Buy"],
  ["Propane","Refill","3",35.00,"Matt (2) / Mike / Chris",null,"Yes","Recurring every year"],
  ["Mason jar lifters","Owned","2",0,"Matt",null,"Yes"],
  ["Buckets (Home Depot)","Owned","7",0,"David / Matt","Home Depot","Yes"],
  ["Spider ladle","Owned",null,0,"Matt / Mike",null,"Yes"],
  ["Stainless deep dish pan","Owned",null,0,"Matt",null,"Yes"],
  ["Metal bowl","Owned",null,0,"Matt",null,"Yes"],
  ["Garbage bags","Owned",null,0,"Matt",null,"Yes"],
  ["Metal sponges","Owned",null,0,"Matt",null,"Yes"],
  ["Cleaning brush","Owned",null,0,"Matt",null,"Yes"],
  ["Aprons","Owned",null,0,"Matt",null,"Yes"],
  ["Napkins","Owned",null,0,"Matt",null,"Yes"],
  ["Cloth to strain water","Owned",null,0,"Matt","Amazon","Yes","David to check Amazon"],
  ["Dawn dish soap","Owned",null,0,"David",null,"Yes"],
  ["Scrub pads","Owned",null,0,"David",null,"Yes"],
  ["Barkeepers Friend","Owned",null,0,"David",null,"Yes"],
  ["Pop-up tent","Owned",null,0,"Matt",null,"Yes"],
  ["Strainer for sauce pot","Need","1",0,null,null,"Buy","Carried over from 2025 notes"],
  ["Speakers","Owned","1",0,"David",null,"Yes"]
].map(L("toolkit"));

const ingredients = [
  ["Bushels of tomatoes","Need","10",175.00,"Matt / David / Nate","Market","Yes","Budget links to Yield & Jars"],
  ["Basil","Need",null,0,"Matt / David / Nate","Market","Yes","Matt potentially has"],
  ["Parsley","Need",null,0,"Matt / David / Nate","Market","Yes","Matt potentially has"],
  ["Onions","Costco",null,0,"Matt / David / Nate","Costco","Yes"],
  ["Garlic","Costco",null,0,"Matt / David / Nate","Costco","Yes"],
  ["Carrots","Costco",null,0,"Matt / David / Nate","Costco","Yes"],
  ["Celery","Costco",null,0,"Matt / David / Nate","Costco","Yes"],
  ["Salt","Have",null,0,"Matt / David / Nate",null,"Yes"],
  ["Sugar","Have",null,0,"Matt / David / Nate",null,"Yes"]
].map(L("ingredients"));

const food = [
  ["McDonald's breakfast combos","Breakfast run","5",0,"Chris","McDonald's","Yes"],
  ["Grappa","The annual bottle","1",0,"David","SAQ","Yes","Must beat last year"],
  ["Orange juice","For mimosas",null,0,null,"Costco","Yes"],
  ["Biscotti","Get the day off the tomatoes",null,0,"Nate","Bakery","Yes"],
  ["Bread","For fontina bites",null,0,"Nate","Bakery","Yes"],
  ["Marinated olives",null,null,0,"Nate","Market","Yes"],
  ["Mozzarella",null,null,0,null,"Market","Yes"],
  ["Roasted peppers",null,null,0,null,"Market","Yes"],
  ["Canned tuna",null,null,0,"Chris","Grocery","Yes"],
  ["Cannellini beans",null,null,0,"Chris","Grocery","Yes"],
  ["Good olive oil","The nice bottle",null,0,"Nate","Market","Yes"],
  ["Italian lemonade","Siciliana?","20",0,null,"Grocery","Yes"],
  ["Arancini","From Little Italy",null,0,null,"Little Italy","Yes"],
  ["Lupini",null,"10",0,null,"Market","Yes"],
  ["Prosecco",null,null,0,"David","SAQ","Yes"],
  ["Fresh pasta","For dinner service",null,0,null,"Market","Yes","The $31 line left out of the 2025 stated total"],
  ["Meatballs","Veal, pork and beef",null,0,null,"Inman","Yes"],
  ["Cold cuts","Prosciutto, mortadella, capicollo",null,0,null,"Market","Yes"],
  ["Insalata caprese","To list out",null,0,null,"Market","Yes"],
  ["Rustic garlic bread",null,null,0,null,"Costco","Yes"],
  ["Hard cheese",null,null,0,null,"Market","Yes"],
  ["Bruschetta","To list ingredients",null,0,null,"Market","Yes"],
  ["Vodka",null,null,0,"David","SAQ","Yes"],
  ["Kahlua",null,null,0,"David","SAQ","Yes"],
  ["Wine","2 white, 1 red?","4",0,"David","SAQ","Yes"],
  ["Sausages",null,null,0,"David","Butcher","Yes"],
  ["Espresso","Grind first",null,0,"David","Roastery","Yes","2025 note: grind before the day"],
  ["Dried sausages",null,null,0,null,"Butcher","Yes"],
  ["Grapes",null,null,0,"David","Market","Yes"],
  ["Focaccia","Mike to make",null,0,"Mike","Homemade","Yes"],
  ["Sparkling water",null,null,0,null,"Costco","Yes"],
  ["Beer",null,null,0,null,"Depanneur","Yes"]
].map(L("food"));

const items = toolkit.concat(ingredients, food);
items.forEach((it, i) => { it.id = i; it.actual = 0; it.obtained = false; });

// ---------------------------------------------------------------- expenses
// Demo rows so Settlement has something to settle. Consistent with assignments.
const expenses = [
  { item: "Bushels of tomatoes",         cat: "ingredients", by: "Matt",  amount: 175.00, store: "Market",         demo: true },
  { item: "Mason jars",                  cat: "toolkit",     by: "David", amount:  39.98, store: "Canadian Tire",  demo: true },
  { item: "Lids",                        cat: "toolkit",     by: "David", amount:  14.97, store: "Canadian Tire",  demo: true },
  { item: "Propane",                     cat: "toolkit",     by: "Matt",  amount:  35.00, store: "Refill",         demo: true },
  { item: "McDonald's breakfast combos", cat: "food",        by: "Chris", amount:  46.20, store: "McDonald's",     demo: true },
  { item: "Biscotti",                    cat: "food",        by: "Nate",  amount:  16.00, store: "Bakery",         demo: true },
  { item: "Bread",                       cat: "food",        by: "Nate",  amount:  12.40, store: "Bakery",         demo: true },
  { item: "Grappa",                      cat: "food",        by: "David", amount: 142.75, store: "SAQ",            demo: true },
  { item: "Prosecco",                    cat: "food",        by: "David", amount:  38.00, store: "SAQ",            demo: true },
  { item: "Wine",                        cat: "food",        by: "David", amount:  88.00, store: "SAQ",            demo: true },
  { item: "Focaccia",                    cat: "food",        by: "Mike",  amount:  18.60, store: "Homemade",       demo: true }
];
// fold actuals back onto the ledger
expenses.forEach(e => {
  const it = items.find(x => x.name === e.item);
  if (it) { it.actual += e.amount; it.obtained = true; }
});

// ---------------------------------------------------------------- bushels & jars
const bushels = [
  { person: "Matt", count: 1 }, { person: "David", count: 1 }, { person: "Nate", count: 1 },
  { person: "Chris", count: 1 }, { person: "Mike", count: 1 },
  { person: "Maria", count: 2 }, { person: "Other guest", count: 0 }
];
const jarStock = [
  { person: "Matt",  jars: 67, bands: 74, lids: 48 },
  { person: "David", jars: 24, bands: 10, lids: 0  },
  { person: "Nate",  jars: 0,  bands: 0,  lids: 0  },
  { person: "Chris", jars: 0,  bands: 0,  lids: 0  },
  { person: "Mike",  jars: 0,  bands: 0,  lids: 0  }
];

// ---------------------------------------------------------------- run sheet
const runsheet = [
  ["PREP","Fri PM","Pick up bushels from the market","Nate","David","Truck, buckets","Get there early, best tomatoes go first"],
  ["PREP","Fri PM","Wash and sterilise every jar","Matt","All","Jars, dishwasher, Barkeepers Friend","Count as you go"],
  ["PREP","Fri PM","Set up tables, tent, chairs, kiddie pool","Matt","Chris","Tables, tent, chairs, pool",null],
  ["PREP","Fri PM","Fill and check propane tanks","Matt","Mike","3 tanks","Refill beats buying new"],
  ["PREP","Fri PM","Chill all beer, wine, prosecco, water","David",null,"Coolers, ice",null],
  ["PREP","Fri PM","Grind the espresso","David",null,"Grinder","2025 lesson: do this the night before"],
  ["DAY","06:30","Crew arrives, espresso on","David","All","Espresso, moka",null],
  ["DAY","07:00","McDonald's run","Chris",null,"Cash","5 breakfast combos"],
  ["DAY","07:30","Burners lit, wash water on","Matt","Mike","3 burners, cauldrons, propane",null],
  ["DAY","08:00","Wash tomatoes","All","All","Kiddie pool, buckets, strainer","Two-stage rinse"],
  ["DAY","09:00","First cauldron on — blanch and cook","Nate","David","Cauldrons, spider ladle",null],
  ["DAY","10:30","First mill run","Chris","Matt","Food mill, deep dish pan","Watch for skins clogging"],
  ["DAY","11:00","Jars into hot water, lids ready","Matt",null,"Jar lifters, cauldron",null],
  ["DAY","12:00","LUNCH — antipasti spread","Nate","All","Tables, boards","See Menu"],
  ["DAY","13:00","Milling continues, bottling line starts","All","All","Funnel, ladle, mill",null],
  ["DAY","15:00","Fill and cap jars","All","All","Funnel, rims, lids, bands","Wipe every rim before capping"],
  ["DAY","16:30","Water bath — seal the jars","Matt","David","Cauldron, jar lifters","Listen for the pops"],
  ["DAY","18:00","Break — the grappa toast","David","All","The bottle","See Grappa Hall of Fame"],
  ["DAY","19:00","DINNER — pasta with this year's sauce","Mike","All","Pots, fresh pasta","See Menu"],
  ["DAY","21:00","Clean-up — cauldrons, burners, tables","All","All","Dawn, scrub pads, sponges",null],
  ["DAY","22:00","Count jars, log fallen soldiers, divide the sauce","Matt","All","Notebook","Enter the count on History"],
  ["DAY","22:30","Settle up","Matt","All","This workbook","Settlement says who pays whom"]
].map((r, i) => ({
  n: i + 1, section: r[0], time: r[1], activity: r[2],
  lead: r[3], crew: r[4], kit: r[5], note: r[6], done: false
}));

// ---------------------------------------------------------------- menu
const menu = [
  ["Breakfast","McDonald's combos","Chris","McDonald's","5",null],
  ["Breakfast","Espresso","David","Roastery","—","Ground the night before"],
  ["Breakfast","Biscotti","Nate","Bakery","—","To get the day off the tomatoes"],
  ["Breakfast","Orange juice / mimosas",null,"Costco","—",null],
  ["Snack","Marinated olives","Nate","Market","—",null],
  ["Snack","Lupini",null,"Market","10",null],
  ["Snack","Fontina bites on bread","Nate","Bakery","—",null],
  ["Lunch","Cold cuts — prosciutto, mortadella, capicollo",null,"Market","—",null],
  ["Lunch","Insalata caprese",null,"Market","—","Mozzarella, basil, good olive oil"],
  ["Lunch","Bruschetta",null,"Market","—","List the ingredients"],
  ["Lunch","Roasted peppers",null,"Market","—",null],
  ["Lunch","Canned tuna and cannellini beans","Chris","Grocery","—",null],
  ["Lunch","Hard cheese",null,"Market","—",null],
  ["Lunch","Rustic garlic bread",null,"Costco","—",null],
  ["Lunch","Focaccia","Mike","Homemade","—","Mike makes it"],
  ["Lunch","Arancini",null,"Little Italy","—",null],
  ["Dinner","Fresh pasta with this year's sauce",null,"Market","—","The whole point"],
  ["Dinner","Meatballs — veal, pork and beef",null,"Inman","—",null],
  ["Dinner","Sausages","David","Butcher","—",null],
  ["Dinner","Dried sausages",null,"Butcher","—",null],
  ["Dinner","Grapes","David","Market","—",null],
  ["Drinks","Grappa — the annual bottle","David","SAQ","1","Must beat last year"],
  ["Drinks","Wine — 2 white, 1 red","David","SAQ","4",null],
  ["Drinks","Prosecco","David","SAQ","—",null],
  ["Drinks","Beer",null,"Depanneur","—",null],
  ["Drinks","Vodka and Kahlua","David","SAQ","—","Espresso martinis after dinner"],
  ["Drinks","Italian lemonade",null,"Grocery","20","Siciliana?"],
  ["Drinks","Sparkling water",null,"Costco","—",null]
].map((m, i) => ({
  n: i + 1, service: m[0], dish: m[1], who: m[2], source: m[3], qty: m[4], note: m[5],
  claimed: !!m[2]
}));

// ---------------------------------------------------------------- grappa
// `shape` picks one of four drawn bottle silhouettes so the shelf reads as a
// shelf rather than seven clones. `photo` is null until a real shot is dropped
// in; every view falls back to the drawn bottle, so nothing is ever a grey box.
const grappa = [
  { year: 2020, price: null,   by: null,    shape: 0, bottle: null, producer: null, region: null,
    photo: null, note: "No record" },
  { year: 2021, price: 0,      by: null,    shape: 1, bottle: null, producer: null, region: null,
    photo: null, note: "No grappa line on the 2021 sheet" },
  { year: 2022, price: 80.00,  by: "David", shape: 2, bottle: null, producer: null, region: null,
    photo: null, note: "Bottle not named" },
  { year: 2023, price: 0,      by: null,    shape: 0, bottle: null, producer: null, region: null,
    photo: null, note: "No grappa recorded" },
  { year: 2024, price: 82.25,  by: "David", shape: 3, bottle: null, producer: null, region: null,
    photo: null, note: "Bottle not named" },
  { year: 2025, price: 135.00, by: "David", shape: 1, bottle: null, producer: null, region: null,
    photo: null, note: "SAQ 11849106 — the record", link: "https://www.saq.com/en/11849106" },
  { year: 2026, price: 142.75, by: "David", shape: 2, bottle: null, producer: null, region: null,
    photo: null, note: "Logged. Beats 2025." }
];

// ---------------------------------------------------------------- photobook
// One spread a year. `src` stays null until a real photograph is dropped in;
// the caption and the frame are real now, so the book has a shape before it
// has pictures. Captions come from the record, not from imagination.
const photobook = [
  { year: 2020, ed: 1, title: "The first one",
    plates: [ { cap: "78 litres. The only number that survived.", src: null, w: 3, h: 2 },
              { cap: "No sheet was kept.", src: null, w: 2, h: 2 } ] },
  { year: 2021, ed: 2, title: "Sauce Boss",
    plates: [ { cap: "Seven bushels in, sixty litres out. A bad tomato year.", src: null, w: 3, h: 2 },
              { cap: "6 September. The latest the day has ever run.", src: null, w: 2, h: 3 },
              { cap: "First year anyone wrote the money down.", src: null, w: 2, h: 2 } ] },
  { year: 2022, ed: 3, title: "The food year begins",
    plates: [ { cap: "Food passes $350 for the first time.", src: null, w: 2, h: 2 },
              { cap: "First grappa on the record: $80.", src: null, w: 2, h: 3 } ] },
  { year: 2023, ed: 4, title: "No bottle",
    plates: [ { cap: "The only year since 2022 with no grappa at all.", src: null, w: 3, h: 2 },
              { cap: "Ingredients hit $322, the highest they have been.", src: null, w: 2, h: 2 } ] },
  { year: 2024, ed: 5, title: "The burners arrive",
    plates: [ { cap: "Three Martin R65s. Toolkit jumps to $527.55.", src: null, w: 3, h: 2 },
              { cap: "Cauldrons, bought once, used every year since.", src: null, w: 2, h: 2 },
              { cap: "The gear year. Nothing this big since.", src: null, w: 2, h: 3 } ] },
  { year: 2025, ed: 6, title: "One hundred and thirty-five dollars",
    plates: [ { cap: "The bottle that set the record.", src: null, w: 2, h: 3 },
              { cap: "30 August. Food came in at $543.58.", src: null, w: 3, h: 2 },
              { cap: "The $31 pasta line nobody added up.", src: null, w: 2, h: 2 },
              { cap: "Seven bushels, same as 2021.", src: null, w: 2, h: 2 } ] },
  { year: 2026, ed: 7, title: "The seventh", live: true,
    plates: [ { cap: "29 August. Nothing photographed yet.", src: null, w: 3, h: 2 },
              { cap: "Waiting on the day.", src: null, w: 2, h: 2 } ] }
];

// ---------------------------------------------------------------- history
const history = [
  { year: 2020, ed: 1, date: null,         toolkit: null,   ing: null,   food: null,   crew: 5, bushels: null, litres: 78,  jars: null, grappa: null,  note: "No sheet. Litres from the 'Year 1 = 78 L' note in the 2025 workbook." },
  { year: 2021, ed: 2, date: "2021-09-06", toolkit: 294.04, ing: 230.30, food: 101.20, crew: 5, bushels: 7,    litres: 60,  jars: null, grappa: 0,     note: "Rebuilt from the Sauce Boss 2021 sheet." },
  { year: 2022, ed: 3, date: null,         toolkit: 257.00, ing: 250.00, food: 350.94, crew: 5, bushels: null, litres: null,jars: null, grappa: 80.00, note: "From the 2022 column of the 2025 workbook." },
  { year: 2023, ed: 4, date: null,         toolkit: 294.35, ing: 322.00, food: 129.42, crew: 5, bushels: null, litres: null,jars: null, grappa: 0,     note: "No grappa recorded." },
  { year: 2024, ed: 5, date: null,         toolkit: 527.55, ing: 307.00, food: 209.30, crew: 5, bushels: null, litres: null,jars: null, grappa: 82.25, note: "Big toolkit year — burners and cauldrons." },
  { year: 2025, ed: 6, date: "2025-08-30", toolkit: 242.34, ing: 250.00, food: 543.58, crew: 5, bushels: 7,    litres: null,jars: null, grappa: 135.00,note: "The $31 fresh-pasta line was left out of the stated food total." }
];

// =========================================================== derivations
const CATS = [
  { key: "toolkit",     label: "Sauce Toolkit",     short: "Toolkit" },
  { key: "ingredients", label: "Sauce Ingredients", short: "Ingredients" },
  { key: "food",        label: "Food & Drinks",     short: "Food" }
];

function budgetByCat() {
  const o = { toolkit: 0, ingredients: 0, food: 0 };
  items.forEach(i => { o[i.cat] += i.budget || 0; });
  return o;
}
function actualByCat() {
  const o = { toolkit: 0, ingredients: 0, food: 0 };
  expenses.forEach(e => { o[e.cat] += e.amount; });
  return o;
}
const sum = o => Object.values(o).reduce((a, b) => a + b, 0);

function paidByPerson() {
  const o = {}; crew.forEach(c => { o[c.name] = 0; });
  expenses.forEach(e => { o[e.by] = (o[e.by] || 0) + e.amount; });
  return o;
}

/** Even split, then the smallest proportional set of transfers that clears it. */
function settlement() {
  const paid = paidByPerson();
  const names = Object.keys(paid);
  const total = names.reduce((a, n) => a + paid[n], 0);
  const share = total / names.length;
  const net = names.map(n => ({ name: n, paid: paid[n], share, net: paid[n] - share }));
  const credits = net.filter(p => p.net > 0.005);
  const debts = net.filter(p => p.net < -0.005);
  const totalCredit = credits.reduce((a, p) => a + p.net, 0) || 1;
  const transfers = [];
  debts.forEach(d => credits.forEach(c => {
    const amt = -d.net * (c.net / totalCredit);
    if (amt > 0.005) transfers.push({ from: d.name, to: c.name, amount: amt });
  }));
  return {
    net, total, share, transfers,
    balanced: Math.abs(net.reduce((a, p) => a + p.net, 0)) < 0.01
  };
}

const totalBushels = () => bushels.reduce((a, b) => a + b.count, 0);
const onHand = () => jarStock.reduce((a, j) => ({
  jars: a.jars + j.jars, bands: a.bands + j.bands, lids: a.lids + j.lids
}), { jars: 0, bands: 0, lids: 0 });

/** The 2025 cascade: jar packs ship bands, band packs ship lids. */
function yieldPlan(lpb) {
  lpb = lpb == null ? settings.litresPerBushel : lpb;
  const P = settings.packSize;
  const b = totalBushels();
  const litres = b * lpb;
  const jarsRequired = Math.ceil(litres * (1 + settings.bufferPct));
  const have = onHand();

  const jarsToBuy = Math.max(0, jarsRequired - have.jars);
  const jarPacks = Math.ceil(jarsToBuy / P);
  const bandsToBuy = Math.max(0, jarsRequired - have.bands - jarPacks * P);
  const bandPacks = Math.ceil(bandsToBuy / P);
  const lidsToBuy = Math.max(0, jarsRequired - have.lids - jarPacks * P - bandPacks * P);
  const lidPacks = Math.ceil(lidsToBuy / P);

  const cost = jarPacks * settings.jarPrice + bandPacks * settings.bandPrice + lidPacks * settings.lidPrice;
  return {
    lpb, bushels: b, litres, jarsRequired, have,
    jarsToBuy, jarPacks, bandsToBuy, bandPacks, lidsToBuy, lidPacks,
    cost, bushelCost: b * settings.pricePerBushel,
    jarsFromPacks: jarPacks * P, bandsFromJarPacks: jarPacks * P, lidsFromBandPacks: bandPacks * P
  };
}
const scenarios = () => [
  { key: "low",  label: "Low",  lpb: 10, plan: yieldPlan(10) },
  { key: "mid",  label: "Mid",  lpb: 14, plan: yieldPlan(14) },
  { key: "high", label: "High", lpb: 18, plan: yieldPlan(18) }
];

/** Shopping list: anything with a store, or a kind that means "go get it". */
function shopping() {
  const buyable = items.filter(i => i.store || ["Need", "Buy", "Refill", "Costco"].includes(i.kind));
  const map = new Map();
  buyable.forEach(i => {
    const k = i.store || "No store yet";
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(i);
  });
  const stores = [...map.entries()].map(([store, list]) => ({
    store, list,
    estimate: list.reduce((a, i) => a + (i.budget || 0), 0),
    unpriced: list.filter(i => !i.budget).length,
    got: list.filter(i => i.obtained).length,
    buyers: [...new Set(list.map(i => (i.who || "unassigned").split(" / ")[0].split(" (")[0]))]
  })).sort((a, b) => b.estimate - a.estimate || a.store.localeCompare(b.store));
  return { stores, count: buyable.length, storeCount: stores.length };
}

function byBuyer() {
  const s = shopping();
  const o = {};
  s.stores.forEach(st => st.list.forEach(i => {
    const who = i.who ? i.who.split(" / ")[0].split(" (")[0] : "Unassigned";
    if (!o[who]) o[who] = { items: 0, estimate: 0, got: 0 };
    o[who].items++; o[who].estimate += i.budget || 0;
    if (i.obtained) o[who].got++;
  }));
  return Object.entries(o).map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.estimate - a.estimate || b.items - a.items);
}

function grappaRecord() {
  const past = grappa.filter(g => g.year !== settings.year && g.price).map(g => g.price);
  return past.length ? Math.max(...past) : 0;
}
function grappaVerdict() {
  const now = grappa.find(g => g.year === settings.year);
  const rec = grappaRecord();
  if (!now || now.price == null) return { state: "pending", record: rec, delta: null };
  return {
    state: now.price > rec ? "beaten" : now.price === rec ? "tied" : "short",
    record: rec, price: now.price, delta: now.price - rec, by: now.by
  };
}

/** Every bottle ever bought, tallest first, with a 0-1 height factor. */
function shelf() {
  const max = Math.max(...grappa.map(g => g.price || 0), 1);
  return grappa.map(g => ({
    ...g,
    factor: g.price ? g.price / max : 0,
    empty: !g.price,
    live: g.year === settings.year,
    record: g.price === grappaRecord() && !!g.price && g.year !== settings.year
  }));
}

function photoStats() {
  const plates = photobook.flatMap(y => y.plates);
  return {
    years: photobook.length,
    plates: plates.length,
    filled: plates.filter(p => p.src).length,
    empty: plates.filter(p => !p.src).length
  };
}

function daysToGo(from) {
  const target = new Date(settings.sauceDate + "T00:00:00");
  const t = from ? new Date(from) : new Date();
  t.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((target - t) / 86400000));
}

function readiness() {
  const s = shopping();
  const buyable = s.stores.flatMap(x => x.list);
  return {
    buy:  { done: buyable.filter(i => i.obtained).length, total: buyable.length, label: "bought" },
    menu: { done: menu.filter(m => m.claimed).length,     total: menu.length,   label: "claimed" },
    run:  { done: runsheet.filter(r => r.done).length,    total: runsheet.length, label: "stepped" },
    jars: { done: onHand().jars, total: yieldPlan().jarsRequired, label: "jars on hand" },
    priced: { done: items.filter(i => i.budget > 0).length, total: items.length, label: "priced" }
  };
}

/** History + the live year, with totals and per-man, for the charts. */
function series() {
  const a = actualByCat();
  const rows = history.map(h => ({ ...h, live: false }));
  rows.push({
    year: settings.year, ed: settings.edition, date: settings.sauceDate,
    toolkit: a.toolkit, ing: a.ingredients, food: a.food,
    crew: settings.crewSize, bushels: totalBushels(),
    litres: yieldPlan().litres, jars: null,
    grappa: grappa.find(g => g.year === settings.year)?.price ?? null,
    note: "In progress.", live: true
  });
  return rows.map(r => {
    const has = [r.toolkit, r.ing, r.food].some(v => v != null);
    const total = has ? (r.toolkit || 0) + (r.ing || 0) + (r.food || 0) : null;
    return { ...r, total, perMan: total && r.crew ? total / r.crew : null,
             consumables: has ? (r.ing || 0) + (r.food || 0) : null };
  });
}

// ---------------------------------------------------------------- format
const money  = v => (v < 0 ? "−$" : "$") + Math.abs(+v || 0).toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const money0 = v => (v < 0 ? "−$" : "$") + Math.round(Math.abs(+v || 0)).toLocaleString("en-CA");
const num    = (v, d) => (+v || 0).toLocaleString("en-CA", { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 });
const dateLong = s => new Date(s + "T00:00:00").toLocaleDateString("en-CA", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

// ---------------------------------------------------------------- the 13 tabs
// Photobook sits after Grappa and before History: it belongs to the record,
// not to the planning.
const TABS = [
  { id: "dashboard",   n: "01", name: "Dashboard",           hint: "where we stand",     icon: "dial" },
  { id: "yield",       n: "02", name: "Yield & Jars",        hint: "bushels to jars",    icon: "jar" },
  { id: "toolkit",     n: "03", name: "Sauce Toolkit",       hint: "the gear ledger",    icon: "mill" },
  { id: "ingredients", n: "04", name: "Sauce Ingredients",   hint: "what goes in",       icon: "tomato" },
  { id: "food",        n: "05", name: "Food & Drinks",       hint: "what we eat",        icon: "glass" },
  { id: "shopping",    n: "06", name: "Shopping List",       hint: "by store, by buyer", icon: "list" },
  { id: "menu",        n: "07", name: "Menu",                hint: "four services",      icon: "fork" },
  { id: "run",         n: "08", name: "Run Sheet",           hint: "Friday to 22:30",    icon: "clock" },
  { id: "settlement",  n: "09", name: "Settlement",          hint: "who pays whom",      icon: "split" },
  { id: "grappa",      n: "10", name: "Grappa Hall of Fame", hint: "the record",         icon: "bottle" },
  { id: "photobook",   n: "11", name: "Photobook",           hint: "one spread a year",  icon: "plates" },
  { id: "history",     n: "12", name: "History",             hint: "one row a year",     icon: "rows" },
  { id: "metrics",     n: "13", name: "Metrics",             hint: "six charts",         icon: "bars" }
];

global.SAUCE = {
  settings, crew, items, CATS, expenses, bushels, jarStock, runsheet, menu,
  grappa, history, photobook, TABS,
  budgetByCat, actualByCat, sum, paidByPerson, settlement,
  totalBushels, onHand, yieldPlan, scenarios, shopping, byBuyer,
  grappaRecord, grappaVerdict, shelf, photoStats, daysToGo, readiness, series,
  money, money0, num, dateLong
};
})(window);
