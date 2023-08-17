import { IBrandsPermissions, IPagePermissions } from '../common';

export const validate = (
    key: string,
    value: string | null | IPagePermissions[] | IBrandsPermissions[]
) => {
    const emailRegx = '[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
    // const phoneRegx = '/^(\\([0-9]{3}\\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}/';

    switch (key) {
        case 'email':
            if (!value) {
                return 'Email is required';
            }
            if (!new RegExp(emailRegx).test(value as string)) {
                return 'Please check the email address';
            }
            return '';

        case 'password':
            if (!value) {
                return 'Password is required';
            }
            return '';
        case 'job':
            if (!value) {
                return 'job is required';
            }
            return '';

        case 'confirmPassword':
            if (!value) {
                return 'confirmPassword is required';
            }
            return '';

        case 'name':
            if (!value) {
                return 'Please enter your group name';
            }
            return '';
        case 'groupName':
            if (value === '') {
                return 'Please enter your group name';
            }
            return '';

        case 'phone':
            if (!value) {
                return 'Please enter your phone number';
            }
            return '';

        case 'brandsPermissions':
            if ((value as IBrandsPermissions[])?.length < 1) {
                return 'Please select your Brands';
            }
            return '';

        case 'company':
            if (!value) {
                return 'Please select your company';
            }
            return '';
        case 'group':
            if (!value) {
                return 'Please select your group';
            }
            return '';

        case 'pageAreasPermissions':
            if ((value as IPagePermissions[])?.length < 1) {
                console.log('validate', value);
                return 'Please select your pageAreas';
            }
            return '';

        case 'companyName':
            if (!value) {
                return 'Please enter company name';
            }
            return '';

        case 'description':
            if (!value) {
                return 'Please enter company description';
            }
            return '';

        default:
            return '';
    }
};

export const get = (obj: Record<string, any>, path: string, def?: any): any => {
    const fullPath = path
        .replace(/\[/g, '.')
        .replace(/]/g, '')
        .split('.')
        .filter(Boolean);

    if (obj == null) {
        return def || null;
    }

    function everyFunc(step: string): boolean | null {
        if (obj[step] !== null) {
            // eslint-disable-next-line no-param-reassign
            const resultEveryFunc = !(step && (obj = obj[step]) === undefined);
            return resultEveryFunc;
        }
        return null;
    }

    return fullPath.every(everyFunc) ? obj : def;
};

export const getDateFormat = (dateValue: string) => {
    const date = new Date(dateValue).getDate();
    const month = new Date(dateValue).getMonth() + 1;
    const year = new Date(dateValue).getFullYear();

    if (month.toString().length === 1 && date.toString().length !== 1) {
        return [`0${month}`, date, year].join('/');
    }
    if (date.toString().length === 1 && month.toString().length !== 1) {
        return [month, `0${date}`, year].join('/');
    }
    if (date.toString().length === 1 && month.toString().length === 1) {
        return [`0${month}`, `0${date}`, year].join('/');
    }
    return [month, date, year].join('/');
};
