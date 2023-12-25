import { FC, ReactElement, Children } from 'react';
import classNames from 'classnames';
import Checkbox from '../../../../common/Checkbox/Checkbox';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { createArrayOfStrings } from '../RequirementsStep.config';
import styles from './LevelsSettingsModal.module.scss';

const MIN_LEVELS_NUMBER = 1;

const createLevelsArray = (levelsNum: number, handler: (e: CheckboxChangeEvent, l: string) => void, selectedLevels: string[] = []): ReactElement[] => {
    const levels = createArrayOfStrings(levelsNum);
    const isMinimumChecked = selectedLevels.length === MIN_LEVELS_NUMBER;

    return levels.map((level) => {
        const isChecked = selectedLevels.includes(level);
        const labelClassNames =  classNames(styles.label, { [styles.disabled]: isMinimumChecked && isChecked });

        return (
            <div
                key={`level-checkbox--${level}`}
                className={styles.checkboxWrapper}
            >
                <Checkbox
                    disabled={isMinimumChecked && isChecked}
                    checked={isChecked}
                    onChange={(e: CheckboxChangeEvent) => handler(e, level)}
                />
                <label className={labelClassNames}>{`${level} level / grade`}</label>
            </div>
        )
    });
};

interface LevelsCheckboxGroupProps {
    levelsNumber: number;
    onChange: (e: CheckboxChangeEvent, l: string) => void;
    selectedLevels: string[];
}

const LevelsCheckboxGroup: FC<LevelsCheckboxGroupProps> = ({ levelsNumber, onChange, selectedLevels = [] }) => {
    const levelsArray = createLevelsArray(levelsNumber, onChange, selectedLevels);

    return (
        <div className={styles.checkboxGroupContainer}>
            {Children.toArray(levelsArray)}
        </div>
    );
};

export default LevelsCheckboxGroup;
