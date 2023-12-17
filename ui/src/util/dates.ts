import { Temporal } from 'temporal-polyfill';

export const rsToJsDateString = (rsDate: string): string => {
    return `${rsDate.replaceAll(' ', 'T')}Z`;
};

export const rsToTemporal = (rsDate: string): Temporal.Instant => {
    return Temporal.Instant.from(rsToJsDateString(rsDate));
};
