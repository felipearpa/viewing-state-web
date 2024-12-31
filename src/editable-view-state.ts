class Initial<Value> {
    readonly type = 'initial';

    constructor(public readonly value: Value) {}
}

class Loading<Value> {
    readonly type = 'loading';

    constructor(
        public readonly current: Value,
        public readonly target: Value,
    ) {}
}

class Success<Value> {
    readonly type = 'success';

    constructor(
        public readonly old: Value,
        public readonly succeeded: Value,
    ) {}
}

class Failure<Value> {
    readonly type = 'failure';

    constructor(
        public readonly current: Value,
        public readonly failed: Value,
        public readonly error: Error,
    ) {}
}

type EditableViewStateType<Value> = Initial<Value> | Loading<Value> | Success<Value> | Failure<Value>;

/**
 * Represents the state of an editable view, which can be in one of several states: initial, loading, success, or failure.
 *
 * This interface provides methods to check the current state, perform state-specific actions, and transform or retrieve values based on the state.
 *
 * @template Value The type of the value associated with this state.
 */
export class EditableViewState<Value> {
    constructor(private readonly editableViewState: EditableViewStateType<Value>) {}

    /**
     * Returns an instance in the initial state.
     *
     * @template Value
     * @param {Value} value - The value to be encapsulated within an initial state.
     * @return {EditableViewState<Value>} A new instance of EditableViewState with an initial state.
     */
    static initial<Value>(value: Value): EditableViewState<Value> {
        return new EditableViewState<Value>(new Initial<Value>(value));
    }

    /**
     * Returns an instance in the loading state.
     *
     * @template Value
     * @param {Value} current - The current value to be encapsulated within a loading state.
     * @param {Value} target - The target value to be encapsulated within a loading state.
     * @return {EditableViewState<Value>} A new instance of EditableViewState with a loading state.
     */
    static loading<Value>(current: Value, target: Value): EditableViewState<Value> {
        return new EditableViewState<Value>(new Loading<Value>(current, target));
    }

    /**
     * Returns an instance that encapsulates the given value as a successful state.
     *
     * @template Value
     * @param {Value} old - The old value to be encapsulated within a successful state.
     * @param {Value} succeeded - The succeeded value to be encapsulated within a successful state.
     * @return {EditableViewState<Value>} A new instance of EditableViewState with a success state.
     */
    static success<Value>(old: Value, succeeded: Value): EditableViewState<Value> {
        return new EditableViewState<Value>(new Success<Value>(old, succeeded));
    }

    /**
     * Returns an instance that encapsulates the given error as a failure state.
     *
     * @template Value
     * @param {Value} current - The current value to be encapsulated within a failure state.
     * @param {Value} failed - The failed value to be encapsulated within a failure state.
     * @param {Error} error - The error to be encapsulated within a failure state.
     * @return {EditableViewState<Value>} A new instance of EditableViewState with a failure state.
     */
    static failure<Value>(current: Value, failed: Value, error: Error): EditableViewState<Value> {
        return new EditableViewState<Value>(new Failure<Value>(current, failed, error));
    }

    /**
     * Returns true if this instance represents an initial state.
     *
     * @return {boolean} - True if this instance represents an initial state.
     */
    get isInitial(): boolean {
        return this.editableViewState instanceof Initial;
    }

    /**
     * Returns true if this instance represents a loading state.
     *
     * @return {boolean} True if this instance represents a loading state.
     */
    get isLoading(): boolean {
        return this.editableViewState instanceof Loading;
    }

    /**
     * Returns true if this instance represents a success state.
     *
     * @return {boolean} True if this instance represents a success state.
     */
    get isSuccess(): boolean {
        return this.editableViewState instanceof Success;
    }

    /**
     * Returns true if this instance represents a failure state.
     *
     * @return {boolean} True if this instance represents a failure state.
     */
    get isFailure(): boolean {
        return this.editableViewState instanceof Failure;
    }

    private static isInitial<Value>(editableViewState: EditableViewStateType<Value>): editableViewState is Initial<Value> {
        return editableViewState instanceof Initial;
    }

    private static isLoading<Value>(editableViewState: EditableViewStateType<Value>): editableViewState is Loading<Value> {
        return editableViewState instanceof Loading;
    }

