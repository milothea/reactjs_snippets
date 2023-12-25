import { Children, Dispatch, ReactNode, SetStateAction } from 'react';
import type { ColumnType } from 'antd/es/table';
import classNames from 'classnames';
import { round } from 'lodash';
import AvailabilityPopover from './AvailabilityPopover/AvailabilityPopover';
import CircleDataPopover from 'src/components/EmployeesPageTabs/OverallTab/CircleDataPopover/CircleDataPopover';
import { ReactComponent as WarningIcon } from 'src/css/icons/warning-icon.svg';
import { SetActiveRowKeyType, onTriggerNodeClick } from 'src/utils/hooks/useActiveRowKey'.;
import { ColumnsKeys } from 'src/components/EmployeesPageTabs/PositionsTab/PositionsTab.config';
import renderDivisions from 'src/components/common/Table/renderers/renderDivisions/renderDivisions';
import renderEmployeeWithDetails from 'src/components/common/Table/renderers/renderEmployeeWithDetails/renderEmployeeWithDetails';
import { EMPTY_STATE_DATA, getEmptyStateData as getData } from '../EmployeesPageTabs.config';
import { EmployeesPageTabKeys } from '../types'
import { CircleData, CircleTypes } from 'src/pages/EmployeesPage/types';
import { OverallFilterType } from './OverallTabFilters/types';
import { OverallEmployeeWithKey } from './types';
import { AccessTypes } from 'src/@types/accesses';
import styles from './OverallTab.module.scss';

enum WarningTypes {
    red = 'red',
    orange = 'orange'
}

export const DEFAULT_BENCH_MESSAGE = 'The employee wasn\'t included in any circle';
const BENCH_TYPES = [CircleTypes.BENCH, CircleTypes.BENCH_TEAM];
const CAPACITY_PRECISION = 2;
const DEFAULT_BENCH_CIRCLE_TITLE = 'Bench';

const WARNING_ICONS = {
    [WarningTypes.red]: <WarningIcon />,
    [WarningTypes.orange]: <WarningIcon fill="#F18D13" />,
};

export const getRelevantIcon = (value: number = 0): ReactNode => {
    if (value === 0 || value > 1) return WARNING_ICONS[WarningTypes.red];

    if (value > 0 && value < 1) return WARNING_ICONS[WarningTypes.orange];

    return <></>;
};

export const checkIfOnBench = (circles: CircleData[]) => circles.every(({ circleType }) => BENCH_TYPES.includes(circleType));

export const getBenchTitle = ({ circleType, circleName }: CircleData) => {
    if (circleType === CircleTypes.BENCH_TEAM) {
        return `Bench Team: ${circleName}`;
    }

    return DEFAULT_BENCH_CIRCLE_TITLE;
};

export const getTotalCapacity = (data: CircleData[] = []) => {
    let total: number = 0;

    if (checkIfOnBench(data)) return total;

    data.forEach((circle) => {
        circle.workload.forEach((workloadData) => total += workloadData.capacity);
    });

    return round(total, CAPACITY_PRECISION);
};

const renderPositionColumn = (_: any, record: OverallEmployeeWithKey) => {
    if (!record.positions) {
        return <div className={styles.noData}>Unassigned</div>;
    }

    if (record.positions.length > 1) {
        return (
            <ul className={styles.positionsList}>
                {Children.toArray(
                    record.positions?.map(
                        ({ positionTitle }, i: number) => (
                            <li>{`${i + 1}. ${positionTitle}`}</li>
                        )
                    )
                )}
            </ul>
        );
    }

    return <div>{record.positions[0].positionTitle}</div>;
};

const renderLevelColumn = (_: any, record: OverallEmployeeWithKey) => {
    const notAvailableLevel = (
        <div className={classNames(styles.noData, styles.alignCenter)}>Pending</div>
    );

    if (!record.positions) return notAvailableLevel;

    return (
        <ul className={styles.positionsList}>
            {Children.toArray(
                record.positions?.map(({ positionId }) => (
                    <li className={styles.alignCenter}>
                        {record.positionIdAndLevelMap[positionId] || notAvailableLevel}
                    </li>
                ))
            )}
        </ul>
    );
};

const renderAvailabilityColumn = (setActiveRowKey: Dispatch<SetStateAction<any>>, onUpdateAvailability: any) =>
    (_: any, record: OverallEmployeeWithKey) => {
        const canSetAvailability = AccessTypes.CAN_SET_AVAILABILITY in record.accesses;
        return (
            <AvailabilityPopover
                userId={record.id}
                availability={record.availability}
                canSetAvailability={canSetAvailability}
                onClick={(rowKey?: number) =>
                    onTriggerNodeClick(setActiveRowKey, record.key, rowKey)
                }
                onSave={onUpdateAvailability}
            />
        );
    };

const renderCirclesColumn = (setActiveRowKey: Dispatch<SetStateAction<any>>) =>
        (_: any, record: OverallEmployeeWithKey) => (
            <CircleDataPopover
                data={record.circles || []}
                employeeName={record.name}
                onClick={(rowKey?: number) => onTriggerNodeClick(setActiveRowKey, record.key, rowKey)}
            />
        );

export const getColumns = (
    setActiveRowKey: SetActiveRowKeyType,
    onUpdateAvailability: any,
    canViewEmployeeDetails: boolean,
    onClose?: () => void
): ColumnType<any>[] => [
        {
            title: 'Employee',
            dataIndex: 'employee',
            key: 'employee',
            sorter: true,
            ellipsis: true,
            width: canViewEmployeeDetails ? '30%' : '23%',
            render: renderEmployeeWithDetails(setActiveRowKey, onClose)
        },
        {
            title: 'Position',
            dataIndex: 'positions',
            key: 'positions',
            sorter: true,
            ellipsis: true,
            width: canViewEmployeeDetails ? '30%' : '19%',
            render: renderPositionColumn,
        },
        ...(!canViewEmployeeDetails ? [{
            title: 'Department',
            dataIndex: ColumnsKeys.division,
            ellipsis: true,
            sorter: true,
            width: '23%',
            render: renderDivisions,
        }] : []),
        {
            title: 'Level',
            dataIndex: 'level',
            key: 'level',
            sorter: true,
            ellipsis: true,
            width: canViewEmployeeDetails ? '12%' : '7%',
            render: renderLevelColumn,
        },
        {
            title: 'Office',
            dataIndex: 'location',
            key: 'location',
            sorter: true,
            ellipsis: true,
            width: '12%',
            render: (_: any, record: OverallEmployeeWithKey) => <span data-testid={`${record.id}-office`}>{record.location}</span>
        },
        {
            title: 'Availability',
            dataIndex: 'availability',
            key: 'availability',
            width: '12%',
            ellipsis: true,
            sorter: true,
            render: renderAvailabilityColumn(setActiveRowKey, onUpdateAvailability),
        },
        {
            title: '',
            dataIndex: 'circles',
            key: 'circles',
            render: renderCirclesColumn(setActiveRowKey),
        },
    ];


export const getEmptyStateData = ({ showOnlyAvailable, positionIds, locationIds, name,
}: OverallFilterType) => {
    if (showOnlyAvailable) {
        const { message, info } = EMPTY_STATE_DATA[EmployeesPageTabKeys.overall];

        return { message, info: info.onlyAvailable };
    }

    return getData(name, EmployeesPageTabKeys.overall, locationIds, positionIds);
};
