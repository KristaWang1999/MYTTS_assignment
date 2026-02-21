/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from 'react';
import { Play, CheckCircle2, Volume2 } from 'lucide-react';
import { QUESTIONS, QuestionType } from './questions';

export default function App() {
  const [answers, setAnswers] = useState<Record<number, string | number>>({});
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleAnswerChange = (id: number, value: string | number) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const togglePlay = (id: number, audioPath: string) => {
    if (playingId === id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      setPlayingId(id);
      if (audioRef.current) {
        audioRef.current.src = audioPath;
        audioRef.current.play();
      }
    }
  };

  const onAudioEnded = () => {
    setPlayingId(null);
  };

  const handleSubmit = () => {
    // In a real app, you would send 'answers' to a server here
    console.log('Survey Answers:', answers);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const allAnswered = Object.keys(answers).length === QUESTIONS.length;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-red-100 selection:text-red-600">
      {/* Header Section */}
      <header className="bg-white border-b border-zinc-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 mb-4">Welcome!</h1>
          <div className="text-zinc-600 leading-relaxed space-y-2">
            <p>
              In this experiment, you will listen to several sentences spoken by a smart home system.
              This survey consists of a total of 30 questions. Your task is to evaluate the speech on
              three aspects:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <li className="bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                <span className="font-bold text-red-600 block mb-1">Naturalness</span>
                <span className="text-sm">Rate how natural the voice sounds</span>
              </li>
              <li className="bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                <span className="font-bold text-red-600 block mb-1">Intelligibility</span>
                <span className="text-sm">Write down exactly what you hear</span>
              </li>
              <li className="bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                <span className="font-bold text-red-600 block mb-1">Likability</span>
                <span className="text-sm">Rate how pleasant the voice sounds</span>
              </li>
            </ul>
            <p className="pt-4">
              Please listen carefully and answer honestly. You may replay each audio if needed.
            </p>
            <p>
              The order of the questions has been randomized.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <audio ref={audioRef} onEnded={onAudioEnded} className="hidden" />

        {!isSubmitted ? (
          <div className="space-y-16">
            {/* Questions List */}
            <div className="space-y-16">
              {QUESTIONS.map((q, index) => (
                <section key={q.id} className="bg-white p-8 rounded-2xl border border-zinc-200 transition-shadow group">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="flex-1 space-y-6">
                      <div className="flex items-center gap-3">
                        <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-red-50 text-red-600 text-base font-bold border border-red-100">
                          {index + 1}
                        </span>
                        <h2 className="text-xl font-medium text-zinc-800 leading-snug">
                          {q.text}
                        </h2>
                      </div>

                      {q.type === QuestionType.INTELLIGIBILITY ? (
                        <textarea
                          rows={3}
                          value={(answers[q.id] as string) || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                          placeholder="Type exactly what you hear here..."
                          className="w-full p-4 text-lg border-2 border-zinc-100 rounded-xl focus:border-red-600 focus:ring-0 outline-none transition-all bg-zinc-50/50"
                        />
                      ) : (
                        <div className="flex flex-wrap gap-3">
                          {[1, 2, 3, 4, 5].map((val) => (
                            <button
                              key={val}
                              onClick={() => handleAnswerChange(q.id, val)}
                              className={`flex-1 min-w-[60px] py-4 rounded-xl text-lg font-bold transition-all border-2 ${
                                answers[q.id] === val
                                  ? 'bg-red-600 border-red-600 text-white'
                                  : 'bg-white border-zinc-100 text-zinc-400 hover:border-zinc-300 hover:text-zinc-600'
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="md:pt-1">
                      <button
                        onClick={() => togglePlay(q.id, q.audioPath)}
                        className={`flex items-center justify-center w-14 h-14 rounded-full transition-all ${
                          playingId === q.id
                            ? 'bg-zinc-900 text-white scale-110'
                            : 'bg-red-600 text-white hover:bg-red-700 hover:scale-105 active:scale-95'
                        }`}
                        title="Play Audio"
                      >
                        {playingId === q.id ? (
                          <Volume2 size={24} className="animate-pulse" />
                        ) : (
                          <Play size={24} fill="currentColor" />
                        )}
                      </button>
                    </div>
                  </div>
                </section>
              ))}
            </div>

            {/* Submit Button */}
            <div className="pt-12 flex flex-col items-center space-y-4">
              {!allAnswered && (
                <p className="text-amber-600 text-sm font-medium">
                  Please answer all 30 questions before submitting.
                </p>
              )}
              <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className={`px-12 py-5 rounded-2xl font-bold text-xl transition-all ${
                  allAnswered
                    ? 'bg-red-600 text-white hover:bg-red-700 hover:scale-105 active:scale-95'
                    : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                }`}
              >
                Submit Survey
              </button>
            </div>
          </div>
        ) : (
          /* Completion Section */
          <div className="py-20 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                <CheckCircle2 size={40} />
              </div>
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-zinc-900">
              The survey is now complete.
            </h2>
            <p className="text-zinc-600 max-w-2xl mx-auto leading-relaxed">
              Thank you for your time and participation! Your responses are greatly appreciated.
            </p>
            <div className="pt-8">
              <button 
                onClick={() => {
                  setIsSubmitted(false);
                  setAnswers({});
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-zinc-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-black transition-all"
              >
                Restart Survey
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer (only shown when submitted) */}
      {isSubmitted && (
        <footer className="bg-white border-t border-zinc-200 py-8 text-center">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-red-600 font-semibold hover:underline"
          >
            Back to top
          </button>
        </footer>
      )}
    </div>
  );
}
