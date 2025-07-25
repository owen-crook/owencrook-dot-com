export enum SupportedGames {
  WYRMSPAN = 'Wyrmspan',
  WINGSPAN = 'Wingspan',
}

export interface PlayerScore {
  id: string;
  name: string;
  total?: number;
  [key: string]: any;
}

export interface GameMetadata {
  id: string;
  game?: SupportedGames;
  date?: Date;
  isCompleted?: boolean;
  location?: string;
}
