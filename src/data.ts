import type { CallSheet } from "./types";

// Sample production. Every name, number and address here is fictional.
export const sheet: CallSheet = {
  production: "Low Tide",
  company: "Saltmarsh Pictures",
  shootDay: 7,
  totalDays: 18,
  date: "Tuesday, December 1, 2026",
  generalCall: "6:30 AM",
  shootingCall: "8:00 AM",
  lunch: "1:00 PM",
  estWrap: "6:30 PM",
  director: "Amara Okafor",
  producer: "Daniel Reyes",
  firstAD: { name: "Priya Nair", phone: "(555) 014-2290" },
  weather: {
    summary: "Partly cloudy, marine layer until 10",
    high: "68°",
    low: "52°",
    rain: "10%",
    wind: "W 8 mph",
    sunrise: "6:52 AM",
    sunset: "4:44 PM",
  },
  location: {
    name: "Pelican Pier & Bait Shop",
    address: "2100 Harbor Rd, Port Alma, CA 93001",
    parking: "Crew parking at Lot C, shuttle every 15 min from 6:00 AM",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=2100+Harbor+Rd+Port+Alma+CA",
  },
  hospital: {
    name: "Port Alma Community Hospital",
    address: "455 Bayview Ave, Port Alma, CA 93001",
    phone: "(555) 010-9111",
    distance: "2.4 mi · 7 min",
  },
  schedule: [
    { scene: "14", setting: "EXT", location: "Pier, end of dock", description: "Mara finds the waterlogged ledger", dayNight: "D", pages: "1 2/8", cast: [1], time: "8:00 AM" },
    { scene: "15", setting: "EXT", location: "Pier, walkway", description: "Theo confronts Mara about the boat", dayNight: "D", pages: "2 4/8", cast: [1, 2], time: "9:30 AM" },
    { scene: "22", setting: "INT", location: "Bait shop, counter", description: "Gus refuses to sell to Theo", dayNight: "D", pages: "1 6/8", cast: [2, 3], time: "11:15 AM" },
    { scene: "23", setting: "INT", location: "Bait shop, back room", description: "Mara reads the ledger by lamp", dayNight: "N", pages: "7/8", cast: [1], time: "2:00 PM" },
    { scene: "41", setting: "EXT", location: "Parking lot", description: "Ruth waits in the truck, engine running", dayNight: "DUSK", pages: "4/8", cast: [4], time: "4:00 PM" },
  ],
  cast: [
    { id: 1, actor: "Lena Marsh", character: "Mara", pickup: "6:15 AM", hmu: "6:45 AM", onSet: "7:45 AM", status: "W" },
    { id: 2, actor: "Jonah Bell", character: "Theo", pickup: "7:30 AM", hmu: "8:00 AM", onSet: "9:15 AM", status: "W" },
    { id: 3, actor: "Walter Pike", character: "Gus", pickup: "9:00 AM", hmu: "9:30 AM", onSet: "11:00 AM", status: "SWF" },
    { id: 4, actor: "Nia Coleman", character: "Ruth", pickup: "1:30 PM", hmu: "2:00 PM", onSet: "3:45 PM", status: "SW" },
  ],
  departments: [
    {
      name: "Camera",
      crew: [
        { role: "DP", name: "Kenji Watanabe", call: "6:30 AM" },
        { role: "1st AC", name: "Rosa Delgado", call: "6:00 AM" },
        { role: "2nd AC", name: "Sam Ortiz", call: "6:00 AM" },
      ],
    },
    {
      name: "Grip & Electric",
      crew: [
        { role: "Gaffer", name: "Marcus Hale", call: "6:00 AM" },
        { role: "Key Grip", name: "Tess Morgan", call: "6:00 AM" },
        { role: "Best Boy", name: "Leo Kim", call: "6:00 AM" },
      ],
    },
    {
      name: "Sound",
      crew: [
        { role: "Mixer", name: "Ines Ferreira", call: "7:00 AM" },
        { role: "Boom", name: "Caleb Wright", call: "7:00 AM" },
      ],
    },
    {
      name: "Art & Props",
      crew: [
        { role: "Prod. Designer", name: "Hana Sato", call: "6:30 AM" },
        { role: "Props Master", name: "Eli Brooks", call: "6:00 AM", note: "Ledger hero + 2 wet doubles" },
      ],
    },
    {
      name: "Hair, Makeup & Wardrobe",
      crew: [
        { role: "Key MUA", name: "Fatima Diallo", call: "6:15 AM" },
        { role: "Costume", name: "Grace Lin", call: "6:15 AM" },
      ],
    },
    {
      name: "Production",
      crew: [
        { role: "UPM", name: "Owen Carter", call: "6:00 AM" },
        { role: "2nd AD", name: "Bea Santos", call: "5:45 AM" },
        { role: "Set PA", name: "Milo Grant", call: "5:45 AM" },
      ],
    },
  ],
  notes: [
    "Scene 14 needs the low morning sun. First shot by 8:15 AM, so cameras are built on the dock by 7:30 AM.",
    "Life jackets required for anyone on the end of the dock.",
    "Picture boat “Wren” arrives 7:30 AM; marine coordinator on set all day.",
    "Closed set for scene 23. Essential crew only.",
  ],
  advance: { date: "Wednesday, December 2, 2026", scenes: "Sc. 30, 31, 33 · INT Mara's house · Call 7:00 AM" },
};
