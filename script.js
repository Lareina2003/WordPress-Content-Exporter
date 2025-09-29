// Define the WordPad-like Editor class
class Editor {
    constructor() {
        this.editor = document.getElementById('editor');
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
        this.exportDocBtn = document.getElementById('exportDocBtn');
        this.exportPdfBtn = document.getElementById('exportPdfBtn');
    }

    // Method to apply a command to the editor
    applyCommand(command, value = null) {
        document.execCommand(command, false, value);
    }

    // Method to toggle button style
    toggleButtonActive(button) {
        button.classList.toggle('selected');
    }

    // Method to insert an image
    insertImage() {
        const url = prompt("Enter image URL:");
        if (url) {
            const img = `<img src="${url}" alt="Image" style="max-width: 100%;">`;
            this.editor.innerHTML += img;
        }
    }

    // Method to insert a table
    insertTable() {
        const rows = prompt("Enter number of rows:");
        const cols = prompt("Enter number of columns:");
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

    // Method to insert a link
    insertLink() {
        const url = prompt("Enter URL:");
        if (url) {
            document.execCommand('createLink', false, url);
        }
    }

    // Initialize event listeners
    init() {
        this.boldBtn.addEventListener('click', () => {
            this.applyCommand('bold');
            this.toggleButtonActive(this.boldBtn);
        });
        this.italicBtn.addEventListener('click', () => {
            this.applyCommand('italic');
            this.toggleButtonActive(this.italicBtn);
        });
        this.underlineBtn.addEventListener('click', () => {
            this.applyCommand('underline');
            this.toggleButtonActive(this.underlineBtn);
        });
        this.h1Btn.addEventListener('click', () => this.applyCommand('formatBlock', '<h1>'));
        this.h2Btn.addEventListener('click', () => this.applyCommand('formatBlock', '<h2>'));
        this.fontSizeSelect.addEventListener('change', (e) => this.applyCommand('fontSize', e.target.value));
        this.fontStyleSelect.addEventListener('change', (e) => this.applyCommand('fontName', e.target.value));
        this.leftAlignBtn.addEventListener('click', () => this.applyCommand('justifyLeft'));
        this.centerAlignBtn.addEventListener('click', () => this.applyCommand('justifyCenter'));
        this.rightAlignBtn.addEventListener('click', () => this.applyCommand('justifyRight'));
        this.justifyAlignBtn.addEventListener('click', () => this.applyCommand('justifyFull'));
        this.textColorInput.addEventListener('input', (e) => this.applyCommand('foreColor', e.target.value));
        this.highlightColorInput.addEventListener('input', (e) => this.applyCommand('hiliteColor', e.target.value));
        this.orderedListBtn.addEventListener('click', () => this.applyCommand('insertOrderedList'));
        this.unorderedListBtn.addEventListener('click', () => this.applyCommand('insertUnorderedList'));
        this.insertLinkBtn.addEventListener('click', () => this.insertLink());
        this.insertImageBtn.addEventListener('click', () => this.insertImage());
        this.insertTableBtn.addEventListener('click', () => this.insertTable());
        this.clearFormattingBtn.addEventListener('click', () => this.applyCommand('removeFormat'));
        this.resetBtn.addEventListener('click', () => this.editor.innerHTML = "<p>Start typing here...</p>");
        this.copyTextBtn.addEventListener('click', () => this.copyText());
        this.previewBtn.addEventListener('click', () => this.previewText());
    }

    // Method to copy text
    copyText() {
        const range = document.createRange();
        range.selectNodeContents(this.editor);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('copy');
    }

    // Method to preview the editor text
    previewText() {
        const previewWindow = window.open('', 'Preview', 'width=600,height=400');
        previewWindow.document.write('<html><body>' + this.editor.innerHTML + '</body></html>');
        previewWindow.document.close();
    }
}

// Export functionality
class Exporter {
    constructor(editor) {
        this.editor = editor;
    }

    exportDoc() {
        const doc = new Blob([this.editor.editor.innerHTML], { type: 'application/msword' });
        const url = URL.createObjectURL(doc);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'document.doc';
        link.click();
    }

    exportPdf() {
        const { jsPDF } = window.jspdf;  // Ensure jsPDF is loaded correctly
        const doc = new jsPDF();

        // Get the editor content
        const editorContent = this.editor.editor;

        console.log(editorContent);  // Debug the editor content

        doc.html(editorContent, {
            callback: function (doc) {
                doc.save('document.pdf');
            },
            x: 10,
            y: 10,
            width: 180,
            windowWidth: window.innerWidth
        });
    }
}

// Initialize everything
const editor = new Editor();
const exporter = new Exporter(editor);

editor.init();

// Export buttons
document.getElementById('exportDocBtn').addEventListener('click', () => exporter.exportDoc());
document.getElementById('exportPdfBtn').addEventListener('click', () => exporter.exportPdf());
