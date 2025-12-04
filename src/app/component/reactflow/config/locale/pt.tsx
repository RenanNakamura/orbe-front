const pt = {
    startNode: {
        title: 'Início do fluxo',
        hint: 'Clique e arraste para começar',
        alert: {
            message: 'Adicione pelo menos um gatilho para o nó de início.'
        },
        triggers: 'Gatilhos',
        modal: {
            title: 'Adicionar gatilho',
            selectTrigger: 'Selecione um gatilho',
            comparisonType: 'Quando a mensagem do cliente...',
        },
        validation: {
            type: {
                required: 'O gatilho é obrigatório.',
            },
            comparisonType: {
                required: 'O tipo de comparação é obrigatório.',
            },
            keyword: {
                required: 'A palavra-chave é obrigatória.',
                notEmpty: 'A palavra-chave não pode estar vazia.',
                min: 'É necessário informar pelo menos uma palavra-chave.',
            }
        }
    },
    questionNode: {
        title: 'Enviar pergunta',
        alert: {
            message: 'Adicione pelo menos uma mensagem e escolha o campo onde a resposta do cliente será salva.'
        },
    },
    messageNode: {
        title: 'Enviar mensagem',
        alert: {
            message: 'Adicione pelo menos uma mensagem. Você pode enviar texto ou mídias.'
        },
    },
    buttonNode: {
        title: 'Enviar botões',
        alert: {
            message: 'Adicione pelo menos uma mensagem e um botão.'
        },
    },
    listNode: {
        title: 'Enviar lista',
        alert: {
            message: 'Adicione pelo menos uma mensagem, um botão, uma seção e uma opção dentro da seção.'
        },
        button: {
            placeholder: 'Informe o título do botão'
        },
    },
    section: {
        title: {
            label: 'Seção',
            placeholder: 'Informe a seção',
        },
        row: {
            title: {
                label: 'Opção',
                placeholder: 'Informe a opção'
            },
            description: {
                label: 'Descrição',
                placeholder: 'Informe a descrição'
            },
            add: 'Adicionar opção',
        },
    },
    actionNode: {
        title: 'Executar ação',
        modal: {
            title: 'Adicionar ação',
            selectAction: 'Selecione a ação',
        },
        alert: {
            message: 'Adicione pelo menos uma ação.'
        },
        actions: {
            notEmpty: `Insira a ação clicando em + abaixo`
        }
    },
    conditionNode: {
        title: 'Executar condição',
        modal: {
            title: 'Adicionar condição',
            selectField: 'Selecione um campo',
            selectCondition: 'Selecione uma condição',
        },
        alert: {
            message: 'Adicione pelo menos uma condição e o critério de execução.'
        },
        conditions: {
            notEmpty: `Adicione uma condição clicando em + abaixo`
        }
    },
    timeIntervalNode: {
        title: 'Horários',
        alert: {
            message: 'Selecione um fuso horário e adicione pelo menos um intervalo de tempo.'
        },
        timezone: {
            label: 'Fuso horário',
            placeholder: 'Selecione o fuso horário'
        },
        intervals: {
            notEmpty: 'Adicione um intervalo clicando em + abaixo'
        },
        interval: {
            startTime: 'Horário inicial',
            endTime: 'Horário final',
            validation: {
                startRequired: 'O horário inicial é obrigatório.',
                endRequired: 'O horário final é obrigatório.',
                endAfterStart: 'O horário final deve ser maior que o horário inicial.',
                overlap: 'Este intervalo se sobrepõe a outro intervalo existente.',
                sameTime: 'Hora de início e fim não podem ser iguais.',
            },
            crossMidnight: 'Este intervalo cruza a meia-noite (termina no dia seguinte).',
        },
        noMatch: 'Fora dos intervalos',
        modal: {
            title: 'Adicionar intervalo'
        }
    },
    conditions: {
        empty: 'Não está preenchido',
        notEmpty: 'Está preenchido',
        contains: 'Contém',
        notContains: 'Não contém',
        equals: 'É igual a',
        notEquals: 'É diferente de',
        startWith: 'Começa com',
    },
    actions: {
        addTag: 'Adicionar etiqueta',
        removeTag: 'Remover etiqueta',
    },
    buttons: {
        description: 'Botões',
        validation: {
            notEmpty: 'Digite o texto do botão'
        }
    },
    list: {
        description: 'Lista',
        validation: {
            notEmpty: 'Digite o texto da lista'
        }
    },
    messages: {
        validation: {
            notEmpty: 'Digite a sua mensagem abaixo'
        }
    },
    answer: {
        save: {
            in: 'Salvar resposta em'
        },
        not: {
            response: 'Se não responder em'
        },
        alert: {
            save: {
                message: 'Escolha o campo onde deseja armazenar a resposta da pergunta'
            },
            not: {
                message: 'Defina um caminho alternativo caso o cliente não responda dentro do tempo estipulado'
            }
        },
        invalid: 'Se a resposta for inválida'
    },
    messageBar: {
        placeholder: 'Digite @ para usar as variáveis'
    },
    selectNode: {
        title: 'O que você quer adicionar?',
        subTitle: 'É só clicar na opção desejada que o nó irá aparecer!'
    },
    media: {
        image: 'Imagem',
        video: 'Vídeo',
        document: 'Documento',
    },
    keyword: 'Palavra Chave',
    anyWord: 'Qualquer Palavra',
    startWith: 'Começar com',
    contains: 'Contém',
    equalsTo: 'Igual a',
    select: 'Selecione',
    provideTheKeyword: 'Informe a palavra-chave',
    conditionValuePrompt: 'Informe o valor a ser usado na condição',
    cancel: 'Cancelar',
    add: 'Adicionar',
    contactFields: 'Campos do contato',
    name: 'Nome',
    phone: 'Telefone',
    email: 'Email',
    address: 'Endereço',
    note: 'Observação',
    timeInterval: 'Intervalo de tempo',
    seconds: 'Segundos',
    minutes: 'Minutos',
    hours: 'Horas',
    days: 'Dias',
    tags: 'Etiquetas',
    selectTag: 'Selecione as etiquetas',
    send: 'Enviar',
    message: 'Mensagem',
    question: 'Pergunta',
    execute: 'Executar',
    action: 'Ação',
    edit: 'Editar',
    delete: 'Apagar',
    condition: 'Condição',
    firstName: 'Primeiro nome',
    notFound: 'Não encontrado',
    unknownAction: 'Ação desconhecida',
    unknownCondition: 'Condição desconhecida',
    tag: 'Etiqueta',
    any: 'Qualquer',
    all: 'Todos(as)',
    if: 'Se',
    contact: 'Contato',
    conditionMatchLabel: 'Critério de execução',
    operator: {
        all: 'todas condições forem verdadeiras',
        any: 'qualquer condição for verdadeira',
        noMatch: 'Se nenhuma das condições for verdadeira',
    },
    file: {
        validation: {
            typeNotImplemented: 'Tipo de arquivo não suportado',
            maxSize: 'O tamanho máximo permitido para o arquivo é de {{maxSize}} MB',
            mimeType: 'Somente os seguintes formatos de arquivo são aceitos: {{mimeTypes}}'
        }
    },
    contactName: {
        formattedName: {
            label: 'Nome formatado',
            required: 'O nome formatado é obrigatório'
        },
        firstName: {
            label: 'Primeiro nome',
            required: 'O primeiro nome é obrigatório'
        },
        lastName: {
            label: 'Último nome',
            required: 'O último nome é obrigatório'
        },
    },
    contactPhone: {
        phone: {
            label: 'Número do telefone',
            required: 'O número do telefone é obrigatório'
        },
        type: {
            label: 'Tipo do telefone'
        },
        waId: {
            label: 'WhatsApp ID'
        },
    },
    mobile: 'Celular',
    landline: 'Telefone fixo',
};

export default pt;