    private static isSuccess<Value>(editableViewState: EditableViewStateType<Value>): editableViewState is Success<Value> {
        return editableViewState instanceof Success;
    }

    private static isFailure<Value>(editableViewState: EditableViewStateType<Value>): editableViewState is Failure<Value> {
        return editableViewState instanceof Failure;
    }

    /**
     * Returns the relevant value.
     *
     * @template Value
     * @return {Value} The relevant value.
     */
    getRelevant(): Value {
        if (EditableViewState.isInitial(this.editableViewState)) {
            return this.editableViewState.value;
        }

        if (EditableViewState.isLoading(this.editableViewState)) {
            return this.editableViewState.current;
        }

        if (EditableViewState.isSuccess(this.editableViewState)) {
            return this.editableViewState.succeeded;
        }

        if (EditableViewState.isFailure(this.editableViewState)) {
            return this.editableViewState.current;
        }

        throw new Error('unreachable state');
    }

    /**
     * Returns the error if the current state is a failure, otherwise returns null.
     *
     * @return {Error | null} The error associated with the failure state, or null if there is no failure.
     */
    errorOrNull(): Error | null {
        if (EditableViewState.isFailure(this.editableViewState)) {
            return this.editableViewState.error;
        }
        return null;
    }

    /**
     * Performs the given action if this instance represents an initial state. Returns the original state unchanged.
     *
     * @template Value
     * @param {(Value) => void} perform - The callback function to be executed if the state is initial.
     * @return {LoadableViewState<Value>} The original unchanged state.
     */
    onInitial(perform: (value: Value) => void): EditableViewState<Value> {
        if (EditableViewState.isInitial(this.editableViewState)) {
            perform(this.editableViewState.value);
        }
        return this;
    }

    /**
     * Performs the given action if this instance represents a loading state. Returns the original state unchanged.
     *
     * @template Value
     * @param {(Value, Value) => void} perform - The callback function to be executed if the state is loading.
     * @return {LoadableViewState<Value>} The original unchanged state.
     */
    onLoading(perform: (current: Value, target: Value) => void): EditableViewState<Value> {
        if (EditableViewState.isLoading(this.editableViewState)) {
            perform(this.editableViewState.current, this.editableViewState.target);
        }
        return this;
    }

    /**
     * Performs the given action on the encapsulated value if this instance represents a success state. Returns the original state unchanged.
     *
     * @template Value
     * @param {(Value, Value) => void} perform - The callback function to be executed if the state is success.
     * @return {LoadableViewState<Value>} The original unchanged state.
     */
    onSuccess(perform: (old: Value, succeeded: Value) => void): EditableViewState<Value> {
        if (EditableViewState.isSuccess(this.editableViewState)) {
            perform(this.editableViewState.old, this.editableViewState.succeeded);
        }
        return this;
    }

    /**
     * Performs the given action on the encapsulated error if this instance represents a failure state. Returns the original state unchanged.
     *
     * @template Value
     * @param {(Value, Value, Error) => void} perform - The callback function to be executed if the state is failure.
     * @return {LoadableViewState<Value>} The original unchanged state.
     */
    onFailure(perform: (current: Value, failed: Value, error: Error) => void): EditableViewState<Value> {
        if (EditableViewState.isFailure(this.editableViewState)) {
            perform(this.editableViewState.current, this.editableViewState.failed, this.editableViewState.error);
        }
        return this;
    }

    /**
     * Transforms the encapsulated value if the state is a success and returns the transformation's result, or the result of the `onElse` function for all
     * other states.
     *
     * @template Value
     * @template NewValue
     * @param {Object} handlers - An object containing handler functions for each possible state.
     * @param {(Value, Value) => NewValue} handlers.onSuccess - A function to transform the encapsulated value if the state is success.
     * @param {(Value, Value, Error) => NewValue} handlers.onFailure - A function to transform the encapsulated value if the state is error.
     * @param {(Value) => NewValue} handlers.onInitial - A function to transform the instance if the state is initial.
     * @param {(Value, Value) => NewValue} handlers.onLoading - A function to transform the instance if the state is loading.
     * @return {NewValue} - The result of onSuccess for the encapsulated value if this instance represents success or the result of onFailure function for the
     * encapsulated error if it is failure or the result of onInitial function if this instance represents initial or the result of onLoading if this instance
     * represents loading.
     */
    fold<NewValue>(handlers: {
        onSuccess: (old: Value, succeeded: Value) => NewValue;
        onFailure: (current: Value, failed: Value, error: Error) => NewValue;
        onInitial: (value: Value) => NewValue;
        onLoading: (current: Value, target: Value) => NewValue;
    }): NewValue;

