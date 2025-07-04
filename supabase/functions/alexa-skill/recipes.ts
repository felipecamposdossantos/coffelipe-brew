
// Simplified recipes data for Alexa Skill
export const defaultRecipes = [
  {
    id: "v60-classic",
    name: "V60 Clássico",
    method: "V60",
    description: "Receita clássica do V60 para um café equilibrado",
    coffeeRatio: 22,
    waterRatio: 350,
    waterTemperature: 94,
    steps: [
      {
        id: "1",
        name: "Molhar o filtro",
        instruction: "Molhe o filtro com água quente para remover o gosto de papel",
        duration: 30,
        waterAmount: 50
      },
      {
        id: "2", 
        name: "Primeira florada",
        instruction: "Despeje água em movimentos circulares do centro para fora, criando uma florada",
        duration: 45,
        waterAmount: 70
      },
      {
        id: "3",
        name: "Segunda despejada",
        instruction: "Continue despejando água em movimentos circulares lentos",
        duration: 60,
        waterAmount: 120
      },
      {
        id: "4",
        name: "Despejada final",
        instruction: "Finalize com a última despejada de água, mantendo o movimento circular",
        duration: 75,
        waterAmount: 110
      }
    ]
  },
  {
    id: "french-press-classic",
    name: "Prensa Francesa",
    method: "French Press",
    description: "Método simples e saboroso com prensa francesa",
    coffeeRatio: 30,
    waterRatio: 500,
    waterTemperature: 96,
    steps: [
      {
        id: "1",
        name: "Aquecer a prensa",
        instruction: "Aqueça a prensa francesa com água quente",
        duration: 30,
        waterAmount: 0
      },
      {
        id: "2",
        name: "Adicionar café",
        instruction: "Adicione o café moído grosso na prensa",
        duration: 15,
        waterAmount: 0
      },
      {
        id: "3",
        name: "Primeira água",
        instruction: "Despeje metade da água e mexa gentilmente",
        duration: 30,
        waterAmount: 250
      },
      {
        id: "4",
        name: "Completar água",
        instruction: "Complete com o restante da água",
        duration: 15,
        waterAmount: 250
      },
      {
        id: "5",
        name: "Infusão",
        instruction: "Aguarde a infusão sem mexer",
        duration: 240,
        waterAmount: 0
      },
      {
        id: "6",
        name: "Pressionar",
        instruction: "Pressione o êmbolo lentamente para baixo",
        duration: 30,
        waterAmount: 0
      }
    ]
  },
  {
    id: "aeropress-classic",
    name: "AeroPress",
    method: "AeroPress",
    description: "Método rápido e versátil com AeroPress",
    coffeeRatio: 18,
    waterRatio: 250,
    waterTemperature: 85,
    steps: [
      {
        id: "1",
        name: "Preparar AeroPress",
        instruction: "Monte o AeroPress com filtro molhado",
        duration: 30,
        waterAmount: 0
      },
      {
        id: "2",
        name: "Adicionar café",
        instruction: "Adicione o café moído médio-fino",
        duration: 15,
        waterAmount: 0
      },
      {
        id: "3",
        name: "Primeira água",
        instruction: "Despeje água até a marca 1 e mexa rapidamente",
        duration: 10,
        waterAmount: 125
      },
      {
        id: "4",
        name: "Completar água",
        instruction: "Complete a água até a marca desejada",
        duration: 10,
        waterAmount: 125
      },
      {
        id: "5",
        name: "Infusão",
        instruction: "Aguarde a infusão",
        duration: 60,
        waterAmount: 0
      },
      {
        id: "6",
        name: "Pressionar",
        instruction: "Pressione suavemente em 30 segundos",
        duration: 30,
        waterAmount: 0
      }
    ]
  }
];
