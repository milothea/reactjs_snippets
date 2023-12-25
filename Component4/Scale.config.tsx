import { Children } from 'react';
import classNames from 'classnames';
import Divider from 'src/components/common/Divider/Divider';
import type { ColumnsType } from 'antd/es/table';
import { MarkscalePoint } from '../../types';
import styles from '../../CompetencyModel.module.scss';

export enum DetailsTitles {
    COMPETENCIES = 'Used in competencies',
    CATEGORIES = 'Used in categories',
}

export const indicatorsColumns: ColumnsType = [
    {
        title: 'Indicator',
        dataIndex: 'name',
        align: 'left',
    },
    {
        title: 'Weight',
        dataIndex: 'weight',
        align: 'center',
        width: '10%',
    },
];

export const markscaleColumns = [
    {
        title: 'Level',
        dataIndex: 'mark',
        width: 56,
        align: 'center' as 'center',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        width: '23%',
    },
    {
        title: 'Description',
        dataIndex: 'description',
    }
];

export const getTooltipContent = (markscalePoints: MarkscalePoint[] = []) => (
    <div>
        <div className={classNames('h4', styles.title)}>Level</div>
        <Divider />
        <div className="padding-8-12">
            {Children.toArray(markscalePoints.map(({ mark, name }: MarkscalePoint) => (
                <>
                    <div className={classNames('flex align-center', styles.row)}>
                        <div className="padding-8">{mark}</div>
                        <div className="padding-8">{name}</div>
                    </div>
                    <Divider />
                </>
            )))}
        </div>
    </div>
);
