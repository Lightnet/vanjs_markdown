# Markdown Editor with Live Preview

# License
 * MIT License - see LICENSE for details.

A lightweight, browser-based Markdown editor with real-time preview, built using [VanJS](https://vanjs.org/) and [Highlight.js](https://highlightjs.org/). Write Markdown on the left, see the rendered result on the right—simple and efficient.

## Features
 - Live Preview: Instantly see your Markdown rendered as you type.
 - Syntax Highlighting: Code blocks with language-specific highlighting via Highlight.js (e.g., JavaScript, Python).
 - Rich Formatting:
    - Bold (**text**), italic (*text* or _text_), strikethrough (~~text~~).
    - Inline HTML support (e.g., <b>bold</b>).
    - Links ([text](url)) and images (![alt](url)).
        
 - Block Elements:
    - Headings (# to ######).
    - Blockquotes (> text).
    - Unordered (- item) and ordered (1. item) lists.
    - Tables (| Header | Header |\n|--------|--------|\n| Cell | Cell |).
    - Horizontal rules (---).
 - Line Breaks: Two spaces at the end of a line (text ) insert a <br> within paragraphs.
 - Paragraphs: Blank lines separate text into distinct <p> tags.
    - Footnotes: Add references like [^1] with definitions [^1]: Description rendered at the bottom[^1].


# Installation

  1. Clone the Repository:
    
bash
```bash
git clone https://github.com/yourusername/markdown-editor.git
cd markdown-editor
```
    
  2. Install Dependencies:
     - Requires Node.js and npm.
	

bash
```bash
npm install
```
    
  3. Run Locally:
      - Uses a simple static server (e.g., http-server).
        
bash
```bash
npm start
```
 * Open http://localhost:3000 in your browser.

# Usage
 - Editor: Type Markdown in the left pane.
 - Preview: See the rendered output in the right pane, updated in real-time.
 - Examples:
    
markdown
```markdown
# Hello World
This is **bold** and *italic* text.[^note]
- List item 1
- _List item 2_
[^note]: A footnote example.
```
    
    Renders as:
    
html
```html
  <h1>Hello World</h1>
  <p>This is <strong>bold</strong> and <em>italic</em> text.<sup><a href="#fn-note">note</a></sup></p>
  <ul>
    <li>List item 1</li>
    <li><em>List item 2</em></li>
  </ul>
  <hr>
  <section>
    <h2>Footnotes</h2>
    <ol>
      <li id="fn-note">A footnote example.<a href="#fnref-note">↩</a></li>
    </ol>
  </section>
```
    

# Planned Features

A list of enhancements to be added later:
  - Task Lists: Support - [ ] and - [x] for checklists.  
  - Emoji: Render :smile: as ![😊]using an emoji library.    
  - Math Support: Add LaTeX rendering (e.g., $x^2$) with KaTeX or MathJax.  
  - Autolinks: Convert bare URLs (e.g., https://example.com) to clickable links.  
  - Custom Styles: Allow users to toggle themes or upload CSS.
  - Export Options: Save as HTML, Markdown, or PDF.
  - Inline Code Blocks: Enhance styling for inline <code> tags.  
  - Nested Lists: Support indentation for multi-level lists.  
  - Image Upload: Drag-and-drop or paste images into the editor.
    


---

[^1]: This README uses the footnote feature to demonstrate its functionality!

---

Notes

- Features: Lists all current capabilities, matching what we’ve coded (e.g., footnotes, line breaks).
    
- Planned Features: A checklist of common Markdown extensions or editor enhancements to consider. These are unimplemented but can guide future development.
    
- Usage: Includes a sample to show off the editor’s rendering.
    
- GitHub Ready: Assumes a repo structure with client.js and index.html. Adjust the git clone URL to your actual repo.