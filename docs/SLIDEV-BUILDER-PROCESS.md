# Slidev Builder Process
> This process is a comprehensive framework for building powerful presentation decks with Slidev using generative AI in a co-creation process where efficiency and storytelling excellence are required. The main ideas with this enhanced approach are:

## **Core Principles**
- **Efficient use of time** avoiding the loop trap to get exactly what you want with generative AI, which is currently weaker in image generation and worse when image generation mixes with text.
- **Intensive use of generative AI** in an **Operating System Platform** like VSCode and Copilot, supporting this process with **MCP Servers** to make it easier to follow the workflow.
- **Story-driven presentations** that prepare a storyboard and practice storytelling capacity with narrative architecture.
- **Pyramid communication process** where information is well condensed in essence and conveyed top-down, making use of dynamic capabilities and components in HTML presentations.
- **Full power of graphical user interfaces** using not only available tools but intensive use of APIs, MCP (*Model Context Protocol*) servers, CDN (*Content Delivery Network*) servers, to boost capabilities for conveying messages with powerful images, videos, icons, generative images and videos, shapes, and any graphical element.
- **Use all the power of Python** to create simulations, graphics, machine learning, charts, and in general all the functionality of this amazing programming language.

## **Enhanced Capabilities**
- **Multi-modal asset integration** with real-time data connections and dynamic content
- **AI-enhanced content optimization** for clarity, persuasiveness, and audience engagement
- **Collaboration and version control** with stakeholder feedback loops and presentation analytics
- **Accessibility and internationalization** with auto-translation and inclusive design features


---
## Main Step Process *Must be included in Slidev Builder Initialization*
This process steps must be implemented inside slidev builder initialization, where these steps must be implemented in folders for every step.

0. **Story Architecture**: Define narrative framework before development
   - *Narrative Arc Design*: Create story spine with emotional beats and engagement points
   - *Audience Journey Mapping*: Define viewer experience and key message progression
   - *Message Hierarchy*: Establish primary, secondary, and supporting messages

1. **Main Idea**: The initial condensed idea that needs to be developed

2. **Idea Development**: In this folder will develop the initial idea through a series of iterations, beginning with the initial idea and using all support documents and generative LLMs capabilities jointly with internet search tools. The results of this step must produce:
   - *Powerful TXT document* that conveys and deploys all the context supporting the initial idea in TXT standard, this must be well-structured, easily readable final text document
   - *A comprehensive DOCX* Document that must have a Content Index, Executive Summary, Graphs and Charts, appendices, pagination, Branded header and footer inside the DOCX format
   - *Condensed MD Document* the *Powerful TXT document* must be converted into mastery-built *Markdown* document which will be the basis for presentation deck

3. **Slides Deck** starting from step before this folder must contain:
   - *Slides.md* for slides orchestration
   - *Slides folder* this folder must contain the individual slides MD files
   - *Slides Layouts* this folder must have the individual drawio file for each slide layout which will be the basics for slide structure. One file per slide, this should include minimal information required to convey the main idea, and pop-up and click reveal ideas too, to make a top-down, visually appealing and interactive presentation

4. **Assets Deck** this should include all the assets that will support the layout and must include:
   - *Images Folder* for all the generated images, this could be obtained from CDN server, APIs, MCPs and using Generative AI
   - *Video Folders* for all the videos supporting slide deck, this could be obtained from CDN server, APIs, MCPs and using Generative AI
   - *Python files* That are created to produce assets like graphs, charts, tables, simulations, apps
   - *3D Elements* Integration with Three.js for immersive visualizations
   - *Interactive Simulations* Embedded calculators, scenario builders, live demos
   - *Audio Integration* Background music, sound effects, voice-over narration

## **Advanced Enhancement Features**

### **AI-Enhanced Capabilities**
- **Content Optimization AI**: Analyze slide content for clarity, persuasiveness, and audience appropriateness
- **Visual Harmony AI**: Ensure consistent design language, color theory, and visual hierarchy
- **Rehearsal AI**: Practice mode with AI feedback on pacing, tone, and delivery
- **Adaptive Content**: Slides that adjust based on audience reactions or time constraints

### **Technical Enhancements**
- **Template Library System**: Pre-built slide templates for common presentation patterns (problem-solution, before-after, comparison matrices)
- **Dynamic Data Integration**: Real-time API connections for live charts, market data, social feeds
- **Accessibility Layer**: Auto-generate alt-text, screen reader support, color contrast validation
- **Multi-Language Support**: Auto-translation capabilities for global presentations

### **Collaboration Features**
- **Version Control Integration**: Git-based slide versioning with branching for different presentation versions
- **Review & Annotation System**: Stakeholder feedback loops with comment threads on specific slides
- **Presentation Analytics**: Track viewer engagement, slide duration, interaction hotspots

### **Workflow Optimizations**
- **Smart Asset Suggestions**: AI recommends relevant images, videos, charts based on slide content
- **Automated Quality Checks**: Spell check, fact verification, citation validation
- **Performance Optimization**: Automatic image compression, lazy loading, CDN optimization
- **Export Flexibility**: Multiple output formats (PDF, video, interactive web, mobile app, AR/VR ready)

---

## **MCP Tool Implementation**

This process is implemented through the following MCP tools:

### **Core Tools:**
1. **`initializeProject`** - Master orchestrator that implements the complete 5-step process
2. **`createSlide`** - Individual slide creation and editing
3. **`generateAssets`** - Universal asset creation (charts, Python, 3D, interactive, audio, video)

### **Management Tools:**
4. **`addComponent`** - Component management and enhancement
5. **`listComponents`** - Component discovery and cataloging
6. **`applyTheme`** - Theme management and brand consistency
7. **`exportDeck`** - Enhanced export with multiple format support

### **Enhancement Tools:**
8. **`optimizeContent`** - AI-powered content optimization and analysis
9. **`analyzePresentation`** - Analytics, feedback, and performance metrics

Each tool is designed to work seamlessly within this comprehensive process framework while maintaining the flexibility to be used independently for specific tasks.
