class InitialType {
    readonly type = 'initial';
}

const initialType = new InitialType();

class LoadingType {
    readonly type = 'loading';
}

const loadingType = new LoadingType();

class SuccessType<Value> {
    readonly type = 'success';

    constructor(public readonly value: Value) {}
}

class FailureType {
    readonly type = 'failure';

    constructor(public readonly error: Error) {}
}

type LoadableViewStateType<Value> = InitialType | LoadingType | SuccessType<Value> | FailureType;

/**
 * Represents the state of a loadable view, allowing for handling multiple states such as initial, loading, success, or failure.
 *
 * This class provides utility methods to construct different states, query the current state, and perform corresponding operations
 * based on the specific state type.
 *
 * @template Value The type of the data this state encapsulates in a success case.
 */
export class LoadableViewState<Value> {
    constructor(private readonly loadableViewState: LoadableViewStateType<Value>) {}

    /**
     * Returns an instance in the initial state.
     *
     * @template Value
     * @return {LoadableViewState<Value>} A new instance of LoadableViewState with an initial state.
     */
    static initial<Value>(): LoadableViewState<Value> {
        return new LoadableViewState(initialType);
    }

    /**
     * Returns an instance in the loading state.
     *
     * @template Value
     * @return {LoadableViewState<Value>} A new instance of LoadableViewState with a loading state.
     */
    static loading<Value>(): LoadableViewState<Value> {
        return new LoadableViewState(loadingType);
    }

    /**
     * Returns an instance that encapsulates the given value as a successful state.
     *
     * @template Value
     * @param {Value} value - The value to be encapsulated within a successful state.
     * @return {LoadableViewState<Value>} A new instance of LoadableViewState with a success state.
     */
    static success<Value>(value: Value): LoadableViewState<Value> {
        return new LoadableViewState(new SuccessType(value));
    }

    /**
     * Returns an instance that encapsulates the given error as a failure state.
     *
     * @template Value
     * @param {Error} error - The error to be encapsulated within a failure state.
     * @return {LoadableViewState<Value>} A new instance of LoadableViewState with a failure state.
     */
    static failure<Value>(error: Error): LoadableViewState<Value> {
        return new LoadableViewState(new FailureType(error));
    }

    /**
     * Returns true if this instance represents an initial state.
     *
     * @return {boolean} - True if this instance represents an initial state.
     */
    get isInitial(): boolean {
        return this.loadableViewState instanceof InitialType;
    }

    /**
     * Returns true if this instance represents a loading state.
     *
     * @return {boolean} True if this instance represents a loading state.
     */
    get isLoading(): boolean {
        return this.loadableViewState instanceof LoadingType;
    }

    /**
     * Returns true if this instance represents a success state.
     *
     * @return {boolean} True if this instance represents a success state.
     */
    get isSuccess(): boolean {
        return this.loadableViewState instanceof SuccessType;
    }

    /**
     * Returns true if this instance represents a failure state.
     *
     * @return {boolean} True if this instance represents a failure state.
     */
    get isFailure(): boolean {
        return this.loadableViewState instanceof FailureType;
    }

    /**
     * Returns the value if the state is successful, otherwise returns null.
     *
     * @template Value
     * @return {Value | null} The value if the operation was successful, otherwise returns null.
     */
    getOrNull(): Value | null {
        if (this.isSuccess) return (this.loadableViewState as SuccessType<Value>).value;
        return null;
    }

    /**
     * Returns the value if the state is successful, otherwise returns the given default value.
     *
     * @template Value
     * @param {Value} defaultValue - The value to return if the state is not successful.
     * @return {Value} - The value from the state if successful, otherwise the provided default value.
     */
    getOrDefault(defaultValue: Value): Value {
        if (this.isSuccess) return (this.loadableViewState as SuccessType<Value>).value;
        return defaultValue;
    }

    /**
     * Returns the value if the state is successful, otherwise throws the error.
     *
     * @template Value
     * @return {Value} The value from the state if successful.
     * @throws {Error} If the state is not successful, throws the associated error.
     */
    getOrThrow(): Value {
        if (this.isSuccess) return (this.loadableViewState as SuccessType<Value>).value;
        throw (this.loadableViewState as FailureType).error;
    }

    /**
     * Returns the error if the current state is a failure, otherwise returns null.
     *
     * @return {Error | null} The error associated with the failure state, or null if there is no failure.
     */
    errorOrNull(): Error | null {
        if (this.isFailure) return (this.loadableViewState as FailureType).error;
        return null;
    }

    /**
     * Performs the given action if this instance represents an initial state. Returns the original state unchanged.
     *
     * @template Value
     * @param {() => void} perform - The callback function to be executed if the state is initial.
     * @return {LoadableViewState<Value>} The original unchanged state.
     */
    onInitial(perform: () => void): LoadableViewState<Value> {
        if (this.isInitial) perform();
        return this;
    }

    /**
     * Performs the given action if this instance represents a loading state. Returns the original state unchanged.
     *
     * @template Value
     * @param {() => void} perform - The callback function to be executed if the state is loading.
     * @return {LoadableViewState<Value>} The original unchanged state.
     */
    onLoading(perform: () => void): LoadableViewState<Value> {
        if (this.isLoading) perform();
        return this;
    }

