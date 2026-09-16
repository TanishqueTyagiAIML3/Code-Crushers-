import React from 'react';
import { Globe, ExternalLink, Search } from 'lucide-react';
import { GroundingSource } from '../types';

interface GroundingSourcesListProps {
  sources?: GroundingSource[];
  searchQueries?: string[];
  isGrounded?: boolean;
  className?: string;
  compact?: boolean;
}

export const GroundingSourcesList: React.FC<GroundingSourcesListProps> = ({
  sources = [],
  searchQueries = [],
  isGrounded,
  className = '',
  compact = false,
}) => {
  const hasSources = Array.isArray(sources) && sources.length > 0;
  const hasQueries = Array.isArray(searchQueries) && searchQueries.length > 0;

  if (!isGrounded && !hasSources && !hasQueries) {
    return null;
  }

  return (
    <div
      className={`rounded-xl border border-blue-200/80 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 p-3 text-xs ${className}`}
    >
      {/* Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-blue-100 dark:border-blue-900/40">
        <div className="flex items-center gap-1.5 font-semibold text-blue-700 dark:text-blue-300">
          <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>Grounded with Google Search</span>
        </div>
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          Up to date
        </span>
      </div>

      {/* Web Search Queries */}
      {hasQueries && (
        <div className="pt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Search className="w-3 h-3" /> Queries:
          </span>
          {searchQueries.map((query, idx) => (
            <span
              key={idx}
              className="inline-block px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[11px] font-mono"
            >
              &ldquo;{query}&rdquo;
            </span>
          ))}
        </div>
      )}

      {/* Grounding Source Links */}
      {hasSources && (
        <div className="pt-2">
          <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1.5">
            Verified Sources:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {sources.map((src, index) => {
              let displayTitle = src.title || 'Web Reference';
              try {
                if (src.uri && (!src.title || src.title.length > 30)) {
                  displayTitle = new URL(src.uri).hostname.replace(/^www\./, '');
                }
              } catch {
                // Keep original title
              }

              return (
                <a
                  key={index}
                  href={src.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-blue-200/70 dark:border-blue-800 text-blue-700 dark:text-blue-300 transition-colors text-[11px] font-medium max-w-xs truncate shadow-xs"
                  title={src.title || src.uri}
                >
                  <span className="truncate">{displayTitle}</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60 shrink-0" />
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
