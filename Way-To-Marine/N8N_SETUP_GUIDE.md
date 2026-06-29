# 🐟 Fish Prediction n8n Workflow - Complete Setup Guide

## 📋 **What This Workflow Does**

✅ **Reads data from 2 Google Sheets** (species data + environmental data)  
✅ **Combines the data** intelligently  
✅ **Runs fish prediction** using JavaScript (no external API needed)  
✅ **Writes predictions back** to Google Sheets  
✅ **Handles errors** gracefully with fallback data  

## 🚀 **Quick Setup (5 Minutes)**

### **Step 1: Import the Workflow**

1. **Open n8n** in your browser
2. **Click** "Import from File" or "Import"
3. **Copy and paste** the content from `fish_prediction_workflow.json`
4. **Click** "Import"

### **Step 2: Set Up Your Google Sheet**

Create a Google Sheet with **3 sheets**:

#### **Sheet 1: "SpeciesData"**
```
Species_id | Scientific_name | Common_name | family | genus | order | phylum | traits[0] | trait[1] | abundance | survey_date
SP001 | Thunnus albacares | Yellowfin Tuna | Scombridae | Thunnus | Perciformes | Chordata | pelagic | carnivore | 505 | 2025-09-19
```

#### **Sheet 2: "EnvironmentalData"**
```
timestamp | latitude | longitude | sea_surface_temperature | salinity | chlorophyll | oxygen_level
2025-09-17T19:12:44.175Z | -66.9899 | 61.5485 | 23.55 | 30.95 | 0.87 | 4.2
2025-09-18T19:12:44.175Z | -66.8899 | 61.6485 | 24.15 | 31.15 | 0.92 | 4.3
```

#### **Sheet 3: "Predictions"** (Empty - will be filled by the workflow)
```
species_id | species_name | scientific_name | family | forecast_date | predicted_count | period | confidence_lower | confidence_upper | model_type | training_samples | prediction_timestamp
```

### **Step 3: Configure Google Sheets Credentials**

1. **In n8n**: Settings → Credentials → Add Credential
2. **Choose**: "Google Sheets OAuth2 API"
3. **Follow the OAuth setup** to connect your Google account
4. **Note the credential ID** (you'll need it next)

### **Step 4: Update the Workflow**

In each Google Sheets node, replace:

- **`YOUR_GOOGLE_SHEET_ID`** → Your Google Sheet ID (from the URL)
- **`YOUR_GOOGLE_SHEETS_CREDENTIAL_ID`** → Your credential ID from step 3

**To find your Google Sheet ID:**
```
https://docs.google.com/spreadsheets/d/1ABC123XYZ789/edit#gid=0
                                    ^^^^^^^^^^^^
                                 This is your Sheet ID
```

### **Step 5: Test the Workflow**

1. **Click** the "Manual Trigger" node
2. **Click** "Execute Node" 
3. **Check the results** in your "Predictions" sheet

## 🔧 **Advanced Configuration**

### **Prediction Settings**

In the "Fish Prediction Logic" node, you can adjust:

```javascript
// Number of forecast periods (months)
const forecastPeriods = inputData.forecast_periods || 12;

// Confidence interval percentage  
confidence_lower: Math.max(5, predictedCount - Math.round(predictedCount * 0.15))
```

### **Data Validation**

The workflow automatically:

- ✅ **Detects which input is species vs environmental** data
- ✅ **Provides fallback values** if data is missing
- ✅ **Generates sample data** if no Google Sheets are connected
- ✅ **Handles errors** and logs them

### **Scheduling**

Replace the "Manual Trigger" with a "Schedule Trigger" for automation:

```json
{
  "parameters": {
    "rule": {
      "interval": [{"field": "hours", "triggerAtHour": 9}]
    }
  },
  "name": "Daily at 9 AM",
  "type": "n8n-nodes-base.scheduleTrigger"
}
```

## 📊 **Expected Output**

The workflow will create predictions in your Google Sheet like:

| species_id | species_name | forecast_date | predicted_count | confidence_lower | confidence_upper |
|------------|--------------|---------------|-----------------|------------------|------------------|
| SP001 | Yellowfin Tuna | 2025-10-19 | 515 | 437 | 592 |
| SP001 | Yellowfin Tuna | 2025-11-19 | 523 | 444 | 601 |
| SP001 | Yellowfin Tuna | 2025-12-19 | 531 | 451 | 610 |

## 🐛 **Troubleshooting**

### **"Node execution failed"**
- Check your Google Sheets credentials
- Verify sheet names match exactly ("SpeciesData", "EnvironmentalData", "Predictions")
- Ensure your Google Sheet is accessible

### **"Empty predictions"**
- Check the n8n execution log for console.log messages
- Verify your Google Sheets have data
- The workflow will create sample data if sheets are empty

### **"Wrong data format"**
- Column names must match exactly (case-sensitive)
- Check the sample sheet structures above

## 🎯 **Key Features**

✅ **No external API needed** - Everything runs in n8n  
✅ **Smart data detection** - Automatically identifies species vs environmental data  
✅ **Error resilient** - Works even with missing data  
✅ **Confidence intervals** - Provides uncertainty estimates  
✅ **Real species data** - Uses your actual Google Sheets data  
✅ **Easy scheduling** - Can run automatically daily/weekly  

## 📈 **Next Steps**

1. **Test with your real data** - Add your species and environmental data
2. **Customize predictions** - Adjust forecast periods and confidence intervals  
3. **Add scheduling** - Set up automatic daily/weekly predictions
4. **Add notifications** - Email alerts when predictions complete
5. **Integrate with your app** - Use Google Sheets API to display predictions in your React app

This workflow completely eliminates the need for an external API server and gives you a working fish prediction system directly in n8n! 🚀