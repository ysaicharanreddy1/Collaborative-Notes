const socket = io();

// Register the cursors module before initializing Quill
Quill.register('modules/cursors', QuillCursors);

// Define Quill Toolbar Options
const toolbarOptions = [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': [] }],
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['link', 'image', 'blockquote', 'code-block'],
    ['clean']                                         // remove formatting button
];

// Initialize Quill Editor
const quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
        toolbar: toolbarOptions,
        cursors: {
            transformOnTextChange: true,
            hideDelayMs: 5000,
            hideSpeedMs: 300,
            selectionChangeSource: null,
        }
    },
    placeholder: 'Start collaborating... type your notes here.'
});

const cursors = quill.getModule('cursors');
let isUpdatingFromServer = false;

// Generate random user data for cursors
const names = ["Anonymous Tiger", "Anonymous Elephant", "Anonymous Giraffe", "Anonymous Dolphin", "Anonymous Owl", "Anonymous Fox", "Anonymous Bear", "Anonymous Penguin"];
const colors = ["#e60000", "#ff9900", "#008a00", "#0066cc", "#9933ff", "#ff3399", "#ff0066"];

const myName = names[Math.floor(Math.random() * names.length)];
const myColor = colors[Math.floor(Math.random() * colors.length)];
let myId = "";

// Get socket ID on connect
socket.on('connect', () => {
    myId = socket.id;
});

// Socket: Update the online user count
socket.on("user-count", (count) => {
    const display = document.getElementById("user-count-display");
    if (count === 1) {
        display.textContent = "Only You Online";
    } else {
        display.textContent = `${count} Users Online`;
    }
});

// Socket: Receive the initial document state when connecting
socket.on("load-document", (documentData) => {
    if (documentData) {
        isUpdatingFromServer = true;
        quill.setContents(documentData);
        isUpdatingFromServer = false;
    }
});

// Socket: Receive deltas (changes) from other users
socket.on("receive-changes", (delta) => {
    isUpdatingFromServer = true;
    quill.updateContents(delta);
    isUpdatingFromServer = false;
});

// Quill: Listen for local changes and send to server
quill.on('text-change', (delta, oldDelta, source) => {
    if (source === 'user' && !isUpdatingFromServer) {
        socket.emit("send-changes", delta);
        socket.emit("save-document", quill.getContents());
    }
});

// Quill: Listen for cursor movements
quill.on('selection-change', function(range, oldRange, source) {
    if (source === 'user' && myId) {
        socket.emit('cursor-move', {
            id: myId,
            name: myName,
            color: myColor,
            range: range
        });
    }
});

// Socket: Receive cursor movements from other users
socket.on('receive-cursor', (data) => {
    if (data.id === myId) return;
    
    if (data.range) {
        // If cursor doesn't exist yet, create it
        cursors.createCursor(data.id, data.name, data.color);
        // Move the cursor to the new range
        cursors.moveCursor(data.id, data.range);
    } else {
        // Range is null, remove the cursor (user disconnected)
        cursors.removeCursor(data.id);
    }
});