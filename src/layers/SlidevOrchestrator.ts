/**
 * Slidev Builder Orchestration Engine
 * Combines all 4 layers for intelligent slide generation
 */

import { ContentIntelligenceEngine, type ContentAnalysisResult } from './ContentIntelligence.js';
import { LayoutOptimizationEngine, type LayoutRecommendation } from './LayoutOptimization.js';
import { AssetIntelligenceEngine, type AssetRecommendation } from './AssetIntelligence.js';
import { StyleOrchestrationEngine, type StyleRecommendation } from './StyleOrchestration.js';

export interface SlideGenerationRequest {
  content: string;
  audience: 'executive' | 'technical' | 'general';
  presentation_type: 'business' | 'technical' | 'creative' | 'educational';
  brand_guidelines?: string;
  time_constraint?: number; // minutes
  accessibility_requirements?: string[];
}

export interface SlideGenerationResult {
  slides: GeneratedSlide[];
  presentation_metadata: PresentationMetadata;
  quality_metrics: QualityMetrics;
  optimization_suggestions: string[];
}

export interface GeneratedSlide {
  id: string;
  type: string;
  title: string;
  content: string;
  layout: LayoutRecommendation;
  assets: AssetRecommendation;
  style: StyleRecommendation;
  markdown: string;
  estimated_time: number;
}

export interface PresentationMetadata {
  total_slides: number;
  estimated_duration: number;
  complexity_score: number;
  accessibility_score: number;
  brand_compliance: number;
}

export interface QualityMetrics {
  content_quality: number;
  visual_appeal: number;
  accessibility: number;
  brand_alignment: number;
  overall_score: number;
}

export class SlidevBuilderOrchestrator {
  
  /**
   * Main orchestration method - generates complete slide deck
   */
  static async generateSlideDeck(request: SlideGenerationRequest): Promise<SlideGenerationResult> {
    console.log('🚀 Starting 4-Layer Slide Generation Process...');
    
    // Layer 1: Content Intelligence Analysis
    console.log('📊 Layer 1: Analyzing content structure...');
    const contentAnalysis = ContentIntelligenceEngine.analyzeContent(
      request.content, 
      request.audience
    );
    
    // Generate slides based on content recommendations
    const slides: GeneratedSlide[] = [];
    
    for (const recommendation of contentAnalysis.slide_recommendations) {
      console.log(`📝 Generating ${recommendation.slide_type} slide...`);
      
      // Layer 2: Layout Optimization
      console.log('📐 Layer 2: Optimizing layout...');
      const layoutRecommendation = LayoutOptimizationEngine.recommendLayout(
        recommendation.slide_type,
        contentAnalysis.content_density,
        request.audience,
        true // hasVisuals
      );
      
      // Layer 3: Asset Intelligence
      console.log('🎨 Layer 3: Curating intelligent assets...');
      const assetRecommendation = await AssetIntelligenceEngine.curateAssets({
        content_context: request.content,
        slide_type: recommendation.slide_type,
        target_audience: request.audience,
        brand_guidelines: request.brand_guidelines,
        preferred_style: 'professional'
      });
      
      // Layer 4: Style Orchestration
      console.log('🎯 Layer 4: Orchestrating dynamic styles...');
      const styleRecommendation = StyleOrchestrationEngine.generateStyleRecommendation(
        recommendation.slide_type,
        request.audience,
        contentAnalysis.content_density,
        request.brand_guidelines
      );
      
      // Generate slide markdown
      const slideMarkdown = this.generateSlideMarkdown(
        recommendation,
        layoutRecommendation,
        assetRecommendation,
        styleRecommendation
      );
      
      slides.push({
        id: `slide_${slides.length + 1}`,
        type: recommendation.slide_type,
        title: this.generateSlideTitle(recommendation.slide_type, contentAnalysis.key_messages),
        content: recommendation.content_points.join(', '),
        layout: layoutRecommendation,
        assets: assetRecommendation,
        style: styleRecommendation,
        markdown: slideMarkdown,
        estimated_time: recommendation.estimated_time
      });
    }
    
    // Calculate presentation metadata
    const metadata = this.calculatePresentationMetadata(slides, contentAnalysis);
    
    // Calculate quality metrics
    const qualityMetrics = this.calculateQualityMetrics(slides);
    
    // Generate optimization suggestions
    const optimizationSuggestions = this.generateOptimizationSuggestions(
      slides, 
      qualityMetrics, 
      request
    );
    
    console.log('✅ 4-Layer Slide Generation Complete!');
    
    return {
      slides,
      presentation_metadata: metadata,
      quality_metrics: qualityMetrics,
      optimization_suggestions: optimizationSuggestions
    };
  }
  
