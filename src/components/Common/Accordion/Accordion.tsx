import { useState } from 'react';

interface IAccordionProp {
    title: string;
    content: string;
}

const Accordion = ({ title, content }: IAccordionProp) => {
    const [isActive, setIsActive] = useState(false);

    return (
        <div className="accordion">
            <div className="accordion-item">
                <div
                    className="accordion-title"
                    onClick={() => setIsActive(!isActive)}
                >
                    <div>{title}</div>
                    <div>{isActive ? '-' : '+'}</div>
                </div>
                {isActive && <div className="accordion-content">{content}</div>}
            </div>
        </div>
    );
};
export default Accordion;
