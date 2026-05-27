import React, { useState } from 'react';
import {
  Newspaper, ExternalLink, TrendingUp, TrendingDown, Minus,
  AlertTriangle, CheckCircle, Search, Filter
} from 'lucide-react';
import type { DetailedPoliticianData } from '../../data/politicians';

interface NewsArticle {
  id: string;
  title: string;
  publisher: string;
  date: string;
  sentiment: 'POSITIVE_OUTCOME' | 'CRITICAL_ALLEGATION' | 'NEUTRAL_COVERAGE' | 'CONTROVERSY' | 'ACHIEVEMENT' | 'COURT_CASE';
  category: string;
  summary: string;
  url: string;
}

interface Props {
  politician: DetailedPoliticianData;
}

const SENTIMENT_CONFIG = {
  POSITIVE_OUTCOME: {
    label: 'POSITIVE',
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.1)',
    icon: TrendingUp,
  },
  CRITICAL_ALLEGATION: {
    label: 'ALLEGATION',
    color: '#FF4D4D',
    bg: 'rgba(255, 77, 77, 0.1)',
    icon: AlertTriangle,
  },
  NEUTRAL_COVERAGE: {
    label: 'NEUTRAL',
    color: '#8888AA',
    bg: 'rgba(136, 136, 170, 0.1)',
    icon: Minus,
  },
  CONTROVERSY: {
    label: 'CONTROVERSY',
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.1)',
    icon: AlertTriangle,
  },
  ACHIEVEMENT: {
    label: 'ACHIEVEMENT',
    color: '#E8A020',
    bg: 'rgba(232, 160, 32, 0.1)',
    icon: TrendingUp,
  },
  COURT_CASE: {
    label: 'COURT',
    color: '#6366F1',
    bg: 'rgba(99, 102, 241, 0.1)',
    icon: AlertTriangle,
  },
};

const CATEGORIES = ['All', 'Corruption', 'Development', 'Parliament', 'Court Cases', 'Election', 'Policy', 'Personal'];

