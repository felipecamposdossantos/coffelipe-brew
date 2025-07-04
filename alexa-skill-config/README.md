
# Timer Coffee - Alexa Skill

Esta é a implementação da Alexa Skill para o app Timer Coffee, que permite aos usuários preparar café usando comandos de voz.

## Funcionalidades

### Intents Principais
- **StartBrewingIntent**: Inicia o preparo de uma receita específica
- **ListMethodsIntent**: Lista os métodos de preparo disponíveis
- **NextStepIntent**: Avança para a próxima etapa da receita
- **PauseTimerIntent**: Pausa o cronômetro atual
- **ResumeTimerIntent**: Retoma o cronômetro pausado
- **RepeatInstructionIntent**: Repete a instrução atual
- **GetTimeLeftIntent**: Informa o tempo restante da etapa
- **CustomRecipeIntent**: Informa sobre receitas personalizadas

### Comandos de Exemplo
- "Alexa, abrir Timer Coffee"
- "Preparar um V60"
- "Listar métodos"
- "Próxima etapa"
- "Pausar cronômetro"
- "Quanto tempo falta?"
- "Repetir instrução"

## Configuração

### 1. Edge Function
A Edge Function já está implementada em `supabase/functions/alexa-skill/index.ts` e será automaticamente deployada.

### 2. Amazon Developer Console
1. Acesse [Amazon Developer Console](https://developer.amazon.com/alexa/console/ask)
2. Crie uma nova Skill Custom
3. Configure:
   - **Invocation Name**: "timer coffee"
   - **Endpoint**: `https://lawdsesikzlttnvrhkqn.supabase.co/functions/v1/alexa-skill`
   - **Interaction Model**: Use o JSON em `alexa-skill-config/interactionModel.json`

### 3. Configurar Skill Manifest
Use o arquivo `alexa-skill-config/skill.json` para configurar as informações da skill.

### 4. Certificação
Antes de publicar, certifique-se de:
- Testar todos os fluxos de conversação
- Configurar URLs de política de privacidade e termos de uso
- Adicionar ícones apropriados (108x108 e 512x512)
- Validar com diferentes sotaques e velocidades de fala

## Fluxo de Uso

1. **Ativação**: "Alexa, abrir Timer Coffee"
2. **Escolha do Método**: "Preparar um V60" ou "Listar métodos"
3. **Preparo Guiado**: Alexa guia através de cada etapa
4. **Controle**: Use comandos para pausar, continuar, ou pular etapas
5. **Conclusão**: Alexa confirma quando o café está pronto

## Receitas Suportadas

- **V60 Clássico**: 4 etapas, ~3,5 minutos
- **Prensa Francesa**: 6 etapas, ~5,5 minutos  
- **AeroPress**: 6 etapas, ~2,5 minutos

## Integração Futura

- Sincronização com receitas personalizadas do usuário
- Account linking para acesso a favoritos
- Histórico de preparos
- Notificações proativas
- Suporte a dispositivos com tela (APL)

## Teste Local

Para testar localmente, use o [ASK CLI](https://developer.amazon.com/en-US/docs/alexa/smapi/quick-start-alexa-skills-kit-command-line-interface.html) ou o simulador online no Developer Console.