    /**
     * Transforms the encapsulated value if the state is a success and returns the transformation's result, or the result of the `onElse` function for all
     * other states.
     *
     * @template Value
     * @template NewValue
     * @param {(Value, Value) => NewValue} onSuccess - A function to transform the encapsulated value if the state is success.
     * @param {(Value, Value, Error) => NewValue} onFailure - A function to transform the encapsulated value if the state is error.
     * @param {(Value) => NewValue} onInitial - A function to transform the instance if the state is initial.
     * @param {(Value, Value) => NewValue} onLoading - A function to transform the instance if the state is loading.
     * @return {NewValue} The result of onSuccess for the encapsulated value if this instance represents success or the result of onFailure function for the
     * encapsulated error if it is failure or the result of onInitial function if this instance represents initial or the result of onLoading if this instance
     * represents loading.
     */
    fold<NewValue>(
        onSuccess: (old: Value, succeeded: Value) => NewValue,
        onFailure: (current: Value, failed: Value, error: Error) => NewValue,
        onInitial: (value: Value) => NewValue,
        onLoading: (current: Value, target: Value) => NewValue,
    ): NewValue;

    fold<NewValue>(
        handlers:
            | {
                  onSuccess: (old: Value, succeeded: Value) => NewValue;
                  onFailure: (current: Value, failed: Value, error: Error) => NewValue;
                  onInitial: (value: Value) => NewValue;
                  onLoading: (current: Value, target: Value) => NewValue;
              }
            | ((old: Value, succeeded: Value) => NewValue),
        onFailure?: (current: Value, failed: Value, error: Error) => NewValue,
        onInitial?: (value: Value) => NewValue,
        onLoading?: (current: Value, target: Value) => NewValue,
    ): NewValue {
        if (typeof handlers === 'object') {
            const { onSuccess, onFailure, onInitial, onLoading } = handlers;
            return this.fold(onSuccess, onFailure, onInitial, onLoading);
        }

        if (EditableViewState.isSuccess(this.editableViewState)) {
            return (handlers as (old: Value, succeeded: Value) => NewValue)(this.editableViewState.old, this.editableViewState.succeeded);
        }

        if (EditableViewState.isInitial(this.editableViewState)) {
            return (onInitial as (value: Value) => NewValue)(this.editableViewState.value);
        }

        if (EditableViewState.isLoading(this.editableViewState)) {
            return (onLoading as (current: Value, target: Value) => NewValue)(this.editableViewState.current, this.editableViewState.target);
        }

        if (EditableViewState.isFailure(this.editableViewState)) {
            return (onFailure as (current: Value, failed: Value, error: Error) => NewValue)(
                this.editableViewState.current,
                this.editableViewState.failed,
                this.editableViewState.error,
            );
        }

        throw new Error('unreachable state');
    }

    /**
     * Converts the current state into a string representation.
     *
     * @return {string} A string describing the state: "Initial" if in the initial state, "Success: <value>" if the state is successful, "Loading" if in the
     * loading state, or "Failure: <error>" if the state is a failure.
     */
    toString(): string {
        if (EditableViewState.isInitial(this.editableViewState)) {
            return `Initial: ${this.editableViewState.value}`;
        }

        if (EditableViewState.isLoading(this.editableViewState)) {
            return `Loading: ${this.editableViewState.current} -> ${this.editableViewState.target}`;
        }

        if (EditableViewState.isSuccess(this.editableViewState)) {
            return `Success: ${this.editableViewState.old} -> ${this.editableViewState.succeeded}`;
        }

        if (EditableViewState.isFailure(this.editableViewState)) {
            return `Failure: ${this.editableViewState.current} -> ${this.editableViewState.failed}`;
        }

        throw new Error('unreachable state');
    }
}
