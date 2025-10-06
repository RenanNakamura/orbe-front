import React, {useEffect, useRef} from 'react';
export interface Group {
    title: string;
    type?: string;
    items: { label: string, value: string }[];
}

export interface Props {
    onClick: (value: { type: string, label: string, value: string }) => void;
    onClickOutside?: () => void;
    groups: Group[];
    cssClass?: string;
}

function GroupList(props: Props) {
    const {onClick} = props;
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: PointerEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                if (props.onClickOutside) {
                    props.onClickOutside();
                }
            }
        }

        document.addEventListener('pointerdown', handleClickOutside);

        return () => {
            document.removeEventListener('pointerdown', handleClickOutside);
        };
    }, [wrapperRef]);

    const handleClick = (type: string, item: { label: string, value: string }) => {
        const result = {
            type,
            label: item.label,
            value: item.value
        };
        onClick(result);
    };

    return (
        <div className='f-group-list'>
            <div className={`groups p-1 mt-1 z-10 ${props?.cssClass}`} ref={wrapperRef} autoFocus={true}>
                {props.groups?.map((group, categoryIndex) => (
                    <div key={categoryIndex}>
                        <span className='flex justify-center title pb-1'>
                            {group.title}
                        </span>
                        <ul>
                            {group.items.map((item) => (
                                <div key={item.value} className='flex item m-1'
                                     onClick={() => handleClick(group.type, item)}>
                                    <li>
                                        {item.label}
                                    </li>
                                </div>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GroupList;
