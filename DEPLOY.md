# 🚀 InterviewAI — Deploy to Render.com (FREE, 5 minutes)

## What you need
- A GitHub account (free) → https://github.com
- A Render account (free) → https://render.com

---

## STEP 1 — Upload to GitHub

1. Go to https://github.com/new
2. Create a new repository called `interviewai`
3. Set it to **Public**, click **Create repository**
4. Upload these files to the repo:
   - `server.js`
   - `package.json`
   - `.gitignore`
   - `public/index.html`

   (Click "uploading an existing file" on the GitHub page)

---

## STEP 2 — Deploy on Render.com

1. Go to https://render.com and sign up (free)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account
4. Select your `interviewai` repository
5. Fill in these settings:
   - **Name:** interviewai
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** Free

6. Click **"Add Environment Variable"**:
   - Key: `GROQ_API_KEY`
   - Value: `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`

7. Click **"Create Web Service"**

---

## STEP 3 — Go Live!

Render will build and deploy in 2-3 minutes.
Your website will be live at:
**https://interviewai.onrender.com** (or similar URL)

Share that link with anyone — it works on all devices! 🌍

---

## Team Members
- Mohammed Nawaaf Uddin — 160323733306
- Mohammed Ajmal Shareef — 160323733309
- Mohammed Shaik Fazal — 160323733310
