import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, HelpCircle, CheckCircle, XCircle, RotateCcw, ArrowRight, Award } from 'lucide-react';
import { QuizQuestion } from '../../types';

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    type: 'code_to_city',
    question: 'What district does the German license plate code "DAH" stand for?',
    options: [
      { label: 'Dachau (Bayern)', value: 'Dachau' },
      { label: 'Darmstadt (Hessen)', value: 'Darmstadt' },
      { label: 'Dahme-Spreewald (Brandenburg)', value: 'Dahme-Spreewald' },
      { label: 'Dahn (Rheinland-Pfalz)', value: 'Dahn' },
    ],
    correctAnswer: 'Dachau',
    explanation: '"DAH" is the official Unterscheidungszeichen for Landkreis Dachau in Upper Bavaria (Oberbayern). Darmstadt uses "DA".',
  },
  {
    id: 'q2',
    type: 'special_type',
    question: 'What does a plate starting with "0 17-1" identify in Germany?',
    options: [
      { label: 'Official vehicle of the United States Ambassador', value: 'US_Ambassador' },
      { label: 'Federal Chancellor escort vehicle', value: 'Chancellor' },
      { label: 'NATO Supreme Allied Commander', value: 'NATO' },
      { label: 'Federal Constitutional Court President', value: 'Court' },
    ],
    correctAnswer: 'US_Ambassador',
    explanation: 'Plates starting with "0" are reserved for diplomatic missions. Country code "17" is assigned to the United States of America, and serial "1" indicates the Head of Mission (the Ambassador).',
  },
  {
    id: 'q3',
    type: 'special_type',
    question: 'Why was the distinctive "FE-Schrift" font specifically invented for German plates in 1995?',
    options: [
      { label: 'To make forgery virtually impossible (e.g. turning P into R or O into Q)', value: 'anti_forgery' },
      { label: 'To comply with French typography standards', value: 'french' },
      { label: 'To reduce stamping metal fatigue', value: 'metal' },
      { label: 'To save black paint during printing', value: 'paint' },
    ],
    correctAnswer: 'anti_forgery',
    explanation: 'FE stands for "Fälschungserschwerende Schrift" (forgery-hindering typeface). Its curves and gaps prevent altering letters with simple tape or black ink.',
  },
  {
    id: 'q4',
    type: 'special_type',
    question: 'Which military organization in Germany uses plates starting with the letter "Y"?',
    options: [
      { label: 'Bundeswehr (German Armed Forces)', value: 'Bundeswehr' },
      { label: 'Bavarian Border Police', value: 'Bavaria' },
      { label: 'Technisches Hilfswerk', value: 'THW' },
      { label: 'Federal Maritime Agency', value: 'Maritime' },
    ],
    correctAnswer: 'Bundeswehr',
    explanation: 'Bundeswehr military service vehicles uniquely use "Y-XXXXXX" plates and display the German national flag (Schwarz-Rot-Gold) rather than the EU blue strip.',
  },
  {
    id: 'q5',
    type: 'special_type',
    question: 'What does a yellow date block on the right edge of a German plate indicate?',
    options: [
      { label: 'Kurzzeitkennzeichen (5-day short-term transfer plate)', value: 'kurzzeit' },
      { label: 'Ausfuhrkennzeichen (export plate)', value: 'export' },
      { label: 'Electric vehicle charging priority', value: 'ev' },
      { label: 'Cabriolet seasonal registration', value: 'cabrio' },
    ],
    correctAnswer: 'kurzzeit',
    explanation: 'A yellow date band denotes a Kurzzeitkennzeichen, valid for max. 5 days for vehicle transfers and test drives. (Export plates use a red date band).',
  },
  {
    id: 'q6',
    type: 'special_type',
    question: 'What special privilege does an "H" suffix (Oldtimer) grant vehicles in Germany?',
    options: [
      { label: 'Permanent exemption from Low Emission Zones (Umweltzone) without green badge', value: 'umweltzone' },
      { label: 'Free motorway tolls across all Europe', value: 'toll' },
      { label: 'Unlimited speed on all municipal roads', value: 'speed' },
      { label: 'Free fuel tax refund', value: 'tax_free' },
    ],
    correctAnswer: 'umweltzone',
    explanation: 'Under § 23 StVZO, certified historic vehicles (H-Kennzeichen) can drive into all environmental low-emission zones without requiring a green emissions sticker.',
  },
  {
    id: 'q7',
    type: 'code_to_city',
    question: 'What does the historical district abbreviation "WAN" stand for?',
    options: [
      { label: 'Wanne-Eickel (Nordrhein-Westfalen)', value: 'Wanne-Eickel' },
      { label: 'Wangen im Allgäu (Baden-Württemberg)', value: 'Wangen' },
      { label: 'Wannsee (Berlin)', value: 'Wannsee' },
      { label: 'Wandlitz (Brandenburg)', value: 'Wandlitz' },
    ],
    correctAnswer: 'Wanne-Eickel',
    explanation: '"WAN" belonged to the former independent city of Wanne-Eickel and was enthusiastically re-introduced in 2012 following license plate liberalization!',
  },
  {
    id: 'q8',
    type: 'special_type',
    question: 'What is the maximum number of characters permitted on a standard German license plate?',
    options: [
      { label: '8 characters', value: '8' },
      { label: '7 characters', value: '7' },
      { label: '9 characters', value: '9' },
      { label: '10 characters', value: '10' },
    ],
    correctAnswer: '8',
    explanation: 'Under § 8 FZV, German plates are strictly limited to a maximum of 8 characters (including district, letters, digits, and suffix) to fit within standard 520mm dies.',
  },
  {
    id: 'q9',
    type: 'special_type',
    question: 'What do green numbers and letters on a German license plate indicate?',
    options: [
      { label: 'Exemption from German motor vehicle tax (KraftStG)', value: 'tax_exempt' },
      { label: 'Pure electric vehicle (zero emissions)', value: 'electric' },
      { label: 'Young driver under 21', value: 'young' },
      { label: 'Vehicle registered to the forestry department only', value: 'forestry' },
    ],
    correctAnswer: 'tax_exempt',
    explanation: 'Green plates (Grüne Kennzeichen) indicate tax-exempt status (§ 3 KraftStG), commonly granted to agricultural tractors, charities, and sports/boat trailers.',
  },
  {
    id: 'q10',
    type: 'special_type',
    question: 'Which of the following letter combinations is banned nationwide in Germany under § 8 Abs. 1 FZV?',
    options: [
      { label: 'HJ, KZ, NS, SA, and SS', value: 'nazi_symbols' },
      { label: 'BMW, AUDI, and VW', value: 'brands' },
      { label: 'USA, UK, and EU', value: 'countries' },
      { label: 'FBI, CIA, and BND', value: 'agencies' },
    ],
    correctAnswer: 'nazi_symbols',
    explanation: '§ 8 Abs. 1 FZV prohibits combinations violating public order or morality, strictly barring abbreviations of National Socialist organizations.',
  },
];

