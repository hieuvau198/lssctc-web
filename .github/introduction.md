# Hướng dẫn sử dụng GitHub Copilot & Agent cho dự án **LSSCTC‑WEB**

> Mục tiêu: để Copilot/Agent hiểu đúng kiến trúc, thư viện đang dùng và **sinh code đúng chuẩn dự án**. Tài liệu này bổ sung cho file `introduction.md` hiện có.

---

## 0) Nguyên tắc chung
- **Không thêm thư viện mới** trừ khi được yêu cầu rõ trong prompt. Luôn ưu tiên thư viện sẵn có của dự án.
- **Giữ nguyên cấu trúc thư mục** hiện có; tạo file mới đúng vị trí được quy định ở mục 2.
- **Code tiếng Anh, comment ngắn gọn**; commit message dạng `feat: ...`, `fix: ...`, `refactor: ...`.
- **Type an toàn**: với JS hiện tại, dùng JSDoc và PropTypes (nếu cần). Nếu chuyển sang TS, tuân thủ `strict`.
- **Không hard‑code URL/API** – luôn dùng biến môi trường và helper đã định nghĩa.

---

## 1) Tech stack & ràng buộc
- **Build tool:** Vite
- **UI:** React 18, TailwindCSS; có thể dùng các component sẵn có trong `src/components`.
- **Routing:** TanStack Router (ưu tiên); nếu hiện tại đang ở React Router, giữ nguyên theo code base.
- **Data fetching:** SWR (ưu tiên) hoặc fetch wrapper của dự án.
- **State:** Context + hooks cục bộ (`src/contexts`, `src/hooks`).
- **Auth:** JWT Bearer; lưu token an toàn (memory/`localStorage` tùy vào code base).
- **Lint:** `eslint.config.js` trong repo; tuyệt đối theo rule.

---

## 2) Quy ước thư mục (bắt buộc Copilot tuân thủ)
```
src/
  app/            # entry, assets, layouts, pages
  assets/         # ảnh, svg, font
  components/     # UI tái sử dụng (không gọi API trực tiếp)
  contexts/       # React Context (AuthProvider, ThemeProvider...)
  hooks/          # hooks dùng chung (useAuth, useSWRTyped...)
  layouts/        # shell layout, header/footer
  modules/        # mỗi module gắn với nghiệp vụ (Learner, Course, Schedule, Exam...)
    <Module>/
      api/        # hàm gọi API, schema, mapper
      components/ # component đặc thù module
      pages/      # trang của module (route‑level)
      hooks/      # hooks đặc thù module
      types/      # kiểu dữ liệu (JSDoc/TS dần)
  pages/          # (nếu còn) trang legacy – dần migrate sang modules
  routes/         # khai báo route
  styles/         # css/tailwind
```

**Quy tắc tạo mới:**
- Trang mới → đặt trong `src/modules/<Module>/pages/*` và **khai báo route** ở `src/routes`.
- API client mới → `src/modules/<Module>/api/*` và **chỉ export hàm thuần** (không side‑effect).
- Hook mới → `src/modules/<Module>/hooks/*`, dùng SWR và gọi API thông qua layer `api`.

---

## 3) Kết nối Backend (repo **lssctc-api**)
- **Base URL**: lấy từ `.env` qua `import.meta.env.VITE_API_BASE_URL` (ví dụ `https://api.example.com`).
- **Auth Header**: `Authorization: Bearer <token>` – token lấy từ `AuthContext`.
- **Chuẩn API** (tham chiếu microservices):
  - `IdentityService`: `/api/auth/login`, `/api/auth/refresh`, `/api/users`, `/api/roles`
  - `LearnerService`: `/api/learners`, `/api/courses`, `/api/enrollments`, `/api/assessments`
  - `Schedule/Session`: `/api/schedules`, `/api/sessions`
  - `Simulator`: `/api/scenarios`, `/api/simulator-configs`

> **Lưu ý:** Endpoint cụ thể có thể khác; khi không chắc, **đọc swagger của BE**. Không tự suy diễn field – luôn map theo schema BE trả về.

### 3.1 Mẫu API client (dùng fetch + helper)
```js
// src/lib/http.js
export async function http(path, { method = 'GET', body, token, headers } = {}) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}${path}`.replace(/\/+/g, '/'), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });
  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(err?.message || `HTTP ${res.status}`);
  }
  return safeJson(res);
}

async function safeJson(res) {
  try { return await res.json(); } catch { return null; }
}
```

```js
// src/modules/learner/api/learners.js
import { http } from '@/lib/http';

