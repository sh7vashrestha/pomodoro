import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, SkipForward, Settings, Moon, Sun, Music, Volume2, VolumeX, RotateCcw, Sparkles, Coffee, Focus, Timer } from 'lucide-react';

const PomodoroApp = () => {
  // Timer states
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState('focus');
  const [cycleCount, setCycleCount] = useState(0);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  
  // Settings
  const [settings, setSettings] = useState({
    focusTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    soundEnabled: true,
    notificationsEnabled: true,
    darkMode: false
  });
  
  // UI states
  const [showSettings, setShowSettings] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const intervalRef = useRef(null);

  // Real lofi streaming stations
  const lofiTracks = [
    {
      id: 1,
      title: "Lofi Girl - Study Radio",
      artist: "ChilledCow",
      streamUrl: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
      embedId: "jfKfPfyJRdk",
      color: "from-amber-400 to-orange-500",
      type: "youtube"
    },
    {
      id: 2,
      title: "Lofi Hip Hop - Chill Beats",
      artist: "Lofi Girl",
      streamUrl: "https://www.youtube.com/watch?v=5qap5aO4i9A",
      embedId: "5qap5aO4i9A", 
      color: "from-blue-400 to-cyan-500",
      type: "youtube"
    },
    {
      id: 3,
      title: "Jazz Lofi - Smooth Vibes",
      artist: "Steezyasfuck",
      streamUrl: "https://www.youtube.com/watch?v=DWcJFNfaw9c",
      embedId: "DWcJFNfaw9c",
      color: "from-purple-400 to-pink-500",
      type: "youtube"
    },
    {
      id: 4,
      title: "Rain + Lofi - Study Focus",
      artist: "Ambience",
      streamUrl: "https://www.youtube.com/watch?v=mPZkdNFkNps",
      embedId: "mPZkdNFkNps",
      color: "from-green-400 to-emerald-500",
      type: "youtube"
    }
  ];

  // Real streaming controls
  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
    // YouTube iframe API would control play/pause here
  };

  const nextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % lofiTracks.length;
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(false); // Will restart when user clicks play
  };

  const prevTrack = () => {
    const prevIndex = currentTrackIndex === 0 ? lofiTracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
    setIsPlaying(false); // Will restart when user clicks play
  };

  // Remove the old audio generation code - we'll use real streams
  useEffect(() => {
    // Real streaming would be handled by YouTube iframe API
    // This is just for UI state management now
  }, [isPlaying]);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('pomodoroSettings');
    const savedPomodoros = localStorage.getItem('pomodoroCount');
    const savedDate = localStorage.getItem('pomodoroDate');
    
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      if (parsed.darkMode) {
        document.documentElement.classList.add('dark');
      }
    }
    
    const today = new Date().toDateString();
    if (savedDate === today && savedPomodoros) {
      setCompletedPomodoros(parseInt(savedPomodoros));
    } else {
      localStorage.setItem('pomodoroDate', today);
      localStorage.setItem('pomodoroCount', '0');
      setCompletedPomodoros(0);
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    
    // Enhanced notification sound
    if (settings.soundEnabled) {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        // Play a pleasant chord progression
        [523.25, 659.25, 783.99].forEach((freq, index) => {
          setTimeout(() => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.frequency.setValueAtTime(freq, audioContext.currentTime);
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.2, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);
            osc.start(audioContext.currentTime);
            osc.stop(audioContext.currentTime + 1);
          }, index * 200);
        });
      } catch (e) {
        console.log('Audio context not available');
      }
    }

    // Enhanced browser notification
    if (settings.notificationsEnabled && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        const messages = {
          focus: ['🎉 Great work! Time for a break.', '✨ You crushed that focus session!', '🌟 Amazing focus! Take a breather.'],
          shortBreak: ['⚡ Break time is over. Ready to focus?', '🚀 Let\'s get back to work!', '💪 Time to tackle the next task!'],
          longBreak: ['🎯 Long break done. Ready for action?', '🌈 Refreshed and ready to go!', '⭐ Let\'s make this session count!']
        };
        const sessionMessages = messages[currentSession] || messages.focus;
        const message = sessionMessages[Math.floor(Math.random() * sessionMessages.length)];
        
        new Notification('Pomodoro Timer', { 
          body: message,
          icon: '🍅'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }

    // Session transition logic
    if (currentSession === 'focus') {
      const newCycleCount = cycleCount + 1;
      setCycleCount(newCycleCount);
      setCompletedPomodoros(prev => {
        const newCount = prev + 1;
        localStorage.setItem('pomodoroCount', newCount.toString());
        return newCount;
      });
      
      if (newCycleCount % 4 === 0) {
        setCurrentSession('longBreak');
        setTimeLeft(settings.longBreakTime * 60);
      } else {
        setCurrentSession('shortBreak');
        setTimeLeft(settings.shortBreakTime * 60);
      }
    } else {
      setCurrentSession('focus');
      setTimeLeft(settings.focusTime * 60);
    }
  };

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(getSessionDuration(currentSession) * 60);
  };

  const skipSession = () => {
    setIsRunning(false);
    handleSessionComplete();
  };

  const getSessionDuration = (session) => {
    switch (session) {
      case 'focus': return settings.focusTime;
      case 'shortBreak': return settings.shortBreakTime;
      case 'longBreak': return settings.longBreakTime;
      default: return settings.focusTime;
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getSessionInfo = () => {
    switch (currentSession) {
      case 'focus':
        return { 
          title: 'Deep Focus', 
          icon: <Focus size={20} />,
          gradient: 'from-red-500 via-pink-500 to-purple-600',
          bgGradient: 'from-red-50 via-pink-50 to-purple-50',
          darkBgGradient: 'from-red-900/20 via-pink-900/20 to-purple-900/20',
          shadowColor: 'shadow-red-500/25'
        };
      case 'shortBreak':
        return { 
          title: 'Quick Break', 
          icon: <Coffee size={20} />,
          gradient: 'from-green-500 via-emerald-500 to-teal-600',
          bgGradient: 'from-green-50 via-emerald-50 to-teal-50',
          darkBgGradient: 'from-green-900/20 via-emerald-900/20 to-teal-900/20',
          shadowColor: 'shadow-green-500/25'
        };
      case 'longBreak':
        return { 
          title: 'Long Break', 
          icon: <Sparkles size={20} />,
          gradient: 'from-blue-500 via-cyan-500 to-indigo-600',
          bgGradient: 'from-blue-50 via-cyan-50 to-indigo-50',
          darkBgGradient: 'from-blue-900/20 via-cyan-900/20 to-indigo-900/20',
          shadowColor: 'shadow-blue-500/25'
        };
      default:
        return { 
          title: 'Deep Focus', 
          icon: <Focus size={20} />,
          gradient: 'from-red-500 via-pink-500 to-purple-600',
          bgGradient: 'from-red-50 via-pink-50 to-purple-50',
          darkBgGradient: 'from-red-900/20 via-pink-900/20 to-purple-900/20',
          shadowColor: 'shadow-red-500/25'
        };
    }
  };

  const progress = ((getSessionDuration(currentSession) * 60 - timeLeft) / (getSessionDuration(currentSession) * 60)) * 100;
  const sessionInfo = getSessionInfo();

  return (
    <div className={`min-h-screen transition-all duration-700 ${
      settings.darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 blur-3xl animate-pulse bg-gradient-to-r ${sessionInfo.gradient}`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 blur-3xl animate-pulse bg-gradient-to-r ${sessionInfo.gradient}`} style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl bg-gradient-to-r ${sessionInfo.gradient} shadow-lg`}>
              <Timer className="text-white" size={28} />
            </div>
            <div>
              <h1 className={`text-4xl font-bold bg-gradient-to-r ${sessionInfo.gradient} bg-clip-text text-transparent`}>
                Pomodoro Flow
              </h1>
              <p className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Stay focused, stay productive
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }))}
              className={`p-3 rounded-xl transition-all duration-300 backdrop-blur-md border transform hover:scale-105 ${
                settings.darkMode 
                  ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                  : 'bg-white/70 border-white/40 text-gray-700 hover:bg-white/90 shadow-lg'
              }`}
            >
              {settings.darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-3 rounded-xl transition-all duration-300 backdrop-blur-md border transform hover:scale-105 ${
                settings.darkMode 
                  ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                  : 'bg-white/70 border-white/40 text-gray-700 hover:bg-white/90 shadow-lg'
              }`}
            >
              <Settings size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Enhanced Main Timer */}
          <div className="xl:col-span-2">
            <div className={`p-10 rounded-3xl backdrop-blur-md border transition-all duration-700 shadow-2xl ${
              settings.darkMode 
                ? `bg-gradient-to-br ${sessionInfo.darkBgGradient} border-white/10` 
                : `bg-gradient-to-br ${sessionInfo.bgGradient} border-white/40 bg-white/40`
            }`}>
              <div className="text-center">
                {/* Session Badge */}
                <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r ${sessionInfo.gradient} text-white font-semibold mb-8 shadow-lg transform hover:scale-105 transition-transform`}>
                  {sessionInfo.icon}
                  <span>{sessionInfo.title}</span>
                </div>

                {/* Enhanced Timer Circle */}
                <div className="relative w-80 h-80 mx-auto mb-8">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={settings.darkMode ? '#374151' : '#e5e7eb'}
                      strokeWidth="6"
                      opacity="0.3"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="url(#progressGradient)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                      className="transition-all duration-1000 drop-shadow-lg"
                    />
                    {/* Gradient definition */}
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="50%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Timer Display */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`text-6xl font-bold mb-4 bg-gradient-to-r ${sessionInfo.gradient} bg-clip-text text-transparent font-mono tracking-wider`}>
                        {formatTime(timeLeft)}
                      </div>
                      <div className={`text-lg font-medium ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Session {Math.floor(cycleCount / 4) + 1}.{(cycleCount % 4) + 1}
                      </div>
                      <div className={`text-sm mt-2 ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {Math.round(progress)}% complete
                      </div>
                    </div>
                  </div>

                  {/* Animated pulse ring when running */}
                  {isRunning && (
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${sessionInfo.gradient} opacity-20 animate-ping`}></div>
                  )}
                </div>
                
                {/* Enhanced Timer Controls */}
                <div className="flex justify-center gap-4">
                  <button
                    onClick={isRunning ? pauseTimer : startTimer}
                    className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 bg-gradient-to-r ${sessionInfo.gradient} text-white hover:shadow-2xl transform hover:scale-105 flex items-center gap-3 text-lg shadow-xl`}
                  >
                    {isRunning ? <Pause size={24} /> : <Play size={24} />}
                    {isRunning ? 'Pause' : 'Start'}
                  </button>
                  <button
                    onClick={resetTimer}
                    className={`px-6 py-4 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-md border transform hover:scale-105 ${
                      settings.darkMode 
                        ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                        : 'bg-white/70 border-white/40 text-gray-700 hover:bg-white/90'
                    }`}
                  >
                    <RotateCcw size={24} />
                  </button>
                  <button
                    onClick={skipSession}
                    className={`px-6 py-4 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-md border transform hover:scale-105 ${
                      settings.darkMode 
                        ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                        : 'bg-white/70 border-white/40 text-gray-700 hover:bg-white/90'
                    }`}
                  >
                    <SkipForward size={24} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Side Panel */}
          <div className="space-y-6">
            {/* Enhanced Session Stats */}
            <div className={`p-6 rounded-3xl backdrop-blur-md border transition-all duration-300 ${
              settings.darkMode 
                ? 'bg-white/5 border-white/10' 
                : 'bg-white/40 border-white/40 shadow-xl'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500">
                  <Sparkles className="text-white" size={20} />
                </div>
                <h3 className="text-lg font-semibold">Today's Progress</h3>
              </div>
              <div className="text-center">
                <div className="relative">
                  <div className="text-5xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-2">
                    {completedPomodoros}
                  </div>
                  <div className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Completed Sessions
                  </div>
                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className={`w-full h-2 rounded-full ${settings.darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                        style={{width: `${Math.min(completedPomodoros * 12.5, 100)}%`}}
                      ></div>
                    </div>
                    <div className={`text-xs mt-2 ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Goal: 8 sessions
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Music Player */}
            <div className={`p-6 rounded-3xl backdrop-blur-md border transition-all duration-300 ${
              settings.darkMode 
                ? 'bg-white/5 border-white/10' 
                : 'bg-white/40 border-white/40 shadow-xl'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-xl bg-gradient-to-r ${lofiTracks[currentTrackIndex].color}`}>
                  <Music className="text-white" size={20} />
                </div>
                <h3 className="text-lg font-semibold">Ambient Sounds</h3>
              </div>
              
              <div className="space-y-6">
                {/* Real YouTube Stream Player */}
                <div className={`text-center p-6 rounded-2xl bg-gradient-to-r ${lofiTracks[currentTrackIndex].color} relative overflow-hidden mb-4`}>
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Music size={24} className="text-white" />
                    </div>
                    <div className="text-white font-semibold mb-1">{lofiTracks[currentTrackIndex].title}</div>
                    <div className="text-white/80 text-sm mb-2">{lofiTracks[currentTrackIndex].artist}</div>
                    <div className="text-white/60 text-xs">🎵 Live Stream</div>
                  </div>
                </div>

                {/* YouTube Iframe Player */}
                {isPlaying && (
                  <div className="mb-6 rounded-2xl overflow-hidden shadow-2xl">
                    <iframe
                      width="100%"
                      height="200"
                      src={`https://www.youtube.com/embed/${lofiTracks[currentTrackIndex].embedId}?autoplay=1&loop=1&playlist=${lofiTracks[currentTrackIndex].embedId}&controls=0&modestbranding=1&rel=0`}
                      title={lofiTracks[currentTrackIndex].title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-2xl"
                    ></iframe>
                  </div>
                )}

                {/* Enhanced Music Controls */}
                <div className="flex justify-center items-center gap-4">
                  <button
                    onClick={prevTrack}
                    className={`p-3 rounded-xl transition-all duration-300 backdrop-blur-md border transform hover:scale-110 ${
                      settings.darkMode 
                        ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                        : 'bg-white/70 border-white/40 text-gray-700 hover:bg-white/90'
                    }`}
                  >
                    <SkipForward size={20} className="rotate-180" />
                  </button>
                  
                  <button
                    onClick={toggleMusic}
                    className={`p-4 rounded-2xl bg-gradient-to-r ${lofiTracks[currentTrackIndex].color} text-white hover:shadow-2xl transition-all duration-300 transform hover:scale-110 shadow-lg`}
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </button>
                  
                  <button
                    onClick={nextTrack}
                    className={`p-3 rounded-xl transition-all duration-300 backdrop-blur-md border transform hover:scale-110 ${
                      settings.darkMode 
                        ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                        : 'bg-white/70 border-white/40 text-gray-700 hover:bg-white/90'
                    }`}
                  >
                    <SkipForward size={20} />
                  </button>
                </div>

                {/* Enhanced Track List */}
                <div className="space-y-2">
                  <div className={`text-xs font-medium ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                    🎵 Live Lofi Streams
                  </div>
                  {lofiTracks.map((track, index) => (
                    <button
                      key={track.id}
                      onClick={() => setCurrentTrackIndex(index)}
                      className={`w-full text-left p-3 rounded-xl text-sm transition-all duration-300 transform hover:scale-102 ${
                        index === currentTrackIndex 
                          ? `bg-gradient-to-r ${track.color} text-white shadow-lg` 
                          : settings.darkMode 
                            ? 'hover:bg-white/10 text-gray-300' 
                            : 'hover:bg-white/60 text-gray-700'
                      }`}
                    >
                      <div className="font-medium">{track.title}</div>
                      <div className={`${index === currentTrackIndex ? 'text-white/80' : 'opacity-60'} text-xs`}>
                        {track.artist} • Live Stream
                      </div>
                    </button>
                  ))}
                </div>

                {/* Enhanced Now Playing Indicator */}
                {isPlaying && (
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <div 
                          key={i}
                          className={`w-1 h-4 rounded-full bg-gradient-to-t ${lofiTracks[currentTrackIndex].color} animate-pulse`}
                          style={{animationDelay: `${i * 0.2}s`}}
                        ></div>
                      ))}
                    </div>
                    <span className={`ml-2 ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Now Playing
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Settings Panel */}
            {showSettings && (
              <div className={`p-6 rounded-3xl backdrop-blur-md border transition-all duration-300 ${
                settings.darkMode 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-white/40 border-white/40 shadow-xl'
              }`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-gray-500 to-gray-600">
                    <Settings className="text-white" size={20} />
                  </div>
                  <h3 className="text-lg font-semibold">Settings</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Focus Time (minutes)</label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={settings.focusTime}
                      onChange={(e) => setSettings(prev => ({ ...prev, focusTime: parseInt(e.target.value) }))}
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                        settings.darkMode 
                          ? 'bg-white/5 border-white/20 text-white focus:border-white/40' 
                          : 'bg-white/70 border-white/40 text-gray-700 focus:border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Short Break (minutes)</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={settings.shortBreakTime}
                      onChange={(e) => setSettings(prev => ({ ...prev, shortBreakTime: parseInt(e.target.value) }))}
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                        settings.darkMode 
                          ? 'bg-white/5 border-white/20 text-white focus:border-white/40' 
                          : 'bg-white/70 border-white/40 text-gray-700 focus:border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Long Break (minutes)</label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={settings.longBreakTime}
                      onChange={(e) => setSettings(prev => ({ ...prev, longBreakTime: parseInt(e.target.value) }))}
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                        settings.darkMode 
                          ? 'bg-white/5 border-white/20 text-white focus:border-white/40' 
                          : 'bg-white/70 border-white/40 text-gray-700 focus:border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
                    />
                  </div>
                  
                  {/* Toggle Settings */}
                  <div className="space-y-4 pt-4 border-t border-white/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Volume2 size={18} className={`${settings.soundEnabled ? 'text-green-500' : settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className="text-sm font-medium">Sound Notifications</span>
                      </div>
                      <button
                        onClick={() => setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
                        className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                          settings.soundEnabled 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                            : settings.darkMode ? 'bg-gray-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`absolute w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-300 top-0.5 ${
                          settings.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                        }`}></div>
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Sparkles size={18} className={`${settings.notificationsEnabled ? 'text-blue-500' : settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className="text-sm font-medium">Browser Notifications</span>
                      </div>
                      <button
                        onClick={() => setSettings(prev => ({ ...prev, notificationsEnabled: !prev.notificationsEnabled }))}
                        className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                          settings.notificationsEnabled 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                            : settings.darkMode ? 'bg-gray-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`absolute w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-300 top-0.5 ${
                          settings.notificationsEnabled ? 'translate-x-6' : 'translate-x-0.5'
                        }`}></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroApp;