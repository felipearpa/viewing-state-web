import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { LoadableViewState } from './loadable-view-state';
import Mock = jest.Mock;

describe('LoadableViewState', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const givenAnInitialViewState = (): LoadableViewState<string> => LoadableViewState.initial();

    const givenALoadingViewState = (): LoadableViewState<string> => LoadableViewState.loading();

    const successValue = 'success';
    const givenASuccessViewState = (): LoadableViewState<string> => LoadableViewState.success(successValue);

    const errorValue = Error('error');
    const givenAFailureViewState = (): LoadableViewState<string> => LoadableViewState.failure(errorValue);

    const givenNonInitialViewStates = (): LoadableViewState<string>[] => [
        LoadableViewState.loading(),
        LoadableViewState.success('success'),
        LoadableViewState.failure(Error('error')),
    ];

    const givenNonLoadingViewStates = (): LoadableViewState<string>[] => [
        LoadableViewState.initial(),
        LoadableViewState.success('success'),
        LoadableViewState.failure(Error('error')),
    ];

    const givenNonSuccessViewStates = (): LoadableViewState<string>[] => [
        LoadableViewState.initial(),
        LoadableViewState.loading(),
        LoadableViewState.failure(Error('error')),
    ];

    const givenNonFailureViewStates = (): LoadableViewState<string>[] => [
        LoadableViewState.initial(),
        LoadableViewState.loading(),
        LoadableViewState.success('success'),
    ];

    describe('isInitial', () => {
        test('given an initial view state when checking initial then true is retrieved', () => {
            const initialViewState = givenAnInitialViewState();
            expect(initialViewState.isInitial).toBeTruthy();
        });

        test.each(givenNonInitialViewStates())('given %p when checking initial then false is retrieved', (viewState) => {
            expect(viewState.isInitial).toBeFalsy();
        });
    });

    describe('isLoading', () => {
        test('given a loading view state when checking loading then true is retrieved', () => {
            const loadingViewState = givenALoadingViewState();
            expect(loadingViewState.isLoading).toBeTruthy();
        });

        test.each(givenNonLoadingViewStates())('given %p when checking loading then false is retrieved', (viewState) => {
            expect(viewState.isLoading).toBeFalsy();
        });
    });

    describe('isSuccess', () => {
        test('given a success view state when checking success then true is retrieved', () => {
            const successViewState = givenASuccessViewState();
            expect(successViewState.isSuccess).toBeTruthy();
        });

        test.each(givenNonSuccessViewStates())('given %p when checking success then false is retrieved', (viewState) => {
            expect(viewState.isSuccess).toBeFalsy();
        });
    });

    describe('isFailure', () => {
        test('given a failure view state when checking failure then true is retrieved', () => {
            const failureViewState = givenAFailureViewState();
            expect(failureViewState.isFailure).toBeTruthy();
        });

        test.each(givenNonFailureViewStates())('given %p when checking failure then false is retrieved', (viewState) => {
            expect(viewState.isFailure).toBeFalsy();
        });
    });

    describe('getOrNull', () => {
        test('given a success view state when getting the value then the value is retrieved', () => {
            const successViewState = givenASuccessViewState();
            expect(successViewState.getOrNull()).toBe('success');
        });

        test.each(givenNonSuccessViewStates())('given %p when getting the value then null is retrieved', (viewState) => {
            expect(viewState.getOrNull()).toBeNull();
        });
    });

    describe('getOrDefault', () => {
        test('given a success view state when getting the value then the value is retrieved', () => {
            const successViewState = givenASuccessViewState();
            expect(successViewState.getOrDefault('default')).toBe('success');
        });

        test.each(givenNonSuccessViewStates())('given %p when getting the value then the default value is retrieved', (viewState) => {
            expect(viewState.getOrDefault('default')).toBe('default');
        });
    });

    describe('getOrThrow', () => {
        test('given a success view state when getting the value then the value is retrieved', () => {
            const successViewState = givenASuccessViewState();
            expect(successViewState.getOrThrow()).toBe('success');
        });

        test.each(givenNonSuccessViewStates())('given %p when getting the value then an error is thrown', (viewState) => {
            expect(() => viewState.getOrThrow()).toThrow();
        });
    });

    describe('errorOrNull', () => {
        test('given a failure view state when getting the error then the error is retrieved', () => {
            const failureState = givenAFailureViewState();
            expect(failureState.errorOrNull()).toBeInstanceOf(Error);
        });

        test.each(givenNonFailureViewStates())('given %p when getting the error then null is retrieved', (viewState) => {
            expect(viewState.errorOrNull()).toBeNull();
        });
    });

    describe('map', () => {
        const transform = jest.fn<(value: string) => string>().mockImplementation((value: string) => `transformed (${value})`);

        const thenTheTransformationIsApplied = (mappedViewState: LoadableViewState<string>) => {
            expect(transform).toBeCalled();
            expect(mappedViewState).toEqual(LoadableViewState.success(transform(successValue)));
        };

        const whenMapping = (successState: LoadableViewState<string>) => successState.map(transform);

        test('given a success view state when mapping then the transformation is applied', () => {
            const successViewState = givenASuccessViewState();
            const mappedViewState = whenMapping(successViewState);
            thenTheTransformationIsApplied(mappedViewState);
        });

        test.each(givenNonSuccessViewStates())('given %p when mapping then the state is returned', (viewState) => {
            const mappedViewState = viewState.map(transform);
            expect(mappedViewState).toEqual(viewState);
        });
    });

    describe('fold', () => {
        const onSuccessTransform = jest.fn<(value: string) => string>().mockImplementation((value: string) => `transformed (${value})`);

        const onFailureTransform = jest.fn<(error: Error) => string>().mockImplementation((error: Error) => `transformed (${error})`);

        const onInitialTransform = jest.fn<() => string>().mockImplementation(() => 'transformed onInitial');

        const onLoadingTransform = jest.fn<() => string>().mockImplementation(() => 'transformed onLoading');

        const allTransforms = [onSuccessTransform, onFailureTransform, onInitialTransform, onLoadingTransform];

        const givenAllViewStates = (): [
            LoadableViewState<string>,
            Mock<((error: Error) => string) | ((value: string) => string) | (() => string)>,
            string,
        ][] => [
            [LoadableViewState.initial(), onInitialTransform, onInitialTransform()],
            [LoadableViewState.loading(), onLoadingTransform, onLoadingTransform()],
            [LoadableViewState.success(successValue), onSuccessTransform, onSuccessTransform(successValue)],
            [LoadableViewState.failure(errorValue), onFailureTransform, onFailureTransform(errorValue)],
        ];

        const thenTheTransformationIsApplied = (
            transform: Mock<((error: Error) => string) | ((value: string) => string) | (() => string)>,
            mappedValue: string,
            transformedValue: string,
        ) => {
            expect(transform).toBeCalled();
            expect(mappedValue).toEqual(transformedValue);
        };

        const thenTheTransformationIsNotApplied = (transform: Mock<((error: Error) => string) | ((value: string) => string) | (() => string)>) => {
            expect(transform).not.toBeCalled();
        };

        describe('fold by using individual handlers', () => {
            const whenFolding = (viewState: LoadableViewState<string>) =>
                viewState.fold(onSuccessTransform, onFailureTransform, onInitialTransform, onLoadingTransform);

            test.each(givenAllViewStates())('given %p when folding then the state is returned', (viewState, transform, transformedValue) => {
                const mappedValue = whenFolding(viewState);
                thenTheTransformationIsApplied(transform, mappedValue, transformedValue);
                allTransforms
                    .filter((otherTransform) => otherTransform !== transform)
                    .forEach((otherTransform) => thenTheTransformationIsNotApplied(otherTransform));
            });
        });

        describe('fold by using an object', () => {
            const whenFolding = (viewState: LoadableViewState<string>) =>
                viewState.fold({ onSuccess: onSuccessTransform, onFailure: onFailureTransform, onInitial: onInitialTransform, onLoading: onLoadingTransform });

            test.each(givenAllViewStates())('given %p when folding then the view state is returned', (viewState, transform, transformedValue) => {
                const mappedValue = whenFolding(viewState);
                thenTheTransformationIsApplied(transform, mappedValue, transformedValue);
                allTransforms
                    .filter((otherTransform) => otherTransform !== transform)
                    .forEach((otherTransform) => thenTheTransformationIsNotApplied(otherTransform));
            });
        });
    });

    describe('toString', () => {
        const givenViewStates = (): [LoadableViewState<string>, string][] => [
            [LoadableViewState.initial(), 'Initial'],
            [LoadableViewState.loading(), 'Loading'],
            [LoadableViewState.success(successValue), `Success: ${successValue}`],
            [LoadableViewState.failure(errorValue), `Failure: ${errorValue}`],
        ];

        test.each(givenViewStates())('given %p when converting to string then the string representation is returned', (viewState, representationString) => {
            expect(viewState.toString()).toBe(representationString);
        });
    });

    describe('onInitial', () => {
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

        test('given an initial view state when handling onInitial then the initial action is executed', () => {
            const initialViewState = givenAnInitialViewState();
            whenHandlingOnInitial(initialViewState);
            thenTheInitialActionIsExecuted();
        });

        test.each(givenNonInitialViewStates())('given %p when handling onInitial then the initial action is not executed', (viewState) => {
            viewState.onInitial(perform);
            thenTheInitialActionIsNotExecuted();
        });
    });

    describe('onLoading', () => {
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

        test('given a loading view state when handling onLoading then the loading action is executed', () => {
            const loadingViewState = givenALoadingViewState();
            whenHandlingOnLoading(loadingViewState);
            thenTheLoadingActionIsExecuted();
        });

        test.each(givenNonLoadingViewStates())('given %p when handling onLoading then the loading action is not executed', (viewState) => {
            viewState.onLoading(perform);
            thenTheLoadingActionIsNotExecuted();
        });
    });

    describe('onSuccess', () => {
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

        test('given a success view state when handling onSuccess then the success action is executed', () => {
            const successViewState = givenASuccessViewState();
            whenHandlingOnSuccess(successViewState);
            thenTheSuccessActionIsExecuted();
        });

        test.each(givenNonSuccessViewStates())('given %p when handling onSuccess then the success action is not executed', (viewState) => {
            viewState.onSuccess(perform);
            thenTheSuccessActionIsNotExecuted();
        });
    });

    describe('onFailure', () => {
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

        test('given a failure view state when handling onFailure then the failure action is executed', () => {
            const failureViewState = givenAFailureViewState();
            whenHandlingOnFailure(failureViewState);
            thenTheFailureActionIsExecuted();
        });

        test.each(givenNonFailureViewStates())('given %p when handling onFailure then the failure action is not executed', (viewState) => {
            viewState.onFailure(perform);
            thenTheFailureActionIsNotExecuted();
        });
    });
});
