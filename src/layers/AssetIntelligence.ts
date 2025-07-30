/**
 * Layer 3: Asset Intelligence Engine
 * Smart asset curation and management with semantic matching
 */

export interface AssetMetadata {
  id: string;
  type: 'icon' | 'image' | 'video' | 'chart' | 'diagram' | 'logo';
  source: 'unsplash' | 'iconify' | 'freepik' | 'huggingface' | 'local' | 'supabase';
  url: string;
  thumbnail_url?: string;
  alt_text: string;
  tags: string[];
  semantic_score: number;
  brand_compliance: boolean;
  cultural_appropriateness: boolean;
  license: 'free' | 'attribution' | 'premium';
  dimensions?: { width: number; height: number };
}

export interface AssetRecommendation {
  assets: AssetMetadata[];
  reasoning: string;
  confidence_score: number;
  fallback_options: AssetMetadata[];
}

export interface AssetQuery {
  content_context: string;
  slide_type: string;
  target_audience: string;
  brand_guidelines?: string;
  cultural_context?: string;
  preferred_style?: 'professional' | 'casual' | 'technical' | 'creative';
}

export class AssetIntelligenceEngine {
  
  /**
   * Curate assets based on content context and brand guidelines
   */
  static async curateAssets(query: AssetQuery): Promise<AssetRecommendation> {
    const searchTerms = this.extractSearchTerms(query.content_context);
    const styleFilter = this.getStyleFilter(query.preferred_style || 'professional');
    
    // Search across multiple sources
    const unsplashAssets = await this.searchUnsplash(searchTerms, styleFilter);
    const iconifyAssets = await this.searchIconify(searchTerms);
    const freepikAssets = await this.searchFreepik(searchTerms, styleFilter);
    
    // Combine and score assets
    const allAssets = [...unsplashAssets, ...iconifyAssets, ...freepikAssets];
    const scoredAssets = this.scoreAssets(allAssets, query);
    
    // Filter by brand compliance and cultural appropriateness
    const compliantAssets = scoredAssets.filter(asset => 
      asset.brand_compliance && asset.cultural_appropriateness
    );
    
    // Sort by semantic score and select top candidates
    const recommendedAssets = compliantAssets
      .sort((a, b) => b.semantic_score - a.semantic_score)
      .slice(0, 5);
    
    const fallbackAssets = scoredAssets
      .filter(asset => !recommendedAssets.includes(asset))
      .slice(0, 3);
    
    return {
      assets: recommendedAssets,
      reasoning: this.generateReasoning(recommendedAssets, query),
      confidence_score: this.calculateConfidenceScore(recommendedAssets),
      fallback_options: fallbackAssets
    };
  }
  
  /**
   * Extract search terms from content context
   */
  private static extractSearchTerms(content: string): string[] {
    // Remove common words and extract meaningful terms
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.includes(word));
    
    // Extract key business and technical terms
    const businessTerms = words.filter(word => 
      ['business', 'strategy', 'growth', 'innovation', 'technology', 'solution', 'service'].includes(word)
    );
    
    // Combine unique terms
    const uniqueTerms = [...new Set([...businessTerms, ...words.slice(0, 5)])];
    
