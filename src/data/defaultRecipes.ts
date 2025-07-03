
import { Recipe } from "@/pages/Index";

export const defaultRecipes: Recipe[] = [
  {
    id: "v60-classic",
    name: "V60 Clássico",
    description: "Método tradicional para um café limpo e aromático",
    method: "V60",
    coffeeRatio: 20,
    waterRatio: 300,
    waterTemperature: 94,
    grinderBrand: "Comandante",
    grinderClicks: 18,
    paperBrand: "Hario V60",
    steps: [
      {
        name: "Pré-infusão",
        duration: 30,
        instruction: "Molhe o café com 40ml de água e aguarde a florada",
        waterAmount: 40
      },
      {
        name: "Primeira despejo",
        duration: 30,
        instruction: "Despeje 100ml de água em movimentos circulares",
        waterAmount: 100
      },
      {
        name: "Segunda despejo",
        duration: 45,
        instruction: "Adicione mais 80ml de água mantendo o fluxo constante",
        waterAmount: 80
      },
      {
        name: "Despejo final",
        duration: 45,
        instruction: "Complete com os 80ml restantes e aguarde drenar",
        waterAmount: 80
      }
    ]
  },
  {
    id: "melita",
    name: "Melita",
    description: "Método tradicional alemão com filtro cônico para café equilibrado",
    method: "Melita",
    coffeeRatio: 22,
    waterRatio: 350,
    waterTemperature: 92,
    grinderBrand: "Timemore C2",
    grinderClicks: 20,
    paperBrand: "Melitta Original",
    steps: [
      {
        name: "Preparação do filtro",
        duration: 30,
        instruction: "Coloque o filtro no porta-filtro e pré-aqueça com água quente",
        waterAmount: 0
      },
      {
        name: "Pré-infusão",
        duration: 30,
        instruction: "Adicione 50ml de água no café moído médio e aguarde 30 segundos",
        waterAmount: 50
      },
      {
        name: "Primeiro despejo",
        duration: 60,
        instruction: "Despeje 150ml de água em movimentos circulares lentos",
        waterAmount: 150
      },
      {
        name: "Segundo despejo",
        duration: 60,
        instruction: "Adicione mais 100ml mantendo o fluxo constante",
        waterAmount: 100
      },
      {
        name: "Despejo final",
        duration: 45,
        instruction: "Complete com os 50ml restantes e aguarde drenar completamente",
        waterAmount: 50
      }
    ]
  },
  {
    id: "french-press",
    name: "French Press",
    description: "Café encorpado com 4 minutos de infusão",
    method: "French Press",
    coffeeRatio: 30,
    waterRatio: 500,
    waterTemperature: 96,
    grinderBrand: "Baratza Encore",
    grinderClicks: 30,
    steps: [
      {
        name: "Infusão",
        duration: 240,
        instruction: "Adicione toda a água quente e deixe em infusão por 4 minutos",
        waterAmount: 500
      },
      {
        name: "Misturar",
        duration: 10,
        instruction: "Mexa delicadamente para homogeneizar",
        waterAmount: 0
      },
      {
        name: "Pressionar",
        duration: 20,
        instruction: "Pressione o pistão lentamente até o fundo",
        waterAmount: 0
      }
    ]
  },
  {
    id: "aeropress",
    name: "AeroPress",
    description: "Método rápido para um café concentrado e suave",
    method: "AeroPress",
    coffeeRatio: 15,
    waterRatio: 200,
    waterTemperature: 85,
    grinderBrand: "1Zpresso JX-Pro",
    grinderClicks: 15,
    paperBrand: "AeroPress Original",
    steps: [
      {
        name: "Pré-infusão",
        duration: 30,
        instruction: "Adicione 50ml de água e mexa por 10 segundos",
        waterAmount: 50
      },
      {
        name: "Adição de água",
        duration: 15,
        instruction: "Complete com o restante da água até 200ml",
        waterAmount: 150
      },
      {
        name: "Infusão",
        duration: 60,
        instruction: "Aguarde 1 minuto sem mexer",
        waterAmount: 0
      },
      {
        name: "Pressão",
        duration: 30,
        instruction: "Pressione firmemente por 30 segundos",
        waterAmount: 0
      }
    ]
  },
  {
    id: "clever",
    name: "Clever Dripper",
    description: "Combinação única de imersão e filtração para café encorpado e limpo",
    method: "Clever",
    coffeeRatio: 24,
    waterRatio: 360,
    waterTemperature: 95,
    grinderBrand: "Comandante",
    grinderClicks: 20,
    paperBrand: "Clever Original",
    steps: [
      {
        name: "Pré-infusão",
        duration: 30,
        instruction: "Adicione o café e despeje toda a água de uma vez",
        waterAmount: 360
      },
      {
        name: "Misturar",
        duration: 15,
        instruction: "Mexa delicadamente para garantir saturação completa",
        waterAmount: 0
      },
      {
        name: "Infusão",
        duration: 195,
        instruction: "Deixe em repouso por 3 minutos e 15 segundos",
        waterAmount: 0
      },
      {
        name: "Drenagem",
        duration: 60,
        instruction: "Coloque sobre a xícara para iniciar a drenagem",
        waterAmount: 0
      }
    ]
  },
  {
    id: "chemex",
    name: "Chemex",
    description: "Café limpo e bem filtrado com notas delicadas",
    method: "Chemex",
    coffeeRatio: 25,
    waterRatio: 400,
    waterTemperature: 93,
    grinderBrand: "Hario Mini Mill Slim",
    grinderClicks: 12,
    paperBrand: "Chemex Original",
    steps: [
      {
        name: "Bloom",
        duration: 45,
        instruction: "Molhe o café com 50ml de água e observe a florada",
        waterAmount: 50
      },
      {
        name: "Primeiro despejo",
        duration: 60,
        instruction: "Despeje 150ml em espiral do centro para fora",
        waterAmount: 150
      },
      {
        name: "Segundo despejo",
        duration: 60,
        instruction: "Adicione mais 100ml mantendo o nível da água",
        waterAmount: 100
      },
      {
        name: "Despejo final",
        duration: 90,
        instruction: "Complete com 100ml e aguarde a drenagem completa",
        waterAmount: 100
      }
    ]
  },
  {
    id: "kalita",
    name: "Kalita Wave",
    description: "Extração uniforme com fundo plano para café equilibrado e doce",
    method: "Kalita",
    coffeeRatio: 21,
    waterRatio: 320,
    waterTemperature: 93,
    grinderBrand: "Timemore C3",
    grinderClicks: 18,
    paperBrand: "Kalita Wave",
    steps: [
      {
        name: "Bloom",
        duration: 45,
        instruction: "Molhe o café com 42ml de água e aguarde a florada",
        waterAmount: 42
      },
      {
        name: "Primeiro despejo",
        duration: 45,
        instruction: "Despeje 90ml em pequenos círculos no centro",
        waterAmount: 90
      },
      {
        name: "Segundo despejo",
        duration: 45,
        instruction: "Adicione mais 94ml mantendo o nível da água",
        waterAmount: 94
      },
      {
        name: "Despejo final",
        duration: 60,
        instruction: "Complete com 94ml e aguarde drenagem total",
        waterAmount: 94
      }
    ]
  },
  {
    id: "ufo-dripper",
    name: "UFO Dripper",
    description: "Método japonês inovador com múltiplos furos para extração uniforme",
    method: "UFO Dripper",
    coffeeRatio: 18,
    waterRatio: 280,
    waterTemperature: 90,
    grinderBrand: "1Zpresso JX-Pro",
    grinderClicks: 16,
    paperBrand: "UFO Original",
    steps: [
      {
        name: "Bloom",
        duration: 45,
        instruction: "Despeje 36ml de água em movimentos circulares suaves",
        waterAmount: 36
      },
      {
        name: "Primeiro despejo",
        duration: 30,
        instruction: "Adicione 80ml de água do centro para fora",
        waterAmount: 80
      },
      {
        name: "Segundo despejo",
        duration: 30,
        instruction: "Despeje mais 82ml mantendo ritmo constante",
        waterAmount: 82
      },
      {
        name: "Despejo final",
        duration: 45,
        instruction: "Complete com 82ml e aguarde drenagem completa",
        waterAmount: 82
      }
    ]
  },
  {
    id: "moka",
    name: "Moka Pot",
    description: "Café italiano tradicional com corpo intenso e sabor marcante",
    method: "Moka",
    coffeeRatio: 18,
    waterRatio: 180,
    waterTemperature: 100,
    grinderBrand: "Baratza Encore",
    grinderClicks: 15,
    steps: [
      {
        name: "Preparação",
        duration: 60,
        instruction: "Encha a base com água quente até a válvula e adicione o café no funil",
        waterAmount: 180
      },
      {
        name: "Aquecimento",
        duration: 240,
        instruction: "Coloque no fogo médio-baixo com a tampa aberta",
        waterAmount: 0
      },
      {
        name: "Extração",
        duration: 120,
        instruction: "Quando o café começar a sair, feche a tampa e aguarde",
        waterAmount: 0
      },
      {
        name: "Finalização",
        duration: 30,
        instruction: "Retire do fogo quando ouvir o ruído característico",
        waterAmount: 0
      }
    ]
  }
];

// Definir a ordem padrão dos métodos
export const defaultMethodOrder = ["V60", "Melita", "French Press", "AeroPress", "Clever", "Chemex", "Kalita", "UFO Dripper", "Moka"];