    /**
     * Performs the given action on the encapsulated value if this instance represents a success state. Returns the original state unchanged.
     *
     * @template Value
     * @param {(Value) => void} perform - The callback function to be executed if the state is success.
     * @return {LoadableViewState<Value>} The original unchanged state.
     */
    onSuccess(perform: (value: Value) => void): LoadableViewState<Value> {
        if (this.isSuccess) perform((this.loadableViewState as SuccessType<Value>).value);
        return this;
    }

    /**
     * Performs the given action on the encapsulated error if this instance represents a failure state. Returns the original state unchanged.
     *
     * @template Value
     * @param {(Error) => void} perform - The callback function to be executed if the state is failure.
     * @return {LoadableViewState<Value>} The original unchanged state.
     */
    onFailure(perform: (error: Error) => void): LoadableViewState<Value> {
        if (this.isFailure) perform((this.loadableViewState as FailureType).error);
        return this;
    }

    /**
     * Transforms the encapsulated value if the state is a success and returns a new LoadableViewState reflecting the state of the transformation.
     *
     * @template Value
     * @template NewValue
     * @param {(Value) => NewValue} transform - A function to transform the encapsulated value if the state is success.
     * @return {LoadableViewState<NewValue>} A new LoadableViewState containing the transformed value, or the current state if the state is not success.
     */
    map<NewValue>(transform: (value: Value) => NewValue): LoadableViewState<NewValue> {
        const value = this.getOrNull();
        if (value != null) return LoadableViewState.success(transform(value));
        if (this.isInitial) return LoadableViewState.initial();
        if (this.isLoading) return LoadableViewState.loading();
        return LoadableViewState.failure((this.loadableViewState as FailureType).error);
    }

    /**
     * Transforms the encapsulated value if the state is a success and returns the transformation's result, or the result of the `onElse` function for all
     * other states.
     *
     * @template Value
     * @template NewValue
     * @param {Object} handlers - An object containing handler functions for each possible state.
     * @param {(Value) => NewValue} handlers.onSuccess - A function to transform the encapsulated value if the state is success.
     * @param {(Error) => NewValue} handlers.onFailure - A function to transform the encapsulated value if the state is error.
     * @param {() => NewValue} handlers.onInitial - A function to transform the instance if the state is initial.
     * @param {() => NewValue} handlers.onLoading - A function to transform the instance if the state is loading.
     * @return {NewValue} - The result of onSuccess for the encapsulated value if this instance represents success or the result of onFailure function for the
     * encapsulated error if it is failure or the result of onInitial function if this instance represents initial or the result of onLoading if this instance
     * represents loading.
     */
    fold<NewValue>(handlers: {
        onSuccess: (value: Value) => NewValue;
        onFailure: (error: Error) => NewValue;
        onInitial: () => NewValue;
        onLoading: () => NewValue;
    }): NewValue;

    /**
     * Transforms the encapsulated value if the state is a success and returns the transformation's result, or the result of the `onElse` function for all
     * other states.
     *
     * @template Value
     * @template NewValue
     * @param {(Value) => NewValue} onSuccess - A function to transform the encapsulated value if the state is success.
     * @param {(Error) => NewValue} onFailure - A function to transform the encapsulated value if the state is error.
     * @param {() => NewValue} onInitial - A function to transform the instance if the state is initial.
     * @param {() => NewValue} onLoading - A function to transform the instance if the state is loading.
     * @return {NewValue} The result of onSuccess for the encapsulated value if this instance represents success or the result of onFailure function for the
     * encapsulated error if it is failure or the result of onInitial function if this instance represents initial or the result of onLoading if this instance
     * represents loading.
     */
    fold<NewValue>(
        onSuccess: (value: Value) => NewValue,
        onFailure: (error: Error) => NewValue,
        onInitial: () => NewValue,
        onLoading: () => NewValue,
    ): NewValue;

    fold<NewValue>(
        handlers:
            | {
                  onSuccess: (value: Value) => NewValue;
                  onFailure: (error: Error) => NewValue;
                  onInitial: () => NewValue;
                  onLoading: () => NewValue;
              }
            | ((value: Value) => NewValue),
        onFailure?: (error: Error) => NewValue,
        onInitial?: () => NewValue,
        onLoading?: () => NewValue,
    ): NewValue {
        if (typeof handlers === 'object') {
            const { onSuccess, onFailure, onInitial, onLoading } = handlers;
            return this.fold(onSuccess, onFailure, onInitial, onLoading);
        }

        if (this.isSuccess) return (handlers as (value: Value) => NewValue)((this.loadableViewState as { value: Value }).value);
        if (this.isInitial) return (onInitial as () => NewValue)();
        if (this.isLoading) return (onLoading as () => NewValue)();
        return (onFailure as (error: Error) => NewValue)((this.loadableViewState as { error: Error }).error);
    }

    /**
     * Converts the current state into a string representation.
     *
     * @return {string} A string describing the state: "Initial" if in the initial state, "Success: <value>" if the state is successful, "Loading" if in the
     * loading state, or "Failure: <error>" if the state is a failure.
     */
    toString(): string {
        if (this.isInitial) return 'Initial';
        if (this.isSuccess) return `Success: ${String((this.loadableViewState as SuccessType<Value>).value)}`;
        if (this.isLoading) return 'Loading';
        return `Failure: ${String((this.loadableViewState as FailureType).error)}`;
    }
}
