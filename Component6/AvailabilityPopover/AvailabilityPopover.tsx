import { FC, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Dayjs } from 'dayjs';
import Button, { ButtonType } from 'src/components/common/Button/Button';
import DatePicker from 'src/components/common/DatePicker/DatePicker';
import Divider from 'src/components/common/Divider/Divider';
import IconWrapper from 'src/components/common/IconWrapper/IconWrapper';
import InputNumber from 'src/components/common/InputNumber/InputNumber';
import Popover from '../../../common/Popover/Popover';
import Tooltip from 'src/components/common/Tooltip/Tooltip';
import { ReactComponent as EditIcon } from 'src/css/icons/edit-icon.svg';
import { DEFAULT_ROW_KEY } from 'src/utils/hooks/useActiveRowKey';
import { DDMMYYYY, getDate } from 'src/utils/helpers/common';
import { INITIAL_AVAILABILITY, PopupContent } from './AvailabilityPopover.config';
import { AvailabilityData } from '../types';
import styles from './AvailabilityPopover.module.scss';


interface AvailabilityPopoverProps {
    userId: number;
    availability: AvailabilityData | null;
    canSetAvailability: boolean;
    onClick: any;
    onSave: (a: AvailabilityData) => void;
}

const AvailabilityPopover: FC<AvailabilityPopoverProps> = ({
    userId,
    availability,
    canSetAvailability,
    onClick,
    onSave,
}) => {
    const popoverContainer = useRef<any>();
    const [customAvailability, setCustomAvailability] = useState<AvailabilityData>(INITIAL_AVAILABILITY);
    const [open, setOpen] = useState(false);

    const onOpenChange = (isOpen: boolean) => {
        if (isOpen) {
            onClick();
        } else {
            onClick(DEFAULT_ROW_KEY);
            setCustomAvailability(availability || INITIAL_AVAILABILITY);
        }

        setOpen(isOpen);
    }

    useEffect(() => {
        if (open) setCustomAvailability(availability || INITIAL_AVAILABILITY);
    }, [availability, open]);

    const onAvailabilitySave = () => {
        setOpen(false);
        onClick(DEFAULT_ROW_KEY);
        onSave({
            ...customAvailability,
            userId,
        });
    };

    const onAvailabilityInputChange = (value: number) => setCustomAvailability((prevState) => ({
        ...prevState,
        availability: value,
    }));

    const onStartDateChange = (value: Dayjs | null) => setCustomAvailability((prevState) => ({
        ...prevState,
        availableFrom: value,
    }));

    const content = (
        <div className={styles.popupContent}>
            <h3 className={classNames('h3 color-neutral-700', styles.title)}>
                {PopupContent.title}
            </h3>
            <Divider />
            <div className="b16 margin-16">{PopupContent.description}</div>
            <div className="flex gap-16 margin-16">
                <div>
                    <label className={styles.label}>{PopupContent.inputLabel}</label>
                    <InputNumber
                        className={styles.weightInput}
                        value={customAvailability.availability}
                        onChange={onAvailabilityInputChange}
                        inputWidth={61}
                        min={0}
                        max={1}
                        precision={2}
                        step={0.25}
                    />
                </div>
                <div>
                    <label className={styles.label}>{PopupContent.datePickerLabel}</label>
                    <DatePicker
                        onChange={onStartDateChange}
                        value={customAvailability.availableFrom}
                        className={styles.datePicker}
                    />
                </div>
            </div>
            <Button
                buttonType={ButtonType.primary}
                className="margin-left-16 margin-bottom-16"
                onClick={onAvailabilitySave}
            >
                {PopupContent.buttonLabel}
            </Button>
        </div>
    );

    return (
        <div className={styles.popover} ref={popoverContainer}>
            <div className="flex gap-8 justify-end align-center">
                <div
                    className={classNames(styles.availability, { [styles.noData]: !availability })}
                >
                    {availability?.availability || INITIAL_AVAILABILITY.availability}
                </div>
                {canSetAvailability && (
                    <Popover
                        content={content}
                        placement="left"
                        getPopupContainer={() => popoverContainer.current}
                        trigger="click"
                        arrow={false}
                        onOpenChange={onOpenChange}
                        destroyTooltipOnHide
                        open={open}
                    >
                        <IconWrapper className={styles.editIcon}>
                            <Tooltip title="Edit availability">
                                <EditIcon />
                            </Tooltip>
                        </IconWrapper>
                    </Popover>
                )}
            </div>
            {availability?.availableFrom && (
                <div className={styles.availabilityDate}>
                    {`from ${getDate(availability?.availableFrom, DDMMYYYY)}`}
                </div>
            )}
        </div>
    );
};

export default AvailabilityPopover;
