/**
 * Mock data for Final Exam
 */

export const mockFinalExam = {
  id: 1,
  name: "Final Exam - Crane Operation Fundamentals",
  description: "Comprehensive assessment covering all topics from the Crane Operation Fundamentals course",
  date: "2025-12-15T09:00:00",
  duration: 60, // minutes
  totalQuestions: 20,
  passingScore: 70,
  openCode: "EXAM2025",
  instructions: [
    "Read each question carefully before answering",
    "You have 60 minutes to complete the exam",
    "Once submitted, you cannot change your answers",
    "Make sure to answer all questions before submitting",
  ],
};

export const mockExamQuestions = [
  {
    id: 1,
    questionText: "What is the maximum safe working load (SWL) for a crane rated at 10 tons?",
    options: [
      { id: "a", text: "8 tons" },
      { id: "b", text: "10 tons" },
      { id: "c", text: "12 tons" },
      { id: "d", text: "15 tons" },
    ],
    correctAnswer: "b",
  },
  {
    id: 2,
    questionText: "Before operating a crane, what is the FIRST step you should take?",
    options: [
      { id: "a", text: "Start the engine" },
      { id: "b", text: "Conduct a pre-operation inspection" },
      { id: "c", text: "Load the materials" },
      { id: "d", text: "Test the emergency stop" },
    ],
    correctAnswer: "b",
  },
  {
    id: 3,
    questionText: "What does a load chart indicate?",
    options: [
      { id: "a", text: "The crane's fuel consumption" },
      { id: "b", text: "The crane's lifting capacity at various boom lengths and angles" },
      { id: "c", text: "The crane's maintenance schedule" },
      { id: "d", text: "The crane's operating hours" },
    ],
    correctAnswer: "b",
  },
  {
    id: 4,
    questionText: "When should you use hand signals to communicate with a crane operator?",
    options: [
      { id: "a", text: "Only in emergency situations" },
      { id: "b", text: "When radio communication is unavailable or unreliable" },
      { id: "c", text: "Never, always use radio" },
      { id: "d", text: "Only during training" },
    ],
    correctAnswer: "b",
  },
  {
    id: 5,
    questionText: "What is the purpose of outriggers on a mobile crane?",
    options: [
      { id: "a", text: "To increase lifting speed" },
      { id: "b", text: "To provide stability and prevent tipping" },
      { id: "c", text: "To reduce fuel consumption" },
      { id: "d", text: "To protect the crane from weather" },
    ],
    correctAnswer: "b",
  },
  {
    id: 6,
    questionText: "What should you do if you notice a crack in the crane's boom?",
    options: [
      { id: "a", text: "Continue operating and report it later" },
      { id: "b", text: "Stop operations immediately and report to supervisor" },
      { id: "c", text: "Try to repair it yourself" },
      { id: "d", text: "Ignore it if it's small" },
    ],
    correctAnswer: "b",
  },
  {
    id: 7,
    questionText: "What is the recommended safe distance from power lines when operating a crane?",
    options: [
      { id: "a", text: "At least 3 meters" },
      { id: "b", text: "At least 6 meters" },
      { id: "c", text: "At least 10 meters" },
      { id: "d", text: "Distance doesn't matter" },
    ],
    correctAnswer: "c",
  },
  {
    id: 8,
    questionText: "What is 'two-blocking' in crane operations?",
    options: [
      { id: "a", text: "Using two cranes simultaneously" },
      { id: "b", text: "When the hook block contacts the boom tip" },
      { id: "c", text: "Operating in two shifts" },
      { id: "d", text: "Lifting two loads at once" },
    ],
    correctAnswer: "b",
  },
  {
    id: 9,
    questionText: "What weather condition is most dangerous for crane operations?",
    options: [
      { id: "a", text: "Light rain" },
      { id: "b", text: "Cloudy skies" },
      { id: "c", text: "High winds" },
      { id: "d", text: "Hot weather" },
    ],
    correctAnswer: "c",
  },
  {
    id: 10,
    questionText: "What is the purpose of a load moment indicator (LMI)?",
    options: [
      { id: "a", text: "To measure fuel levels" },
      { id: "b", text: "To warn operators when approaching overload conditions" },
      { id: "c", text: "To track operating hours" },
      { id: "d", text: "To control engine temperature" },
    ],
    correctAnswer: "b",
  },
  {
    id: 11,
    questionText: "How often should wire rope slings be inspected?",
    options: [
      { id: "a", text: "Once a year" },
      { id: "b", text: "Before each use" },
      { id: "c", text: "Once a month" },
      { id: "d", text: "Only when damaged" },
    ],
    correctAnswer: "b",
  },
  {
    id: 12,
    questionText: "What is the correct procedure for emergency stop activation?",
    options: [
      { id: "a", text: "Push the emergency stop button immediately" },
      { id: "b", text: "Finish the current lift first" },
      { id: "c", text: "Notify supervisor before stopping" },
      { id: "d", text: "Slowly reduce speed first" },
    ],
    correctAnswer: "a",
  },
  {
    id: 13,
    questionText: "What personal protective equipment (PPE) is mandatory for crane operators?",
    options: [
      { id: "a", text: "Hard hat and safety vest only" },
      { id: "b", text: "Hard hat, safety vest, and steel-toed boots" },
      { id: "c", text: "Just safety vest" },
      { id: "d", text: "No PPE required in the operator cabin" },
    ],
    correctAnswer: "b",
  },
  {
    id: 14,
    questionText: "What is the primary cause of crane-related accidents?",
    options: [
      { id: "a", text: "Equipment failure" },
      { id: "b", text: "Poor weather" },
      { id: "c", text: "Human error" },
      { id: "d", text: "Overloading" },
    ],
    correctAnswer: "c",
  },
  {
    id: 15,
    questionText: "When should anti-two-block devices be tested?",
    options: [
      { id: "a", text: "Weekly" },
      { id: "b", text: "At the beginning of each shift" },
      { id: "c", text: "Monthly" },
      { id: "d", text: "Annually" },
    ],
    correctAnswer: "b",
  },
  {
    id: 16,
    questionText: "What is the safe approach for lifting loads near ground personnel?",
    options: [
      { id: "a", text: "Lift quickly to minimize time overhead" },
      { id: "b", text: "Ensure all personnel are clear before lifting" },
      { id: "c", text: "Personnel can stand under loads if wearing hard hats" },
      { id: "d", text: "No special precautions needed" },
    ],
    correctAnswer: "b",
  },
  {
    id: 17,
    questionText: "What does OSHA stand for in the context of crane safety?",
    options: [
      { id: "a", text: "Occupational Safety and Health Administration" },
      { id: "b", text: "Operating Standards and Handling Authority" },
      { id: "c", text: "Operator Safety and Height Association" },
      { id: "d", text: "Overhead Safety and Hoisting Administration" },
    ],
    correctAnswer: "a",
  },
  {
    id: 18,
    questionText: "What is the minimum ground bearing pressure consideration for crane setup?",
    options: [
      { id: "a", text: "Soil must be able to support the crane's weight plus load" },
      { id: "b", text: "Any ground is suitable" },
      { id: "c", text: "Only concrete surfaces are acceptable" },
      { id: "d", text: "Ground pressure is not important" },
    ],
    correctAnswer: "a",
  },
  {
    id: 19,
    questionText: "What should be done if the load starts to swing during lifting?",
    options: [
      { id: "a", text: "Continue lifting faster" },
      { id: "b", text: "Stop all motion and allow load to stabilize" },
      { id: "c", text: "Lower immediately" },
      { id: "d", text: "Ignore minor swinging" },
    ],
    correctAnswer: "b",
  },
  {
    id: 20,
    questionText: "How should crane operators respond to poor visibility conditions?",
    options: [
      { id: "a", text: "Continue with extra caution" },
      { id: "b", text: "Use spotters and reduce speed" },
      { id: "c", text: "Stop operations until visibility improves" },
      { id: "d", text: "Turn on all lights and continue" },
    ],
    correctAnswer: "c",
  },
];

export default {
  mockFinalExam,
  mockExamQuestions,
};
