class Editor {
    constructor() {
        this.editor = document.getElementById('editor');
        this.storageKey = 'wordpad-autosave-content';
        this.loadAutosave();
        this.startAutosave(5000);

    }

    
    applyCommand(command, value = null) {
        if (value) {
            document.execCommand(command, false, value); // For commands like fontSize, fontName, color
        } else {
            document.execCommand(command, false, null); // For commands like bold, italic, etc.
        }
    }
    autosave() {
        const content = this.editor.innerHTML;
        localStorage.setItem(this.storageKey, content);
        console.log('Autosaved at ' + new Date().toLocaleTimeString());
    }

    // Load saved content if exists
    loadAutosave() {
        const savedContent = localStorage.getItem(this.storageKey);
        if (savedContent) {
            this.editor.innerHTML = savedContent;
            console.log('Loaded autosaved content');
        }
    }

    // Start periodic autosave every interval milliseconds
    startAutosave(interval = 5000) {
        this.autosaveInterval = setInterval(() => {
            this.autosave();
        }, interval);
    }

    // Optionally stop autosave
    stopAutosave() {
        clearInterval(this.autosaveInterval);
    }

    // Method to insert an image into the editor
    insertImage(url) {
        if (url) {
            const img = `<img src="${url}" alt="Image" style="max-width: 100%;">`;
            this.editor.innerHTML += img;
        }
    }

    // Method to insert a table into the editor
    insertTable(rows, cols) {
        let tableHTML = "<table border='1' style='width:100%; border-collapse: collapse;'>";
        for (let i = 0; i < rows; i++) {
            tableHTML += "<tr>";
            for (let j = 0; j < cols; j++) {
                tableHTML += "<td style='padding: 10px; text-align: center;'></td>";
            }
            tableHTML += "</tr>";
        }
        tableHTML += "</table>";
        this.editor.innerHTML += tableHTML;
    }

    // Method to reset the editor
    resetEditor() {
        this.editor.innerHTML = "<p>Start typing here...</p>"; // Reset editor content to placeholder
    }

    // Method to get the current content (for Copy and Preview)
    getContent() {
        return this.editor.innerHTML; // Return the HTML content inside the editor
    }
}

