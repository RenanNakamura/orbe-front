import React from 'react';
import {Tooltip} from 'react-tooltip';
import {IconType} from 'react-icons';
import {MdOutlineWarning} from 'react-icons/md';

export interface Props {
  img?: string;
  icon?: IconType;
  iconCss?: string;
  iconColor?: string;
  title: string;
  isNodeValid?: boolean;
  alertMessage?: string;
}

function Header(props: Props) {
  const {title, isNodeValid = true, icon, iconCss, iconColor = 'text-white'} = props;

  return (
    <div className={'p-4 items-center border-b'}>
      <div className='flex flex-row items-center'>
        <div className={`rounded-full p-2 ${iconCss}`}>
          {
            icon && React.createElement(icon, {className: iconColor, size: 24})
          }
        </div>
        <div className='ml-8 font-bold text-xl'>
          <span>{title}</span>
        </div>
        {!isNodeValid && (
          <div className={'absolute right-3 top-2'}>
            <MdOutlineWarning
              className={'cursor-pointer text-amber-400'}
              data-tooltip-id='alert'
              data-tooltip-content={props.alertMessage || 'Existem campos obrigatórios não preenchidos'}
              size={24}
            />
            <Tooltip id='alert'/>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
