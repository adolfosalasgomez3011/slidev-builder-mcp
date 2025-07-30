/**
 * Layer 2: Layout Optimization Engine
 * Smart layout selection based on content type and design patterns
 */

export interface LayoutPattern {
  name: string;
  grid_system: '12-column' | '8-column' | 'flexbox' | 'css-grid';
  visual_hierarchy: 'Z-pattern' | 'F-pattern' | 'center-focused' | 'left-aligned';
  layout_type: 'hero' | 'split' | 'grid' | 'timeline' | 'comparison' | 'process_flow';
  responsive_breakpoints: string[];
  best_for: string[];
}

export interface LayoutRecommendation {
  pattern: LayoutPattern;
  confidence_score: number;
  accessibility_score: number;
  reason: string;
  css_framework: string;
}

export class LayoutOptimizationEngine {
  
  private static layouts: LayoutPattern[] = [
    {
      name: 'hero-centered',
      grid_system: 'flexbox',
      visual_hierarchy: 'center-focused',
      layout_type: 'hero',
      responsive_breakpoints: ['mobile', 'tablet', 'desktop'],
      best_for: ['opening slides', 'title slides', 'key messages', 'announcements']
    },
    {
      name: 'content-split',
      grid_system: '12-column',
      visual_hierarchy: 'Z-pattern',
      layout_type: 'split',
      responsive_breakpoints: ['tablet', 'desktop'],
      best_for: ['comparisons', 'before/after', 'problem/solution', 'feature descriptions']
    },
    {
      name: 'information-grid',
      grid_system: 'css-grid',
      visual_hierarchy: 'F-pattern',
      layout_type: 'grid',
      responsive_breakpoints: ['mobile', 'tablet', 'desktop'],
      best_for: ['data presentation', 'multiple points', 'dashboard views', 'feature grids']
    },
    {
      name: 'process-timeline',
      grid_system: 'flexbox',
      visual_hierarchy: 'left-aligned',
      layout_type: 'timeline',
      responsive_breakpoints: ['tablet', 'desktop'],
      best_for: ['step-by-step processes', 'roadmaps', 'chronological data', 'workflows']
    },
    {
      name: 'comparison-table',
      grid_system: '12-column',
      visual_hierarchy: 'F-pattern',
      layout_type: 'comparison',
      responsive_breakpoints: ['tablet', 'desktop'],
      best_for: ['feature comparisons', 'competitive analysis', 'pros/cons', 'options evaluation']
    },
    {
      name: 'process-flow',
      grid_system: 'flexbox',
      visual_hierarchy: 'Z-pattern',
      layout_type: 'process_flow',
      responsive_breakpoints: ['tablet', 'desktop'],
      best_for: ['workflows', 'user journeys', 'system processes', 'methodology explanations']
    }
  ];
  
  /**
   * Recommend optimal layout based on content analysis
   */
  static recommendLayout(
    slideType: string,
    contentDensity: 'low' | 'medium' | 'high',
    audience: string,
    hasVisuals: boolean = false
  ): LayoutRecommendation {
    
    let recommendedLayout: LayoutPattern;
    let confidence_score = 0;
    let reason = '';
    
    // Layout selection logic
    switch (slideType) {
      case 'hero':
        recommendedLayout = this.layouts.find(l => l.name === 'hero-centered')!;
        confidence_score = 0.95;
        reason = 'Hero layout optimal for opening slides and key messages';
        break;
        
      case 'problem':
      case 'solution':
        if (hasVisuals) {
          recommendedLayout = this.layouts.find(l => l.name === 'content-split')!;
          confidence_score = 0.9;
          reason = 'Split layout ideal for problem/solution with supporting visuals';
        } else {
          recommendedLayout = this.layouts.find(l => l.name === 'hero-centered')!;
          confidence_score = 0.8;
          reason = 'Centered layout for text-heavy problem/solution slides';
        }
        break;
        
      case 'evidence':
        if (contentDensity === 'high') {
          recommendedLayout = this.layouts.find(l => l.name === 'information-grid')!;
          confidence_score = 0.85;
          reason = 'Grid layout handles high-density evidence effectively';
        } else {
          recommendedLayout = this.layouts.find(l => l.name === 'content-split')!;
          confidence_score = 0.8;
          reason = 'Split layout for evidence with supporting visuals';
        }
        break;
        
      case 'comparison':
        recommendedLayout = this.layouts.find(l => l.name === 'comparison-table')!;
        confidence_score = 0.9;
        reason = 'Comparison layout optimized for side-by-side analysis';
        break;
        
      case 'process':
      case 'workflow':
        recommendedLayout = this.layouts.find(l => l.name === 'process-flow')!;
        confidence_score = 0.88;
        reason = 'Process flow layout ideal for step-by-step content';
        break;
        
      default:
        // Default based on content density
        if (contentDensity === 'high') {
          recommendedLayout = this.layouts.find(l => l.name === 'information-grid')!;
          confidence_score = 0.7;
          reason = 'Grid layout for high-density content';
        } else {
          recommendedLayout = this.layouts.find(l => l.name === 'content-split')!;
          confidence_score = 0.75;
          reason = 'Split layout as versatile default';
        }
    }
    
    // Calculate accessibility score
    const accessibility_score = this.calculateAccessibilityScore(recommendedLayout, audience);
    
    return {
      pattern: recommendedLayout,
      confidence_score,
      accessibility_score,
      reason,
      css_framework: this.generateCSSFramework(recommendedLayout)
    };
  }
  
  /**
   * Calculate accessibility score for layout
   */
  private static calculateAccessibilityScore(layout: LayoutPattern, audience: string): number {
    let score = 0.8; // Base score
    
    // Boost for mobile-friendly layouts
    if (layout.responsive_breakpoints.includes('mobile')) {
      score += 0.1;
    }
    
    // Boost for clear visual hierarchy
    if (layout.visual_hierarchy === 'F-pattern' || layout.visual_hierarchy === 'Z-pattern') {
      score += 0.1;
    }
    
    // Adjustment for executive audience (prefer simpler layouts)
    if (audience === 'executive' && layout.layout_type === 'hero') {
      score += 0.05;
    }
    
    return Math.min(1.0, score);
  }
  
  /**
   * Generate CSS framework code for layout
   */
  private static generateCSSFramework(layout: LayoutPattern): string {
    switch (layout.grid_system) {
      case '12-column':
        return `
        .slide-container {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 1rem;
          padding: 2rem;
        }`;
        
      case 'flexbox':
        return `
        .slide-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          min-height: 100vh;
        }`;
        
      case 'css-grid':
        return `
        .slide-container {
          display: grid;
          grid-template-areas: 
            "header header header"
            "content content sidebar"
            "footer footer footer";
          gap: 1.5rem;
          padding: 2rem;
        }`;
        
      default:
        return `
        .slide-container {
          display: flex;
          flex-direction: column;
          padding: 2rem;
        }`;
    }
  }
  
  /**
   * Generate responsive breakpoints
   */
  static generateResponsiveCSS(layout: LayoutPattern): string {
    return `
    /* Mobile First Approach */
    .slide-container {
      ${this.generateCSSFramework(layout)}
    }
    
    @media (min-width: 768px) {
      /* Tablet adjustments */
      .slide-container {
        padding: 3rem;
      }
    }
    
    @media (min-width: 1024px) {
      /* Desktop adjustments */
      .slide-container {
        padding: 4rem;
        max-width: 1200px;
        margin: 0 auto;
      }
    }
    
    @media (min-width: 1440px) {
      /* Large screen optimizations */
      .slide-container {
        padding: 5rem;
      }
    }`;
  }
}
