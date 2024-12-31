# ViewState

The **ViewState** package provides classes like `LoadableViewState` and `EditableViewState` to handle common view state transitions.
`LoadableViewState` manages four states: initial, loading, success, and failure,
while `EditableViewState` extends this functionality allowing granular control over state changes.

## Installation

To install the dependencies, use npm or yarn:

```bash
npm install @felipearpa/viewing-state
```

Or if you’re using yarn:

```bash
yarn install @felipearpa/viewing-state
```

## Usage

Here’s how you can use the package after installation. You can import the package and use its features like this:

```typescript
import { LoadableViewState } from '@felipearpa/viewing-state';

const initialViewState = LoadableViewState.initial();
console.log(initialViewState.isInitial); // Output: true

const loadingViewState = LoadableViewState.loading();
console.log(loadingViewState.isLoading); // Output: true

const successViewState = LoadableViewState.success('Data loaded successfully');
console.log(successViewState.isSuccess); // Output: true

const failureViewState = LoadableViewState.failure(Error('Failed to load data'));
console.log(failureViewState.isFailure); // Output: true
```

```typescript
import { EditableViewState } from '@felipearpa/viewing-state';

const initialViewState = EditableViewState.initial('initial value');
console.log(initialViewState.isInitial()); // Output: true

const loadingViewState = LoadableViewState.loading('current value', 'target value');
console.log(loadingViewState.isLoading); // Output: true

const successViewState = LoadableViewState.success('old value', 'succeeded value');
console.log(successViewState.isSuccess); // Output: true

const failureViewState = LoadableViewState.failure('current value', 'failed value', Error('Failed to load data'));
console.log(failureViewState.isFailure); // Output: true
```

## Running Tests

To run tests, use:

```bash
npm run test
```

