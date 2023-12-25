import { Children } from 'react';
import { DEFAULT_BENCH_MESSAGE, checkIfOnBench, getBenchTitle } from '../OverallTab.config';
import { CircleData } from 'src/pages/EmployeesPage/types';
import styles from './CircleDataPopover.module.scss';


export const getCirclesData = (circles: any) => {
    if (checkIfOnBench(circles)) {
        return (
            <div className="margin-8 margin-left-12 margin-right-12">
                <div className={styles.benchName}>{getBenchTitle(circles[0])}</div>
                <div className={styles.benchMessage}>{DEFAULT_BENCH_MESSAGE}</div>
            </div>
        );
    }

    return (
        <div className="margin-8 margin-left-12 margin-right-12">
            {Children.toArray(circles.map((circle: CircleData) => <div className="flex justify-space-between margin-bottom-8">
                <div className={styles.defaultTextStyle}>{circle.circleName}</div>
                <div className={styles.defaultTextStyle}>{circle.workload.reduce(
                    (total, datum) => total + datum.capacity, 0)}</div>
            </div>))}
        </div>
    );
};
