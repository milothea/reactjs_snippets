import { FC, useCallback, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import EmployeesViewTable from 'src/components/common/EmployeesViewTable/EmployeesViewTable';
import OverallTabFilters from './OverallTabFilters/OverallTabFilters';
import Spin from 'src/components/common/Spin/Spin';
import { AccessStore } from 'src/store/Access';
import { EmployeesStore } from 'src/store/Employees';
import { useActiveRowKey } from 'src/utils/hooks/useActiveRowKey';
import { DEFAULT_PAGE, DEFAULT_PAGE_COUNT } from 'src/constants';
import { addKeysFromIds, pluralize } from 'src/utils/helpers';
import { EmployeesPageTabProps } from '../types';
import { getColumns, getEmptyStateData } from './OverallTab.config';
import { OverallFilterType } from './OverallTabFilters/types';
import { AvailabilityData, OverallParamType, OverallSorting } from './types';
import { AccessTypes } from 'src/@types/accesses';
import { Dictionary, SortDirection } from 'src/@types/common';
import styles from './OverallTab.module.scss';


const OverallTab: FC<EmployeesPageTabProps<OverallFilterType>> = observer(({ filterState, onFiltersChange, departmentIds }) => {
    const [activeRowKey, setActiveRowKey] = useActiveRowKey()
    const { overallEmployeesList, isOverallFetching, userStore } = EmployeesStore;
    const { employees, pagination } = overallEmployeesList;
    const { isAvatarsFetching } = userStore;
    const { totalItems } = pagination;
    const { info, message } = getEmptyStateData(filterState);
    const canViewEmployeeDetails = AccessTypes.CAN_VIEW_EMPLOYEE_DETAILS in AccessStore.access;
    const canSearchEmployee = AccessTypes.CAN_SEARCH_EMPLOYEE_EMPLOYEESPAGE_OVERALL_TAB in AccessStore.access;
    const isLoading = isOverallFetching || isAvatarsFetching;

    const fetchEmployees = useCallback((page?: number) => {
        if (departmentIds) {
            EmployeesStore.fetchOverallEmployeesList({
                ...filterState,
                departmentIds,
                page: page || filterState.page,

            } as OverallParamType)
        }
    }, [filterState, departmentIds]);


    useEffect(() => {
        EmployeesStore.fetchLocations();
    }, []);

    const onTableChange = (config: any, _: any, sorter: Dictionary<any>) => {
        onFiltersChange({
            ...filterState,
            page: config.current || DEFAULT_PAGE,
            perPage: config.pageSize || DEFAULT_PAGE_COUNT,
            order: SortDirection[sorter.order as keyof typeof SortDirection] || SortDirection.ascend,
            sorting: sorter.order ? OverallSorting[sorter.field as keyof typeof OverallSorting] : OverallSorting.default,
        });
    };

    const onUpdateAvailability = useCallback(
        (availability: AvailabilityData) =>
            EmployeesStore.saveEmployeeAvailability(availability, fetchEmployees)
        , [fetchEmployees]);

    const dataSource = useMemo(() => addKeysFromIds(employees), [employees])

    const columns = useMemo(
        () => getColumns(setActiveRowKey, onUpdateAvailability, canViewEmployeeDetails)
        , [setActiveRowKey, onUpdateAvailability, canViewEmployeeDetails]);

    return (
        <Spin spinning={isLoading}>
            <div className={styles.container}>
                <OverallTabFilters filterState={filterState} onFiltersChange={onFiltersChange} />
                <div className={classNames(styles.totalItems, { [styles.customView]: !canSearchEmployee })}>
                    <span className={styles.totalText}>
                        {typeof totalItems !== "undefined" && `Found ${totalItems} ${pluralize('employee', 'employees', totalItems)}`}
                    </span>
                </div>
            </div>
            <div className={classNames(styles.tableWrap, { [styles.withDepartment]: !canViewEmployeeDetails })}>
                <EmployeesViewTable
                    onChange={onTableChange}
                    dataSource={dataSource}
                    columns={columns}
                    tableClassName={styles.table}
                    activeRowKey={activeRowKey}
                    page={pagination.page}
                    perPage={pagination.perPage}
                    employeesTotal={pagination.totalItems}
                    emptyInfo={info}
                    message={message}
                    emptyStateClassName={styles.emptyState}
                    withPagination
                />
            </div>
        </Spin>
    );
});

export default OverallTab;
