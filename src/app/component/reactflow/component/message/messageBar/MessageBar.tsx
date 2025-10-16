import React, {useCallback, useEffect, useRef, useState} from 'react';
import Picker from '@emoji-mart/react';
import GroupList from '../../groupList/GroupList';
import {useTranslation} from 'react-i18next';
import VerticalBar from '../verticalBar/VerticalBar';
import {FileUtil} from '../../../../../util/file.util';
import {
  MdAdd,
  MdClose,
  MdImage,
  MdInsertDriveFile,
  MdInsertEmoticon,
  MdPerson,
  MdSend,
  MdVideocam
} from 'react-icons/md';
import ModalContact from '../../modal/contact/ModalContact';
import {createPortal} from 'react-dom';

export interface Props {
  message: { type: string, body?: string, link?: string };
  maxLength: number;
  onSend: (message) => void;
  cssClass?: string;
  hideMediaOption?: boolean;
}

const acceptsImage = 'image/png, image/jpeg';
const acceptsVideo = 'video/mp4';
const acceptsDocument = 'application/pdf';

function MessageBar(props: Props) {
  const {t, i18n} = useTranslation();

  const [message, setMessage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showVariableList, setShowVariableList] = useState(false);
  const [showMediaList, setShowMediaList] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [groups, setGroups] = useState([]);
  const [mediaOptions, setMediaOptions] = useState([]);
  const [variableInsertIndex, setVariableInsertIndex] = useState(-1);
  const [placeHolderMessageBar, setPlaceHolderMessageBar] = useState('');
  const [fileValidation, setFileValidation] = useState({success: true, error: ''});

  const textareaRef = useRef(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMessage(props.message || getDefaultMessage());
    setTimeout(() => resizeTextArea(), 1);
  }, [props.message]);

  useEffect(() => {
    setPlaceHolderMessageBar(t('messageBar.placeholder'));

    setGroups([
      {
        title: t('contactFields'),
        items: [
          {label: t('firstName'), value: 'contact_first_name'},
          {label: t('name'), value: 'contact_name'},
          {label: t('phone'), value: 'contact_phone'},
          {label: t('email'), value: 'contact_email'},
          {label: t('note'), value: 'contact_note'},
        ]
      }
    ]);

    setMediaOptions([
      {
        label: t('contact'),
        icon: MdPerson,
        iconColor: 'text-primary-600',
        onClick: () => onOpenContactModalClick(),
      },
      {
        label: t('media.image'),
        icon: MdImage,
        iconColor: 'text-primary-600',
        onClick: () => onMediaImageClick(),
      },
      {
        label: t('media.video'),
        icon: MdVideocam,
        iconColor: 'text-primary-600',
        onClick: () => onMediaVideoClick(),
      },
      {
        label: t('media.document'),
        icon: MdInsertDriveFile,
        iconColor: 'text-primary-600',
        onClick: () => onMediaDocClick(),
      }
    ]);
  }, [i18n.language, t]);

  const onEmojiSelect = useCallback((emoji) => {
    setMessage((prev) => ({
      ...prev,
      body: prev?.body + emoji.native
    }));
    setShowEmojiPicker(false);
  }, []);

  const onMessageChange = useCallback((event) => {
    const newText = event.target.value;

    setMessage(prev => ({
      ...prev,
      body: newText,
    }));

    const cursorPosition = event.target.selectionStart;
    const textUntilCursor = newText.slice(0, cursorPosition);

    const match = textUntilCursor.match(/(?:^|\s)(@[\w]*)$/);

    if (match) {
      const atIndex = textUntilCursor.lastIndexOf('@');
      setShowVariableList(true);
      setVariableInsertIndex(atIndex);
    } else {
      setShowVariableList(false);
      setVariableInsertIndex(-1);
    }

    resizeTextArea();
  }, []);

  const onVariableClick = useCallback((variable) => {
    if (variableInsertIndex !== -1) {
      const newBody =
        message?.body?.slice(0, variableInsertIndex) +
        `{{${variable.value}}}` +
        message?.body?.slice(variableInsertIndex + 1);

      setMessage(prev => ({
        ...prev,
        body: newBody
      }));
      setShowVariableList(false);
      setVariableInsertIndex(-1);
    }

    textareaRef?.current?.focus();
  }, [message, variableInsertIndex]);

  const onEmojiClick = (event) => {
    event.stopPropagation();
    setShowEmojiPicker(prev => !prev);
  };

  const onMediaBarClick = (event) => {
    event.stopPropagation();
    setShowMediaList(prev => !prev);
  };

  const onMediaImageClick = () => {
    setShowMediaList(false);
    setTimeout(() => openFileSelector(acceptsImage), 1);
  };

  const onOpenContactModalClick = () => {
    setShowMediaList(false);
    setTimeout(() => setShowContactModal(true), 1);
  };

  const onCloseContactModalClick = () => {
    setTimeout(() => setShowContactModal(false), 1);
  };

  const onMediaVideoClick = () => {
    setShowMediaList(false);
    setTimeout(() => openFileSelector(acceptsVideo), 1);
  };

  const onMediaDocClick = () => {
    setShowMediaList(false);
    setTimeout(() => openFileSelector(acceptsDocument), 1);
  };

  const openFileSelector = (accept: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept;
      fileInputRef.current.click();
    }
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const link = URL.createObjectURL(file);
      const messageType = getMessageType();
      const validation = FileUtil.validateFile(file, messageType);

      setFileValidation({success: validation.success, error: validation.error});

      setMessage(prev => ({
        ...prev,
        type: messageType,
        link,
        originalFilename: file?.name,
        isChangedOrNewMedia: true
      }));
    }
  };

  const onRemoveMedia = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      setFileValidation({success: true, error: ''});
    }

    setMessage(prev => ({
      ...prev,
      type: 'TEXT',
      link: '',
      originalFilename: '',
    }));
  };

  const onRemoveContact = () => {
    setMessage(getDefaultMessage());
  };

  const onAddContact = (contact) => {
    const contactMessage = {
      type: 'CONTACT',
      name: contact.name,
      phones: contact.phones,
      link: '',
      originalFilename: '',
    };

    setMessage(contactMessage);
    onCloseContactModalClick();
  };

  const onSend = (msg) => {
    props.onSend(msg);

    if (isMediaMessage()) {
      onRemoveMedia();
    }

    setMessage(getDefaultMessage());
    setTimeout(() => resizeTextArea(), 1);
  };

  const isMediaMessage = () => {
    return message.type === 'IMAGE' || message.type === 'VIDEO' || message.type === 'DOCUMENT';
  };

  const getDefaultMessage = () => {
    return {
      type: 'TEXT',
      body: '',
      link: '',
      originalFilename: '',
    };
  };

  const getMessageType = () => {
    const accept = fileInputRef?.current?.accept;

    if (!accept) {
      return 'TEXT';
    }

    switch (accept) {
      case acceptsImage:
        return 'IMAGE';
      case acceptsVideo:
        return 'VIDEO';
      case acceptsDocument:
        return 'DOCUMENT';
      default:
        return 'TEXT';
    }
  };

  const getFileValidationMessage = () => {
    if (!fileValidation.success && fileValidation?.error === 'TYPE_NOT_IMPLEMENTED') {
      return t('file.validation.typeNotImplemented');
    }

    if (!fileValidation.success && fileValidation?.error === 'MAX_SIZE_EXCEEDED') {
      const validation = FileUtil.getMediaValidation(getMessageType());
      return t('file.validation.maxSize', {maxSize: (validation?.maxSize / (1024 * 1024))});
    }

    if (!fileValidation.success && fileValidation?.error === 'MIME_TYPE_NOT_ACCEPTED') {
      const validation = FileUtil.getMediaValidation(getMessageType());
      return t('file.validation.mimeType', {mimeTypes: validation.mimeTypes.join(', ')});
    }

    return '';
  };

  const resizeTextArea = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = '30px';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`;
    }
  }, []);

  return (
    <div className={`flex xyflow-node-background-color p-2 ${props?.cssClass}`} autoFocus={false}>
      <div className={'flex flex-row w-full items-end'}>
        <input
          type='file'
          ref={fileInputRef}
          style={{display: 'none'}}
          onChange={onFileChange}
        />

        {
          !props?.hideMediaOption && (
            <MdAdd className={'relative text-primary-600 cursor-pointer right-1'}
                   size={28}
                   onClick={onMediaBarClick}/>
          )
        }

        {showMediaList && (
          <div className='absolute nodrag nopan mb-5 ml-3 z-10'>
            <VerticalBar options={mediaOptions} onClickOutside={onMediaBarClick}/>
          </div>
        )}

        <div className={'flex flex-col w-full'}>
          {message?.link && message?.link?.length && (
            <div className={'flex flex-row w-full'}>
              {message.type === 'IMAGE' && (
                <div className={`${!fileValidation.success ? 'flex flex-col w-full' : 'w-full'}`}>
                  <img className={'w-full h-32 rounded-md mb-2 bg-no-repeat bg-center object-cover'} src={message?.link}
                       alt=''/>
                  {!fileValidation.success && (
                    <div className={'text-red-600 mb-1 text-sm'}>
                      {getFileValidationMessage()}
                    </div>
                  )}
                </div>
              )}
              {message.type === 'VIDEO' && (
                <div className={`${!fileValidation.success ? 'flex flex-col w-full' : 'w-full'}`}>
                  <video className={'w-full h-32 rounded-md mb-2 bg-no-repeat bg-center object-cover'}
                         src={message.link} controls></video>
                  {!fileValidation.success && (
                    <div className={'text-red-600 mb-1 text-sm'}>
                      {getFileValidationMessage()}
                    </div>
                  )}
                </div>
              )}
              {message.type === 'DOCUMENT' && (
                <div className={`${!fileValidation.success ? 'flex flex-col w-full' : 'w-full'}`}>
                  <embed className={'w-full h-32 rounded-md mb-2 bg-no-repeat bg-center object-cover'}
                         src={message.link}/>
                  {!fileValidation.success && (
                    <div className={'text-red-600 mb-1 text-sm'}>
                      {getFileValidationMessage()}
                    </div>
                  )}
                </div>
              )}
              <MdClose className={'relative cursor-pointer left-1'}
                       size={14}
                       onClick={onRemoveMedia}
              />
            </div>
          )}

          {message?.type === 'CONTACT' && (

            <div className={`flex flex-row items-center w-64 p-4`}>
              <div className={'rounded-full bg-gray-400 p-2'}>
                {React.createElement(MdPerson, {className: 'text-white', size: 32})}
              </div>

              <div
                className='ml-2 flex flex-col overflow-hidden'
                title={message?.name?.formatted_name}>
                <div className={'font-semibold overflow-hidden overflow-ellipsis whitespace-nowrap'}>
                  {message?.name?.formatted_name}
                </div>
                <div className={'overflow-hidden overflow-ellipsis whitespace-nowrap'}>
                  {message?.phones?.[0].phone}
                </div>
              </div>
              <MdClose className={'relative cursor-pointer self-baseline left-2 min-w-4'}
                       size={14}
                       onClick={onRemoveContact}
              />
            </div>

          )}

          <textarea
            ref={textareaRef}
            className={'rounded-md border-none p-1 box-border overflow-y-auto resize-none h-8 min-h-8 max-h-28 nodrag nopan nowheel w-full'}
            placeholder={placeHolderMessageBar}
            maxLength={props.maxLength}
            value={message?.body}
            onChange={onMessageChange}
          />
        </div>

        {showVariableList && (
          <GroupList cssClass={'left-10'} groups={groups}
                     onClick={(item) => onVariableClick(item)}/>
        )}

        <MdInsertEmoticon
          className={'relative cursor-pointer text-primary-600 left-1'}
          size={28}
          onClick={onEmojiClick}
        />

        {showEmojiPicker && (
          <div className='absolute mb-6 left-[18rem] z-10 nodrag nopan nowheel'>
            <Picker onEmojiSelect={onEmojiSelect} onClickOutside={onEmojiClick}/>
          </div>
        )}
        <MdSend
          className={'relative cursor-pointer text-primary-600 left-1'}
          size={28}
          style={{
            pointerEvents: message?.body?.trim() === '' && message.type === 'TEXT' ? 'none' : 'auto',
            opacity: message?.body?.trim() === '' && message.type === 'TEXT' ? 0.5 : 1
          }}
          onClick={() => onSend(message)}
        />
      </div>

      {
        showContactModal && createPortal(
          <ModalContact
            onSubmit={onAddContact}
            onCloseModal={onCloseContactModalClick}
            onCancel={onCloseContactModalClick}
          />,
          document.body)
      }
    </div>
  );
}

export default MessageBar;
