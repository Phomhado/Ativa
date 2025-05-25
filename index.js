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

// Enable/Disable Show Exercises Button
function updateShowExercisesButton() {
  showExercisesBtn.disabled = !ageSelect.value || !goalSelect.value;
}

ageSelect.addEventListener('change', updateShowExercisesButton);
goalSelect.addEventListener('change', updateShowExercisesButton);

// Show Loading Animation
function showLoading() {
  loadingContainer.style.display = 'flex';
  exerciseList.style.display = 'none';
}

function hideLoading() {
  loadingContainer.style.display = 'none';
  exerciseList.style.display = 'block';
}

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
    // Remove previous highlight
    Array.from(exercises).forEach(exercise => {
      exercise.classList.remove('highlighted');
    });

    const randomIndex = Math.floor(Math.random() * exercises.length);
    const selectedExercise = exercises[randomIndex];
    
    // Add highlight class
    selectedExercise.classList.add('highlighted');
    
    // Scroll to the selected exercise
    selectedExercise.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });

    // Remove highlight class after animation
    setTimeout(() => {
      selectedExercise.classList.remove('highlighted');
    }, 3000); // Increased to 3 seconds
  }
});

// Add highlight animation
const style = document.createElement('style');
style.textContent = `
  @keyframes highlight {
    0% { background-color: var(--primary-color); color: white; }
    50% { background-color: var(--primary-color); color: white; }
    100% { background-color: transparent; color: var(--text-color); }
  }
`;
document.head.appendChild(style);

// Show Exercises
showExercisesBtn.addEventListener('click', async () => {
  showLoading();
  
  // Simulate loading delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const age = ageSelect.value;
  const goal = goalSelect.value;
  
  const exercises = exerciseData[age]?.[goal] || [];
  
  exerciseList.innerHTML = exercises.map(exercise => {
    // Extract duration from exercise string (e.g., "Corrida (20 minutos)" -> "20")
    const durationMatch = exercise.match(/\((\d+)\s*minutos?\)/);
    const duration = durationMatch ? durationMatch[1] : "15"; // Default 15 minutes if not specified
    
    // Calculate calories based on exercise type and duration
    let caloriesPerMinute = 5; // Default moderate intensity
    
    // Adjust calories based on exercise intensity
    if (exercise.toLowerCase().includes('corrida') || 
        exercise.toLowerCase().includes('hiit') || 
        exercise.toLowerCase().includes('aeróbica')) {
      caloriesPerMinute = 10; // High intensity
    } else if (exercise.toLowerCase().includes('caminhada') || 
               exercise.toLowerCase().includes('yoga') || 
               exercise.toLowerCase().includes('alongamento') ||
               exercise.toLowerCase().includes('meditação')) {
      caloriesPerMinute = 3; // Low intensity
    } else if (exercise.toLowerCase().includes('natação') || 
               exercise.toLowerCase().includes('bicicleta') || 
               exercise.toLowerCase().includes('dança')) {
      caloriesPerMinute = 7; // Medium-high intensity
    } else if (exercise.toLowerCase().includes('musculo') || 
               exercise.toLowerCase().includes('força') || 
               exercise.toLowerCase().includes('treino')) {
      caloriesPerMinute = 6; // Medium intensity
    }
    
    // Calculate total calories
    const calories = Math.round(parseInt(duration) * caloriesPerMinute);
    
    return `
      <li>
        <div class="exercise-main">${exercise}</div>
        <div class="exercise-info">
          <span><i class="fas fa-clock"></i> ${duration} min</span>
          <span><i class="fas fa-fire"></i> ~${calories} kcal</span>
        </div>
      </li>
    `;
  }).join('');
  
  hideLoading();
});

// Save Favorite
function saveFavorite(exerciseName) {
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  if (!favorites.includes(exerciseName)) {
    favorites.push(exerciseName);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Exercício adicionado aos favoritos!');
  } else {
    alert('Este exercício já está nos favoritos!');
  }
}

