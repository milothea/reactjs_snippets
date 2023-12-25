import { Dispatch, SetStateAction } from 'react';
import isEmpty from 'lodash/isEmpty';
import RestoreCompetencyContent from 'Component3/ModalContents/RestoreCompetencyContent';
import RestoreScaleContent from 'Component3/ModalContents/RestoreScaleContent';
import Links from 'src/constants/sitemap';
import { CompetencyCatalogModel, CompetencyTreeModel, ScaleModel } from '../types';

export interface ModalContentProps {
    data: CompetencyCatalogModel | ScaleModel;
    treeData?: CompetencyTreeModel[];
    setParentId: Dispatch<SetStateAction<number | null>>;
    parentId: number | null;
}

export const RestoreModalTitles = {
    [Links.COMPETENCY_CATALOG]: 'Restoring competency',
    [Links.SCALE_CATALOG]: 'Restoring scale',
};

export const getRestorePath = (currentCompetence: CompetencyCatalogModel, treeData: CompetencyTreeModel[]): string[] => {
    const path: string[] = [];
    let curItem = currentCompetence.parent || {} as CompetencyCatalogModel;

    do {
        curItem.name && path.push(curItem.name);

        // Fix to cover "feature" of data from BE when click on tree item with type 'Competence'
        // and its parental competence with type 'Category' has parent id
        // but doesn't have parent object to be used in creating breadcrumbs
        if (!curItem.parent && curItem.parentId) {
            const parent = treeData.filter(
                ({ id }) => id === curItem.parentId
            )[0];

            parent?.name && path.push(parent.name);
        }

        curItem = curItem.parent || {} as CompetencyCatalogModel;
    } while(!isEmpty(curItem))

    return path.reverse();
};

export const getModalContent = (catalogName: string, props: ModalContentProps) => {
    switch (catalogName) {
        case Links.COMPETENCY_CATALOG:
            return <RestoreCompetencyContent {...props} />;
        case Links.SCALE_CATALOG:
            return <RestoreScaleContent {...props} />;
        default:
            return <>Something went wrong</>;
    }
};