export const PlateQuiz: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (value: string) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(value);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    if (selectedAnswer === currentQ.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizCompleted(true);
      if (score >= 7) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizCompleted(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Quiz Progress & Card Header */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 md:p-8 backdrop-blur shadow-xl">
        {!quizCompleted ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-bold text-blue-400 tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}
              </span>
              <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-700">
                Score: <strong className="text-white">{score}</strong> / {QUIZ_QUESTIONS.length}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6 leading-snug">
              {currentQ.question}
            </h3>

            {/* Options list */}
            <div className="space-y-3 mb-6">
              {currentQ.options.map((opt) => {
                const isSelected = selectedAnswer === opt.value;
                const isCorrect = opt.value === currentQ.correctAnswer;

                let btnStyles = 'bg-slate-900/80 border-slate-700 text-slate-200 hover:border-slate-500';
                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    btnStyles = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md';
                  } else if (isSelected && !isCorrect) {
                    btnStyles = 'bg-red-950/80 border-red-500 text-red-200';
                  } else {
                    btnStyles = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60';
                  }
                } else if (isSelected) {
                  btnStyles = 'bg-blue-600/30 border-blue-500 text-white shadow-lg';
                }

                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelectOption(opt.value)}
                    disabled={isAnswerSubmitted}
                    className={`w-full text-left p-4 rounded-xl border-2 transition flex items-center justify-between font-medium text-sm md:text-base ${btnStyles}`}
                  >
                    <span>{opt.label}</span>
                    {isAnswerSubmitted && isCorrect && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback & Explanation */}
            {isAnswerSubmitted && (
              <div
                className={`p-4 rounded-xl border mb-6 text-sm ${
                  selectedAnswer === currentQ.correctAnswer
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                }`}
              >
                <strong className="block mb-1">
                  {selectedAnswer === currentQ.correctAnswer ? '🎉 Correct!' : '💡 Explanation:'}
                </strong>
                {currentQ.explanation}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              {!isAnswerSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition ${
                    selectedAnswer
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg'
                      : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Confirm Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition flex items-center gap-2 shadow-lg"
                >
                  {currentIdx + 1 < QUIZ_QUESTIONS.length ? 'Next Question' : 'View Results'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Results Screen */
          <div className="text-center py-6 space-y-6">
            <div className="w-20 h-20 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
              <Trophy className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-3xl font-extrabold text-white mb-2">Quiz Completed!</h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                {score >= 9
                  ? 'Outstanding! You have expert-level mastery of European license plates and legal regulations.'
                  : score >= 6
                  ? 'Great job! You know your way around German and European registration rules.'
                  : 'Good effort! Review the PlateRadar Knowledge Hub to level up your district and plate mastery.'}
              </p>
            </div>

            <div className="inline-block bg-slate-900 border border-slate-700 px-8 py-5 rounded-2xl">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-1">Final Score</span>
              <div className="text-4xl md:text-5xl font-black text-blue-400 font-mono">
                {score} <span className="text-2xl text-slate-500">/ {QUIZ_QUESTIONS.length}</span>
              </div>
            </div>

            <div>
              <button
                onClick={handleRestart}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition inline-flex items-center gap-2 shadow-lg"
              >
                <RotateCcw className="w-4 h-4" />
                Try Quiz Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
