<template>
  <div class="interactive-arrows" :class="[`theme-${theme}`, `layout-${layout}`]">
    <div class="arrow-container">
      <transition-group 
        name="arrow" 
        tag="div" 
        class="arrows-wrapper"
        :style="{ '--animation-speed': `${animationSpeed}ms` }"
      >
        <div
          v-for="(arrow, index) in processedArrows"
          :key="`arrow-${index}`"
          class="arrow-item"
          :class="[
            `confidence-${arrow.confidenceLevel}`,
            { 'interactive': interactive, 'hoverable': interactive }
          ]"
          :style="arrow.style"
          @mouseenter="interactive && onArrowHover(arrow, index)"
          @mouseleave="interactive && onArrowLeave(arrow, index)"
          @click="interactive && onArrowClick(arrow, index)"
        >
          <!-- Arrow SVG -->
          <svg 
            class="arrow-svg" 
            :width="arrow.width" 
            :height="arrow.height"
            viewBox="0 0 200 60"
          >
            <!-- Arrow body -->
            <path 
              :d="getArrowPath(arrow)"
              :class="`arrow-path confidence-${arrow.confidenceLevel}`"
              :stroke-width="getStrokeWidth(arrow.confidence)"
            />
            
            <!-- Arrow head -->
            <polygon 
              :points="getArrowHeadPoints(arrow)"
              :class="`arrow-head confidence-${arrow.confidenceLevel}`"
            />
            
            <!-- Confidence indicator -->
            <circle
              v-if="arrow.showConfidence"
              :cx="getConfidencePosition(arrow).x"
              :cy="getConfidencePosition(arrow).y"
              :r="8"
              :class="`confidence-indicator confidence-${arrow.confidenceLevel}`"
            />
          </svg>
          
          <!-- Arrow label -->
          <div class="arrow-label" :style="getLabelStyle(arrow)">
            <span class="arrow-text">{{ arrow.text }}</span>
            <span v-if="arrow.showConfidence" class="confidence-badge">
              {{ Math.round(arrow.confidence * 100) }}%
            </span>
          </div>
          
          <!-- Hover tooltip -->
          <transition name="tooltip">
            <div 
              v-if="interactive && hoveredArrow === index" 
              class="arrow-tooltip"
            >
              <div class="tooltip-content">
                <div class="tooltip-title">{{ arrow.text }}</div>
                <div class="tooltip-confidence">
                  Confidence: {{ Math.round(arrow.confidence * 100) }}%
                </div>
                <div v-if="arrow.description" class="tooltip-description">
                  {{ arrow.description }}
                </div>
              </div>
            </div>
          </transition>
        </div>
      </transition-group>
    </div>
    
    <!-- Legend -->
    <div v-if="showLegend" class="confidence-legend">
      <div class="legend-title">Confidence Levels</div>
      <div class="legend-items">
        <div class="legend-item confidence-low">
          <span class="legend-indicator"></span>
          <span class="legend-text">Low (0-40%)</span>
        </div>
        <div class="legend-item confidence-medium">
          <span class="legend-indicator"></span>
          <span class="legend-text">Medium (41-70%)</span>
        </div>
        <div class="legend-item confidence-high">
          <span class="legend-indicator"></span>
          <span class="legend-text">High (71-100%)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InteractiveArrows',
  props: {
    arrows: {
      type: Array,
      required: true,
      default: () => []
    },
    layout: {
      type: String,
      default: 'flow',
      validator: value => ['flow', 'radial', 'hierarchy', 'network'].includes(value)
    },
    theme: {
      type: String,
      default: 'hatch-corporate',
      validator: value => ['hatch-corporate', 'hatch-technical', 'minimal', 'bold'].includes(value)
    },
    interactive: {
      type: Boolean,
      default: true
    },
    animationSpeed: {
      type: Number,
      default: 300
    },
    showLegend: {
      type: Boolean,
      default: true
    }
  },
  
  data() {
    return {
      hoveredArrow: null,
      clickedArrow: null
    }
  },
  
  computed: {
    processedArrows() {
      return this.arrows.map((arrow, index) => ({
        ...arrow,
        confidence: arrow.confidence || 0.5,
        confidenceLevel: this.getConfidenceLevel(arrow.confidence || 0.5),
        showConfidence: arrow.showConfidence !== false,
        width: arrow.width || 200,
        height: arrow.height || 60,
        style: this.getArrowStyle(arrow, index)
      }))
    }
  },
  
  methods: {
    getConfidenceLevel(confidence) {
      if (confidence <= 0.4) return 'low'
      if (confidence <= 0.7) return 'medium'
      return 'high'
    },
    
    getArrowStyle(arrow, index) {
      const style = {}
      
      switch (this.layout) {
        case 'flow':
          style.transform = `translateX(${index * 220}px)`
          break
        case 'radial':
          const angle = (index * 360) / this.arrows.length
          const radius = 150
          style.transform = `rotate(${angle}deg) translateY(-${radius}px) rotate(-${angle}deg)`
          break
        case 'hierarchy':
          const level = Math.floor(index / 3)
          const position = index % 3
          style.transform = `translate(${position * 200}px, ${level * 100}px)`
          break
        case 'network':
          // Random-ish positioning for network effect
          const x = (index * 137.5) % 400
          const y = (index * 71.3) % 200
          style.transform = `translate(${x}px, ${y}px)`
          break
      }
      
      return style
    },
    
    getArrowPath(arrow) {
      // Create SVG path for arrow body
      return "M 10 30 L 170 30"
    },
    
    getArrowHeadPoints(arrow) {
      // Arrow head polygon points
      return "170,20 190,30 170,40"
    },
    
    getStrokeWidth(confidence) {
      // Thicker arrows for higher confidence
      return 2 + (confidence * 4)
    },
    
    getConfidencePosition(arrow) {
      return { x: 100, y: 15 }
    },
    
    getLabelStyle(arrow) {
      return {
        transform: 'translateY(45px)'
      }
    },
    
    onArrowHover(arrow, index) {
      this.hoveredArrow = index
      this.$emit('arrow-hover', { arrow, index })
    },
    
    onArrowLeave(arrow, index) {
      this.hoveredArrow = null
      this.$emit('arrow-leave', { arrow, index })
    },
    
    onArrowClick(arrow, index) {
      this.clickedArrow = index
      this.$emit('arrow-click', { arrow, index })
    }
  }
}
</script>
