import { isEmpty, isObject } from 'lodash';
import { DEFAULT_NOT_FOUND_BY_FILTERS, DEFAULT_NOT_FOUND_INFO } from 'src/constants/common';
import { DEFAULT_TABLE_TITLE } from '../common/EmployeesViewTable/EmployeesViewTable.config';
import { Dictionary } from 'src/@types/common';
import { DefaultCompetenciesKey, EmployeesPageTabKeys } from './types';


export const EmptyStateKeys = { ...EmployeesPageTabKeys, ...DefaultCompetenciesKey };

export const EMPTY_STATE_DATA = {
    [EmptyStateKeys.byPositions]: {
        message: DEFAULT_TABLE_TITLE,
        info: {
            filters: DEFAULT_NOT_FOUND_BY_FILTERS,
            default: DEFAULT_NOT_FOUND_INFO,
        },
    },
    [EmptyStateKeys.byCompetencies]: {
        message: DEFAULT_TABLE_TITLE,
        info: 'There are no results for selected competencies. Try another one',
    },
    [EmptyStateKeys.byCompetenciesDefault]: {
        message: 'No competencies',
        info: 'To start searching for employees, select competencies',
    },
    [EmptyStateKeys.overall]: {
        message: DEFAULT_TABLE_TITLE,
        info: {
            onlyAvailable: 'No employees with available capacity',
            filters: 'There are no results for selected filters. Try another one',
            default: DEFAULT_NOT_FOUND_INFO,
        },
    },
};

const getTitle = (node: Dictionary<any> = {}) => node.title || node.name;

export const getEmptyStateData = (name: string, tabKey: EmployeesPageTabKeys, ...filters: unknown[]) => {
    const isFiltersEmpty = filters.every((filter) => isEmpty(filter))
    const { info, message } = EMPTY_STATE_DATA[tabKey]
    const isInfoObject = isObject(info)
    const infoKey = name.length > 0 && isFiltersEmpty ? 'default' : 'filters'

    return {
        message,
        info: isInfoObject ? info[infoKey] : '',
    }
};
