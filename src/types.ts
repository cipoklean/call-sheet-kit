// One typed object drives every output: the PDF, the email and the PNG.

export interface Person {
  role: string;
  name: string;
  call: string; // "6:30 AM"
  phone?: string;
  note?: string;
}

export interface Department {
  name: string;
  crew: Person[];
}

export interface CastMember {
  id: number; // cast number on the sheet
  actor: string;
  character: string;
  pickup: string;
  hmu: string; // hair, makeup & wardrobe
  onSet: string;
  status: "W" | "SW" | "WF" | "SWF" | "H"; // work, start-work, work-finish, start-work-finish, hold
}

export interface Scene {
  scene: string; // "14A"
  setting: "INT" | "EXT" | "INT/EXT";
  location: string;
  description: string;
  dayNight: "D" | "N" | "DAWN" | "DUSK";
  pages: string; // "1 3/8"
  cast: number[];
  time: string; // planned start
}

export interface CallSheet {
  production: string;
  company: string;
  episode?: string;
  shootDay: number;
  totalDays: number;
  date: string; // "Tuesday, December 1, 2026"
  generalCall: string;
  shootingCall: string;
  lunch: string;
  estWrap: string;
  director: string;
  producer: string;
  firstAD: { name: string; phone: string };
  weather: {
    summary: string;
    high: string;
    low: string;
    rain: string;
    wind: string;
    sunrise: string;
    sunset: string;
  };
  location: {
    name: string;
    address: string;
    parking: string;
    mapUrl: string;
  };
  hospital: {
    name: string;
    address: string;
    phone: string;
    distance: string;
  };
  schedule: Scene[];
  cast: CastMember[];
  departments: Department[];
  notes: string[];
  advance: { date: string; scenes: string };
  sheetUrl: string;
}
