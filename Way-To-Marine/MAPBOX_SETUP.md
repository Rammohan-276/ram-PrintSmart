# Mapbox Token Setup Guide

## Why Do You Need a Mapbox Token?

The **Mapbox + deck.gl** and **Advanced deck.gl** map engines use Mapbox for high-quality satellite and street map base layers. Without a token, you'll see a fallback coordinate system instead of the actual world map.

## 🚀 Quick Setup (Free)

### 1. Create a Free Mapbox Account
- Visit [https://mapbox.com](https://mapbox.com)
- Click "Sign up" and create a free account
- **Free tier includes**: 50,000 map loads per month (more than enough for development)

### 2. Get Your Access Token
- After signing in, go to your [Account page](https://account.mapbox.com/)
- Copy your **Default public token** (starts with `pk.`)

### 3. Set Up Environment File
1. **Copy the template**: 
   ```bash
   cp .env.sample .env
   ```

2. **Edit the `.env` file** and replace:
   ```bash
   REACT_APP_MAPBOX_TOKEN=pk.your-mapbox-token-here
   ```
   
   With your actual token:
   ```bash
   REACT_APP_MAPBOX_TOKEN=pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImNsb...
   ```

### 4. Restart Your Development Server
```bash
npm start
```

## ✓ Verification

After setup, your maps should show:
- **Mapbox + deck.gl**: Dark satellite/street map with marine data layers
- **Advanced deck.gl**: Scientific dark map with enhanced coordinate grid
- **Leaflet + OpenStreetMap**: Will continue working (doesn't need Mapbox token)

## 🌍 What You Get Without Mapbox Token

**Don't have a Mapbox token yet? No problem!**

All map engines now include **OpenStreetMap fallback** with full functionality:

- **Mapbox + deck.gl**: OpenStreetMap base + all deck.gl marine data layers
- **Advanced deck.gl**: OpenStreetMap + scientific grid overlay + advanced analytics
- **Leaflet + OpenStreetMap**: Native OpenStreetMap integration (no changes)

### ✅ **All Marine Data Layers Work**:
- Fish sightings and biodiversity data 🐠
- Migration patterns and arcs 🐟
- Water quality measurements 💧
- Research vessel tracking 🚢
- Pollution source monitoring ⚠️

## 🔒 Security Notes

- **Public tokens** are safe to use in client-side applications
- **Never commit** your `.env` file to version control (it's already in `.gitignore`)
- **Restrict domains** in your Mapbox account settings for production use

## 📊 Usage Limits

**Free Tier (50,000 loads/month)**:
- Perfect for development and small projects
- Each map view counts as 1 load
- Resets monthly

**If you exceed limits**:
- Maps will show fallback coordinate system
- No interruption to deck.gl data visualization layers
- Consider upgrading to paid tier for high-traffic applications

## 🛠️ Troubleshooting

### Token Not Working?
1. **Check format**: Must start with `pk.`
2. **Restart server**: Changes to `.env` require restart
3. **Check console**: Look for Mapbox-related errors

### Still See Fallback Maps?
- Clear browser cache
- Verify token is active in your Mapbox account
- Check network connectivity

## 🌍 Alternative: OpenStreetMap

If you prefer not to use Mapbox:
- Use the **"Leaflet + OpenStreetMap"** engine
- No token required
- Open source base maps
- Still supports all marine data visualizations

---

*The marine data visualization layers work perfectly with or without Mapbox - the token just enhances the base map quality!*