export function NewsFeed({ politician }: Props) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCount, setShowCount] = useState(6);

  const articles = (politician.newsArticles || []) as NewsArticle[];

  const filteredArticles = articles.filter(article => {
    const matchCategory = activeCategory === 'All' || article.category === activeCategory;
    const matchSearch = !searchQuery || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const displayedArticles = filteredArticles.slice(0, showCount);

  const sentimentCounts = {
    positive: articles.filter(a => a.sentiment === 'POSITIVE_OUTCOME' || a.sentiment === 'ACHIEVEMENT').length,
    negative: articles.filter(a => a.sentiment === 'CRITICAL_ALLEGATION' || a.sentiment === 'CONTROVERSY' || a.sentiment === 'COURT_CASE').length,
    neutral: articles.filter(a => a.sentiment === 'NEUTRAL_COVERAGE').length,
  };

  const totalPositive = sentimentCounts.positive;
  const totalAll = articles.length || 1;

  return (
    <div className="space-y-5">
      {/* Media Sentiment Dashboard */}
      <div className="glass-panel rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-mono font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
            <Newspaper size={12} className="text-accent-gold" />
            Media Sentiment Analysis
          </h4>
          <span className="text-[10px] font-mono text-text-muted">
            {articles.length} articles indexed
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-3">
          {[
            { label: 'Positive', count: sentimentCounts.positive, color: '#10B981' },
            { label: 'Negative', count: sentimentCounts.negative, color: '#FF4D4D' },
            { label: 'Neutral', count: sentimentCounts.neutral, color: '#888899' },
          ].map(s => (
            <div key={s.label} className="text-center p-2 rounded-lg" style={{ background: `${s.color}10` }}>
              <div className="text-xl font-black font-mono" style={{ color: s.color }}>{s.count}</div>
              <div className="text-[9px] uppercase tracking-wider text-text-muted">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Sentiment bar */}
        <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
          <div className="h-full rounded-l-full transition-all duration-700" style={{
            background: '#10B981',
            width: `${(sentimentCounts.positive / totalAll) * 100}%`,
          }} />
          <div className="h-full transition-all duration-700" style={{
            background: '#888899',
            width: `${(sentimentCounts.neutral / totalAll) * 100}%`,
          }} />
          <div className="h-full rounded-r-full transition-all duration-700" style={{
            background: '#FF4D4D',
            width: `${(sentimentCounts.negative / totalAll) * 100}%`,
          }} />
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[9px] text-success-green font-mono">
            {Math.round((sentimentCounts.positive / totalAll) * 100)}% positive
          </span>
          <span className="text-[9px] text-danger-red font-mono">
            {Math.round((sentimentCounts.negative / totalAll) * 100)}% negative
          </span>
        </div>
      </div>

      {/* Search + Category Filter */}
      <div className="space-y-2">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-2.5 text-text-muted" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full input-field pl-9 text-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-[10px] font-mono font-bold px-3 py-1.5 rounded-full border transition-all ${
                activeCategory === cat
                  ? 'border-accent-gold bg-accent-gold/10 text-accent-gold'
                  : 'border-border-subtle text-text-muted hover:text-text-secondary hover:border-text-muted'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="text-[10px] font-mono text-text-muted">
        Showing {displayedArticles.length} of {filteredArticles.length} articles
        {activeCategory !== 'All' && ` in "${activeCategory}"`}
      </div>

      {/* Article List */}
      <div className="space-y-3">
        {displayedArticles.map((article, i) => {
          const sentConfig = SENTIMENT_CONFIG[article.sentiment] || SENTIMENT_CONFIG.NEUTRAL_COVERAGE;
          const SentIcon = sentConfig.icon;

          return (
            <a
              key={article.id || i}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block glass-panel rounded-xl p-4 hover:bg-white/[0.04] transition-all border border-transparent hover:border-white/10"
            >
              <div className="flex items-start gap-3">
                {/* Sentiment indicator */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: sentConfig.bg }}
                >
                  <SentIcon size={14} style={{ color: sentConfig.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  {/* Meta row */}
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span
                      className="text-[9px] font-mono font-black px-2 py-0.5 rounded-full"
                      style={{
                        background: sentConfig.bg,
                        color: sentConfig.color,
                      }}
                    >
                      {sentConfig.label}
                    </span>
                    <span className="text-[10px] font-mono text-text-muted">
                      {article.publisher}
                    </span>
                    <span className="text-[10px] text-text-muted">
                      {new Date(article.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                      style={{ background: 'rgba(255,255,255,0.06)', color: '#888899' }}
                    >
                      {article.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-sm font-semibold text-text-primary group-hover:text-accent-gold transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h4>

                  {/* Summary */}
                  <p className="text-xs text-text-muted mt-1.5 leading-relaxed line-clamp-2">
                    {article.summary}
                  </p>

                  {/* Read link */}
                  <div className="flex items-center gap-1 mt-2 text-[10px] text-text-muted group-hover:text-accent-gold transition-colors">
                    <ExternalLink size={10} />
                    <span>Read full article on {article.publisher}</span>
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {filteredArticles.length === 0 && (
        <div className="glass-panel rounded-xl p-8 text-center">
          <Newspaper size={32} className="text-text-muted mx-auto mb-3" />
          <p className="text-sm text-text-muted">No articles found for this filter.</p>
        </div>
      )}

      {/* Load More */}
      {filteredArticles.length > showCount && (
        <button
          onClick={() => setShowCount(prev => prev + 6)}
          className="w-full py-2.5 text-xs font-mono font-bold text-accent-gold border border-accent-gold/20 rounded-xl hover:bg-accent-gold/5 transition-all"
        >
          Show {Math.min(6, filteredArticles.length - showCount)} More Articles
        </button>
      )}

      {/* Google News Fallback */}
      <div className="glass-panel rounded-xl p-3 text-center border-dashed border border-border-subtle">
        <p className="text-[10px] text-text-muted font-mono">
          Want more news? Search Google News for the latest coverage.
        </p>
        <a
          href={`https://news.google.com/search?q=${encodeURIComponent(politician.name + ' ' + politician.party)}&hl=en-IN&gl=IN`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-2 text-[11px] font-mono text-accent-gold hover:underline"
        >
          <ExternalLink size={10} />
          Search on Google News →
        </a>
      </div>
    </div>
  );
}
