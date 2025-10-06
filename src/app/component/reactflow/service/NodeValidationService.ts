import * as yup from 'yup';
import {
    ActionNode,
    ButtonNode,
    ConditionNode,
    MessageNode,
    NodeType,
    WorkflowNode,
    QuestionNode,
    StartNode
} from '../../../model/flow/WorkflowNode';

const startNodeSchemaValidation = yup
    .object()
    .shape({
        triggers: yup.array().min(1, 'Pelo menos um gatilho é obrigatório.')
    });

const messageNodeSchemaValidation = yup
    .object()
    .shape({
        messages: yup.array()
            .min(1, 'Pelo menos uma mensagem é obrigatória.')
            .required('Pelo menos uma mensagem é obrigatória.')
    });

const buttonNodeSchemaValidation = yup
    .object()
    .shape({
        text: yup.string().trim().required('O corpo do botão não pode estar vazio.'),
        buttons: yup.array()
            .of(
                yup.object().shape({
                    id: yup.string().trim().required('O ID do botão é obrigatório.'),
                    text: yup.string().trim().required('O texto do botão não pode estar vazio.')
                })
            )
            .min(1, 'Pelo menos um botão é obrigatório.')
            .required('Pelo menos um botão é obrigatório.')
    });

const actionNodeSchemaValidation = yup
    .object()
    .shape({
        actions: yup.array()
            .of(
                yup.object().shape({
                    values: yup.array()
                        .min(1, 'Pelo menos um valor da ação é obrigatório.')
                        .required('Pelo menos um valor da ação é obrigatório.'),
                })
            )
            .min(1, 'Pelo menos uma ação é obrigatório.')
            .required('Pelo menos uma ação é obrigatório.')
    });

const conditionNodeSchemaValidation = yup
    .object()
    .shape({
        conditions: yup.array()
            .min(1, 'Pelo menos uma condição é obrigatório.')
            .required('Pelo menos uma condição é obrigatório.'),
        operator: yup.string().trim().required('O critério de execução é obrigatório.')
    });

const listNodeSchemaValidation = yup
    .object()
    .shape({
        body: yup.string().trim().required('O corpo da lista não pode estar vazio.'),
        button: yup.string().trim().required('O título do botão da lista não pode estar vazio.'),
        sections: yup.array()
            .of(
                yup.object().shape({
                    title: yup.string().trim().required('O título da seção é obrigatório.'),
                    rows: yup.array()
                        .of(
                            yup.object().shape({
                                id: yup.string().trim().required('O ID da opção da lista é obrigatório.'),
                                title: yup.string().trim().required('O título da opção dentro da seção da lista é obrigatório.'),
                            })
                        )
                        .min(1, 'Pelo menos uma opção dentro de uma seção é obrigatório.')
                        .max(10, 'A quantidade máxima de opção dentro de uma seção é de 10 opções.')
                })
            )
            .min(1, 'Pelo uma seção é obrigatório.')
            .max(10, 'O máximo de seção é 10.')
            .required('Pelo uma seção é obrigatório.')
    });

const questionNodeSchemaValidation = yup
    .object()
    .shape({
        text: yup.string().trim().required('O corpo da pergunta não pode estar vazio.'),
        answerField: yup.object()
            .shape({
                field: yup.string().trim().required('O campo onde será preenchido a resposta é obrigatório.')
            })
            .required('O campo onde será preenchido a resposta é obrigatório.'),
        timeout: yup.object()
            .shape({
                value: yup.string().trim().required('O tempo caso o cliente não responda é obrigatório.'),
                timeIntervalUnit: yup.string().trim().required('O intervalo de tempo caso o cliente não responda é obrigatório.'),
            })
            .required('O tempo caso o cliente não responda é obrigatório.'),
    });

export const NodeValidationService = {

    validate: async (node: WorkflowNode): Promise<boolean> => {
        switch (node.type) {
            case NodeType.START:
                return await startNodeSchemaValidation.isValid(node as StartNode);
            case NodeType.MESSAGE:
                return await messageNodeSchemaValidation.isValid(node as MessageNode);
            case NodeType.BUTTON:
                return await buttonNodeSchemaValidation.isValid(node as ButtonNode);
            case NodeType.ACTION:
                return await actionNodeSchemaValidation.isValid(node as ActionNode);
            case NodeType.CONDITION:
                return await conditionNodeSchemaValidation.isValid(node as ConditionNode);
            case NodeType.QUESTION:
                return await questionNodeSchemaValidation.isValid(node as QuestionNode);
            case NodeType.LIST:
                return await listNodeSchemaValidation.isValid(node as QuestionNode);
        }
    }

};
