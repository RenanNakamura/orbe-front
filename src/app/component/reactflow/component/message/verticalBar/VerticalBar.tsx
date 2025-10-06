import React, {useEffect, useRef} from 'react';
import {IconType} from 'react-icons';

export interface Props {
    onClickOutside?: (event) => void;
    options?: { label: string; onClick: () => void; icon?: IconType; iconColor?: string }[];
}

function VerticalBar(props: Props) {
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                props.onClickOutside?.(event);
            }
        }

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [props]);

    return (
        <div ref={wrapperRef} className={`f-vertical-bar shadow border p-1`}>
            {
                props?.options?.map((option, i) => (
                    <div key={i}>
                        <li className={`flex flex-row p-1 ${i < props.options.length - 1 ? 'line-b' : ''}`}>
                            <div className={'option flex flex-col items-center p-1 w-full cursor-pointer'} onClick={option.onClick}>
                                {
                                    option?.icon && React.createElement(option?.icon, { className: option?.iconColor, size: 24 })
                                }
                                <span className={`label ${option?.iconColor}`}>{option?.label}</span>
                            </div>
                        </li>
                    </div>
                ))
            }
        </div>
    );
}

export default VerticalBar;
