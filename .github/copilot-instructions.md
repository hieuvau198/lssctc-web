# GitHub Copilot & AI Agent Guide for **LSSCTC-WEB**

> **Goal:** Help Copilot and AI agents generate code that follows the correct architecture, style, and business logic of the LSSCTC Web project.

---

## 0) General Principles
- **Do not install new libraries** unless explicitly required. Use only what exists in the project.
- **Keep the folder structure** exactly as defined below.
- **Use English code and short comments.**
- **No hard-coded URLs or tokens.** Use environment variables and helpers.
- **Follow type-safe practices.** Use JSDoc or PropTypes if needed.
- **Commit messages:** `feat/(Branch name)-(short Description)`, `fix/(Branch name)-(short Description)`, `refactor/(Branch name)-(short Description)`.

---

## 1) Tech Stack & Rules
- **Build Tool:** Vite
- **Frontend Framework:** React 18
- **UI:** TailwindCSS (no inline styles), Ant Design (if already used), Lucide Icons (for icons)
- **Data Fetching:** React Query (TanStack Query), axios (if already used)
- **State Management:** React Context + Local Hooks
- **Routing:** TanStack Router (or React Router if already used)
- **Authentication:** JWT Bearer tokens (stored in AuthContext)
- **Lint:** Follow the rules from `eslint.config.js`

---

## 2) Folder Structure (Mandatory for Copilot)
```
src/
  app/            # entry, assets, layouts, pages
  assets/         # images, svg, fonts
  components/     # reusable UI components (no direct API calls)
  contexts/       # global contexts (AuthProvider, ThemeProvider...)
  hooks/          # shared hooks (useAuth, useQueryClient...)
  layouts/        # main layouts (header, footer...)
  modules/        # business logic modules
    <Module>/
      api/        # API calls and data mappers
      components/ # module-specific components
      pages/      # route-level pages
      hooks/      # module-specific hooks
      types/      # JSdoc or TS types
  routes/         # route configuration
  styles/         # CSS/Tailwind utilities
```

**Rules:**
- New Page → `src/modules/<Module>/pages/*` and add route in `src/routes`.
- New API → `src/modules/<Module>/api/*`, return pure async functions.
- New Hook → `src/modules/<Module>/hooks/*`, use React Query for fetching.

---

## 3) Backend Connection (LSSCTC-API)
- **Base URL:** `import.meta.env.VITE_API_BASE_URL`
- **Auth Header:** `Authorization: Bearer <token>` from `AuthContext`
- **Use fetch()** for all requests (no axios unless already in project).

### Example: Simple HTTP Helper
```js
export async function http(path, { method = 'GET', body, token, headers } = {}) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json().catch(() => null);
}
```

---

## 4) System Overview & Roles
**Roles:**
- **Admin:** Manage users, programs, courses, and classes.
- **Instructor:** Manage assigned classes, activities, and grading.
- **Trainee:** Join classes, do quizzes, and simulation practices.
- **Simulation Manager:** Manage simulation components and scenarios.

**Main Modules:**
- Authentication & User Management
- Program & Course Management
- Class & Enrollment
- Quiz & Assessment
- Simulation Practice Management

---

