# 🍅 Pomodoro Flow  

A modern, customizable **Pomodoro Timer Web App** built with **React + TailwindCSS**, featuring:  
- Focus / Short Break / Long Break cycles  
- Customizable durations & settings  
- Session history and stats  
- Dark/Light theme toggle  
- Ambient **lofi YouTube live streams** integration 🎵  
- Smooth animations and notifications  

---

## ✨ Features  

- ⏱ **Pomodoro cycle**: 25/5/15 minutes (default, customizable)  
- ▶️ **Controls**: Start / Pause / Reset / Skip  
- 🔄 **Cycle logic**: 4 focus sessions → long break  
- 📊 **Stats**: Daily completed Pomodoros with progress bar  
- 🌙 **Theme**: Dark / Light mode toggle  
- 🔔 **Notifications**: Pleasant chime + browser alerts  
- 🎶 **Music**: Curated live lofi YouTube streams (play, pause, skip)  

---

## 🚀 Getting Started  

### 1. Clone Repository  
```bash
git clone https://github.com/shivashrestha7/pomodoro.git
cd pomodoro
```

### 2. Install Dependencies  
```bash
npm install
```

### 3. Run Development Server  
```bash
npm start
```
App runs at `http://localhost:3000`  

---

## 📦 Build for Production  
```bash
npm run build
```
This generates a `build/` folder ready for deployment.  

---

## 🌐 Deployment (GitHub Pages)  

This repo is set up to deploy via **GitHub Pages**.  

1. Install gh-pages:  
   ```bash
   npm install gh-pages --save-dev
   ```  

2. In `package.json`:  
   ```json
   "homepage": "https://shivashrestha7.github.io/pomodoro",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```  

3. Deploy with:  
   ```bash
   npm run deploy
   ```  

---

## 🌍 Custom Domain  

This app is live at:  
👉 **https://pomodoro.shivashrestha7.com.np**  

To configure your own:  
- Add a **CNAME record** in your DNS:  
  ```
  Host: pomodoro
  Type: CNAME
  Target: shivashrestha7.github.io
  ```  
- In GitHub repo → **Settings → Pages → Custom domain**:  
  ```
  pomodoro.shivashrestha7.com.np
  ```  
- Enable **Enforce HTTPS** after DNS propagates.  

---

## 🛠️ Tech Stack  

- [React](https://react.dev/) (functional components + hooks)  
- [TailwindCSS](https://tailwindcss.com/)  
- [Lucide Icons](https://lucide.dev/)  
- [YouTube Embed API](https://developers.google.com/youtube/iframe_api_reference)  

---

## 👨‍💻 Author  

**Shiva Shrestha**  
- Portfolio: [shivashrestha7.com.np](https://shivashrestha7.com.np)  
- Pomodoro App: [pomodoro.shivashrestha7.com.np](https://pomodoro.shivashrestha7.com.np)  

---

⚡ Stay focused. Stay productive. Pomodoro Flow 🍅  
