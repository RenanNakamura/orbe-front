const us = {
    startNode: {
        title: 'Flow Start',
        hint: 'Click and drag to begin',
        alert: {
            message: 'Add at least one trigger to the start node.'
        },
        triggers: 'Triggers',
        modal: {
            title: 'Add Trigger',
            selectTrigger: 'Select a trigger',
            comparisonType: 'When the customer message...',
        },
        validation: {
            type: {
                required: 'The trigger is required.',
            },
            comparisonType: {
                required: 'The comparison type is required.',
            },
            keyword: {
                required: 'The keyword is required.',
                notEmpty: 'The keyword cannot be empty.',
                min: 'At least one keyword is required.',
            }
        }
    },
    questionNode: {
        title: 'Send question',
        alert: {
            message: 'Add at least one message and choose the field where the customer\'s response will be saved.'
        },
    },
    messageNode: {
        title: 'Send message',
        alert: {
            message: 'Add at least one message. You can send text or media.'
        },
    },
    buttonNode: {
        title: 'Send buttons',
        alert: {
            message: 'Add at least one message and one button.'
        },
    },
    listNode: {
        title: 'Send list',
        alert: {
            message: 'Add at least one message, one button, one section, and one option within the section.'
        },
        button: {
            placeholder: 'Enter the button title'
        }
    },
    section: {
        title: {
            label: 'Section',
            placeholder: 'Enter the section',
        },
        row: {
            title: {
                label: 'Option',
                placeholder: 'Enter the option'
            },
            description: {
                label: 'Description',
                placeholder: 'Enter the description'
            },
            add: 'Add option',
        },
    },
    actionNode: {
        title: 'Execute action',
        modal: {
            title: 'Add action',
            selectAction: 'Select action',
        },
        alert: {
            message: 'Add at least one action.'
        },
        actions: {
            notEmpty: 'Add an action by clicking + below'
        }
    },
    conditionNode: {
        title: 'Execute Condition',
        modal: {
            title: 'Add Condition',
            selectField: 'Select a field',
            selectCondition: 'Select a condition',
        },
        alert: {
            message: 'Add at least one condition and the execution criteria.'
        },
        conditions: {
            notEmpty: 'Add a condition by clicking + below'
        }
    },
    conditions: {
        empty: 'Is empty',
        notEmpty: 'Is filled',
        contains: 'Contains',
        notContains: 'Does not contain',
        equals: 'Is equal to',
        notEquals: 'Is not equal to',
        startWith: 'Starts with',
    },
    actions: {
        addTag: 'Add to tag',
        removeTag: 'Remove from tag',
    },
    buttons: {
        description: 'Buttons',
        validation: {
            notEmpty: 'Enter the button text'
        }
    },
    list: {
        description: 'List',
        validation: {
            notEmpty: 'Enter the list text'
        }
    },
    messages: {
        validation: {
            notEmpty: 'Type your message below'
        }
    },
    answer: {
        save: {
            in: 'Save answer to'
        },
        not: {
            response: 'If no response within'
        },
        alert: {
            save: {
                message: 'Choose the field where you want to store the question\'s answer'
            },
            not: {
                message: 'Set an alternative path if the customer does not respond within the allotted time'
            }
        },
        invalid: 'If the answer is invalid'
    },
    messageBar: {
        placeholder: 'Type @ to use variables'
    },
    selectNode: {
        title: 'What would you like to add?',
        subTitle: 'Just click on the desired option, and the node will appear!'
    },
    media: {
        image: 'Image',
        video: 'Video',
        document: 'Document',
    },
    keyword: 'Keyword',
    anyWord: 'Any word',
    startWith: 'Start with',
    contains: 'Contains',
    equalsTo: 'Equals to',
    select: 'Select',
    provideTheKeyword: 'Provide the keyword',
    conditionValuePrompt: 'Enter the value to be used in the condition',
    cancel: 'Cancel',
    add: 'Add',
    contactFields: 'Contact fields',
    name: 'Name',
    phone: 'Phone',
    email: 'Email',
    address: 'Address',
    note: 'Note',
    timeInterval: 'Time interval',
    seconds: 'Seconds',
    minutes: 'Minutes',
    hours: 'Hours',
    days: 'Days',
    tags: 'Tags',
    selectTag: 'Select tags',
    send: 'Send',
    message: 'Message',
    question: 'Question',
    execute: 'Execute',
    action: 'Action',
    edit: 'Edit',
    delete: 'Delete',
    condition: 'Condition',
    firstName: 'First name',
    notFound: 'Not found',
    unknownAction: 'Unknown action',
    unknownCondition: 'Unknown condition',
    tag: 'Tag',
    any: 'Any',
    all: 'All',
    if: 'If',
    contact: 'Contact',
    conditionMatchLabel: 'Execution Criteria',
    operator: {
        all: 'all conditions are true',
        any: 'any condition is true',
        noMatch: 'If none of the conditions are true',
    },
    file: {
        validation: {
            typeNotImplemented: 'Unsupported file type',
            maxSize: 'The maximum allowed file size is {{maxSize}} MB',
            mimeType: 'Only the following file formats are accepted: {{mimeTypes}}'
        }
    },
    contactName: {
        formattedName: {
            label: 'Formatted name',
            required: 'Formatted name is required'
        },
        firstName: {
            label: 'First name',
            required: 'First name is required'
        },
        lastName: {
            label: 'Last name',
            required: 'Last name is required'
        },
    },
    contactPhone: {
        phone: {
            label: 'Phone number',
            required: 'Phone number is required'
        },
        type: {
            label: 'Phone type'
        },
        waId: {
            label: 'WhatsApp ID'
        },
    },
    mobile: 'Mobile',
    landline: 'Landline'
};

export default us;
