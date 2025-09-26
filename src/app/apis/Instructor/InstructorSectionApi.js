// get learning material by section id
// get learning material by section partition id
// upload learning material
// assign learning material to section partition
// unassign learning material from section partition
// create quiz
// get quizzes by section id

// get quizzes by section partition id
// assign quiz to section partition
// unassign quiz from section partition
// get practices
// get practices by section id
// get practices by section partition id
// assign practice to section partition
// unassign practice from section partition
const INSTRUCTOR_API_BASE_URL = import.meta.env.VITE_API_Learner_Service_URL;

export async function createQuizQuestion(quizId, payload) {
  const res = await fetch(`${INSTRUCTOR_API_BASE_URL}/Quizzes/${quizId}/questions-with-options`, {
    method: "POST",
    headers: { "Content-Type": "application/json", accept: "*/*" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Create question failed");
  }
  return res.json().catch(() => ({}));
}

// Lấy tất cả quizzes (có paging & search)
export async function getAllQuizzes({ page, pageSize, search } = {}) {
  const q = new URLSearchParams();
  // API expects pageIndex, not page
  if (page != null) q.append("pageIndex", page);
  if (pageSize != null) q.append("pageSize", pageSize);
  if (search) q.append("search", search);
  const url = `${INSTRUCTOR_API_BASE_URL}/Quizzes${q.toString() ? `?${q.toString()}` : ""}`;

  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Get quizzes failed");
  }
  return res.json();
}

// Thêm hàm deleteQuiz dùng chung
export async function deleteQuiz(id) {
  const res = await fetch(`${INSTRUCTOR_API_BASE_URL}/Quizzes/${id}`, {
    method: "DELETE",
    headers: { accept: "application/json" }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Delete quiz failed");
  }
  return res.text?.() ?? "OK";
}

// Thêm hàm get quiz by ID (cho preview/edit)
export async function getQuizById(id) {
  const res = await fetch(`${INSTRUCTOR_API_BASE_URL}/Quizzes/${id}`, {
    headers: { accept: "application/json" }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Get quiz failed");
  }
  return res.json();
}

// Thêm hàm create quiz
export async function createQuiz(payload) {
  if (!payload?.name) throw new Error("name is required");

  const res = await fetch(`${INSTRUCTOR_API_BASE_URL.replace(/\/+$/, "")}/Quizzes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(errText || `Create quiz failed (HTTP ${res.status})`);
  }

  // Thử đọc body (có thể rỗng)
  let data = null;
  try {
    const raw = await res.text();
    if (raw) data = JSON.parse(raw);
  } catch {
    // bỏ qua nếu parse fail
  }

  if (!data) {
    // Lấy id từ Location header
    const loc = res.headers.get("Location") || res.headers.get("location");
    if (loc) {
      const m = loc.match(/\/Quizzes\/(\d+)(?:$|[/?#])/i);
      const id = m ? parseInt(m[1], 10) : undefined;
      if (id) {
        try {
          // cố gắng fetch lại object đầy đủ
            data = await getQuizById(id);
        } catch {
          data = { id, ...payload };
        }
      } else {
        data = { ...payload };
      }
    } else {
      data = { ...payload };
    }
  }

  return data;
}

// Thêm hàm update quiz
export async function updateQuiz(id, payload) {
  const res = await fetch(`${INSTRUCTOR_API_BASE_URL}/Quizzes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", accept: "*/*" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Update quiz failed");
  }
  return res.json().catch(() => ({}));
}

