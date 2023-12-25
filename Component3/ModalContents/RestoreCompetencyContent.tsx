import { FC } from 'react';
import isEmpty from 'lodash/isEmpty';
import CategoryTreeSelect from '../../CategoryTreeSelect/CategoryTreeSelect';
import { getRestorePath, ModalContentProps } from '../RestoreModal.config';
import { CompetencyCatalogModel } from 'src/components/CompetencyModel/types';
import styles from './RestoreContent.module.scss';


const RestoreCompetencyContent: FC<ModalContentProps> = ({ data, treeData, parentId, setParentId }) => {
    const path = getRestorePath(data as CompetencyCatalogModel, treeData || []);
    const noPath = isEmpty(path);

    return (
        <>
            {noPath ? (
                <>
                    <div className="b16 margin-bottom-8">
                        The “
                        <span className="w-500">{data.name}</span>
                        ” competency has no linked category.
                    </div>
                    <div className="b16 margin-bottom-8">
                        Select where the competency will be moved:
                    </div>
                    <CategoryTreeSelect
                        selectedId={parentId}
                        onChange={(id: number) => setParentId(id)}
                        selectClassName={styles.select}
                        popupClassName={styles.treeSelectPopup}
                    />
                </>
            ) : (
                <>
                    <div className="b16 padding-bottom-8">
                        The “
                        <span className="w-500">{data.name}</span>
                        ” competency will be restored in the “
                        <span>{path.join(' / ')}</span>
                        ” category.
                    </div>
                    <div className="b16">Are you sure you want to continue?</div>
                </>
            )}
        </>
    );
};

export default RestoreCompetencyContent;
