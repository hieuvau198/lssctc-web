// get learning materials by section id
// get quizzes by section id

// get practices by section id
// get quiz attempts by quiz id and trainee id
// get practice attempts by practice id and trainee id

const TRAINEE_API_BASE_URL =
  import.meta.env.VITE_API_Trainee_Service_URL || import.meta.env.VITE_API_Learner_Service_URL;

/**
 * Lấy danh sách quiz (có phân trang & tìm kiếm)
 * @param {Object} opts         
 * @param {number} opts.pageIndex
 * @param {number} opts.pageSize
 * @param {string} opts.search
 * @param {AbortSignal} [opts.signal]
 * @returns {Promise<{pageIndex:number,pageSize:number,total:number,items:any[]}>}
 */ 
export async function fetchQuizzes({
  pageIndex = 1,
  pageSize = 20,
  search = "",
  signal,
} = {}) {
  const params = new URLSearchParams({
    pageIndex: pageIndex.toString(),
    pageSize: pageSize.toString(),
  });
  if (search) params.set("search", search);

  const url = `${TRAINEE_API_BASE_URL}/Quizzes?${params.toString()}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Failed to fetch quizzes (${res.status} ${res.statusText}) ${text}`
    );
  }

  return res.json();
}

export async function fetchQuizBySectionQuizId(sectionQuizId) {
  const url = `${TRAINEE_API_BASE_URL}/Quizzes/by-section-quiz/${sectionQuizId}/trainee-view`;

   const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    }
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetchQuizById`
    );
  }

  return res.json();
}