import {
  useEffect,
  useState,
} from "react";

import type {
  KeyboardEvent,
} from "react";

import {
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import BuilderFooter from "../../components/builder/BuilderFooter";
import BuilderHeader from "../../components/builder/BuilderHeader";
import BuilderProgress from "../../components/builder/BuilderProgress";
import BuilderQuestionCard from "../../components/builder/BuilderQuestionCard";
import QuestionRenderer from "../../components/builder/QuestionRenderer";
import PageContainer from "../../components/layout/PageContainer";

import {
  generatePrompt,
} from "../../services/promptGenerationService";

import type {
  BuilderAnswer,
  BuilderSession,
  GeneratedPrompt,
} from "../../types/builder";

import {
  clearPromptSession,
  getBuilderSession,
  getGeneratedPrompt,
  saveBuilderSession,
  saveGeneratedPrompt,
} from "../../utils/promptSessionStorage";

import {
  validateBuilderAnswer,
} from "../../utils/validateBuilderAnswer";

interface SmartBuilderLocationState {
  session?: BuilderSession;
}

function SmartBuilderPage() {
  const navigate = useNavigate();
  const location = useLocation();

  /*
   * ===============================================
   * REQUEST STATE
   * ===============================================
   */

  const [
    isGenerating,
    setIsGenerating,
  ] = useState(false);

  const state =
    location.state as SmartBuilderLocationState | null;

  /*
   * ===============================================
   * BUILDER SESSION
   * ===============================================
   *
   * sessionStorage is checked first.
   *
   * This means an F5 refresh restores the most
   * recently saved question index and answers.
   *
   * Router state is only used when there is no
   * stored builder session.
   */

  const [
    session,
    setSession,
  ] = useState<BuilderSession | null>(
    () => {
      const storedSession =
        getBuilderSession();

      if (storedSession) {
        return storedSession;
      }

      return state?.session ?? null;
    },
  );

  /*
   * ===============================================
   * GENERATED PROMPT
   * ===============================================
   */

  const [
    generatedPrompt,
    setGeneratedPrompt,
  ] = useState<GeneratedPrompt | null>(
    () => getGeneratedPrompt(),
  );

  /*
   * ===============================================
   * VALIDATION STATE
   * ===============================================
   */

  const [
    showValidationError,
    setShowValidationError,
  ] = useState(false);

  /*
   * ===============================================
   * SAVE BUILDER SESSION
   * ===============================================
   */

  useEffect(() => {
    if (!session) {
      return;
    }

    saveBuilderSession(
      session,
    );
  }, [session]);

  /*
   * ===============================================
   * SAVE GENERATED PROMPT
   * ===============================================
   */

  useEffect(() => {
    if (!generatedPrompt) {
      return;
    }

    saveGeneratedPrompt(
      generatedPrompt,
    );
  }, [generatedPrompt]);

  /*
   * ===============================================
   * RESET VALIDATION FEEDBACK
   * ===============================================
   */

  useEffect(() => {
    setShowValidationError(false);
  }, [session?.currentQuestionIndex]);

  /*
   * ===============================================
   * NO ACTIVE SESSION
   * ===============================================
   */

  if (!session) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  /*
   * ===============================================
   * CURRENT QUESTION
   * ===============================================
   */

  const totalQuestions =
    session.questions.length;

  const currentStep =
    session.currentQuestionIndex + 1;

  const currentQuestion =
    session.questions[
      session.currentQuestionIndex
    ];

  if (!currentQuestion) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  const currentAnswer =
    session.answers[
      currentQuestion.id
    ];

  const canContinue =
    validateBuilderAnswer(
      currentQuestion,
      currentAnswer,
    );

  const isLastQuestion =
    session.currentQuestionIndex ===
    totalQuestions - 1;

  /*
   * ===============================================
   * ANSWER CHANGE
   * ===============================================
   */

  function handleAnswerChange(
    answer: BuilderAnswer,
  ) {
    setShowValidationError(false);

    setSession((currentSession) => {
      if (!currentSession) {
        return currentSession;
      }

      const question =
        currentSession.questions[
          currentSession.currentQuestionIndex
        ];

      if (!question) {
        return currentSession;
      }

      return {
        ...currentSession,

        answers: {
          ...currentSession.answers,
          [question.id]: answer,
        },
      };
    });
  }

  /*
   * ===============================================
   * KEYBOARD SHORTCUT
   * ===============================================
   */

  function handleKeyDown(
    event: KeyboardEvent<HTMLDivElement>,
  ) {
    const shouldContinue =
      (event.ctrlKey || event.metaKey) &&
      event.key === "Enter";

    if (!shouldContinue) {
      return;
    }

    event.preventDefault();

    void handleContinue();
  }

  /*
   * ===============================================
   * BACK
   * ===============================================
   */

  function handleBack() {
    /*
     * Prevent navigation while the final
     * generation request is running.
     */

    if (isGenerating) {
      return;
    }

    setSession((currentSession) => {
      if (!currentSession) {
        return currentSession;
      }

      /*
       * If we're on Question 1,
       * return to the Home page.
       */

      if (
        currentSession.currentQuestionIndex === 0
      ) {
        navigate("/");

        return currentSession;
      }

      /*
       * Move back one question.
       */

      const previousSession:
        BuilderSession = {
        ...currentSession,

        currentQuestionIndex:
          Math.max(
            currentSession.currentQuestionIndex -
              1,
            0,
          ),
      };

      /*
       * Save immediately so F5 restores
       * the correct previous question.
       */

      saveBuilderSession(
        previousSession,
      );

      return previousSession;
    });
  }

  /*
   * ===============================================
   * CONTINUE
   * ===============================================
   */

  async function handleContinue() {
    /*
     * ===========================================
     * DUPLICATE REQUEST PROTECTION
     * ===========================================
     */

    if (isGenerating) {
      return;
    }

    /*
     * ===========================================
     * SESSION SAFETY
     * ===========================================
     */

    if (!session) {
      return;
    }

    /*
     * ===========================================
     * VALIDATION
     * ===========================================
     */

    if (!canContinue) {
      setShowValidationError(true);

      return;
    }

    /*
     * ===========================================
     * FINAL QUESTION
     * ===========================================
     */

    if (isLastQuestion) {
      const completedSession:
        BuilderSession = {
        ...session,
        status: "completed",
      };

      /*
       * Save immediately instead of waiting
       * only for useEffect.
       */

      saveBuilderSession(
        completedSession,
      );

      /*
       * Keep React state synchronized.
       */

      setSession(
        completedSession,
      );

      /*
       * Start loading state before generating
       * the final prompt.
       */

      setIsGenerating(true);

      try {
        /*
         * =======================================
         * PROMPT GENERATION STRATEGY
         * =======================================
         *
         * promptGenerationService owns the
         * strategy now.
         *
         * AI succeeds:
         *   → result.prompt contains AI output.
         *
         * AI/API/network fails:
         *   → result.prompt contains the
         *     deterministic fallback.
         */

        const result =
          await generatePrompt(
            completedSession,
          );

        /*
         * Save generated prompt immediately.
         */

        saveGeneratedPrompt(
          result.prompt,
        );

        setGeneratedPrompt(
          result.prompt,
        );
      } finally {
        /*
         * Always restore the UI even if
         * something unexpected happens.
         */

        setIsGenerating(false);
      }

      return;
    }

    /*
     * ===========================================
     * NEXT QUESTION
     * ===========================================
     */

    const nextSession:
      BuilderSession = {
      ...session,

      currentQuestionIndex:
        Math.min(
          session.currentQuestionIndex + 1,
          session.questions.length - 1,
        ),
    };

    /*
     * Save immediately so F5 restores
     * the correct question.
     */

    saveBuilderSession(
      nextSession,
    );

    setSession(
      nextSession,
    );
  }

  /*
   * ===============================================
   * START OVER
   * ===============================================
   */

  function handleStartOver() {
    clearPromptSession();

    navigate("/", {
      replace: true,
    });
  }

  /*
   * ===============================================
   * OPEN WORKSPACE
   * ===============================================
   */

  function handleOpenWorkspace() {
    if (!generatedPrompt) {
      return;
    }

    saveGeneratedPrompt(
      generatedPrompt,
    );

    navigate(
      `/prompts/${generatedPrompt.id}`,
      {
        state: {
          prompt:
            generatedPrompt,
        },
      },
    );
  }

  /*
   * ===============================================
   * COMPLETED BUILDER
   * ===============================================
   */

  if (
    session.status === "completed" &&
    generatedPrompt
  ) {
    return (
      <PageContainer>
        <div className="mx-auto w-full max-w-3xl py-6 sm:py-10">
          <div className="text-center">
            <p className="text-sm font-medium text-primary">
              PROMPT.
            </p>

            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
              Your prompt is ready.
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-text-secondary">
              Review the generated prompt before
              continuing to the workspace.
            </p>
          </div>

          <div className="mt-8 rounded-prompt-lg border border-border bg-surface p-5 sm:p-7">
            <div className="border-b border-border pb-4">
              <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                Generated Prompt
              </p>

              <h2 className="mt-2 text-lg font-semibold text-text-primary">
                {generatedPrompt.title}
              </h2>
            </div>

            <div className="mt-5">
              <pre className="whitespace-pre-wrap wrap-break-word font-sans text-sm leading-7 text-text-primary">
                {generatedPrompt.content}
              </pre>
            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={handleStartOver}
                className="min-h-10 rounded-prompt-md px-4 text-sm font-medium text-text-secondary transition-colors hover:bg-background hover:text-text-primary"
              >
                Start over
              </button>

              <button
                type="button"
                onClick={
                  handleOpenWorkspace
                }
                className="min-h-10 rounded-prompt-md bg-primary px-5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
              >
                Open Workspace
              </button>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  /*
   * ===============================================
   * ACTIVE BUILDER
   * ===============================================
   */

  return (
    <PageContainer>
      <div className="mx-auto w-full max-w-2xl py-4 sm:py-8">
        <BuilderHeader
          onBack={handleBack}
        />

        <div className="mt-6">
          <BuilderProgress
            currentStep={currentStep}
            totalSteps={totalQuestions}
          />
        </div>

        <div
          onKeyDown={handleKeyDown}
          className="mt-8 rounded-prompt-lg border border-border bg-surface p-5 sm:p-7"
        >
          <div className="border-b border-border pb-5">
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
              Your idea
            </p>

            <p className="mt-2 text-sm leading-6 text-text-primary">
              {session.originalIdea}
            </p>
          </div>

          <BuilderQuestionCard
            title={
              currentQuestion.title
            }
            description={
              currentQuestion.description
            }
            required={
              currentQuestion.required
            }
            error={
              showValidationError &&
              !canContinue
                ? "Please answer this question before continuing."
                : undefined
            }
          >
            <QuestionRenderer
              question={
                currentQuestion
              }
              value={currentAnswer}
              onChange={
                handleAnswerChange
              }
            />
          </BuilderQuestionCard>

          <BuilderFooter
            onContinue={
              () =>
                void handleContinue()
            }
            disabled={
              !canContinue ||
              isGenerating
            }
            isLastStep={
              isLastQuestion
            }
          />

          {isGenerating && (
            <p
              role="status"
              aria-live="polite"
              className="mt-3 text-center text-xs text-text-muted"
            >
              Generating your prompt...
            </p>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

export default SmartBuilderPage;