import { FC, useState } from 'react';
import Modal from 'src/components/common/Modal/Modal';
import Links from 'src/constants/sitemap';
import { RestoreModalTitles, getModalContent } from './RestoreModal.config';
import { CompetencyTreeModel } from '../types';


interface RestoreModalProps {
    catalogName: string;
    itemData: any;
    treeData?:  CompetencyTreeModel[];
    onCancel: () => void;
    onSubmit: (id: number | null) => void;
    open: boolean;
}

const RestoreModal: FC<RestoreModalProps> = ({ catalogName, itemData, treeData = [], onSubmit, ...props}) => {
    const [parentId, setParentId] = useState<number | null>(null);
    const title = RestoreModalTitles[catalogName];
    const disabledSubmit = catalogName === Links.COMPETENCY_CATALOG && !itemData.parentId && !parentId;

    const contentProps = {
        data: itemData,
        treeData,
        parentId,
        setParentId
    };

    return (
        <Modal
            title={title}
            textSubmit="Restore"
            disabledSubmit={Boolean(disabledSubmit)}
            onSubmit={() => onSubmit(parentId)}
            {...props}
        >
            {getModalContent(catalogName, contentProps)}
        </Modal>
    );
};

export default RestoreModal;
