# Real-Time Collaborative Notes App

A full-stack, real-time collaborative rich-text editor inspired by Google Docs. This application allows multiple users to edit the same document simultaneously, seeing each other's cursors and changes in real-time without any conflicts.

## Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **WebSockets**: Socket.io
- **Editor Engine**: Quill.js
- **Cursor Syncing**: Quill-Cursors

## File Structure
```text
Collaborative Notes/
│
├── public/                  # Frontend client files
│   ├── index.html           # Main UI layout and CDN imports
│   ├── style.css            # Premium styling and Google Docs-like aesthetics
│   └── script.js            # Quill initialization and Socket.io client logic
│
├── server.js                # Node.js backend server and Socket.io event handlers
├── package.json             # Project metadata and npm dependencies
└── README.md                # Project documentation
```

---

This project was developed as part of:

**CODTECH Internship Task-3 — REAL-TIME COLLABORATION TOOL**

---

## How to Run Your Collaborative Notes App

## Step 1: Open the Project

1. Open **Visual Studio Code**.
2. Click on **File** > **Open Folder** in the top left corner.
3. Select your `Collaborative Notes` folder (located on your Desktop).

## Step 2: Start the Server

1. In VS Code, look at the top menu bar and click **Terminal** > **New Terminal**.
2. In that bottom window, type exactly this:
   `node server.js`
3. You should see a message pop up that says: `Server running on http://localhost:3000`. 

## Step 3: Open the App for Yourself

1. `http://localhost:3000`
---

## Step 4: Invite a Friend
To let a friend in a different house connect to your laptop, we need to create a temporary "tunnel" over the internet.

1. Go back to VS Code. 
2. Open a **second terminal** 
3. In this new window, type exactly this:
   `npx -y localtunnel --port 3000`
4. After a few seconds, it will give you a link that looks something like: `your url is: https://some-random-words.loca.lt`

## Step 5: What Your Friend Needs to Do
1. Copy that `https://...loca.lt` link and text/WhatsApp it to your friend.
2. Your friend simply clicks the link on their laptop or phone.
3. They might see a "Friendly Warning" page asking if they want to proceed. Tell them to click the **"Click to Continue"** button.
4. **That's it!** They are now in the exact same document / screen as you.
