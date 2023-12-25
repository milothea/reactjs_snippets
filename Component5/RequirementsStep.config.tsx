import {
    DEFAULT_OPTION,
    LEVEL_REQUIREMENTS_COLUMN,
} from 'src/components/ViewGroupsTable/ViewGroupsTable.config';
import {
    ColumnDataType,
    Competence,
    CompetencyModel,
    GradesType,
    GroupType,
    Level,
    MarkscalePointsType,
    MarkscaleType,
} from '../../types';
import styles from './RequirementsStep.module.scss';

export const LEVELS_DATA_INDEX = 'grades';
const COMPETENCY_DATA_INDEX = 'name';
const DYNAMIC_COLUMNS_DATA_INDEXES = [LEVELS_DATA_INDEX, COMPETENCY_DATA_INDEX];
const LEVELS_THRESHOLD = 3;

export const tableColumns: ColumnDataType[] = [
    {
        title: 'Competency',
        dataIndex: COMPETENCY_DATA_INDEX,
        key: 'competencyName',
        width: '15%',
    },
    {
        title: <p className={styles.weightTitle}>Weight</p>,
        dataIndex: 'weight',
        key: 'competencyWeight',
        width: '80px',
        align: 'center' as 'center',
        render: (value) => value
    },
    LEVEL_REQUIREMENTS_COLUMN,
];

export const createArrayOfStrings = (num: number) => [...Array(num)].map((_, index) => String(index + 1));

export const checkHasGrades = (groups: GroupType[]) =>
    groups.some((group) => group.groupCompetencies.some((competency) => !!competency.grades.length));

const isEqualByGrade = (a: GradesType, b: GradesType) => a.grade === b.grade;

export const getAllGrades = (groups: GroupType[]) => {
    const result: GradesType[] = [];

    groups.forEach((group) => {
        group.groupCompetencies.forEach((competency) => {
            competency.grades.forEach((grade) => {
                const existingGrade = result.find((existing) => isEqualByGrade(existing, grade));

                if (!existingGrade) {
                    result.push({ ...grade, id: null, mark: -1 });
                }
            });
        });
    });

    return result;
};

export const getDefaultGrade = (id: number) => ({ id: null, grade: id, mark: -1 });

export const assignDefaultGrades = (groups: GroupType[], gradesCount: string[]) =>
    groups.map((group) => ({
        ...group,
        groupCompetencies: group.groupCompetencies.map((groupCompetency) => {
            return {
                ...groupCompetency,
                grades: gradesCount.map((grade) => ({
                    id: null,
                    grade: Number(grade),
                    mark: -1,
                })),
            }
        }),
    }))

export const assignGradeValue = (groups: GroupType[], id: number, data: any, gradeId: number) =>
    groups.map((group) => ({
        ...group,
        groupCompetencies: group.groupCompetencies.map((competency) => {
            let grades = [...competency.grades]
            if (competency.competenceId === id) {
                grades = grades.map((grade) =>
                    grade.grade === Number(gradeId)
                        ? {
                            id: grade.id ?? null,
                            grade: Number(gradeId),
                            mark: data.value,
                        }
                        : grade
                )
            }
            return { ...competency, grades }
        }),
    }));

export const getGradesByCompetencyId = (groups: GroupType[], id: number) => {
    let result: GradesType[] = [];

    groups.forEach(({ groupCompetencies }) =>
        groupCompetencies.forEach(({ competenceId, grades }) => {
            if (competenceId === id) {
                result = [...grades];
            }
        })
    );

    return result;
};

export const mapMarkscales = (source: CompetencyModel[] = []): MarkscaleType[] => {
    const markscales: MarkscaleType[] = [];

    source?.forEach(({ id, markscale }) => {
        if (markscale) {
            markscales.push({
                ...markscale,
                competenceId: id,
            });
        }
    });

    return markscales;
};

export const mapCurrentValue = (curMark: number, options: MarkscalePointsType[]): string => {
    if (curMark === undefined) return DEFAULT_OPTION.name;

    const curOption = options.filter(({ mark }) => mark === curMark)[0];

    return curOption && curMark !== DEFAULT_OPTION.mark
        ? `${curOption.name} ${curOption.absoluteMark}%`
        : DEFAULT_OPTION.name;
};;

export const getCompetencyOptions = (
    competenceId: number,
    options: MarkscaleType[] = []
): MarkscalePointsType[] => {
    let competencyOptions: MarkscalePointsType[] = [];

    for (let i = 0; i < options?.length || 0; i++) {
        if (options[i].competenceId === competenceId) {
            competencyOptions = [DEFAULT_OPTION, ...options[i].markscalePoints];
            break;
        }
    }

    return competencyOptions;
};

export const createLevels = (
    curGrades: string[],
    renderMethod: (gradeId: number, record: Competence) => {}
): Level[] => {
    const sortedGrades = [...curGrades].sort((a, b) => Number(a) - Number(b));
    const result: Level[] = [];

    sortedGrades.forEach((grade) => {
        const gradeKey = `grade-${grade}`;

        result.push({
            title: grade,
            dataIndex: gradeKey,
            key: gradeKey,
            render: renderMethod,
        });
    });

    return result;
};

export const updateColumnsConfig = (
    config: ColumnDataType[],
    renderLevel: (gradeId: number, record: Competence) => {},
    gradesCount: string[] = []
): ColumnDataType[] => {
    return config.map((colData) => {
        const data = { ...colData };

        if (DYNAMIC_COLUMNS_DATA_INDEXES.includes(colData.dataIndex) && gradesCount.length <= LEVELS_THRESHOLD) {
            data.width = '47%';
        }

        if (colData.dataIndex === LEVELS_DATA_INDEX) {
            data.children = createLevels(gradesCount, renderLevel);
        }

        return data;
    });
};

export const mapGroupCompetencies = (grades: string[]) => {
    let data: any = {};

    grades.forEach((grade) => {
        data[`grade-${grade}`] = grade;
    })

    return data;
};

export const mapToTable = (groups: GroupType[], gradesCount: string[]) => {
    let result: any[] = [];

    groups.forEach(({ default: isDefault, name, id, groupCompetencies, weight }) => {
        const parsedGroupData = mapGroupCompetencies(gradesCount);

        if (!isDefault) {
            result.push({
                name,
                mergedRow: true,
                id,
                weight,
            });
        }

        groupCompetencies.forEach(({ competenceId, competence, weight }) => {
            result.push({ id: competenceId, name: competence.name, weight, ...parsedGroupData })
        });
    });

    return result;
};
