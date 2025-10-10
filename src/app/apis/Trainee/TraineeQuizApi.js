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

//#endregion

//#region Quiz APIs

export const getQuizWithoutAnswers = async (quizId) => {
  try {
    const response = await api.get(`/Quizzes/${quizId}/no-answer`);
    return mapQuiz(response.data);
  } catch (error) {
    console.error("❌ Error fetching quiz without answers:", error);
    throw error;
  }
};

//#endregion
