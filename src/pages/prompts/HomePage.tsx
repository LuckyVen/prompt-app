import {
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  KeyboardEvent,
} from "react";

import type {
  LucideIcon,
} from "lucide-react";

import {
  ArrowRight,
  FileText,
  GraduationCap,
  Hammer,
  LayoutTemplate,
  LoaderCircle,
  Mic,
  PenLine,
  Plus,
  Search,
  Sparkles,
  Square,
  WandSparkles,
  Wrench,
  X,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import PageContainer from "../../components/layout/PageContainer";
import AmbientBlurBackground from "../../components/ui/AmbientBlurBackground";
import useMobileKeyboard from "../../hooks/useMobileKeyboard";

import {
  generateQuestionsWithAi,
} from "../../services/aiService";

import type {
  PromptCategory,
} from "../../types/builder";

import {
  clearPromptSession,
  saveBuilderSession,
} from "../../utils/promptSessionStorage";

import {
  createBuilderSession,
} from "../../utils/createBuilderSession";

import {
  detectPromptCategory,
} from "../../utils/detectPromptCategory";

import {
  getPromptPreferences,
  preferenceToPromptCategory,
} from "../../utils/promptPreferences";

/* =========================================================
   TYPES
========================================================= */

interface CategoryItem {
  label: string;
  value: PromptCategory;
  icon: LucideIcon;
  suggestions: string[];
}

interface CategoryMenuPosition {
  top: number;
  left: number;
  width: number;
  placement: "above" | "below";
}
/* =========================================================
   CATEGORY DATA
========================================================= */

const categories: CategoryItem[] = [
  {
    label: "Build",
    value: "build",
    icon: Hammer,
    suggestions: [
      "Build a responsive personal portfolio website",
      "Plan a complete full-stack web application",
      "Create a clean admin dashboard",
      "Design a REST API for my application",
    ],
  },
  {
    label: "Create",
    value: "create",
    icon: Sparkles,
    suggestions: [
      "Create a unique brand concept",
      "Develop a creative content idea",
      "Create a visual concept for a project",
      "Generate an original campaign idea",
    ],
  },
  {
    label: "Write",
    value: "write",
    icon: PenLine,
    suggestions: [
      "Write a professional email",
      "Rewrite my text to make it clearer",
      "Create an essay outline",
      "Write a professional project description",
    ],
  },
  {
    label: "Learn",
    value: "learn",
    icon: GraduationCap,
    suggestions: [
      "Explain a difficult topic step by step",
      "Create a study reviewer for me",
      "Teach me using simple examples",
      "Create practice questions with explanations",
    ],
  },
  {
    label: "Research",
    value: "research",
    icon: Search,
    suggestions: [
      "Research a topic and summarize the important points",
      "Compare two options objectively",
      "Create research questions for a topic",
      "Analyze the advantages and disadvantages",
    ],
  },
  {
    label: "Fix",
    value: "fix",
    icon: Wrench,
    suggestions: [
      "Help me debug a programming error",
      "Fix a responsive layout problem",
      "Troubleshoot a backend connection issue",
      "Review my code and find the problem",
    ],
  },
];

/* =========================================================
   HOME PAGE
========================================================= */

function HomePage() {
  const navigate =
    useNavigate();

 const {
    isKeyboardOpen,
    keyboardInset,
  } = useMobileKeyboard();

  /* =======================================================
     REFS
  ======================================================= */

  const composerRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const speechRecognitionRef =
    useRef<{
      start: () => void;
      stop: () => void;
      abort: () => void;
    } | null>(null);    

  const plusMenuRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const categoryMenuRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const categoryButtonsRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  /* =======================================================
     STATE
  ======================================================= */

  const [
    idea,
    setIdea,
  ] = useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] =
    useState<PromptCategory | null>(
      () => {
        const preferences =
          getPromptPreferences();

        return preferenceToPromptCategory(
          preferences.defaultCategory,
        );
      },
    );

  const [
    activeCategoryMenu,
    setActiveCategoryMenu,
  ] =
    useState<PromptCategory | null>(
      null,
    );

  const [
    categoryMenuPosition,
    setCategoryMenuPosition,
  ] =
    useState<CategoryMenuPosition | null>(
      null,
    );

  const [
    isPreparingBuilder,
    setIsPreparingBuilder,
  ] = useState(false);

  const [
    isPlusMenuOpen,
    setIsPlusMenuOpen,
  ] = useState(false);

  const [
    isListening,
    setIsListening,
  ] = useState(false);

  /* =======================================================
     DERIVED STATE
  ======================================================= */

  const trimmedIdea =
    idea.trim();

  const hasIdea =
    trimmedIdea.length > 0;

  const canContinue =
    hasIdea &&
    !isPreparingBuilder;

  const activeCategory =
    categories.find(
      (category) =>
        category.value ===
        activeCategoryMenu,
    ) ?? null;

  const ActiveCategoryIcon =
    activeCategory?.icon;

  /* =======================================================
     CATEGORY POPOVER POSITION
  ======================================================= */

  function updateCategoryMenuPosition() {
    const composer =
      composerRef.current;
  
    if (!composer) {
      return;
    }
  
    const rect =
      composer.getBoundingClientRect();
  
    const gap =
      8;
  
    const isPhone =
      window.matchMedia(
        "(max-width: 767px)",
      ).matches;
  
    setCategoryMenuPosition({
      top: isPhone
        ? rect.top - gap
        : rect.bottom + gap,
  
      left:
        rect.left,
  
      width:
        rect.width,
  
      placement: isPhone
        ? "above"
        : "below",
    });
  }

  /* =======================================================
     CLICK OUTSIDE + ESCAPE
  ======================================================= */

  useEffect(() => {
    function handlePointerDown(
      event: MouseEvent,
    ) {
      const target =
        event.target as Node;

      /* Plus menu */

      const clickedInsidePlus =
        plusMenuRef.current?.contains(
          target,
        );

      if (!clickedInsidePlus) {
        setIsPlusMenuOpen(
          false,
        );
      }

      /* Category menu */

      const clickedInsideCategoryMenu =
        categoryMenuRef.current?.contains(
          target,
        );

      const clickedCategoryButton =
        categoryButtonsRef.current?.contains(
          target,
        );

      if (
        !clickedInsideCategoryMenu &&
        !clickedCategoryButton
      ) {
        setActiveCategoryMenu(
          null,
        );

        setSelectedCategory(
          null,
        );

        setCategoryMenuPosition(
          null,
        );
      }
    }

    function handleEscape(
      event:
        globalThis.KeyboardEvent,
    ) {
      if (
        event.key !==
        "Escape"
      ) {
        return;
      }

      setIsPlusMenuOpen(
        false,
      );

      setActiveCategoryMenu(
        null,
      );

      setSelectedCategory(
        null,
      );

      setCategoryMenuPosition(
        null,
      );
    }

    document.addEventListener(
      "mousedown",
      handlePointerDown,
    );

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handlePointerDown,
      );

      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, []);

  /* =======================================================
     KEEP FIXED POPOVER ALIGNED
  ======================================================= */

  useEffect(() => {
    if (!activeCategoryMenu) {
      return;
    }

    updateCategoryMenuPosition();

    function handleViewportChange() {
      updateCategoryMenuPosition();
    }

    window.addEventListener(
      "resize",
      handleViewportChange,
    );

    window.addEventListener(
      "scroll",
      handleViewportChange,
      true,
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleViewportChange,
      );

      window.removeEventListener(
        "scroll",
        handleViewportChange,
        true,
      );
    };
  }, [activeCategoryMenu]);

  /* =======================================================
     CONTINUE
  ======================================================= */

  async function handleContinue() {
    if (!canContinue) {
      return;
    }

    const category =
      selectedCategory ??
      detectPromptCategory(
        trimmedIdea,
      );

    setIsPreparingBuilder(
      true,
    );

    setActiveCategoryMenu(
      null,
    );

    setCategoryMenuPosition(
      null,
    );

    setIsPlusMenuOpen(
      false,
    );

    try {
      /* =============================================
         AI ADAPTIVE QUESTIONS
      ============================================= */

      const result =
        await generateQuestionsWithAi({
          originalIdea:
            trimmedIdea,

          category,
        });

      const session =
        createBuilderSession(
          trimmedIdea,
          category,
          {
            questions:
              result.questions,

            questionSource:
              "ai",
          },
        );

      clearPromptSession();

      saveBuilderSession(
        session,
      );

      navigate(
        "/prompts/new",
        {
          state: {
            session,
          },
        },
      );

    } catch (error) {
      /* =============================================
         DETERMINISTIC FALLBACK
      ============================================= */

      console.warn(
        "Adaptive questions unavailable. Using static Builder questions.",
        error,
      );

      const fallbackSession =
        createBuilderSession(
          trimmedIdea,
          category,
        );

      clearPromptSession();

      saveBuilderSession(
        fallbackSession,
      );

      navigate(
        "/prompts/new",
        {
          state: {
            session:
              fallbackSession,
          },
        },
      );
    } finally {
      setIsPreparingBuilder(
        false,
      );
    }
  }

  /* =======================================================
   VOICE INPUT
  ======================================================= */
  
  function handleVoiceInput() {
    if (isListening) {
      speechRecognitionRef.current?.stop();
  
      setIsListening(false);
  
      return;
    }
  
    type SpeechRecognitionResultLike = {
      0: {
        transcript: string;
      };
    };
  
    type SpeechRecognitionEventLike = {
      results: ArrayLike<SpeechRecognitionResultLike>;
    };
  
    type SpeechRecognitionErrorEventLike = {
      error?: string;
    };
  
    type SpeechRecognitionLike = {
      lang: string;
  
      interimResults: boolean;
  
      continuous: boolean;
  
      start: () => void;
  
      stop: () => void;

      abort: () => void;
  
      onresult:
        | ((
            event: SpeechRecognitionEventLike,
          ) => void)
        | null;
  
      onend:
        | (() => void)
        | null;
  
      onerror:
        | ((
            event:
              SpeechRecognitionErrorEventLike,
          ) => void)
        | null;
    };
  
    type SpeechRecognitionConstructor =
      new () => SpeechRecognitionLike;
  
    const speechWindow =
      window as typeof window & {
        SpeechRecognition?:
          SpeechRecognitionConstructor;
  
        webkitSpeechRecognition?:
          SpeechRecognitionConstructor;
      };
  
    const SpeechRecognition =
      speechWindow.SpeechRecognition ??
      speechWindow.webkitSpeechRecognition;
  
    if (!SpeechRecognition) {
      window.alert(
        "Voice input is not supported by this browser. Try Chrome.",
      );
  
      return;
    }
  
    const recognition =
      new SpeechRecognition();
  
    recognition.lang =
      navigator.language || "en-US";
  
    recognition.interimResults =
      false;
  
    recognition.continuous =
      false;
  
    speechRecognitionRef.current =
      recognition;
  
    recognition.onresult = (
      event,
    ) => {
      const transcript =
        event.results[0]?.[0]?.transcript?.trim();
  
      if (!transcript) {
        return;
      }
  
      setIdea((current) => {
        const existing =
          current.trim();
  
        if (!existing) {
          return transcript;
        }
  
        return `${existing} ${transcript}`;
      });
    };
  
    recognition.onend = () => {
      setIsListening(false);
  
      speechRecognitionRef.current =
        null;
    };
  
    recognition.onerror = (
      event,
    ) => {
      setIsListening(false);
  
      speechRecognitionRef.current =
        null;
  
      if (
        event.error ===
        "not-allowed"
      ) {
        window.alert(
          "Microphone permission was denied. Allow microphone access in your browser settings.",
        );
      }
    };
  
    try {
      setIsListening(true);
  
      recognition.start();
    } catch {
      setIsListening(false);
  
      speechRecognitionRef.current =
        null;
    }
  }

  /* =======================================================
     KEYBOARD SHORTCUT
  ======================================================= */

  function handleTextareaKeyDown(
    event:
      KeyboardEvent<HTMLTextAreaElement>,
  ) {
    const shouldSubmit =
      (
        event.ctrlKey ||
        event.metaKey
      ) &&
      event.key ===
        "Enter";

    if (!shouldSubmit) {
      return;
    }

    event.preventDefault();

    void handleContinue();
  }

  /* =======================================================
     CATEGORY CLICK
  ======================================================= */

  function handleCategoryClick(
    category: PromptCategory,
  ) {
    setIsPlusMenuOpen(
      false,
    );

    const isAlreadySelected =
      selectedCategory ===
      category;

    const isAlreadyOpen =
      activeCategoryMenu ===
      category;

    if (
      isAlreadySelected &&
      isAlreadyOpen
    ) {
      setSelectedCategory(
        null,
      );

      setActiveCategoryMenu(
        null,
      );

      setCategoryMenuPosition(
        null,
      );

      return;
    }

    setSelectedCategory(
      category,
    );

    setActiveCategoryMenu(
      category,
    );

    requestAnimationFrame(
      updateCategoryMenuPosition,
    );
  }

  /* =======================================================
     SUGGESTION CLICK
  ======================================================= */

  function handleSuggestion(
    suggestion: string,
  ) {
    setIdea(
      suggestion,
    );

    setActiveCategoryMenu(
      null,
    );

    setCategoryMenuPosition(
      null,
    );
  }

  /* =======================================================
     CLOSE CATEGORY MENU
  ======================================================= */

  function closeCategoryMenu() {
    setActiveCategoryMenu(
      null,
    );

    setSelectedCategory(
      null,
    );

    setCategoryMenuPosition(
      null,
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
  <div
    className="
      relative
      min-h-[calc(100dvh-4rem)]
      overflow-hidden
      bg-background
      text-text-primary
    "
  >
    <AmbientBlurBackground />

    <div className="relative z-10">
      <PageContainer>
        <div
          className="
            mx-auto
            flex
            min-h-[calc(100dvh-9rem)]
            w-full
            min-w-0
            max-w-3xl
            flex-col
            justify-start
            py-6
            lg:justify-center
            lg:py-12
          "
        >
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="text-center">
          <p className="text-sm font-medium text-primary">
            PROMPT.
          </p>

          <h1
            className="
              mt-3
              text-2xl
              font-semibold
              tracking-tight
              text-text-primary
              sm:text-4xl
            "
          >
            What do you want to do?
          </h1>

          <p
            className="
              mx-auto
              mt-3
              max-w-xl
              text-sm
              leading-6
              text-text-secondary
              sm:text-base
            "
          >
            Start with a simple idea.
            We&apos;ll help you turn it
            into a clear prompt.
          </p>
        </div>

        {/* =================================================
            COMPOSER AREA
        ================================================= */}

        <div
          className="
            mt-6
            flex
            min-h-0
            flex-1
            flex-col
        
            lg:mt-7
            lg:block
            lg:flex-none
          "
        >
          {/* ===============================================
              COMPOSER
          =============================================== */}

          <div
            className="
                order-3
                mt-auto
                w-full
            
                lg:order-none
                lg:mt-0
              "
            >
              <div
                ref={composerRef}
                style={
                  isKeyboardOpen
                    ? {
                        bottom: `${keyboardInset + 12}px`,
                      }
                    : undefined
                }
                className={[
                  `
                    min-w-0
                      rounded-2xl
                      border
                      border-border
                      bg-surface
                      px-3
                      pb-1.5
                      pt-2
                      sm:pb-2.5
                      sm:pt-3
                      shadow-sm
                  `,
            
                  isKeyboardOpen
                    ? `
                        fixed
                        left-3
                        right-3
                        z-[140]
                      `
                    : `
                        w-full
                      `,
                ].join(" ")}
              >
            {/* =============================================
                TEXTAREA
            ============================================= */}

            <textarea
              rows={1}
              value={idea}
              onChange={(event) =>
                setIdea(
                  event.target.value,
                )
              }
              onKeyDown={
                handleTextareaKeyDown
              }
              disabled={
                isPreparingBuilder
              }
              aria-label="Describe your idea"
              placeholder="Describe your idea..."
              style={{
                border: "none",
                outline: "none",
                boxShadow: "none",
              }}
              className="
                min-h-[40px]
                max-h-[120px]
                sm:min-h-[72px]
                w-full
                min-w-0
                resize-none
                appearance-none
                border-0
                bg-transparent
                px-2
                py-1
                text-base
                leading-6
                text-text-primary
                outline-none
                ring-0
                placeholder:text-text-muted
                focus:border-0
                focus:outline-none
                focus:ring-0
                focus-visible:outline-none
                focus-visible:ring-0
                disabled:cursor-wait
                disabled:opacity-70
              "
            />

            {/* =============================================
                BOTTOM TOOLBAR
            ============================================= */}

            <div className="relative flex h-9 items-center justify-between px-1">
              {isListening && (
                <div
                  className="
                    absolute
                    inset-0
                    z-30
                    flex
                    items-center
                    gap-2
                    bg-surface
                  "
                >
                  {/* CANCEL */}
                  <button
                    type="button"
                    aria-label="Cancel voice input"
                    onClick={() => {
                      speechRecognitionRef.current?.abort();
              
                      speechRecognitionRef.current =
                        null;
              
                      setIsListening(false);
                    }}
                    className="
                      flex
                      size-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-border
                      text-text-secondary
                      transition
                      hover:bg-background
                      hover:text-text-primary
                    "
                  >
                    <X
                      size={18}
                      strokeWidth={1.8}
                    />
                  </button>
              
                  {/* VOICE WAVEFORM */}
                  <div
                    className="
                      flex
                      min-w-0
                      flex-1
                      items-center
                      justify-center
                      gap-[3px]
                      overflow-hidden
                    "
                    aria-hidden="true"
                  >
                    {[
                      4, 6, 8, 5, 9, 12, 7,
                      10, 14, 8, 12, 16, 10,
                      14, 18, 12, 16, 10, 14,
                      8, 12, 7, 10, 6, 8, 4,
                    ].map(
                      (
                        height,
                        index,
                      ) => (
                        <span
                          key={index}
                          className="
                            w-[2px]
                            shrink-0
                            animate-pulse
                            rounded-full
                            bg-text-muted
                          "
                          style={{
                            height: `${height}px`,
              
                            animationDelay:
                              `${index * 45}ms`,
                          }}
                        />
                      ),
                    )}
                  </div>
              
                  {/* STOP */}
                  <button
                    type="button"
                    aria-label="Stop voice input"
                    onClick={
                      handleVoiceInput
                    }
                    className="
                      flex
                      size-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border-2
                      border-primary
                      text-primary
                      transition
                      hover:bg-primary-soft
                    "
                  >
                    <Square
                      size={12}
                      strokeWidth={2}
                      fill="currentColor"
                    />
                  </button>
              
                  {/* SEND */}
                  <button
                    type="button"
                    aria-label="Continue to Smart Builder"
                    disabled={
                      !canContinue
                    }
                    onClick={() =>
                      void handleContinue()
                    }
                    className="
                      flex
                      size-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-primary
                      text-white
                      shadow-sm
                      transition
                      hover:bg-primary-hover
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    <ArrowRight
                      size={18}
                      strokeWidth={2.2}
                    />
                  </button>
                </div>
              )}



              {/* ===========================================
                  PLUS MENU
              =========================================== */}

              <div
                ref={plusMenuRef}
                className="relative"
              >
                <button
                  type="button"
                  aria-label="More prompt options"
                  aria-haspopup="menu"
                  aria-expanded={
                    isPlusMenuOpen
                  }
                  disabled={
                    isPreparingBuilder
                  }
                  onClick={() => {
                    setIsPlusMenuOpen(
                      (current) =>
                        !current,
                    );

                    setActiveCategoryMenu(
                      null,
                    );

                    setCategoryMenuPosition(
                      null,
                    );
                  }}
                  className={[
                    "flex size-8 items-center justify-center rounded-lg text-zinc-500 transition",

                    isPlusMenuOpen
                      ? "bg-zinc-100 text-zinc-900"
                      : "hover:bg-zinc-100 hover:text-zinc-900",

                    isPreparingBuilder
                      ? "cursor-not-allowed opacity-40"
                      : "",
                  ].join(" ")}
                >
                  <Plus
                    size={20}
                    strokeWidth={1.8}
                  />
                </button>

                {/* =========================================
                    PLUS DROPDOWN
                ========================================= */}

                {isPlusMenuOpen && (
                  <div
                    role="menu"
                    className="
                      absolute
                      bottom-[calc(100%+8px)]
                      left-0
                      z-[100]
                      w-[230px]
                      overflow-hidden
                      rounded-xl
                      border
                      border-zinc-200
                      bg-white
                      p-1.5
                      shadow-[0_16px_45px_rgba(24,24,27,0.14)]
                    "
                  >
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsPlusMenuOpen(
                          false,
                        );

                        navigate(
                          "/templates",
                        );
                      }}
                      className="
                        flex
                        w-full
                        items-center
                        gap-2.5
                        rounded-lg
                        px-2.5
                        py-2
                        text-left
                        text-sm
                        font-medium
                        text-zinc-700
                        transition
                        hover:bg-zinc-50
                        hover:text-zinc-950
                      "
                    >
                      <LayoutTemplate
                        size={17}
                        strokeWidth={1.8}
                        className="text-zinc-500"
                      />

                      Use a template
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsPlusMenuOpen(
                          false,
                        );

                        navigate(
                          "/improve",
                        );
                      }}
                      className="
                        flex
                        w-full
                        items-center
                        gap-2.5
                        rounded-lg
                        px-2.5
                        py-2
                        text-left
                        text-sm
                        font-medium
                        text-zinc-700
                        transition
                        hover:bg-zinc-50
                        hover:text-zinc-950
                      "
                    >
                      <WandSparkles
                        size={17}
                        strokeWidth={1.8}
                        className="text-zinc-500"
                      />

                      Improve a prompt
                    </button>

                    <div className="mx-2 my-1 h-px bg-zinc-100" />

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsPlusMenuOpen(
                          false,
                        );

                        navigate(
                          "/prompts",
                        );
                      }}
                      className="
                        flex
                        w-full
                        items-center
                        gap-2.5
                        rounded-lg
                        px-2.5
                        py-2
                        text-left
                        text-sm
                        font-medium
                        text-zinc-700
                        transition
                        hover:bg-zinc-50
                        hover:text-zinc-950
                      "
                    >
                      <FileText
                        size={17}
                        strokeWidth={1.8}
                        className="text-zinc-500"
                      />

                      Saved prompts
                    </button>
                  </div>
                )}
              </div>

              {/* ===========================================
                  CONTINUE BUTTON

                  Only appears when there is text.
              =========================================== */}

              {!isListening && (
                <div className="flex items-center gap-1">
                  {/* ===========================================
                      MICROPHONE
                  =========================================== */}
              
                  <button
                    type="button"
                    onClick={
                      handleVoiceInput
                    }
                    disabled={
                      isPreparingBuilder
                    }
                    aria-label="Start voice input"
                    title="Voice input"
                    className={[
                      `
                        flex
                        size-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        text-text-secondary
                        transition-all
                        duration-200
                        hover:bg-primary-soft
                        hover:text-primary
                      `,
              
                      isPreparingBuilder
                        ? "cursor-not-allowed opacity-40"
                        : "",
                    ].join(" ")}
                  >
                    <Mic
                      size={18}
                      strokeWidth={1.8}
                    />
                  </button>
              
                  {/* ===========================================
                      CONTINUE
                  =========================================== */}
              
                  {hasIdea && (
                    <button
                      type="button"
                      onClick={() =>
                        void handleContinue()
                      }
                      disabled={
                        isPreparingBuilder
                      }
                      aria-label="Continue to Smart Builder"
                      className="
                        flex
                        size-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-primary
                        text-white
                        shadow-sm
                        transition
                        hover:bg-primary-hover
                        disabled:cursor-wait
                        disabled:opacity-60
                      "
                    >
                      {isPreparingBuilder ? (
                        <LoaderCircle
                          size={17}
                          className="animate-spin"
                        />
                      ) : (
                        <ArrowRight
                          size={18}
                          strokeWidth={2}
                        />
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          </div>

          {/* =================================================
              CATEGORIES
          ================================================= */}

          <div
            ref={
              categoryButtonsRef
            }
            className={[
              `
                mt-3
                flex
                flex-wrap
                justify-center
                gap-2
                lg:order-none
              `,
            
              isKeyboardOpen
                ? "hidden lg:flex"
                : "order-1",
            ].join(" ")}
          >
            {categories.map(
              (category) => {
                const Icon =
                  category.icon;

                const isSelected =
                  selectedCategory ===
                  category.value;

                return (
                  <button
                    key={
                      category.value
                    }
                    type="button"
                    disabled={
                      isPreparingBuilder
                    }
                    aria-pressed={
                      isSelected
                    }
                    onClick={() =>
                      handleCategoryClick(
                        category.value,
                      )
                    }
                    className={[
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50",

                      isSelected
                        ? "border-primary/30 bg-primary-soft text-primary"
                        : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900",
                    ].join(" ")}
                  >
                    <Icon
                      size={14}
                      strokeWidth={1.8}
                    />

                    {
                      category.label
                    }
                  </button>
                );
              },
            )}
          </div>

          {/* =================================================
              IMPROVE
          ================================================= */}

          <div
            className={[
              `
                mt-5
                text-center
                lg:order-none
                lg:mt-7
              `,
          
              isKeyboardOpen
                ? "hidden lg:block"
                : "order-2",
            ].join(" ")}
          >
            <span className="text-sm text-text-secondary">
              Already have a prompt?{" "}
            </span>
          
            <Link
              to="/improve"
              className="text-sm font-medium text-primary hover:underline"
            >
              Improve it
            </Link>
          </div>

          </div>

        {/* =================================================
            FIXED CATEGORY POPOVER

            This is position: fixed.
            It does NOT change document/page height.
        ================================================= */}

        {activeCategory &&
          ActiveCategoryIcon &&
          categoryMenuPosition && (
            <div
              ref={
                categoryMenuRef
              }
              style={{
                top:
                  categoryMenuPosition.top,
              
                left:
                  categoryMenuPosition.left,
              
                width:
                  categoryMenuPosition.width,
              
                transform:
                  categoryMenuPosition.placement ===
                  "above"
                    ? "translateY(-100%)"
                    : "none",
              }}
              className="
                fixed
                z-[120]
                max-h-[225px]
                overflow-hidden
                rounded-xl
                border
                border-zinc-200
                bg-white
                shadow-[0_18px_55px_rgba(24,24,27,0.16)]
              "
            >
              {/* ===========================================
                  HEADER
              =========================================== */}

              <div className="flex items-center justify-between border-b border-zinc-100 bg-white px-3 py-2">
                <div className="flex items-center gap-2">
                  <ActiveCategoryIcon
                    size={15}
                    strokeWidth={1.8}
                    className="text-primary"
                  />

                  <span className="text-sm font-semibold text-zinc-900">
                    {
                      activeCategory.label
                    }
                  </span>
                </div>

                <button
                  type="button"
                  aria-label="Close suggestions"
                  onClick={
                    closeCategoryMenu
                  }
                  className="
                    flex
                    size-7
                    items-center
                    justify-center
                    rounded-lg
                    text-zinc-400
                    transition
                    hover:bg-zinc-100
                    hover:text-zinc-700
                  "
                >
                  <X
                    size={15}
                    strokeWidth={1.8}
                  />
                </button>
              </div>

              {/* ===========================================
                  SUGGESTIONS
              =========================================== */}

              <div className="max-h-[185px] overflow-y-auto p-1.5">
                {activeCategory.suggestions.map(
                  (
                    suggestion,
                    index,
                  ) => (
                    <button
                      key={`${activeCategory.value}-${index}`}
                      type="button"
                      onClick={() =>
                        handleSuggestion(
                          suggestion,
                        )
                      }
                      className="
                        flex
                        w-full
                        items-center
                        justify-between
                        gap-4
                        rounded-lg
                        px-3
                        py-2
                        text-left
                        text-sm
                        text-zinc-700
                        transition
                        hover:bg-zinc-50
                        hover:text-zinc-950
                      "
                    >
                      <span className="min-w-0">
                        {
                          suggestion
                        }
                      </span>

                      <ArrowRight
                        size={14}
                        strokeWidth={1.8}
                        className="shrink-0 text-zinc-300"
                      />
                    </button>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  </div>
);
}

export default HomePage;