  /**
   * Generate slide markdown combining all layer outputs
   */
  private static generateSlideMarkdown(
    recommendation: any,
    layout: LayoutRecommendation,
    assets: AssetRecommendation,
    style: StyleRecommendation
  ): string {
    const layoutClass = layout.pattern.name;
    const primaryAsset = assets.assets[0];
    
    let markdown = `---
layout: default
class: '${layoutClass}'
---

<style>
${style.css_framework}
</style>
`;
    
    // Generate content based on slide type
    switch (recommendation.slide_type) {
      case 'hero':
        markdown += this.generateHeroSlide(recommendation, primaryAsset, style);
        break;
      case 'problem':
        markdown += this.generateProblemSlide(recommendation, primaryAsset, style);
        break;
      case 'solution':
        markdown += this.generateSolutionSlide(recommendation, primaryAsset, style);
        break;
      case 'evidence':
        markdown += this.generateEvidenceSlide(recommendation, assets, style);
        break;
      case 'action':
        markdown += this.generateActionSlide(recommendation, primaryAsset, style);
        break;
      default:
        markdown += this.generateDefaultSlide(recommendation, primaryAsset, style);
    }
    
    return markdown;
  }
  
  /**
   * Generate hero slide markup
   */
  private static generateHeroSlide(recommendation: any, asset: any, style: any): string {
    return `
<div class="slide-header slide-header--hero">
  <h1>${this.generateSlideTitle('hero', recommendation.content_points)}</h1>
  <p class="subtitle">AI-Native Strategic Advisory Capability</p>
</div>

<div class="hero-content">
  ${asset ? `<img src="${asset.url}" alt="${asset.alt_text}" class="hero-image" />` : ''}
  
  <div class="hero-highlights">
    ${recommendation.content_points.map((point: string) => 
      `<div class="highlight-item">✨ ${point}</div>`
    ).join('\n    ')}
  </div>
</div>

<div class="call-to-action">
  <p>Transforming Advisory Excellence Through Human-AI Collaboration</p>
</div>
`;
  }
  
  /**
   * Generate problem slide markup
   */
  private static generateProblemSlide(recommendation: any, asset: any, style: any): string {
    return `
<div class="slide-header slide-header--content">
  <h1>🚨 ${this.generateSlideTitle('problem', recommendation.content_points)}</h1>
</div>

<div class="content-split">
  <div class="problem-statement">
    <h2>Current Challenges</h2>
    <ul>
      ${recommendation.content_points.map((point: string) => 
        `<li>${point}</li>`
      ).join('\n      ')}
    </ul>
  </div>
  
  <div class="problem-visual">
    ${asset ? `<img src="${asset.url}" alt="${asset.alt_text}" />` : ''}
  </div>
</div>
`;
  }
  
  /**
   * Generate solution slide markup
   */
  private static generateSolutionSlide(recommendation: any, asset: any, style: any): string {
    return `
<div class="slide-header slide-header--content">
  <h1>💡 ${this.generateSlideTitle('solution', recommendation.content_points)}</h1>
</div>

<div class="solution-grid">
  ${recommendation.content_points.map((point: string, index: number) => `
  <div class="solution-item">
    <div class="solution-icon">🔧</div>
    <h3>Solution ${index + 1}</h3>
    <p>${point}</p>
  </div>
  `).join('')}
</div>

${asset ? `
<div class="solution-visual">
  <img src="${asset.url}" alt="${asset.alt_text}" />
</div>
` : ''}
`;
  }
  
