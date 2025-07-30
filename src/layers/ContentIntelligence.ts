/**
 * Layer 1: Content Intelligence
 * Analyzes and structures presentation content using proven frameworks
 */

export interface ContentStructure {
  narrative_flow: 'problem_solution' | 'before_after' | 'feature_benefit' | 'pyramid_principle';
  information_hierarchy: 'primary' | 'secondary' | 'supporting';
  cognitive_load_score: number;
  messaging_framework: 'mckinsey_scce' | 'storytelling_arc' | 'consultative_selling';
}

export interface ContentAnalysisResult {
  content_structure: ContentStructure;
  key_messages: string[];
  audience_adaptation: 'technical' | 'executive' | 'general';
  slide_recommendations: SlideRecommendation[];
  content_density: 'low' | 'medium' | 'high';
}

export interface SlideRecommendation {
  slide_type: 'hero' | 'problem' | 'solution' | 'evidence' | 'action' | 'summary';
  priority: number;
  estimated_time: number;
  content_points: string[];
}

export class ContentIntelligenceEngine {
  
  /**
   * Analyze content using established frameworks
   */
  static analyzeContent(content: string, audience: string = 'executive'): ContentAnalysisResult {
    const words = content.split(' ').length;
    const sentences = content.split(/[.!?]+/).length;
    const cognitive_load_score = Math.min(10, Math.floor(words / 50));
    
    // Apply pyramid principle for executive content
    const narrative_flow = audience === 'executive' ? 'pyramid_principle' : 'problem_solution';
    
    // Extract key messages (simplified NLP approach)
    const key_messages = this.extractKeyMessages(content);
    
    // Generate slide recommendations
    const slide_recommendations = this.generateSlideRecommendations(content, audience);
    
    return {
      content_structure: {
        narrative_flow,
        information_hierarchy: 'primary',
        cognitive_load_score,
        messaging_framework: 'mckinsey_scce'
      },
      key_messages,
      audience_adaptation: audience as any,
      slide_recommendations,
      content_density: cognitive_load_score > 7 ? 'high' : cognitive_load_score > 4 ? 'medium' : 'low'
    };
  }
  
  /**
   * Extract key messages using simple heuristics
   */
  private static extractKeyMessages(content: string): string[] {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    // Look for key indicators
    const keyIndicators = [
      'key', 'important', 'critical', 'essential', 'primary', 'main',
      'result', 'outcome', 'benefit', 'advantage', 'value', 'impact'
    ];
    
    return sentences
      .filter(sentence => 
        keyIndicators.some(indicator => 
          sentence.toLowerCase().includes(indicator)
        )
      )
      .slice(0, 5) // Top 5 key messages
      .map(s => s.trim());
  }
  
  /**
   * Generate slide recommendations based on content analysis
   */
  private static generateSlideRecommendations(content: string, audience: string): SlideRecommendation[] {
    const recommendations: SlideRecommendation[] = [];
    
    // Always start with hero slide
    recommendations.push({
      slide_type: 'hero',
      priority: 1,
      estimated_time: 30,
      content_points: ['Title', 'Subtitle', 'Key value proposition']
    });
    
    // Problem identification (if content suggests it)
    if (content.toLowerCase().includes('problem') || content.toLowerCase().includes('challenge')) {
      recommendations.push({
        slide_type: 'problem',
        priority: 2,
        estimated_time: 60,
        content_points: ['Problem statement', 'Current state challenges', 'Impact quantification']
      });
    }
    
    // Solution presentation
    if (content.toLowerCase().includes('solution') || content.toLowerCase().includes('approach')) {
      recommendations.push({
        slide_type: 'solution',
        priority: 3,
        estimated_time: 90,
        content_points: ['Solution overview', 'Key features', 'Implementation approach']
      });
    }
    
    // Evidence and validation
    if (content.toLowerCase().includes('result') || content.toLowerCase().includes('benefit')) {
      recommendations.push({
        slide_type: 'evidence',
        priority: 4,
        estimated_time: 60,
        content_points: ['Key results', 'Success metrics', 'Validation points']
      });
    }
    
    // Call to action
    recommendations.push({
      slide_type: 'action',
      priority: 5,
      estimated_time: 45,
      content_points: ['Next steps', 'Call to action', 'Contact information']
    });
    
    return recommendations;
  }
  
  /**
   * Apply cognitive load optimization
   */
  static optimizeCognitiveLoad(content: string[], maxItems: number = 7): string[] {
    if (content.length <= maxItems) return content;
    
    // Group related items or prioritize most important
    return content.slice(0, maxItems);
  }
}
