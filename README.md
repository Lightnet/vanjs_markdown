# Markdown Editor with Live Preview



# License
 * MIT License - see LICENSE for details.

A lightweight, browser-based Markdown editor with real-time preview, built using [VanJS](https://vanjs.org/) and [Highlight.js](https://highlightjs.org/). Write Markdown on the left, see the rendered result on the right—simple and efficient.

# Information:
  Using the Grok Beta 3 AI Model to help build this readme and script to help build markdown. As well manual edit and test for trouble shooting.

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
 - Paragraphs: Blank lines separate text into distinct <p> tags</p>.
    - Footnotes: Add references like [^1] with definitions [^1]: Description rendered at the bottom[^1].
 - Task Lists: Support - [ ] and - [x] for checklists.
 - Nested Lists: Support indentation for multi-level lists.
 - Anchor to heading
```
# Anchors in Markdown

To create an anchor to a heading in github flavored markdown. Add - characters between each word in the heading and wrap the value in parens (#some-markdown-heading) so your link should look like so:

[create an anchor](#anchors-in-markdown)
```

# Preview
 * https://lightnet.github.io/vanjs_markdown


# Pros and Cons of the Current Text Editor Preview

# Pros:

1. Real-Time Updates
    - Strength: The preview updates instantly as the user types, thanks to VanJS’s reactive van.derive and editorState.val integration.
    - Benefit: Users get immediate feedback, which is ideal for iterative writing and debugging Markdown syntax.
        
2. Broad Feature Support
    - Strength: Supports a wide range of Markdown features: headings, inline formatting (bold, italic, strikethrough, code), links, images, code blocks, blockquotes, alerts, lists (unordered, ordered, task), tables, horizontal rules, footnotes, and HTML inline.
    - Benefit: Covers most GFM features, making it versatile for common Markdown use cases.
        
3. Syntax Highlighting
    - Strength: Integrates Highlight.js for code blocks with language-specific highlighting (e.g., JavaScript, Python).
    - Benefit: Enhances readability of code snippets, a key feature for technical documentation.
        
4. Custom Alert Styling
    - Strength: Implements GFM-style alerts ([!NOTE], [!TIP], etc.) with distinct CSS styling (colors and borders).
    - Benefit: Provides visually clear callouts, improving document structure and emphasis.
        
5. Footnote Handling
    - Strength: Parses footnotes ([^1]) and renders them as a separate section with backlinks, mimicking GFM behavior.
    - Benefit: Useful for academic or detailed writing where references are needed.
        
6. Clean HTML Output
    - Strength: Generates semantic HTML (e.g., <h1>, <strong>, <blockquote>) with consistent markdown-body classes.
    - Benefit: Easy to style further and integrates well with existing CSS frameworks.
        
7. Lightweight Framework
    - Strength: Uses VanJS, a minimal reactive library (1KB), avoiding heavy dependencies like React or Vue.
    - Benefit: Fast load times and low overhead, suitable for simple web apps.
    - 
---

# Cons:

1. Parsing Limitations
    - Weakness: parseInline processes formatting sequentially, missing nested cases (e.g., **bold *italic*** renders as <strong>bold *italic*</strong> instead of <strong>bold <em>italic</em></strong>).
    - Impact: Inconsistent rendering for complex inline formatting, reducing reliability compared to GFM.
        
2. No Error Feedback
    - Weakness: Malformed Markdown (e.g., unclosed code blocks with ```) silently fails or renders oddly without user notification.
    - Impact: Users may not realize syntax errors, leading to frustration or incorrect previews.
        
3. Limited Robustness
    - Weakness: No handling for escaped characters (e.g., \*not italic\* renders as <em>not italic</em> instead of *not italic*), and block precedence can misinterpret # in code blocks or blockquotes as headings.
    - Impact: Edge cases break expected behavior, making it less trustworthy for advanced users.
        
4. Incomplete GFM Support
    - Weakness: Missing features like autolinking URLs (e.g., https://example.com doesn’t become a link), emoji shortcodes (e.g., :smile:), or definition lists.
    - Impact: Lags behind full GFM compliance, limiting compatibility with tools expecting these features.
        
5. Accessibility Gaps
    - Weakness: Lacks ARIA labels for headings, footnotes, or interactive elements (e.g., task list checkboxes are disabled with no alternative).
    - Impact: Reduced usability for screen reader users or those relying on keyboard navigation.
        
6. Performance with Large Documents
    - Weakness: Re-parses the entire document on every keystroke without debouncing, and string operations (e.g., split, regex) scale poorly with size.
    - Impact: Potential lag or browser slowdown for long Markdown files (e.g., >1000 lines).
        
7. Static Layout
    - Weakness: The split-pane design (editor and preview side-by-side) isn’t responsive or configurable (e.g., no toggle to hide editor).
    - Impact: Poor experience on small screens or for users who prefer a different workflow.
        
8. No Undo/Redo or History
    - Weakness: Changes to editorState.val.text are immediate with no built-in history tracking.
    - Impact: Users can’t easily revert mistakes, a common expectation in text editors.
        
9. Dependency Load Risk
    - Weakness: Highlight.js loading is async and lacks a robust fallback; if it fails, code blocks lose highlighting with no retry mechanism.
    - Impact: Inconsistent preview quality in poor network conditions.
    
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
  - Emoji: Render :smile: as ![😊]using an emoji library.
  - Math Support: Add LaTeX rendering (e.g., $x^2$) with KaTeX or MathJax.  
  - Autolinks: Convert bare URLs (e.g., https://example.com) to clickable links.  
  - Custom Styles: Allow users to toggle themes or upload CSS.
  - Export Options: Save as HTML, Markdown, or PDF.
  - Inline Code Blocks: Enhance styling for inline <code> tags</code>.
  - Image Upload: Drag-and-drop or paste images into the editor.
  
[^1]: This README uses the footnote feature to demonstrate its functionality!

# Notes:
  - Features: Lists all current capabilities, matching what we’ve coded (e.g., footnotes, line breaks).
  - Planned Features: A checklist of common Markdown extensions or editor enhancements to consider. These are unimplemented but can guide future development.
  - Usage: Includes a sample to show off the editor’s rendering.  
  - GitHub Ready: Assumes a repo structure with client.js and index.html. Adjust the git clone URL to your actual repo.