  /**
   * Generate evidence slide markup
   */
  private static generateEvidenceSlide(recommendation: any, assets: any, style: any): string {
    return `
<div class="slide-header slide-header--content">
  <h1>📊 ${this.generateSlideTitle('evidence', recommendation.content_points)}</h1>
</div>

<div class="evidence-container">
  <div class="data-table">
    <table>
      <thead>
        <tr class="data-table--header">
          <th>Metric</th>
          <th>Traditional</th>
          <th>AI-Native</th>
        </tr>
      </thead>
      <tbody>
        ${recommendation.content_points.map((point: string) => `
        <tr>
          <td class="data-table--cell font-bold">${point}</td>
          <td class="data-table--cell text-center">Standard</td>
          <td class="data-table--cell text-center text-accent font-bold">Optimized</td>
        </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  
  ${assets.assets[0] ? `
  <div class="evidence-visual">
    <img src="${assets.assets[0].url}" alt="${assets.assets[0].alt_text}" />
  </div>
  ` : ''}
</div>
`;
  }
  
  /**
   * Generate action slide markup
   */
  private static generateActionSlide(recommendation: any, asset: any, style: any): string {
    return `
<div class="slide-header slide-header--content">
  <h1>🚀 ${this.generateSlideTitle('action', recommendation.content_points)}</h1>
</div>

<div class="action-steps">
  ${recommendation.content_points.map((point: string, index: number) => `
  <div class="action-item">
    <div class="step-number">${index + 1}</div>
    <div class="step-content">
      <h3>Next Step</h3>
      <p>${point}</p>
    </div>
  </div>
  `).join('')}
</div>

<div class="call-to-action">
  <h2>Ready to Transform Your Advisory Practice?</h2>
  <p>Contact us to discuss your HAIA+ implementation</p>
</div>
`;
  }
  
  /**
   * Generate default slide markup
   */
  private static generateDefaultSlide(recommendation: any, asset: any, style: any): string {
    return `
<div class="slide-header slide-header--content">
  <h1>${this.generateSlideTitle('default', recommendation.content_points)}</h1>
</div>

<div class="slide-content">
  <ul>
    ${recommendation.content_points.map((point: string) => 
      `<li>${point}</li>`
    ).join('\n    ')}
  </ul>
  
  ${asset ? `
  <div class="content-visual">
    <img src="${asset.url}" alt="${asset.alt_text}" />
  </div>
  ` : ''}
</div>
`;
  }
  
  /**
   * Generate contextual slide titles
   */
  private static generateSlideTitle(slideType: string, contentPoints: string[]): string {
    const titles: Record<string, string> = {
      'hero': 'Market Leadership Response',
      'problem': 'Current Market Challenges',
      'solution': 'Our Strategic Solution',
      'evidence': 'Proven Results & Impact',
      'action': 'Next Steps Forward'
    };
    
    return titles[slideType] || 'Key Information';
  }
  
  /**
   * Calculate presentation metadata
   */
  private static calculatePresentationMetadata(
    slides: GeneratedSlide[], 
    contentAnalysis: ContentAnalysisResult
  ): PresentationMetadata {
    const totalTime = slides.reduce((sum, slide) => sum + slide.estimated_time, 0);
    
    return {
      total_slides: slides.length,
      estimated_duration: totalTime,
      complexity_score: contentAnalysis.content_structure.cognitive_load_score,
      accessibility_score: slides.reduce((sum, slide) => sum + slide.layout.accessibility_score, 0) / slides.length,
      brand_compliance: slides.reduce((sum, slide) => sum + slide.style.theme.brand_alignment, 0) / slides.length
    };
  }
  
  /**
   * Calculate quality metrics
   */
  private static calculateQualityMetrics(slides: GeneratedSlide[]): QualityMetrics {
    const contentQuality = slides.reduce((sum, slide) => 
      sum + (slide.content.length > 50 ? 0.9 : 0.7), 0) / slides.length;
    
    const visualAppeal = slides.reduce((sum, slide) => 
      sum + (slide.assets.assets.length > 0 ? 0.9 : 0.6), 0) / slides.length;
    
    const accessibility = slides.reduce((sum, slide) => 
      sum + slide.layout.accessibility_score, 0) / slides.length;
    
    const brandAlignment = slides.reduce((sum, slide) => 
      sum + slide.style.theme.brand_alignment, 0) / slides.length;
    
    const overallScore = (contentQuality + visualAppeal + accessibility + brandAlignment) / 4;
    
    return {
      content_quality: contentQuality,
      visual_appeal: visualAppeal,
      accessibility,
      brand_alignment: brandAlignment,
      overall_score: overallScore
    };
  }
  
  /**
   * Generate optimization suggestions
   */
  private static generateOptimizationSuggestions(
    slides: GeneratedSlide[], 
    metrics: QualityMetrics,
    request: SlideGenerationRequest
  ): string[] {
    const suggestions: string[] = [];
    
    if (metrics.content_quality < 0.8) {
      suggestions.push('Consider expanding content depth or adding more supporting details');
    }
    
    if (metrics.visual_appeal < 0.8) {
      suggestions.push('Add more visual elements like charts, diagrams, or high-quality images');
    }
    
    if (metrics.accessibility < 0.9) {
      suggestions.push('Improve accessibility with better color contrast and alt text');
    }
    
    if (slides.length > 10) {
      suggestions.push('Consider condensing content - presentations over 10 slides may lose audience attention');
    }
    
    const totalTime = slides.reduce((sum, slide) => sum + slide.estimated_time, 0);
    if (request.time_constraint && totalTime > request.time_constraint * 60) {
      suggestions.push(`Presentation duration (${Math.round(totalTime/60)}min) exceeds time constraint`);
    }
    
    return suggestions;
  }
}
