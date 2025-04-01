import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.5.3.min.js";

const { div, p, h1, h2, h3, h4, h5, h6, pre, code, button, textarea, strong, em, a, ul, ol, li, blockquote, br, table, thead, tbody, tr, th, td, img, span, hr, del, sup, section, input } = van.tags;

// Editor State
const editorState = van.state({
  text: "# Sample Title\n\nHello, **bold** and *italic* world![^1]\n\n> This is a **blockquote** with *emphasis*\n> Another line\n\n| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | **Cell 2** |\n| *Cell 3* | <span style=\"color: red;\">Cell 4</span> |\n\n![Sample Image](https://via.placeholder.com/150)\n\nHere's some <b>bold</b> and <i>italic</i> inline HTML.\nWith a break  \nright here  \nand more.[^2]\n\nasdddd\ndddddd\ndddddd\n\nddddd\nddddd\n\n[^1]: This is the first footnote.\n[^2]: This is the second footnote with **bold** text.\n\n---\n\n```javascript\nconsole.log('hi');\n```\n\n- Item 1\n- _Item 2_\n\n1. First\n2. ~~Second~~\n\n[Link](https://example.com)\n\n`inline code`"
});

// Highlight.js State
const hljsState = van.state(null);

// Load highlight.js and languages
const loadHighlightJS = async () => {
  const hljs = (await import("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/es/highlight.min.js")).default;
  const jsLang = (await import("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/es/languages/javascript.min.js")).default;
  const pyLang = (await import("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/es/languages/python.min.js")).default;

  hljs.registerLanguage("javascript", jsLang);
  hljs.registerLanguage("python", pyLang);

  hljsState.val = hljs;
  return hljs;
};

// Initialize highlight.js
loadHighlightJS();

