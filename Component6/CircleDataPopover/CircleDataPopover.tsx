import { FC, useState } from 'react';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import Divider from 'src/components/common/Divider/Divider';
import IconWrapper from 'src/components/common/IconWrapper/IconWrapper';
import Popover from 'src/components/common/Popover/Popover';
import Spin from 'src/components/common/Spin/Spin';
import Tooltip from 'src/components/common/Tooltip/Tooltip';
import { EmployeesStore } from 'src/store/Employees';
import { ReactComponent as CirclesIcon } from 'src/css/icons/circles-icon.svg';
import { DEFAULT_ROW_KEY } from 'src/utils/hooks/useActiveRowKey';
import { getRelevantIcon, getTotalCapacity } from '../OverallTab.config';
import { getCirclesData } from './CircleDataPopover.config';
import { CircleData } from 'src/pages/EmployeesPage/types';
import styles from './CircleDataPopover.module.scss';


interface CircleDataPopoverProps {
    data: CircleData[];
    employeeName: string;
    onClick: (a?: number) => void
}

const CircleDataPopover: FC<CircleDataPopoverProps> = ({ data, employeeName, onClick }) => {
    const [open, setOpen] = useState(false);
    const { isOverallFetching: isLoading } = EmployeesStore;
    const totalCapacity = getTotalCapacity(data);

    const content = (
        <div className={styles.popoverContent}>
            <div className="h3 margin-left-12 margin-bottom-8">
                {`Capacity: ${employeeName}`}
            </div>
            <Divider />
            <Spin spinning={isLoading} className={classNames('flex justify-center', styles.spinner)}>
                {isEmpty(data) ? (
                    <div className={classNames('margin-bottom-8', styles.circlesEmptyState)}>
                        <div className={styles.title}>No data</div>
                        <div className={styles.description}>
                            This information is not available<br />
                            for a moment
                        </div>
                    </div>
                ) : (
                    <>
                        <div className={styles.circlesList}>
                            {getCirclesData(data)}
                        </div>
                        <div className="margin-left-12 margin-right-12 margin-bottom-12">
                            <Divider />
                            <div className="flex gap-12 justify-end margin-top-8">
                                <div className={classNames('flex gap-4 align-center', styles.totalContainer)}>
                                    {getRelevantIcon(totalCapacity)}
                                    <div className={styles.totalCapacity}>Total</div>
                                </div>
                                <div className={styles.totalCapacity}>{totalCapacity}</div>
                            </div>
                        </div>
                    </>
                )}
            </Spin>
        </div>
    );

    const onOpenChange = (isOpen: boolean) => {
        if (isOpen) {
            onClick();
        } else {
            onClick(DEFAULT_ROW_KEY);
        }

        setOpen(isOpen);
    };

    return (
        <div className={styles.circlesPopover}>
            <Popover
                placement="left"
                content={content}
                onOpenChange={onOpenChange}
                trigger="click"
                overlayClassName={styles.popover}
                destroyTooltipOnHide
                open={open}
            >
                <div className="flex justify-center">
                    <IconWrapper className={styles.circlesIcon}>
                        <Tooltip title="Current capacity">
                            <CirclesIcon />
                        </Tooltip>
                    </IconWrapper>
                </div>
            </Popover>
        </div>
    );
};

export default CircleDataPopover;
