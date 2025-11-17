import type { AgeGroup, Goal } from '@/data/exerciseData';

const DEFAULT_API_BASE_URL = 'http://localhost:5000/api';

type ExerciseResponse = {
  exercises?: string[];
};

export async function getExercises(
  ageGroup: AgeGroup,
  goal: Goal,
  fallback: string[]
): Promise<string[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;
  const url = `${baseUrl}/exercises?age=${ageGroup}&goal=${goal}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = (await response.json()) as ExerciseResponse;

    if (Array.isArray(data.exercises) && data.exercises.length > 0) {
      return data.exercises;
    }
  } catch (error) {
    console.error('Erro ao buscar exercícios na API Flask:', error);
  }

  return fallback;
}
