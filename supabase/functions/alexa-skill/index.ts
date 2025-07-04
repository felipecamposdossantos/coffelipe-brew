
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { defaultRecipes } from "./recipes.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface AlexaRequest {
  version: string;
  session: {
    sessionId: string;
    user: {
      userId: string;
      accessToken?: string;
    };
    attributes?: any;
  };
  request: {
    type: string;
    requestId: string;
    intent?: {
      name: string;
      slots?: any;
    };
    locale: string;
  };
}

interface BrewingSession {
  recipeId: string;
  recipeName: string;
  currentStep: number;
  totalSteps: number;
  isRunning: boolean;
  isPaused: boolean;
  timeLeft: number;
  startTime?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Alexa skill request received');

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const alexaRequest: AlexaRequest = await req.json();
    console.log('Alexa request:', JSON.stringify(alexaRequest, null, 2));

    const sessionAttributes = alexaRequest.session.attributes || {};
    let response;

    switch (alexaRequest.request.type) {
      case 'LaunchRequest':
        response = handleLaunchRequest();
        break;
      case 'IntentRequest':
        response = await handleIntentRequest(alexaRequest, sessionAttributes);
        break;
      case 'SessionEndedRequest':
        response = handleSessionEndedRequest();
        break;
      default:
        response = {
          version: '1.0',
          response: {
            outputSpeech: {
              type: 'PlainText',
              text: 'Desculpe, não entendi sua solicitação.'
            },
            shouldEndSession: true
          }
        };
    }

    console.log('Alexa response:', JSON.stringify(response, null, 2));

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error('Error in Alexa skill:', error);
    
