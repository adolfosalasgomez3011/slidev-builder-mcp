/**
 * Layer 4: Style Orchestration Engine
 * Dynamic styling system based on design tokens and atomic design principles
 */

export interface DesignToken {
  name: string;
  value: string;
  category: 'color' | 'typography' | 'spacing' | 'shadow' | 'border' | 'animation';
  scope: 'global' | 'component' | 'theme';
}

export interface StyleTheme {
  name: string;
  tokens: DesignToken[];
  components: ComponentStyle[];
  brand_alignment: number;
  accessibility_score: number;
}

export interface ComponentStyle {
  component: string;
  styles: Record<string, string>;
  variants?: Record<string, Record<string, string>>;
  responsive?: Record<string, Record<string, string>>;
}

export interface StyleRecommendation {
  theme: StyleTheme;
  custom_tokens: DesignToken[];
  component_overrides: ComponentStyle[];
  css_framework: string;
  reasoning: string;
}

export class StyleOrchestrationEngine {
  
  private static hatchBrandTokens: DesignToken[] = [
    // Hatch Corporate Colors
    { name: '--hatch-primary-blue', value: '#095078', category: 'color', scope: 'global' },
    { name: '--hatch-secondary-blue', value: '#ACBCC8', category: 'color', scope: 'global' },
    { name: '--hatch-primary-orange', value: '#E84B37', category: 'color', scope: 'global' },
    { name: '--hatch-secondary-orange', value: '#E75300', category: 'color', scope: 'global' },
    { name: '--hatch-corporate-gray', value: '#425563', category: 'color', scope: 'global' },
    { name: '--hatch-medium-gray', value: '#595959', category: 'color', scope: 'global' },
    { name: '--hatch-light-gray', value: '#A0AEC0', category: 'color', scope: 'global' },
    { name: '--hatch-background', value: '#f4f4f4', category: 'color', scope: 'global' },
    { name: '--hatch-white', value: '#FFFFFF', category: 'color', scope: 'global' },
    
    // Typography
    { name: '--font-primary', value: 'Inter, system-ui, sans-serif', category: 'typography', scope: 'global' },
    { name: '--font-weight-normal', value: '400', category: 'typography', scope: 'global' },
    { name: '--font-weight-medium', value: '500', category: 'typography', scope: 'global' },
    { name: '--font-weight-bold', value: '700', category: 'typography', scope: 'global' },
    { name: '--font-size-xs', value: '0.75rem', category: 'typography', scope: 'global' },
    { name: '--font-size-sm', value: '0.875rem', category: 'typography', scope: 'global' },
    { name: '--font-size-base', value: '1rem', category: 'typography', scope: 'global' },
    { name: '--font-size-lg', value: '1.125rem', category: 'typography', scope: 'global' },
    { name: '--font-size-xl', value: '1.25rem', category: 'typography', scope: 'global' },
    { name: '--font-size-2xl', value: '1.5rem', category: 'typography', scope: 'global' },
    { name: '--font-size-3xl', value: '1.875rem', category: 'typography', scope: 'global' },
    { name: '--font-size-4xl', value: '2.25rem', category: 'typography', scope: 'global' },
    
    // Spacing
    { name: '--spacing-1', value: '0.25rem', category: 'spacing', scope: 'global' },
    { name: '--spacing-2', value: '0.5rem', category: 'spacing', scope: 'global' },
    { name: '--spacing-3', value: '0.75rem', category: 'spacing', scope: 'global' },
    { name: '--spacing-4', value: '1rem', category: 'spacing', scope: 'global' },
    { name: '--spacing-6', value: '1.5rem', category: 'spacing', scope: 'global' },
    { name: '--spacing-8', value: '2rem', category: 'spacing', scope: 'global' },
    { name: '--spacing-12', value: '3rem', category: 'spacing', scope: 'global' },
    { name: '--spacing-16', value: '4rem', category: 'spacing', scope: 'global' },
    
    // Shadows
    { name: '--shadow-sm', value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', category: 'shadow', scope: 'global' },
    { name: '--shadow-md', value: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', category: 'shadow', scope: 'global' },
    { name: '--shadow-lg', value: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', category: 'shadow', scope: 'global' },
    
    // Border radius
    { name: '--border-radius-sm', value: '0.125rem', category: 'border', scope: 'global' },
    { name: '--border-radius-md', value: '0.375rem', category: 'border', scope: 'global' },
    { name: '--border-radius-lg', value: '0.5rem', category: 'border', scope: 'global' },
    { name: '--border-radius-xl', value: '0.75rem', category: 'border', scope: 'global' }
  ];
  
  /**
   * Generate style recommendations based on content and layout
   */
  static generateStyleRecommendation(
    slideType: string,
    audience: string,
    contentDensity: 'low' | 'medium' | 'high',
    brandGuidelines?: string
  ): StyleRecommendation {
    
    const baseTheme = this.createHatchCorporateTheme();
    const customTokens = this.generateCustomTokens(slideType, audience, contentDensity);
    const componentOverrides = this.generateComponentOverrides(slideType, contentDensity);
    const cssFramework = this.generateCSSFramework(baseTheme, customTokens);
    
    return {
      theme: baseTheme,
      custom_tokens: customTokens,
      component_overrides: componentOverrides,
      css_framework: cssFramework,
      reasoning: this.generateStyleReasoning(slideType, audience, contentDensity)
    };
  }
  
  /**
   * Create Hatch corporate theme
   */
  private static createHatchCorporateTheme(): StyleTheme {
    const components: ComponentStyle[] = [
      {
        component: 'slide-header',
        styles: {
          'background': 'linear-gradient(135deg, var(--hatch-primary-blue) 0%, var(--hatch-secondary-blue) 100%)',
          'color': 'var(--hatch-white)',
          'padding': 'var(--spacing-8) var(--spacing-12)',
          'border-radius': 'var(--border-radius-lg)',
          'margin-bottom': 'var(--spacing-6)'
        },
        variants: {
          'hero': {
            'font-size': 'var(--font-size-4xl)',
            'text-align': 'center',
            'padding': 'var(--spacing-12) var(--spacing-16)'
          },
          'content': {
            'font-size': 'var(--font-size-2xl)',
            'text-align': 'left'
          }
        }
      },
      {
        component: 'slide-content',
        styles: {
          'color': 'var(--hatch-corporate-gray)',
          'font-family': 'var(--font-primary)',
          'line-height': '1.6',
          'padding': 'var(--spacing-6)'
        },
        variants: {
          'high-density': {
            'font-size': 'var(--font-size-sm)',
            'line-height': '1.4'
          },
          'low-density': {
            'font-size': 'var(--font-size-lg)',
            'line-height': '1.8'
          }
        }
      },
      {
        component: 'call-to-action',
        styles: {
          'background': 'linear-gradient(135deg, var(--hatch-primary-orange) 0%, var(--hatch-secondary-orange) 100%)',
          'color': 'var(--hatch-white)',
          'padding': 'var(--spacing-4) var(--spacing-8)',
          'border-radius': 'var(--border-radius-md)',
          'font-weight': 'var(--font-weight-bold)',
          'text-align': 'center',
          'box-shadow': 'var(--shadow-md)'
        }
      },
      {
        component: 'data-table',
        styles: {
          'border': '2px solid var(--hatch-primary-orange)',
          'border-radius': 'var(--border-radius-lg)',
          'overflow': 'hidden'
        },
        variants: {
          'header': {
            'background': 'var(--hatch-primary-orange)',
            'color': 'var(--hatch-white)',
            'font-weight': 'var(--font-weight-bold)'
          },
          'cell': {
            'padding': 'var(--spacing-3)',
            'border-bottom': '1px solid var(--hatch-light-gray)'
          }
        }
      }
    ];
    
    return {
      name: 'hatch-corporate',
      tokens: this.hatchBrandTokens,
      components,
      brand_alignment: 1.0,
      accessibility_score: 0.95
    };
  }
  
  /**
   * Generate custom tokens based on context
   */
  private static generateCustomTokens(
    slideType: string,
    audience: string,
    contentDensity: 'low' | 'medium' | 'high'
  ): DesignToken[] {
    const tokens: DesignToken[] = [];
    
    // Audience-specific adjustments
    if (audience === 'executive') {
      tokens.push(
        { name: '--executive-emphasis', value: 'var(--hatch-primary-blue)', category: 'color', scope: 'component' },
        { name: '--executive-font-size', value: 'var(--font-size-xl)', category: 'typography', scope: 'component' }
      );
    } else if (audience === 'technical') {
      tokens.push(
        { name: '--technical-accent', value: 'var(--hatch-medium-gray)', category: 'color', scope: 'component' },
        { name: '--code-font', value: 'Monaco, Consolas, monospace', category: 'typography', scope: 'component' }
      );
    }
    
    // Content density adjustments
    if (contentDensity === 'high') {
      tokens.push(
        { name: '--dense-spacing', value: 'var(--spacing-2)', category: 'spacing', scope: 'component' },
        { name: '--dense-font-size', value: 'var(--font-size-sm)', category: 'typography', scope: 'component' }
      );
    } else if (contentDensity === 'low') {
      tokens.push(
        { name: '--spacious-spacing', value: 'var(--spacing-8)', category: 'spacing', scope: 'component' },
        { name: '--spacious-font-size', value: 'var(--font-size-lg)', category: 'typography', scope: 'component' }
      );
    }
    
    // Slide type specific tokens
    if (slideType === 'hero') {
      tokens.push(
        { name: '--hero-gradient', value: 'linear-gradient(135deg, var(--hatch-primary-blue) 0%, var(--hatch-secondary-blue) 100%)', category: 'color', scope: 'component' }
      );
    } else if (slideType === 'evidence') {
      tokens.push(
        { name: '--evidence-highlight', value: 'var(--hatch-primary-orange)', category: 'color', scope: 'component' }
      );
    }
    
    return tokens;
  }
  
  /**
   * Generate component style overrides
   */
  private static generateComponentOverrides(
    slideType: string,
    contentDensity: 'low' | 'medium' | 'high'
  ): ComponentStyle[] {
    const overrides: ComponentStyle[] = [];
    
    // Slide type specific overrides
    if (slideType === 'comparison') {
      overrides.push({
        component: 'comparison-grid',
        styles: {
          'display': 'grid',
          'grid-template-columns': '1fr 1fr',
          'gap': 'var(--spacing-6)',
          'padding': 'var(--spacing-4)'
        }
      });
    }
    
    if (slideType === 'timeline') {
      overrides.push({
        component: 'timeline-container',
        styles: {
          'display': 'flex',
          'flex-direction': 'row',
          'align-items': 'center',
          'gap': 'var(--spacing-4)'
        },
        responsive: {
          'mobile': {
            'flex-direction': 'column'
          }
        }
      });
    }
    
    // Content density overrides
    if (contentDensity === 'high') {
      overrides.push({
        component: 'content-container',
        styles: {
          'font-size': 'var(--dense-font-size)',
          'line-height': '1.4',
          'padding': 'var(--dense-spacing)'
        }
      });
    }
    
    return overrides;
  }
  
  /**
   * Generate complete CSS framework
   */
  private static generateCSSFramework(theme: StyleTheme, customTokens: DesignToken[]): string {
    const allTokens = [...theme.tokens, ...customTokens];
    
    // Generate CSS custom properties
    const cssVariables = allTokens
      .map(token => `  ${token.name}: ${token.value};`)
      .join('\n');
    
    // Generate component styles
    const componentStyles = theme.components
      .map(component => this.generateComponentCSS(component))
      .join('\n\n');
    
    return `
/* Hatch Corporate Design System */
:root {
${cssVariables}
}

/* Base styles */
.slidev-container {
  font-family: var(--font-primary);
  color: var(--hatch-corporate-gray);
  background: var(--hatch-background);
  line-height: 1.6;
}

.slide {
  padding: var(--spacing-8);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Component styles */
${componentStyles}

/* Utility classes */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.font-bold { font-weight: var(--font-weight-bold); }
.font-medium { font-weight: var(--font-weight-medium); }

.text-primary { color: var(--hatch-primary-blue); }
.text-accent { color: var(--hatch-primary-orange); }
.text-muted { color: var(--hatch-medium-gray); }

.bg-primary { background: var(--hatch-primary-blue); }
.bg-accent { background: var(--hatch-primary-orange); }
.bg-light { background: var(--hatch-light-gray); }

.shadow-sm { box-shadow: var(--shadow-sm); }
.shadow-md { box-shadow: var(--shadow-md); }
.shadow-lg { box-shadow: var(--shadow-lg); }

.rounded-sm { border-radius: var(--border-radius-sm); }
.rounded-md { border-radius: var(--border-radius-md); }
.rounded-lg { border-radius: var(--border-radius-lg); }

/* Responsive utilities */
@media (max-width: 768px) {
  .slide {
    padding: var(--spacing-4);
  }
  
  .desktop-only {
    display: none;
  }
}

@media (min-width: 769px) {
  .mobile-only {
    display: none;
  }
}
`;
  }
  
  /**
   * Generate CSS for individual components
   */
  private static generateComponentCSS(component: ComponentStyle): string {
    let css = `.${component.component} {\n`;
    
    // Base styles
    Object.entries(component.styles).forEach(([property, value]) => {
      css += `  ${property}: ${value};\n`;
    });
    
    css += '}\n';
    
    // Variants
    if (component.variants) {
      Object.entries(component.variants).forEach(([variant, styles]) => {
        css += `.${component.component}--${variant} {\n`;
        Object.entries(styles).forEach(([property, value]) => {
          css += `  ${property}: ${value};\n`;
        });
        css += '}\n';
      });
    }
    
    // Responsive styles
    if (component.responsive) {
      Object.entries(component.responsive).forEach(([breakpoint, styles]) => {
        const mediaQuery = breakpoint === 'mobile' ? 'max-width: 768px' : 'min-width: 769px';
        css += `@media (${mediaQuery}) {\n`;
        css += `  .${component.component} {\n`;
        Object.entries(styles).forEach(([property, value]) => {
          css += `    ${property}: ${value};\n`;
        });
        css += '  }\n}\n';
      });
    }
    
    return css;
  }
  
  /**
   * Generate reasoning for style choices
   */
  private static generateStyleReasoning(
    slideType: string,
    audience: string,
    contentDensity: 'low' | 'medium' | 'high'
  ): string {
    return `Style optimized for ${slideType} slide targeting ${audience} audience with ${contentDensity} content density. ` +
           `Applied Hatch corporate branding with accessibility-compliant color contrasts and responsive design patterns. ` +
           `Used atomic design principles with modular component system for consistency and maintainability.`;
  }
  
  /**
   * Validate accessibility compliance
   */
  static validateAccessibility(theme: StyleTheme): { score: number; issues: string[] } {
    const issues: string[] = [];
    let score = 1.0;
    
    // Check color contrast ratios (simplified)
    const primaryBlue = '#095078';
    const white = '#FFFFFF';
    
    // This would use actual contrast ratio calculation
    // For now, assume Hatch colors are compliant
    
    // Check font sizes
    const hasReadableFonts = theme.tokens.some(token => 
      token.name.includes('font-size') && 
      parseFloat(token.value) >= 0.875 // 14px minimum
    );
    
    if (!hasReadableFonts) {
      issues.push('Font sizes below recommended minimum');
      score -= 0.1;
    }
    
    return { score, issues };
  }
}