class Toolbar {
    constructor(editor) {
        this.editor = editor;
        this.boldBtn = document.getElementById('boldBtn');
        this.italicBtn = document.getElementById('italicBtn');
        this.underlineBtn = document.getElementById('underlineBtn');
        this.h1Btn = document.getElementById('h1Btn');
        this.h2Btn = document.getElementById('h2Btn');
        this.fontSizeSelect = document.getElementById('fontSize');
        this.fontStyleSelect = document.getElementById('fontStyle');
        this.leftAlignBtn = document.getElementById('leftAlignBtn');
        this.centerAlignBtn = document.getElementById('centerAlignBtn');
        this.rightAlignBtn = document.getElementById('rightAlignBtn');
        this.justifyAlignBtn = document.getElementById('justifyAlignBtn');
        this.textColorInput = document.getElementById('textColor');
        this.highlightColorInput = document.getElementById('highlightColor');
        this.orderedListBtn = document.getElementById('orderedListBtn');
        this.unorderedListBtn = document.getElementById('unorderedListBtn');
        this.insertLinkBtn = document.getElementById('insertLinkBtn');
        this.insertImageBtn = document.getElementById('insertImageBtn');
        this.insertTableBtn = document.getElementById('insertTableBtn');
        this.clearFormattingBtn = document.getElementById('clearFormattingBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.copyTextBtn = document.getElementById('copyTextBtn');
        this.previewBtn = document.getElementById('previewBtn');

        this.formatPainterBtn = document.getElementById('formatPainterBtn');
        this.isFormatPainterActive = false;
        this.copiedFormatHTML = null;
        this.editor.editor.addEventListener('mouseup', () => this.handleEditorClick());

        this.darkModeToggle = document.getElementById('darkModeToggle');

    }

    init() {
        this.boldBtn.addEventListener('click', () => this.editor.applyCommand('bold'));
        this.italicBtn.addEventListener('click', () => this.editor.applyCommand('italic'));
        this.underlineBtn.addEventListener('click', () => this.editor.applyCommand('underline'));
        this.h1Btn.addEventListener('click', () => this.editor.applyCommand('formatBlock', '<h1>'));
        this.h2Btn.addEventListener('click', () => this.editor.applyCommand('formatBlock', '<h2>'));
        this.fontSizeSelect.addEventListener('change', (e) => this.editor.applyCommand('fontSize', e.target.value));
        this.fontStyleSelect.addEventListener('change', (e) => this.editor.applyCommand('fontName', e.target.value));
        this.leftAlignBtn.addEventListener('click', () => this.editor.applyCommand('justifyLeft'));
        this.centerAlignBtn.addEventListener('click', () => this.editor.applyCommand('justifyCenter'));
        this.rightAlignBtn.addEventListener('click', () => this.editor.applyCommand('justifyRight'));
        this.justifyAlignBtn.addEventListener('click', () => this.editor.applyCommand('justifyFull'));
        this.textColorInput.addEventListener('input', (e) => this.editor.applyCommand('foreColor', e.target.value));
        this.highlightColorInput.addEventListener('input', (e) => this.editor.applyCommand('hiliteColor', e.target.value));
        this.orderedListBtn.addEventListener('click', () => this.editor.applyCommand('insertOrderedList'));
        this.unorderedListBtn.addEventListener('click', () => this.editor.applyCommand('insertUnorderedList'));
        this.insertLinkBtn.addEventListener('click', () => this.insertLink());
        this.insertImageBtn.addEventListener('click', () => this.insertImage());
        this.insertTableBtn.addEventListener('click', () => this.insertTable());
        this.clearFormattingBtn.addEventListener('click', () => this.editor.applyCommand('removeFormat'));
        this.resetBtn.addEventListener('click', () => this.editor.resetEditor());
        this.copyTextBtn.addEventListener('click', () => this.copyText());
        this.previewBtn.addEventListener('click', () => this.previewText());

        this.formatPainterBtn.addEventListener('click', () => this.toggleFormatPainter());
        document.getElementById('editor').addEventListener('mouseup', (e) => this.applyFormatPainter(e));

        this.darkModeToggle.addEventListener('click', () => this.toggleDarkMode());

    // Check saved preference on load
    if (localStorage.getItem('darkMode') === 'enabled') {
      document.body.classList.add('dark-mode');
    }
    }

     toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');

    // Optional: change icon
    this.darkModeToggle.innerHTML = isDark
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';
  }

    toggleFormatPainter() {
    if (this.isFormatPainterActive) {
        this.isFormatPainterActive = false;
        this.copiedStyles = null;
        this.formatPainterBtn.classList.remove('active');
        this.showStatus('Format painter deactivated.');
    } else {
        const selection = window.getSelection();
        if (selection.rangeCount > 0 && !selection.isCollapsed) {
            const computedStyle = this.getComputedStyleFromSelection();

            if (!computedStyle) {
                this.showStatus('Please select some formatted text first.');
                return;
            }

            // Save only some relevant styles
            this.copiedStyles = {
                fontWeight: computedStyle.fontWeight,
                fontStyle: computedStyle.fontStyle,
                textDecoration: computedStyle.textDecorationLine,
                fontSize: computedStyle.fontSize,
                fontFamily: computedStyle.fontFamily,
                color: computedStyle.color,
                backgroundColor: computedStyle.backgroundColor,
                textAlign: computedStyle.textAlign,
            };

            this.isFormatPainterActive = true;
            this.formatPainterBtn.classList.add('active');
            this.showStatus('Format copied. Select text to apply it.');
        } else {
            this.showStatus('Please select some formatted text first.');
        }
    }
}
getComputedStyleFromSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return null;
    
