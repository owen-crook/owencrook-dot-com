export type ThreeDimensionalModelUrl = {
  url: string; label: string;
  description?: string
};

export type ThreeDimensionalModel = {
  label: string; file: string;
  urls?: ThreeDimensionalModelUrl[];
  numberOfPhotos?: number;  // Number of photos associated with the model
  rotation?: {
    x: number; y: number; z: number
  };  // Optional rotation values for orientations
};