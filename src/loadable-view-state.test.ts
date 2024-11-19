import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { LoadableViewState } from './loadable-view-state';
import Mock = jest.Mock;

describe('LoadableViewState', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('isInitial', () => {
        const givenAnInitialState = (): LoadableViewState<string> => LoadableViewState.initial();

        const givenNonInitialStates = (): LoadableViewState<string>[] => [
            LoadableViewState.loading(),
            LoadableViewState.success('success'),
            LoadableViewState.failure(Error('error')),
        ];

        test('given an initial state when checking initial then true is retrieved', () => {
            const initialState = givenAnInitialState();
            expect(initialState.isInitial).toBeTruthy();
        });

        test.each(givenNonInitialStates())('given %p when checking initial then false is retrieved', (state) => {
            expect(state.isInitial).toBeFalsy();
        });
    });

    describe('isLoading', () => {
        const givenALoadingState = (): LoadableViewState<string> => LoadableViewState.loading();

        const givenNonLoadingStates = (): LoadableViewState<string>[] => [
            LoadableViewState.initial(),
            LoadableViewState.success('success'),
            LoadableViewState.failure(Error('error')),
        ];

        test('given a loading state when checking loading then true is retrieved', () => {
            const loadingState = givenALoadingState();
            expect(loadingState.isLoading).toBeTruthy();
        });

        test.each(givenNonLoadingStates())('given %p when checking loading then false is retrieved', (state) => {
            expect(state.isLoading).toBeFalsy();
        });
    });

    describe('isSuccess', () => {
        const givenASuccessState = (): LoadableViewState<string> => LoadableViewState.success('success');

        const givenNonSuccessStates = (): LoadableViewState<string>[] => [
            LoadableViewState.initial(),
            LoadableViewState.loading(),
            LoadableViewState.failure(Error('error')),
        ];

        test('given a success state when checking success then true is retrieved', () => {
            const successState = givenASuccessState();
            expect(successState.isSuccess).toBeTruthy();
        });

        test.each(givenNonSuccessStates())('given %p when checking success then false is retrieved', (state) => {
            expect(state.isSuccess).toBeFalsy();
        });
    });

    describe('isFailure', () => {
        const givenAFailureState = (): LoadableViewState<string> => LoadableViewState.failure(Error('error'));

        const givenNonFailureStates = (): LoadableViewState<string>[] => [
            LoadableViewState.initial(),
            LoadableViewState.loading(),
            LoadableViewState.success('success'),
        ];

        test('given a failure state when checking failure then true is retrieved', () => {
            const failureState = givenAFailureState();
            expect(failureState.isFailure).toBeTruthy();
        });

        test.each(givenNonFailureStates())('given %p when checking failure then false is retrieved', (state) => {
            expect(state.isFailure).toBeFalsy();
        });
    });

    describe('getOrNull', () => {
        const givenASuccessState = (): LoadableViewState<string> => LoadableViewState.success('success');

        const givenNonSuccessStates = (): LoadableViewState<string>[] => [
            LoadableViewState.initial(),
            LoadableViewState.loading(),
            LoadableViewState.failure(Error('error')),
        ];

        test('given a success state when getting the value then the value is retrieved', () => {
            const successState = givenASuccessState();
            expect(successState.getOrNull()).toBe('success');
        });

        test.each(givenNonSuccessStates())('given %p when getting the value then null is retrieved', (state) => {
            expect(state.getOrNull()).toBeNull();
        });
    });

    describe('getOrDefault', () => {
        const givenASuccessState = (): LoadableViewState<string> => LoadableViewState.success('success');

        const givenNonSuccessStates = (): LoadableViewState<string>[] => [
            LoadableViewState.initial(),
            LoadableViewState.loading(),
            LoadableViewState.failure(Error('error')),
        ];

        test('given a success state when getting the value then the value is retrieved', () => {
            const successState = givenASuccessState();
            expect(successState.getOrDefault('default')).toBe('success');
        });

        test.each(givenNonSuccessStates())('given %p when getting the value then the default value is retrieved', (state) => {
            expect(state.getOrDefault('default')).toBe('default');
        });
    });

    describe('getOrThrow', () => {
        const givenASuccessState = (): LoadableViewState<string> => LoadableViewState.success('success');

        const givenNonSuccessStates = (): LoadableViewState<string>[] => [
            LoadableViewState.initial(),
            LoadableViewState.loading(),
            LoadableViewState.failure(Error('error')),
        ];

        test('given a success state when getting the value then the value is retrieved', () => {
            const successState = givenASuccessState();
            expect(successState.getOrThrow()).toBe('success');
        });

        test.each(givenNonSuccessStates())('given %p when getting the value then an error is thrown', (state) => {
            expect(() => state.getOrThrow()).toThrow();
        });
    });

    describe('errorOrNull', () => {
        const givenAFailureState = (): LoadableViewState<string> => LoadableViewState.failure(Error('error'));

        const givenNonFailureStates = (): LoadableViewState<string>[] => [
            LoadableViewState.initial(),
            LoadableViewState.loading(),
            LoadableViewState.success('success'),
        ];

        test('given a failure state when getting the error then the error is retrieved', () => {
            const failureState = givenAFailureState();
            expect(failureState.errorOrNull()).toBeInstanceOf(Error);
        });

        test.each(givenNonFailureStates())('given %p when getting the error then null is retrieved', (state) => {
            expect(state.errorOrNull()).toBeNull();
        });
    });

    describe('map', () => {
        const successValue = 'success';

        const givenASuccessState = (): LoadableViewState<string> => LoadableViewState.success(successValue);

        const givenNonSuccessStates = (): LoadableViewState<string>[] => [
            LoadableViewState.initial(),
            LoadableViewState.loading(),
            LoadableViewState.failure(Error('error')),
        ];

        const transform = jest.fn<(value: string) => string>().mockImplementation((value: string) => `transformed (${value})`);

        const thenTheTransformationIsApplied = (mappedViewState: LoadableViewState<string>) => {
            expect(transform).toBeCalled();
            expect(mappedViewState).toEqual(LoadableViewState.success(transform(successValue)));
        };

        const whenMapping = (successState: LoadableViewState<string>) => successState.map(transform);

        test('given a success state when mapping then the transformation is applied', () => {
            const successState = givenASuccessState();
            const mappedViewState = whenMapping(successState);
            thenTheTransformationIsApplied(mappedViewState);
        });

        test.each(givenNonSuccessStates())('given %p when mapping then the state is returned', (state) => {
            const mappedViewState = state.map(transform);
            expect(mappedViewState).toEqual(state);
        });
    });

    describe('fold', () => {
        const successValue = 'success';

        const errorValue = Error('error');

        const givenASuccessState = (): LoadableViewState<string> => LoadableViewState.success(successValue);

        const onSuccessTransform = jest.fn<(value: string) => string>().mockImplementation((value: string) => `transformed (${value})`);

        const onErrorTransform = jest.fn<(error: Error) => string>().mockImplementation((error: Error) => `transformed (${error})`);

        const onInitialTransform = jest.fn<() => string>().mockImplementation(() => 'transformed onInitial');

        const onLoadingTransform = jest.fn<() => string>().mockImplementation(() => 'transformed onLoading');

        const givenNonSuccessStates = (): [LoadableViewState<string>, Mock<((error: Error) => string) | (() => string)>, string][] => [
            [LoadableViewState.initial(), onInitialTransform, onInitialTransform()],
            [LoadableViewState.loading(), onLoadingTransform, onLoadingTransform()],
            [LoadableViewState.failure(errorValue), onErrorTransform, onErrorTransform(errorValue)],
        ];

        const thenTheSuccessTransformationIsApplied = (mappedValue: string) => {
            expect(onSuccessTransform).toBeCalled();
            expect(mappedValue).toEqual(onSuccessTransform(successValue));
        };

        const thenTheTransformationIsApplied = (
            transform: Mock<((error: Error) => string) | (() => string)>,
            mappedValue: string,
            transformedValue: string,
        ) => {
            expect(transform).toBeCalled();
            expect(mappedValue).toEqual(transformedValue);
        };

        const whenFolding = (viewState: LoadableViewState<string>) =>
            viewState.fold(onSuccessTransform, onErrorTransform, onInitialTransform, onLoadingTransform);

        test('given a success state when folding then the transformation is applied', () => {
            const successState = givenASuccessState();
            const mappedValue = whenFolding(successState);
            thenTheSuccessTransformationIsApplied(mappedValue);
        });

        test.each(givenNonSuccessStates())('given %p when folding then the state is returned', (viewState, transform, transformedValue) => {
            const mappedValue = whenFolding(viewState);
            thenTheTransformationIsApplied(transform, mappedValue, transformedValue);
        });
    });

    describe('toString', () => {
        const successValue = 'success';

        const errorValue = Error('error');

        const givenASuccessState = (): LoadableViewState<string> => LoadableViewState.success(successValue);

        const givenNonSuccessStates = (): [LoadableViewState<string>, string][] => [
            [LoadableViewState.initial(), 'Initial'],
            [LoadableViewState.loading(), 'Loading'],
            [LoadableViewState.failure(errorValue), `Failure: ${errorValue}`],
        ];

        test('given a success state when converting to string then the string representation is returned', () => {
            const successState = givenASuccessState();
            expect(successState.toString()).toBe(`Success: ${successValue}`);
        });

        test.each(givenNonSuccessStates())('given %p when converting to string then the string representation is returned', (state, representationString) => {
            expect(state.toString()).toBe(representationString);
        });
    });

    describe('onInitial', () => {
        const givenAnInitialState = (): LoadableViewState<string> => LoadableViewState.initial();

        const givenNonInitialStates = (): LoadableViewState<string>[] => [
            LoadableViewState.loading(),
            LoadableViewState.success('success'),
            LoadableViewState.failure(Error('error')),
        ];

        const perform = jest.fn<() => void>();

        const whenHandlingOnInitial = (initialState: LoadableViewState<string>) => {
            initialState.onInitial(perform);
        };

        const thenTheInitialActionIsExecuted = () => {
            expect(perform).toBeCalled();
        };

        const thenTheInitialActionIsNotExecuted = () => {
            expect(perform).not.toBeCalled();
        };

        test('given an initial state when handling onInitial then the initial action is executed', () => {
            const initialState = givenAnInitialState();
            whenHandlingOnInitial(initialState);
            thenTheInitialActionIsExecuted();
        });

        test.each(givenNonInitialStates())('given %p when handling onInitial then the initial action is not executed', (state) => {
            state.onInitial(perform);
            thenTheInitialActionIsNotExecuted();
        });
    });

    describe('onLoading', () => {
        const givenALoadingState = (): LoadableViewState<string> => LoadableViewState.loading();

        const givenNonLoadingStates = (): LoadableViewState<string>[] => [
            LoadableViewState.initial(),
            LoadableViewState.success('success'),
            LoadableViewState.failure(Error('error')),
        ];

        const perform = jest.fn<() => void>();

        const whenHandlingOnLoading = (loadingState: LoadableViewState<string>) => {
            loadingState.onLoading(perform);
        };

        const thenTheLoadingActionIsExecuted = () => {
            expect(perform).toBeCalled();
        };

        const thenTheLoadingActionIsNotExecuted = () => {
            expect(perform).not.toBeCalled();
        };

        test('given a loading state when handling onLoading then the loading action is executed', () => {
            const loadingState = givenALoadingState();
            whenHandlingOnLoading(loadingState);
            thenTheLoadingActionIsExecuted();
        });

        test.each(givenNonLoadingStates())('given %p when handling onLoading then the loading action is not executed', (state) => {
            state.onLoading(perform);
            thenTheLoadingActionIsNotExecuted();
        });
    });

    describe('onSuccess', () => {
        const givenASuccessState = (): LoadableViewState<string> => LoadableViewState.success('success');

        const givenNonSuccessStates = (): LoadableViewState<string>[] => [
            LoadableViewState.initial(),
            LoadableViewState.loading(),
            LoadableViewState.failure(Error('error')),
        ];

        const perform = jest.fn<() => void>();

        const whenHandlingOnSuccess = (successState: LoadableViewState<string>) => {
            successState.onSuccess(perform);
        };

        const thenTheSuccessActionIsExecuted = () => {
            expect(perform).toBeCalled();
        };

        const thenTheSuccessActionIsNotExecuted = () => {
            expect(perform).not.toBeCalled();
        };

        test('given a success state when handling onSuccess then the success action is executed', () => {
            const successState = givenASuccessState();
            whenHandlingOnSuccess(successState);
            thenTheSuccessActionIsExecuted();
        });

        test.each(givenNonSuccessStates())('given %p when handling onSuccess then the success action is not executed', (state) => {
            state.onSuccess(perform);
            thenTheSuccessActionIsNotExecuted();
        });
    });

    describe('onFailure', () => {
        const givenAFailureState = (): LoadableViewState<string> => LoadableViewState.failure(Error('error'));

        const givenNonFailureStates = (): LoadableViewState<string>[] => [
            LoadableViewState.initial(),
            LoadableViewState.loading(),
            LoadableViewState.success('success'),
        ];

        const perform = jest.fn<() => void>();

        const whenHandlingOnFailure = (failureState: LoadableViewState<string>) => {
            failureState.onFailure(perform);
        };

        const thenTheFailureActionIsExecuted = () => {
            expect(perform).toBeCalled();
        };

        const thenTheFailureActionIsNotExecuted = () => {
            expect(perform).not.toBeCalled();
        };

        test('given a failure state when handling onFailure then the failure action is executed', () => {
            const failureState = givenAFailureState();
            whenHandlingOnFailure(failureState);
            thenTheFailureActionIsExecuted();
        });

        test.each(givenNonFailureStates())('given %p when handling onFailure then the failure action is not executed', (state) => {
            state.onFailure(perform);
            thenTheFailureActionIsNotExecuted();
        });
    });
});
