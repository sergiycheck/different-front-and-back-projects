## Basic static page representing api requests

### Ways to start the project

Commands to execute in the terminal of the current directory:

```sh
lite-server baseDir=.
```

or press `Go Live` button at the right bottom corner in the vscode.

### Additional info

All errors are handled in **GlobalErrorHandler** class and printed to the console. You can increase time in **simulateLongerRequestToShowLoader** function to try out **ConcurrencyError** by trying to add new user while loader is beign shown on the screen. You can try to disable internet connection to try out handling **httpError**. Updating or adding new user with the first name **error** or empty is not permitted to show **Validation** error handling. Closure explanation is in **UserVisualizer** class above **updateUser** method.
