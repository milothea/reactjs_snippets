import { FC, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import Button, { ButtonIconType, ButtonType } from 'src/components/common/Button/Button';
import LevelsSettingsModal from './LevelsSettingsModal/LevelsSettingsModal';
import { Option, Select } from 'src/components/common/Select/Select';
import Spin from 'src/components/common/Spin/Spin';
import Table from 'src/components/common/Table/Table';
import { ReactComponent as Settings } from 'src/css/icons/settings.svg';
import { CompetencyBlocksStore } from 'src/store/CompetencyBlocks';
import { DEFAULT_MAX_LEVELS_COUNT, getCompetenciesIds } from '../../CompetencyBlockForm.config';
import {
    ColumnDataType,
    Competence,
    CompetencyBlockStepProps,
    GradesType
} from '../../types';
import {
    assignDefaultGrades,
    assignGradeValue,
    checkHasGrades,
    tableColumns as config,
    getCompetencyOptions,
    getDefaultGrade,
    getGradesByCompetencyId,
    mapCurrentValue,
    mapMarkscales,
    mapToTable,
    updateColumnsConfig,
} from './RequirementsStep.config';
import styles from './RequirementsStep.module.scss';


const RequirementsStep: FC<CompetencyBlockStepProps> = observer(
    ({ stepsState: { groups = [], gradesCount = [] }, onChange, renderNext }) => {
        const [tableColumns, setTableColumns] = useState<ColumnDataType[]>(config);
        const [modalOpen, setModalOpen] = useState(false);

        const markscales = mapMarkscales(CompetencyBlocksStore.markscalesSource);
        const { isMarkscalesLoading: isLoading } = CompetencyBlocksStore;

        useEffect(() => {
            CompetencyBlocksStore.fetchCompetenciesByIds(getCompetenciesIds(groups));
        }, []);

        useEffect(() => {
            const hasGrades = checkHasGrades(groups);

            if (!hasGrades) {
                const updated = assignDefaultGrades(groups, gradesCount);

                onChange('groups', updated);
            }
        }, [groups, gradesCount]);

        useEffect(() => {
            if (!isLoading) {
                setTableColumns(updateColumnsConfig(config, renderDropdown, gradesCount));
            }
        }, [isLoading, groups]);

        const totalCompetenciesCount = getCompetenciesIds(groups).length;

        const onSelectChange = (data: any, id: number, gradeId: number) => {
            const updated = assignGradeValue(groups, id, data, gradeId);

            onChange('groups', updated);
        };

        const renderDropdown = (gradeId: number, record: Competence) => {
            if (record.mergedRow) return false;

            const grades = getGradesByCompetencyId(groups, Number(record.id));
            const optionsConfig = getCompetencyOptions(Number(record.id), markscales);
            const curGrade =
                grades.find(({ grade }) => grade === Number(gradeId)) || ({} as GradesType);
            const currentValue = mapCurrentValue(curGrade.mark, optionsConfig);

            optionsConfig.sort((a, b) => a.absoluteMark - b.absoluteMark);

            return (
                <Select
                    className={`requirements-${record.id}-grade-${gradeId}`}
                    value={currentValue}
                    onChange={(_, data) => onSelectChange(data, Number(record.id), gradeId)}
                    style={{ width: '100%' }}
                    popupClassName={styles.requirementsPopup}
                >
                    {optionsConfig?.map((option) => (
                        <Option value={option.mark} key={option.id}>
                            {option.absoluteMark < 0
                                ? option.name
                                : `${option.name} ${option.absoluteMark}%`}
                        </Option>
                    ))}
                </Select>
            );
        };

        const onModalSubmit = (checkedGrades: string[]) => {
            const updatedGroups = [
                ...groups.map((group) => ({
                    ...group,
                    groupCompetencies: group.groupCompetencies.map((groupCompetency) => ({
                        ...groupCompetency,
                        grades: checkedGrades.map((id) => {
                            const grateItem = groupCompetency.grades.find(
                                ({ grade }) => grade === Number(id)
                            );

                            return grateItem || getDefaultGrade(Number(id));
                        }),
                    })),
                })),
            ];

            setModalOpen(false);
            setTableColumns(updateColumnsConfig(tableColumns, renderDropdown, checkedGrades));
            onChange('groups', updatedGroups);
            onChange('gradesCount', checkedGrades);
        }

        const levelColumns = tableColumns[2].children;

        return (
            <div className={styles.container}>
                <div className={styles.stepHeader}>
                    <h3 className={styles.title}>{`Competencies (${totalCompetenciesCount})`}</h3>
                    <div className="flex gap-12">
                        <Button
                            buttonType={ButtonType.neutral}
                            iconType={ButtonIconType.withLeftIcon}
                            icon={<Settings />}
                            onClick={() => setModalOpen(true)}
                            data-testid="level-settings"
                        >
                            Level settings
                        </Button>
                        {renderNext}
                    </div>
                </div>
                {levelColumns && levelColumns.length > 0 ? (
                    <Table
                        columns={tableColumns}
                        dataSource={mapToTable(groups, gradesCount)}
                        pagination={false}
                        loading={isLoading}
                        rowKey={(record) => record.id}
                        bordered
                        tableLayout={'fixed'}
                        className={styles.table}
                        mergedRowClassName={styles.mergedRow}
                    />
                ) : (
                    <Spin spinning={true} className={styles.spinner} />
                )}
                <LevelsSettingsModal
                    onCancel={() => setModalOpen(false)}
                    onSubmit={onModalSubmit}
                    open={modalOpen}
                    selectedLevels={gradesCount.map((c) => String(c))}
                    levelsNumber={DEFAULT_MAX_LEVELS_COUNT}
                />
            </div>
        );
    }
);

export default RequirementsStep;
