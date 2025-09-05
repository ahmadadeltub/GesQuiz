import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockDbService } from '../services/mockDbService';
import { Quiz, QuizAttempt, Question, QuestionType, AnswerRecord } from '../types';
import { Spinner } from '../components/common/Spinner';

// Icon components for visual feedback
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const XCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const InfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>;


export const QuizReviewPage: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (attemptId) {
      const foundAttempt = mockDbService.getAttemptById(attemptId);
      if (foundAttempt) {
        const foundQuiz = mockDbService.getQuizById(foundAttempt.quizId);
        setAttempt(foundAttempt);
        setQuiz(foundQuiz || null);
      }
    }
    setIsLoading(false);
  }, [attemptId]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Spinner size="lg" /></div>;
  }

  if (!attempt || !quiz) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-red-600">Attempt not found</h1>
        <p className="text-gray-600">Could not find the quiz results you were looking for.</p>
        <button onClick={() => navigate('/student')} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto p-4 md:p-8">
            <header className="bg-white p-6 rounded-xl shadow-lg mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">{quiz.title} - Results</h1>
                <p className="text-gray-600">
                    Completed on {new Date(attempt.completedAt).toLocaleDateString()}
                </p>
                <div className="mt-4 border-t pt-4 flex items-center justify-between">
                     <p className="text-2xl font-bold text-blue-600">
                        Final Score: {attempt.score} / {attempt.maxScore}
                    </p>
                     <button onClick={() => navigate('/student')} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
                        Back to Dashboard
                    </button>
                </div>
            </header>

            <div className="space-y-6">
                {quiz.questions.map((question, index) => {
                    const answerRecord = attempt.answers.find(a => a.questionId === question.id);
                    if (!answerRecord) {
                        return (
                             <div key={question.id} className="bg-white p-6 rounded-lg shadow-md">
                                <p className="font-semibold text-lg text-gray-800 mb-4">{index + 1}. {question.questionText}</p>
                                <p className="text-gray-500 italic">This question was not answered.</p>
                            </div>
                        );
                    }

                    return (
                         <div key={question.id} className="bg-white p-6 rounded-lg shadow-md">
                            <p className="font-semibold text-lg text-gray-800 mb-4">{index + 1}. {question.questionText}</p>
                            
                            {(question.type === QuestionType.MULTIPLE_CHOICE || question.type === QuestionType.TRUE_FALSE) && (
                                <div className="space-y-3">
                                    {question.options?.map((option, optIndex) => {
                                        const isSelected = answerRecord.selectedAnswerIndex === optIndex;
                                        const isCorrect = question.correctAnswerIndex === optIndex;
                                        let stateClass = 'bg-gray-100 border-gray-200';
                                        
                                        if(isCorrect) {
                                            stateClass = 'bg-green-100 border-green-300 text-green-900';
                                        }
                                        if (isSelected && !isCorrect) {
                                            stateClass = 'bg-red-100 border-red-300 text-red-900';
                                        }

                                        return(
                                            <div key={optIndex} className={`flex items-center p-3 border-2 rounded-lg ${stateClass}`}>
                                                <div className="font-mono mr-4">{String.fromCharCode(65 + optIndex)}</div>
                                                <div className="flex-grow">{option}</div>
                                                {isSelected && (
                                                    <div className="flex items-center text-sm font-semibold ml-4">
                                                        {isCorrect ? <CheckCircleIcon /> : <XCircleIcon />}
                                                        <span className="ml-1.5">Your Answer</span>
                                                    </div>
                                                )}
                                                {!isSelected && isCorrect && (
                                                    <div className="flex items-center text-sm font-semibold ml-4 text-green-700">
                                                        <InfoIcon />
                                                        <span className="ml-1.5">Correct Answer</span>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}

                            {question.type === QuestionType.DRAG_AND_DROP && (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-3 gap-4 font-semibold text-sm text-gray-500 border-b pb-2">
                                        <span>Item</span>
                                        <span>Your Answer</span>
                                        <span>Correct Answer</span>
                                    </div>
                                    {question.items?.map((item, itemIndex) => {
                                        const studentAnswerTargetIndex = answerRecord.mapping?.[itemIndex];
                                        const correctAnswerTargetIndex = question.correctMapping?.[itemIndex];
                                        const isMatchCorrect = studentAnswerTargetIndex === correctAnswerTargetIndex;

                                        const studentAnswerText = studentAnswerTargetIndex !== undefined ? question.targets?.[studentAnswerTargetIndex] : 'Not Answered';
                                        const correctAnswerText = correctAnswerTargetIndex !== undefined ? question.targets?.[correctAnswerTargetIndex] : 'N/A';

                                        return (
                                            <div key={itemIndex} className={`grid grid-cols-3 gap-4 items-center p-3 rounded-lg ${isMatchCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                                                <span className="font-medium text-gray-800">{item}</span>
                                                <span className={`flex items-center gap-2 ${isMatchCorrect ? 'text-green-800' : 'text-red-800'}`}>
                                                   {isMatchCorrect ? <CheckCircleIcon /> : <XCircleIcon />}
                                                   {studentAnswerText}
                                                </span>
                                                <span className="font-semibold text-gray-700">{correctAnswerText}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    </div>
  );
};