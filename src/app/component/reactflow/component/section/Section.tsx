import React, {useEffect, useState} from 'react';
import {Handle, Position} from '@xyflow/react';
import {useTranslation} from 'react-i18next';
import {MdClose, MdDelete} from 'react-icons/md';

export interface Props {
    title: string;
    rows: { id: string, title: string, description: string }[];
    onEditSectionTitle?: (updatedTitle: string) => void;
    onDeleteSection?: (event) => void;
    onEditRow?: (index: number, updatedRow: { title: string; description: string }) => void;
    onDeleteRow?: (index: number) => void;
}

function Section(props: Props) {
    const {title, rows, onEditSectionTitle, onDeleteSection, onDeleteRow, onEditRow} = props;
    const {t, i18n} = useTranslation();
    const [titleLabel, setTitleLabel] = useState('');
    const [titlePlaceholder, setTitlePlaceholder] = useState('');
    const [rowTitleLabel, setRowTitleLabel] = useState('');
    const [rowTitlePlaceholder, setRowTitlePlaceholder] = useState('');
    const [rowDescriptionLabel, setRowDescriptionLabel] = useState('');
    const [rowDescriptionPlaceholder, setRowDescriptionPlaceholder] = useState('');

    useEffect(() => {
        setTitleLabel(t('section.title.label'));
        setTitlePlaceholder(t('section.title.placeholder'));
        setRowTitleLabel(t('section.row.title.label'));
        setRowTitlePlaceholder(t('section.row.title.placeholder'));
        setRowDescriptionLabel(t('section.row.description.label'));
        setRowDescriptionPlaceholder(t('section.row.description.placeholder'));
    }, [i18n.language]);

    return (
        <div className={'reactflow-section xyflow-node-background-color flex flex-col pb-2'}>
            <div className={'flex flex-row'}>
                <div className={'flex flex-col w-full p-2'}>
                    <label>{titleLabel}</label>
                    <input
                        type='text'
                        className='xyflow-border-radius mt-1 p-1 bg-white border-none outline-none nodrag nopan nowheel'
                        placeholder={titlePlaceholder}
                        value={title}
                        maxLength={24}
                        onChange={(e) => onEditSectionTitle?.(e?.target?.value)}
                    />
                </div>
                {
                    onDeleteSection && (
                        <div className={'absolute mt-1 right-1'}>
                            <MdClose
                                className={'cursor-pointer'}
                                size={14}
                                onClick={(event) => onDeleteSection(event)}
                            />
                        </div>
                    )
                }
            </div>
            <div>
                {
                    rows?.map((row, i) => (
                        <div className={'relative flex flex-row border-none bg-gray-light xyflow-border-radius p-3 m-2'}>
                            <div className={'w-full flex flex-row'}
                                 key={row.id}>
                                <div className={'flex flex-col w-full'}>
                                    <div className={'flex flex-col'}>
                                        <label className={'text-xs'}>{rowTitleLabel}</label>
                                        <input type='text'
                                               className={'xyflow-border-radius bg-white p-1 border-none outline-none nodrag nopan nowheel'}
                                               placeholder={rowTitlePlaceholder}
                                               value={row.title}
                                               maxLength={24}
                                               onChange={(e) =>
                                                   onEditRow?.(i, {
                                                       ...row,
                                                       title: e.target.value,
                                                   })
                                               }
                                        />
                                    </div>
                                    <div className={'flex flex-col mt-1'}>
                                        <label className={'text-xs'}>{rowDescriptionLabel}</label>
                                        <input type='text'
                                               className='xyflow-border-radius bg-white p-1 border-none outline-none nodrag nopan nowheel'
                                               placeholder={rowDescriptionPlaceholder}
                                               value={row.description}
                                               maxLength={72}
                                               onChange={(e) =>
                                                   onEditRow?.(i, {
                                                       ...row,
                                                       description: e.target.value,
                                                   })
                                               }
                                        />
                                    </div>
                                </div>

                                {
                                    rows.length > 1 && (
                                        <div className={'absolute top-1 right-1'}>
                                            <MdDelete
                                                className={'cursor-pointer text-red'}
                                                size={16}
                                                onClick={() => onDeleteRow(i)}
                                            />
                                        </div>
                                    )
                                }
                            </div>

                            <Handle
                                type='source'
                                className='xyflow-handle -right-3'
                                position={Position.Right}
                                id={row.id}
                            />
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default Section;
