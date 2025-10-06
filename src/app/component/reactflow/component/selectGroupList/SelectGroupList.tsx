import React, {useEffect, useState} from 'react';
import GroupList from '../groupList/GroupList';
import {MdClose, MdExpandLess, MdExpandMore} from 'react-icons/md';

export interface Group {
  title: string;
  type?: string;
  items: { label: string, value: string } [];
}

export interface Props {
  placeholder: string;
  groups: Group[];
  value: string;
  onClick: (value: { type: string, label: string, value: string }) => void;
}

function SelectGroupList(props: Props) {
  const {onClick} = props;
  const [itemSelected, setItemSelected] = useState(null);
  const [showGroupList, setShowGroupList] = useState(false);

  useEffect(() => {
    if (props?.value) {
      const defaultItemSelected = props.groups?.flatMap(group => group.items)
        .find(item => item.value === props?.value);
      setItemSelected(defaultItemSelected);
    }
  }, [props.value]);

  const handleClick = (item: { type: string, label: string, value: string }) => {
    setItemSelected(item);
    onClick(item);
    handleClickSelect();
  };

  const handleClickSelect = () => {
    setShowGroupList(!showGroupList);
  };

  const handleClickSelectOutside = () => {
    setTimeout(() => setShowGroupList(false), 100);
  };

  const handleRemoveItemSelected = () => {
    setItemSelected(null);
    onClick(null);
  };

  return (
    <div>
      <div className={'flex items-center cursor-pointer'} onClick={handleClickSelect}>
        {
          !itemSelected
            ? (<span>{props.placeholder}</span>)
            : (<span>{itemSelected?.label}</span>)
        }
        {
          !itemSelected
            ? (
              showGroupList
                ? (<MdExpandLess className={'cursor-pointer'} size={16}/>)
                : (<MdExpandMore className={'cursor-pointer'} size={16}/>)
            )
            : (
              <MdClose className={'relative cursor-pointer'}
                       size={16}
                       onClick={handleRemoveItemSelected}
              />
            )
        }
      </div>
      {
        showGroupList && <GroupList onClick={(value) => handleClick(value)}
                                    groups={props.groups}
                                    onClickOutside={() => handleClickSelectOutside()}></GroupList>
      }
    </div>
  );
}

export default SelectGroupList;
