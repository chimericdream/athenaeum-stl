export const rsToJsDateString = (rsDate: string): string => {
    return `${rsDate.replaceAll(' ', 'T')}Z`;
};
