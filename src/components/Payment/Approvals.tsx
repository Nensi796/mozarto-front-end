import { PrimaryButton, PrimaryInput, Select } from '../Common';
import { IOptionProps } from '../../data/common';

const options: IOptionProps[] = [
    { key: 'Approval 1', title: 'Filter' },
    { key: 'Approval 2', title: 'Approval 2' },
];

const actionOptions: IOptionProps[] = [
    { key: 'Approval 1', title: 'Action' },
    { key: 'Approval 2', title: 'Approval 2' },
];

const PaymentApprovals = () => (
    <div>
        <div className="mx-6 flex items-center gap-5">
            <h1 className="font-black">Approvals</h1>
            <PrimaryInput
                iconPosition="left"
                icon="SEARCH_ICON"
                className="bg-white	border border-solid border-[#C8C8C8] !w-[450px] min-w-1/2 !pl-9"
                placeholder="Search by Tags, filters..."
            />
            <PrimaryButton
                className="!text-black !font-extrabold !bg-[#DEECAA] !rounded-xl"
                color="#8FB131"
                variant="filled"
                name="Pending Approvals"
            />{' '}
            <PrimaryButton
                className="!text-black !font-extrabold !bg-white !rounded-xl"
                color="#8FB131"
                variant="filled"
                name="Om Hold"
            />{' '}
            <PrimaryButton
                className="!text-black !font-extrabold !bg-white !rounded-xl"
                color="#8FB131"
                variant="filled"
                name="No KYC"
            />{' '}
            <PrimaryButton
                className="!text-black !font-extrabold !bg-white !rounded-xl"
                color="#8FB131"
                variant="filled"
                name="All Payments"
            />
            <Select
                className="!bg-white border border-solid border-[#C8C8C8] "
                options={options}
                label=""
                handleOnSelect={(e) => console.log(e.target.value)}
            />{' '}
            <Select
                className="!bg-white border border-solid border-[#C8C8C8]"
                options={actionOptions}
                label=""
                handleOnSelect={(e) => console.log(e.target.value)}
            />
            <PrimaryButton
                className=" !font-extrabold !h-[40px] !px-[10px] "
                color="#8FB131"
                variant="filled"
                name="Export"
            />
        </div>
    </div>
);
export default PaymentApprovals;
