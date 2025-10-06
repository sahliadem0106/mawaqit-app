# 🚀 Deploy Your Mawaqit App for FREE

## ✅ What's Been Fixed:

1. ✅ **Auto-Refresh**: Prayer times update daily from Mawaqit API
2. ✅ **Countdown Timer**: Red/white flashing banner showing time to next Iqama
3. ✅ **Card Overflow Fixed**: Removed `scale-105` that caused overflow
4. ✅ **Real-time Clock**: Updates every second

---

## 🌐 Option 1: Deploy to Vercel (RECOMMENDED)

### Step 1: Prepare Your Code
```bash
# Make sure your project is a Git repository
git init
git add .
git commit -m "Initial commit - Mawaqit Prayer Times App"
```

### Step 2: Create GitHub Repository
1. Go to [GitHub](https://github.com/new)
2. Create new repository: `mawaqit-prayer-times`
3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/mawaqit-prayer-times.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel
1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your `mawaqit-prayer-times` repository
5. Vercel will auto-detect React app
6. Click "Deploy"
7. **DONE!** You'll get a URL like: `mawaqit-prayer-times.vercel.app`

### Step 4: Deploy the Proxy Server
The proxy server needs to run separately. Two options:

**Option A: Deploy to Render (Free)**
1. Go to [Render.com](https://render.com)
2. Sign up and create "New Web Service"
3. Connect your GitHub repo
4. Settings:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment**: Node
5. Deploy!

**Option B: Use Vercel Serverless Functions**
Create `api/mosque.js`:
```javascript
export default async function handler(req, res) {
  const { lat, lon, distance } = req.query;
  const response = await fetch(
    `https://mawaqit.net/api/2.0/mosque/search?lat=${lat}&lon=${lon}&distance=${distance}`
  );
  const data = await response.json();
  res.json(data);
}
```

Then update your app to use `/api/mosque` instead of `http://localhost:5000`

---

## 🎯 Option 2: Deploy to Netlify

### Steps:
1. Go to [Netlify](https://netlify.com)
2. Sign up with GitHub
3. Click "Add new site" → "Import existing project"
4. Select your GitHub repository
5. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
6. Click "Deploy"
7. Done! URL: `your-site.netlify.app`

---

## 📱 Option 3: GitHub Pages

### Steps:
1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to `package.json`:
```json
{
  "homepage": "https://YOUR_USERNAME.github.io/mawaqit-prayer-times",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

3. Deploy:
```bash
npm run deploy
```

4. Enable GitHub Pages in repo settings

---

## 🔗 Add to LinkedIn

After deployment, add to your LinkedIn profile:

### In Projects Section:
1. Click "Add profile section" → "Accomplishments" → "Projects"
2. Fill in:
   - **Project Name**: Mawaqit Prayer Times Finder
   - **Project URL**: `https://your-deployed-url.vercel.app`
   - **Description**: 
   ```
   Full-stack web application helping Muslims find nearby mosques and prayer times.
   
   🎯 Features:
   • Real-time prayer times from Mawaqit API
   • Geolocation-based mosque search
   • Interactive Google Maps integration
   • Live countdown to next prayer
   • Bilingual (English/Arabic) with RTL support
   • Fully responsive design
   
   🛠️ Tech Stack:
   • React.js
   • Node.js/Express (Proxy Server)
   • Google Maps API
   • Mawaqit API
   • Tailwind CSS
   • Geolocation API
   ```
   - **Associated with**: Your education or leave blank
   - **Currently working on this**: Yes (if maintaining)

### Or as Featured Section:
1. Click "Add featured" → "Link"
2. Add your deployed URL
3. Use a screenshot as thumbnail

---

## 🎨 Custom Domain (Optional)

### For Vercel:
1. Buy domain from Namecheap/GoDaddy (~$10/year)
2. In Vercel: Settings → Domains → Add `yourdomain.com`
3. Update DNS records as instructed

### For Netlify:
1. Similar process in Domain Settings

---

## 📊 Analytics (Optional)

Add Google Analytics to track visitors:

1. Get tracking ID from [Google Analytics](https://analytics.google.com)
2. Add to `public/index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## 🔧 Environment Variables

If using Vercel serverless functions, no need for separate proxy server!

Just update `PROXY_API_BASE` in your app:
```javascript
const PROXY_API_BASE = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api';
```

---

## 🎉 Summary

**Easiest Path**:
1. Push code to GitHub
2. Deploy frontend to **Vercel** (1-click)
3. Convert proxy to Vercel serverless function OR deploy to Render
4. Update API endpoint in code
5. Add to LinkedIn with your live URL!

**Your app will be live at**: `https://mawaqit-prayer-times-XXXX.vercel.app`

---

## 💡 Pro Tips

- ✅ Use a custom domain for professional look
- ✅ Add "View Project" button in LinkedIn
- ✅ Share on social media
- ✅ Add to your portfolio website
- ✅ Consider making it open source on GitHub
- ✅ Add screenshots to LinkedIn post

---

**Need help?** The Vercel/Netlify deployment is literally 2 minutes. Just connect GitHub and click deploy! 🚀