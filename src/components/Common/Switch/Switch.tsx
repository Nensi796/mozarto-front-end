import './switch.css';
import { useState } from 'react';

interface ISwitchProp {
    className?: string;
}

const Switch = ({ className }: ISwitchProp) => {
    const [isToggled, setIsToggled] = useState(false);
    const onToggle = () => setIsToggled(!isToggled);
    return (
        // <div className='toggle-switch'>
        //   <label>
        //     <input type='checkbox'>
        //       <span className='slider'></span>
        //   </label>
        //
        // </div>
        <label className={`${className as string} toggle-switch `}>
            <input
                type="checkbox"
                className={className}
                checked={isToggled}
                onChange={() => onToggle()}
            />
            <span className={`${className as string} switch`} />
        </label>
    );
};

export default Switch;
