import React from 'react';
import {MdClose} from 'react-icons/md';
import {useTranslation} from 'react-i18next';
import Select from 'react-select';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {ContactConst} from '../../../const/ContactConst';

export interface ModalProps {
    onSubmit?: (contact: any) => void;
    onCancel?: () => void;
    onCloseModal?: () => void;
}

const ModalContact = (props: ModalProps) => {
    const {t} = useTranslation();

    const typeOptions = ContactConst.getType();

    const validationSchema = Yup.object().shape({
        formattedName: Yup.string().required(t('required')),
        type: Yup.object().required(t('required')),
        phone: Yup.string().required(t('required')),
    });

    const formik = useFormik({
        initialValues: {
            formattedName: '',
            firstName: '',
            lastName: '',
            type: typeOptions[0], // default MOBILE
            phone: '',
            waId: '',
        },
        validationSchema,
        onSubmit: (values) => {
            const payload = {
                name: {
                    formatted_name: values.formattedName,
                    first_name: values.firstName,
                    last_name: values.lastName,
                },
                phones: [
                    {
                        type: values.type.value,
                        phone: values.phone,
                        wa_id: values.waId,
                    },
                ],
            };
            props.onSubmit?.(payload);
        },
    });

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const phone = e.target.value;
        formik.setFieldValue('phone', phone);
        formik.setFieldValue('waId', phone);
    };

    const handleWaIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const waId = e.target.value;
        formik.setFieldValue('waId', waId);
    };

    return (
        <div className='xyflow-modal-container'>
            <form className='xyflow-modal' onSubmit={formik.handleSubmit}>
                <div className='xyflow-modal-header mt-2 mb-4'>
                    <h2 className='ml-2'>{t('contact')}</h2>
                    <MdClose
                        className='cursor-pointer'
                        size={24}
                        onClick={props.onCloseModal}
                    />
                </div>
                <div className='xyflow-modal-divider'></div>

                <div className='xyflow-modal-content'>
                    <div className={'mt-4'}>
                        <label>{t('contactPhone.type.label')} <span className={'text-red-600'}>*</span></label>
                        <Select
                            name='type'
                            value={formik.values.type}
                            onChange={(option) => formik.setFieldValue('type', option)}
                            options={typeOptions}
                            placeholder={t('select')}
                        />
                        {formik.touched.type && formik.errors.type && (
                            <div className='text-red-600'>{t('contactPhone.type.required')}</div>
                        )}
                    </div>

                    <div className={'mt-2'}>
                        <label>{t('contactName.formattedName.label')} <span className={'text-red-600'}>*</span></label>
                        <input
                            className='f-input w-full'
                            type='text'
                            name='formattedName'
                            value={formik.values.formattedName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.formattedName && formik.errors.formattedName && (
                            <div className='text-red-600'>{t('contactName.formattedName.required')}</div>
                        )}
                    </div>
                    <div className={'mt-2'}>
                        <label>{t('contactName.firstName.label')}</label>
                        <input
                            className='f-input w-full'
                            type='text'
                            name='firstName'
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                        />
                    </div>
                    <div className={'mt-2'}>
                        <label>{t('contactName.lastName.label')}</label>
                        <input
                            className='f-input w-full'
                            type='text'
                            name='lastName'
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                        />
                    </div>
                    <div className={'mt-2'}>
                        <label>{t('contactPhone.phone.label')} <span className={'text-red-600'}>*</span></label>
                        <input
                            className='f-input w-full'
                            type='text'
                            name='phone'
                            value={formik.values.phone}
                            onChange={handlePhoneChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.phone && formik.errors.phone && (
                            <div className='text-red-600'>{t('contactPhone.phone.required')}</div>
                        )}
                    </div>
                    <div className={'mt-2'}>
                        <label>{t('contactPhone.waId.label')}</label>
                        <input
                            className='f-input w-full bg-gray-100'
                            type='text'
                            name='waId'
                            value={formik.values.waId}
                            onChange={handleWaIdChange}
                        />
                    </div>
                </div>

                <div className='xyflow-modal-footer'>
                    <button
                        className='f-btn f-btn-cancel'
                        type='button'
                        onClick={props.onCancel}>
                        {t('cancel')}
                    </button>
                    <button
                        className='f-btn f-btn-primary text-primary-600'
                        type='submit'>
                        {t('send')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ModalContact;
