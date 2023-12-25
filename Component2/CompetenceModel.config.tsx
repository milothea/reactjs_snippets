import { Key } from 'react';
import isEmpty from 'lodash/isEmpty';
import classNames from 'classnames';
import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb';
import CompetencyCatalog from './CompetencyCatalog/CompetencyCatalog';
import ScalesCatalog from './ScalesCatalog/ScalesCatalog';
import Links from 'src/constants/sitemap';
import { CompetencyTreeModel, ContentProps, MarkscaleModel, ScaleTreeModel} from './types';
import styles from 'src/components/CompetencyModel/CompetencyModel.module.scss'


export const DEFAULT_SELECTED_ID = {
    [Links.COMPETENCY_CATALOG]: '1',
    [Links.SCALE_CATALOG]: 'active.markscales',
};

export const SEARCH_PLACEHOLDER = {
    [Links.COMPETENCY_CATALOG]: 'Search by category or competency',
    [Links.SCALE_CATALOG]: 'Search by scale',
};

export const getRelevantContent = (route: string, props: ContentProps) => {
    switch (route) {
        case Links.SCALE_CATALOG:
            return <ScalesCatalog {...props} />;
        case Links.COMPETENCY_CATALOG:
            return <CompetencyCatalog {...props} />;
        default:
            return <>Something went wrong</>;
    }
};

export const getFullPath = (items: ScaleTreeModel[] | MarkscaleModel[] | CompetencyTreeModel[], id: Key, onClick?: (id: Key) => void): BreadcrumbItemType[] => {
    let path: BreadcrumbItemType[] = [];

    items.forEach(({ id: itemId, name, children, type }) => {
        const pathItem = {
            key: itemId,
            title: name,
            name,
            type,
        };

        if (String(id) === String(itemId)) path.push(pathItem);

        if (children && !isEmpty(children)) {
            const pathBetween = getFullPath(children, id, onClick);

            if (!isEmpty(pathBetween)) {
                path = [...path, ...pathBetween, pathItem];
            }
        }
    });

    return path;
};

export const getBreadcrumbsItems = (selectedId: Key, treeData: ScaleTreeModel[] | CompetencyTreeModel[], onClick: (id: Key) => void): BreadcrumbItemType[] => {
    if (isEmpty(treeData)) return [];

    if (!selectedId) {
        return [{
            key: treeData[0]?.id || '',
            title: <span
                className={classNames(styles.currentItem)}
        >
            {treeData[0]?.name || ''}
            </span>,
        }];
    }

    const breadcrumbs: BreadcrumbItemType[] = getFullPath(treeData, selectedId, onClick).reverse();

    return breadcrumbs.map((item, i, items) => {
        if (i < items.length - 1) {
            return {
                ...item,
                title: <span
                    onClick={() => onClick(item.key || '')}
                className={styles.breadcrumb}
                    >
                    {item.title}
                    </span>,
            };
        }

        return {
            ...item,
            title: <span className={classNames(styles.currentItem)}>
                {item.title}
            </span>,
        };
    });
};