// Inline parsing function (unchanged)
const parseInline = (text, footnotes) => {
  let parts = [text];
  parts = parts.flatMap(part => {
    if (typeof part !== "string") return [part];
    const result = [];
    let remaining = part;
    const footnoteRegex = /\[\^([^\]]+)\]/g;
    let lastIndex = 0;
    let match;
    while ((match = footnoteRegex.exec(remaining)) !== null) {
      if (match.index > lastIndex) result.push(remaining.slice(lastIndex, match.index));
      const id = match[1];
      result.push(footnotes[id] ? sup(a({ href: `#fn-${id}`, id: `fnref-${id}`, class: "footnote-ref" }, id)) : `[^${id}]`);
      lastIndex = footnoteRegex.lastIndex;
    }
    if (lastIndex < remaining.length) result.push(remaining.slice(lastIndex));
    return result.length ? result : [part];
  });
  parts = parts.flatMap(part => {
    if (typeof part !== "string") return [part];
    const result = [];
    let remaining = part;
    const htmlRegex = /<([a-zA-Z][a-zA-Z0-9]*)([^>]*)>(.*?)<\/\1>|<([a-zA-Z][a-zA-Z0-9]*)([^>]*)\/>/g;
    let lastIndex = 0;
    let match;
    while ((match = htmlRegex.exec(remaining)) !== null) {
      if (match.index > lastIndex) result.push(remaining.slice(lastIndex, match.index));
      const tag = match[1] || match[4];
      const attributes = match[2] || match[5] || "";
      const content = match[3] || "";
      result.push(span({ innerHTML: `<${tag}${attributes}>${content}</${tag}>` }));
      lastIndex = htmlRegex.lastIndex;
    }
    if (lastIndex < remaining.length) result.push(remaining.slice(lastIndex));
    return result.length ? result : [part];
  });
  parts = parts.flatMap(part => {
    if (typeof part !== "string") return [part];
    const result = [];
    let remaining = part;
    const codeRegex = /`([^`]+)`/g;
    let lastIndex = 0;
    let match;
    while ((match = codeRegex.exec(remaining)) !== null) {
      if (match.index > lastIndex) result.push(remaining.slice(lastIndex, match.index));
      result.push(code(match[1]));
      lastIndex = codeRegex.lastIndex;
    }
    if (lastIndex < remaining.length) result.push(remaining.slice(lastIndex));
    return result.length ? result : [part];
  });
  parts = parts.flatMap(part => {
    if (typeof part !== "string") return [part];
    const result = [];
    let remaining = part;
    const strikeRegex = /~~([^~]+)~~/g;
    let lastIndex = 0;
    let match;
    while ((match = strikeRegex.exec(remaining)) !== null) {
      if (match.index > lastIndex) result.push(remaining.slice(lastIndex, match.index));
      result.push(del(match[1]));
      lastIndex = strikeRegex.lastIndex;
    }
    if (lastIndex < remaining.length) result.push(remaining.slice(lastIndex));
    return result.length ? result : [part];
  });
  parts = parts.flatMap(part => {
    if (typeof part !== "string") return [part];
    const result = [];
    let remaining = part;
    const boldRegex = /\*\*([^*]+)\*\*/g;
    let lastIndex = 0;
    let match;
    while ((match = boldRegex.exec(remaining)) !== null) {
      if (match.index > lastIndex) result.push(remaining.slice(lastIndex, match.index));
      result.push(strong(match[1]));
      lastIndex = boldRegex.lastIndex;
    }
    if (lastIndex < remaining.length) result.push(remaining.slice(lastIndex));
    return result.length ? result : [part];
  });
  parts = parts.flatMap(part => {
    if (typeof part !== "string") return [part];
    const result = [];
    let remaining = part;
    const italicRegex = /(\*|_)([^*_]+)\1/g;
    let lastIndex = 0;
    let match;
    while ((match = italicRegex.exec(remaining)) !== null) {
      if (match.index > lastIndex) result.push(remaining.slice(lastIndex, match.index));
      result.push(em(match[2]));
      lastIndex = italicRegex.lastIndex;
    }
    if (lastIndex < remaining.length) result.push(remaining.slice(lastIndex));
    return result.length ? result : [part];
  });
  parts = parts.flatMap(part => {
    if (typeof part !== "string") return [part];
    const result = [];
    let remaining = part;
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match;
    while ((match = imageRegex.exec(remaining)) !== null) {
      if (match.index > lastIndex) result.push(remaining.slice(lastIndex, match.index));
      result.push(img({ src: match[2], alt: match[1], class: "markdown-body" }));
      lastIndex = imageRegex.lastIndex;
    }
    if (lastIndex < remaining.length) result.push(remaining.slice(lastIndex));
    return result.length ? result : [part];
  });
  parts = parts.flatMap(part => {
    if (typeof part !== "string") return [part];
    const result = [];
    let remaining = part;
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match;
    while ((match = linkRegex.exec(remaining)) !== null) {
      if (match.index > lastIndex) result.push(remaining.slice(lastIndex, match.index));
      result.push(a({ href: match[2] }, match[1]));
      lastIndex = linkRegex.lastIndex;
    }
    if (lastIndex < remaining.length) result.push(remaining.slice(lastIndex));
    return result.length ? result : [part];
  });
  return parts;
};


// Parse Markdown text into blocks and footnotes
// Parse Markdown text into blocks and footnotes
const parseMarkdown = (text) => {
  const blocks = [];
  const footnotes = {};
  const lines = text.split("\n");

  let currentCodeBlock = null;
  let currentBlockquote = null;
  let currentTable = null;
  let currentParagraphLines = [];
  let listStack = []; // Stack to track nested list levels
  let currentAlertType = null;
  let pendingAnchor = null;

  const getSpaceCount = (line) => line.match(/^\s*/)[0].length;

  const processListItems = (items) => {
    items.forEach(item => {
      if (item.text.startsWith("[ ] ")) {
        item.isTask = true;
        item.checked = false;
        item.text = item.text.replace("[ ] ", "").trim();
        console.log(`Task: "${item.text}", checked: ${item.checked}`);
      } else if (item.text.startsWith("[x] ") || item.text.startsWith("[X] ")) {
        item.isTask = true;
        item.checked = true;
        item.text = item.text.replace(/^\[x\] /i, "").trim();
        console.log(`Task: "${item.text}", checked: ${item.checked}`);
      } else {
        item.isTask = false;
        item.checked = false;
      }
      if (item.children) processListItems(item.children.items);
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    const spaceCount = getSpaceCount(line);

    // Handle anchor tags
    if (trimmedLine.match(/^<a id="[^"]+"><\/a>$/)) {
      if (listStack.length) {
        processListItems(listStack[0].items);
        blocks.push(listStack[0]);
        listStack = [];
      }
      if (currentParagraphLines.length) {
        blocks.push({ type: "paragraph", text: currentParagraphLines.join("\n") });
        currentParagraphLines = [];
      }
      pendingAnchor = trimmedLine.match(/^<a id="([^"]+)"><\/a>$/)[1];
      continue;
    }

    // Handle footnotes
    if (trimmedLine.match(/^\[\^[^\]]+\]:/)) {
      if (listStack.length) {
        processListItems(listStack[0].items);
        blocks.push(listStack[0]);
        listStack = [];
      }
      if (currentBlockquote) {
        blocks.push({ type: "blockquote", text: currentBlockquote.text, alertType: currentAlertType });
        currentBlockquote = null;
        currentAlertType = null;
      }
      if (currentTable) {
        blocks.push(currentTable);
        currentTable = null;
      }
      if (currentParagraphLines.length) {
        blocks.push({ type: "paragraph", text: currentParagraphLines.join("\n") });
        currentParagraphLines = [];
      }
      const [id, ...content] = trimmedLine.split(":");
      const footnoteId = id.replace(/^\[\^|\]$/g, "").trim();
      footnotes[footnoteId] = content.join(":").trim();
      continue;
    }

    // Handle headers
    if (trimmedLine.startsWith("#")) {
      const level = trimmedLine.match(/^#+/)[0].length;
      if (level <= 6) {
        if (listStack.length) {
          processListItems(listStack[0].items);
          blocks.push(listStack[0]);
          listStack = [];
        }
        if (currentParagraphLines.length) {
          blocks.push({ type: "paragraph", text: currentParagraphLines.join("\n") });
          currentParagraphLines = [];
        }
        blocks.push({ type: `h${level}`, text: trimmedLine.replace(/^#+/, "").trim() });
        continue;
      }
    }

    // Handle code blocks
    if (trimmedLine.startsWith("```")) {
      if (listStack.length) {
        processListItems(listStack[0].items);
        blocks.push(listStack[0]);
        listStack = [];
      }
      if (currentBlockquote) {
        blocks.push({ type: "blockquote", text: currentBlockquote.text, alertType: currentAlertType });
        currentBlockquote = null;
        currentAlertType = null;
      }
      if (currentTable) {
        blocks.push(currentTable);
        currentTable = null;
      }
      if (currentParagraphLines.length) {
        blocks.push({ type: "paragraph", text: currentParagraphLines.join("\n") });
        currentParagraphLines = [];
      }
      if (currentCodeBlock) {
        blocks.push(currentCodeBlock);
        currentCodeBlock = null;
      } else {
        const language = trimmedLine.replace("```", "").trim() || "text";
        currentCodeBlock = { type: "code", language, text: "" };
      }
      continue;
    }

    if (currentCodeBlock) {
      currentCodeBlock.text += (currentCodeBlock.text ? "\n" : "") + line;
      continue;
    }

    // Handle blockquotes and alerts
    if (trimmedLine.startsWith("> ")) {
      if (listStack.length) {
        processListItems(listStack[0].items);
        blocks.push(listStack[0]);
        listStack = [];
      }
      if (currentTable) {
        blocks.push(currentTable);
        currentTable = null;
      }
      if (currentParagraphLines.length) {
        blocks.push({ type: "paragraph", text: currentParagraphLines.join("\n") });
        currentParagraphLines = [];
      }
      const content = trimmedLine.replace("> ", "").trim();
      if (content.match(/^\[!NOTE\]$/)) {
        currentAlertType = "note";
        if (currentBlockquote) {
          blocks.push({ type: "blockquote", text: currentBlockquote.text, alertType: null });
          currentBlockquote = null;
        }
        currentBlockquote = { text: "" };
        continue;
      } else if (content.match(/^\[!TIP\]$/)) {
        currentAlertType = "tip";
        if (currentBlockquote) {
          blocks.push({ type: "blockquote", text: currentBlockquote.text, alertType: null });
          currentBlockquote = null;
        }
        currentBlockquote = { text: "" };
        continue;
      } else if (content.match(/^\[!IMPORTANT\]$/)) {
        currentAlertType = "important";
        if (currentBlockquote) {
          blocks.push({ type: "blockquote", text: currentBlockquote.text, alertType: null });
          currentBlockquote = null;
        }
        currentBlockquote = { text: "" };
        continue;
      } else if (content.match(/^\[!WARNING\]$/)) {
        currentAlertType = "warning";
        if (currentBlockquote) {
          blocks.push({ type: "blockquote", text: currentBlockquote.text, alertType: null });
          currentBlockquote = null;
        }
        currentBlockquote = { text: "" };
        continue;
      } else if (content.match(/^\[!CAUTION\]$/)) {
        currentAlertType = "caution";
        if (currentBlockquote) {
          blocks.push({ type: "blockquote", text: currentBlockquote.text, alertType: null });
          currentBlockquote = null;
        }
        currentBlockquote = { text: "" };
        continue;
      }
      if (!currentBlockquote) {
        currentBlockquote = { text: "" };
      }
      currentBlockquote.text += (currentBlockquote.text ? "\n" : "") + content;
      continue;
    }

    // Handle tables
    if (trimmedLine.startsWith("|")) {
      if (listStack.length) {
        processListItems(listStack[0].items);
        blocks.push(listStack[0]);
        listStack = [];
      }
      if (currentBlockquote) {
        blocks.push({ type: "blockquote", text: currentBlockquote.text, alertType: currentAlertType });
        currentBlockquote = null;
        currentAlertType = null;
      }
      if (currentParagraphLines.length) {
        blocks.push({ type: "paragraph", text: currentParagraphLines.join("\n") });
        currentParagraphLines = [];
      }
      if (!currentTable) {
        currentTable = { type: "table", rows: [] };
      }
      const cells = trimmedLine.split("|").map(cell => cell.trim()).filter(cell => cell !== "");
      currentTable.rows.push(cells);
      if (i + 1 < lines.length && lines[i + 1].trim().match(/^\|?-+\|?-+\|?$/)) {
        i++; // Skip separator line
      }
      continue;
    }

    // Handle horizontal rules
    if (trimmedLine.match(/^(?:[-*_]){3,}$/)) {
      if (listStack.length) {
        processListItems(listStack[0].items);
        blocks.push(listStack[0]);
        listStack = [];
      }
      if (currentBlockquote) {
        blocks.push({ type: "blockquote", text: currentBlockquote.text, alertType: currentAlertType });
        currentBlockquote = null;
        currentAlertType = null;
      }
      if (currentTable) {
        blocks.push(currentTable);
        currentTable = null;
      }
      if (currentParagraphLines.length) {
        blocks.push({ type: "paragraph", text: currentParagraphLines.join("\n") });
        currentParagraphLines = [];
      }
      blocks.push({ type: "hr" });
      continue;
    }

    // Handle lists
    if (trimmedLine.match(/^[-*+] /) || trimmedLine.match(/^\d+\.\s/)) {
      if (currentParagraphLines.length) {
        blocks.push({ type: "paragraph", text: currentParagraphLines.join("\n") });
        currentParagraphLines = [];
      }

      const isUnordered = trimmedLine.match(/^[-*+] /);
      const type = isUnordered ? "ul" : "ol";
      const itemText = isUnordered
        ? trimmedLine.replace(/^[-*+] /, "").trim()
        : trimmedLine.replace(/^\d+\.\s/, "").trim();

      if (!listStack.length) {
        listStack.push({ type, items: [], spaceCount: 0 });
      }

      while (listStack.length > 1 && spaceCount <= listStack[listStack.length - 2].spaceCount) {
        const completedList = listStack.pop();
        processListItems(completedList.items);
        const lastItem = listStack[listStack.length - 1].items[listStack[listStack.length - 1].items.length - 1];
        if (lastItem) lastItem.children = completedList;
      }

      let targetList = listStack[listStack.length - 1];
      if (spaceCount > targetList.spaceCount) {
        const newList = { type, items: [], spaceCount };
        const lastItem = targetList.items[targetList.items.length - 1];
        if (lastItem) {
          lastItem.children = newList;
        } else {
          targetList.items.push({ type, text: "", children: newList, spaceCount });
        }
        listStack.push(newList);
        targetList = newList;
      }

      const itemToAdd = { type, text: itemText, children: null, spaceCount };
      targetList.items.push(itemToAdd);
      continue;
    }

    // Handle empty lines
    if (trimmedLine === "") {
      if (listStack.length) {
        processListItems(listStack[0].items);
        blocks.push(listStack[0]);
        listStack = [];
      }
      if (currentParagraphLines.length) {
        blocks.push({ type: "paragraph", text: currentParagraphLines.join("\n") });
        currentParagraphLines = [];
      }
      continue;
    }

    // Handle paragraphs
    if (line) {
      if (listStack.length) {
        processListItems(listStack[0].items);
        blocks.push(listStack[0]);
        listStack = [];
      }
      currentParagraphLines.push(line);
    }
  }

  // Flush remaining blocks
  if (listStack.length) {
    processListItems(listStack[0].items);
    blocks.push(listStack[0]);
  }
  if (currentParagraphLines.length) blocks.push({ type: "paragraph", text: currentParagraphLines.join("\n") });

  return { blocks, footnotes };
};

