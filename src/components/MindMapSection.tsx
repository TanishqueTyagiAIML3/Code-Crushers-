import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { 
  GitFork, Upload, RefreshCw, Sparkles, ZoomIn, ZoomOut,
  RotateCcw, Download, Layers, Check, Info, FileText
} from 'lucide-react';
import { DialectOption, MindMapNode, AccessibilitySettings, GroundingSource } from '../types';
import { getTranslations } from '../i18n/translations';
import { recordUserHistory, CURRENT_USER_ID } from '../utils/historyService';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedMindMap, getSectionLabels } from '../data/localizedContent';
import { generateMindMapPDF } from '../utils/studyPdfGenerator';
import { GroundingSourcesList } from './GroundingSourcesList';

interface MindMapSectionProps {
  selectedLanguage?: DialectOption;
  accessibility: AccessibilitySettings;
  onNavigateToHistory?: () => void;
}

export function MindMapSection({
  selectedLanguage: propLanguage,
  accessibility,
  onNavigateToHistory
}: MindMapSectionProps) {
  const { selectedLanguage: globalLanguage } = useLanguage();
  const selectedLanguage = propLanguage || globalLanguage;
  const t = getTranslations(selectedLanguage.id);
  const labels = getSectionLabels(selectedLanguage.id);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const initialTransformRef = useRef<d3.ZoomTransform | null>(null);

  // Initialized strictly EMPTY (null) as requested - strictly user-driven
  const [mindMapData, setMindMapData] = useState<MindMapNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  const [isCustomGenerated, setIsCustomGenerated] = useState<boolean>(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState<boolean>(false);
  const [documentFileName, setDocumentFileName] = useState<string | null>(null);
  const [documentText, setDocumentText] = useState<string>('');
  const [customTopicInput, setCustomTopicInput] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [documentBase64, setDocumentBase64] = useState<string | null>(null);
  const [documentMimeType, setDocumentMimeType] = useState<string>('application/pdf');

  // Google Search Grounding State
  const [groundingSources, setGroundingSources] = useState<GroundingSource[]>([]);
  const [searchQueries, setSearchQueries] = useState<string[]>([]);
  const [isGrounded, setIsGrounded] = useState<boolean>(false);

  // Sync localized sample mind map whenever selectedLanguage changes (if viewing preset/sample)
  useEffect(() => {
    if (!isCustomGenerated && mindMapData) {
      const sample = getLocalizedMindMap(selectedLanguage.id);
      setMindMapData(sample);
      setSelectedNode(sample);
    }
  }, [selectedLanguage.id, isCustomGenerated]);

  // Captures the complete centered mind map tree as high-resolution PNG image
  const captureMindMapImage = async (
    svgElement: SVGSVGElement | null,
    data: MindMapNode
  ): Promise<{ dataUrl: string; width: number; height: number } | null> => {
    if (!svgElement || !data) return null;

    try {
      // 1. Calculate natural bounding box of all hierarchy nodes
      const root = d3.hierarchy<MindMapNode>(data);
      const treeLayout = d3.tree<MindMapNode>()
        .nodeSize([58, 220])
        .separation((a, b) => (a.parent === b.parent ? 1.25 : 1.6));
      treeLayout(root);

      const getNodeWidth = (d: any) => Math.max(120, ((d.data?.label || '').length) * 8.5 + 28);

      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;

      root.descendants().forEach((d: any) => {
        const w = getNodeWidth(d);
        const left = d.y - 15;
        const right = d.y + w + 12;
        const top = d.x - 24;
        const bottom = d.x + 24;

        if (left < minX) minX = left;
        if (right > maxX) maxX = right;
        if (top < minY) minY = top;
        if (bottom > maxY) maxY = bottom;
      });

      const pad = 40;
      const boxX = minX - pad;
      const boxY = minY - pad;
      const boxWidth = Math.max(maxX - minX + pad * 2, 520);
      const boxHeight = Math.max(maxY - minY + pad * 2, 360);

      // 2. Clone the SVG element
      const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
      clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      clonedSvg.setAttribute('viewBox', `${boxX} ${boxY} ${boxWidth} ${boxHeight}`);
      clonedSvg.setAttribute('width', `${boxWidth}`);
      clonedSvg.setAttribute('height', `${boxHeight}`);
      clonedSvg.setAttribute(
        'style',
        'font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff;'
      );

      // 3. Reset the tree group transform to remove interactive zoom/pan offset
      const g = clonedSvg.querySelector('.mindmap-tree-group');
      if (g) {
        g.removeAttribute('transform');
      }

      // 4. Remove any filter attributes from rects that might cause SVG rasterization quirks
      const rects = clonedSvg.querySelectorAll('rect');
      rects.forEach(r => {
        r.removeAttribute('filter');
      });

      // 5. Ensure text elements explicitly have font-family assigned
      const texts = clonedSvg.querySelectorAll('text');
      texts.forEach(t => {
        t.setAttribute('font-family', 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif');
      });

      // 6. Prepend a clean solid white background
      const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bgRect.setAttribute('x', `${boxX}`);
      bgRect.setAttribute('y', `${boxY}`);
      bgRect.setAttribute('width', `${boxWidth}`);
      bgRect.setAttribute('height', `${boxHeight}`);
      bgRect.setAttribute('fill', '#ffffff');
      clonedSvg.insertBefore(bgRect, clonedSvg.firstChild);

      // 7. Serialize SVG to data Blob
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(clonedSvg);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const blobUrl = URL.createObjectURL(svgBlob);

      // 8. Render onto a 2x high-resolution canvas for crisp print quality
      const scale = 2;
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(boxWidth * scale);
      canvas.height = Math.round(boxHeight * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(blobUrl);
        return null;
      }

      return await new Promise<{ dataUrl: string; width: number; height: number } | null>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        const timer = setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
          resolve(null);
        }, 3500);

        img.onload = () => {
          clearTimeout(timer);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(blobUrl);

          try {
            const dataUrl = canvas.toDataURL('image/png', 0.95);
            resolve({
              dataUrl,
              width: boxWidth,
              height: boxHeight
            });
          } catch (e) {
            console.warn('Canvas toDataURL error:', e);
            resolve(null);
          }
        };

        img.onerror = (err) => {
          clearTimeout(timer);
          URL.revokeObjectURL(blobUrl);
          console.warn('Failed to load SVG in canvas:', err);
          resolve(null);
        };

        img.src = blobUrl;
      });
    } catch (err) {
      console.warn('Could not capture mind map image:', err);
      return null;
    }
  };

  const handleDownloadMindMapPDF = async () => {
    if (!mindMapData) return;
    setIsDownloadingPDF(true);
    try {
      // Capture high-resolution centered mind map image from SVG
      const capturedImage = await captureMindMapImage(svgRef.current, mindMapData);

      await generateMindMapPDF({
        rootNode: mindMapData,
        topic: customTopicInput,
        documentFileName: documentFileName || undefined,
        languageName: selectedLanguage.name,
        mindMapImageBase64: capturedImage?.dataUrl || null,
        imageWidth: capturedImage?.width,
        imageHeight: capturedImage?.height
      });
    } catch (err) {
      console.error("Failed to generate Mind Map PDF:", err);
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  // File Upload (Robust PDF Base64 + Text Decoding)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size === 0) {
      setValidationError("The selected file is empty (0 bytes). Please upload a valid document with content.");
      return;
    }

    setValidationError(null);
    setDocumentFileName(file.name);

    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      setDocumentMimeType('application/pdf');
      const reader = new FileReader();
      reader.onload = () => {
        const result = (reader.result as string) || '';
        // Extract pure base64 string without data URL scheme prefix
        const commaIdx = result.indexOf(',');
        const base64 = commaIdx !== -1 ? result.slice(commaIdx + 1).trim() : result.trim();
        setDocumentBase64(base64);
        setDocumentText(`[Attached PDF Document: ${file.name} (${Math.max(1, Math.round(file.size / 1024))} KB)]`);
      };
      reader.readAsDataURL(file);
    } else {
      // Clean text/markdown file
      setDocumentBase64(null);
      setDocumentMimeType(file.type || 'text/plain');
      const reader = new FileReader();
      reader.onload = () => {
        const text = (reader.result as string) || '';
        setDocumentText(text.slice(0, 30000));
      };
      reader.readAsText(file);
    }
  };

  // Generate Mind Map with AI - RESILIENT & USER-FRIENDLY
  const handleGenerateMindMap = async (predefinedTopic?: string) => {
    const hasBase64 = !!documentBase64;
    // If no topic and no document, smoothly default to preset topic without showing an alarming warning banner
    const defaultTopic = labels.presetTopic1 || "Photosynthesis";
    const topicToUse = predefinedTopic || customTopicInput.trim() || (!hasBase64 ? documentText.trim() : '') || (hasBase64 ? '' : defaultTopic);

    if (!customTopicInput.trim() && !hasBase64 && topicToUse) {
      setCustomTopicInput(topicToUse);
    }

    setValidationError(null);
    setIsGenerating(true);

    try {
      const res = await fetch('/api/study/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType: 'mindmap',
          documentText: topicToUse 
            ? (topicToUse.startsWith('Topic:') ? topicToUse : `Topic: ${topicToUse}`)
            : (documentFileName ? `Document Topic: ${documentFileName.replace(/\.pdf$/i, '').replace(/[_-]/g, ' ')}` : ''),
          documentBase64: hasBase64 ? documentBase64 : null,
          mimeType: documentMimeType,
          selectedLanguage: selectedLanguage.name,
          language: selectedLanguage.language,
          dialect: selectedLanguage.name
        })
      });

      const data = await res.json();
      if (data.root) {
        setIsCustomGenerated(true);
        setMindMapData(data.root);
        setSelectedNode(data.root);
        setGroundingSources(data.groundingSources || []);
        setSearchQueries(data.searchQueries || []);
        setIsGrounded(Boolean(data.isGrounded));

        // Log to Active User's History Database and trigger real-time UI update
        recordUserHistory({
          userId: CURRENT_USER_ID,
          category: 'mindmap',
          title: `Mind Map: ${data.root.label || 'Study Material'}`,
          summary: `Hierarchical tree generated for ${selectedLanguage.name} with ${data.root.children?.length || 0} main branches.`,
          data: data.root
        }).catch(err => console.warn("Failed to log history:", err));
      } else {
        // Resilient fallback to localized sample if generation fails
        const sample = getLocalizedMindMap(selectedLanguage.id);
        setIsCustomGenerated(false);
        setMindMapData(sample);
        setSelectedNode(sample);
      }
    } catch (e) {
      console.error("Failed to generate mind map:", e);
      // Resilient fallback to localized sample
      const sample = getLocalizedMindMap(selectedLanguage.id);
      setIsCustomGenerated(false);
      setMindMapData(sample);
      setSelectedNode(sample);
    } finally {
      setIsGenerating(false);
    }
  };

  // Zoom and Pan Handlers utilizing D3 zoom transitions
  const handleZoomIn = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(250)
        .call(zoomRef.current.scaleBy, 1.25);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(250)
        .call(zoomRef.current.scaleBy, 0.8);
    }
  };

  const handleResetZoom = () => {
    if (svgRef.current && zoomRef.current && initialTransformRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(350)
        .call(zoomRef.current.transform, initialTransformRef.current);
    }
  };

  // Render D3 Mind Map Tree with Auto-Centering & D3 Zoom/Pan
  useEffect(() => {
    if (!svgRef.current || !mindMapData) return;

    const svgElement = svgRef.current;
    const containerWidth = containerRef.current?.clientWidth || 900;
    const width = Math.max(containerWidth, 800);
    const height = 540;

    const svg = d3.select(svgElement);
    svg.selectAll('*').remove();

    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('cursor', 'grab');

    // Main group holding all graph links and nodes
    const g = svg.append('g').attr('class', 'mindmap-tree-group');

    // Create hierarchical layout using nodeSize for balanced branch separation
    const root = d3.hierarchy<MindMapNode>(mindMapData);
    const treeLayout = d3.tree<MindMapNode>()
      .nodeSize([58, 220])
      .separation((a, b) => (a.parent === b.parent ? 1.25 : 1.6));

    treeLayout(root);

    // Links (Curved cubic bezier paths from parent to child)
    g.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#cbd5e1')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.85)
      .attr('d', (d: any) => {
        return `M ${d.source.y} ${d.source.x}
                C ${(d.source.y + d.target.y) / 2} ${d.source.x},
                  ${(d.source.y + d.target.y) / 2} ${d.target.x},
                  ${d.target.y} ${d.target.x}`;
      });

    // Node Groups
    const node = g.selectAll('.node')
      .data(root.descendants(), (d: any) => d.data?.id || `node-${d.depth}-${d.x}-${d.y}`)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d: any) => `translate(${d.y}, ${d.x})`)
      .style('cursor', 'pointer')
      .on('click', (_event, d) => {
        setSelectedNode(d.data);
      });

    // Node Pill Width calculation based on label length
    const getNodeWidth = (d: any) => Math.max(120, ((d.data?.label || '').length) * 8.5 + 28);

    // Node Pill Base
    node.append('rect')
      .attr('x', (d) => (d.depth === 0 ? -12 : -10))
      .attr('y', -16)
      .attr('width', (d) => getNodeWidth(d))
      .attr('height', 32)
      .attr('rx', 16)
      .attr('fill', (d) => {
        if (d.depth === 0) return '#ea580c';
        if (d.depth === 1) return '#ffffff';
        return '#f8fafc';
      })
      .attr('stroke', (d) => {
        if (d.depth === 0) return '#c2410c';
        if (d.depth === 1) return '#f97316';
        return '#cbd5e1';
      })
      .attr('stroke-width', 2)
      .attr('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.06))');

    // Bullet indicator inside pill
    node.append('circle')
      .attr('cx', 4)
      .attr('cy', 0)
      .attr('r', 4.5)
      .attr('fill', (d) => (d.depth === 0 ? '#ffffff' : '#ea580c'));

    // Node Label
    node.append('text')
      .attr('x', 14)
      .attr('dy', 4)
      .attr('font-family', 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif')
      .attr('font-size', (d) => (d.depth === 0 ? '12px' : '11px'))
      .attr('font-weight', (d) => (d.depth <= 1 ? '700' : '600'))
      .attr('fill', (d) => (d.depth === 0 ? '#ffffff' : '#0f172a'))
      .text((d) => d.data?.label || '');

    // =========================================================================
    // 1. AUTO-CENTER ON LOAD: Calculate Bounding Box of the generated graph
    // =========================================================================
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    root.descendants().forEach((d: any) => {
      const w = getNodeWidth(d);
      const left = d.y - 15;
      const right = d.y + w + 12;
      const top = d.x - 24;
      const bottom = d.x + 24;

      if (left < minX) minX = left;
      if (right > maxX) maxX = right;
      if (top < minY) minY = top;
      if (bottom > maxY) maxY = bottom;
    });

    const graphWidth = maxX - minX;
    const graphHeight = maxY - minY;
    const graphCenterX = (minX + maxX) / 2;
    const graphCenterY = (minY + maxY) / 2;

    // Calculate optimal scale factor to fit graph comfortably in viewport
    const paddingX = 60;
    const paddingY = 60;
    const scaleX = (width - paddingX * 2) / Math.max(graphWidth, 1);
    const scaleY = (height - paddingY * 2) / Math.max(graphHeight, 1);
    const calculatedScale = Math.min(Math.max(Math.min(scaleX, scaleY), 0.45), 1.05);
    const initialScale = Number.isFinite(calculatedScale) && calculatedScale > 0 ? calculatedScale : 0.85;

    // Calculate translation so the graph's center aligns with the SVG viewport's center
    const calcTranslateX = (width / 2) - (graphCenterX * initialScale);
    const calcTranslateY = (height / 2) - (graphCenterY * initialScale);
    const initialTranslateX = Number.isFinite(calcTranslateX) ? calcTranslateX : width / 4;
    const initialTranslateY = Number.isFinite(calcTranslateY) ? calcTranslateY : height / 4;

    // =========================================================================
    // 2. ZOOM & PAN INITIALIZATION: Initialize d3.zoom() & apply initial transform
    // =========================================================================
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.25, 3.5])
      .on('start', () => {
        svg.style('cursor', 'grabbing');
      })
      .on('zoom', (event) => {
        g.attr('transform', event.transform.toString());
      })
      .on('end', () => {
        svg.style('cursor', 'grab');
      });

    svg.call(zoomBehavior);
    zoomRef.current = zoomBehavior;

    // Apply the computed initial transform via d3.zoomIdentity so D3 zoom state stays in sync
    const initialTransform = d3.zoomIdentity
      .translate(initialTranslateX, initialTranslateY)
      .scale(initialScale);

    initialTransformRef.current = initialTransform;

    // Apply initial transform to SVG immediately
    svg.call(zoomBehavior.transform, initialTransform);

  }, [mindMapData]);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 section-header-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/70 border border-orange-200/50 dark:border-orange-800/60 text-[#ea580c] dark:text-orange-400 text-xs font-bold mb-2">
            <GitFork className="w-3.5 h-3.5" />
            <span>{labels.mindMapStudio}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight section-header-title">
            {labels.mindMapTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 mt-1 section-header-desc">
            {labels.mindMapDesc}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToHistory && (
            <button
              onClick={onNavigateToHistory}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-[#ea580c] dark:hover:text-orange-400 shadow-sm transition-all cursor-pointer"
            >
              {labels.savedInHistory} &rarr;
            </button>
          )}
        </div>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-center justify-between animate-fade-in">
          <span>⚠️ {validationError}</span>
          <button onClick={() => setValidationError(null)} className="text-amber-700 font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Control Bar: Document Ingestion & Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="lg:col-span-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-orange-50 hover:bg-orange-100 text-[#ea580c] text-xs font-bold border border-orange-200 cursor-pointer transition-colors shrink-0">
            <Upload className="w-4 h-4" />
            <span>{labels.uploadDoc}</span>
            <input
              type="file"
              accept=".pdf,.txt,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <input
            type="text"
            value={customTopicInput}
            onChange={(e) => {
              setCustomTopicInput(e.target.value);
              if (validationError) setValidationError(null);
            }}
            placeholder={documentFileName ? `Using file: ${documentFileName}` : labels.enterTopicPlaceholder}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#ea580c]"
          />
        </div>

        <div className="lg:col-span-6 flex flex-wrap items-center justify-start lg:justify-end gap-2">
          <button
            onClick={() => {
              setCustomTopicInput(labels.presetTopic1);
              handleGenerateMindMap(labels.presetTopic1);
            }}
            disabled={isGenerating}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-700"
          >
            {labels.presetTopic1}
          </button>
          <button
            onClick={() => {
              setCustomTopicInput(labels.presetTopic2);
              handleGenerateMindMap(labels.presetTopic2);
            }}
            disabled={isGenerating}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-700"
          >
            {labels.presetTopic2}
          </button>
          <button
            onClick={() => handleGenerateMindMap()}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold shadow-md shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{isGenerating ? labels.synthesizingAi : labels.generateMindMapBtn}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage: EMPTY STATE vs MIND MAP CANVAS */}
      {!mindMapData ? (
        <div className="bg-white rounded-3xl p-10 sm:p-14 border border-slate-200/80 shadow-md text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-3xl bg-orange-50 text-[#ea580c] border border-orange-200 flex items-center justify-center mx-auto shadow-inner">
            <GitFork className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-xl font-bold text-slate-900">
              {documentFileName ? `Ready to Analyze: ${documentFileName}` : customTopicInput ? `Ready for: "${customTopicInput}"` : labels.noMindMapTitle}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {documentFileName || customTopicInput 
                ? "Click 'Generate Mind Map' above to construct a hierarchical concept graph with D3.js and dialect explanations."
                : "Upload a study document (PDF, TXT, DOCX) or enter a subject topic in the bar above, then click 'Generate Mind Map' to construct a real-time hierarchical concept graph."}
            </p>
          </div>
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                const sample = getLocalizedMindMap(selectedLanguage.id);
                setIsCustomGenerated(false);
                setMindMapData(sample);
                setSelectedNode(sample);
              }}
              className="px-5 py-2.5 rounded-2xl bg-orange-50 hover:bg-orange-100 text-[#ea580c] border border-orange-200 text-xs font-bold inline-flex items-center gap-2 cursor-pointer transition-all hover:scale-105 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{labels.loadSampleDemo} ({selectedLanguage.name})</span>
            </button>
          </div>

          <div className="pt-1 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
            <span className="inline-block w-2 h-2 rounded-full bg-[#ea580c]" />
            <span>Strictly user-driven: Provide a file or topic to generate your customized map.</span>
          </div>
        </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* D3 Canvas Card */}
        <div 
          ref={containerRef}
          className="lg:col-span-8 bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-md relative overflow-hidden"
        >
          {/* Canvas Floating Controls (Zoom in, Zoom out, Reset, Clear, Download PDF) */}
          <div className="absolute top-6 right-6 flex items-center gap-1.5 z-10 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-sm">
            <button
              onClick={handleDownloadMindMapPDF}
              disabled={isDownloadingPDF}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/20 text-sky-700 dark:text-sky-300 hover:bg-sky-500/30 border border-sky-500/30 text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
              title="Download Mind Map as structured PDF outline"
            >
              <Download className={`w-3.5 h-3.5 ${isDownloadingPDF ? 'animate-bounce' : ''}`} />
              <span>{isDownloadingPDF ? 'Generating PDF...' : 'Download Mind Map PDF'}</span>
            </button>
            <div className="h-4 w-px bg-slate-200 mx-0.5" />
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-slate-600 hover:text-[#ea580c] rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 text-slate-600 hover:text-[#ea580c] rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 text-slate-600 hover:text-[#ea580c] rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              title="Recenter & Fit Map"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setIsCustomGenerated(false);
                setMindMapData(null);
                setSelectedNode(null);
                setCustomTopicInput('');
              }}
              className="px-2.5 py-1 text-[11px] font-bold text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
              title="Clear / New"
            >
              {labels.resetBtn}
            </button>
          </div>

          <div className="w-full overflow-hidden min-h-[500px] h-[540px] flex items-center justify-center rounded-2xl bg-slate-50/40 border border-slate-100">
            <svg
              ref={svgRef}
              className="w-full h-full select-none block touch-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
            <span>{labels.clickNodePrompt}</span>
            <span>D3.js Hierarchical Tree Engine</span>
          </div>
        </div>

        {/* Right Detail Card: Selected Node Inspector */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-[#ea580c]" />
              <span>{labels.nodeInspector}</span>
            </h3>
            <div className="flex items-center gap-2">
              {selectedNode?.category && (
                <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-[#ea580c] text-[10px] font-bold">
                  {selectedNode.category}
                </span>
              )}
              <button
                onClick={handleDownloadMindMapPDF}
                disabled={isDownloadingPDF}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-700 dark:text-sky-300 hover:bg-sky-500/30 border border-sky-500/30 text-[11px] font-bold transition-all cursor-pointer disabled:opacity-50"
                title="Download full mind map as PDF outline"
              >
                <Download className="w-3 h-3" />
                <span className="hidden sm:inline">PDF</span>
              </button>
            </div>
          </div>

          {selectedNode ? (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-black text-slate-900 leading-snug">
                  {selectedNode.label}
                </h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {selectedNode.description || "Core conceptual node representing an integral sub-component in the knowledge tree."}
                </p>
              </div>

              {selectedNode.children && selectedNode.children.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">
                    Direct Sub-Branches ({selectedNode.children.length}):
                  </span>
                  <div className="space-y-1.5">
                    {selectedNode.children.map((child, idx) => (
                      <button
                        key={child.id || `child-${idx}-${child.label || ''}`}
                        onClick={() => setSelectedNode(child)}
                        className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-orange-50/60 border border-slate-100 hover:border-orange-200 text-xs text-slate-800 transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <span className="font-semibold">{child.label}</span>
                        <span className="text-[10px] text-slate-400">&rarr;</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs">
              Select a node from the mind map to view its explanation.
            </div>
          )}

          {/* Google Search Grounding Sources */}
          {(isGrounded || groundingSources.length > 0) && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <GroundingSourcesList
                sources={groundingSources}
                searchQueries={searchQueries}
                isGrounded={isGrounded}
              />
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