const exerciseData = {
    criancas: {
      "perder-peso": [
        "Pular corda (3 minutos)",
        "Corrida leve brincando (5 minutos)",
        "Brincadeiras de pega-pega ou esconde-esconde (15 minutos)",
        "Jogos com bola (15 minutos)",
        "Dança infantil (10 minutos)",
        "Circuito de obstáculos simples (10 minutos)"
      ],
      "ganhar-musculo": [
        "Subir e descer escadas (5 minutos)",
        "Flexões apoiadas nos joelhos (2 séries de 5 repetições)",
        "Agachamentos simples sem peso (2 séries de 8 repetições)",
        "Exercícios de equilíbrio (5 minutos)",
        "Jogos de arremesso (10 minutos)",
        "Treino funcional infantil (10 minutos)"
      ],
      "bem-estar": [
        "Alongamento lúdico (10 minutos com música)",
        "Yoga infantil (10 minutos)",
        "Caminhada leve com a família (15 minutos)",
        "Natação recreativa (20 minutos)",
        "Jogos cooperativos (15 minutos)",
        "Meditação guiada para crianças (5 minutos)"
      ],
      "desenvolvimento-motor": [
        "Exercícios de coordenação (10 minutos)",
        "Jogos de destreza manual (10 minutos)",
        "Atividades de equilíbrio (10 minutos)",
        "Brincadeiras com bola (15 minutos)",
        "Exercícios de ritmo e dança (10 minutos)",
        "Circuito psicomotor (15 minutos)"
      ],
      "postura": [
        "Exercícios de postura lúdicos (10 minutos)",
        "Alongamentos para crianças (10 minutos)",
        "Jogos de consciência corporal (10 minutos)",
        "Exercícios de equilíbrio (10 minutos)",
        "Yoga infantil para postura (10 minutos)",
        "Brincadeiras que estimulam boa postura (15 minutos)"
      ],
      "saude-cardiovascular": [
        "Jogos ativos (15 minutos)",
        "Corrida leve (10 minutos)",
        "Natação recreativa (20 minutos)",
        "Bicicleta (15 minutos)",
        "Dança infantil (15 minutos)",
        "Brincadeiras aeróbicas (15 minutos)"
      ],
      "reducao-estresse": [
        "Yoga infantil (10 minutos)",
        "Meditação guiada para crianças (5 minutos)",
        "Respiração lúdica (5 minutos)",
        "Alongamentos relaxantes (10 minutos)",
        "Atividades artísticas (15 minutos)",
        "Jogos cooperativos (15 minutos)"
      ],
      "prevencao-quedas": [
        "Exercícios de equilíbrio (10 minutos)",
        "Jogos de coordenação (10 minutos)",
        "Atividades de agilidade (10 minutos)",
        "Exercícios de consciência corporal (10 minutos)",
        "Brincadeiras de destreza (15 minutos)",
        "Circuito de habilidades motoras (15 minutos)"
      ],
      "saude-articular": [
        "Alongamentos suaves (10 minutos)",
        "Exercícios de mobilidade (10 minutos)",
        "Jogos de flexibilidade (10 minutos)",
        "Yoga infantil (10 minutos)",
        "Dança recreativa (15 minutos)",
        "Atividades aquáticas (20 minutos)"
      ]
    },
    adolescentes: {
      "perder-peso": [
        "Caminhada moderada (15 minutos)",
        "Dança aeróbica (10 minutos)",
        "Bicicleta ao ar livre (20 minutos)",
        "Natação (20 minutos)",
        "Treino HIIT adaptado (15 minutos)",
        "Esportes coletivos (30 minutos)"
      ],
      "ganhar-musculo": [
        "Agachamentos simples sem peso (3 séries de 10 repetições)",
        "Flexões apoiadas (3 séries de 8 repetições)",
        "Exercício com elásticos de resistência (10 minutos)",
        "Prancha (3 séries de 30 segundos)",
        "Exercícios com peso corporal (15 minutos)",
        "Treino funcional (20 minutos)"
      ],
      "bem-estar": [
        "Alongamentos após a escola (10 minutos)",
        "Caminhada leve com amigos (15 minutos)",
        "Yoga iniciante (15 minutos)",
        "Meditação guiada (10 minutos)",
        "Pilates básico (20 minutos)",
        "Tai Chi Chuan (15 minutos)"
      ],
      "desenvolvimento-motor": [
        "Exercícios de coordenação (15 minutos)",
        "Treino de agilidade (15 minutos)",
        "Esportes coletivos (30 minutos)",
        "Exercícios de equilíbrio (15 minutos)",
        "Treino funcional (20 minutos)",
        "Atividades de destreza (15 minutos)"
      ],
      "postura": [
        "Exercícios para coluna (15 minutos)",
        "Alongamento específico para postura (10 minutos)",
        "Fortalecimento do core (15 minutos)",
        "Yoga para postura (15 minutos)",
        "Exercícios de mobilidade (10 minutos)",
        "Pilates para postura (20 minutos)"
      ],
      "saude-cardiovascular": [
        "Corrida moderada (20 minutos)",
        "Natação (25 minutos)",
        "Ciclismo (20 minutos)",
        "Treino HIIT adaptado (15 minutos)",
        "Esportes coletivos (30 minutos)",
        "Dança aeróbica (20 minutos)"
      ],
      "reducao-estresse": [
        "Yoga (15 minutos)",
        "Meditação guiada (10 minutos)",
        "Respiração profunda (10 minutos)",
        "Alongamentos relaxantes (15 minutos)",
        "Tai Chi Chuan (15 minutos)",
        "Exercícios de mindfulness (10 minutos)"
      ],
      "prevencao-quedas": [
        "Exercícios de equilíbrio (15 minutos)",
        "Treino de agilidade (15 minutos)",
        "Fortalecimento de membros inferiores (15 minutos)",
        "Exercícios de coordenação (15 minutos)",
        "Treino funcional (20 minutos)",
        "Esportes de precisão (20 minutos)"
      ],
      "saude-articular": [
        "Alongamentos dinâmicos (15 minutos)",
        "Exercícios de mobilidade (15 minutos)",
        "Yoga (20 minutos)",
        "Pilates (20 minutos)",
        "Natação (25 minutos)",
        "Exercícios com elásticos (15 minutos)"
      ]
    },
    adultos: {
      "perder-peso": [
        "Corrida moderada (20 minutos)",
        "Treino HIIT (15 minutos de intervalos de alta e baixa intensidade)",
        "Subir escadas rápido (10 minutos)",
        "Natação (30 minutos)",
        "Ciclismo (25 minutos)",
        "Treino funcional (20 minutos)"
      ],
      "ganhar-musculo": [
        "Agachamento com peso corporal (3 séries de 12 repetições)",
        "Flexões de braço padrão (3 séries de 10 repetições)",
        "Treino com halteres leves (3 séries de 12 repetições para braços)",
        "Prancha (3 séries de 45 segundos)",
        "Remada com elástico (3 séries de 12 repetições)",
        "Treino de força completo (30 minutos)"
      ],
      "bem-estar": [
        "Yoga intermediária (20 minutos)",
        "Caminhada ao ar livre (30 minutos)",
        "Alongamentos matinais (10 minutos)",
        "Pilates (30 minutos)",
        "Meditação (15 minutos)",
        "Tai Chi Chuan (20 minutos)"
      ],
      "desenvolvimento-motor": [
        "Treino de coordenação (20 minutos)",
        "Exercícios de agilidade (20 minutos)",
        "Treino funcional (25 minutos)",
        "Esportes coletivos (30 minutos)",
        "Exercícios de equilíbrio (15 minutos)",
        "Treino de destreza (20 minutos)"
      ],
      "postura": [
        "Exercícios para coluna (20 minutos)",
        "Fortalecimento do core (20 minutos)",
        "Yoga para postura (20 minutos)",
        "Pilates (30 minutos)",
        "Alongamentos específicos (15 minutos)",
        "Exercícios de mobilidade (15 minutos)"
      ],
      "saude-cardiovascular": [
        "Caminhada rápida (30 minutos)",
        "Ciclismo moderado (25 minutos)",
        "Natação (30 minutos)",
        "Treino cardio moderado (20 minutos)",
        "Dança aeróbica (25 minutos)",
        "Exercícios aquáticos (30 minutos)"
      ],
      "reducao-estresse": [
        "Yoga suave (20 minutos)",
        "Meditação guiada (15 minutos)",
        "Respiração profunda (10 minutos)",
        "Tai Chi Chuan (20 minutos)",
        "Alongamento relaxante (15 minutos)",
        "Caminhada meditativa (20 minutos)"
      ],
      "prevencao-quedas": [
        "Exercícios de equilíbrio (20 minutos)",
        "Fortalecimento de membros inferiores (20 minutos)",
        "Treino de marcha (15 minutos)",
        "Exercícios de coordenação (15 minutos)",
        "Tai Chi Chuan (20 minutos)",
        "Treino funcional (25 minutos)"
      ],
      "saude-articular": [
        "Alongamentos dinâmicos (20 minutos)",
        "Exercícios de mobilidade (20 minutos)",
        "Yoga (25 minutos)",
        "Pilates (30 minutos)",
        "Natação (30 minutos)",
        "Exercícios com elásticos (20 minutos)"
      ]
    },
    idosos: {
      "perder-peso": [
        "Caminhada em ritmo leve (20 minutos)",
        "Exercícios na água (hidroginástica leve - 20 minutos)",
        "Bicicleta ergométrica em intensidade leve (15 minutos)",
        "Dança adaptada (20 minutos)",
        "Tai Chi Chuan (20 minutos)",
        "Exercícios com bola suíça (15 minutos)"
      ],
      "ganhar-musculo": [
        "Levantamento de pequenos pesos (2 séries de 10 repetições)",
        "Agachamentos assistidos com apoio de cadeira (2 séries de 8 repetições)",
        "Treino com elásticos leves (15 minutos)",
        "Exercícios de resistência com peso corporal (15 minutos)",
        "Fortalecimento com bola suíça (15 minutos)",
        "Treino funcional adaptado (20 minutos)"
      ],
      "bem-estar": [
        "Yoga suave para mobilidade (15 minutos)",
        "Alongamentos para idosos (15 minutos)",
        "Caminhada social com amigos (20 minutos)",
        "Pilates adaptado (20 minutos)",
        "Meditação guiada (10 minutos)",
        "Exercícios de equilíbrio (15 minutos)"
      ],
      "desenvolvimento-motor": [
        "Exercícios de coordenação suave (15 minutos)",
        "Atividades de destreza manual (15 minutos)",
        "Exercícios de equilíbrio (15 minutos)",
        "Dança adaptada (20 minutos)",
        "Tai Chi Chuan (20 minutos)",
        "Exercícios com bola suíça (15 minutos)"
      ],
      "postura": [
        "Exercícios para coluna adaptados (15 minutos)",
        "Alongamentos específicos para idosos (15 minutos)",
        "Fortalecimento do core suave (15 minutos)",
        "Yoga adaptada (20 minutos)",
        "Pilates suave (20 minutos)",
        "Exercícios de mobilidade (15 minutos)"
      ],
      "saude-cardiovascular": [
        "Caminhada leve (20 minutos)",
        "Hidroginástica (25 minutos)",
        "Bicicleta ergométrica (15 minutos)",
        "Dança adaptada (20 minutos)",
        "Tai Chi Chuan (20 minutos)",
        "Exercícios aquáticos (25 minutos)"
      ],
      "reducao-estresse": [
        "Yoga suave (15 minutos)",
        "Meditação guiada (10 minutos)",
        "Respiração profunda (10 minutos)",
        "Tai Chi Chuan (20 minutos)",
        "Alongamentos relaxantes (15 minutos)",
        "Caminhada meditativa (15 minutos)"
      ],
      "prevencao-quedas": [
        "Exercícios de equilíbrio (15 minutos)",
        "Fortalecimento de membros inferiores (15 minutos)",
        "Tai Chi Chuan (20 minutos)",
        "Exercícios de coordenação (15 minutos)",
        "Treino de marcha (15 minutos)",
        "Exercícios com bola suíça (15 minutos)"
      ],
      "saude-articular": [
        "Hidroginástica (30 minutos)",
        "Alongamentos suaves (15 minutos)",
        "Exercícios de mobilidade articular (15 minutos)",
        "Yoga adaptada (20 minutos)",
        "Pilates suave (20 minutos)",
        "Exercícios com elásticos (15 minutos)"
      ]
    }
  };
  
  document.getElementById("age").addEventListener("change", toggleButton);
  document.getElementById("goal").addEventListener("change", toggleButton);
  
  function toggleButton() {
    const ageGroup = document.getElementById("age").value;
    const goal = document.getElementById("goal").value;
    const button = document.getElementById("show-exercises");
    button.disabled = !ageGroup || !goal;
  }
  
  // Inicialmente desabilitar o botão
  document.getElementById("show-exercises").disabled = true;
  
  document.getElementById("show-exercises").addEventListener("click", () => {
    const exerciseList = document.getElementById("exercise-list");
    exerciseList.innerHTML = "<li>Carregando...</li>"; // Mensagem temporária
  
    const ageGroup = document.getElementById("age").value;
    const goal = document.getElementById("goal").value;
    const exercises = exerciseData[ageGroup][goal];
  
    exerciseList.innerHTML = ""; // Limpar "Carregando..."
    exercises.forEach(exercise => {
      const listItem = document.createElement("li");
      listItem.textContent = exercise;
      exerciseList.appendChild(listItem);
    });
  });
  