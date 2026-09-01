// ============================================================================
//  DEMO DATA. Used only while js/config.js still has the placeholder URL in it,
//  so you can click around before setting Supabase up. Nothing here is saved.
// ============================================================================
export const DEMO_DATA = {
  "members": [
    {
      "email": "admin@change-me.invalid",
      "display_name": "Matt",
      "is_admin": true,
      "sort_index": 1
    },
    {
      "email": "david@change-me.invalid",
      "display_name": "David",
      "is_admin": false,
      "sort_index": 2
    },
    {
      "email": "nate@change-me.invalid",
      "display_name": "Nate",
      "is_admin": false,
      "sort_index": 3
    },
    {
      "email": "chris@change-me.invalid",
      "display_name": "Chris",
      "is_admin": false,
      "sort_index": 4
    },
    {
      "email": "mike@change-me.invalid",
      "display_name": "Mike",
      "is_admin": false,
      "sort_index": 5
    }
  ],
  "app_settings": [
    {
      "year": 2026,
      "edition": 7,
      "sauce_date": "2026-08-29",
      "crew_size": 5,
      "litres_per_bushel": 14.0,
      "buffer_pct": 0.1,
      "price_per_bushel": 25.0,
      "jar_price": 19.99,
      "band_price": 8.79,
      "lid_price": 4.99
    }
  ],
  "items": [
    {
      "id": "demo-0001",
      "year": 2026,
      "category": "toolkit",
      "sort_index": 1,
      "name": "Table blanket",
      "kind": "Owned",
      "locked": true,
      "qty": "1",
      "budget": 0,
      "assigned_to": "Matt",
      "store": null,
      "obtained": false,
      "repeat_next": "Yes",
      "comments": null,
      "link": null
    },
    {
      "id": "demo-0002",
      "year": 2026,
      "category": "toolkit",
      "sort_index": 2,
      "name": "Food mill",
      "kind": "Owned",
      "locked": true,
      "qty": "1",
      "budget": 0,
      "assigned_to": "Matt",
      "store": null,
      "obtained": false,
      "repeat_next": "Yes",
      "comments": "2025 note: consider a new mill",
      "link": null
    },
    {
      "id": "demo-0003",
      "year": 2026,
      "category": "toolkit",
      "sort_index": 3,
      "name": "Cauldrons",
      "kind": "Owned",
      "locked": true,
      "qty": "3",
      "budget": 0,
      "assigned_to": "Matt (2) / David (1) / Chris (2)",
      "store": null,
      "obtained": false,
      "repeat_next": "Yes",
      "comments": null,
      "link": null
    },
    {
      "id": "demo-0004",
      "year": 2026,
      "category": "toolkit",
      "sort_index": 4,
      "name": "Mason jars",
      "kind": "Owned",
      "locked": true,
      "qty": null,
      "budget": 39.98,
      "assigned_to": "Chris",
      "store": "Canadian Tire",
      "obtained": false,
      "repeat_next": "Yes",
      "comments": "See Yield & Jars tab for this year's count",
      "link": null
    },
    {
      "id": "demo-0005",
      "year": 2026,
      "category": "toolkit",
      "sort_index": 5,
      "name": "Funnel (wide mouth)",
      "kind": "Owned",
      "locked": true,
      "qty": "1",
      "budget": 0,
      "assigned_to": "Matt",
      "store": null,
      "obtained": false,
      "repeat_next": "Yes",
      "comments": null,
      "link": null
    },
    {
      "id": "demo-0006",
      "year": 2026,
      "category": "toolkit",
      "sort_index": 6,
      "name": "Cheesecloth",
      "kind": "Need",
      "qty": "4",
      "budget": 0,
      "assigned_to": "Matt",
      "store": "Market",
      "obtained": false,
      "repeat_next": "No",
      "comments": null,
      "link": null
    },
    {
      "id": "demo-0007",
      "year": 2026,
      "category": "toolkit",
      "sort_index": 7,
      "name": "Ladle",
      "kind": "Owned",
      "locked": true,
      "qty": "1",
      "budget": 0,
      "assigned_to": "Matt",
      "store": null,
      "obtained": false,
      "repeat_next": "Yes",
      "comments": null,
      "link": null
    },
    {
      "id": "demo-0008",
      "year": 2026,
      "category": "toolkit",
      "sort_index": 8,
      "name": "Cutting boards",
      "kind": "Owned",
      "locked": true,
      "qty": "5",
      "budget": 0,
      "assigned_to": "Matt",
      "store": null,
      "obtained": false,
      "repeat_next": "Yes",
      "comments": null,
      "link": null
    },
    {
      "id": "demo-0009",
      "year": 2026,
      "category": "toolkit",
      "sort_index": 9,
      "name": "Knives",
      "kind": "Owned",
      "locked": true,
      "qty": "5",
      "budget": 0,
      "assigned_to": "BYOK / Matt",
      "store": null,
      "obtained": false,
      "repeat_next": "Yes",
      "comments": null,
      "link": null
    },
    {
      "id": "demo-0010",
      "year": 2026,
      "category": "toolkit",
      "sort_index": 10,
      "name": "Kiddie pool",
      "kind": "Owned",
      "locked": true,
      "qty": "1",
      "budget": 0,
      "assigned_to": "Matt",
      "store": null,
      "obtained": false,
      "repeat_next": "Yes",
      "comments": null,
      "link": null
    },
    {
      "id": "demo-0011",
      "year": 2026,
      "category": "toolkit",
      "sort_index": 11,
      "name": "Chairs",
      "kind": "Owned",
      "locked": true,
      "qty": "5",
      "budget": 0,
      "assigned_to": "David (4) / Matt (2)",
      "store": null,
      "obtained": false,
      "repeat_next": "Yes",
      "comments": null,
      "link": null
    },
    {
      "id": "demo-0012",
      "year": 2026,
      "category": "toolkit",
      "sort_index": 12,
      "name": "Tables",
      "kind": "Owned",
      "locked": true,
      "qty": "2",
      "budget": 0,
      "assigned_to": "Matt (1) / Chris (1)",
      "store": null,
      "obtained": false,
      "repeat_next": "Yes",
      "comments": null,
      "link": null
    },
    {
      "id": "demo-0013",
      "year": 2026,
      "category": "toolkit",
      "sort_index": 13,
      "name": "Rims",
      "kind": "Need",
      "qty": null,
      "budget": 0,
      "assigned_to": "David / Matt",
      "store": "Canadian Tire",
      "obtained": false,
      "repeat_next": "No",
      "comments": "All new sets of rims",
      "link": null
    },
    {
      "id": "demo-0014",
      "year": 2026,
      "category": "toolkit",
      "sort_index": 14,
      "name": "Buckets",
      "kind": "Owned",
      "locked": true,
      "qty": "13",
      "budget": 0,
      "assigned_to": "David (11) / Matt (2)",
      "store": null,
      "obtained": false,
      "repeat_next": "Yes",
      "comments": "6 from Canadian Tire, 7 from Home Depot.",
      "link": null
    },
    {
      "id": "demo-0015",
      "year": 2026,
      "category": "toolkit",
      "sort_index": 15,
      "name": "Lids",
      "kind": "Need",
      "qty": "2",
      "budget": 14.97,
      "assigned_to": "David",
      "store": "Canadian Tire",
      "obtained": false,
      "repeat_next": "No",
      "comments": "See Yield & Jars tab",
      "link": null
    },
    {
      "id": "demo-0016",
      "year": 2026,
      "category": "toolkit",
      "sort_index": 16,
      "name": "Burners",
      "kind": "Owned",
      "locked": true,
      "qty": "3",
      "budget": 0,
      "assigned_to": "David (2) / Matt (1)",
      "store": "Home Depot",
      "obtained": false,
      "repeat_next": "Buy",
      "comments": null,
      "link": "https://www.homedepot.ca/product/martin-r65-propane-burner/1000751079"
    },
    {
      "id": "demo-0017",
      "year": 2026,
      "category": "toolkit",
      "sort_index": 17,
      "name": "Propane",
      "kind": "Refill",
      "qty": "3",
      "budget": 35.0,
      "assigned_to": "Matt (2) / Mike / Chris",
      "store": null,
      "obtained": false,
      "repeat_next": "Yes",
      "comments": "Recurring every year",
      "link": null
    },
    {
      "id": "demo-0018",
      "year": 2026,
      "category": "toolkit",
      "sort_index": 18,
      "name": "Mason jar lifters",
      "kind": "Owned",
      "locked": true,
      "qty": "2",
      "budget": 0,
      "assigned_to": "Matt",
      "store": null,
      "obtained": false,
      "repeat_next": "Yes",
      "comments": null,
      "link": null
    },
    {
      "id": "demo-0020",
      "year": 2026,
      "category": "toolkit",
      "sort_index": 20,
      "name": "Spider ladle",
      "kind": "Owned",
      "locked": true,
      "qty": null,
      "budget": 0,
      "assigned_to": "Matt / Mike",
      "store": null,
      "obtained": false,
      "repeat_next": "Yes",
      "comments": null,
      "link": null
    },
    {
      "id": "demo-0021",
      "year": 2026,
      "category": "toolkit",
      "sort_index": 21,
      "name": "Stainless deep dish pan",
      "kind": "Owned",
      "locked": true,
      "qty": null,
      "budget": 0,
      "assigned_to": "Matt",
      "store": null,
      "obtained": false,
      "repeat_next": "Yes",
      "comments": null,
      "link": null
    },
    {
      "id": "demo-0022",
      "year": 2026,
      "category": "toolkit",
      "sort_index": 22,
      "name": "Metal bowl",
      "kind": "Owned",
      "locked": true,
      "qty": null,
      "budget": 0,
      "assigned_to": "Matt",
      "store": null,
      "obtained": false,
      "repeat_next": "Yes",
      "comments": null,
      "link": null
    },
    {
      "id": "demo-0023",
      "year": 2026,
      "category": "toolkit",
      "sort_index": 23,
      "name": "Garbage bags",
      "kind": "Owned",
      "locked": true,
      "qty": null,
      "budget": 0,
      "assigned_to": "Matt",
      "store": null,
      "obtained": false,
      "repeat_next": "Yes",
      "comments": null,
      "link": null
    },
    {
      "id": "demo-0024",
      "year": 2026,
      "category": "toolkit",
      "sort_index": 24,
      "name": "Metal sponges",
      "kind": "Owned",
      "locked": true,
      "qty": null,
      "budget": 0,
      "assigned_to": "Matt",
      "store": null,
      "obtained": false,
      "repeat_next": "Yes",
      "comments": null,
      "link": null
    },
    {
      "id": "demo-0025",
      "year": 2026,
      "category": "toolkit",
      "sort_index": 25,
      "name": "Cleaning brush",
      "kind": "Owned",
      "locked": true,
      "qty": null,
      "budget": 0,
      "assigned_to": "Matt",
      "store": null,
      "obtained": false,
      "repeat_next": "Yes",
      "comments": null,
      "link": null
    },
    {
      "id": "demo-0026",
      "year": 2026,
      "category": "toolkit",
      "sort_index": 26,
      "name": "Aprons",
      "kind": "Owned",
      "locked": true,
      "qty": null,
      "budget": 0,
      "assigned_to": "Matt",
      "store": null,
      "obtained": false,
      "repeat_next": "Yes",
      "comments": null,
      "link": null
    },
    {
      "id": "demo-0027",
      "year": 2026,
      "category": "toolkit",
      "sort_index": 27,
      "name": "Napkins",
      "kind": "Owned",
      "locked": true,
      "qty": null,
      "budget": 0,
      "assigned_to": "Matt",
      "store": null,
      "obtained": false,
      "repeat_next": "Yes",
      "comments": null,
      "link": null
    },
    {
      "id": "demo-0028",
      "year": 2026,
      "category": "toolkit",
      "sort_index": 28,
      "name": "Cloth to strain water",
      "kind": "Owned",
      "locked": true,
      "qty": null,
      "budget": 0,
      "assigned_to": "Matt",
      "store": "Amazon",
      "obtained": false,
      "repeat_next": "Yes",
      "comments": "David to check Amazon",
      "link": null
    },
    {
      "id": "demo-0029",
      "year": 2026,
      "category": "toolkit",
      "sort_index": 29,
      "name": "Dawn dish soap",
      "kind": "Need",
      "qty": "1",
      "budget": 6,
      "assigned_to": "David",
      "store": "Grocery",
      "obtained": false,
      "repeat_next": "Buy",
      "comments": "Fresh bottle for this year.",
      "link": null
    },
    {
      "id": "demo-0141",
      "year": 2026,
      "category": "toolkit",
      "sort_index": 30,
      "name": "Sponges (pack)",
      "kind": "Need",
      "qty": "1 pack",
      "budget": 5,
      "assigned_to": "David",
      "store": "Grocery",
      "obtained": false,
      "repeat_next": "Buy",
      "comments": "New this year — kitchen sponges for the wash station.",
      "link": null
    },
    {
      "id": "demo-0030",
      "year": 2026,
      "category": "toolkit",
      "sort_index": 31,
      "name": "Scrub pads",
      "kind": "Owned",
      "locked": true,
      "qty": null,
      "budget": 0,
      "assigned_to": "David",
      "store": null,
      "obtained": false,
      "repeat_next": "Yes",
      "comments": null,
      "link": null
    },
    {
      "id": "demo-0031",
      "year": 2026,
      "category": "toolkit",
      "sort_index": 32,
      "name": "Barkeepers Friend",
      "kind": "Owned",
      "locked": true,
      "qty": null,
      "budget": 0,
      "assigned_to": "David",
      "store": null,
      "obtained": false,
      "repeat_next": "Yes",
      "comments": null,
      "link": null
    },
    {
      "id": "demo-0032",
      "year": 2026,
      "category": "toolkit",
      "sort_index": 33,
      "name": "Pop-up tent",
      "kind": "Owned",
      "locked": true,
      "qty": null,
      "budget": 0,
      "assigned_to": "Matt",
      "store": null,
      "obtained": false,
      "repeat_next": "Yes",
      "comments": null,
      "link": null
    },
    {
      "id": "demo-0033",
      "year": 2026,
      "category": "toolkit",
      "sort_index": 34,
      "name": "Strainer for sauce pot",
      "kind": "Need",
      "qty": "1",
      "budget": 0,
      "assigned_to": null,
      "store": null,
      "obtained": false,
      "repeat_next": "Buy",
      "comments": "Carried over from 2025 notes",
      "link": null
    },
    {
      "id": "demo-0034",
      "year": 2026,
      "category": "toolkit",
      "sort_index": 35,
      "name": "Speakers",
      "kind": "Owned",
      "locked": true,
      "qty": "1",
      "budget": 0,
      "assigned_to": "David",
      "store": null,
      "obtained": false,
      "repeat_next": "Yes",
      "comments": null,
      "link": null
    },
    {
      "id": "demo-0142",
      "year": 2026,
      "category": "toolkit",
      "sort_index": 36,
      "name": "Outdoor sink",
      "kind": "Prospect",
      "qty": "1",
      "budget": 279.99,
      "assigned_to": null,
      "store": null,
      "obtained": false,
      "repeat_next": "Maybe",
      "comments": "Preferred: 1 m stainless sink station — half countertop, half bowl, 304 restaurant steel, $279.99 on Amazon, in stock, 4.8/5. No faucet in the listing — plan on a hose tap. Budget option: PDG folding table with sink & tap, $124.99 at Canadian Tire. Prices read 17 Aug 2026.",
      "link": "https://www.amazon.ca/dp/B0H397TB3K"
    },
    {
      "id": "demo-0035",
      "year": 2026,
      "category": "ingredients",
      "sort_index": 1,
      "name": "Bushels of tomatoes",
      "kind": "Need",
      "qty": "10",
      "budget": 175.0,
      "assigned_to": "Matt / David / Nate",
      "store": "Market",
      "obtained": false,
      "repeat_next": "Yes",
      "comments": "Recurring. Budget links to Yield & Jars tab",
      "link": null
    },
    {
      "id": "demo-0036",
      "year": 2026,
      "category": "ingredients",
      "sort_index": 2,
      "name": "Basil",
      "kind": "Need",
      "qty": null,
      "budget": 0,
      "assigned_to": "Matt / David / Nate",
      "store": "Market",
      "obtained": false,
      "repeat_next": "Yes",
      "comments": "Matt potentially has",
      "link": null
    },
    {
      "id": "demo-0037",
      "year": 2026,
      "category": "ingredients",
      "sort_index": 3,
      "name": "Parsley",
      "kind": "Need",
      "qty": null,
      "budget": 0,
      "assigned_to": "Matt / David / Nate",
      "store": "Market",
      "obtained": false,
      "repeat_next": "Yes",
      "comments": "Matt potentially has",
      "link": null
    },
    {
      "id": "demo-0038",
      "year": 2026,
      "category": "ingredients",
      "sort_index": 4,
      "name": "Onions",
      "kind": "Costco",
      "qty": null,
      "budget": 0,
      "assigned_to": "Matt / David / Nate",
      "store": "Costco",
      "obtained": false,
      "repeat_next": "Yes",
      "comments": null,
      "link": null
    },
    {
      "id": "demo-0039",
      "year": 2026,
      "category": "ingredients",
      "sort_index": 5,
      "name": "Garlic",
      "kind": "Costco",
      "qty": null,
      "budget": 0,
      "assigned_to": "Matt / David / Nate",
      "store": "Costco",
      "obtained": false,
      "repeat_next": "Yes",
      "comments": null,
      "link": null
    },
    {
      "id": "demo-0040",
      "year": 2026,
      "category": "ingredients",
      "sort_index": 6,
      "name": "Carrots",
      "kind": "Costco",
      "qty": null,
      "budget": 0,
      "assigned_to": "Matt / David / Nate",
      "store": "Costco",
      "obtained": false,
      "repeat_next": "Yes",
      "comments": null,
      "link": null
    },
    {
      "id": "demo-0041",
      "year": 2026,
      "category": "ingredients",
      "sort_index": 7,
      "name": "Celery",
      "kind": "Costco",
      "qty": null,
      "budget": 0,
      "assigned_to": "Matt / David / Nate",
      "store": "Costco",
      "obtained": false,
      "repeat_next": "Yes",
      "comments": null,
      "link": null
    },
    {
      "id": "demo-0042",
      "year": 2026,
      "category": "ingredients",
      "sort_index": 8,
      "name": "Salt",
      "kind": "Have",
      "qty": null,
      "budget": 0,
      "assigned_to": "Matt / David / Nate",
      "store": null,
      "obtained": false,
      "repeat_next": "Yes",
      "comments": null,
      "link": null
    },
    {
      "id": "demo-0043",
      "year": 2026,
      "category": "ingredients",
      "sort_index": 9,
      "name": "Sugar",
      "kind": "Have",
      "qty": null,
      "budget": 0,
      "assigned_to": "Matt / David / Nate",
      "store": null,
      "obtained": false,
      "repeat_next": "Yes",
      "comments": null,
      "link": null
    },
    {
      "id": "demo-0201",
      "year": 2026,
      "category": "food",
      "subcategory": "Insalata caprese",
      "sort_index": 300,
      "name": "Mozzarella di bufala",
      "kind": "Need",
      "qty": "2 balls",
      "budget": 0,
      "assigned_to": null,
      "store": "Market",
      "obtained": false,
      "repeat_next": "Yes",
      "comments": null,
      "link": null
    },
    {
      "id": "demo-0202",
      "year": 2026,
      "category": "food",
      "subcategory": "Insalata caprese",
      "sort_index": 310,
      "name": "Basil",
      "kind": "Need",
      "qty": "1 bunch",
      "budget": 0,
      "assigned_to": null,
      "store": "Market",
      "obtained": false,
      "repeat_next": "Yes",
      "comments": "Matt potentially has it in the garden.",
      "link": null
    },
    {
      "id": "demo-0203",
      "year": 2026,
      "category": "food",
      "subcategory": "Insalata caprese",
      "sort_index": 320,
      "name": "Good olive oil",
      "kind": "Need",
      "qty": "500 ml",
      "budget": 0,
      "assigned_to": null,
      "store": "Italian Market",
      "obtained": false,
      "repeat_next": "Yes",
      "comments": "Also dresses the bruschetta.",
      "link": null
    },
    {
      "id": "demo-0204",
      "year": 2026,
      "category": "food",
      "subcategory": "Bruschetta",
      "sort_index": 330,
      "name": "Tomatoes for the table",
      "kind": "Need",
      "qty": "1 kg",
      "budget": 0,
      "assigned_to": null,
      "store": "Market",
      "obtained": false,
      "repeat_next": "Yes",
      "comments": "Not the sauce bushels — these get eaten raw.",
      "link": null
    },
    {
      "id": "demo-0205",
      "year": 2026,
      "category": "food",
      "subcategory": "Bruschetta",
      "sort_index": 340,
      "name": "Baguette",
      "kind": "Need",
      "qty": "2",
      "budget": 0,
      "assigned_to": "Nate",
      "store": "Bakery",
      "obtained": false,
      "repeat_next": "Yes",
      "comments": null,
      "link": null
    },
    {
      "id": "demo-0206",
      "year": 2026,
      "category": "food",
      "subcategory": "Bruschetta",
      "sort_index": 350,
      "name": "Garlic",
      "kind": "Need",
      "qty": "1 head",
      "budget": 0,
      "assigned_to": null,
      "store": "Market",
      "obtained": false,
      "repeat_next": "Yes",
      "comments": null,
      "link": null
    },
    {
      "id": "demo-0207",
      "year": 2026,
      "category": "food",
      "subcategory": "Focaccia",
      "sort_index": 360,
      "name": "00 flour",
      "kind": "Need",
      "qty": "2 kg",
      "budget": 0,
      "assigned_to": "Mike",
      "store": "Italian Market",
      "obtained": false,
      "repeat_next": "Yes",
      "comments": null,
      "link": null
    },
    {
      "id": "demo-0208",
      "year": 2026,
      "category": "food",
      "subcategory": "Focaccia",
      "sort_index": 370,
      "name": "Fresh yeast",
      "kind": "Need",
      "qty": "1 cube",
      "budget": 0,
      "assigned_to": "Mike",
      "store": "Grocery",
      "obtained": false,
      "repeat_next": "Yes",
      "comments": null,
      "link": null
    },
    {
      "id": "demo-0209",
      "year": 2026,
      "category": "food",
      "subcategory": "Focaccia",
      "sort_index": 380,
      "name": "Rosemary",
      "kind": "Need",
      "qty": "2 sprigs",
      "budget": 0,
      "assigned_to": "Mike",
      "store": "Market",
      "obtained": false,
      "repeat_next": "Yes",
      "comments": null,
      "link": null
    }
  ],
  "expenses": [
    {
      "id": "demo-0138",
      "year": 2026,
      "category": "ingredients",
      "paid_by": "Nate",
      "amount": 175.0,
      "label": "10 bushels at the market",
      "spent_on": "2026-08-28",
      "created_by": "nate@change-me.invalid",
      "created_at": "2026-08-28T14:00:00Z"
    },
    {
      "id": "demo-0139",
      "year": 2026,
      "category": "food",
      "paid_by": "David",
      "amount": 148.5,
      "label": "SAQ run - wine and prosecco",
      "spent_on": "2026-08-27",
      "created_by": "david@change-me.invalid",
      "created_at": "2026-08-27T18:20:00Z"
    },
    {
      "id": "demo-0140",
      "year": 2026,
      "category": "toolkit",
      "paid_by": "Matt",
      "amount": 35.0,
      "label": "Propane refills x3",
      "spent_on": "2026-08-26",
      "created_by": "admin@change-me.invalid",
      "created_at": "2026-08-26T11:05:00Z"
    }
  ],
  "bushels": [
    {
      "id": "demo-0076",
      "year": 2026,
      "person": "Crew",
      "count": 10
    }
  ],
  "jar_inventory": [
    {
      "id": "demo-0083",
      "year": 2026,
      "person": "Matt",
      "jars": 67,
      "bands": 74,
      "lids": 48
    },
    {
      "id": "demo-0084",
      "year": 2026,
      "person": "David",
      "jars": 24,
      "bands": 10,
      "lids": 0
    },
    {
      "id": "demo-0085",
      "year": 2026,
      "person": "Nate",
      "jars": 0,
      "bands": 0,
      "lids": 0
    },
    {
      "id": "demo-0086",
      "year": 2026,
      "person": "Chris",
      "jars": 0,
      "bands": 0,
      "lids": 0
    },
    {
      "id": "demo-0087",
      "year": 2026,
      "person": "Mike",
      "jars": 0,
      "bands": 0,
      "lids": 0
    }
  ],
  "runsheet": [

    {

      "id": "demo-r1",

      "year": 2026,

      "sort_index": 1,

      "section": "PREP",

      "time_label": "Fri PM",

      "activity": "Pick up bushels from the market",

      "lead": "Nate",

      "crew": "David",

      "equipment": "Truck, buckets",

      "icon": "bushel",

      "duration_min": 90,

      "ingredients": "10 bushels of San Marzano",

      "milestone": true,

      "critical": false,

      "done": false,

      "done_at": null,

      "notes": "Get there early, best tomatoes go first"

    },

    {

      "id": "demo-r2",

      "year": 2026,

      "sort_index": 2,

      "section": "PREP",

      "time_label": "Fri PM",

      "activity": "Wash and sterilise every jar",

      "lead": "Matt",

      "crew": "All",

      "equipment": "Jars, dishwasher, Barkeepers Friend",

      "icon": "jar",

      "duration_min": 120,

      "ingredients": null,

      "milestone": true,

      "critical": false,

      "done": false,

      "done_at": null,

      "notes": "Count as you go"

    },

    {

      "id": "demo-r3",

      "year": 2026,

      "sort_index": 3,

      "section": "PREP",

      "time_label": "Fri PM",

      "activity": "Set up tables, tent, chairs, kiddie pool",

      "lead": "Matt",

      "crew": "Chris",

      "equipment": "Tables, tent, chairs, pool",

      "icon": null,

      "duration_min": 45,

      "ingredients": null,

      "milestone": false,

      "critical": false,

      "done": false,

      "done_at": null,

      "notes": null

    },

    {

      "id": "demo-r4",

      "year": 2026,

      "sort_index": 4,

      "section": "PREP",

      "time_label": "Fri PM",

      "activity": "Fill and check propane tanks",

      "lead": "Matt",

      "crew": "Mike",

      "equipment": "3 tanks",

      "icon": null,

      "duration_min": 30,

      "ingredients": null,

      "milestone": false,

      "critical": false,

      "done": false,

      "done_at": null,

      "notes": "Refill beats buying new"

    },

    {

      "id": "demo-r5",

      "year": 2026,

      "sort_index": 5,

      "section": "PREP",

      "time_label": "Fri PM",

      "activity": "Chill all beer, wine, prosecco, water",

      "lead": "David",

      "crew": null,

      "equipment": "Coolers, ice",

      "icon": null,

      "duration_min": 20,

      "ingredients": null,

      "milestone": false,

      "critical": false,

      "done": false,

      "done_at": null,

      "notes": null

    },

    {

      "id": "demo-r6",

      "year": 2026,

      "sort_index": 6,

      "section": "PREP",

      "time_label": "Fri PM",

      "activity": "Grind the espresso",

      "lead": "David",

      "crew": null,

      "equipment": "Grinder",

      "icon": null,

      "duration_min": 10,

      "ingredients": "Beans from the roastery",

      "milestone": false,

      "critical": false,

      "done": false,

      "done_at": null,

      "notes": "2025 lesson: do this the night before"

    },

    {

      "id": "demo-r7",

      "year": 2026,

      "sort_index": 7,

      "section": "DAY",

      "time_label": "06:30",

      "activity": "Start sauce prep",

      "lead": "Matt",

      "crew": "All",

      "equipment": "Espresso, moka",

      "icon": "tomato",

      "duration_min": 60,

      "ingredients": "Espresso",

      "milestone": true,

      "critical": false,

      "done": false,

      "done_at": null,

      "notes": "Crew arrives. Coffee before anything else."

    },

    {

      "id": "demo-r8",

      "year": 2026,

      "sort_index": 8,

      "section": "DAY",

      "time_label": "07:00",

      "activity": "McDonald's run",

      "lead": "Chris",

      "crew": null,

      "equipment": "Cash",

      "icon": null,

      "duration_min": 30,

      "ingredients": null,

      "milestone": false,

      "critical": false,

      "done": false,

      "done_at": null,

      "notes": "5 breakfast combos"

    },

    {

      "id": "demo-r9",

      "year": 2026,

      "sort_index": 9,

      "section": "DAY",

      "time_label": "07:30",

      "activity": "Fire up the burners",

      "lead": "Matt",

      "crew": "Mike",

      "equipment": "3 burners, cauldrons, propane",

      "icon": "flame",

      "duration_min": 30,

      "ingredients": "Propane",

      "milestone": true,

      "critical": false,

      "done": false,

      "done_at": null,

      "notes": "Wash water on at the same time"

    },

    {

      "id": "demo-r10",

      "year": 2026,

      "sort_index": 10,

      "section": "DAY",

      "time_label": "08:00",

      "activity": "Wash tomatoes",

      "lead": "All",

      "crew": "All",

      "equipment": "Kiddie pool, buckets, strainer",

      "icon": null,

      "duration_min": 60,

      "ingredients": "10 bushels",

      "milestone": false,

      "critical": false,

      "done": false,

      "done_at": null,

      "notes": "Two-stage rinse"

    },

    {

      "id": "demo-r11",

      "year": 2026,

      "sort_index": 11,

      "section": "DAY",

      "time_label": "09:00",

      "activity": "First batch cooking",

      "lead": "Nate",

      "crew": "David",

      "equipment": "Cauldrons, spider ladle",

      "icon": "cauldron",

      "duration_min": 90,

      "ingredients": "Washed tomatoes",

      "milestone": true,

      "critical": false,

      "done": false,

      "done_at": null,

      "notes": "Blanch and cook"

    },

    {

      "id": "demo-r12",

      "year": 2026,

      "sort_index": 12,

      "section": "DAY",

      "time_label": "10:30",

      "activity": "Coffee break",

      "lead": "David",

      "crew": "All",

      "equipment": "Moka, biscotti",

      "icon": "coffee",

      "duration_min": 20,

      "ingredients": "Espresso, biscotti",

      "milestone": true,

      "critical": false,

      "done": false,

      "done_at": null,

      "notes": "Get the day off the tomatoes for ten minutes"

    },

    {

      "id": "demo-r13",

      "year": 2026,

      "sort_index": 13,

      "section": "DAY",

      "time_label": "10:45",

      "activity": "First mill run",

      "lead": "Chris",

      "crew": "Matt",

      "equipment": "Food mill, deep dish pan",

      "icon": null,

      "duration_min": 45,

      "ingredients": null,

      "milestone": false,

      "critical": false,

      "done": false,

      "done_at": null,

      "notes": "Watch for skins clogging"

    },

    {

      "id": "demo-r14",

      "year": 2026,

      "sort_index": 14,

      "section": "DAY",

      "time_label": "11:30",

      "activity": "Jars into hot water, lids ready",

      "lead": "Matt",

      "crew": null,

      "equipment": "Jar lifters, cauldron",

      "icon": null,

      "duration_min": 30,

      "ingredients": null,

      "milestone": false,

      "critical": false,

      "done": false,

      "done_at": null,

      "notes": null

    },

    {

      "id": "demo-r15",

      "year": 2026,

      "sort_index": 15,

      "section": "DAY",

      "time_label": "12:00",

      "activity": "Lunch break",

      "lead": "Nate",

      "crew": "All",

      "equipment": "Tables, boards",

      "icon": "fork",

      "duration_min": 60,

      "ingredients": "The antipasti spread",

      "milestone": true,

      "critical": false,

      "done": false,

      "done_at": null,

      "notes": "See the Menu tab"

    },

    {

      "id": "demo-r16",

      "year": 2026,

      "sort_index": 16,

      "section": "DAY",

      "time_label": "13:00",

      "activity": "Milling continues, bottling line starts",

      "lead": "All",

      "crew": "All",

      "equipment": "Funnel, ladle, mill",

      "icon": null,

      "duration_min": 120,

      "ingredients": null,

      "milestone": false,

      "critical": false,

      "done": false,

      "done_at": null,

      "notes": null

    },

    {

      "id": "demo-r17",

      "year": 2026,

      "sort_index": 17,

      "section": "DAY",

      "time_label": "15:00",

      "activity": "Jarring begins",

      "lead": "All",

      "crew": "All",

      "equipment": "Funnel, rims, lids, bands",

      "icon": "jar",

      "duration_min": 90,

      "ingredients": "Milled sauce, basil",

      "milestone": true,

      "critical": true,

      "done": false,

      "done_at": null,

      "notes": "Wipe every rim before capping. This is the one that matters."

    },

    {

      "id": "demo-r18",

      "year": 2026,

      "sort_index": 18,

      "section": "DAY",

      "time_label": "16:30",

      "activity": "Wine break",

      "lead": "David",

      "crew": "All",

      "equipment": "Glasses",

      "icon": "glass",

      "duration_min": 30,

      "ingredients": "Prosecco, the whites",

      "milestone": true,

      "critical": false,

      "done": false,

      "done_at": null,

      "notes": "Water bath goes on at the same time"

    },

    {

      "id": "demo-r19",

      "year": 2026,

      "sort_index": 19,

      "section": "DAY",

      "time_label": "16:30",

      "activity": "Water bath - seal the jars",

      "lead": "Matt",

      "crew": "David",

      "equipment": "Cauldron, jar lifters",

      "icon": null,

      "duration_min": 60,

      "ingredients": null,

      "milestone": false,

      "critical": true,

      "done": false,

      "done_at": null,

      "notes": "Listen for the pops"

    },

    {

      "id": "demo-r20",

      "year": 2026,

      "sort_index": 20,

      "section": "DAY",

      "time_label": "18:00",

      "activity": "Annual grappa toast",

      "lead": "David",

      "crew": "All",

      "equipment": "The bottle",

      "icon": "bottle",

      "duration_min": 30,

      "ingredients": "This year's grappa",

      "milestone": true,

      "critical": true,

      "done": false,

      "done_at": null,

      "notes": "It has to beat last year. See the Grappa tab."

    },

    {

      "id": "demo-r21",

      "year": 2026,

      "sort_index": 21,

      "section": "DAY",

      "time_label": "19:00",

      "activity": "Dinner - pasta with this year's sauce",

      "lead": "Mike",

      "crew": "All",

      "equipment": "Pots, fresh pasta",

      "icon": "plate",

      "duration_min": 90,

      "ingredients": "Fresh pasta, this year's sauce",

      "milestone": true,

      "critical": false,

      "done": false,

      "done_at": null,

      "notes": "The whole point"

    },

    {

      "id": "demo-r22",

      "year": 2026,

      "sort_index": 22,

      "section": "DAY",

      "time_label": "20:30",

      "activity": "Pizza run",

      "lead": "Chris",

      "crew": null,

      "equipment": "Cash, the truck",

      "icon": "pizza",

      "duration_min": 45,

      "ingredients": null,

      "milestone": true,

      "critical": false,

      "done": false,

      "done_at": null,

      "notes": "Second wind. Nobody has ever regretted this."

    },

    {

      "id": "demo-r23",

      "year": 2026,

      "sort_index": 23,

      "section": "DAY",

      "time_label": "21:00",

      "activity": "Cooling and cleanup",

      "lead": "All",

      "crew": "All",

      "equipment": "Dawn, scrub pads, metal sponges",

      "icon": "cool",

      "duration_min": 60,

      "ingredients": null,

      "milestone": true,

      "critical": false,

      "done": false,

      "done_at": null,

      "notes": "Jars stay put until they are cold. Do not move them early."

    },

    {

      "id": "demo-r24",

      "year": 2026,

      "sort_index": 24,

      "section": "DAY",

      "time_label": "22:00",

      "activity": "Group photo",

      "lead": "Matt",

      "crew": "All",

      "equipment": "A phone and a timer",

      "icon": "camera",

      "duration_min": 15,

      "ingredients": null,

      "milestone": true,

      "critical": false,

      "done": false,

      "done_at": null,

      "notes": "Goes straight into the Photobook"

    },

    {

      "id": "demo-r25",

      "year": 2026,

      "sort_index": 25,

      "section": "DAY",

      "time_label": "22:15",

      "activity": "Count jars, log fallen soldiers, divide the sauce",

      "lead": "Matt",

      "crew": "All",

      "equipment": "Notebook",

      "icon": null,

      "duration_min": 15,

      "ingredients": null,

      "milestone": false,

      "critical": false,

      "done": false,

      "done_at": null,

      "notes": "Enter the count on the History tab"

    },

    {

      "id": "demo-r26",

      "year": 2026,

      "sort_index": 26,

      "section": "DAY",

      "time_label": "22:30",

      "activity": "Sauce Day complete",

      "lead": "Matt",

      "crew": "All",

      "equipment": "This workbook",

      "icon": "check",

      "duration_min": null,

      "ingredients": null,

      "milestone": true,

      "critical": true,

      "done": false,

      "done_at": null,

      "notes": "Settle up, then bed. Settlement says who pays whom."

    }
  ],
  "menu": [
    {
      "id": "demo-0110",
      "year": 2026,
      "sort_index": 1,
      "service": "Breakfast",
      "dish": "McDonald's combos",
      "who": "Chris",
      "source": "McDonald's",
      "qty": "5",
      "confirmed": false,
      "notes": null
    },
    {
      "id": "demo-0111",
      "year": 2026,
      "sort_index": 2,
      "service": "Breakfast",
      "dish": "Espresso",
      "who": "David",
      "source": "Roastery",
      "qty": null,
      "confirmed": false,
      "notes": "Ground the night before"
    },
    {
      "id": "demo-0112",
      "year": 2026,
      "sort_index": 3,
      "service": "Breakfast",
      "dish": "Biscotti",
      "who": "Nate",
      "source": "Bakery",
      "qty": null,
      "confirmed": false,
      "notes": "To get the day off the tomatoes"
    },
    {
      "id": "demo-0113",
      "year": 2026,
      "sort_index": 4,
      "service": "Breakfast",
      "dish": "Orange juice / mimosas",
      "who": null,
      "source": "Costco",
      "qty": null,
      "confirmed": false,
      "notes": null
    },
    {
      "id": "demo-0114",
      "year": 2026,
      "sort_index": 5,
      "service": "Snack",
      "dish": "Marinated olives",
      "who": "Nate",
      "source": "Market",
      "qty": null,
      "confirmed": false,
      "notes": null
    },
    {
      "id": "demo-0115",
      "year": 2026,
      "sort_index": 6,
      "service": "Snack",
      "dish": "Lupini",
      "who": null,
      "source": "Market",
      "qty": "10",
      "confirmed": false,
      "notes": null
    },
    {
      "id": "demo-0116",
      "year": 2026,
      "sort_index": 7,
      "service": "Snack",
      "dish": "Fontina bites on bread",
      "who": "Nate",
      "source": "Bakery",
      "qty": null,
      "confirmed": false,
      "notes": null
    },
    {
      "id": "demo-0117",
      "year": 2026,
      "sort_index": 8,
      "service": "Lunch",
      "dish": "Cold cuts - prosciutto, mortadella, capicollo",
      "who": null,
      "source": "Market",
      "qty": null,
      "confirmed": false,
      "notes": null
    },
    {
      "id": "demo-0118",
      "year": 2026,
      "sort_index": 9,
      "service": "Lunch",
      "dish": "Insalata caprese",
      "who": null,
      "source": "Market",
      "qty": null,
      "confirmed": false,
      "notes": "Mozzarella, basil, good olive oil"
    },
    {
      "id": "demo-0119",
      "year": 2026,
      "sort_index": 10,
      "service": "Lunch",
      "dish": "Bruschetta",
      "who": null,
      "source": "Market",
      "qty": null,
      "confirmed": false,
      "notes": "List the ingredients"
    },
    {
      "id": "demo-0120",
      "year": 2026,
      "sort_index": 11,
      "service": "Lunch",
      "dish": "Roasted peppers",
      "who": null,
      "source": "Market",
      "qty": null,
      "confirmed": false,
      "notes": null
    },
    {
      "id": "demo-0121",
      "year": 2026,
      "sort_index": 12,
      "service": "Lunch",
      "dish": "Canned tuna and cannellini beans",
      "who": "Chris",
      "source": "Grocery",
      "qty": null,
      "confirmed": false,
      "notes": null
    },
    {
      "id": "demo-0122",
      "year": 2026,
      "sort_index": 13,
      "service": "Lunch",
      "dish": "Hard cheese",
      "who": null,
      "source": "Market",
      "qty": null,
      "confirmed": false,
      "notes": null
    },
    {
      "id": "demo-0123",
      "year": 2026,
      "sort_index": 14,
      "service": "Lunch",
      "dish": "Rustic garlic bread",
      "who": null,
      "source": "Costco",
      "qty": null,
      "confirmed": false,
      "notes": null
    },
    {
      "id": "demo-0124",
      "year": 2026,
      "sort_index": 15,
      "service": "Lunch",
      "dish": "Focaccia",
      "who": "Mike",
      "source": "Homemade",
      "qty": null,
      "confirmed": false,
      "notes": "Mike makes it"
    },
    {
      "id": "demo-0125",
      "year": 2026,
      "sort_index": 16,
      "service": "Lunch",
      "dish": "Arancini",
      "who": null,
      "source": "Little Italy",
      "qty": null,
      "confirmed": false,
      "notes": null
    },
    {
      "id": "demo-0126",
      "year": 2026,
      "sort_index": 17,
      "service": "Dinner",
      "dish": "Fresh pasta with this year's sauce",
      "who": null,
      "source": "Market",
      "qty": null,
      "confirmed": false,
      "notes": "The whole point"
    },
    {
      "id": "demo-0127",
      "year": 2026,
      "sort_index": 18,
      "service": "Dinner",
      "dish": "Meatballs - veal, pork and beef",
      "who": null,
      "source": "Inman",
      "qty": null,
      "confirmed": false,
      "notes": null
    },
    {
      "id": "demo-0128",
      "year": 2026,
      "sort_index": 19,
      "service": "Dinner",
      "dish": "Sausages",
      "who": "David",
      "source": "Butcher",
      "qty": null,
      "confirmed": false,
      "notes": null
    },
    {
      "id": "demo-0129",
      "year": 2026,
      "sort_index": 20,
      "service": "Dinner",
      "dish": "Dried sausages",
      "who": null,
      "source": "Butcher",
      "qty": null,
      "confirmed": false,
      "notes": null
    },
    {
      "id": "demo-0130",
      "year": 2026,
      "sort_index": 21,
      "service": "Dinner",
      "dish": "Grapes",
      "who": "David",
      "source": "Market",
      "qty": null,
      "confirmed": false,
      "notes": null
    },
    {
      "id": "demo-0131",
      "year": 2026,
      "sort_index": 22,
      "service": "Drinks",
      "dish": "Grappa - the annual bottle",
      "who": "David",
      "source": "SAQ",
      "qty": "1",
      "confirmed": false,
      "notes": "Must beat last year"
    },
    {
      "id": "demo-0132",
      "year": 2026,
      "sort_index": 23,
      "service": "Drinks",
      "dish": "Wine - 2 white, 1 red",
      "who": "David",
      "source": "SAQ",
      "qty": "4",
      "confirmed": false,
      "notes": null
    },
    {
      "id": "demo-0133",
      "year": 2026,
      "sort_index": 24,
      "service": "Drinks",
      "dish": "Prosecco",
      "who": "David",
      "source": "SAQ",
      "qty": null,
      "confirmed": false,
      "notes": null
    },
    {
      "id": "demo-0134",
      "year": 2026,
      "sort_index": 25,
      "service": "Drinks",
      "dish": "Beer",
      "who": null,
      "source": "Depanneur",
      "qty": null,
      "confirmed": false,
      "notes": null
    },
    {
      "id": "demo-0135",
      "year": 2026,
      "sort_index": 26,
      "service": "Drinks",
      "dish": "Vodka and Kahlua",
      "who": "David",
      "source": "SAQ",
      "qty": null,
      "confirmed": false,
      "notes": "Espresso martinis after dinner"
    },
    {
      "id": "demo-0136",
      "year": 2026,
      "sort_index": 27,
      "service": "Drinks",
      "dish": "Italian lemonade",
      "who": null,
      "source": "Grocery",
      "qty": "20",
      "confirmed": false,
      "notes": "Siciliana?"
    },
    {
      "id": "demo-0137",
      "year": 2026,
      "sort_index": 28,
      "service": "Drinks",
      "dish": "Sparkling water",
      "who": null,
      "source": "Costco",
      "qty": null,
      "confirmed": false,
      "notes": null
    }
  ],
  "grappa": [
    {
      "year": 2020,
      "bottle": null,
      "producer": null,
      "region": null,
      "price": null,
      "bought_by": null,
      "rating": null,
      "notes": "No record"
    },
    {
      "year": 2021,
      "bottle": null,
      "producer": null,
      "region": null,
      "price": 0.0,
      "bought_by": null,
      "rating": null,
      "notes": "No grappa line recorded on the 2021 sheet"
    },
    {
      "year": 2022,
      "bottle": null,
      "producer": null,
      "region": null,
      "price": 80.0,
      "bought_by": "David",
      "rating": null,
      "notes": "Bottle not named on the sheet"
    },
    {
      "year": 2023,
      "bottle": null,
      "producer": null,
      "region": null,
      "price": 0.0,
      "bought_by": null,
      "rating": null,
      "notes": "No grappa recorded"
    },
    {
      "year": 2024,
      "bottle": null,
      "producer": null,
      "region": null,
      "price": 82.25,
      "bought_by": "David",
      "rating": null,
      "notes": "Bottle not named on the sheet"
    },
    {
      "year": 2025,
      "bottle": null,
      "producer": null,
      "region": null,
      "price": 135.0,
      "bought_by": "David",
      "rating": null,
      "notes": "SAQ product 11849106 - https://www.saq.com/en/11849106"
    },
    {
      "year": 2026,
      "bottle": null,
      "producer": null,
      "region": null,
      "price": null,
      "bought_by": "David",
      "rating": null,
      "notes": "Not bought yet. It has to beat $135.00."
    }
  ],
  "history": [
    {
      "year": 2020,
      "edition": 1,
      "sauce_date": null,
      "toolkit": null,
      "ingredients": null,
      "food": null,
      "crew_size": 5,
      "bushels": null,
      "litres": 78,
      "jars_filled": null,
      "fallen_soldiers": null,
      "grappa": null,
      "notes": "No sheet provided. Litres from the 'Year 1 = 78 L' note in the 2025 workbook. Fill the rest from your archive."
    },
    {
      "year": 2021,
      "edition": 2,
      "sauce_date": "2021-09-06",
      "toolkit": 294.04,
      "ingredients": 230.3,
      "food": 101.2,
      "crew_size": 5,
      "bushels": 7,
      "litres": 60,
      "jars_filled": null,
      "fallen_soldiers": null,
      "grappa": 0.0,
      "notes": "Rebuilt from the Sauce Boss 2021 sheet. Line items total $625.49; sheet's own total was $625.49."
    },
    {
      "year": 2022,
      "edition": 3,
      "sauce_date": null,
      "toolkit": 257.0,
      "ingredients": 250.0,
      "food": 350.94,
      "crew_size": 5,
      "bushels": null,
      "litres": null,
      "jars_filled": null,
      "fallen_soldiers": null,
      "grappa": 80.0,
      "notes": "From the 2022 column of the 2025 workbook."
    },
    {
      "year": 2023,
      "edition": 4,
      "sauce_date": null,
      "toolkit": 294.35,
      "ingredients": 322.0,
      "food": 129.42,
      "crew_size": 5,
      "bushels": null,
      "litres": null,
      "jars_filled": null,
      "fallen_soldiers": null,
      "grappa": 0.0,
      "notes": "From the 2023 column of the 2025 workbook. No grappa recorded."
    },
    {
      "year": 2024,
      "edition": 5,
      "sauce_date": null,
      "toolkit": 527.55,
      "ingredients": 307.0,
      "food": 209.3,
      "crew_size": 5,
      "bushels": null,
      "litres": null,
      "jars_filled": null,
      "fallen_soldiers": null,
      "grappa": 82.25,
      "notes": "From the 2024 column of the 2025 workbook. Big toolkit year (burners + cauldrons)."
    },
    {
      "year": 2025,
      "edition": 6,
      "sauce_date": "2025-08-30",
      "toolkit": 242.34,
      "ingredients": 250.0,
      "food": 543.58,
      "crew_size": 5,
      "bushels": 7,
      "litres": null,
      "jars_filled": null,
      "fallen_soldiers": null,
      "grappa": 135.0,
      "notes": "Food total as stated on the 2025 sheet; the $31 fresh-pasta line appears to have been left out of it."
    }
  ],

  // The photobook has no sauce day photographs yet, so demo mode stands the
  // bottle shots up instead. Real images, real captions, and enough of them to
  // show how the stack handles. They vanish the moment Supabase is wired up.
  "photos": [
    { "id": "demo-p1", "year": 2026, "sort_index": 1, "taken_by": "Matt",
      "url": "img/grappa/jacopo-poli-torcolato.png",
      "caption": "Torcolato, $107.50 — the dearest on the shortlist, still $27.50 short" },
    { "id": "demo-p2", "year": 2026, "sort_index": 2, "taken_by": "Matt",
      "url": "img/grappa/poli-cleopatra-moscato-oro.png",
      "caption": "Cleopatra Moscato Oro, $91.75 — best value per litre of the five" },
    { "id": "demo-p3", "year": 2026, "sort_index": 3, "taken_by": "Matt",
      "url": "img/grappa/de-negri-monovitigno-prosecco.png",
      "caption": "De Negri Monovitigno di Prosecco, $42.25 — the only non-Poli" },
    { "id": "demo-p4", "year": 2026, "sort_index": 4, "taken_by": "Matt",
      "url": "img/grappa/poli-bassano-24-carati.png",
      "caption": "Bassano 24 Carati, $41.50 — barrel time, hence the colour" },
    { "id": "demo-p5", "year": 2026, "sort_index": 5, "taken_by": "Matt",
      "url": "img/grappa/poli-bassano-classica.png",
      "caption": "Bassano Del Grappa, $32.75 — the house pour" }
  ]
};
