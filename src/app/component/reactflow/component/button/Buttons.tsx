import React, {useEffect, useState} from 'react';
import {Handle, Position} from '@xyflow/react';
import {useTranslation} from 'react-i18next';
import {MdDelete} from 'react-icons/md';

export interface Props {
    buttons: { id: string, text: string }[];
    onRemove: (index: number) => void;
    onEdit: (event, index: number) => void;
}

function Buttons(props: Props) {
    const {buttons, onEdit, onRemove} = props;
    const {t, i18n} = useTranslation();
    const [placeholder, setPlaceholder] = useState('');

    useEffect(() => {
        setPlaceholder(t('buttons.validation.notEmpty'));
    }, [i18n.language]);

    return (
        <div className={'f-buttons flex flex-col pb-2 xyflow-border-b-1 xyflow-node-background-color'}>
            {
                buttons?.map((button, index) => (
                    <div className={'flex flex-row relative'} key={button.id}>
                        <div className={'button flex flex-row mt-2 ml-4 mr-4 h-8 rounded-md bg-white w-full'}>
                            {buttons.length > 1 && (
                                <div className={'absolute self-center right-6'}>
                                    <MdDelete className={'relative cursor-pointer text-red-600'}
                                              size={16}
                                              onClick={() => onRemove(index)}/>
                                </div>
                            )}
                            <input type='text'
                                   className={'outline-none px-4 text-center w-full'}
                                   placeholder={placeholder}
                                   maxLength={20}
                                   value={button?.text}
                                   onChange={(event) => onEdit(event, index)}/>
                            <Handle
                                type='source'
                                className='xyflow-handle top-6'
                                position={Position.Right}
                                id={button.id}
                            />

                        </div>
                    </div>
                ))
            }
        </div>
    );
}

export default Buttons;
