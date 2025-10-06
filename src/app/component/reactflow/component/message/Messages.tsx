import React, {useEffect, useState} from 'react';
import VerticalBar from './verticalBar/VerticalBar';
import {useTranslation} from 'react-i18next';
import {MdOutlineMoreHoriz, MdPerson} from 'react-icons/md';

export interface Props {
    messages: any[];
    editingIndex: number;
    onRemove: (index: number) => void;
    onEdit: (index: number) => void;
}

function Messages(props: Props) {
    const {messages, editingIndex, onEdit, onRemove} = props;
    const {t, i18n} = useTranslation();
    const [messageSelectedIndex, setMessageSelectedIndex] = useState(null);
    const [menuActions, setMenuActions] = useState([]);

    useEffect(() => {
        setMenuActions([
            {
                label: t('edit'),
                onClick: () => handleEdit(messageSelectedIndex),
            },
            {
                label: t('delete'),
                onClick: () => handleRemove(messageSelectedIndex),
            },
        ]);
    }, [i18n.language, messageSelectedIndex]);

    const handleEdit = (index) => {
        onEdit(index);
        onClickOutsideMenuActions();
    };

    const handleRemove = (index) => {
        onRemove(index);
        onClickOutsideMenuActions();
    };

    const onClickMenuActions = (index: number, event: React.MouseEvent) => {
        event.stopPropagation();
        setMessageSelectedIndex(messageSelectedIndex === index ? null : index);
    };

    const onClickOutsideMenuActions = () => {
        setMessageSelectedIndex(null);
    };

    return (
        <div className={'f-messages'}>
            {messages?.map((msg, index) => (
                <div key={index} className={`messages ${index === editingIndex ? 'editing' : ''}`}>
                    <div className={'content shadow-2'}>
                        <div className={'flex justify-end'}>
                            <MdOutlineMoreHoriz
                                className={'cursor-pointer'}
                                size={16}
                                onClick={(event) => onClickMenuActions(index, event)}
                            />

                            {messageSelectedIndex === index && (
                                <div className='absolute nodrag nopan mb-5 ml-2 z-10 mt-3'>
                                    <VerticalBar options={menuActions}
                                                 onClickOutside={onClickOutsideMenuActions}></VerticalBar>
                                </div>
                            )}
                        </div>

                        {
                            msg?.type === 'TEXT' && (
                                <div className={'mt-auto break-words'}>{msg?.body}</div>
                            )
                        }
                        {
                            msg?.type === 'IMAGE' && (
                                <div className={'flex flex-col'}>
                                    <img src={msg?.link} alt='' className={'media'}/>
                                    <div className={'mt-auto'}>{msg?.body}</div>
                                </div>
                            )
                        }
                        {
                            msg?.type === 'VIDEO' && (
                                <div className={'flex flex-col'}>
                                    <video className={'media'} src={msg?.link} controls></video>
                                    <div className={'mt-auto'}>{msg?.body}</div>
                                </div>
                            )
                        }
                        {
                            msg?.type === 'DOCUMENT' && (
                                <div className={'flex flex-col'}>
                                    <embed className={'media'} src={msg?.link}/>
                                    <div className={'mt-auto'}>{msg?.body}</div>
                                </div>
                            )
                        }
                        {
                            msg?.type === 'CONTACT' && (
                                <div className={'flex flex-row pb-1 items-center'}>
                                    <div className={'rounded-full bg-gray-400 p-2'}>
                                        {React.createElement(MdPerson, { className: 'text-white',  size: 32 })}
                                    </div>
                                    <div
                                        className='ml-2 overflow-hidden overflow-ellipsis whitespace-nowrap font-semibold'
                                        title={msg?.name?.formatted_name}
                                    >
                                        {msg?.name?.formatted_name}
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Messages;