Jest will automatically detect all test files and run them. For more advanced testing, refer to the [Jest documentation](https://jestjs.io/).

## Contributing

If you would like to contribute, please open a pull request or submit an issue. We are happy to review your changes or ideas!

## License

This project is licensed under the [MIT License](LICENSE).
You are free to use, modify, and distribute this software for both personal and commercial use.
There are no restrictions on usage.

## API

### `LoadableViewState` class

`LoadableViewState<Value>`

A discriminated union that encapsulates four possible states: initial, loading, success, and failure.

- #### initial

`static initial<Value>(): LoadableViewState<Value>`

Returns an instance in the initial state.

```typescript
const viewState = LoadableViewState.initial();
```

- #### loading

`static loading<Value>(): LoadableViewState<Value>`

Returns an instance in the loading state.

```typescript
const viewState = LoadableViewState.loading();
```

- #### success

`static success<Value>(value: Value): LoadableViewState<Value>`

Returns an instance that encapsulates the given value as a successful state.

```typescript
const viewState = LoadableViewState.success('Data loaded successfully');
```

- #### failure

`static failure<Value>(error: Error): LoadableViewState<Value>`

Returns an instance that encapsulates the given error as a failure state.

```typescript
const viewState = LoadableViewState.failure(Error('Failed to load data'));
```

- #### isInitial

`isInitial: boolean`

Returns true if this instance represents an initial state.

```typescript
const viewState = LoadableViewState.initial();
console.log(viewState.isInitial); // Output: true
```

- #### isLoading

`isLoading: boolean`

Returns true if this instance represents a loading state.

```typescript
const viewState = LoadableViewState.loading();
console.log(viewState.isLoading); // Output: true
```

- #### isSuccess

`isSuccess: boolean`

Returns true if this instance represents a success state.

```typescript
const viewState = LoadableViewState.success('Data loaded successfully');
console.log(viewState.isSuccess); // Output: true
```

- #### isFailure

`isFailure: boolean`

Returns true if this instance represents a failure state.

```typescript
const viewState = LoadableViewState.failure(new Error('Failed to load data'));
console.log(viewState.isFailure); // Output: true
```

- #### getOrNull

`getOrNull(): Value | null`

Returns the value if the state is successful, otherwise returns null.

```typescript
const viewState = LoadableViewState.success('Data loaded successfully');
console.log(viewState.getOrNull()); // Output: Data loaded successfully
```

- #### getOrDefault

`getOrDefault(defaultValue: Value): Value`

Returns the value if the state is successful, otherwise returns the given default value.

```typescript
const viewState = LoadableViewState.failure<string>(Error('Failed to load data'));
console.log(viewState.getOrDefault('Default value')); // Output: Default value
```

- #### getOrThrow

`getOrThrow(): Value`

Returns the value if the state is successful, otherwise throws the error.

```typescript
const viewState = LoadableViewState.success('Data loaded successfully');
console.log(viewState.getOrThrow()); // Output: Data loaded successfully
```

- #### errorOrNull

`errorOrNull(): Error | null`

Returns the error if the current state is a failure, otherwise returns null.

```typescript
const viewState = LoadableViewState.failure(Error('Failed to load data'));
console.log(viewState.errorOrNull()?.message); // Output: Failed to load data
```

- #### onInitial

`onInitial(perform: () => void): LoadableViewState<Value>`

Performs the given action if this instance represents an initial state. Returns the original state unchanged.

```typescript
const viewState = LoadableViewState.initial();
viewState.onInitial(() => console.log('State is initial'));
```

- #### onLoading

`onLoading(perform: () => void): LoadableViewState<Value>`

Performs the given action if this instance represents a loading state. Returns the original state unchanged.

```typescript
const viewState = LoadableViewState.loading();
viewState.onLoading(() => console.log('State is loading'));
```

- #### onSuccess

`onSuccess(perform: (value: Value) => void): LoadableViewState<Value>`

Performs the given action on the encapsulated value if this instance represents a success state. Returns the original state unchanged.

```typescript
const viewState = LoadableViewState.success('Data loaded successfully');
viewState.onSuccess(value => console.log(`Success: ${value}`));
```

- #### onFailure

`onFailure(perform: (error: Error) => void): LoadableViewState<Value>`

Performs the given action on the encapsulated error if this instance represents a failure state. Returns the original state unchanged.

```typescript
const viewState = LoadableViewState.failure(new Error('Failed to load data'));
viewState.onFailure(error => console.log(`Failure: ${error.message}`));
```

- #### map

`map<NewValue>(transform: (value: Value) => NewValue): LoadableViewState<NewValue>`

Transforms the encapsulated value if the state is a success and returns a new `LoadableViewState` reflecting the state of the transformation.

```typescript
const viewState = LoadableViewState.success<number>(42);
const transformedViewState = viewState.map(value => value * 2);
console.log(transformedViewState.getOrNull()); // Output: 84
```

- #### fold

`fold<NewValue>(
  onSuccess: (value: Value) => NewValue,
  onError: (error: Error) => NewValue,
  onInitial: () => NewValue,
  onLoading: () => NewValue,
): NewValue`

Transforms the encapsulated value if the state is successful and returns the result, or the result of the respective function for other states.

```typescript
const viewState = LoadableViewState.success<number>(42);
const result = viewState.fold(
    (value) => `Success: ${value}`,
    (error) => `Error: ${error.message}`,
    () => 'Initial state',
    () => 'Loading state'
);
console.log(result); // Output: Success: 42
```

```typescript
const viewState = LoadableViewState.success<number>(42);
const result = viewState.fold({
        onSuccess: (value) => `Success: ${value}`,
        onFailure: (error) => `Error: ${error.message}`,
        onInitial: () => 'Initial state',
        onLoading: () => 'Loading state',
    },
);
console.log(result); // Output: Success: 42
```

- #### toString

`toString(): string`

Returns a string representation of the current state.

```typescript
const viewState = LoadableViewState.success<string>('Data loaded successfully');
console.log(viewState.toString()); // Output: Success: Data loaded successfully
```

### `EditableViewState` class

`EditableViewState<Value>`

A discriminated union designed to manage editable view states, encapsulating four possible states: initial, loading, success, and failure.

- #### initial

`static initial<Value>(value: Value): EditableViewState<Value>`

Returns an instance in the initial state, encapsulating the provided value.

```typescript
const viewState = EditableViewState.initial('Editable Data');
console.log(viewState.isInitial()); // Output: true
```

- #### loading

`static loading<Value>(current: Value, target: Value): EditableViewState<Value>`

Returns an instance in the loading state, encapsulating both the current and target values.

```typescript
const viewState = EditableViewState.loading('Current Data', 'Target Data');
console.log(viewState.isLoading()); // Output: true
```

- #### success

`static success<Value>(old: Value, succeeded: Value): EditableViewState<Value>`

Returns an instance that encapsulates the old and succeeded values as a successful state.

```typescript
const viewState = EditableViewState.success('Old Data', 'Updated Data');
console.log(viewState.isSuccess()); // Output: true
```

- #### failure

`static failure<Value>(current: Value, failed: Value, error: Error): EditableViewState<Value>`

Returns an instance that encapsulates the current value, failed value, and an error representing a failure state.

```typescript
const viewState = EditableViewState.failure('Current Data', 'Failed Data', Error('Edit failed'));
console.log(viewState.isFailure()); // Output: true
```

- #### isInitial

`isInitial: boolean`

Returns true if this instance represents an initial state.

```typescript
const viewState = EditableViewState.initial('initial');
console.log(viewState.isInitial); // Output: true
```

- #### isLoading

`isLoading: boolean`

Returns true if this instance represents a loading state.

```typescript
const viewState = EditableViewState.loading('currrent', 'target');
console.log(viewState.isLoading); // Output: true
```

- #### isSuccess

`isSuccess: boolean`

Returns true if this instance represents a success state.

```typescript
const viewState = EditableViewState.success('old', 'succeeded');
console.log(viewState.isSuccess); // Output: true
```

- #### isFailure

`isFailure: boolean`

Returns true if this instance represents a failure state.

```typescript
const viewState = EditableViewState.failure('current', 'failed', Error('error'));
console.log(viewState.isFailure); // Output: true
```

- #### getRelevant

`getRelevant(): Value`

Returns the relevant value encapsulated in the state. For successful states, it returns the new value; for other states, it returns the current value.

```typescript
import { EditableViewState } from '@felipearpa/viewing-state';

// Initial State
const initialViewState = EditableViewState.initial('initial value');
console.log(initialViewState.getRelevant()); // Output: 'initial value'

// Loading State
const loadingViewState = EditableViewState.loading('current value', 'target value');
console.log(loadingViewState.getRelevant()); // Output: 'current value' (current value is relevant during loading)

// Success State
const successViewState = EditableViewState.success('old value', 'updated value');
console.log(successViewState.getRelevant()); // Output: 'updated value' (new value is relevant after success)

// Failure State
const failureViewState = EditableViewState.failure('current value', 'failed value', Error('Update failed'));
console.log(failureViewState.getRelevant()); // Output: 'current value' (current value is relevant after a failure)
```

- #### errorOrNull

`errorOrNull(): Error | null`

Returns the error if the state represents a failure, otherwise returns null.

```typescript
const viewState = EditableViewState.failure('current value', 'failed value', Error('Update failed'));
console.log(viewState.errorOrNull()?.message); // Output: Update failed
```

- #### fold

`fold<NewValue>(
  onSuccess: (old: Value, succeeded: Value) => NewValue,
  onFailure: (current: Value, failed: Value, error: Error) => NewValue,
  onInitial: (value: Value) => NewValue,
  onLoading: (current: Value, target: Value) => NewValue
): NewValue`

Transforms the encapsulated value based on the state and returns the transformation or action result.

```typescript
import { EditableViewState } from '@felipearpa/viewing-state';

const viewState = EditableViewState.failure('current value', 'failed value', new Error('Network issue'));

const result = viewState.fold(
    (old, succeeded) => `Success: ${old} -> ${succeeded}`,
    (current, failed, error) => `Failure: ${current} -> ${failed}, Reason: ${error.message}`,
    (value) => `Initial state with value: ${value}`,
    (current, target) => `Loading: From ${current} to ${target}`
);

console.log(result); // Output: "Failure: current value -> failed value, Reason: Network issue"
```

```typescript
import { EditableViewState } from '@felipearpa/viewing-state';

const viewState = EditableViewState.success('old value', 'new value');

const result = viewState.fold({
    onInitial: (value) => `State is initial with value: ${value}`,
    onLoading: (current, target) => `Loading: ${current} -> ${target}`,
    onSuccess: (old, succeeded) => `Success: Updated from ${old} to ${succeeded}`,
    onFailure: (current, failed, error) => `Failure: Couldn't update ${current} to ${failed}. Reason: ${error.message}`,
});

