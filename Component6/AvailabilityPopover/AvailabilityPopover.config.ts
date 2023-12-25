import dayjs from 'dayjs';
import { AvailabilityData } from '../types';

export enum PopupContent {
    title = 'Availability setting',
    description = 'Set the available capacity of the employee for participation in new ' +
    'projects. Set to 0 if the employee is no longer available.',
    inputLabel = 'Available capacity',
    datePickerLabel = 'From',
    buttonLabel = 'Save',
};

export const INITIAL_AVAILABILITY: AvailabilityData = {
    availability: 0,
    availableFrom: dayjs(),
};
