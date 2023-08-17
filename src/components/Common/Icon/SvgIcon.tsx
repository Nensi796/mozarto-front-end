import { DetailedHTMLProps, HTMLAttributes } from 'react';
import { ICONS } from './Icons';
import { IIcons } from '../../../data/common';

interface ISvgIconProps
    extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
    /**
     * key of the icon
     */
    icon: keyof IIcons;
    fill?: string;
}

const SvgIcon = ({ fill, icon, ...restProps }: ISvgIconProps): JSX.Element => (
    <i {...restProps}>{ICONS[`${icon}`]}</i>
);

export default SvgIcon;