## 5) Business Rules Summary (Simplified)
| Code | Category | Rule |
|------|-----------|------|
| BR-01 | Authentication | Upon successful login to the web app, the system must redirect users to their role-based landing page:<br>- Admin: Admin Dashboard <br>- Simulation Manager: Simulation Manager Dashboard <br>- Instructor: Instructor Dashboard <br>- Trainee: Trainee Home Page |
| BR-02 | Authentication | Upon successful login to the simulation app, users with the 'Trainee' role must be redirected to the home screen. |
| BR-03 | Authentication | Deactivated accounts cannot log in or interact with the system. |
| BR-04 | Authentication | The Username, Email, and Phone Number fields must be unique for each user account. |
| BR-05 | Authentication | A user's Phone Number must be between 4 and 15 digits. |
| BR-06 | Authentication | The Email field must adhere to a standard email format (e.g., user@domain.com). |
| BR-07 | Authentication | A user's account profile can only be updated by the account owner. |
| BR-08 | Authentication | A password reset request must require email verification. |
| BR-09 | Permissions | The 'Admin' role has exclusive permissions to manage 'Simulation Manager', 'Instructor', and 'Trainee' accounts. |
| BR-10 | Permissions | The 'Admin' role has exclusive permissions to:<br>- Create and update programs.<br>- Assign courses to a program.<br>- Create and update courses.<br>- Create and update course syllabi.<br>- Manage classes. |
| BR-11 | Permissions | Instructors can only manage content for classes to which they are assigned. |
| BR-12 | Programs | A new program must be created with a Name and an Active Status. |
| BR-13 | Programs | A program cannot contain duplicate course assignments. |
| BR-14 | Programs | A program cannot be assigned more than 10 courses. |
| BR-15 | Courses | Each course must have a unique Name and a unique Course Code. |
| BR-16 | Courses | A new course must be created with a Name, Course Code, and one or more Syllabus Sections. |
| BR-17 | Courses | A course syllabus can only be updated if no classes are currently assigned to that course. |
| BR-18 | Classes | Each class must have a unique Name and a unique Class Code. |
| BR-19 | Classes | A class must be linked to a specific course upon creation. |
| BR-20 | Classes | A class must have exactly one assigned 'Instructor'. |
| BR-21 | Classes | The sections of a class must mirror the syllabus sections of its parent course. |
| BR-22 | Classes | Class content can only be updated before the class start date. |
| BR-23 | Classes | A class can only be started if all prerequisites are met:<br>- At least one 'Trainee' is enrolled.<br>- One 'Instructor' is assigned.<br>- Every class section contains at least one activity. |
| BR-24 | Trainee | 'Trainees' must provide a valid driver's license before enrolling in any program. |
| BR-25 | Trainee | A 'Trainee' cannot be enrolled in the same class more than once. |
| BR-26 | Trainee | A 'Trainee' cannot be enrolled in two different classes that belong to the same course. |
| BR-27 | Trainee | 'Trainees' must provide a valid driver's license before enrolling in any program. |
| BR-28 | Class Activities | Each section activity must be one of the following types: 'Video', 'Document', 'Quiz', or 'Practice'. |
| BR-29 | Class Activities | A new activity must be created with a Name, Type, and Order (sequence) number. |
| BR-30 | Class Activities | A new learning material (e.g., 'Video', 'Document') must include a Name and either a Source File or Source URL. |
| BR-31 | Class Activities | A Source File for learning material cannot exceed 50MB in size. |
| BR-32 | Quizzes | A new quiz must be created with a Name and a Max Attempts value. |
| BR-33 | Quizzes | A quiz must contain one or more questions. |
| BR-34 | Quizzes | Each question must include answer options, and each option must be flagged as 'Correct' or 'Incorrect'. |
| BR-35 | Quizzes | A quiz cannot contain more than 100 questions. |
| BR-36 | Quizzes | A quiz question cannot have more than 20 answer options. |
| BR-37 | Quizzes | The total score for every quiz must be exactly 10 points. |
| BR-38 | Quizzes | The score of any single question must be greater than 0 and less than 10. |
| BR-39 | Quizzes | The sum of all question scores within a quiz must equal 10. |
| BR-40 | Quizzes | Only users with the 'Trainee' role can attempt a quiz. |
| BR-41 | Quizzes | Every quiz attempt by a 'Trainee' must be recorded. |
| BR-42 | Quizzes | A 'Trainee's' final quiz score must be determined by their latest attempt. |
| BR-43 | Quizzes | 'Trainees' cannot retake a quiz after reaching the Max Attempts limit. |
| BR-44 | Simulation Practices | A simulation practice must contain between 1 and 20 steps. |
| BR-45 | Simulation Practices | Each practice step must be assigned exactly one simulation Component. |
| BR-46 | Simulation Practices | Each practice step must be assigned exactly one simulation Action. |
| BR-47 | Simulation Practices | Practice steps within the same practice cannot have duplicate Order numbers. |
| BR-48 | Simulation Practices | A new practice step must be created with a Name, Order number, and Expected Results. |
| BR-49 | Simulation Practices | A new simulation Action must have a unique Name and a unique Action Key. |
| BR-50 | Simulation Practices | A new simulation Component must have a unique Name. |
| BR-51 | Simulation Practices | 'Trainees' must be authenticated before accessing a simulation practice. |
| BR-52 | Simulation Practices | 'Trainees' can only start practices that are marked as 'Active' and are part of their assigned class. |
| BR-53 | Simulation Practices | 'Trainees' must complete all simulation steps in the specified Order. |
| BR-54 | Simulation Practices | While a 'Trainee' is taking a simulation practice:<br>- The system must display guides and step descriptions.<br>- The system must automatically advance to the next step upon successful completion of the current step.<br>- The system must record the result of every step for evaluation. |
| BR-55 | Simulation Practices | 'Trainees' cannot retake a simulation practice after reaching the Max Attempts limit. |
| BR-56 | Simulation Practices | 'Trainees' must be authenticated before accessing a simulation practice. |
| BR-57 | Simulation Practices | 'Trainees' can only start practices that are marked as 'Active' and are part of their assigned class. |
| BR-58 | Simulation Practices | 'Trainees' must complete all simulation steps in the specified Order. |
| BR-59 | Simulation Practices | While a 'Trainee' is taking a simulation practice:<br>- The system must display guides and step descriptions.<br>- The system must automatically advance to the next step upon successful completion of the current step.<br>- The system must record the result of every step for evaluation. |
| BR-60 | Simulation Practices | 'Trainees' cannot retake a simulation practice after reaching the Max Attempts limit. |