    return uniqueTerms.slice(0, 10); // Limit to top 10 terms
  }
  
  /**
   * Get style filter based on preferences
   */
  private static getStyleFilter(style: string): Record<string, any> {
    const filters: Record<string, any> = {
      professional: {
        color: 'blue',
        orientation: 'landscape',
        keywords: ['business', 'corporate', 'professional', 'clean', 'minimal']
      },
      casual: {
        color: null,
        orientation: null,
        keywords: ['friendly', 'approachable', 'modern', 'colorful']
      },
      technical: {
        color: 'black_and_white',
        orientation: 'landscape',
        keywords: ['technical', 'engineering', 'data', 'diagram', 'schematic']
      },
      creative: {
        color: null,
        orientation: null,
        keywords: ['creative', 'artistic', 'innovative', 'unique', 'bold']
      }
    };
    
    return filters[style] || filters.professional;
  }
  
  /**
   * Search Unsplash for relevant images
   */
  private static async searchUnsplash(terms: string[], styleFilter: any): Promise<AssetMetadata[]> {
    const searchQuery = terms.join(' ');
    
    try {
      // This would integrate with the Unsplash MCP
      // For now, return mock data structure
      return [
        {
          id: 'unsplash_1',
          type: 'image',
          source: 'unsplash',
          url: 'https://images.unsplash.com/example',
          alt_text: `Professional ${searchQuery} image`,
          tags: terms,
          semantic_score: 0.8,
          brand_compliance: true,
          cultural_appropriateness: true,
          license: 'free',
          dimensions: { width: 1920, height: 1080 }
        }
      ];
    } catch (error) {
      console.error('Unsplash search failed:', error);
      return [];
    }
  }
  
  /**
   * Search Iconify for relevant icons
   */
  private static async searchIconify(terms: string[]): Promise<AssetMetadata[]> {
    try {
      // This would integrate with the Iconify MCP
      return terms.slice(0, 3).map((term, index) => ({
        id: `iconify_${index}`,
        type: 'icon' as const,
        source: 'iconify' as const,
        url: `https://api.iconify.design/mdi/${term}.svg`,
        alt_text: `${term} icon`,
        tags: [term],
        semantic_score: 0.9,
        brand_compliance: true,
        cultural_appropriateness: true,
        license: 'free' as const,
        dimensions: { width: 24, height: 24 }
      }));
    } catch (error) {
      console.error('Iconify search failed:', error);
      return [];
    }
  }
  
  /**
   * Search Freepik for premium assets
   */
  private static async searchFreepik(terms: string[], styleFilter: any): Promise<AssetMetadata[]> {
    try {
      // This would integrate with the Freepik MCP
      return [
        {
          id: 'freepik_1',
          type: 'image',
          source: 'freepik',
          url: 'https://freepik.com/example',
          alt_text: `Premium ${terms[0]} illustration`,
          tags: terms,
          semantic_score: 0.85,
          brand_compliance: true,
          cultural_appropriateness: true,
          license: 'premium',
          dimensions: { width: 1920, height: 1080 }
        }
      ];
    } catch (error) {
      console.error('Freepik search failed:', error);
      return [];
    }
  }
  
  /**
   * Score assets based on relevance and context
   */
  private static scoreAssets(assets: AssetMetadata[], query: AssetQuery): AssetMetadata[] {
    return assets.map(asset => {
      let score = asset.semantic_score;
      
      // Boost score for matching slide type
      if (query.slide_type === 'hero' && asset.type === 'image') {
        score += 0.1;
      } else if (query.slide_type === 'process' && asset.type === 'icon') {
        score += 0.15;
      }
      
      // Boost for professional style with executive audience
      if (query.target_audience === 'executive' && asset.tags.includes('professional')) {
        score += 0.1;
      }
      
      // Penalty for premium assets unless specifically requested
      if (asset.license === 'premium' && !query.content_context.includes('premium')) {
        score -= 0.05;
      }
      
      return {
        ...asset,
        semantic_score: Math.min(1.0, score)
      };
    });
  }
  
  /**
   * Generate reasoning for asset recommendations
   */
  private static generateReasoning(assets: AssetMetadata[], query: AssetQuery): string {
    const assetTypes = [...new Set(assets.map(a => a.type))];
    const sources = [...new Set(assets.map(a => a.source))];
    
    return `Selected ${assets.length} assets (${assetTypes.join(', ')}) from ${sources.join(', ')} ` +
           `optimized for ${query.slide_type} slide targeting ${query.target_audience} audience. ` +
           `Assets chosen for high semantic relevance and brand compliance.`;
  }
  
  /**
   * Calculate confidence score for recommendations
   */
  private static calculateConfidenceScore(assets: AssetMetadata[]): number {
    if (assets.length === 0) return 0;
    
    const avgSemanticScore = assets.reduce((sum, asset) => sum + asset.semantic_score, 0) / assets.length;
    const brandComplianceRate = assets.filter(a => a.brand_compliance).length / assets.length;
    
    return (avgSemanticScore * 0.7) + (brandComplianceRate * 0.3);
  }
  
  /**
   * Validate asset against brand guidelines
   */
  static validateBrandCompliance(asset: AssetMetadata, brandGuidelines: any): boolean {
    // Implementation would check against actual brand guidelines
    // For now, basic validation
    
    if (brandGuidelines?.colors && asset.tags.some(tag => 
      brandGuidelines.colors.includes(tag.toLowerCase())
    )) {
      return true;
    }
    
    if (brandGuidelines?.style && asset.tags.includes(brandGuidelines.style)) {
      return true;
    }
    
    // Default to true for professional content
    return asset.tags.includes('professional') || asset.tags.includes('business');
  }
  
  /**
   * Check cultural appropriateness
   */
  static checkCulturalAppropriateness(asset: AssetMetadata, context: string): boolean {
    // Basic implementation - would be enhanced with actual cultural sensitivity analysis
    const sensitiveTerms = ['religious', 'political', 'controversial'];
    const assetContent = asset.alt_text.toLowerCase() + ' ' + asset.tags.join(' ').toLowerCase();
    
    return !sensitiveTerms.some(term => assetContent.includes(term));
  }
}
