'use server';

import dayjs from 'dayjs';
import { PlayerScore, SupportedGames } from '@/components/BoardGameTrackerScoreCardUpload/types';

// TODO: alter API_BASE_URL value based on ENV
const API_BASE_URL = 'https://api.owencrook.com/api/v1/board-game-tracker';

type ServerActionResult<T> =
  | {
      success: true;
      data: T;
      message?: string;
    }
  | {
      success: false;
      error: string;
      details?: any;
      message?: string;
    };

interface ParseScoreCardProps {
  file: File;
  date: Date;
  game: string;
  token: string;
}

export async function postBoardGameTrackerParseScoreCard({
  file,
  date,
  game,
  token,
}: ParseScoreCardProps): Promise<ServerActionResult<any>> {
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('date', dayjs(date).format('YYYY-MM-DD'));

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(`${API_BASE_URL}/parse-score-card/${game}`, {
      method: 'POST',
      headers: headers,
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        data: data,
      };
    } else {
      const err = await response.json();
      return {
        success: false,
        error: err.error,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message || 'Internal Server Error',
    };
  }
}

interface UpdateScoreCardProps {
  documentId: string;
  token: string;
  game?: SupportedGames;
  date?: Date;
  isCompleted?: boolean;
  location?: string;
  playerScores?: PlayerScore[];
}

export async function patchBoardGameTrackerUpdateScoreCard({
  documentId,
  token,
  game,
  date,
  isCompleted,
  location,
  playerScores,
}: UpdateScoreCardProps): Promise<ServerActionResult<any>> {
  // serialize the fields, if they exist
  let anyModified: boolean = false;
  const payload: Record<string, any> = {};
  payload['id'] = documentId;
  if (game !== undefined) {
    anyModified = true;
    payload['game'] = game.valueOf().toLowerCase();
  }
  if (date !== undefined) {
    anyModified = true;
    payload['date'] = date; // TODO: unify date formats on client (API is using YYYY-MM-DD)
  }
  if (isCompleted !== undefined) {
    anyModified = true;
    payload['is_completed'] = isCompleted;
  }
  if (location !== undefined) {
    anyModified = true;
    payload['location'] = location;
  }
  if (playerScores !== undefined) {
    anyModified = true;
    payload['player_scores'] = playerScores;
  }
  if (!anyModified) {
    return {
      success: false,
      error: 'no fields modified',
    };
  }

  // make request
  const headers = { Authorization: `Bearer ${token}` };
  try {
    const response = await fetch(`${API_BASE_URL}/update-score-card/${documentId}`, {
      method: 'PATCH',
      headers: headers,
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        data: data,
      };
    } else {
      const err = await response.json();
      return {
        success: false,
        error: err.error,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message || 'Internal Server Error',
    };
  }
}
