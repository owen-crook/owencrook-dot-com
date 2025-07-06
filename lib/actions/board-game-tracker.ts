'use server';
import dayjs from 'dayjs';

// TODO: alter API_BASE_URL value based on ENV
const API_BASE_URL = 'https://api.owencrook.com/api/v1/board-game-tracker';

interface ParseScoreCardProps {
  file: File
  date: Date
  game: string
  token: string
}

type ServerActionResult<T> =|{
  success: true;
  data: T;
  message?: string
}
|{
  success: false;
  error: string;
  details?: any;
  message?: string
};
export async function postBoardGameTrackerParseScoreCard(
    {file, date, game, token}: ParseScoreCardProps):
    Promise<ServerActionResult<any>> {
  try {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('date', dayjs(date).format('YYYY-MM-DD'))

    const headers = {
      Authorization: `Bearer ${token}`
    }

    const response = await fetch(
        `${API_BASE_URL}/parse-score-card/${game}`,
        {method: 'POST', headers: headers, body: formData})

    if (response.ok) {
      const data = await response.json();
      return {
        success: true, data: data
      }
    }
    else {
      const err = await response.json();
      return {
        success: false, error: err.error
      }
    }
  } catch (error) {
    return {
      success: false, error: (error as Error).message || 'Internal Server Error'
    }
  }
}