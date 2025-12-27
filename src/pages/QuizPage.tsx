import { useState, useMemo } from 'react';
import { CheckCircle, XCircle, ArrowRight, Trophy, RotateCcw, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { QUIZ_QUESTIONS, getQuizCategories } from '@/lib/quizData';

export function QuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => getQuizCategories(), []);

  const filteredQuestions = useMemo(() => {
    if (!selectedCategory) return QUIZ_QUESTIONS;
    return QUIZ_QUESTIONS.filter(q => q.category === selectedCategory);
  }, [selectedCategory]);

  const [shuffledQuestions, setShuffledQuestions] = useState(filteredQuestions);

  const shuffleQuestions = () => {
    const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    resetQuiz();
  };

  const currentQuestion = shuffledQuestions[currentIndex];
  const isCorrect = selectedOption === currentQuestion?.correctIndex;

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    const newQuestions = category 
      ? QUIZ_QUESTIONS.filter(q => q.category === category)
      : QUIZ_QUESTIONS;
    setShuffledQuestions(newQuestions);
    resetQuiz();
  };

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === currentQuestion.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < shuffledQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  const handleRestart = () => {
    resetQuiz();
  };

  if (isFinished) {
    const percentage = Math.round((score / shuffledQuestions.length) * 100);
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-primary/10 mx-auto">
            <Trophy className="h-12 w-12 text-primary" />
          </div>
          <div>
            <h1 className="heading-lg text-foreground mb-2">Квиз завершён!</h1>
            <p className="text-muted-foreground">
              Твой результат: <span className="text-primary font-bold">{score}/{shuffledQuestions.length}</span>
            </p>
          </div>
          <div className="w-full max-w-xs mx-auto">
            <div className="h-3 rounded-full bg-secondary overflow-hidden">
              <div 
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  percentage >= 70 ? 'bg-success' : percentage >= 50 ? 'bg-warning' : 'bg-destructive'
                )}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">{percentage}% правильных ответов</p>
          </div>
          <div className="flex gap-3 justify-center pt-4 flex-wrap">
            <Button onClick={handleRestart} variant="outline" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Пройти снова
            </Button>
            <Button onClick={shuffleQuestions} variant="outline" className="gap-2">
              <Shuffle className="h-4 w-4" />
              Перемешать
            </Button>
            <Button onClick={() => window.history.back()}>
              Назад
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="opacity-0 animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <h1 className="heading-lg text-foreground">Квиз</h1>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {shuffledQuestions.length}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / shuffledQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 opacity-0 animate-fade-in stagger-1">
        <Button 
          variant={selectedCategory === null ? "default" : "outline"} 
          size="sm"
          onClick={() => handleCategoryChange(null)}
        >
          Все ({QUIZ_QUESTIONS.length})
        </Button>
        {categories.slice(0, 6).map(cat => (
          <Button 
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"} 
            size="sm"
            onClick={() => handleCategoryChange(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Question Card */}
      {currentQuestion && (
        <div className="card-elevated p-6 sm:p-8 opacity-0 animate-fade-in stagger-2">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-xs font-semibold text-primary mb-4">
            {currentQuestion.category}
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-6">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const showCorrect = isAnswered && index === currentQuestion.correctIndex;
              const showWrong = isAnswered && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => handleSelect(index)}
                  disabled={isAnswered}
                  className={cn(
                    'w-full p-4 rounded-xl text-left transition-all border',
                    !isAnswered && 'hover:border-primary/50 hover:bg-primary/5',
                    !isAnswered && !isSelected && 'bg-card border-border',
                    isSelected && !isAnswered && 'border-primary bg-primary/10',
                    showCorrect && 'border-success bg-success/10',
                    showWrong && 'border-destructive bg-destructive/10'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold',
                      !isAnswered && 'bg-secondary text-muted-foreground',
                      showCorrect && 'bg-success text-success-foreground',
                      showWrong && 'bg-destructive text-destructive-foreground'
                    )}>
                      {showCorrect ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : showWrong ? (
                        <XCircle className="h-4 w-4" />
                      ) : (
                        String.fromCharCode(65 + index)
                      )}
                    </div>
                    <span className={cn(
                      'font-medium',
                      showCorrect && 'text-success',
                      showWrong && 'text-destructive'
                    )}>
                      {option}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {isAnswered && (
            <div className={cn(
              'mt-6 p-4 rounded-xl animate-fade-in',
              isCorrect ? 'bg-success/10 border border-success/20' : 'bg-warning/10 border border-warning/20'
            )}>
              <p className={cn(
                'text-sm font-medium mb-1',
                isCorrect ? 'text-success' : 'text-warning'
              )}>
                {isCorrect ? '✓ Правильно!' : '✗ Неправильно'}
              </p>
              <p className="text-sm text-muted-foreground">
                {currentQuestion.explanation}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Next Button */}
      {isAnswered && (
        <div className="flex justify-center opacity-0 animate-fade-in">
          <Button onClick={handleNext} size="lg" className="gap-2 px-8">
            {currentIndex < shuffledQuestions.length - 1 ? 'Дальше' : 'Завершить'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
