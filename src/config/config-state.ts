import { StoreConfig } from './config';

export default interface ConfigState {
    data?: StoreConfig;
    errors: ConfigErrorsState;
    statuses: ConfigStatusesState;
}

export interface ConfigErrorsState {
    loadError?: Error;
}

export interface ConfigStatusesState {
    isLoading?: boolean;
}