console.log(result); // Output: "Success: Updated from old value to new value"
```

- #### onInitial

`onInitial(perform: (value: Value) => void): EditableViewState<Value>`

Executes the given action if the state is initial and returns the original state.

```typescript
import { EditableViewState } from '@felipearpa/viewing-state';

const viewState = EditableViewState.initial('Initial editable value');

viewState.onInitial((value) => {
    console.log(`State is initial with value: ${value}`);
});

// Output: State is initial with value: Initial editable value
```

- #### onLoading

`onLoading(perform: (current: Value, target: Value) => void): EditableViewState<Value>`

Executes the given action if the state is loading and returns the original state.

```typescript
import { EditableViewState } from '@felipearpa/viewing-state';

const viewState = EditableViewState.loading('current value', 'target value');

viewState.onLoading((current, target) => {
    console.log(`State is loading. Current value: ${current}, Target value: ${target}`);
});

// Output: State is loading. Current value: current value, Target value: target value
```

- #### onSuccess

`onSuccess(perform: (old: Value, succeeded: Value) => void): EditableViewState<Value>`

Executes the given action on the encapsulated succeeded value if the state is success and returns the original state.

```typescript
import { EditableViewState } from '@felipearpa/viewing-state';

const viewState = EditableViewState.success('Old Value', 'New Value');

viewState.onSuccess((old, succeeded) => {
    console.log(`State succeeded. Updated from "${old}" to "${succeeded}".`);
});

// Output: State succeeded. Updated from "Old Value" to "New Value".
```

- #### onFailure

`onFailure(perform: (current: Value, failed: Value, error: Error) => void): EditableViewState<Value>`

Executes the given action on the encapsulated error if the state is a failure and returns the original state.

```typescript
import { EditableViewState } from '@felipearpa/viewing-state';

const viewState = EditableViewState.failure(
    'current value',
    'failed value',
    new Error('Update operation failed') // Encapsulated error
);

viewState.onFailure((current, failed, error) => {
    console.error(`Failure occurred when updating "${current}" to "${failed}": ${error.message}`);
});

// Output: Failure occurred when updating "current value" to "failed value": Update operation failed
```

- #### toString

`toString(): string`

Returns a string representation of the current state.

```typescript
const viewState = EditableViewState.success('Old Data', 'Updated Data');
console.log(viewState.toString()); // Output: Success: Old Data -> Updated Data
```
