import { FC, useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { useLocalStorage } from 'react-use';
import CompetenciesTab from './CompetenciesTab/CompetenciesTab';
import DivisionSelect from '../common/DivisionSelect/DivisionSelect';
import Tabs from 'src/components/common/Tabs/Tabs';
import OverallTab from './OverallTab/OverallTab';
import PositionsTab from './PositionsTab/PositionsTab';
import { AccessStore } from 'src/store/Access';
import { EmployeesStore } from 'src/store/Employees';
import { STORAGE_KEYS } from 'src/constants';
import { filterByAccess, simulateBodyClick } from 'src/utils/helpers/common';
import { POSITIONS_DEFAULT_PARAMS } from './PositionsTab/PositionsTab.config';
import { OverallParamType, OverallSorting } from './OverallTab/types';
import { EmployeesPageTableSorting } from '../CompetencyBlockForm/types';
import { TabsProps } from '../common/Tabs/types';
import { EmployeesPageTabKeys } from './types';
import { AccessTypes } from 'src/@types/accesses';
import { SearchParam, SortDirection } from 'src/@types/common';
import { EmployeesPageFilterTypes, EmployeesPageFiltersState } from 'src/pages/EmployeesPage/types';
import styles from './EmployeesPageTabs.module.scss';


const EmployeesPageTabs: FC<TabsProps<EmployeesPageTabKeys>> = observer(({ activeTab, setActiveTab }) => {
    const [storageFilter, setStorageFilter] = useLocalStorage<EmployeesPageFiltersState>(STORAGE_KEYS.employeespage_filters);
    const [filterState, setFilterState] = useState<EmployeesPageFiltersState>(storageFilter)

    const { employeesPageHierarchies: departments, userHierarchies: userDepartmentId } = EmployeesStore
    const { access } = AccessStore;
    const departmentIds = useMemo(() => filterState[EmployeesPageFilterTypes.COMMON].departmentIds, [filterState])

    const onFiltersChange = (filterType: EmployeesPageFilterTypes) =>
        (newState: EmployeesPageFiltersState[keyof EmployeesPageFiltersState]) => setFilterState((prevState) => ({
            ...prevState,
            [filterType]: newState,
        }));

    useEffect(() => {
        EmployeesStore.fetchEmployeesPositionList(POSITIONS_DEFAULT_PARAMS);
        EmployeesStore.fetchEmployeesPageHierarchies();
    }, []);

    useEffect(() => {
        if (!departmentIds && userDepartmentId) {
            onFiltersChange(EmployeesPageFilterTypes.COMMON)({
                ...filterState[EmployeesPageFilterTypes.COMMON],
                departmentIds: userDepartmentId,
            });
        }
    }, [userDepartmentId, departmentIds, filterState]);

    useEffect(() => {
        setStorageFilter({
            ...filterState,
            [EmployeesPageFilterTypes.BY_POSITIONS]: {
                ...filterState[EmployeesPageFilterTypes.BY_POSITIONS],
                order: SortDirection.ascend,
                sorting: EmployeesPageTableSorting.default,
            },
            [EmployeesPageFilterTypes.OVERALL]: {
                ...filterState[EmployeesPageFilterTypes.OVERALL],
                order: SortDirection.ascend,
                sorting: OverallSorting.default,
            }
        })
    }, [setStorageFilter, filterState]);

    const onOverallFetch = () => EmployeesStore.fetchOverallEmployeesList({
        ...filterState[EmployeesPageFilterTypes.OVERALL],
        departmentIds,
    } as OverallParamType);


    const onTabClickHandler = (key: string) => {
        setActiveTab({ [SearchParam.tab]: EmployeesPageTabKeys[key as keyof typeof EmployeesPageTabKeys] });
        simulateBodyClick();
    };

    const TABS = [
        {
            label: EmployeesPageTabKeys.overall,
            key: EmployeesPageTabKeys.overall,
            children: (
                <OverallTab
                    filterState={filterState[EmployeesPageFilterTypes.OVERALL]}
                    onFiltersChange={onFiltersChange(EmployeesPageFilterTypes.OVERALL)}
                    departmentIds={departmentIds}
                />
            ),
            accesses: [AccessTypes.CAN_VIEW_EMPLOYEESPAGE_OVERALL_TAB],
        },
        {
            label: EmployeesPageTabKeys.byPositions,
            key: EmployeesPageTabKeys.byPositions,
            children: (
                <PositionsTab
                    filterState={filterState[EmployeesPageFilterTypes.BY_POSITIONS]}
                    onFiltersChange={onFiltersChange(EmployeesPageFilterTypes.BY_POSITIONS)}
                    departmentIds={departmentIds}
                    onOverallFetch={onOverallFetch}
                />
            ),
            accesses: [AccessTypes.CAN_VIEW_EMPLOYEESPAGE_POSITION_TAB],
        },
        {
            label: EmployeesPageTabKeys.byCompetencies,
            key: EmployeesPageTabKeys.byCompetencies,
            children: (
                <CompetenciesTab
                    filterState={filterState[EmployeesPageFilterTypes.BY_COMPETENCIES]}
                    onFiltersChange={onFiltersChange(EmployeesPageFilterTypes.BY_COMPETENCIES)}
                    departmentIds={departmentIds}
                />
            ),
            accesses: [AccessTypes.CAN_VIEW_EMPLOYEESPAGE_COMPETENCE_TAB],
        },
    ];

    const availableTabs = filterByAccess(TABS, access);

    return (
        <>
            <div className="card-header">
                <div className="h3 color-neutral-700">
                    Employees
                </div>
                <DivisionSelect
                    value={departmentIds ?? []}
                    treeData={toJS(departments)}
                    className={styles.divisionSelect}
                    onChange={onFiltersChange}
                    popupClassName={styles.divisionPopup}
                />
            </div>
            <Tabs
                activeKey={activeTab}
                onTabClick={onTabClickHandler}
                className={styles.tabs}
                items={availableTabs}
                destroyInactiveTabPane
            />
        </>
    );
});

export default EmployeesPageTabs;
