import { makeAutoObservable } from 'mobx';
import { mapOverallEmployees, mapTagsFilter } from 'src/components/EmployeesPageTabs/OverallTab/OverallTab.config';
import { TagsFilterData } from 'src/components/EmployeesPageTabs/OverallTab/OverallTabFilters/types';
import {
    AvailabilityData, OverallEmployeeModel, OverallEmployeesList, OverallParamType, OverallTablePagination
} from 'src/components/EmployeesPageTabs/OverallTab/types';
import { mapEmployees } from 'src/components/EmployeesPageTabs/PositionsTab/PositionsTab.config';
import { PositionFilterType } from 'src/components/EmployeesPageTabs/PositionsTab/types';
import { EmployeesPageStats, Statistics } from 'src/components/EmployeesPageTabs/types';
import throwNotification, { NotificationTypes } from 'src/components/common/ThrowNotification/ThrowNotification';
import { DepartmentEmployees, DepartmentEmployeesTablePagination, EmployeeWithPositions } from 'src/pages/EmployeesPage/types';
import API from 'src/utils/api';
import { YYYY_MM_DD, getDate, getPagination } from 'src/utils/helpers';
import { User, UserStore } from './User';

const api = API.create();

class Employees {
    statistics: EmployeesPageStats = {
        atLeastOnePosition: {} as Statistics,
        atLeastTwoPositions: {} as Statistics,
        noPosition: {} as Statistics,
    };
    employeeList: DepartmentEmployees = {
        employees: [],
        pagination: {} as DepartmentEmployeesTablePagination,
    };
    isStatisticsFetching: boolean = false;
    isDepEmployeesFetching: boolean = false;
    overallEmployeesList: OverallEmployeesList = {
        employees: [],
        pagination: {} as OverallTablePagination,
        locationsList: [],
    };
    overallTagsFilter: TagsFilterData[] = [];
    isOverallFetching: boolean = false;
    isSavingAvailability: boolean = false;
    userStore: User;

    constructor(userStore: User) {
        this.userStore = userStore;
        makeAutoObservable(this);
    }

    *fetchEmployeeList(params: PositionFilterType) {
        this.isDepEmployeesFetching = true;

        const { ok, data } = yield api.getEmployeesPageEmployees(params);

        if (ok && data) {
            const { employeesPage } = data;
            const mappedEmployees = mapEmployees(employeesPage.employeesWithPositions);

            yield this.userStore.fetchAvatars(mappedEmployees, this.setEmployeeList);

            this.employeeList.pagination = getPagination(employeesPage);

        } else {
            throwNotification(NotificationTypes.ERROR, 'Error fetching employees list');
        }

        this.isDepEmployeesFetching = false;
    }

    *fetchStatistics(departmentIds: number[]) {
        this.isStatisticsFetching = true;

        const { ok, data } = yield api.getEmployeesPageStatistics(departmentIds);

        if (ok && data) {
            this.statistics = data;
        } else {
            throwNotification(NotificationTypes.ERROR, 'Error fetching employees page statistics');
        }

        this.isStatisticsFetching = false;
    }

    *fetchOverallEmployeesList(params: OverallParamType, onSuccess?: (overallTagsFilter: TagsFilterData[]) => void) {
        this.isOverallFetching = true;

        const { ok, data } = yield api.getOverallData(params);

        if (ok && data) {
            const { employeesWithPositions, page, perPage, returnAll, totalItems } = data.employeesPage;
            const mappedEmployees = mapOverallEmployees(employeesWithPositions);
            const mappedTagsFilter = mapTagsFilter(data.tagsFilter);

            yield this.userStore.fetchAvatars(mappedEmployees, this.setOverallEmployees);

            this.overallEmployeesList.pagination = { page, perPage, returnAll, totalItems };
            this.overallTagsFilter = mappedTagsFilter;
            onSuccess && onSuccess(mappedTagsFilter);
        } else {
            throwNotification(NotificationTypes.ERROR, 'Error fetching overall employees data');
        }

        this.isOverallFetching = false;
    }

    *saveEmployeeAvailability(availability: AvailabilityData, onSuccess: () => void) {
        this.isSavingAvailability = true;

        const { ok } = yield api.saveEmployeeAvailability({
            ...availability,
            availableFrom: getDate(availability.availableFrom, YYYY_MM_DD),
        });

        if (ok) {
            onSuccess && onSuccess();
            throwNotification(NotificationTypes.SUCCESS, 'The employee\'s availability has been set');
        } else {
            throwNotification(NotificationTypes.ERROR, 'Error saving employee availability');
        }

        this.isSavingAvailability = false;
    }

    setEmployeeList = (employeeList: EmployeeWithPositions[]) => this.employeeList.employees = employeeList;

    setOverallEmployees = (employeesList: OverallEmployeeModel[]) => this.overallEmployeesList.employees = employeesList;
}

export const EmployeesStore = new Employees(UserStore);
