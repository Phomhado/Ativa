import { useEffect, useMemo, useState } from 'react';
import styles from '@/styles/Home.module.css';
import type { AgeGroup, Goal } from '@/data/exerciseData';
import { getLocalExercises } from '@/data/exerciseData';
import { getExercises } from '@/lib/api';

type Theme = 'light' | 'dark';

type ExerciseInfo = {
  name: string;
  duration: number;
  calories: number;
};

function parseExerciseInfo(name: string): ExerciseInfo {
  const durationMatch = name.match(/\((\d+)\s*minutos?\)/);
  const duration = durationMatch ? Number(durationMatch[1]) : 15;
  const normalized = name.toLowerCase();

  let caloriesPerMinute = 5;

  if (
    normalized.includes('corrida') ||
    normalized.includes('hiit') ||
    normalized.includes('aeróbica') ||
    normalized.includes('aerobica')
  ) {
    caloriesPerMinute = 10;
  } else if (
    normalized.includes('caminhada') ||
    normalized.includes('yoga') ||
    normalized.includes('alongamento') ||
    normalized.includes('meditação') ||
    normalized.includes('meditacao')
  ) {
    caloriesPerMinute = 3;
  } else if (
    normalized.includes('natação') ||
    normalized.includes('natacao') ||
    normalized.includes('bicicleta') ||
    normalized.includes('dança') ||
    normalized.includes('danca')
  ) {
    caloriesPerMinute = 7;
  } else if (
    normalized.includes('musculo') ||
    normalized.includes('força') ||
    normalized.includes('forca') ||
    normalized.includes('treino')
  ) {
    caloriesPerMinute = 6;
  }

  return {
    name,
    duration,
    calories: Math.round(duration * caloriesPerMinute),
  };
}

export default function Home() {
  const [ageGroup, setAgeGroup] = useState<AgeGroup | ''>('');
  const [goal, setGoal] = useState<Goal | ''>('');
  const [exercises, setExercises] = useState<ExerciseInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const canShowExercises = useMemo(() => Boolean(ageGroup && goal), [ageGroup, goal]);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('theme') as Theme | null;
    if (storedTheme) {
      setTheme(storedTheme);
      document.body.setAttribute('data-theme', storedTheme);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleShowExercises = async () => {
    if (!ageGroup || !goal) return;

    setLoading(true);
    setExercises([]);

    const fallback = getLocalExercises(ageGroup, goal);
    const response = await getExercises(ageGroup, goal, fallback);
    const exercisesWithInfo = response.map(parseExerciseInfo);

    setExercises(exercisesWithInfo);
    setLoading(false);
  };

  const handleRandomExercise = () => {
    if (exercises.length === 0) return;
    const randomIndex = Math.floor(Math.random() * exercises.length);
    setHighlightedIndex(randomIndex);

    setTimeout(() => {
      setHighlightedIndex(null);
    }, 3000);
  };

  const handlePrintExercises = () => {
    if (exercises.length === 0) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const listItems = exercises
      .map(
        (exercise) => `
          <li>
            <div style="font-weight: 600;">${exercise.name}</div>
            <div style="display: flex; gap: 10px; font-size: 0.9rem;">
              <span>⏱️ ${exercise.duration} min</span>
              <span>🔥 ~${exercise.calories} kcal</span>
            </div>
          </li>
        `
      )
      .join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Exercícios Ativa+</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #6366f1; }
            ul { list-style: none; padding: 0; }
            li { margin-bottom: 20px; padding: 15px; border-left: 4px solid #6366f1; }
          </style>
        </head>
        <body>
          <h1>Exercícios Recomendados - Ativa+</h1>
          <ul>${listItems}</ul>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.themeToggle}>
          <button
            type="button"
            onClick={handleThemeToggle}
            aria-label="Alternar tema"
            className={styles.toggleButton}
          >
            <svg
              className={styles.sunIcon}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            <svg
              className={styles.moonIcon}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </button>
        </div>
        <h1 className={styles.title}>Ativa+</h1>
        <p className={styles.subtitle}>
          Escolha sua faixa etária e objetivo para ver exercícios recomendados!
        </p>
      </header>
      <main className={styles.main}>
        <section className={styles.inputSection}>
          <label htmlFor="age">Escolha sua faixa etária:</label>
          <select
            id="age"
            value={ageGroup}
            onChange={(event) => setAgeGroup(event.target.value as AgeGroup | '')}
          >
            <option value="" disabled>
              Selecione sua faixa etária
            </option>
            <option value="criancas">Crianças (6 a 12 anos)</option>
            <option value="adolescentes">Adolescentes (13 a 17 anos)</option>
            <option value="adultos">Adultos (18 a 59 anos)</option>
            <option value="idosos">Idosos (60+ anos)</option>
          </select>
        </section>
        <section className={styles.inputSection}>
          <label htmlFor="goal">Escolha seu objetivo:</label>
          <select
            id="goal"
            value={goal}
            onChange={(event) => setGoal(event.target.value as Goal | '')}
          >
            <option value="" disabled>
              Selecione seu objetivo
            </option>
            <option value="perder-peso">Perder Peso</option>
            <option value="ganhar-musculo">Ganhar Músculo</option>
            <option value="bem-estar">Bem-Estar</option>
            <option value="desenvolvimento-motor">Desenvolvimento Motor</option>
            <option value="postura">Postura</option>
            <option value="saude-cardiovascular">Saúde Cardiovascular</option>
            <option value="reducao-estresse">Redução de Estresse</option>
            <option value="prevencao-quedas">Prevenção de Quedas</option>
            <option value="saude-articular">Saúde Articular</option>
          </select>
        </section>
        <button type="button" disabled={!canShowExercises || loading} onClick={handleShowExercises}>
          {loading ? 'Carregando...' : 'Mostrar Exercícios'}
        </button>

        {loading && (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Carregando exercícios...</p>
          </div>
        )}

        <section className={styles.exercises} aria-live="polite">
          <h2>Exercícios Recomendados:</h2>
          <div className={styles.exerciseControls}>
            <button type="button" onClick={handleRandomExercise} className={styles.secondaryButton}>
              <i className="fas fa-random" aria-hidden /> Exercício Aleatório
            </button>
            <button type="button" onClick={handlePrintExercises} className={styles.secondaryButton}>
              <i className="fas fa-print" aria-hidden /> Imprimir
            </button>
          </div>
          <ul className={styles.exerciseList}>
            {exercises.map((exercise, index) => (
              <li
                key={exercise.name}
                className={`${styles.exerciseCard} ${
                  highlightedIndex === index ? styles.highlighted : ''
                }`}
              >
                <div className={styles.exerciseMain}>{exercise.name}</div>
                <div className={styles.exerciseInfo}>
                  <span>
                    <i className="fas fa-clock" aria-hidden /> {exercise.duration} min
                  </span>
                  <span>
                    <i className="fas fa-fire" aria-hidden /> ~{exercise.calories} kcal
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <button
          type="button"
          aria-label="Voltar ao topo"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`${styles.backToTop} ${showBackToTop ? styles.backToTopVisible : ''}`}
        >
          <i className="fas fa-arrow-up" aria-hidden />
        </button>
      </main>
      <footer className={styles.footer}>
        <p className={`${styles.footerText} ${styles.footerTextPrimary}`}>
          Transforme o corpo e melhore a vida de todos!
        </p>
        <p className={styles.footerText}>&copy; 2025 Ativa+. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
