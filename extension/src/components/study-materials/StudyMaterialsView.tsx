import React, { useState } from 'react';
import { Card } from '@/components/card/Card';
import { Button } from '@/components/button/Button';
import type { StudyMaterial } from '@/lib/api';
import { 
  BookOpen, 
  Brain, 
  Question, 
  Cards, 
  Lightning,
  Check,
  X,
  CaretDown,
  CaretRight
} from '@phosphor-icons/react';

interface StudyMaterialsViewProps {
  material: StudyMaterial;
  onClose?: () => void;
}

export function StudyMaterialsView({ material, onClose }: StudyMaterialsViewProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'concepts' | 'questions' | 'flashcards' | 'practice'>('summary');
  const [expandedConcepts, setExpandedConcepts] = useState<Set<number>>(new Set());
  const [showAnswers, setShowAnswers] = useState<Set<number>>(new Set());
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [showFlashcardBack, setShowFlashcardBack] = useState(false);

  const toggleConcept = (index: number) => {
    const newExpanded = new Set(expandedConcepts);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedConcepts(newExpanded);
  };

  const toggleAnswer = (index: number) => {
    const newShown = new Set(showAnswers);
    if (newShown.has(index)) {
      newShown.delete(index);
    } else {
      newShown.add(index);
    }
    setShowAnswers(newShown);
  };

  const nextFlashcard = () => {
    setShowFlashcardBack(false);
    setCurrentFlashcard((prev) => (prev + 1) % material.flashcards.length);
  };

  const prevFlashcard = () => {
    setShowFlashcardBack(false);
    setCurrentFlashcard((prev) => (prev - 1 + material.flashcards.length) % material.flashcards.length);
  };

  return (
    <div className="w-full h-[600px] flex flex-col bg-neutral-50 dark:bg-neutral-950">
      {/* Header */}
      <div className="p-4 border-b border-neutral-300 dark:border-neutral-800">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              📚 Study Materials
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {material.metadata.pageTitle}
            </p>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              shape="square"
              className="rounded h-7 w-7"
              onClick={onClose}
            >
              <X size={18} />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400">
          <span className="flex items-center gap-1">
            <Brain size={14} />
            {material.metadata.difficulty}
          </span>
          <span>•</span>
          <span>{material.estimatedStudyTime}</span>
          <span>•</span>
          <span>{new Date(material.metadata.generatedAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-300 dark:border-neutral-800 px-2 bg-neutral-100 dark:bg-neutral-900">
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'summary'
              ? 'text-[#F48120] border-b-2 border-[#F48120]'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          <BookOpen size={16} className="inline mr-1" />
          Summary
        </button>
        <button
          onClick={() => setActiveTab('concepts')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'concepts'
              ? 'text-[#F48120] border-b-2 border-[#F48120]'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          <Brain size={16} className="inline mr-1" />
          Concepts ({material.keyConcepts.length})
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'questions'
              ? 'text-[#F48120] border-b-2 border-[#F48120]'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          <Question size={16} className="inline mr-1" />
          Questions ({material.studyQuestions.length})
        </button>
        <button
          onClick={() => setActiveTab('flashcards')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'flashcards'
              ? 'text-[#F48120] border-b-2 border-[#F48120]'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          <Cards size={16} className="inline mr-1" />
          Flashcards ({material.flashcards.length})
        </button>
        <button
          onClick={() => setActiveTab('practice')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'practice'
              ? 'text-[#F48120] border-b-2 border-[#F48120]'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          <Lightning size={16} className="inline mr-1" />
          Practice ({material.practiceProblems.length})
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <div className="space-y-4">
            <Card className="p-4 bg-neutral-100 dark:bg-neutral-900">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-neutral-900 dark:text-neutral-100">
                  {material.summary}
                </div>
              </div>
            </Card>

            {material.learningObjectives.length > 0 && (
              <Card className="p-4 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
                <h3 className="font-semibold text-sm mb-2 text-neutral-900 dark:text-neutral-100">
                  🎯 Learning Objectives
                </h3>
                <ul className="space-y-1 text-sm text-neutral-700 dark:text-neutral-300">
                  {material.learningObjectives.map((objective, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        )}

        {/* Key Concepts Tab */}
        {activeTab === 'concepts' && (
          <div className="space-y-3">
            {material.keyConcepts.map((concept, idx) => (
              <Card key={idx} className="p-3 bg-neutral-100 dark:bg-neutral-900">
                <button
                  onClick={() => toggleConcept(idx)}
                  className="w-full flex items-start justify-between text-left"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                      {concept.concept}
                    </h4>
                    {!expandedConcepts.has(idx) && (
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                        Click to expand
                      </p>
                    )}
                  </div>
                  {expandedConcepts.has(idx) ? (
                    <CaretDown size={20} className="text-neutral-600 dark:text-neutral-400" />
                  ) : (
                    <CaretRight size={20} className="text-neutral-600 dark:text-neutral-400" />
                  )}
                </button>
                
                {expandedConcepts.has(idx) && (
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="text-neutral-700 dark:text-neutral-300">
                      {concept.explanation}
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900 rounded p-2">
                      <span className="text-xs font-semibold text-yellow-800 dark:text-yellow-200">
                        Why it's important:
                      </span>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                        {concept.importance}
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Questions Tab */}
        {activeTab === 'questions' && (
          <div className="space-y-3">
            {material.studyQuestions.map((question, idx) => (
              <Card key={idx} className="p-3 bg-neutral-100 dark:bg-neutral-900">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    {question.difficulty}
                  </span>
                </div>
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                  {idx + 1}. {question.question}
                </p>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleAnswer(idx)}
                  className="text-xs"
                >
                  {showAnswers.has(idx) ? 'Hide Answer' : 'Show Answer'}
                </Button>
                
                {showAnswers.has(idx) && (
                  <div className="mt-2 p-2 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded text-sm text-neutral-700 dark:text-neutral-300">
                    {question.answer}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Flashcards Tab */}
        {activeTab === 'flashcards' && material.flashcards.length > 0 && (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-full max-w-md">
              <div 
                className="relative h-64 cursor-pointer"
                onClick={() => setShowFlashcardBack(!showFlashcardBack)}
              >
                <Card className="absolute inset-0 p-6 flex items-center justify-center text-center bg-white dark:bg-neutral-900 border-2 border-neutral-300 dark:border-neutral-700 transition-all hover:border-[#F48120]">
                  <div>
                    <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-3">
                      {showFlashcardBack ? 'BACK' : 'FRONT'}
                    </div>
                    <div className="text-base font-medium text-neutral-900 dark:text-neutral-100">
                      {showFlashcardBack 
                        ? material.flashcards[currentFlashcard].back
                        : material.flashcards[currentFlashcard].front
                      }
                    </div>
                  </div>
                </Card>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevFlashcard}
                  disabled={material.flashcards.length <= 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {currentFlashcard + 1} / {material.flashcards.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextFlashcard}
                  disabled={material.flashcards.length <= 1}
                >
                  Next
                </Button>
              </div>
              
              <p className="text-xs text-center text-neutral-500 dark:text-neutral-400 mt-4">
                Click card to flip
              </p>
            </div>
          </div>
        )}

        {/* Practice Problems Tab */}
        {activeTab === 'practice' && (
          <div className="space-y-4">
            {material.practiceProblems.map((problem, idx) => (
              <Card key={idx} className="p-4 bg-neutral-100 dark:bg-neutral-900">
                <h4 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 mb-2">
                  Problem {idx + 1}
                </h4>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-3">
                  {problem.problem}
                </p>
                
                {problem.hints.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                      💡 Hints:
                    </p>
                    <ul className="space-y-1">
                      {problem.hints.map((hint, hintIdx) => (
                        <li key={hintIdx} className="text-xs text-neutral-600 dark:text-neutral-400 pl-4">
                          • {hint}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <details className="mt-3">
                  <summary className="text-xs font-semibold text-[#F48120] cursor-pointer hover:text-[#d67018]">
                    View Solution
                  </summary>
                  <div className="mt-2 p-3 bg-neutral-50 dark:bg-neutral-950 rounded text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
                    {problem.solution}
                  </div>
                </details>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

