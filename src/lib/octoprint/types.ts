export interface OctoprintConfig {
  name: string;
  make: string;
  model: string;
  color: string;
  address: string;
  apiKey: string;
  hasWebcam: boolean;
}

export interface SDCardState {
  ready: boolean;
}

export interface PrinterStateFlags {
  cancelling: boolean;
  closedOrError: boolean;
  error: boolean;
  finishing: boolean;
  operational: boolean;
  paused: boolean;
  pausing: boolean;
  printing: boolean;
  ready: boolean;
  resuming: boolean;
  sdReady: boolean;
}

export interface PrinterState {
  error: string;
  flags: PrinterStateFlags;
  text: 'Operational' | 'Printing' | 'Offline' | 'Connecting' | 'Closed' | 'Error' | 'Unknown';
}

export interface PrinterTemperature {
  bed: {
    actual: number;
    offset: number;
    target: number;
  };
  tool0: {
    actual: number;
    offset: number;
    target: number;
  };
  [key: string]: any;
}

export interface PrinterStatus {
  sd: SDCardState;
  state: PrinterState;
  temperature: PrinterTemperature;
}

export interface JobFile {
  name: string;
  origin: string;
  size: number;
  date: number;
}

export interface FilamentTool {
  length: number;
  volume: number;
}

export interface Filament {
  tool0: FilamentTool;
  tool1?: FilamentTool;
  tool2?: FilamentTool;
}

export interface Progress {
  completion: number;
  filepos: number;
  printTime: number;
  printTimeLeft: number;
}

export interface JobDetails {
  file: JobFile;
  estimatedPrintTime: number;
  filament: Filament;
}

export interface JobState {
  job: JobDetails;
  progress: Progress;
  state: string;
}
