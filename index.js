const exerciseData = {
    criancas: {
      "perder-peso": [
        "Pular corda (3 minutos)",
        "Corrida leve brincando (5 minutos)",
        "Brincadeiras de pega-pega ou esconde-esconde (15 minutos)"
      ],
      "ganhar-musculo": [
        "Subir e descer escadas (5 minutos)",
        "Flexões apoiadas nos joelhos (2 séries de 5 repetições)",
        "Agachamentos simples sem peso (2 séries de 8 repetições)"
      ],
      "bem-estar": [
        "Alongamento lúdico (10 minutos com música)",
        "Yoga infantil (10 minutos)",
        "Caminhada leve com a família (15 minutos)"
      ]
    },
    adolescentes: {
      "perder-peso": [
        "Caminhada moderada (15 minutos)",
        "Dança aeróbica (10 minutos)",
        "Bicicleta ao ar livre (20 minutos)"
      ],
      "ganhar-musculo": [
        "Agachamentos simples sem peso (3 séries de 10 repetições)",
        "Flexões apoiadas (3 séries de 8 repetições)",
        "Exercício com elásticos de resistência (10 minutos)"
      ],
      "bem-estar": [
        "Alongamentos após a escola (10 minutos)",
        "Caminhada leve com amigos (15 minutos)",
        "Yoga iniciante (15 minutos)"
      ]
    },
    adultos: {
      "perder-peso": [
        "Corrida moderada (20 minutos)",
        "Treino HIIT (15 minutos de intervalos de alta e baixa intensidade)",
        "Subir escadas rápido (10 minutos)"
      ],
      "ganhar-musculo": [
        "Agachamento com peso corporal (3 séries de 12 repetições)",
        "Flexões de braço padrão (3 séries de 10 repetições)",
        "Treino com halteres leves (3 séries de 12 repetições para braços)"
      ],
      "bem-estar": [
        "Yoga intermediária (20 minutos)",
        "Caminhada ao ar livre (30 minutos)",
        "Alongamentos matinais (10 minutos)"
      ]
    },
    idosos: {
      "perder-peso": [
        "Caminhada em ritmo leve (20 minutos)",
        "Exercícios na água (hidroginástica leve - 20 minutos)",
        "Bicicleta ergométrica em intensidade leve (15 minutos)"
      ],
      "ganhar-musculo": [
        "Levantamento de pequenos pesos (2 séries de 10 repetições)",
        "Agachamentos assistidos com apoio de cadeira (2 séries de 8 repetições)",
        "Treino com elásticos leves (15 minutos)"
      ],
      "bem-estar": [
        "Yoga suave para mobilidade (15 minutos)",
        "Alongamentos para idosos (15 minutos)",
        "Caminhada social com amigos (20 minutos)"
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
  