    let node = selection.focusNode;
    if (node.nodeType === Node.TEXT_NODE) {
        node = node.parentNode; // get the element node of the text
    }
    return window.getComputedStyle(node);
}
handleEditorClick() {
    if (this.isFormatPainterActive && this.copiedStyles) {
        const selection = window.getSelection();
        if (selection.rangeCount === 0 || selection.isCollapsed) {
            this.showStatus('Please select text to apply formatting.');
            return;
        }

        const range = selection.getRangeAt(0);

        // Wrap selected text with a span applying the saved styles
        const span = document.createElement('span');

        // Apply copied styles as inline CSS
        for (const [prop, value] of Object.entries(this.copiedStyles)) {
            if (value && value !== 'initial' && value !== 'none') {
                span.style[prop] = value;
            }
        }

        // Wrap the selected content inside the span
        try {
            range.surroundContents(span);
        } catch (e) {
            // If the range partially selects nodes, fallback:
            document.execCommand('styleWithCSS', false, true);
            document.execCommand('foreColor', false, this.copiedStyles.color);
            document.execCommand('fontName', false, this.copiedStyles.fontFamily);
            // Add more commands as needed or just wrap in span for complex cases
        }

        // Clear format painter mode after applying
        this.isFormatPainterActive = false;
        this.copiedStyles = null;
        this.formatPainterBtn.classList.remove('active');
        this.showStatus('Formatting applied.');
    }
}



    applyFormatPainter(event) {
        if (!this.isFormatPainterActive || !this.copiedFormatHTML) return;

        const selection = window.getSelection();
        if (selection.rangeCount === 0 || selection.isCollapsed) return;

        const range = selection.getRangeAt(0);

        // Get the text content of selection
        const selectedText = range.toString();

        if (selectedText.length === 0) {
            alert('Please select text to apply formatting.');
            return;
        }

        // Create a temporary container with copied formatting but empty content
        const container = document.createElement('div');
        container.innerHTML = this.copiedFormatHTML;

        // Strip all text from copied formatting, leaving only the tags/styles
        // We'll insert the selected text inside the deepest node that holds the formatting
        // For simplicity, if multiple nodes, just wrap in a span with copied styles

        // Extract styles from copiedFormatHTML
        // Simple approach: wrap selected text in a span with the styles of first child

        let style = '';

        if (container.firstChild) {
            if (container.firstChild.nodeType === Node.ELEMENT_NODE) {
                style = container.firstChild.getAttribute('style') || '';
                // Copy class if needed, etc.
            }
        }

        // Create span with copied styles and selected text
        const span = document.createElement('span');
        if (style) span.setAttribute('style', style);
        span.textContent = selectedText;

        // Replace current selection with span
        range.deleteContents();
        range.insertNode(span);

        // Clear format painter state
        this.isFormatPainterActive = false;
        this.copiedFormatHTML = null;
        this.formatPainterBtn.classList.remove('active');

        // Clear selection
        selection.removeAllRanges();

        event.preventDefault();
    }


    // Method to insert a link into the editor
    insertLink() {
        const url = prompt("Enter the link URL:");
        if (url) {
            this.editor.applyCommand('createLink', url);
        }
    }

    // Method to insert an image into the editor
    insertImage() {
        const url = prompt("Enter the image URL:");
        if (url) {
            this.editor.insertImage(url);
        }
    }

    // Method to insert a table into the editor
    insertTable() {
        const rows = prompt("Enter number of rows:");
        const cols = prompt("Enter number of columns:");
        this.editor.insertTable(rows, cols);
    }

    // Method to copy the content of the editor
    copyText() {
        const range = document.createRange();
        range.selectNodeContents(this.editor.editor);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('copy');
        alert("Text copied to clipboard!");
    }

    // Method to preview the editor content in a new window
    previewText() {
        const previewWindow = window.open('', 'Preview', 'width=600,height=400');
        previewWindow.document.write('<html><body>' + this.editor.getContent() + '</body></html>');
        previewWindow.document.close();
    }
}

class Exporter {
    constructor(editor) {
        this.editor = editor;
    }

    // Export the content as DOC
    exportDoc() {
        const doc = new Blob([this.editor.getContent()], { type: 'application/msword' });
        const url = URL.createObjectURL(doc);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'document.doc';
        link.click();
    }

    // Export the content as PDF
    exportPdf() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const contentText = this.editor.editor.innerText;

        const lines = contentText.split("\n");
        let y = 10;
        lines.forEach(line => {
            doc.text(line, 10, y);
            y += 10;
        });
        const images = this.editor.editor.querySelectorAll('img');
        images.forEach((image, index) => {
            const imgSrc = image.src;
            if (imgSrc) {
                doc.addImage(imgSrc, 'JPEG', 10, y, 50, 50); // Adjust x, y, width, height as per requirement
                y += 60;
            }
        });
        doc.save("document.pdf");
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    const editor = new Editor();
    const toolbar = new Toolbar(editor);
    const exporter = new Exporter(editor);

    toolbar.init();

    // Event listeners for export buttons
    document.getElementById('exportDocBtn').addEventListener('click', () => exporter.exportDoc());
    document.getElementById('exportPdfBtn').addEventListener('click', () => exporter.exportPdf());
});