class Editor {
    constructor() {
        this.editor = document.getElementById('editor');
    }

    // Method to apply a command to the editor
    applyCommand(command, value = null) {
        if (value) {
            document.execCommand(command, false, value); // For commands like fontSize, fontName, color
        } else {
            document.execCommand(command, false, null); // For commands like bold, italic, etc.
        }
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
