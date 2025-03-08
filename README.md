# nextjs-interview / TodoApi

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start
```

# Tasks List

## 1. **Initial Setup**
- **Description**: Initial setup and preparation for implementation.
    - **Task 1.1**: Refactor the existing codebase.
    - **Task 1.2**: Create seed data for `TodoLists`
    - **Task 1.3**: Add TodoItem model and seed data

## 2. **Synchronization Logic Implementation**
- **Description**: Develop the core synchronization logic.
  - **Task 2.1**: Create a mechanism to synchronize new `TodoLists` and `TodoItems` from the external API.
  - **Task 2.2**: Propagate local changes (new entries, updates, deletions) to the external API.
  - **Task 2.3**: Handle deletions both locally and remotely for `TodoLists` and `TodoItems`.

## 3. **Error Handling and Logging**
- **Description**: Set up error handling and logging system.
  - **Task 3.1**: Implement error handling to capture failures from the external API.
  - **Task 3.2**: Create a detailed logging system to track all errors and failures during synchronization.

## 4. **Resilience and Reliability**
- **Description**: Improve system reliability in case of failures.
  - **Task 4.1**: Implement a retry mechanism to handle failures in the external API.
  - **Task 4.2**: Ensure that failures do not compromise the integrity of local data.

## 5. **Performance Optimization**
- **Description**: Minimize unnecessary calls to the external API.
  - **Task 5.1**: Implement logic to avoid redundant calls to the external API.
  - **Task 5.2**: Use local storage (cache) to reduce unnecessary interactions.

## 6. **Write Test Cases**
- **Description**: Ensure synchronization works correctly.
  - **Task 6.1**: Write unit tests to validate data synchronization (creation, update, deletion).
  - **Task 6.2**: Implement integration tests to verify communication with the external API.
  - **Task 6.3**: Write tests to handle failure scenarios and retries.

## 7. **Documentation**
- **Description**: Document code, design decisions, and usage.
  - **Task 7.1**: Create a `NOTES.txt` file with the overall approach and design decisions.
  - **Task 7.2**: Document how failures and exceptions are handled in the system.
  - **Task 7.3**: Explain potential areas of improvement for future iterations.

## 8. **Final Submission**
- **Description**: Prepare final submission.
  - **Task 8.1**: Include the complete source code for the synchronization solution.
  - **Task 8.2**: Include validated test cases.
  - **Task 8.3**: Include the `NOTES.txt` file with all design explanations.
  - **Task 8.4**: Provide clear instructions to run the solution and tests.

## 9. **Future Improvements**
- **Description**: Propose additional improvements and changes.
  - **Task 9.1**: Suggest improvements to the external API to optimize performance.
  - **Task 9.2**: Propose improvements to the synchronization system (real-time updates).

# Version Control Strategy

## Feature Branches

I will create feature branches based on the task list provided. The naming convention for the branches will be:

- **Branch Name Format**: `feat-{taskId}/{taskName}`
  - Example: `feat-2/synchronization-logic-implementation`

Each feature branch will be dedicated to a specific task or group of tasks.

## Commit Message Convention

For each commit, I will follow the commit message format:

- **Commit Message Format**: `task-{taskId} {message}`
  - Example: `task-2 Implement synchronization logic to create new TodoLists`
  
This will ensure clear tracking of progress and maintainability of the codebase. Each commit will correspond directly to a specific task in the task list.
