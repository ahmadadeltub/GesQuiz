import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { mockDbService } from '../services/mockDbService';
import { Quiz, Question, Gesture, AnswerRecord, QuestionType } from '../types';
import { geminiService } from '../services/geminiService';
import { CameraFeed } from '../components/quiz/CameraFeed';
import { Spinner } from '../components/common/Spinner';
import { GESTURE_MAP, GESTURE_OPTIONS } from '../constants';
import { useAuth } from '../hooks/useAuth';

type QuizState = 'playing' | 'feedback' | 'finished';
const ANALYSIS_INTERVAL = 1500; // Increased from 750ms to reduce API call frequency
const STABILITY_THRESHOLD = 2; // Reduced from 3 to keep lock-in time reasonable (2 * 1.5s = 3s)

// New Overlay component for Drag and Drop
const DnDOverlay: React.FC<{
    question: Question;
    mappings: { [itemIndex: number]: number };
    selectedItemIndex: number | null;
    pointedLabel: string | null;
}> = ({ question, mappings, selectedItemIndex, pointedLabel }) => {
    
    const numItems = question.items?.length || 0;
    
    return (
        <div className="absolute inset-0 grid grid-rows-2 p-2 sm:p-4 gap-2 pointer-events-none">
            {/* Items Row */}
            <div className={`grid grid-cols-${numItems} gap-2`}>
                {question.items?.map((item, index) => {
                    const label = GESTURE_OPTIONS[index].label;
                    const isSelected = selectedItemIndex === index;
                    const isMapped = mappings[index] !== undefined;
                    const isPointed = pointedLabel === label && selectedItemIndex !== index && !isMapped;
                    
                    return (
                        <div key={`item-${index}`} 
                             className={`flex flex-col items-center justify-center text-center bg-white/80 backdrop-blur-sm rounded-lg border-4 transition-all duration-200
                                ${isSelected ? 'border-blue-500 ring-4 ring-blue-500 scale-105' : 'border-transparent'}
                                ${isMapped ? 'opacity-30' : ''}
                                ${isPointed ? 'bg-yellow-200 border-yellow-400' : ''}
                             `}>
                            <span className="font-bold text-lg sm:text-xl">{label}</span>
                            <span className="text-xs sm:text-sm px-1">{item}</span>
                        </div>
                    );
                })}
            </div>
             {/* Targets Row */}
            <div className={`grid grid-cols-${numItems} gap-2`}>
                {question.targets?.map((target, index) => {
                    const label = GESTURE_OPTIONS[index].label;
                    const mappedItemKey = Object.keys(mappings).find(key => mappings[parseInt(key)] === index);
                    const mappedItem = mappedItemKey !== undefined ? question.items?.[parseInt(mappedItemKey)] : null;
                    const isPointed = pointedLabel === label;

                    return (
                         <div key={`target-${index}`} 
                              className={`flex flex-col items-center justify-center text-center bg-white/80 backdrop-blur-sm rounded-lg border-4 transition-all duration-200
                                ${isPointed ? 'bg-yellow-200 border-yellow-400' : 'border-transparent'}
                              `}>
                             <span className="font-bold text-lg sm:text-xl">{label}</span>
                             <span className="text-xs sm:text-sm px-1">{target}</span>
                             {mappedItem && <span className="text-xs font-bold text-green-700 bg-green-100 rounded-full px-2 mt-1 py-0.5">{mappedItem}</span>}
                         </div>
                    )
                })}
            </div>
        </div>
    )
};


