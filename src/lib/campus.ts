// Campus scope: Vento is universities-only. Launch campus is Igbinedion
// University (Okada). More campuses ship as "soon" — no dead ends.
export interface Campus {
  id: string;
  name: string;
  town: string;
  active: boolean;
  latitude: number;
  longitude: number;
}

export const CAMPUSES: Campus[] = [
  { id: "iuok", name: "Igbinedion University", town: "Okada, Edo State", active: true, latitude: 6.5449, longitude: 5.386 },
  { id: "unilag", name: "University of Lagos", town: "Akoka, Lagos", active: false, latitude: 6.5168, longitude: 3.3845 },
  { id: "ui", name: "University of Ibadan", town: "Ibadan", active: false, latitude: 7.4419, longitude: 3.9043 },
  { id: "oau", name: "Obafemi Awolowo University", town: "Ile-Ife", active: false, latitude: 7.5218, longitude: 4.5231 },
  { id: "uniben", name: "University of Benin", town: "Benin City", active: false, latitude: 6.3973, longitude: 5.6136 },
  { id: "covenant", name: "Covenant University", town: "Ota", active: false, latitude: 6.6718, longitude: 3.1581 },
];

export const ACTIVE_CAMPUS = CAMPUSES[0];
