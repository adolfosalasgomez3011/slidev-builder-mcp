# Interactive Arrows - Basic Example

This example shows how to use the Interactive Arrows component for a simple decision flow.

## Basic Usage

```vue
<InteractiveArrows
  :arrows="decisionArrows"
  layout="flow"
  theme="hatch-corporate"
  :interactive="true"
/>
```

## Component Data

```javascript
export default {
  data() {
    return {
      decisionArrows: [
        {
          text: "Option A",
          confidence: 0.8,
          description: "High-confidence strategic direction with proven ROI"
        },
        {
          text: "Option B", 
          confidence: 0.6,
          description: "Medium-confidence alternative with moderate risk"
        },
        {
          text: "Option C",
          confidence: 0.3,
          description: "Low-confidence experimental approach"
        }
      ]
    }
  }
}
```

## Result

This creates three horizontal arrows showing different strategic options with color-coded confidence levels:

- **Option A** (80% confidence) - Green arrow with solid line
- **Option B** (60% confidence) - Orange arrow with dashed line  
- **Option C** (30% confidence) - Red arrow with dotted line

Perfect for executive presentations where you need to show decision confidence visually.

## Use Cases

- Strategic decision matrices
- Risk assessment presentations
- Confidence-based recommendations
- Process flow diagrams
- Investment prioritization
