# LoadableViewState

The **LoadableViewState** package provides a `LoadableViewState` class designed to handle four states in a view: initial, loading, success, and failure.
It encapsulates a state with associated logic to simplify state management.

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

const initialState = LoadableViewState.initial();
console.log(initialState.isInitial); // Output: true

const loadingState = LoadableViewState.loading();
console.log(loadingState.isLoading); // Output: true

const successState = LoadableViewState.success('Data loaded successfully');
console.log(successState.isSuccess); // Output: true

const failureState = LoadableViewState.failure(new Error('Failed to load data'));
console.log(failureState.isFailure); // Output: true
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
const initialState = LoadableViewState.initial();
```

- #### loading

`static loading<Value>(): LoadableViewState<Value>`

Returns an instance in the loading state.

```typescript
const loadingState = LoadableViewState.loading();
```

- #### success

`static success<Value>(value: Value): LoadableViewState<Value>`

Returns an instance that encapsulates the given value as a successful state.

```typescript
const successState = LoadableViewState.success('Data loaded successfully');
```

- #### failure

`static failure<Value>(error: Error): LoadableViewState<Value>`

Returns an instance that encapsulates the given error as a failure state.

```typescript
const failureState = LoadableViewState.failure(new Error('Failed to load data'));
```

- #### isInitial

`isInitial: boolean`

Returns true if this instance represents an initial state.

```typescript
const state = LoadableViewState.initial();
console.log(state.isInitial); // Output: true
```

- #### isLoading

`isLoading: boolean`

Returns true if this instance represents a loading state.

```typescript
const state = LoadableViewState.loading();
console.log(state.isLoading); // Output: true
```

- #### isSuccess

`isSuccess: boolean`

Returns true if this instance represents a success state.

```typescript
const state = LoadableViewState.success('Data loaded successfully');
console.log(state.isSuccess); // Output: true
```

- #### isFailure

`isFailure: boolean`

Returns true if this instance represents a failure state.

```typescript
const state = LoadableViewState.failure(new Error('Failed to load data'));
console.log(state.isFailure); // Output: true
```

- #### getOrNull

`getOrNull(): Value | null`

Returns the value if the state is successful, otherwise returns null.

```typescript
const state = LoadableViewState.success('Data loaded successfully');
console.log(state.getOrNull()); // Output: Data loaded successfully
```

- #### getOrDefault

`getOrDefault(defaultValue: Value): Value`

Returns the value if the state is successful, otherwise returns the given default value.

```typescript
const state = LoadableViewState.failure<string>(new Error('Failed to load data'));
console.log(state.getOrDefault('Default value')); // Output: Default value
```

- #### getOrThrow

`getOrThrow(): Value`

Returns the value if the state is successful, otherwise throws the error.

```typescript
const state = LoadableViewState.success('Data loaded successfully');
console.log(state.getOrThrow()); // Output: Data loaded successfully
```

- #### errorOrNull

`errorOrNull(): Error | null`

Returns the error if the current state is a failure, otherwise returns null.

```typescript
const state = LoadableViewState.failure(new Error('Failed to load data'));
console.log(state.errorOrNull()?.message); // Output: Failed to load data
```

- #### onInitial

`onInitial(perform: () => void): LoadableViewState<Value>`

Performs the given action if this instance represents an initial state. Returns the original state unchanged.

```typescript
const state = LoadableViewState.initial();
state.onInitial(() => console.log('State is initial'));
```

- #### onLoading

`onLoading(perform: () => void): LoadableViewState<Value>`

Performs the given action if this instance represents a loading state. Returns the original state unchanged.

```typescript
const state = LoadableViewState.loading();
state.onLoading(() => console.log('State is loading'));
```

- #### onSuccess

`onSuccess(perform: (value: Value) => void): LoadableViewState<Value>`

Performs the given action on the encapsulated value if this instance represents a success state. Returns the original state unchanged.

```typescript
const state = LoadableViewState.success('Data loaded successfully');
state.onSuccess(value => console.log(`Success: ${value}`));
```

- #### onFailure

`onFailure(perform: (error: Error) => void): LoadableViewState<Value>`

Performs the given action on the encapsulated error if this instance represents a failure state. Returns the original state unchanged.

```typescript
const state = LoadableViewState.failure(new Error('Failed to load data'));
state.onFailure(error => console.log(`Failure: ${error.message}`));
```

- #### map

`map<NewValue>(transform: (value: Value) => NewValue): LoadableViewState<NewValue>`

Transforms the encapsulated value if the state is a success and returns a new `LoadableViewState` reflecting the state of the transformation.

```typescript
const state = LoadableViewState.success<number>(42);
const transformedState = state.map(value => value * 2);
console.log(transformedState.getOrNull()); // Output: 84
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
const state = LoadableViewState.success<number>(42);
const result = state.fold(
    value => `Success: ${value}`,
    error => `Error: ${error.message}`,
    () => 'Initial state',
    () => 'Loading state'
);
console.log(result); // Output: Success: 42
```

- #### toString

`toString(): string`

Returns a string representation of the current state.

```typescript
const state = LoadableViewState.success<string>('Data loaded successfully');
console.log(state.toString()); // Output: Success: Data loaded successfully
```
