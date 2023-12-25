import { FC } from 'react';
import { ModalContentProps } from '../RestoreModal.config';


const RestoreScaleContent: FC<ModalContentProps> = ({ data }) => (
    <div className="b16">
        Are you sure you want to restore the scale "
        <span className="w-500">{data.name}</span>
        "?
    </div>
);

export default RestoreScaleContent;
