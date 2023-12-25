import { FC, useEffect, useState } from 'react';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import Modal from 'src/components/common/Modal/Modal';
import LevelsCheckboxGroup from './LevelsCheckboxGroup';
import styles from './LevelsSettingsModal.module.scss';

interface LevelsSettingsModalProps {
    onCancel: () => void;
    onSubmit: (a: string[]) => void;
    open: boolean;
    levelsNumber: number;
    selectedLevels?: string[];
}

const LevelsSettingsModal: FC<LevelsSettingsModalProps> = ({ onCancel, onSubmit, selectedLevels = [], ...props }) => {
    const [checked, setChecked] = useState <string[]>([]);

    useEffect(() => setChecked(selectedLevels), [selectedLevels]);

    const changeHandler = (e: CheckboxChangeEvent, level: string) => {
        e.target.checked ?
            setChecked((prevState) => [...prevState, level])
            :
            setChecked((prevState) =>
                [...prevState].filter((val) => val !== level));
    };

    const cancelHandler = () => {
        setChecked(selectedLevels);
        onCancel();
    };

    return (
        <Modal
            title="Level settings"
            textSubmit="Save"
            textCancel="Cancel"
            width={400}
            onSubmit={() => onSubmit(checked)}
            onCancel={cancelHandler}
            {...props}
        >
            <div className={styles.container}>
                <div className={styles.label}>
                    Select the number of levels of specialists in this block.
                </div>
                <LevelsCheckboxGroup
                    onChange={changeHandler}
                    selectedLevels={checked}
                    {...props} />
            </div>
        </Modal>
    );
};

export default LevelsSettingsModal;
