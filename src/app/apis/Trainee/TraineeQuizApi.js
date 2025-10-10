// src/app/apis/Trainee/TraineeQuizApi.js

import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_Program_Service_URL; // e.g. https://localhost:7212/api

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { Accept: "*/*" },
});

//#region Mapping Functions

const mapQuizOption = (item) => ({
  id: item.id,
  quizQuestionId: item.quizQuestionId,
  description: item.description,
  displayOrder: item.displayOrder,
  optionScore: item.optionScore,
  name: item.name,
});

const mapQuizQuestion = (item) => ({
  id: item.id,
  quizId: item.quizId,
  name: item.name,
  questionScore: item.questionScore,
  description: item.description,
  isMultipleAnswers: item.isMultipleAnswers,
  options: item.options ? item.options.map(mapQuizOption) : [],
});

const mapQuiz = (item) => ({
  id: item.id,
  name: item.name,
  passScoreCriteria: item.passScoreCriteria,
  timelimitMinute: item.timelimitMinute,
  totalScore: item.totalScore,
  description: item.description,
  questions: item.questions ? item.questions.map(mapQuizQuestion) : [],
});

const mapQuizResult = (item) => ({
  sectionQuizId: item.sectionQuizId,
  quizId: item.quizId,
  learningRecordPartitionId: item.learningRecordPartitionId,
  sectionQuizAttemptId: item.sectionQuizAttemptId,
  quizName: item.quizName,
  passScoreCriteria: item.passScoreCriteria,
  timelimitMinute: item.timelimitMinute,
  totalScore: item.totalScore,
  description: item.description,
  isCompleted: item.isCompleted,
  attemptScore: item.attemptScore,
  lastAttemptIsPass: item.lastAttemptIsPass,
  lastAttemptDate: item.lastAttemptDate,
});

export const mapQuizAttempt = (quizId, sectionQuizId, answers) => ({
  quizId,
  sectionQuizId,
  answers: answers.map((answer) => ({
    questionId: answer.questionId,
    selectedOptionIds: Array.isArray(answer.selectedOptionIds)
      ? answer.selectedOptionIds
      : [answer.selectedOptionIds], // ensure it's an array
  })),
});

//#endregion

//#region Quiz APIs

export const getQuizWithoutAnswers = async (quizId) => {
  try {
    const response = await api.get(`/Quizzes/${quizId}/no-answer`);
    return mapQuiz(response.data);
  } catch (error) {
    console.error("Error fetching quiz without answers:", error);
    throw error;
  }
};

export const submitSectionQuizAttempt = async (partitionId, traineeId, attemptData) => {
  try {
    const response = await api.post(
      `/Learnings/sectionquizzes/${partitionId}/trainee/${traineeId}/submit`,
      attemptData
    );
    return mapQuizResult(response.data);
  } catch (error) {
    console.error("Error submitting section quiz attempt:", error);
    throw error;
  }
};

//#endregion