// Recursive list renderer
const renderList = (type, items, footnotes) => {
  const listTag = type === "ul" ? ul : ol;
  return listTag({ class: "markdown-body" }, items.map(item => {
    console.log(`Rendering item: "${item.text}", isTask: ${item.isTask}, checked: ${item.checked}`);
    let content = parseInline(item.text, footnotes);
    if (item.isTask) {
      content = [input({ type: "checkbox", disabled: true, checked: item.checked }), ...content];
    }
    const liProps = { class: item.isTask ? "markdown-body task-item" : "markdown-body" };
    //const liProps = { class: "markdown-body" };
    if (item.anchorId) liProps.id = `user-content-${item.anchorId}`;
    return li(
      liProps,
      item.anchorId ? [a({ id: item.anchorId }), ...content] : content,
      item.children ? renderList(item.children.type, item.children.items, footnotes) : null
    );
  }));
};

// Preview Renderer
const PreviewBlock = ({ type, text, language, items, rows, footnotes, alertType, anchorId }) => {
  console.log(`PreviewBlock: type=${type}, text=${text}, items=`, items);
  const hljs = hljsState.val;

  if (type === "paragraph") {
    const lines = text.split("\n").flatMap(line => {
      const hasBreak = line.match(/\s{2}$/);
      const parsedLine = parseInline(line.replace(/\s{2}$/, ""), footnotes);
      return hasBreak ? [...parsedLine, br()] : parsedLine;
    });
    return p({ class: "markdown-body" }, lines);
  }
  if (type === "h1") return h1(anchorId ? { id: `user-content-${anchorId}` } : {}, anchorId ? a({ id: anchorId }) : null, ...parseInline(text, footnotes));
  if (type === "h2") return h2(anchorId ? { id: `user-content-${anchorId}` } : {}, anchorId ? a({ id: anchorId }) : null, ...parseInline(text, footnotes));
  if (type === "h3") return h3(anchorId ? { id: `user-content-${anchorId}` } : {}, anchorId ? a({ id: anchorId }) : null, ...parseInline(text, footnotes));
  if (type === "h4") return h4(anchorId ? { id: `user-content-${anchorId}` } : {}, anchorId ? a({ id: anchorId }) : null, ...parseInline(text, footnotes));
  if (type === "h5") return h5(anchorId ? { id: `user-content-${anchorId}` } : {}, anchorId ? a({ id: anchorId }) : null, ...parseInline(text, footnotes));
  if (type === "h6") return h6(anchorId ? { id: `user-content-${anchorId}` } : {}, anchorId ? a({ id: anchorId }) : null, ...parseInline(text, footnotes));
  if (type === "code") {
    if (hljs) {
      const highlighted = hljs.highlight(text, { language: language === "text" ? "plaintext" : language }).value;
      return pre({ class: "markdown-body code-block" }, code({ class: `language-${language}`, innerHTML: highlighted }));
    }
    return pre({ class: "markdown-body code-block" }, code({ class: `language-${language}` }, text));
  }
  if (type === "blockquote") {
    const lines = text.split("\n").map(line => p(...parseInline(line, footnotes)));
    return blockquote({ class: `markdown-body blockquote${alertType ? ` alert-${alertType}` : ""}` }, lines);
  }
  if (type === "table") {
    const [header, ...body] = rows;
    return table({ class: "markdown-body" },
      thead(tr(header.map(cell => th(...parseInline(cell, footnotes))))),
      tbody(body.map(row => tr(row.map(cell => td(...parseInline(cell, footnotes))))))
    );
  }
  if (type === "hr") return hr({ class: "markdown-body" });
  if (type === "ul" || type === "ol") return renderList(type, items, footnotes);
};



