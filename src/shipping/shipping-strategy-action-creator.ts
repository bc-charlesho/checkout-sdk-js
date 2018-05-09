import { createAction, createErrorAction, ThunkAction } from '@bigcommerce/data-store';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { Address } from '../address';
import { InternalCheckoutSelectors } from '../checkout';
import { Registry } from '../common/registry';

import { ShippingInitializeOptions, ShippingRequestOptions } from './shipping-request-options';
import {
    ShippingStrategyActionType,
    ShippingStrategyDeinitializeAction,
    ShippingStrategyInitializeAction,
    ShippingStrategySelectOptionAction,
    ShippingStrategyUpdateAddressAction,
} from './shipping-strategy-actions';
import { ShippingStrategy } from './strategies';

export default class ShippingStrategyActionCreator {
    constructor(
        private _strategyRegistry: Registry<ShippingStrategy>
    ) {}

    updateAddress(address: Address, options?: ShippingRequestOptions): ThunkAction<ShippingStrategyUpdateAddressAction, InternalCheckoutSelectors> {
        return store => Observable.create((observer: Observer<ShippingStrategyUpdateAddressAction>) => {
            const methodId = options && options.methodId || store.getState().remoteCheckout.getProviderId();

            observer.next(createAction(ShippingStrategyActionType.UpdateAddressRequested, undefined, { methodId }));

            this._strategyRegistry.get(methodId)
                .updateAddress(address, { ...options, methodId })
                .then(() => {
                    observer.next(createAction(ShippingStrategyActionType.UpdateAddressSucceeded, undefined, { methodId }));
                    observer.complete();
                })
                .catch(error => {
                    observer.error(createErrorAction(ShippingStrategyActionType.UpdateAddressFailed, error, { methodId }));
                });
        });
    }

    selectOption(shippingOptionId: string, options?: ShippingRequestOptions): ThunkAction<ShippingStrategySelectOptionAction, InternalCheckoutSelectors> {
        return store => Observable.create((observer: Observer<ShippingStrategySelectOptionAction>) => {
            const methodId = options && options.methodId || store.getState().remoteCheckout.getProviderId();

            observer.next(createAction(ShippingStrategyActionType.SelectOptionRequested, undefined, { methodId }));

            this._strategyRegistry.get(methodId)
                .selectOption(shippingOptionId, { ...options, methodId })
                .then(() => {
                    observer.next(createAction(ShippingStrategyActionType.SelectOptionSucceeded, undefined, { methodId }));
                    observer.complete();
                })
                .catch(error => {
                    observer.error(createErrorAction(ShippingStrategyActionType.SelectOptionFailed, error, { methodId }));
                });
        });
    }

    initialize(options?: ShippingInitializeOptions): ThunkAction<ShippingStrategyInitializeAction, InternalCheckoutSelectors> {
        return store => Observable.create((observer: Observer<ShippingStrategyInitializeAction>) => {
            const methodId = options && options.methodId || store.getState().remoteCheckout.getProviderId();
            const mergedOptions = { ...options, methodId };

            observer.next(createAction(ShippingStrategyActionType.InitializeRequested, undefined, { methodId }));

            this._strategyRegistry.get(methodId)
                .initialize(mergedOptions)
                .then(() => {
                    observer.next(createAction(ShippingStrategyActionType.InitializeSucceeded, undefined, { methodId }));
                    observer.complete();
                })
                .catch(error => {
                    observer.error(createErrorAction(ShippingStrategyActionType.InitializeFailed, error, { methodId }));
                });
        });
    }

    deinitialize(options?: ShippingRequestOptions): ThunkAction<ShippingStrategyDeinitializeAction, InternalCheckoutSelectors> {
        return store => Observable.create((observer: Observer<ShippingStrategyDeinitializeAction>) => {
            const methodId = options && options.methodId || store.getState().remoteCheckout.getProviderId();

            observer.next(createAction(ShippingStrategyActionType.DeinitializeRequested, undefined, { methodId }));

            this._strategyRegistry.get(methodId)
                .deinitialize({ ...options, methodId })
                .then(() => {
                    observer.next(createAction(ShippingStrategyActionType.DeinitializeSucceeded, undefined, { methodId }));
                    observer.complete();
                })
                .catch(error => {
                    observer.error(createErrorAction(ShippingStrategyActionType.DeinitializeFailed, error, { methodId }));
                });
        });
    }
}
