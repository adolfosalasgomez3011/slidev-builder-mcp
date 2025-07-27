---
theme: hatch-executive
background: '#FFFFFF'
class: text-center
highlighter: shiki
lineNumbers: false
info: false
drawings:
  enabled: true
  persist: false
  presenterOnly: false
  syncAll: true
transition: fade
title: '{{title}}'
mdc: true
themeConfig:
  primary: '#00A651'
  secondary: '#004225'
  accent: '#FFB800'
  logo: 'https://www.hatch.com/themes/custom/hatch_theme/logo.svg'
---

# {{title}}

## Executive Summary

### {{date}}

---
layout: executive-summary
---

# Executive Summary

<div class="grid grid-cols-2 gap-8">
  <div>
    ## Key Highlights
    - Strategic Initiative A
    - Market Opportunity B
    - Competitive Advantage C
  </div>
  <div>
    ## Metrics Overview
    - ROI: {{roi}}%
    - Timeline: {{timeline}}
    - Investment: {{investment}}
  </div>
</div>

---
layout: key-metrics
---

# Key Performance Indicators

<div class="grid grid-cols-3 gap-8">
  <div class="text-center">
    <div class="text-4xl font-bold text-[#00A651]">{{metric1}}</div>
    <div class="text-lg">Revenue Growth</div>
  </div>
  <div class="text-center">
    <div class="text-4xl font-bold text-[#004225]">{{metric2}}</div>
    <div class="text-lg">Cost Reduction</div>
  </div>
  <div class="text-center">
    <div class="text-4xl font-bold text-[#FFB800]">{{metric3}}</div>
    <div class="text-lg">Efficiency Gain</div>
  </div>
</div>

---
layout: conclusion
---

# Strategic Recommendations

<div class="text-left space-y-4">
  
## Immediate Actions (0-3 months)
- Action item 1
- Action item 2

## Medium-term Goals (3-12 months)  
- Goal 1
- Goal 2

## Long-term Vision (1-3 years)
- Vision element 1
- Vision element 2

</div>

---
layout: center
---

# Questions & Discussion

<div class="text-center mt-8">
  <img src="https://www.hatch.com/themes/custom/hatch_theme/logo.svg" class="h-16 mx-auto mb-4" />
  <p class="text-lg">Hatch Advisory</p>
</div>