    const errorResponse = {
      version: '1.0',
      response: {
        outputSpeech: {
          type: 'PlainText',
          text: 'Desculpe, ocorreu um erro. Tente novamente.'
        },
        shouldEndSession: true
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
};

function handleLaunchRequest() {
  return {
    version: '1.0',
    response: {
      outputSpeech: {
        type: 'PlainText',
        text: 'Bem-vindo ao Timer Coffee! Eu posso te ajudar a preparar café com receitas guiadas. Você pode dizer: preparar um V60, listar métodos, ou criar uma receita personalizada. Como posso ajudar?'
      },
      reprompt: {
        outputSpeech: {
          type: 'PlainText',
          text: 'Diga preparar um café ou listar métodos para começar.'
        }
      },
      shouldEndSession: false
    }
  };
}

async function handleIntentRequest(alexaRequest: AlexaRequest, sessionAttributes: any) {
  const intentName = alexaRequest.request.intent?.name;
  const slots = alexaRequest.request.intent?.slots || {};

  switch (intentName) {
    case 'StartBrewingIntent':
      return await handleStartBrewing(slots, sessionAttributes);
    case 'ListMethodsIntent':
      return handleListMethods();
    case 'NextStepIntent':
      return handleNextStep(sessionAttributes);
    case 'PauseTimerIntent':
      return handlePauseTimer(sessionAttributes);
    case 'ResumeTimerIntent':
      return handleResumeTimer(sessionAttributes);
    case 'RepeatInstructionIntent':
      return handleRepeatInstruction(sessionAttributes);
    case 'GetTimeLeftIntent':
      return handleGetTimeLeft(sessionAttributes);
    case 'CustomRecipeIntent':
      return handleCustomRecipe(slots, sessionAttributes);
    case 'AMAZON.HelpIntent':
      return handleHelpIntent();
    case 'AMAZON.StopIntent':
    case 'AMAZON.CancelIntent':
      return handleStopIntent();
    default:
      return {
        version: '1.0',
        response: {
          outputSpeech: {
            type: 'PlainText',
            text: 'Desculpe, não entendi. Você pode dizer: preparar um V60, listar métodos, ou pedir ajuda.'
          },
          shouldEndSession: false
        }
      };
  }
}

async function handleStartBrewing(slots: any, sessionAttributes: any) {
  const methodSlot = slots.Method?.value;
  console.log('Starting brewing with method:', methodSlot);

  // Find recipe by method
  const recipe = defaultRecipes.find(r => 
    r.method?.toLowerCase().includes(methodSlot?.toLowerCase()) ||
    r.name.toLowerCase().includes(methodSlot?.toLowerCase())
  ) || defaultRecipes[0]; // Default to first recipe

  const brewingSession: BrewingSession = {
    recipeId: recipe.id,
    recipeName: recipe.name,
    currentStep: 0,
    totalSteps: recipe.steps.length,
    isRunning: true,
    isPaused: false,
    timeLeft: recipe.steps[0]?.duration || 30,
    startTime: new Date().toISOString()
  };

  const firstStep = recipe.steps[0];
  const waterAmount = firstStep?.waterAmount ? ` Adicione ${firstStep.waterAmount} ml de água.` : '';

  return {
    version: '1.0',
    sessionAttributes: {
      ...sessionAttributes,
      brewingSession
    },
    response: {
      outputSpeech: {
        type: 'PlainText',
        text: `Iniciando preparo da receita ${recipe.name}. Primeira etapa: ${firstStep?.name}. ${firstStep?.instruction}${waterAmount} Tempo: ${Math.floor(firstStep?.duration / 60)} minutos e ${firstStep?.duration % 60} segundos. Diga próxima etapa quando terminar.`
      },
      shouldEndSession: false
    }
  };
}

function handleListMethods() {
  const methods = [...new Set(defaultRecipes.map(r => r.method || 'V60'))];
  const methodsList = methods.join(', ');

  return {
    version: '1.0',
    response: {
      outputSpeech: {
        type: 'PlainText',
        text: `Temos receitas para os seguintes métodos: ${methodsList}. Qual método você gostaria de usar? Diga por exemplo: preparar um V60.`
      },
      shouldEndSession: false
    }
  };
}

function handleNextStep(sessionAttributes: any) {
  const brewingSession: BrewingSession = sessionAttributes.brewingSession;
  
  if (!brewingSession) {
    return {
      version: '1.0',
      response: {
        outputSpeech: {
          type: 'PlainText',
          text: 'Você não está preparando nenhum café no momento. Diga preparar um café para começar.'
        },
        shouldEndSession: false
      }
    };
  }

  const recipe = defaultRecipes.find(r => r.id === brewingSession.recipeId);
  if (!recipe) {
    return {
      version: '1.0',
      response: {
        outputSpeech: {
          type: 'PlainText',
          text: 'Receita não encontrada. Vamos começar novamente. Diga preparar um café.'
        },
        shouldEndSession: false
      }
    };
  }

  brewingSession.currentStep += 1;

  if (brewingSession.currentStep >= brewingSession.totalSteps) {
    // Recipe completed
    return {
      version: '1.0',
      sessionAttributes: {
        ...sessionAttributes,
        brewingSession: null
      },
      response: {
        outputSpeech: {
          type: 'PlainText',
          text: `Parabéns! Você completou a receita ${brewingSession.recipeName}. Seu café está pronto! Aproveite sua bebida.`
        },
        shouldEndSession: false
      }
    };
  }

  const currentStep = recipe.steps[brewingSession.currentStep];
  brewingSession.timeLeft = currentStep?.duration || 30;
  
  const waterAmount = currentStep?.waterAmount ? ` Adicione ${currentStep.waterAmount} ml de água.` : '';

  return {
    version: '1.0',
    sessionAttributes: {
      ...sessionAttributes,
      brewingSession
    },
    response: {
      outputSpeech: {
        type: 'PlainText',
        text: `Etapa ${brewingSession.currentStep + 1} de ${brewingSession.totalSteps}: ${currentStep?.name}. ${currentStep?.instruction}${waterAmount} Tempo: ${Math.floor(currentStep?.duration / 60)} minutos e ${currentStep?.duration % 60} segundos.`
      },
      shouldEndSession: false
    }
  };
}

function handlePauseTimer(sessionAttributes: any) {
  const brewingSession: BrewingSession = sessionAttributes.brewingSession;
  
  if (!brewingSession || !brewingSession.isRunning) {
    return {
      version: '1.0',
      response: {
        outputSpeech: {
          type: 'PlainText',
          text: 'Não há nenhum cronômetro rodando no momento.'
        },
        shouldEndSession: false
      }
    };
  }

  brewingSession.isPaused = true;
  brewingSession.isRunning = false;

  return {
    version: '1.0',
    sessionAttributes: {
      ...sessionAttributes,
      brewingSession
    },
    response: {
      outputSpeech: {
        type: 'PlainText',
        text: 'Cronômetro pausado. Diga continuar cronômetro quando quiser retomar.'
      },
      shouldEndSession: false
    }
  };
}

function handleResumeTimer(sessionAttributes: any) {
  const brewingSession: BrewingSession = sessionAttributes.brewingSession;
  
  if (!brewingSession || !brewingSession.isPaused) {
    return {
      version: '1.0',
      response: {
        outputSpeech: {
          type: 'PlainText',
          text: 'Não há nenhum cronômetro pausado no momento.'
        },
        shouldEndSession: false
      }
    };
  }

  brewingSession.isPaused = false;
  brewingSession.isRunning = true;

  return {
    version: '1.0',
    sessionAttributes: {
      ...sessionAttributes,
      brewingSession
    },
    response: {
      outputSpeech: {
        type: 'PlainText',
        text: 'Cronômetro retomado. Continuando a etapa atual.'
      },
      shouldEndSession: false
    }
  };
}

function handleRepeatInstruction(sessionAttributes: any) {
  const brewingSession: BrewingSession = sessionAttributes.brewingSession;
  
  if (!brewingSession) {
    return {
      version: '1.0',
      response: {
        outputSpeech: {
          type: 'PlainText',
          text: 'Você não está preparando nenhum café no momento.'
        },
        shouldEndSession: false
      }
    };
  }

  const recipe = defaultRecipes.find(r => r.id === brewingSession.recipeId);
  const currentStep = recipe?.steps[brewingSession.currentStep];
  
  if (!currentStep) {
    return {
      version: '1.0',
      response: {
        outputSpeech: {
          type: 'PlainText',
          text: 'Não há instrução para repetir no momento.'
        },
        shouldEndSession: false
      }
    };
  }

  const waterAmount = currentStep.waterAmount ? ` Adicione ${currentStep.waterAmount} ml de água.` : '';

  return {
    version: '1.0',
    response: {
      outputSpeech: {
        type: 'PlainText',
        text: `Repetindo: Etapa ${brewingSession.currentStep + 1}: ${currentStep.name}. ${currentStep.instruction}${waterAmount}`
      },
      shouldEndSession: false
    }
  };
}

function handleGetTimeLeft(sessionAttributes: any) {
  const brewingSession: BrewingSession = sessionAttributes.brewingSession;
  
  if (!brewingSession) {
    return {
      version: '1.0',
      response: {
        outputSpeech: {
          type: 'PlainText',
          text: 'Você não está preparando nenhum café no momento.'
        },
        shouldEndSession: false
      }
    };
  }

  const minutes = Math.floor(brewingSession.timeLeft / 60);
  const seconds = brewingSession.timeLeft % 60;
  const timeText = minutes > 0 ? `${minutes} minutos e ${seconds} segundos` : `${seconds} segundos`;

  return {
    version: '1.0',
    response: {
      outputSpeech: {
        type: 'PlainText',
        text: `Restam aproximadamente ${timeText} para esta etapa.`
      },
      shouldEndSession: false
    }
  };
}

function handleCustomRecipe(slots: any, sessionAttributes: any) {
  return {
    version: '1.0',
    response: {
      outputSpeech: {
        type: 'PlainText',
        text: 'Para criar receitas personalizadas, use o aplicativo Timer Coffee no seu celular ou computador. Lá você pode salvar suas receitas favoritas e depois usá-las aqui na Alexa.'
      },
      shouldEndSession: false
    }
  };
}

function handleHelpIntent() {
  return {
    version: '1.0',
    response: {
      outputSpeech: {
        type: 'PlainText',
        text: 'Eu posso te ajudar a preparar café! Você pode dizer: preparar um V60, preparar um café, listar métodos, próxima etapa, pausar cronômetro, continuar cronômetro, repetir instrução, ou quanto tempo falta. O que você gostaria de fazer?'
      },
      shouldEndSession: false
    }
  };
}

function handleStopIntent() {
  return {
    version: '1.0',
    response: {
      outputSpeech: {
        type: 'PlainText',
        text: 'Até logo! Espero que tenha gostado do seu café.'
      },
      shouldEndSession: true
    }
  };
}

function handleSessionEndedRequest() {
  return {
    version: '1.0',
    response: {
      shouldEndSession: true
    }
  };
}

serve(handler);
