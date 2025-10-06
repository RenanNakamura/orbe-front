import React from 'react';
import {MdClose} from 'react-icons/md';

export interface ModalProps {
    header: string;
    btnSubmitLabel?: string;
    btnCancelLabel?: string;
    children: any;
    onSubmit?: () => void;
    onCancel?: () => void;
    onCloseModal?: () => void;
}

const Modal = (props: ModalProps) => {
    return (
        <div className='xyflow-modal-container'>
            <div className='xyflow-modal'>
                <div className='xyflow-modal-header mt-2 mb-4'>
                    <h2 className={'ml-2'}>{props.header}</h2>
                    <MdClose
                        className={'cursor-pointer'}
                        size={24}
                        onClick={props.onCloseModal}/>
                </div>
                <div className='xyflow-modal-divider'></div>
                <div className='xyflow-modal-content'>{props.children}</div>
                <div className='xyflow-modal-footer'>
                    <button
                        className='f-btn f-btn-cancel'
                        type='button'
                        onClick={props.onCancel}>
                        {props.btnCancelLabel ? props.btnCancelLabel : 'Cancelar'}
                    </button>
                    <button
                        className='f-btn f-btn-primary text-primary'
                        type='button'
                        onClick={props.onSubmit}>
                        {props.btnSubmitLabel ? props.btnSubmitLabel : 'Criar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