export const QuizTakerPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [quizState, setQuizState] = useState<QuizState>('playing');
  const [feedback, setFeedback] = useState<{ correct: boolean, gesture: Gesture } | null>(null);
  const [captureFrame, setCaptureFrame] = useState<(() => string | null) | null>(null);
  
  const [rateLimitError, setRateLimitError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // State for MC/TF questions
  const [detectedGesture, setDetectedGesture] = useState<Gesture | null>(null);
  const [stableGesture, setStableGesture] = useState<Gesture | null>(null);
  const [stabilityCounter, setStabilityCounter] = useState(0);
  const analysisIntervalRef = useRef<number | null>(null);
  const [isLocking, setIsLocking] = useState(false);


  // State for Drag and Drop questions (pointing interaction)
  const [dndPointingState, setDndPointingState] = useState<'select_item' | 'select_target'>('select_item');
  const [dndSelectedItemIndex, setDndSelectedItemIndex] = useState<number | null>(null);
  const [dndMappings, setDndMappings] = useState<{ [itemIndex: number]: number }>({});
  const [pointedElementLabel, setPointedElementLabel] = useState<string | null>(null);

  const isPreviewMode = location.pathname.startsWith('/preview');
  
  useEffect(() => {
    if (quizId) {
      const foundQuiz = mockDbService.getQuizById(quizId);
      setQuiz(foundQuiz || null);
    }
  }, [quizId]);


  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
        if (analysisIntervalRef.current) {
            window.clearInterval(analysisIntervalRef.current);
        }
    };
  }, []);

  const drawOverlayOnCanvas = useCallback((ctx: CanvasRenderingContext2D) => {
    const question = quiz?.questions[currentQuestionIndex];
    if (!question || question.type !== QuestionType.DRAG_AND_DROP) return;

    const { width, height } = ctx.canvas;
    const numItems = question.items?.length || 0;
    if (numItems === 0) return;

    ctx.save();

    const drawBox = (x: number, y: number, w: number, h: number, label: string, text: string, style: 'normal' | 'selected' | 'mapped' | 'pointed') => {
        // Base style
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 2;

        if (style === 'selected') { ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 6; } 
        else if (style === 'pointed') { ctx.fillStyle = 'rgba(254, 249, 195, 0.85)'; ctx.strokeStyle = '#facc15'; ctx.lineWidth = 4; } 
        else if (style === 'mapped') { ctx.fillStyle = 'rgba(229, 231, 235, 0.6)'; }

        ctx.beginPath();
        ctx.roundRect(x, y, w, h, [8]);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = style === 'mapped' ? '#9ca3af' : '#111827';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.font = `bold ${Math.min(28, w/4)}px sans-serif`;
        ctx.fillText(label, x + w / 2, y + h / 3);
        ctx.font = `${Math.min(20, w/6)}px sans-serif`;
        ctx.fillText(text, x + w / 2, y + h * 2 / 3, w-10);
    };

    const padding = 20;
    const rowHeight = (height / 2) - (padding * 1.5);
    const itemWidth = (width - (padding * (numItems + 1))) / numItems;
    const itemHeight = rowHeight;

    question.items?.forEach((item, index) => {
        const x = padding + index * (itemWidth + padding);
        const y = padding;
        const label = GESTURE_OPTIONS[index].label;
        let style: 'normal' | 'selected' | 'mapped' | 'pointed' = 'normal';
        if (dndSelectedItemIndex === index) style = 'selected';
        else if (dndMappings[index] !== undefined) style = 'mapped';
        drawBox(x, y, itemWidth, itemHeight, label, item, style);
    });

    question.targets?.forEach((target, index) => {
        const x = padding + index * (itemWidth + padding);
        const y = height / 2 + padding / 2;
        const label = GESTURE_OPTIONS[index].label;
        drawBox(x, y, itemWidth, itemHeight, label, target, 'normal');

        const mappedItemKey = Object.keys(dndMappings).find(key => dndMappings[parseInt(key)] === index);
        if (mappedItemKey !== undefined) {
            const mappedItemText = question.items?.[parseInt(mappedItemKey)];
            if(mappedItemText) {
                ctx.fillStyle = '#15803d';
                ctx.font = 'bold 18px sans-serif';
                ctx.fillText(`- ${mappedItemText} -`, x + itemWidth / 2, y + itemHeight - 20);
            }
        }
    });

    ctx.restore();
  }, [quiz, currentQuestionIndex, dndMappings, dndSelectedItemIndex, pointedElementLabel]);


  useEffect(() => {
      if (rateLimitError) {
          const timer = window.setTimeout(() => { setRateLimitError(false); }, 30000);
          return () => window.clearTimeout(timer);
      }
  }, [rateLimitError]);

  const handleCameraReady = useCallback((captureFunc: () => string | null) => {
    setCaptureFrame(() => captureFunc);
  }, []);

  const finishQuiz = useCallback((finalAnswers: AnswerRecord[]) => {
      if (user && quiz && !isPreviewMode) {
          mockDbService.saveQuizAttempt({
              quizId: quiz.id,
              studentId: user.id,
              answers: finalAnswers,
              completedAt: Date.now()
          });
      }
      setQuizState('finished');
  }, [user, quiz, isPreviewMode]);

  const handleNext = useCallback(() => {
    const question = quiz!.questions[currentQuestionIndex];
    let newAnswers = [...answers];

    if (question.type === QuestionType.DRAG_AND_DROP) {
      newAnswers.push({ questionId: question.id, mapping: dndMappings });
      setDndMappings({});
      setDndSelectedItemIndex(null);
      setDndPointingState('select_item');
    }
    
    setFeedback(null);
    setDetectedGesture(null);
    setStableGesture(null);
    setStabilityCounter(0);
    setPointedElementLabel(null);
    setAnswers(newAnswers);

    if (currentQuestionIndex < quiz!.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuizState('playing');
    } else {
      finishQuiz(newAnswers);
    }
  }, [quiz, currentQuestionIndex, answers, dndMappings, finishQuiz]);

    const processAnswer = useCallback((gesture: Gesture) => {
        if (!quiz) return;
        
        setIsProcessing(true);
        if (analysisIntervalRef.current) window.clearInterval(analysisIntervalRef.current);
        analysisIntervalRef.current = null;

        const question = quiz.questions[currentQuestionIndex];
        const gestureAnswerIndex = GESTURE_MAP[gesture];
        const isCorrect = gestureAnswerIndex === question.correctAnswerIndex;

        setAnswers(prev => [...prev, { questionId: question.id, selectedAnswerIndex: gestureAnswerIndex, isCorrect }]);
        setFeedback({ correct: isCorrect, gesture: gesture });
        setQuizState('feedback');
        setIsProcessing(false);
    }, [quiz, currentQuestionIndex]);

    const handleRealtimeGestureAnalysis = useCallback(async () => {
        if (isProcessing || !captureFrame || quizState !== 'playing') return;
        
        const frame = captureFrame();
        if (!frame) return;
        
        setIsProcessing(true);
        try {
            const gesture = await geminiService.analyzeGesture(frame);
            setDetectedGesture(gesture);

            if (gesture === Gesture.UNKNOWN) {
                setStableGesture(null);
                setStabilityCounter(0);
                return;
            }

            if (gesture === stableGesture) {
                const newCount = stabilityCounter + 1;
                setStabilityCounter(newCount);
                if (newCount >= STABILITY_THRESHOLD) {
                    processAnswer(gesture);
                }
            } else {
                setStableGesture(gesture);
                setStabilityCounter(1);
            }
        } catch (error: any) {
            console.error("Gesture analysis failed:", error);
            const errorContent = JSON.stringify(error);
            if (errorContent.includes('429') || errorContent.includes('RESOURCE_EXHAUSTED')) {
                setRateLimitError(true);
            }
        } finally {
            setIsProcessing(false);
        }
    }, [captureFrame, isProcessing, quizState, stabilityCounter, stableGesture, processAnswer]);

    const handleStartLocking = () => {
        if (isProcessing || quizState !== 'playing' || !captureFrame) return;
        setIsLocking(true);
        handleRealtimeGestureAnalysis(); 
        analysisIntervalRef.current = window.setInterval(handleRealtimeGestureAnalysis, ANALYSIS_INTERVAL);
    };

    const handleStopLocking = () => {
        setIsLocking(false);
        if (analysisIntervalRef.current) {
            window.clearInterval(analysisIntervalRef.current);
            analysisIntervalRef.current = null;
        }
        setStabilityCounter(0);
        setStableGesture(null);
        setDetectedGesture(null);
    };

    const handleDnDPointScan = async () => {
        if (isProcessing || !captureFrame || !quiz) return;

        setIsProcessing(true);
        setPointedElementLabel(null);
        const question = quiz.questions[currentQuestionIndex];

        try {
            const frames: string[] = [];
            for (let i = 0; i < 3; i++) {
                const frame = captureFrame();
                if (frame) frames.push(frame);
                await new Promise(r => window.setTimeout(r, 150));
            }

            if (frames.length === 0) {
                setIsProcessing(false);
                return;
            }

            const labels = GESTURE_OPTIONS.slice(0, question.items?.length || 0).map(opt => opt.label);
            const prompt = `Analyze the image. The user is pointing with their index finger at one of several labeled boxes on the screen. The boxes are labeled ${labels.join(', ')}. Respond with ONLY the label of the box the user's finger is pointing at. If the pointing is unclear, respond with "NONE".`;
            
            const pointedLabel = await geminiService.analyzePointingGesture(frames, prompt);

            if (pointedLabel && pointedLabel !== 'NONE') {
                const selectedIndex = GESTURE_OPTIONS.findIndex(opt => opt.label === pointedLabel);
                
                if (selectedIndex !== -1) {
                    if (dndPointingState === 'select_item') {
                        if (dndMappings[selectedIndex] === undefined) {
                            setDndSelectedItemIndex(selectedIndex);
                            setDndPointingState('select_target');
                        }
                    } else if (dndPointingState === 'select_target' && dndSelectedItemIndex !== null) {
                        const targetIsTaken = Object.values(dndMappings).includes(selectedIndex);
                        if (!targetIsTaken) {
                            setDndMappings(prev => ({...prev, [dndSelectedItemIndex]: selectedIndex}));
                            setDndSelectedItemIndex(null);
                            setDndPointingState('select_item');
                        }
                    }
                }
                 setPointedElementLabel(pointedLabel);
            }
        } catch (error: any) {
            console.error("Error analyzing pointing gesture:", error);
            const errorContent = JSON.stringify(error);
            if (errorContent.includes('429') || errorContent.includes('RESOURCE_EXHAUSTED')) {
                setRateLimitError(true);
            }
        } finally {
            setIsProcessing(false);
        }
    };

  if (!quiz) {
    return <div className="flex items-center justify-center h-screen"><h1 className="text-2xl">Quiz not found or loading...</h1></div>;
  }

  const question = quiz.questions[currentQuestionIndex];

  if (quizState === 'finished') {
    const finalScore = answers.reduce((acc, ans) => {
      const q = quiz.questions.find(q => q.id === ans.questionId);
      if(!q) return acc;
      if(q.type === QuestionType.DRAG_AND_DROP) {
        let correctMatches = 0;
        if (ans.mapping && q.correctMapping) {
            for (const itemIndex in q.correctMapping) {
                if (Number(q.correctMapping[itemIndex]) === Number(ans.mapping[itemIndex])) {
                    correctMatches++;
                }
            }
        }
        return acc + correctMatches;
      } else {
        return acc + (ans.isCorrect ? 1 : 0);
      }
    }, 0);

    const maxScore = quiz.questions.reduce((acc, q) => {
      if(q.type === QuestionType.DRAG_AND_DROP){
        return acc + (q.items?.length || 0);
      }
      return acc + 1;
    }, 0);

    return (
      <div className="text-center p-8 bg-gray-100 min-h-screen flex flex-col justify-center items-center">
        <div className="bg-white p-10 rounded-xl shadow-2xl">
          <h1 className="text-5xl font-extrabold text-blue-600 mb-4">
            {isPreviewMode ? 'Preview Complete!' : 'Quiz Complete!'}
          </h1>
          <p className="text-2xl mb-6 text-gray-700">Your final score is:</p>
          <p className="text-7xl font-bold text-gray-800 mb-8">{finalScore} / {maxScore}</p>
          <button onClick={() => navigate(isPreviewMode ? '/teacher' : '/student')} className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 text-lg transition-transform transform hover:scale-105">
            Back to Dashboard
          </button>
           {isPreviewMode && <p className="text-sm text-gray-500 mt-4">Note: This was a preview. No results were saved.</p>}
        </div>
      </div>
    );
  }

  // Common UI elements
  const questionHeader = (
     <div className="bg-white p-6 rounded-lg shadow-xl mb-6">
        <h2 className="text-2xl font-semibold text-center">{question.questionText}</h2>
    </div>
  );
  
  if (question.type === QuestionType.DRAG_AND_DROP) {
    const allItemsMapped = Object.keys(dndMappings).length === question.items?.length;
    let instructionText = '';
    if (dndPointingState === 'select_item') {
        instructionText = 'Point at an item to select it.';
    } else if (dndSelectedItemIndex !== null) {
        instructionText = `Point at a target to place "${question.items?.[dndSelectedItemIndex] || ''}".`
    }

    return (
      <div className="container mx-auto p-4 md:p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-center mb-2">{quiz.title} {isPreviewMode && <span className="text-lg text-yellow-600">(Preview)</span>}</h1>
        <p className="text-center text-gray-600 mb-6">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
        {questionHeader}
        <p className="text-center text-blue-600 font-semibold mb-4 text-lg h-6">{instructionText}</p>
        
        <div className="w-full max-w-2xl mx-auto">
            <div className="relative">
                <CameraFeed 
                    onCameraReady={handleCameraReady}
                    detectedGesture={null}
                    overlayRenderer={drawOverlayOnCanvas}
                />
                <DnDOverlay 
                    question={question} 
                    mappings={dndMappings} 
                    selectedItemIndex={dndSelectedItemIndex} 
                    pointedLabel={pointedElementLabel} 
                />
                 {rateLimitError && (<div className="absolute inset-0 bg-yellow-800 bg-opacity-80 flex flex-col items-center justify-center p-4 rounded-lg text-white"><svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><h3 className="text-xl font-bold">Analysis Paused</h3><p className="text-center mt-2 text-yellow-200">API is busy. Buttons will be re-enabled shortly.</p></div>)}
            </div>
        </div>

        <div className="flex justify-center mt-6 space-x-4">
            <button 
                onClick={handleDnDPointScan} 
                className="bg-blue-500 text-white font-bold py-3 px-8 rounded-lg text-xl hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg flex items-center" 
                disabled={isProcessing || rateLimitError || allItemsMapped}>
                 {isProcessing ? <><Spinner size="sm" /><span className="ml-2">Scanning...</span></> : 'Scan Point'}
            </button>
            <button onClick={handleNext} className="bg-green-500 text-white font-bold py-3 px-8 rounded-lg text-xl hover:bg-green-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg" disabled={!allItemsMapped}>
                {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </button>
        </div>
      </div>
    );
  }

  // Fallback for MC/TF questions
  const finalScoreMC = answers.filter(a => a.isCorrect).length;
  const isTrueFalse = question.type === QuestionType.TRUE_FALSE;
  const optionsToShow = isTrueFalse ? question.options?.slice(0, 2) : question.options;
  const gestureOptionsToShow = isTrueFalse ? GESTURE_OPTIONS.slice(0, 2) : GESTURE_OPTIONS;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-center mb-2">{quiz.title} {isPreviewMode && <span className="text-lg text-yellow-600">(Preview)</span>}</h1>
      <p className="text-center text-gray-600 mb-6">Question {currentQuestionIndex + 1} of {quiz.questions.length} | Current Score: {finalScoreMC}</p>
      {questionHeader}
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div className="order-2 md:order-1">
          <div className="relative">
              <CameraFeed 
                  onCameraReady={handleCameraReady} 
                  detectedGesture={detectedGesture}
                  stabilityCounter={stabilityCounter}
                  stabilityThreshold={STABILITY_THRESHOLD}
              />
              {rateLimitError && (<div className="absolute inset-0 bg-yellow-800 bg-opacity-80 flex flex-col items-center justify-center p-4 rounded-lg text-white"><svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><h3 className="text-xl font-bold">Analysis Paused</h3><p className="text-center mt-2 text-yellow-200">API is busy. The locking mechanism will be re-enabled shortly.</p></div>)}
          </div>
           <div className="text-center mt-4 p-4 bg-gray-100 rounded-lg min-h-[76px] flex flex-col justify-center">
              <h3 className="font-semibold text-lg text-gray-800">
                  {isLocking ? 'Hold gesture steady...' : 'Press and hold the button below to lock your answer.'}
              </h3>
              {(isProcessing && !isLocking) && <p className="text-sm text-blue-600 mt-1">Processing final answer...</p>}
          </div>
          <div className="text-center mt-4">
              <button
                  onMouseDown={handleStartLocking}
                  onMouseUp={handleStopLocking}
                  onMouseLeave={handleStopLocking}
                  onTouchStart={(e) => { e.preventDefault(); handleStartLocking(); }}
                  onTouchEnd={handleStopLocking}
                  disabled={isProcessing || rateLimitError || quizState !== 'playing'}
                  className={`w-full max-w-sm mx-auto text-white font-bold py-4 px-8 rounded-lg text-xl transition shadow-lg transform active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed ${isLocking ? 'bg-yellow-500' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                  {isLocking ? 'Locking Gesture...' : 'Hold to Lock Answer'}
              </button>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <h3 className="text-xl font-semibold mb-3 text-center">Options & Gestures</h3>
          <div className={`grid ${isTrueFalse ? 'grid-cols-2' : 'grid-cols-2'} gap-4`}>
            {optionsToShow?.map((option, index) => (
              <div key={index} className="p-4 rounded-lg text-center shadow-md border-4 border-transparent bg-gray-100">
                <span className="text-4xl">{gestureOptionsToShow[index].icon}</span>
                <p className="font-bold text-lg mt-2">{gestureOptionsToShow[index].label}: {option}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {quizState === 'feedback' && feedback && (<div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"><div className={`text-center p-10 rounded-xl shadow-2xl ${feedback.correct ? 'bg-green-100' : 'bg-red-100'}`}><h2 className={`text-5xl font-extrabold mb-4 ${feedback.correct ? 'text-green-700' : 'text-red-700'}`}>{feedback.correct ? 'Correct!' : 'Incorrect'}</h2><p className="text-xl text-gray-700 mb-2">You showed: <span className="font-bold">{feedback.gesture.replace('_', ' ')}</span></p>{!feedback.correct && (<p className="text-xl text-gray-700 mb-4">The correct answer was: <span className="font-bold">{question.options?.[question.correctAnswerIndex!]}</span></p>)}<button onClick={handleNext} className="bg-blue-600 text-white px-8 py-3 text-lg rounded-lg hover:bg-blue-700 transition">Next Question</button></div></div>)}
    </div>
  );
};