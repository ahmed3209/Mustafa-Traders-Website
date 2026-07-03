// Delivery is nationwide (all of Pakistan). The city dropdown lists major
// cities for convenience; "Other" lets customers in any other city order and
// type their city in the address/notes.

export const PAKISTAN_CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Hyderabad",
  "Gujranwala",
  "Sialkot",
  "Bahawalpur",
  "Sargodha",
  "Sukkur",
  "Larkana",
  "Sheikhupura",
  "Mardan",
  "Abbottabad",
  "Mirpur (AJK)",
  "Other",
] as const;

export type PakistanCity = (typeof PAKISTAN_CITIES)[number];
