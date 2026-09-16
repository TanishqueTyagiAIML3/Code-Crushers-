import React, { useState, useEffect } from 'react';
import { 
  Clock, Filter, Video, BookOpen, GitFork, Image as ImageIcon,
  Trash2, Download, ArrowUpRight, CheckCircle, RefreshCw, User,
  Award, MessageSquare, ChevronRight, Eye, Sparkles, Inbox, PlusCircle,
  AlertCircle, Code, FileText, Copy, Check, X, Lightbulb, HelpCircle
} from 'lucide-react';
import { HistoryItem, LearningToolId, DialectOption } from '../types';
import { getTranslations } from '../i18n/translations';
import { 
  CURRENT_USER_ID, 
  CURRENT_USER_EMAIL, 
  fetchUserHistory, 
  deleteUserHistoryItem,
  clearUserHistory 
} from '../utils/historyService';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface HistoryDashboardSectionProps {
  selectedLanguage?: DialectOption;
  onNavigateToTool: (toolId: LearningToolId, itemData?: any) => void;
}

export function HistoryDashboardSection({
  selectedLanguage: propLanguage,
  onNavigateToTool
}: HistoryDashboardSectionProps) {
  const { selectedLanguage: globalLanguage } = useLanguage();
  const selectedLanguage = propLanguage || globalLanguage;
  const t = getTranslations(selectedLanguage.id);
  const { user } = useAuth();

  const activeUserId = user ? user.uid : CURRENT_USER_ID;
  const activeUserEmail = user ? (user.email || user.displayName || 'Google Account') : CURRENT_USER_EMAIL;

  // 1. Strict real-time state: starts with EMPTY array (NO hardcoded/dummy records)
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [inspectModalItem, setInspectModalItem] = useState<HistoryItem | null>(null);
  const [inspectViewMode, setInspectViewMode] = useState<'formatted' | 'raw'>('formatted');
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState<boolean>(false);

  // 2. Dynamic data fetching: loads real user history on mount and category switch
  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const data = await fetchUserHistory(activeUserId, selectedCategory);
      setHistoryItems(data);
    } catch (e) {
      console.error("Failed to load user history:", e);
      setHistoryItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [selectedCategory, activeUserId]);

  // 3. Real-Time UI Updates: listener triggers immediate prepend when new actions occur
  useEffect(() => {
    const handleHistoryUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<HistoryItem>;
      const newItem = customEvent.detail;
      if (!newItem) return;

      // Strictly verify item belongs to currently active user
      if (newItem.userId === activeUserId) {
        if (selectedCategory === 'all' || newItem.category === selectedCategory) {
          setHistoryItems(prev => {
            const filtered = prev.filter(item => item.id !== newItem.id);
            return [newItem, ...filtered];
          });
        }
        setActionNotice(`New activity recorded: "${newItem.title}"`);
        setTimeout(() => setActionNotice(null), 4000);
      }
    };

    const handleHistoryDeleted = (event: Event) => {
      const customEvent = event as CustomEvent<{ id: string; userId: string }>;
      const { id, userId } = customEvent.detail || {};
      if (userId === activeUserId && id) {
        setHistoryItems(prev => prev.filter(item => item.id !== id));
      }
    };

    const handleHistoryCleared = (event: Event) => {
      const customEvent = event as CustomEvent<{ userId: string }>;
      if (customEvent.detail?.userId === activeUserId) {
        setHistoryItems([]);
      }
    };

    window.addEventListener('app:history_updated', handleHistoryUpdated);
    window.addEventListener('app:history_deleted', handleHistoryDeleted);
    window.addEventListener('app:history_cleared', handleHistoryCleared);

    return () => {
      window.removeEventListener('app:history_updated', handleHistoryUpdated);
      window.removeEventListener('app:history_deleted', handleHistoryDeleted);
      window.removeEventListener('app:history_cleared', handleHistoryCleared);
    };
  }, [selectedCategory, activeUserId]);

  // Delete an item
  const handleDeleteItem = async (id: string) => {
    try {
      await deleteUserHistoryItem(id, activeUserId);
      setHistoryItems(prev => prev.filter(item => item.id !== id));
      if (inspectModalItem?.id === id) setInspectModalItem(null);
    } catch (e) {
      console.error("Failed to delete history item:", e);
    }
  };

  // Clear all history for active user via in-app confirmation modal
  const handleClearAll = () => {
    setShowClearConfirmModal(true);
  };

  const handleConfirmClearAll = async () => {
    try {
      await clearUserHistory(activeUserId);
      setHistoryItems([]);
      setShowClearConfirmModal(false);
      setActionNotice("All activity history has been cleared.");
      setTimeout(() => setActionNotice(null), 3500);
    } catch (e) {
      console.error("Failed to clear user history:", e);
    }
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(historyItems, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `shikshasathi-history-${CURRENT_USER_ID.replace(/[^a-zA-Z0-9]/g, '_')}-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'interview':
        return <Video className="w-4 h-4 text-orange-600" />;
      case 'quiz':
        return <Award className="w-4 h-4 text-emerald-600" />;
      case 'mindmap':
        return <GitFork className="w-4 h-4 text-sky-600" />;
      case 'diagram':
        return <ImageIcon className="w-4 h-4 text-purple-600" />;
      case 'flashcards':
        return <BookOpen className="w-4 h-4 text-indigo-600" />;
      default:
        return <MessageSquare className="w-4 h-4 text-amber-600" />;
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'interview':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'quiz':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'mindmap':
        return 'bg-sky-100 text-sky-700 border-sky-200';
      case 'diagram':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'flashcards':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default:
        return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-6 animate-fade-in">
      {/* Real-Time Notification Banner */}
      {actionNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-2xl flex items-center justify-between text-xs font-semibold animate-fade-in shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{actionNotice}</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-mono">Live Updated</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 section-header-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/70 border border-orange-200/50 dark:border-orange-800/60 text-[#ea580c] dark:text-orange-400 text-xs font-bold mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Activity History & Database Store</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight section-header-title">
            User Learning History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 mt-1 section-header-desc">
            Real-time dynamic logs of mock interviews, adaptive quizzes, D3 mind maps, and vision diagrams for your account.
          </p>
        </div>

        {/* Active User Profile Badge & Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-xs text-slate-700 dark:text-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <User className="w-3.5 h-3.5 text-[#ea580c]" />
            <span className="font-semibold">{activeUserEmail}</span>
            {user && (
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded-md">
                Google Verified
              </span>
            )}
          </div>

          {historyItems.length > 0 && (
            <>
              <button
                onClick={handleExportJSON}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 shadow-sm transition-all"
                title="Export active user history as JSON"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export JSON</span>
              </button>

              <button
                onClick={handleClearAll}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold text-rose-700 transition-all"
                title="Clear all activity history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm">
        {[
          { id: 'all', label: 'All Records' },
          { id: 'interview', label: 'Mock Interviews' },
          { id: 'quiz', label: 'Quizzes' },
          { id: 'mindmap', label: 'D3 Mind Maps' },
          { id: 'diagram', label: 'Vision Diagrams' },
          { id: 'chat', label: 'Doubt Chats' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === tab.id
                ? 'bg-[#ea580c] text-white shadow-md shadow-orange-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}

        <button
          onClick={loadHistory}
          title="Refresh History from Database"
          className="ml-auto p-2 text-slate-400 hover:text-[#ea580c] rounded-xl hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* History Items Section */}
      <div className="space-y-3">
        {/* Loading State Skeleton */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm animate-pulse flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100" />
                  <div className="space-y-2">
                    <div className="w-48 h-4 bg-slate-100 rounded" />
                    <div className="w-80 h-3 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="w-24 h-8 bg-slate-100 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State UI: Displayed when user's history array length === 0 and not loading */}
        {!isLoading && historyItems.length === 0 && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80 shadow-sm space-y-6 animate-fade-in">
            <div className="w-16 h-16 rounded-3xl bg-orange-50 border border-orange-200/60 flex items-center justify-center mx-auto text-[#ea580c] shadow-inner">
              <Inbox className="w-8 h-8 stroke-[1.8]" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                No activity yet
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                No activity yet. Start a mock interview, generate a quiz, or upload a diagram to see your history here.
              </p>
            </div>

            {/* Quick Action Interactive Cards to generate real activity */}
            <div className="pt-2 max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => onNavigateToTool('mock-interview')}
                className="p-4 rounded-2xl border border-orange-100 bg-orange-50/40 hover:bg-orange-50 hover:border-orange-300 text-left transition-all group flex items-start gap-3 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#ea580c] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#ea580c] transition-colors">
                    Start Mock Interview
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Face detection, resume cross-exam, and feedback.
                  </p>
                </div>
              </button>

              <button
                onClick={() => onNavigateToTool('adaptive-quiz')}
                className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/40 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-all group flex items-start gap-3 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Generate Context Quiz
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Adaptive questions tailored to your dialect.
                  </p>
                </div>
              </button>

              <button
                onClick={() => onNavigateToTool('mind-maps')}
                className="p-4 rounded-2xl border border-sky-100 bg-sky-50/40 hover:bg-sky-50 hover:border-sky-300 text-left transition-all group flex items-start gap-3 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <GitFork className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                    Build D3 Mind Map
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Hierarchical tree breakdowns of topics.
                  </p>
                </div>
              </button>

              <button
                onClick={() => onNavigateToTool('diagram-explainer')}
                className="p-4 rounded-2xl border border-purple-100 bg-purple-50/40 hover:bg-purple-50 hover:border-purple-300 text-left transition-all group flex items-start gap-3 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                    Upload & Explain Diagram
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Multimodal Vision analysis and voice playback.
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Real History Items List */}
        {!isLoading && historyItems.length > 0 && (
          <div className="space-y-3">
            {historyItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                    {getCategoryIcon(item.category)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900">
                        {item.title}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${getCategoryBadgeClass(item.category)}`}>
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                      {item.summary}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                      <span>Recorded: {new Date(item.createdAt).toLocaleString()}</span>
                      <span>•</span>
                      <span className="text-slate-500">User: {item.userId}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => {
                      setInspectModalItem(item);
                      setInspectViewMode('formatted');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>View Details</span>
                  </button>

                  <button
                    onClick={() => {
                      if (item.category === 'interview') onNavigateToTool('mock-interview', item.data);
                      else if (item.category === 'quiz') onNavigateToTool('adaptive-quiz', item.data);
                      else if (item.category === 'flashcards') onNavigateToTool('flashcards', item.data);
                      else if (item.category === 'mindmap') onNavigateToTool('mind-maps', item.data);
                      else if (item.category === 'diagram') onNavigateToTool('diagram-explainer', item.data);
                      else onNavigateToTool('ai-chat', item.data);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold shadow-sm flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <span>Launch</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    title="Delete record from database"
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity Details & Inspector Modal */}
      {inspectModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[88vh] flex flex-col space-y-4 shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0 text-[#ea580c] mt-0.5">
                  {getCategoryIcon(inspectModalItem.category)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-black text-slate-900">
                      {inspectModalItem.title}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${getCategoryBadgeClass(inspectModalItem.category)}`}>
                      {inspectModalItem.category}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-2 flex-wrap">
                    <span>Recorded: {new Date(inspectModalItem.createdAt).toLocaleString()}</span>
                    <span>•</span>
                    <span>User: {inspectModalItem.userId}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setInspectModalItem(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* View Mode Switcher: Human Readable Preview vs Technical JSON */}
            <div className="flex items-center justify-between gap-2 bg-slate-100 p-1 rounded-2xl">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setInspectViewMode('formatted')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    inspectViewMode === 'formatted'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-[#ea580c]" />
                  <span>Readable Preview</span>
                </button>

                <button
                  onClick={() => setInspectViewMode('raw')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    inspectViewMode === 'raw'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Code className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Technical JSON / Code</span>
                </button>
              </div>

              {inspectViewMode === 'raw' && (
                <button
                  onClick={() => {
                    const str = JSON.stringify(inspectModalItem.data || inspectModalItem, null, 2);
                    navigator.clipboard.writeText(str);
                    setCopiedJson(true);
                    setTimeout(() => setCopiedJson(false), 2000);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                >
                  {copiedJson ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-500" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto pr-1">
              {inspectViewMode === 'formatted' ? (
                <div className="space-y-4">
                  {/* Summary Callout */}
                  {inspectModalItem.summary && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
                      <span className="font-bold text-slate-900">Activity Summary: </span>
                      {inspectModalItem.summary}
                    </div>
                  )}

                  {/* Category 1: Flashcards Formatted Breakdown */}
                  {(() => {
                    const d = inspectModalItem.data;
                    const cards = Array.isArray(d) ? d : (d?.flashcards && Array.isArray(d.flashcards) ? d.flashcards : null);
                    if (cards && cards.length > 0 && cards[0]?.frontQuestion) {
                      return (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs text-slate-500 pb-1 border-b border-slate-100">
                            <span className="font-bold text-slate-800">Generated Flashcards ({cards.length})</span>
                            <span className="text-[11px] text-slate-400">High-yield study questions & answers</span>
                          </div>
                          <div className="grid grid-cols-1 gap-3">
                            {cards.map((card: any, idx: number) => (
                              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 hover:border-orange-200 transition-colors">
                                <div className="flex items-center justify-between">
                                  <span className="px-2.5 py-0.5 rounded-lg bg-orange-100 text-[#ea580c] text-[10px] font-black uppercase tracking-wider">
                                    Card {idx + 1} of {cards.length}
                                  </span>
                                  {card.topic && (
                                    <span className="text-[11px] font-semibold text-slate-500">
                                      Topic: {card.topic}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Question</p>
                                  <p className="text-xs font-bold text-slate-900 mt-0.5 leading-relaxed">
                                    {card.frontQuestion}
                                  </p>
                                </div>
                                <div className="p-3 rounded-xl bg-white border border-slate-100">
                                  <p className="text-[10px] uppercase tracking-wider font-bold text-emerald-600">Answer</p>
                                  <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                                    {card.backAnswer}
                                  </p>
                                </div>
                                {card.keyTakeaway && (
                                  <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/60 flex items-start gap-2 text-xs text-amber-900">
                                    <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                                    <p><span className="font-bold">Key Takeaway: </span>{card.keyTakeaway}</p>
                                  </div>
                                )}
                                {card.dialectTranslation && (
                                  <div className="text-[11px] text-indigo-600 italic pl-1">
                                    🗣️ Dialect: "{card.dialectTranslation}"
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Category 2: Quiz Formatted Breakdown */}
                  {(() => {
                    const d = inspectModalItem.data;
                    const quizQuestions = d?.questions || (Array.isArray(d) ? d : null);
                    if (quizQuestions && Array.isArray(quizQuestions) && quizQuestions.length > 0 && quizQuestions[0]?.options) {
                      return (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs text-slate-500 pb-1 border-b border-slate-100">
                            <span className="font-bold text-slate-800">Quiz Questions ({quizQuestions.length})</span>
                            <span className="text-[11px] text-emerald-600 font-semibold">✓ Correct options marked in green</span>
                          </div>
                          <div className="space-y-3">
                            {quizQuestions.map((q: any, idx: number) => (
                              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                                <div className="flex items-start gap-2">
                                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                    {idx + 1}
                                  </span>
                                  <p className="text-xs font-bold text-slate-900 leading-relaxed">
                                    {q.question}
                                  </p>
                                </div>
                                {q.options && Array.isArray(q.options) && (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-7">
                                    {q.options.map((opt: string, optIdx: number) => {
                                      const isCorrect = q.correctAnswer === optIdx;
                                      return (
                                        <div 
                                          key={optIdx}
                                          className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                                            isCorrect 
                                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold shadow-xs' 
                                              : 'bg-white border-slate-200 text-slate-600'
                                          }`}
                                        >
                                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                                            isCorrect ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 text-slate-500'
                                          }`}>
                                            {String.fromCharCode(65 + optIdx)}
                                          </span>
                                          <span>{opt}</span>
                                          {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-600 ml-auto shrink-0" />}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                                {q.explanation && (
                                  <div className="pl-7 text-xs text-slate-500 bg-white p-2.5 rounded-xl border border-slate-100">
                                    <span className="font-bold text-slate-700">Explanation: </span>
                                    {q.explanation}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Category 3: Interview Formatted Breakdown */}
                  {(() => {
                    const d = inspectModalItem.data;
                    if (inspectModalItem.category === 'interview' || (d && (d.jobRole || d.score !== undefined || d.strengths))) {
                      return (
                        <div className="space-y-4">
                          {d?.jobRole && (
                            <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-between">
                              <span className="text-xs font-bold text-orange-950">Target Role: {d.jobRole}</span>
                              {d.score !== undefined && (
                                <span className="px-3 py-1 rounded-xl bg-[#ea580c] text-white font-bold text-xs">
                                  Score: {d.score}/100
                                </span>
                              )}
                            </div>
                          )}
                          {d?.feedback && (
                            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                              <span className="font-bold text-slate-900 block mb-1">Feedback:</span>
                              {d.feedback}
                            </div>
                          )}
                          {d?.strengths && Array.isArray(d.strengths) && d.strengths.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                                <span>Key Strengths</span>
                              </h4>
                              <ul className="space-y-1.5 pl-5 list-disc text-xs text-slate-700">
                                {d.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
                              </ul>
                            </div>
                          )}
                          {d?.improvements && Array.isArray(d.improvements) && d.improvements.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                                <Lightbulb className="w-4 h-4 text-amber-600" />
                                <span>Areas for Improvement</span>
                              </h4>
                              <ul className="space-y-1.5 pl-5 list-disc text-xs text-slate-700">
                                {d.improvements.map((imp: string, i: number) => <li key={i}>{imp}</li>)}
                              </ul>
                            </div>
                          )}
                          {d?.transcript && Array.isArray(d.transcript) && d.transcript.length > 0 && (
                            <div className="space-y-2 pt-2 border-t border-slate-100">
                              <h4 className="text-xs font-bold text-slate-700">Interview Transcript Excerpt</h4>
                              <div className="space-y-2 max-h-48 overflow-y-auto">
                                {d.transcript.map((msg: any, i: number) => (
                                  <div key={i} className={`p-2.5 rounded-xl text-xs ${
                                    msg.speaker === 'Interviewer' || msg.speaker === 'AI' 
                                      ? 'bg-slate-100 text-slate-800' 
                                      : 'bg-orange-50 text-orange-950 ml-4'
                                  }`}>
                                    <span className="font-bold">{msg.speaker || 'User'}: </span>
                                    <span>{msg.message || msg.text}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Category 4: Diagram Formatted Breakdown */}
                  {(() => {
                    const d = inspectModalItem.data;
                    if (inspectModalItem.category === 'diagram' || (d && (d.diagramTitle || d.components))) {
                      return (
                        <div className="space-y-4">
                          {d?.summary && (
                            <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 text-xs text-slate-700">
                              <span className="font-bold text-purple-900 block mb-1">Visual Summary:</span>
                              {d.summary}
                            </div>
                          )}
                          {d?.explanationInLanguage && (
                            <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200/60 text-xs italic text-slate-800">
                              <span className="font-bold not-italic text-orange-900 block mb-1">Spoken Dialect Explanation:</span>
                              "{d.explanationInLanguage}"
                            </div>
                          )}
                          {d?.components && Array.isArray(d.components) && (
                            <div className="space-y-2">
                              <h4 className="text-xs font-bold text-slate-800">Key Components ({d.components.length})</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {d.components.map((comp: any, i: number) => (
                                  <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                                    <div className="font-bold text-slate-800 flex items-center justify-between">
                                      <span>{comp.name}</span>
                                      {comp.visualLocation && <span className="text-[10px] text-slate-400 font-normal">{comp.visualLocation}</span>}
                                    </div>
                                    <p className="text-slate-600 mt-0.5">{comp.functionDescription}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {d?.stepByStepProcess && Array.isArray(d.stepByStepProcess) && (
                            <div className="space-y-2">
                              <h4 className="text-xs font-bold text-slate-800">Step-by-Step Flow</h4>
                              <div className="space-y-1.5">
                                {d.stepByStepProcess.map((step: string, i: number) => (
                                  <div key={i} className="p-2.5 rounded-xl bg-orange-50/40 border border-orange-100 text-xs flex items-start gap-2">
                                    <span className="font-bold text-orange-600 shrink-0">Step {i + 1}:</span>
                                    <span className="text-slate-700">{step}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Category 5: Mindmap Breakdown */}
                  {(() => {
                    const d = inspectModalItem.data;
                    if (inspectModalItem.category === 'mindmap' || (d && (d.centralIdea || d.nodes))) {
                      return (
                        <div className="space-y-3">
                          {d?.centralIdea && (
                            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-xs">
                              <span className="font-bold text-sky-900 block mb-1">Central Idea / Core Topic:</span>
                              <p className="text-slate-700">{d.centralIdea}</p>
                            </div>
                          )}
                          {d?.nodes && Array.isArray(d.nodes) && (
                            <div className="space-y-2">
                              <h4 className="text-xs font-bold text-slate-800">Mind Map Branches & Concepts</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {d.nodes.map((node: any, i: number) => (
                                  <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                                    <span className="font-bold text-sky-700 block">{node.label || node.id}</span>
                                    {node.description && <p className="text-slate-600 mt-0.5">{node.description}</p>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Generic Fallback for Other Data Objects */}
                  {(!inspectModalItem.data || (typeof inspectModalItem.data === 'object' && Object.keys(inspectModalItem.data).length === 0)) && (
                    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                      <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                      <p className="text-xs font-bold text-slate-800">Activity Recorded Successfully</p>
                      <p className="text-xs text-slate-500">You can relaunch this activity anytime using the Launch button below.</p>
                    </div>
                  )}
                </div>
              ) : (
                /* Technical Raw JSON Code View */
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <Code className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>This is the technical JSON record saved in your database for this session.</span>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-2xl text-emerald-400 font-mono text-xs leading-relaxed max-h-[50vh] overflow-y-auto border border-slate-800 shadow-inner">
                    <pre>{JSON.stringify(inspectModalItem.data || inspectModalItem, null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  const item = inspectModalItem;
                  setInspectModalItem(null);
                  if (item.category === 'interview') onNavigateToTool('mock-interview', item.data);
                  else if (item.category === 'quiz') onNavigateToTool('adaptive-quiz', item.data);
                  else if (item.category === 'flashcards') onNavigateToTool('flashcards', item.data);
                  else if (item.category === 'mindmap') onNavigateToTool('mind-maps', item.data);
                  else if (item.category === 'diagram') onNavigateToTool('diagram-explainer', item.data);
                  else onNavigateToTool('ai-chat', item.data);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Launch this Activity in Tool</span>
              </button>

              <button
                onClick={() => setInspectModalItem(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All History In-App Confirmation Modal */}
      {showClearConfirmModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setShowClearConfirmModal(false)}
        >
          <div 
            className="w-full max-w-md p-6 rounded-3xl bg-white border border-slate-200 text-slate-900 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">Clear All Activity History?</h3>
                  <span className="text-xs text-rose-600 font-semibold">User: {activeUserId}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowClearConfirmModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Are you sure you want to permanently clear your entire activity history? This includes recorded interviews, quizzes, mind maps, and vision diagrams. This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirmModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClearAll}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Clear All</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