export function getLearners({ page = 1, pageSize = 20 } = {}, token) {
  const q = new URLSearchParams({ page, pageSize });
  return http(`/api/learners?${q.toString()}`, { token });
}

export function getLearnerById(id, token) {
  return http(`/api/learners/${id}`, { token });
}

export function createLearner(payload, token) {
  return http(`/api/learners`, { method: 'POST', body: payload, token });
}
```

### 3.2 Mẫu hook SWR
```js
// src/modules/learner/hooks/useLearners.js
import useSWR from 'swr';
import { getLearners } from '../api/learners';
import { useAuth } from '@/contexts/AuthContext';

export function useLearners(params) {
  const { token } = useAuth();
  const key = token ? ['learners', params] : null;
  const fetcher = () => getLearners(params, token);
  const { data, error, isLoading, mutate } = useSWR(key, fetcher, { revalidateOnFocus: false });
  return {
    list: data?.items ?? [],
    total: data?.total ?? 0,
    isLoading,
    error,
    refresh: mutate,
  };
}
```

---

## 4) Nghiệp vụ cốt lõi (trích từ tài liệu yêu cầu)
> **Nguồn nghiệp vụ:** Tài liệu mô tả MSSCT (được cung cấp trên Google Docs). Dưới đây là **xương sống** để Copilot bám theo khi sinh code UI/API. Nếu BE/Doc khác, ưu tiên BE.

### 4.1 Vai trò & phân quyền
- **Admin**: quản trị hệ thống, user, vai trò.
- **Instructor**: tạo/lên lịch buổi học, gán bài tập mô phỏng, chấm điểm.
- **Learner**: xem lịch, làm bài mô phỏng, xem kết quả/feedback.
- **Simulator Manager**: quản lý kịch bản/môi trường mô phỏng, cấu hình simulator.

### 4.2 Các module chính
1) **User/Identity**  
   - CRUD người dùng, gán vai trò, reset mật khẩu.  
   - UI: bảng danh sách, form tạo/sửa, phân trang, tìm kiếm.

2) **Learner**  
   - Hồ sơ học viên (dob, status), danh sách khóa học đã/đang học.  
   - Ghi nhận tiến độ, kết quả bài kiểm tra.

3) **Course/Enrollment**  
   - Catalog khóa học, syllabus, đăng ký/huỷ đăng ký.  
   - Instructor gán learner vào lớp.

4) **Schedule/Session**  
   - Lên lịch buổi học (offline/simulator), chống đè lịch.  
   - Learner xem lịch cá nhân; ICS export (tương lai).

5) **Assessment**  
   - Bộ tiêu chí chấm điểm thao tác cần cẩu; rubric theo kịch bản.  
   - Nhập điểm, feedback; báo cáo theo buổi/khóa/học viên.

6) **Simulator/Scenario**  
   - Danh sách kịch bản mô phỏng (seaport, container yard, v.v.).  
   - Cấu hình tham số: môi trường, cần cẩu, giới hạn an toàn.

**Yêu cầu phi chức năng (front‑end liên quan):**
- Trang phải **phản hồi < 2s** với dữ liệu chuẩn.
- UI **60 FPS** cho thao tác tương tác nặng (bảng lớn, map 3D preview nếu có – lazy load).  
- Truy cập an toàn (XSS, CSRF – dùng `credentials: 'include'` khi cần).  

---

## 5) Quy tắc Prompt cho Copilot/Agent (rất quan trọng)

### 5.1 Khi yêu cầu sinh code UI
- **Luôn nêu module & vị trí file rõ ràng.**  
  *Ví dụ:* “Tạo `src/modules/learner/pages/LearnerList.jsx` – bảng learners có cột `fullName`, `email`, `status`, phân trang; dùng hook `useLearners`.”
- **Chỉ import từ lib có sẵn**: React, Tailwind, components nội bộ.
- **Tách API ra khỏi component** (dùng layer `api`).

**Prompt mẫu:**
```
Bạn là Copilot cho dự án LSSCT‑WEB. Hãy tạo file src/modules/learner/pages/LearnerList.jsx:
- Dùng hook useLearners({page, pageSize})
- Bảng có cột: #, Full name, Email, Status, Actions (View)
- Thanh phân trang đơn giản (Prev/Next)
- Không thêm thư viện mới
- Viết component thuần, có loading & error state
```

### 5.2 Khi yêu cầu sinh hook/API
```
Tạo các hàm API trong src/modules/learner/api/learners.js:
- getLearners({page,pageSize}) -> GET /api/learners?page=&pageSize=
- getLearnerById(id) -> GET /api/learners/:id
- createLearner(payload) -> POST /api/learners
Nhớ dùng http() từ src/lib/http và nhận token từ AuthContext ở hook sử dụng.
```

### 5.3 Khi yêu cầu form nhập liệu
- Dùng controlled inputs, validate cơ bản phía client.
- Không đưa logic quyền vào UI – quyền hiển thị lấy từ **role trong AuthContext**.

---

## 6) Auth & Guard
- `AuthContext` phải cấp: `{ user, roles, token, login(), logout() }`.
- Route bảo vệ: **nếu chưa đăng nhập → redirect to /login**.
- Guard theo role: ví dụ `Instructor` mới thấy menu chấm điểm.

---

## 7) UI/UX tiêu chuẩn
- Component tái sử dụng đặt ở `src/components` (Button, Table, Modal...).
- Loading state skeleton/spinner; Error state hiển thị message từ API.
- Form: có `aria-*` và label; hỗ trợ keyboard.
- i18n (nếu dùng): đặt key rõ nghĩa, không nối chuỗi trong JSX.
- UI dựa theo trang web https://www.coursera.org/ làm mẫu.
- Không dùng inline style, chỉ dùng TailwindCSS hoặc className.
- Trang web responsive (desktop + tablet + mobile tối thiểu).

---

## 8) Kiểm thử nhanh & chất lượng
- Với logic thuần (mapper/formatter): viết unit test (nếu jest/vitest đã bật).  
- E2E (có thể thêm sau với Playwright/Cypress – **không tự ý cài** nếu chưa có quyết định).
- Mỗi component thành phần không dài quá 250 dòng.

---

## 9) Checklist trước khi tạo PR
- [ ] Không thêm dependency mới  
- [ ] API gọi qua `http()` + dùng `VITE_API_BASE_URL`  
- [ ] Component không tự gọi API (trừ khi là page/hook)  
- [ ] Loading/Error state đầy đủ  
- [ ] Lint pass & build pass  
- [ ] Viết docs ngắn ở đầu file nếu logic đặc biệt

---

## 10) Roadmap gợi ý cho Copilot (ưu tiên thực thi)
1. Thiết lập `src/lib/http.js` (nếu chưa có).  
2. Tạo `AuthContext` + hook `useAuth`.  
3. Thiết lập route login/protected routes.  
4. Module Learner: API + hook + page List/Detail/Create.  
5. Module Course/Enrollment: List + Enroll/Unenroll.  
6. Module Schedule: Calendar/List, tránh trùng lịch (client hint).  
7. Module Assessment: nhập điểm + xem báo cáo cơ bản.  
8. Module Simulator: CRUD scenario & cấu hình.

---

## 11) Phần dành cho Contri/Agent
- Khi **không chắc schema** → hỏi lại hoặc đọc swagger của BE, **đừng tự thêm field**.
- Khi gặp lỗi nhập/xuất ngày giờ → chuẩn `UTC` từ BE, client format theo locale.
- Tôn trọng **status code**: 401 → logout; 403 → chặn UI; 422/400 → hiện lỗi form.

---

### Appendix: Template component (tham khảo)
```jsx
// src/modules/learner/pages/LearnerList.jsx
import { useState } from 'react';
import { useLearners } from '../hooks/useLearners';

