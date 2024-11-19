# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2024-11-18
### 🚀 Initial Release
- **Introduced** the `LoadableViewState` class to handle initial, loading, success, and failure states in a view.
- **Added** `initial()` method to create an instance with an initial state.
- **Added** `loading()` method to create an instance with a loading state.
- **Added** `success(value)` method to create an instance with a successful state encapsulating a given value.
- **Added** `failure(error)` method to create an instance with a failure state encapsulating a given error.
- **Implemented** boolean getters `isInitial`, `isLoading`, `isSuccess`, and `isFailure` to check the current state.
- **Added** error handling methods `getOrThrow()` to return the value if successful or throw an error if failure.
- **Added** value retrieval methods `getOrNull()` and `getOrDefault(defaultValue)` to fetch the value.
- **Implemented** `onInitial()`, `onLoading()`, `onSuccess()`, and `onFailure()` to perform actions based on state.
- **Enabled** state transformation with `map()` and `fold()` methods.
- **Provided** `toString()` method to get a string representation of the current state.

---

### **How to Use This Changelog**
This changelog documents all releases and notable changes. Use this to understand what’s new, improved, or fixed in each version.
