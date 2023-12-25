import { FC } from 'react';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import Description from 'src/components/common/Description/Description';
import Table from 'src/components/common/Table/Table';
import IndicatorsDetails from '../IndicatorsDetails/IndicatorsDetails';
import { addKeysFromIds } from 'src/utils/helpers';
import { markscaleColumns, DetailsTitles } from './Scale.config';
import { ScaleModel } from '../../types';
import styles from '../../CompetencyModel.module.scss';


interface ScaleProps {
    data: ScaleModel;
    withUsageInfo?: boolean;
}

const UsageInfo: FC<{ usedIn: string[], title: DetailsTitles, blockKey: string }> = ({ usedIn, title, blockKey }) => (
    <div className={styles.usageInfo} key={blockKey}>
        <div className="flex align-center gap-4">
            <span className="b16 color-neutral-700">{title}</span>
            <div className={styles.usageTag}>{usedIn.length}</div>
        </div>
        {!isEmpty(usedIn) && (
            <Description content={usedIn.join(', ')} />
        )}
    </div>
);

const Scale: FC<ScaleProps> = ({ data, withUsageInfo = false }) => {
    const {
        id,
        indicators,
        indicatorsMarkscale,
        markscalePoints,
        usedInCategories,
        usedInCompetencies,
    } = data;

    return (
        <>
            <div className={classNames('margin-bottom-16', styles.tableWrap)}>
                <Table
                    dataSource={addKeysFromIds(markscalePoints)}
                    columns={markscaleColumns}
                    rowClassName={styles.row}
                    pagination={false}
                />
                <div className={styles.gradient}/>
            </div>
            {(indicators || indicatorsMarkscale) && (
                <IndicatorsDetails
                    indicators={indicators || []}
                    indicatorsMarkscale={indicatorsMarkscale}
                />
            )}
            {withUsageInfo && (
                <UsageInfo
                    usedIn={usedInCompetencies || []}
                    title={DetailsTitles.COMPETENCIES}
                    blockKey={`${id}-competencies`}
                />
            )}
            {withUsageInfo && (
                <UsageInfo
                    usedIn={usedInCategories || []}
                    title={DetailsTitles.CATEGORIES}
                    blockKey={`${id}-categories`}
                />
            )}
        </>
    );
};

export default Scale;