export default function LearnerList() {
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const { list, total, isLoading, error } = useLearners({ page, pageSize });

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{String(error.message || 'Error')}</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-3">Learners</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 pr-4">#</th>
              <th className="py-2 pr-4">Full name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((it, idx) => (
              <tr key={it.id} className="border-b hover:bg-gray-50">
                <td className="py-2 pr-4">{(page - 1) * pageSize + idx + 1}</td>
                <td className="py-2 pr-4">{it.fullName}</td>
                <td className="py-2 pr-4">{it.email}</td>
                <td className="py-2 pr-4">{it.status}</td>
                <td className="py-2 pr-4"><a href={`/learners/${it.id}`} className="underline">View</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex gap-2">
        <button disabled={page===1} onClick={() => setPage(p => Math.max(1, p-1))} className="px-3 py-1 border rounded">Prev</button>
        <button disabled={page*pageSize >= total} onClick={() => setPage(p => p+1)} className="px-3 py-1 border rounded">Next</button>
      </div>
    </div>
  );
}
```

---

**Gợi ý đặt file:** `/.github/copilot/COPILOT_GUIDE.md` (thư mục đã tồn tại).  
Khi mở VS Code Agent, thêm file này và `introduction.md` vào *context* để Agent bám sát chuẩn.



---

# 12) Hướng dẫn để Copilot **generate code đúng nghiệp vụ** (Business‑Driven)
> Mục tiêu phần này: biến **yêu cầu nghiệp vụ** thành **prompt + cấu trúc file cụ thể** để Copilot sinh đúng code, đúng flow, đúng ràng buộc.

## 12.1 Nguyên tắc chuyển hóa nghiệp vụ → code
1. **Luôn bám theo Swagger của BE** để quyết định endpoint, tham số, và schema trả về. Nếu chưa rõ: hỏi lại/đọc Swagger, **không suy diễn field**.
2. **Tách 3 lớp rõ ràng:** UI (component/page) ↔ hook (data logic) ↔ API client (HTTP).  
3. **Đóng gói nghiệp vụ theo module** (Learner, Course, Enrollment, Schedule, Assessment, Simulator).  
4. **Mọi màn hình đều kèm Acceptance Criteria (AC)** dưới dạng checklist comment ở đầu file.
5. **Ràng buộc quyền** (role/permission) là một phần của nghiệp vụ: ẩn/khóa các action không đủ quyền.

**Template AC (đặt đầu file):**
```md
/**
AC: Learner Enroll
- [ ] Chỉ user role Instructor/Admin thấy nút Enroll
- [ ] Submit POST /api/enrollments { learnerId, courseId, scheduleId? }
- [ ] Hiển thị lỗi 409 nếu trùng lịch hoặc đã đăng ký
- [ ] Cập nhật danh sách mà không reload trang (mutate SWR)
- [ ] Track loading + disable button khi đang gửi
*/
```

## 12.2 Thư viện Use‑case (mẫu cụ thể)
### A) **Quản lý Learner**
**List**  
- Endpoint: `GET /api/learners?page=&pageSize=&q?`  
- Vai trò: Admin/Instructor  
- Cột tối thiểu: `fullName`, `email`, `status`, `enrolledCount`  
- Hành động: View, Edit (role‑guard)

**Detail**  
- Endpoint: `GET /api/learners/{id}` + `GET /api/enrollments?learnerId=`  
- Tab: Profile | Courses | Assessments  
- Cho phép **Deactivate/Activate** (PATCH) nếu role là Admin.

**Create/Update**  
- Validate: email hợp lệ, `status ∈ {active,inactive,suspended}`  
- Lỗi 422: hiển thị message từng field.

### B) **Course & Enrollment**
**Course List/Detail**  
- `GET /api/courses` | `GET /api/courses/{id}`  
- Chi tiết hiển thị syllabus ngắn, số Learner đang học.

**Enroll Learner**  
- `POST /api/enrollments { learnerId, courseId }`  
- BE có thể chặn trùng lịch ở Session; nếu trả `409 Conflict`, show toast: *“Learner bị trùng lịch. Chọn phiên khác.”*

**Unenroll**  
- `DELETE /api/enrollments/{id}` → xác nhận trước khi xóa; refresh danh sách liên quan.

### C) **Schedule / Session**
**Create Session**  
- `POST /api/sessions { courseId, startAt, endAt, location, type }`  
- Ràng buộc: `startAt < endAt`, không overlap trong cùng phòng/máy (409 nếu trùng).  
- UI: date‑time picker, auto tính duration.

**Assign Learner to Session**  
- `POST /api/sessions/{id}/attendees { learnerId }`  
- Chỉ Instructor/Admin; check số lượng tối đa.

### D) **Assessment**
**Input Score**  
- `POST /api/assessments { learnerId, sessionId, rubricItemScores[] }`  
- Ràng buộc: rubric từ BE; tổng điểm/tỉ trọng do BE kiểm soát.  
- UI: bảng tiêu chí, autosave (debounce) → `PATCH`.

### E) **Simulator / Scenario**
**Scenario CRUD**  
- `GET/POST/PATCH/DELETE /api/scenarios`  
- Trường phổ biến: `name`, `map`, `craneType`, `safetyLimits` (đọc từ Swagger).  
- Chỉ Simulator Manager/Admin mới CRUD.

> **Lưu ý:** Tên endpoint chỉ là khung; **phải đối chiếu repo BE** để map chính xác.

## 12.3 Prompt mẫu cho Copilot theo nghiệp vụ
**1) Sinh trang danh sách theo AC**
```
Bạn là Copilot cho LSSCTC‑WEB. Hãy tạo file src/modules/learner/pages/LearnerList.jsx với AC sau:
- List learners dùng useLearners({page,pageSize,q})
- Cột: Full name, Email, Status, Enrolled
- Ô search q (debounce 400ms)
- Role Admin/Instructor mới thấy nút "Create"
- Không thêm thư viện ngoài
- API gọi qua layer api + http()
```

**2) Sinh form Enroll theo AC**
```
Tạo component src/modules/enrollment/components/EnrollForm.jsx:
AC:
- Select learner, select course (fetch options bằng SWR)
- Submit POST /api/enrollments { learnerId, courseId }
- Loading state + disabled nút
- Nếu 409: hiển thị thông báo trùng lịch
- Thành công: gọi onSuccess() và reset form
```

**3) Sinh hook dữ liệu chuẩn hóa**
```
Tạo hook src/modules/assessment/hooks/useRubric.js:
- GET /api/assessments/rubric?scenarioId=...
- Trả { items, totalWeight } đã map sẵn cho UI
- Cache bằng SWR key ['rubric', scenarioId]
```

## 12.4 Quy ước mapping dữ liệu (DTO)
- **UI Model** chỉ chứa field cần hiển thị/nhập.  
- **Mapper**: `src/modules/<Module>/api/mappers.js`  
```js
export const mapLearner = (r) => ({
  id: r.id,
  fullName: r.fullName || `${r.firstName} ${r.lastName}`,
  email: r.email,
  status: r.status,
  enrolledCount: r.enrolledCount ?? 0,
});
```
- Không đổi tên field khi **submit** – gửi đúng tên BE yêu cầu.

## 12.5 Guard & Visibility theo vai trò
- Dùng `useAuth()` cung cấp `roles` và `can(permission)` nếu có.  
- Ẩn nút hành động nếu không đủ quyền; không chỉ disable.

```jsx
{roles.includes('Instructor') && (
  <button onClick={openEnroll}>Enroll</button>
)}
```

## 12.6 Lỗi & trạng thái đặc biệt
- **401**: logout + điều hướng `/login`.
- **403**: hiển thị *“Bạn không có quyền thực hiện hành động này.”*
- **409**: trùng lịch/điều kiện nghiệp vụ – hiển thị thông báo rõ ràng.
- **422**: hiển thị lỗi theo field.

## 12.7 Definition of Ready (DoR) cho task nghiệp vụ
- [ ] Có AC rõ ràng  
- [ ] Biết endpoint + schema  
- [ ] Biết role nào thực hiện  
- [ ] Biết state chuyển đổi (loading, success, error)

## 12.8 Definition of Done (DoD)
- [ ] Pass lint/build  
- [ ] UI/UX theo chuẩn  
- [ ] Đúng AC + role‑guard  
- [ ] Không thêm dependency  
- [ ] Có test/case tối thiểu cho mapper/formatter (nếu có)

---

# 13) Bản nhắc (boilerplate) để dán vào prompt Copilot
```
Bạn là Copilot của dự án LSSCTC‑WEB (React + Vite + SWR + Tailwind). 
Bám sát file /.github/copilot/COPILOT_GUIDE.md và không thêm thư viện mới.
Sinh code theo cấu trúc module.
AC của task:
- <dán AC cụ thể ở đây>
Ràng buộc:
- Endpoint, payload, response theo Swagger của lssctc-api
- Dùng http() và AuthContext để lấy token
- Tách UI ↔ hook ↔ api; không side‑effect ngoài module
- Viết component tối ưu, có loading/error state, role‑guard
```

---

# 14) Ví dụ end‑to‑end: **Enroll Learner vào Course**
- Page: `src/modules/enrollment/pages/EnrollPage.jsx`  
- Thành phần: `EnrollForm` (chọn learner + course)  
- API: `POST /api/enrollments`  
- Hook: `useEnrollments` (list), `useCreateEnrollment` (mutation)  
- Luồng: submit → loading → 201 OK → toast success → `mutate()` list → điều hướng về Learner Detail.

---

# 15) Ghi chú đồng bộ với Backend
- Khi BE đổi schema/endpoint, cập nhật: `api/*`, mapper, và AC liên quan.  
- Luôn chạy lại build + smoke test UI (create/read/update một item) sau khi đồng bộ.

---

# 16) Phụ lục: Mẫu file index module
```js
// src/modules/enrollment/api/index.js
export * from './enrollments';
export * from './mappers';
```

