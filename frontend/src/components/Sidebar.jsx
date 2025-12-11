import React, { useEffect, useRef, useState } from 'react';
import { sidebarStyles } from '../assets/dummyStyles'
import questionsData from '../assets/dummydata.js';
import { Award, BookOpen, ChevronDown, ChevronLeft, ChevronRight, Code, Coffee, Cpu, Database, Globe, Layout, Sparkles, Star, Target, Terminal, Trophy, X, Zap } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_BASE = "http://localhost:8000";

const Sidebar = () => {
  const [selectedTech, setSelectedTech] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [currentQuestion, setCurrectQuestion] = useState(0);
  const [userAnswers, setUserAnswer] = useState({});
  const [showResults, setShowResults] = useState(false);

  const submittedRef = useRef(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const asideRef = useRef(null);

  // if the inner width is greater the 768px the it will call this function

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // if the sidebar is open  and inner width is less then it will
  useEffect(() => {
    if (window.innerWidth < 768) {
      if (isSidebarOpen) document.body.style.overflow = "hidden";
      else document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  // techs 
  const technologies = [
    {
      id: "html",
      name: "HTML",
      icon: <Globe size={20} />,
      color: "bg-orange-50 text-orange-600 border-orange-200",
    },
    {
      id: "css",
      name: "CSS",
      icon: <Layout size={20} />,
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      id: "js",
      name: "JavaScript",
      icon: <Code size={20} />,
      color: "bg-yellow-50 text-yellow-600 border-yellow-200",
    },
    {
      id: "react",
      name: "React",
      icon: <Cpu size={20} />,
      color: "bg-cyan-50 text-cyan-600 border-cyan-200",
    },
    {
      id: "node",
      name: "Node.js",
      icon: <Code size={20} />,
      color: "bg-green-50 text-green-600 border-green-200",
    },
    {
      id: "mongodb",
      name: "MongoDB",
      icon: <Database size={20} />,
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
    {
      id: "java",
      name: "Java",
      icon: <Coffee size={20} />,
      color: "bg-red-50 text-red-600 border-red-200",
    },
    {
      id: "python",
      name: "Python",
      icon: <Terminal size={20} />,
      color: "bg-indigo-50 text-indigo-600 border-indigo-200",
    },
    {
      id: "cpp",
      name: "C++",
      icon: <Code size={20} />,
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
    {
      id: "bootstrap",
      name: "Bootstrap",
      icon: <Layout size={20} />,
      color: "bg-pink-50 text-pink-600 border-pink-200",
    },
  ];

  const levels = [
    {
      id: "basic",
      name: "Basic",
      questions: 20,
      icon: <Star size={16} />,
      color: "bg-green-50 text-green-600",
    },
    {
      id: "intermediate",
      name: "Intermediate",
      questions: 40,
      icon: <Zap size={16} />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      id: "advanced",
      name: "Advanced",
      questions: 60,
      icon: <Target size={16} />,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const handleTechSelect = (techId) => {
    if (selectedTech === techId) {
      setSelectedTech(null);
      setSelectedLevel(null);
    } else {
      setSelectedTech(techId);
      setSelectedLevel(null);
    }
    setCurrectQuestion(0);
    setUserAnswer({});
    setShowResults(false);
    submittedRef.current = false;
    if (window.innerWidth < 768) setIsSidebarOpen(true);
  }

  const handleAnswerSelect = (answeIndex) => {
    const newAnswers = {
      ...userAnswers,
      [currentQuestion]: answeIndex
    };
    setUserAnswer(newAnswers);
    setTimeout(() => {
      if (currentQuestion < getQuestions().length - 1) {
        setCurrectQuestion((prev) => prev + 1);
      }
      else {
        setShowResults(true);
      }
    }, 500)
  }


  const getQuestions = () => {
    if (!selectedTech || selectedLevel) return [];
    return questionsData[selectedTech]?.[selectedLevel] || [];
  }

  /// calculate  the score
  const calculateScore = () => {
    const questions = getQuestions();
    let correct = 0;
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: questions.length
        ? Math.round((correct / questions.length) * 100)
        : 0,
    };
  }

  // reset the quiz question
  const resetQuiz = () => {
    setCurrectQuestion(0);
    setUserAnswer({});
    setShowResults(false);
    submittedRef.current = false;
  }

  const questions = getQuestions();
  const currentQ = questions[currentQuestion];
  const score = calculateScore();

  const getPerformanceStatus = () => {
    if (score.percentage >= 90)
      return {
        text: "Outstanding!",
        color: "bg-gradient-to-r from-amber-200 to-amber-300",
        icon: <Sparkles className="text-amber-800" />,
      };
    if (score.percentage >= 75)
      return {
        text: "Excellent!",
        color: "bg-gradient-to-r from-blue-200 to-indigo-200",
        icon: <Trophy className="text-blue-800" />,
      };
    if (score.percentage >= 60)
      return {
        text: "Good Job!",
        color: "bg-gradient-to-r from-green-200 to-teal-200",
        icon: <Award className="text-green-800" />,
      };
    return {
      text: "Keep Practicing",
      color: "bg-gradient-to-r from-gray-200 to-gray-300",
      icon: <BookOpen className="text-gray-800" />,
    };
  }

  const performance = getPerformanceStatus();
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token') ||
      localStorage.getItem('authToken') || null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const submitResult = async () => {
    if (submittedRef.current) return;
    if (!selectedTech || !selectedLevel) return;

    const payload = {
      title: `${selectedTech.toUpperCase()} - ${selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)
        } quiz`,
      technology: selectedTech,
      level: selectedLevel,
      totalQuestions: score.total,
      correct: score.correct,
      wrong: score.total - score.correct,
    }

    try {
      submittedRef.current = true;
      toast.info('saving your results..');
      const res = await axios.post(`${API_BASE}/api/vi/results`, payload, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        timeout: 10000,
      });
      if (res.data && res.data.success) {
        toast.success('Result saved');
      } else {
        toast.warn('result  not saved');
        submittedRef.current = false;
      }
    } catch (err) {
      submittedRef.current = false;
      console.error(
        "Error saving result:",
        err?.response?.data || err.message || err
      );
      toast.error("Could not save result. Check console or network.");
    }
  }

  useEffect(() => {
    if (showResults) {
      submitResult();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showResults]);

  return (
    <div className={sidebarStyles.pageContainer}>
      {isSidebarOpen && (
        <div onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)}
          className={sidebarStyles.mobileOverlay}></div>
      )}
      <div className={sidebarStyles.mainContainer}>
        <aside ref={asideRef} className={`${sidebarStyles.sidebar} ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className={sidebarStyles.sidebarHeader}>
            <div className={sidebarStyles.headerDecoration1}></div>
            <div className={sidebarStyles.headerDecoration2}></div>
            <div className={sidebarStyles.headerContent}>
              <div className={sidebarStyles.logoContainer}>
                <div className={sidebarStyles.logoIcon}>
                  <BookOpen size={28} className="text-indigo-700" />
                </div>
                <div className="">
                  <h1 className={sidebarStyles.logoTitle}>Tech Quiz Master</h1>
                  <p className={sidebarStyles.logoSubtitle}>
                    Test your knowledge & improve skills
                  </p>
                </div>
              </div>
              <button onClick={toggleSidebar} className={sidebarStyles.closeButton}>
                <X size={20} />
              </button>
            </div>
          </div>
          <div className={sidebarStyles.sidebarContent}>
            <div className={sidebarStyles.technologiesHeader}>
              <h2 className={sidebarStyles.technologiesTitle}> Technologies</h2>
              <span className={sidebarStyles.technologiesCount}>
                {technologies.length} options
              </span>
            </div>
            {technologies.map((tech) => (
              <div className={sidebarStyles.techItem} key={tech.id} data-tech={tech.id}>
                <button onClick={() => handleTechSelect(tech.id)} className={`${sidebarStyles.techButton} ${selectedTech === tech.id ? `${tech.color} 
                  ${sidebarStyles.techButtonSelected}` : sidebarStyles.techButtonNormal
                  }`}>

                  <div className={sidebarStyles.techButtonContent}>
                    <span className={`{sidebarStyles.techIcon} ${tech.color}`}>
                      {tech.icon}
                    </span>
                    <span className={sidebarStyles.techName}>{tech.name}</span>
                  </div>
                  {selectedTech === tech.id ? (
                    <ChevronDown size={18} className="text-current" />
                  ) : (
                    <ChevronRight size={18} className="text-gray-400" />
                  )}
                </button>
                {selectedTech === tech.id && (
                  <div className={sidebarStyles.levelsContainer}>
                    <h3 className={sidebarStyles.levelsTitle}>
                      <span>Select Difficulty</span>
                      <span className={sidebarStyles.techBadge}>
                        {technologies.find((t) => t.id === selectedTech).name}
                      </span>
                    </h3>
                    {levels.map((level) => (
                      <button key={level.id} onClick={() => handleLevelSelect(level.id)}
                        className={`${sidebarStyles.levelButton} ${selectedLevel === level.id
                            ? `${level.color} ${sidebarStyles.levelButtonSelected}`
                            : sidebarStyles.levelButtonNormal
                          }`}>
                            <div className={sidebarStyles.levelButtonContent}></div>
                          </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Sidebar