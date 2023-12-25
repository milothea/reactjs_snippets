import { makeAutoObservable } from 'mobx';
import { getSelectedItemData } from 'src/components/CompetencyModel/ScalesCatalog/ScaleCatalogView/ScalesCatalogView.config';
import {
    ArchiveParamType,
    CompetencyCatalogModel,
    CompetencyTreeModel,
    HistoryType,
    MarkscaleModel,
    ScaleTreeModel,
    ScalesTreeParams,
    ValidateScaleNamePayload,
    ScaleFolderModel
} from 'src/components/CompetencyModel/types';
import throwNotification, { NotificationTypes } from 'src/components/common/ThrowNotification/ThrowNotification';
import API from 'src/utils/api';


const api = API.create();

class CompetencyModel {
    competencesTree: CompetencyTreeModel[] = [] as CompetencyTreeModel[];
    initialCompetencesTree: CompetencyTreeModel[] = [] as CompetencyTreeModel[];
    isCompetencesTreeLoading: boolean = false;
    scalesTree: ScaleTreeModel[] = [] as ScaleTreeModel[];
    isScalesTreeFetching: boolean = false;
    scalesCatalogInfo: MarkscaleModel = {} as MarkscaleModel;
    scalesCatalogFolder: ScaleFolderModel = {} as ScaleFolderModel;
    isScalesCatalogFetching: boolean = false;
    scalesCatalogHistory: HistoryType[] = [] as HistoryType[];
    isScaleHistoryFetching: boolean = false;
    // ...

    constructor() {
        makeAutoObservable(this);
    }

    *fetchCompetencesTree(params: { searchString: string }, onSuccess?: (data: CompetencyTreeModel[], searchString: string) => void) {
        this.isCompetencesTreeLoading = true;

        const { ok, data } = yield api.getCompetencesTree(params);

        if (ok && data) {
            if (!params.searchString) this.initialCompetencesTree = data;

            this.competencesTree = data;

            onSuccess && onSuccess(data, params.searchString);
        } else {
            throwNotification(NotificationTypes.ERROR, 'Error fetching competences tree');
        }

        this.isCompetencesTreeLoading = false;
    }

    // ...

    *fetchScalesTree(params: ScalesTreeParams, onSuccess?: (data: ScaleTreeModel[], searchString: string) => void) {
        this.isScalesTreeFetching = true;

        const { ok, data } = yield api.getScalesTree(
            params?.id || '',
            params?.searchString ? { searchString: params.searchString } : undefined,
        );

        if (ok && data) {
            this.scalesTree = data;

            onSuccess && onSuccess(data, params.searchString || '');
        } else {
            throwNotification(NotificationTypes.ERROR, 'Error fetching scales tree');
        }

        this.isScalesTreeFetching = false;
    }

    *fetchScalesCatalogFolder(params: ScalesTreeParams) {
        this.isScalesCatalogFetching = true;

        const { ok, data } = yield api.getScalesTree(
            params.id || '',
            params?.searchString ? { searchString: params.searchString } : undefined,
        );

        if (ok && data) {
            this.clearScaleCatalogInfo();
            this.scalesCatalogFolder = {
                id: params.id,
                children: data,
                ...getSelectedItemData(params.id || '', data, this.scalesTree)
            };
        } else {
            throwNotification(NotificationTypes.ERROR, 'Error fetching scale catalog info');
        }

        this.isScalesCatalogFetching = false;
    }

    *fetchScaleCatalogInfo(id: number | string, onSuccess?: (params: ValidateScaleNamePayload) => void) {
        this.isScalesCatalogFetching = true;

        const { ok, data } = yield api.getScaleCatalogInfo(id);

        if (ok && data) {
            this.clearScaleCatalogFolder();
            this.scalesCatalogInfo = data;
            onSuccess && onSuccess({
                id: id as number,
                name: data.name
            });
        } else {
            throwNotification(NotificationTypes.ERROR, 'Error fetching scale catalog info');
        }

        this.isScalesCatalogFetching = false;
    }

    *fetchScalesCatalogHistory(id: number | string) {
        this.isScaleHistoryFetching = true;

        const { ok, data } = yield api.getMarkscaleCatalogHistory(id);

        if (ok && data) {
            this.scalesCatalogHistory = data;
        } else {
            throwNotification(NotificationTypes.ERROR, 'Error fetching scale catalog history');
        }

        this.isScaleHistoryFetching = false;
    }

    // ...

    *archiveCompetency(id: number, params: ArchiveParamType, onSuccess: () => void) {
        const { ok } = yield api.archiveCompetency(id, params);

        if (ok) {
            onSuccess();
            throwNotification(NotificationTypes.SUCCESS, 'The competency has been archived');
        } else {
            throwNotification(NotificationTypes.ERROR, 'Error archiving competency');
        }
    }

    *restoreCompetency(id: number, onSuccess: (data: CompetencyCatalogModel) => void, parentId: number | null) {
        const { ok, data } = yield api.restoreCompetency(id, parentId);

        if (ok && data) {
            onSuccess(data);
            throwNotification(NotificationTypes.SUCCESS, 'The competency has been restored');
        } else {
            throwNotification(NotificationTypes.ERROR, 'Error archiving competency')
        }
    }

    // ...

    *archiveMarkscale(id: number, onSuccess: () => void) {
        const { ok } = yield api.archiveMarkscale(id);

        if (ok) {
            onSuccess();
            throwNotification(NotificationTypes.SUCCESS, 'The scale has been archived');
        } else {
            throwNotification(NotificationTypes.ERROR, 'Error archiving scale');
        }
    }

    *restoreMarkscale(id: number, onSuccess: () => void) {
        const { ok, data } = yield api.restoreMarkscale(id);

        if (ok && data) {
            this.scalesCatalogInfo = data;
            onSuccess();
            throwNotification(NotificationTypes.SUCCESS, 'The scale has been restored');
        } else {
            throwNotification(NotificationTypes.ERROR, 'Error restoring scale');
        }
    }

    clearScaleCatalogInfo = () => {
        this.scalesCatalogInfo = {} as MarkscaleModel;
    }

    clearScaleCatalogFolder = () => {
        this.scalesCatalogFolder = {} as ScaleFolderModel;
    }
}

export const CompetencyModelStore = new CompetencyModel();
