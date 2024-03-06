export interface PrusaLinkConfig {
  address: string;
  apiKey: string;
  name: string;
}

interface PartTemp {
  actual: number;
  target: number;
  offset: number;
  display?: number;
}

export interface PrinterStatus {
  telemetry: {
    'temp-bed': number;
    'temp-nozzle': number;
    'print-speed': number;
    'z-height': number;
    material: string;
  };
  temperature: {
    bed: PartTemp;
    tool0: PartTemp;
    [key: string]: PartTemp;
  };
  state: {
    text: string;
    flags: {
      operational: boolean;
      paused: boolean;
      printing: boolean;
      error: boolean;
      ready: boolean;
      closedOrError: boolean;
    };
  };
}

export interface JobState {
  job: {
    estimatedPrintTime: number;
    averagePrintTime: number;
    lastPrintTime: number;
    filament: string;
    file: {
      name: string;
      path: string;
      origin: string;
      date: number;
      size: number;
      display: string;
      refs: {
        resource: string;
        thumbnailBig: string;
      };
    };
    user: string;
  };
  progress: {
    completion: number;
    filepos: number;
    printTime: number;
    printTimeLeft: number;
    pos_z_mm: number;
    printSpeed: number;
    flow_factor: number;
    printTimeLeftOrigin: string;
  };
  state: string;
}
