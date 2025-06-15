import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History as HistoryIcon,
  Search,
  Filter,
  Calendar,
  RefreshCw,
  FileText,
  BookOpen,
  Languages,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Download,
  Trash2,
  ChevronDown,
  ArrowUpDown,
  Loader2
} from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

type ActivityType = 'paraphrase' | 'summary' | 'translation';
type ActivityStatus = 'success' | 'pending' | 'failed';

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  originalText: string;
  resultText: string;
  timestamp: Date;
  status: ActivityStatus;
  mode?: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  readabilityScore?: number;
  compressionRatio?: number;
  confidence?: number;
}

export default function HistoryInterface() {
  const { user } = useAuthStore();
  const { 
    history, 
    summaryHistory, 
    translationHistory, 
    isLoadingHistory,
    loadHistory 
  } = useAppStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ActivityType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<ActivityStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'type' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Load history when component mounts or user changes
  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user, loadHistory]);

  // Combine all activities into a single array
  const allActivities: Activity[] = useMemo(() => {
    const activities: Activity[] = [];

    // Add paraphrase history
    history.forEach(item => {
      activities.push({
        id: item.id,
        type: 'paraphrase',
        title: `Paraphrased text (${item.mode})`,
        originalText: item.originalText,
        resultText: item.paraphrasedText,
        timestamp: item.timestamp,
        status: 'success',
        mode: item.mode,
        readabilityScore: item.readabilityScore,
      });
    });

    // Add summary history
    summaryHistory.forEach(item => {
      activities.push({
        id: item.id,
        type: 'summary',
        title: `Summarized text (${item.mode})`,
        originalText: item.originalText,
        resultText: item.summaryText,
        timestamp: item.timestamp,
        status: 'success',
        mode: item.mode,
        compressionRatio: item.compressionRatio,
      });
    });

    // Add translation history
    translationHistory.forEach(item => {
      activities.push({
        id: item.id,
        type: 'translation',
        title: `Translated text (${item.sourceLanguage} → ${item.targetLanguage})`,
        originalText: item.originalText,
        resultText: item.translatedText,
        timestamp: item.timestamp,
        status: 'success',
        sourceLanguage: item.sourceLanguage,
        targetLanguage: item.targetLanguage,
        confidence: item.confidence,
      });
    });

    return activities;
  }, [history, summaryHistory, translationHistory]);

  // Filter and sort activities
  const filteredActivities = useMemo(() => {
    let filtered = allActivities;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(activity =>
        activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.originalText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.resultText.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(activity => activity.type === selectedType);
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(activity => activity.status === selectedStatus);
    }

    // Sort activities
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = a.timestamp.getTime() - b.timestamp.getTime();
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [allActivities, searchQuery, selectedType, selectedStatus, sortBy, sortOrder]);

  // Group activities by date
  const groupedActivities = useMemo(() => {
    const groups: { [key: string]: Activity[] } = {};
    
    filteredActivities.forEach(activity => {
      const dateKey = activity.timestamp.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(activity);
    });

    return groups;
  }, [filteredActivities]);

  const handleRefresh = async () => {
    if (!user) return;
    
    setIsRefreshing(true);
    try {
      await loadHistory();
      toast.success('History refreshed!');
    } catch (error) {
      toast.error('Failed to refresh history');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExportActivity = (activity: Activity) => {
    const data = {
      type: activity.type,
      title: activity.title,
      originalText: activity.originalText,
      resultText: activity.resultText,
      timestamp: activity.timestamp.toISOString(),
      metadata: {
        mode: activity.mode,
        sourceLanguage: activity.sourceLanguage,
        targetLanguage: activity.targetLanguage,
        readabilityScore: activity.readabilityScore,
        compressionRatio: activity.compressionRatio,
        confidence: activity.confidence,
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activity.type}-${activity.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Activity exported!');
  };

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'paraphrase':
        return FileText;
      case 'summary':
        return BookOpen;
      case 'translation':
        return Languages;
    }
  };

  const getActivityColor = (type: ActivityType) => {
    switch (type) {
      case 'paraphrase':
        return 'from-indigo-500 to-purple-600';
      case 'summary':
        return 'from-emerald-500 to-teal-600';
      case 'translation':
        return 'from-blue-500 to-cyan-600';
    }
  };

  const getStatusIcon = (status: ActivityStatus) => {
    switch (status) {
      case 'success':
        return CheckCircle;
      case 'pending':
        return AlertCircle;
      case 'failed':
        return XCircle;
    }
  };

  const getStatusColor = (status: ActivityStatus) => {
    switch (status) {
      case 'success':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'failed':
        return 'text-red-500';
    }
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  if (isLoadingHistory) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center h-64">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600 dark:text-indigo-400" />
          <span className="text-lg text-slate-600 dark:text-slate-300">Loading history...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-600 to-slate-800 dark:from-slate-300 dark:to-slate-100 bg-clip-text text-transparent mb-4">
          Activity History
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          View and manage your past paraphrasing, summarization, and translation activities
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 rounded-2xl space-y-4"
      >
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 glass-input rounded-xl"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 glass-button rounded-xl flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 glass-button rounded-xl flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </motion.button>

          <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
            <span>{filteredActivities.length} activities</span>
          </div>
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-white/10"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Activity Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as ActivityType | 'all')}
                  className="w-full p-2 glass-input rounded-xl text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="paraphrase">Paraphrase</option>
                  <option value="summary">Summary</option>
                  <option value="translation">Translation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as ActivityStatus | 'all')}
                  className="w-full p-2 glass-input rounded-xl text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="success">Success</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'type' | 'status')}
                  className="w-full p-2 glass-input rounded-xl text-sm"
                >
                  <option value="date">Date</option>
                  <option value="type">Type</option>
                  <option value="status">Status</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Order
                </label>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="w-full p-2 glass-button rounded-xl flex items-center justify-center space-x-2 text-sm"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Activities List */}
      <div className="space-y-6">
        {Object.keys(groupedActivities).length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-12 rounded-2xl text-center"
          >
            <HistoryIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
              No Activities Found
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              {searchQuery || selectedType !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Start using the app to see your activity history here'
              }
            </p>
          </motion.div>
        ) : (
          Object.entries(groupedActivities).map(([dateKey, activities], groupIndex) => (
            <motion.div
              key={dateKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIndex * 0.1 }}
              className="space-y-4"
            >
              {/* Date Header */}
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                  {new Date(dateKey).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h3>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
              </div>

              {/* Activities for this date */}
              <div className="space-y-3">
                {activities.map((activity, activityIndex) => {
                  const ActivityIcon = getActivityIcon(activity.type);
                  const StatusIcon = getStatusIcon(activity.status);
                  
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (groupIndex * 0.1) + (activityIndex * 0.05) }}
                      className="glass-card p-6 rounded-xl hover:bg-white/10 transition-all duration-200 cursor-pointer"
                      onClick={() => setSelectedActivity(activity)}
                    >
                      <div className="flex items-start space-x-4">
                        {/* Activity Icon */}
                        <div className={`p-3 bg-gradient-to-r ${getActivityColor(activity.type)} rounded-xl flex-shrink-0`}>
                          <ActivityIcon className="w-5 h-5 text-white" />
                        </div>

                        {/* Activity Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">
                                {activity.title}
                              </h4>
                              <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{formatRelativeTime(activity.timestamp)}</span>
                                </div>
                                <div className={`flex items-center space-x-1 ${getStatusColor(activity.status)}`}>
                                  <StatusIcon className="w-4 h-4" />
                                  <span className="capitalize">{activity.status}</span>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedActivity(activity);
                                }}
                                className="p-2 glass-button rounded-lg"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleExportActivity(activity);
                                }}
                                className="p-2 glass-button rounded-lg"
                                title="Export"
                              >
                                <Download className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>

                          {/* Preview Text */}
                          <div className="space-y-2">
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                              <span className="font-medium">Original:</span> {activity.originalText}
                            </p>
                            <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
                              <span className="font-medium">Result:</span> {activity.resultText}
                            </p>
                          </div>

                          {/* Metadata */}
                          <div className="flex items-center space-x-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
                            {activity.readabilityScore && (
                              <span>Readability: {activity.readabilityScore}/10</span>
                            )}
                            {activity.compressionRatio && (
                              <span>Compression: {activity.compressionRatio}%</span>
                            )}
                            {activity.confidence && (
                              <span>Confidence: {activity.confidence}%</span>
                            )}
                            {activity.mode && (
                              <span>Mode: {activity.mode}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Activity Detail Modal */}
      <AnimatePresence>
        {selectedActivity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedActivity(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 bg-gradient-to-r ${getActivityColor(selectedActivity.type)} rounded-xl`}>
                    {React.createElement(getActivityIcon(selectedActivity.type), { className: "w-6 h-6 text-white" })}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                      {selectedActivity.title}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      {selectedActivity.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="p-2 glass-button rounded-xl"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Original Text */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">
                    Original Text
                  </h3>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {selectedActivity.originalText}
                    </p>
                  </div>
                </div>

                {/* Result Text */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">
                    Result
                  </h3>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {selectedActivity.resultText}
                    </p>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                {selectedActivity.readabilityScore && (
                  <div className="text-center p-3 glass-card rounded-xl">
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {selectedActivity.readabilityScore}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Readability</div>
                  </div>
                )}
                {selectedActivity.compressionRatio && (
                  <div className="text-center p-3 glass-card rounded-xl">
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {selectedActivity.compressionRatio}%
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Compression</div>
                  </div>
                )}
                {selectedActivity.confidence && (
                  <div className="text-center p-3 glass-card rounded-xl">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {selectedActivity.confidence}%
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Confidence</div>
                  </div>
                )}
                <div className="text-center p-3 glass-card rounded-xl">
                  <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">
                    {selectedActivity.originalText.split(' ').length}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Words</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleExportActivity(selectedActivity)}
                  className="px-6 py-3 glass-button rounded-xl flex items-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Export</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedActivity(null)}
                  className="px-6 py-3 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-xl font-semibold"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}