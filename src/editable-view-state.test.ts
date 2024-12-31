import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { EditableViewState } from './editable-view-state';
import Mock = jest.Mock;

describe('EditableViewState', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const initialValue = 'initial';
    const givenAnInitialViewState = () => EditableViewState.initial(initialValue);

    const loadingCurrentValue = 'current';
    const loadingTargetValue = 'target';
    const givenALoadingViewState = () => EditableViewState.loading(loadingCurrentValue, loadingTargetValue);

    const successOldValue = 'old';
    const successSucceededValue = 'succeeded';
    const givenASuccessViewState = () => EditableViewState.success(successOldValue, successSucceededValue);

    const failureCurrentValue = 'current';
    const failureFailedValue = 'failed';
    const error = Error('error');
    const givenAFailureViewState = () => EditableViewState.failure(failureCurrentValue, failureFailedValue, error);

    const givenNonInitialViewStates = (): EditableViewState<string>[] => [
        EditableViewState.loading('current', 'target'),
        EditableViewState.success('old', 'succeeded'),
        EditableViewState.failure('current', 'failed', Error('error')),
    ];

    const givenNonLoadingViewStates = (): EditableViewState<string>[] => [
        EditableViewState.initial('value'),
        EditableViewState.success('old', 'succeeded'),
        EditableViewState.failure('current', 'failed', Error('error')),
    ];

    const givenNonSuccessViewStates = (): EditableViewState<string>[] => [
        EditableViewState.initial('value'),
        EditableViewState.loading('current', 'target'),
        EditableViewState.failure('current', 'failed', Error('error')),
    ];

    const givenNonFailureViewStates = (): EditableViewState<string>[] => [
        EditableViewState.initial('value'),
        EditableViewState.loading('current', 'target'),
        EditableViewState.success('old', 'succeeded'),
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

    describe('getRelevant', () => {
        const givenViewStates = (): [EditableViewState<string>, string][] => [
            [EditableViewState.initial('value'), 'value'],
            [EditableViewState.loading('current', 'target'), 'current'],
            [EditableViewState.success('old', 'succeeded'), 'succeeded'],
            [EditableViewState.failure('current', 'failed', Error('error')), 'current'],
        ];

        test.each(givenViewStates())('given %p when getting the relevant value then %p is retrieved', (viewState, expectedValue) => {
            expect(viewState.getRelevant()).toBe(expectedValue);
        });
    });

    describe('errorOrNull', () => {
        test('given a failure view state when getting the error then the error is retrieved', () => {
            const failureViewState = givenAFailureViewState();
            expect(failureViewState.errorOrNull()).toBeInstanceOf(Error);
            expect(failureViewState.errorOrNull()).toBe(error);
        });

        test.each(givenNonFailureViewStates())('given %p when getting the error then null is retrieved', (viewState) => {
            expect(viewState.errorOrNull()).toBeNull();
        });
    });

    describe('onInitial', () => {
        const perform = jest.fn<(value: string) => void>();

        const whenHandlingOnInitial = (initialViewState: EditableViewState<string>) => initialViewState.onInitial(perform);

        test('given an initial view state when handling onInitial then the handler is called', () => {
            const initialViewState = givenAnInitialViewState();
            whenHandlingOnInitial(initialViewState);
            expect(perform).toBeCalled();
        });

        test.each(givenNonInitialViewStates())('given %p when handling onInitial then the handler is not called', (viewState) => {
            whenHandlingOnInitial(viewState);
            expect(perform).not.toBeCalled();
        });
    });

    describe('onLoading', () => {
        const perform = jest.fn<(current: string, target: string) => void>();

        const whenHandlingOnLoading = (loadingViewState: EditableViewState<string>) => loadingViewState.onLoading(perform);

        test('given a loading view state when handling onLoading then the handler is called', () => {
            const loadingViewState = givenALoadingViewState();
            whenHandlingOnLoading(loadingViewState);
            expect(perform).toBeCalled();
        });

        test.each(givenNonLoadingViewStates())('given %p when handling onLoading then the handler is not called', (viewState) => {
            whenHandlingOnLoading(viewState);
            expect(perform).not.toBeCalled();
        });
    });

    describe('onSuccess', () => {
        const perform = jest.fn<(old: string, succeeded: string) => void>();

        const whenHandlingOnSuccess = (successViewState: EditableViewState<string>) => successViewState.onSuccess(perform);

        test('given a success view state when handling onSuccess then the handler is called', () => {
            const successViewState = givenASuccessViewState();
            whenHandlingOnSuccess(successViewState);
            expect(perform).toBeCalled();
        });

        test.each(givenNonSuccessViewStates())('given %p when handling onSuccess then the handler is not called', (viewState) => {
            whenHandlingOnSuccess(viewState);
            expect(perform).not.toBeCalled();
        });
    });

    describe('onFailure', () => {
        const perform = jest.fn<(current: string, failed: string, error: Error) => void>();

        const whenHandlingOnFailure = (failureViewState: EditableViewState<string>) => failureViewState.onFailure(perform);

        test('given a failure view state when handling onFailure then the handler is called', () => {
            const failureViewState = givenAFailureViewState();
            whenHandlingOnFailure(failureViewState);
            expect(perform).toBeCalled();
        });

        test.each(givenNonFailureViewStates())('given %p when handling onFailure then the handler is not called', (viewState) => {
            whenHandlingOnFailure(viewState);
            expect(perform).not.toBeCalled();
        });
    });

    describe('fold', () => {
        const successOldValue = 'old';
        const successSucceededValue = 'succeeded';
        const onSuccessTransform = jest.fn<(old: string, succeeded: string) => string>().mockImplementation((value) => `transformed (${value})`);

        const failureCurrentValue = 'current';
        const failureFailedValue = 'failed';
        const onFailureTransform = jest
            .fn<(current: string, failed: string, error: Error) => string>()
            .mockImplementation((current, failed, error) => `transformed (${current}, ${failed}, ${error})`);

        const initialValue = 'initial';
        const onInitialTransform = jest.fn<(value: string) => string>().mockImplementation((value) => `transformed (${value})`);

        const loadingCurrentValue = 'current';
        const loadingTargetValue = 'target';
        const onLoadingTransform = jest
            .fn<(current: string, target: string) => string>()
            .mockImplementation((current, target) => `transformed (${current}, ${target})`);

        const allTransforms = [onSuccessTransform, onFailureTransform, onInitialTransform, onLoadingTransform];

        const givenAllViewStates = (): [
            EditableViewState<string>,
            Mock<((current: string, failed: string, error: Error) => string) | ((p1: string, p2: string) => string)>,
            string,
        ][] => [
            [EditableViewState.initial(initialValue), onInitialTransform, onInitialTransform(initialValue)],
            [
                EditableViewState.loading(loadingCurrentValue, loadingTargetValue),
                onLoadingTransform,
                onLoadingTransform(loadingCurrentValue, loadingTargetValue),
            ],
            [EditableViewState.success(successOldValue, successSucceededValue), onSuccessTransform, onSuccessTransform(successOldValue, successSucceededValue)],
            [
                EditableViewState.failure('current', 'failed', Error('error')),
                onFailureTransform,
                onFailureTransform(failureCurrentValue, failureFailedValue, error),
            ],
        ];

        const thenTheTransformationIsApplied = (
            transform: Mock<((current: string, failed: string, error: Error) => string) | ((p1: string, p2: string) => string)>,
            mappedValue: string,
            transformedValue: string,
        ) => {
            expect(transform).toBeCalled();
            expect(mappedValue).toEqual(transformedValue);
        };

        const thenTheTransformationIsNotApplied = (
            transform: Mock<((current: string, failed: string, error: Error) => string) | ((p1: string, p2: string) => string)>,
        ) => {
            expect(transform).not.toBeCalled();
        };

        describe('fold by using individual handlers', () => {
            const whenFolding = (viewState: EditableViewState<string>) =>
                viewState.fold(onSuccessTransform, onFailureTransform, onInitialTransform, onLoadingTransform);

            test.each(givenAllViewStates())('given %p when folding then the transformation is applied', (viewState, transform, transformedValue) => {
                const mappedValue = whenFolding(viewState);
                thenTheTransformationIsApplied(transform, mappedValue, transformedValue);
                allTransforms
                    .filter((otherTransform) => otherTransform !== transform)
                    .forEach((otherTransform) => thenTheTransformationIsNotApplied(otherTransform));
            });
        });

        describe('fold by using an object', () => {
            const whenFolding = (viewState: EditableViewState<string>) =>
                viewState.fold({
                    onSuccess: onSuccessTransform,
                    onFailure: onFailureTransform,
                    onInitial: onInitialTransform,
                    onLoading: onLoadingTransform,
                });

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
        const givenViewStates = (): [EditableViewState<string>, string][] => [
            [EditableViewState.initial(initialValue), `Initial: ${initialValue}`],
            [EditableViewState.loading(loadingCurrentValue, loadingTargetValue), `Loading: ${loadingCurrentValue} -> ${loadingTargetValue}`],
            [EditableViewState.success(successOldValue, successSucceededValue), `Success: ${successOldValue} -> ${successSucceededValue}`],
            [EditableViewState.failure(failureCurrentValue, failureFailedValue, error), `Failure: ${failureCurrentValue} -> ${failureFailedValue}`],
        ];

        test.each(givenViewStates())('given %p when converting to string then %p is returned', (viewState, expectedString) => {
            expect(viewState.toString()).toBe(expectedString);
        });
    });
});
