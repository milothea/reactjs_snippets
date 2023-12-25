import { Dispatch, SetStateAction, Key } from 'react';
import isEmpty from 'lodash/isEmpty';
import { findSearchText } from 'src/utils/helpers';
import { TreeSelectNodeType } from 'src/components/common/TreeSelect/TreeSelect';
// import { CompetencyTreeModel, StatusType } from '../types';
import styles from './CategoryTreeSelect.module.scss';


// types from '../types.ts'
export enum CompetenceType {
    LAYER = 'Layer',
    CATEGORY = 'Category',
    COMPETENCE = 'Competence',
}

export enum StatusType {
    ACTIVE = 'Active',
    PROCESSING = 'Processing',
    ARCHIVED = 'Archived',
}

export interface CompetencyTreeModel {
    id: number | string;
    name: string;
    type: CompetenceType;
    status: string;
    children?: CompetencyTreeModel[];
}
//

export const getModalTreeData = (
    treeData:  CompetencyTreeModel[],
    setExpandedKeys: Dispatch<SetStateAction<Key[]>>,
    curId: number,
    className: string
) => {
    const onClick = (id: string | number) => {
        setExpandedKeys((prevKeys) => {
            const idToNumber = Number(id);

            if (prevKeys.includes(idToNumber)) {
                return [...prevKeys].filter((key) => Number(key) !== idToNumber);
            }

            return [...prevKeys, idToNumber];
        });
    };
    const mapTreeNode = ({ id, name }: CompetencyTreeModel): any => {
        return {
            value: id,
            title: <span>{name}</span>,
        };
    }
    const mappedData: TreeSelectNodeType[] = [];

    for (let i = 0; i < treeData.length; i++) {
        const { id, name, children, status } = treeData[i];

        if (status === StatusType.ARCHIVED || isEmpty(children) || id === curId) continue;

        const treeItem = {
            value: id,
            title: <span
                className={className}
                id={String(id)}
                onClick={() => onClick(id)}
        >
            {name}
            </span>,
            selectable: false,
            children: children?.map(mapTreeNode).filter(({ value }) => value !== curId ) || []
        };

        mappedData.push(treeItem as TreeSelectNodeType);
    }

    return mappedData.filter(({ children }) => !isEmpty(children));
};

export const searchHandler = (treeData: any[], searchString: string) => {
    const result = treeData.map((item: any) => ({
        ...item,
        children: item.children.reduce((res: any[], child: any) => {
            const title = child.title.props.children;

            if (title.toLowerCase().includes(searchString.toLowerCase().trim())) {
                return [...res, {
                    ...child,
                    title: <span>{findSearchText(title, searchString, styles.searchResult)}</span>,
                }];
            }

            return res;
        }, [] as any[]);
    }));

    return  result.filter(({ children }) => !isEmpty(children));
};
