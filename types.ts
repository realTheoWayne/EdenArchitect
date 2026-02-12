
export interface CropVariety {
  name: string;
  botanicalName?: string;
  daysToMaturity?: number;
  description?: string;
  spacing?: number;
}

export interface Crop {
  id: string;
  name: string;
  botanicalName?: string;
  variety?: string;
  type: 'vegetable' | 'fruit' | 'herb' | 'flower' | 'tree';
  daysToMaturity: number;
  sowIndoorsStart?: number; // Month index 0-11
  sowIndoorsEnd?: number;
  transplantStart?: number;
  transplantEnd?: number;
  sowOutdoorsStart?: number;
  sowOutdoorsEnd?: number;
  harvestStart?: number;
  harvestEnd?: number;
  color: string;
  icon: string;
  spacing: number; // inches needed per plant
  description: string;
  companions: string[];
  antagonists?: string[]; // Bad companions
  pests: string[];
  resistance: string[];
  varieties?: CropVariety[];
  coldHardy?: boolean;
}

export type StructureType = 'house' | 'shed' | 'garage' | 'playground' | 'path' | 'fence' | 'basic_tree';
export type BedType = 'raised_bed' | 'ground_bed' | 'pot' | 'greenhouse';

export interface GardenElement {
  id: string;
  type: 'structure' | 'bed' | 'plant' | 'zone';
  subType?: StructureType | BedType; // Specific type
  name: string;
  x: number; // Grid coordinates (ft)
  y: number;
  width: number; // ft
  height: number; // ft
  rotation: number;
  cropId?: string; // If it's a plant
  plantingDate?: string; // ISO Date for growth simulation
  sunlight?: 'full' | 'partial' | 'shade';
  color?: string; // Custom color for structures
  winterProtection?: 'none' | 'mulch' | 'cloche' | 'cold_frame' | 'fleece';
}

export interface GardenTask {
  id: string;
  title: string;
  date: string; // ISO date
  completed: boolean;
  type: 'sow' | 'transplant' | 'harvest' | 'care';
  cropName?: string;
}

export interface GardenSettings {
  zone: string;
  lastFrostDate: string;
  firstFrostDate: string;
  width: number; // feet
  height: number; // feet
  soilType: 'loam' | 'clay' | 'sandy' | 'silt' | 'peat' | 'chalk';
  averageHumidity?: number;
  soilPh?: number;
}

export interface CustomScheduleItem {
  id: string;
  title: string;
  startMonth: number;
  endMonth: number;
  type: 'sow' | 'transplant' | 'harvest' | 'care';
  color: string;
}

export interface AlmanacData {
  weatherForecast: string;
  moonPhase: string;
  bestPlantingDays: string[];
}

export type ViewMode = 'dashboard' | 'planner' | 'calendar' | 'encyclopedia' | 'consultant';