---

## 6) Prompt Rules for Copilot / Agent
### When generating UI components
- Always specify **module and file path.**
- Use only **React, Tailwind, and project components.**
- Do not call APIs inside components—use hooks.

**Example Prompt:**
```
You are Copilot for LSSCTC-WEB.
Create file src/modules/learner/pages/LearnerList.jsx:
- Use hook useLearners({page,pageSize})
- Show columns: Full Name, Email, Status, Actions
- Include simple pagination
- Use Tailwind for layout
- Add loading and error states
```

### When generating API client
```
Create src/modules/learner/api/learners.js:
- getLearners({page,pageSize}) -> GET /api/learners?page=&pageSize=
- getLearnerById(id) -> GET /api/learners/:id
- createLearner(payload) -> POST /api/learners
- Use http() and pass token
```

### When generating hook (React Query)
```
Create hook src/modules/learner/hooks/useLearners.js
- Use React Query to fetch data via getLearners()
- Cache key: ['learners', params]
- Return list, total, isLoading, error
```

---

## 7) UI/UX Standards
- Reusable UI components go to `src/components`.
- Every page must handle `loading`, `error`, and `empty` states.
- Responsive for desktop/tablet/mobile.
- Accessible forms (labels, aria tags).
- Use Tailwind classes, not inline styles.
- Use const { message } = App.useApp(); for message.
- Use lucide icons from `lucide-react` package for icons.

---

## 8) Error Handling Rules
| HTTP Code | Meaning | UI Behavior |
|------------|----------|--------------|
| 401 | Unauthorized | Redirect to `/login` |
| 403 | Forbidden | Show message: "You don't have permission." |
| 409 | Conflict | Show message (e.g., schedule conflict) |
| 422 | Validation | Show field-level error messages |

---

## 9) Definition of Ready / Done
**Definition of Ready (DoR)**
- Endpoint and schema known.
- Role and permission clear.
- UI state (loading, success, error) planned.

**Definition of Done (DoD)**
- Lint/build pass.
- Matches acceptance criteria.
- No new dependencies.
- Proper role guards.
- Has loading/error handling.

---

## 10) Prompt Template for Copilot
```
You are Copilot for LSSCTC-WEB (React + Vite + React Query + Tailwind).
Follow /.github/copilot/copilot_instructions.md.
AC:
- <paste acceptance criteria here>
Rules:
- Use http() for API calls.
- Get token from AuthContext.
- Use React Query for data fetching.
- Separate UI, hook, and API layers.
- Add loading/error state and role guard.
```

---

## 11) Example Workflow: Enroll Learner
- **Page:** `src/modules/enrollment/pages/EnrollPage.jsx`
- **Component:** `EnrollForm.jsx`
- **API:** `POST /api/enrollments`
- **Hook:** `useEnrollments()` and `useCreateEnrollment()`

### Flow
1. User selects a learner and course.
2. Submit POST request to enroll.
3. If success → toast + refresh list.
4. If conflict (409) → show schedule message.

---

## 12) Sync With Backend
- Always check the **Swagger API** before generating code.
- Never guess field names or payloads.
- If the schema changes, update API, mapper, and hooks.
- Run build and test after syncing.

---

## 13) Module Index Example
```js
// src/modules/enrollment/api/index.js
export * from './enrollments';
export * from './mappers';
```

---

**File Location:** `/.github/copilot/copilot_instructions.md`

> Keep this file and `introduction.md` in Copilot context so AI agents can generate code following LSSCTC standards.

