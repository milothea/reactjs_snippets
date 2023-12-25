import { Dayjs } from 'dayjs';
import {
    Accesses,
    Dictionary,
    EmployeeDefault,
    Identifiable,
    TablePagination,
    TableWithPaginationPayload,
    WithKey,
    WithLocation
} from 'src/@types/common';
import { CircleData, PositionModelShort } from 'src/pages/EmployeesPage/types';

export enum OverallSorting {
    default = 'DEFAULT',
    employee = 'EMPLOYEE',
    positions = 'POSITION',
    level = 'LEVEL',
    location = 'LOCATION',
    availability = 'AVAILABILITY',
}

export interface AvailabilityData {
    availability: number
    availableFrom: Dayjs | null
    userId?: number
}

export type AvailabilityDataPayload = Omit<AvailabilityData, 'availableFrom'> & {
    availableFrom: string;
}

export interface OverallEmployeeModel extends EmployeeDefault, WithLocation, Identifiable {
    employee?: Dictionary<any>;
    positions: PositionModelShort[] | null;
    positionIdAndLevelMap: Dictionary<number>;
    availability: AvailabilityData | null;
    circles: CircleData[];
    accesses: Accesses;
}

export type OverallEmployeeWithKey = OverallEmployeeModel & WithKey;

export interface OverallTablePagination extends TablePagination {
    returnAll: boolean;
    totalItems: number;
}

export interface LocationData {
    id: number;
    name: string;
}

export interface OverallEmployeesList {
    employees: OverallEmployeeModel[];
    pagination: OverallTablePagination;
    locationsList: LocationData[];
}

export interface OverallParamType extends Partial<TableWithPaginationPayload<OverallSorting>> {
    countFilter: string;
    returnAll: boolean;
    showOnlyAvailable: boolean;
    locationIds: number[];
    tagFilter: string[];
    positionIds: number[];
    departmentIds: number[];
    name: string;
}
