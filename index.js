// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  body.setAttribute('data-theme', savedTheme);
}

themeToggle.addEventListener('click', () => {
  const currentTheme = body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

// Form Elements
const ageSelect = document.getElementById('age');
const goalSelect = document.getElementById('goal');
const showExercisesBtn = document.getElementById('show-exercises');
const exerciseList = document.getElementById('exercise-list');
const loadingContainer = document.getElementById('loading');
const randomExerciseBtn = document.getElementById('random-exercise');
const printExercisesBtn = document.getElementById('print-exercises');
const backToTopBtn = document.getElementById('back-to-top');

const API_BASE = '/api';

function updateShowExercisesButton() {
  showExercisesBtn.disabled = !ageSelect.value || !goalSelect.value;
}

ageSelect.addEventListener('change', updateShowExercisesButton);
goalSelect.addEventListener('change', updateShowExercisesButton);

function showLoading() {
  loadingContainer.style.display = 'flex';
  exerciseList.style.display = 'none';
}

function hideLoading() {
  loadingContainer.style.display = 'none';
  exerciseList.style.display = 'block';
}

function renderExercises(exercises) {
  if (!exercises || exercises.length === 0) {
    exerciseList.innerHTML = '<li>Nenhum exercício encontrado.</li>';
    return;
  }

  exerciseList.innerHTML = exercises
    .map((exercise) => {
      const durationMatch = exercise.match(/\((\d+)\s*minutos?\)/);
      const duration = durationMatch ? durationMatch[1] : '15';

      let caloriesPerMinute = 5;
      const lowerExercise = exercise.toLowerCase();

      if (
        lowerExercise.includes('corrida') ||
        lowerExercise.includes('hiit') ||
        lowerExercise.includes('aeróbica')
      ) {
        caloriesPerMinute = 10;
      } else if (
        lowerExercise.includes('caminhada') ||
        lowerExercise.includes('yoga') ||
        lowerExercise.includes('alongamento') ||
        lowerExercise.includes('meditação')
      ) {
        caloriesPerMinute = 3;
      } else if (
        lowerExercise.includes('natação') ||
        lowerExercise.includes('bicicleta') ||
        lowerExercise.includes('dança')
      ) {
        caloriesPerMinute = 7;
      } else if (
        lowerExercise.includes('musculo') ||
        lowerExercise.includes('força') ||
        lowerExercise.includes('treino')
      ) {
        caloriesPerMinute = 6;
      }

      const calories = Math.round(parseInt(duration, 10) * caloriesPerMinute);

      return `
      <li>
        <div class="exercise-main">${exercise}</div>
        <div class="exercise-info">
          <span><i class="fas fa-clock"></i> ${duration} min</span>
          <span><i class="fas fa-fire"></i> ~${calories} kcal</span>
        </div>
      </li>
    `;
    })
    .join('');
}

async function fetchExercises(age, goal) {
  const params = new URLSearchParams({ age, goal });
  const response = await fetch(`${API_BASE}/exercises?${params.toString()}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Não foi possível carregar os exercícios.');
  }

  return response.json();
}

showExercisesBtn.addEventListener('click', async () => {
  if (!ageSelect.value || !goalSelect.value) return;

  showLoading();

  try {
    const data = await fetchExercises(ageSelect.value, goalSelect.value);
    renderExercises(data.exercises);
  } catch (error) {
    exerciseList.innerHTML = `<li class="error">${error.message}</li>`;
  } finally {
    hideLoading();
  }
});

// Back to Top Button
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Print Exercises
printExercisesBtn.addEventListener('click', () => {
  const printWindow = window.open('', '_blank');
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
        ${exerciseList.innerHTML}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
});

// Random Exercise
randomExerciseBtn.addEventListener('click', () => {
  const exercises = exerciseList.getElementsByTagName('li');
  if (exercises.length > 0) {
    Array.from(exercises).forEach(exercise => {
      exercise.classList.remove('highlighted');
    });

    const randomIndex = Math.floor(Math.random() * exercises.length);
    const selectedExercise = exercises[randomIndex];

    selectedExercise.classList.add('highlighted');

    selectedExercise.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });

    setTimeout(() => {
      selectedExercise.classList.remove('highlighted');
    }, 3000);
  }
});

const style = document.createElement('style');
style.textContent = `
  @keyframes highlight {
    0% { background-color: var(--primary-color); color: white; }
    50% { background-color: var(--primary-color); color: white; }
    100% { background-color: transparent; color: var(--text-color); }
  }
`;
document.head.appendChild(style);

// Disable button initially
showExercisesBtn.disabled = true;
updateShowExercisesButton();
