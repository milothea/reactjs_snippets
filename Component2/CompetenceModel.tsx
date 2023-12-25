import React, { FC, useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb';
import Breadcrumb from 'src/components/common/Breadcrumb/Breadcrumb';
import Card from '../common/Card/Card';
import Divider from 'src/components/common/Divider/Divider';
import Spin from 'src/components/common/Spin/Spin';
import TreeWithSearch from './TreeWithSearch/TreeWithSearch';
import { Mode } from 'src/@types/common';
import { useModeContext } from 'src/context/ModeContext';
import { useDeleteSearchParams } from 'src/utils/hooks/useDeleteSearchParams';
import { goToViewMode } from './CompetencyForm/CompetencyForm.config';
import { SEARCH_PLACEHOLDER, getBreadcrumbsItems } from './CompetencyModel.config';
import { CompetencyModelProps } from './types';
import styles from './CompetencyModel.module.scss';


const CompetencyModel: FC<CompetencyModelProps> = observer(({
    onTreeFetch,
    treeData,
    isTreeLoading,
    isDataLoading,
    route,
    children
}) => {
    const { mode, id: selectedId, setId: setSelectedId } = useModeContext();
    const [searchedValue, setSearchedValue] = useState('');
    const [breadcrumbsItems, setBreadcrumbsItems] = useState<BreadcrumbItemType[]>([]);
    const deleteSearchParams = useDeleteSearchParams();

    useEffect( () => {
        onTreeFetch({ searchString: searchedValue });
    }, [searchedValue]);

    const onChangeSelectedId = useCallback((id: React.Key) => {
        if (mode && mode !== Mode.VIEW) {
            goToViewMode(deleteSearchParams);
        }

        setSelectedId && setSelectedId(String(id));
    },[setSelectedId, mode]);

    useEffect(() => {
        if (!searchedValue || String(selectedId) !== String(breadcrumbsItems[breadcrumbsItems.length - 1]?.key)) {
            const breadCrumbs = getBreadcrumbsItems(selectedId as string, treeData, onChangeSelectedId);


            setBreadcrumbsItems(breadCrumbs);
        }
    }, [onChangeSelectedId, selectedId, treeData]);

    const childrenProps = {
        onChangeSelectedId,
        selectedId: selectedId as string,
    };

    return (
        <div className={classNames('flex gap-24', styles.container)} key={route}>
            <Card className={styles.searchTree}>
                <TreeWithSearch
                    treeData={treeData}
                    searchPlaceholder={SEARCH_PLACEHOLDER[route]}
                    onSearchChange={(value: string) => setSearchedValue(value)}
                    onSelect={onChangeSelectedId}
                    selectedId={selectedId as React.Key}
                    isLoading={isTreeLoading}
                />
            </Card>
            <Spin spinning={isDataLoading} wrapperClassName={styles.spin}>
                <Card className={styles.content}>
                    <Breadcrumb
                        className="margin-left-16"
                        items={breadcrumbsItems}
                    />
                    <Divider className="margin-top-16" />
                    <div className={styles.childrenWrap}>
                        {children(childrenProps)}
                    </div>
                </Card>
            </Spin>
        </div>
    );
});

export default CompetencyModel;