// Editor Component with Preview (unchanged)
const Editor = () => {
  const editorTextarea = textarea({
    value: editorState.val.text,
    style: "width: 100%; height: 100%; resize: none; padding: 10px; font-family: monospace; box-sizing: border-box;",
    oninput: (e) => {
      editorState.val = { ...editorState.val, text: e.target.value };
    }
  });

  const editorPane = div({ class: "editor-pane" }, editorTextarea);

  const previewPane = div({ class: "preview-pane" },
    h1("Preview"),
    van.derive(() => {
      const { blocks, footnotes } = parseMarkdown(editorState.val.text);
      const content = blocks.map(block => PreviewBlock({ ...block, footnotes }));
      if (Object.keys(footnotes).length > 0) {
        const footnoteList = ol({ class: "markdown-body footnotes" },
          Object.entries(footnotes).map(([id, text]) =>
            li({ id: `fn-${id}`, class: "footnote-item" },
              ...parseInline(text, footnotes),
              a({ href: `#fnref-${id}`, class: "footnote-backref" }, "↩")
            )
          )
        );
        content.push(hr({ class: "markdown-body" }), section({ class: "markdown-body" }, h2("Footnotes"), footnoteList));
      }
      return div({ class: "preview-content" }, content);
    })
  );

  return div({ class: "editor-container" }, editorPane, previewPane);
};

// Mount to DOM
van.add(document.getElementById("app"), Editor());

// Add CSS for alerts
const style = document.createElement("style");
style.textContent = `
  .markdown-body.blockquote.alert-note {
    border-left: 4px solid #0969da;
    background-color: #f6f8fa;
  }
  .markdown-body.blockquote.alert-tip {
    border-left: 4px solid #1a7f37;
    background-color: #f6faf6;
  }
  .markdown-body.blockquote.alert-important {
    border-left: 4px solid #8250df;
    background-color: #faf6fe;
  }
  .markdown-body.blockquote.alert-warning {
    border-left: 4px solid #bf8700;
    background-color: #fff8f3;
  }
  .markdown-body.blockquote.alert-caution {
    border-left: 4px solid #cf222e;
    background-color: #fff5f5;
  }
  .markdown-body.blockquote {
    padding: 0.5em 1em;
    margin: 1em 0;
  }
`;
document.head.appendChild(style);