import { PrimaryButton } from '../index';
import SvgIcon from '../Icon/SvgIcon';
import { IIcons } from '../../../data/common';

interface ISuccessPageProps {
    icon?: keyof IIcons;
    title: string;
    subtitle: string;
    handleOnSubmit: () => void;
}
const SuccessPage = ({
    icon,
    title,
    subtitle,
    handleOnSubmit,
}: ISuccessPageProps) => (
    <div className="flex flex-col justify-center items-center mx-auto w-[380px]">
        <SvgIcon icon={icon as keyof IIcons} />
        <div className="flex items-center text-center text-[32px] text-green-100 font-bold w-full mt-4">
            {title}
        </div>
        <div className="text-center text-sm font-base">{subtitle}</div>
        <div className="flex w-[100%]">
            <PrimaryButton
                onClick={() => handleOnSubmit()}
                type="button"
                name="Login"
                color="#2E672F"
                variant="filled"
                className="hover:bg-[#2E672F] hover:border-green-600 focus:border-green-600 mt-10 w-full font-medium"
            />
        </div>
    </div>
);

export default SuccessPage;
