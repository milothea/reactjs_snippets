import { FC, Key, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { TreeSelectDebounced as TreeSelect } from 'src/components/common/TreeSelect/TreeSelect';
import EmptyState from 'src/components/common/EmptyState/EmptyState';
import { CompetencyModelStore } from 'src/store/CompetencyModel';
import { ReactComponent as NodeArrow } from 'src/css/icons/tree-node-arrow.svg';
import { getModalTreeData, searchHandler } from 'Component1/CategoryTreeSelect.config';
import styles from './CategoryTreeSelect.module.scss';


interface CategoryTreeSelectProps {
    selectedId: number | null;
    onChange: (id: number) => void;
    selectClassName?: string;
    popupClassName?: string;
}

const CategoryTreeSelect: FC<CategoryTreeSelectProps> = ({selectedId, onChange, selectClassName, popupClassName}) => {
    const {initialCompetencesTree: competencesTree} = CompetencyModelStore;

    const [searchString, setSearchString] = useState('');
    const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);

    const relevantTree = useMemo(() => getModalTreeData(competencesTree, setExpandedKeys, Number(selectedId), styles.title), []);
    const [treeData, setTreeData] = useState(relevantTree);

    useEffect(() => {
        if (searchString) {
            const searchResult = searchHandler(relevantTree, searchString);

            setTreeData(searchResult);
            setExpandedKeys([...searchResult].map(({value}) => value));
        } else {
            setTreeData(relevantTree);
            setExpandedKeys([]);
        }
    }, [searchString, selectedId]);

    const changeHandler = (id: number) => {
        onChange(id);

        searchString && setSearchString('');
    };

    return (
        <TreeSelect
            treeData={treeData}
            value={selectedId}
            treeExpandedKeys={expandedKeys}
            searchValue={searchString}
            onSearch={(value: string) => setSearchString(value)}
            onChange={changeHandler}
            onTreeExpand={setExpandedKeys}
            placeholder="Select category"
            switcherIcon={<NodeArrow/>}
            notFoundContent={<EmptyState noIcon info="Check your spelling or search for a different keyword"/>}
            className={classNames(styles.treeSelect, selectClassName)}
            popupClassName={classNames(styles.treeSelectPopup, popupClassName)}
            filterTreeNode={false}
            treeCheckable={false}
            multiple={false}
            virtual={false}
            showSearch
            allowClear
        />
    );
};

export default CategoryTreeSelect;
