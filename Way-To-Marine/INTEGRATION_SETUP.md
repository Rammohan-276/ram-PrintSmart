# Fish Prediction Integration Setup Guide

This guide will help you integrate your fish prediction model with n8n and Google Sheets for automated data processing and forecasting.

## Architecture Overview

```
Google Sheets (Data) → n8n (Workflow) → Python API (Prediction) → Google Sheets (Results)
```

## Prerequisites

1. **n8n installed and running**
2. **Python environment with required packages**
3. **Google Sheets with proper access**
4. **Google Cloud Platform project with Sheets API enabled**

## Part 1: Python API Setup

### 1.1 Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 1.2 Start the Fish Prediction API

```bash
python fish_prediction_api.py
```

The API will start on `http://localhost:8000`. You can view the documentation at `http://localhost:8000/docs`.

### 1.3 API Endpoints

- `GET /health` - Health check
- `GET /species` - List available species
- `POST /predict` - Get predictions for a single species
- `POST /predict/batch` - Get predictions for multiple species

### 1.4 Test the API

```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "species": "Sardine",
    "historical_data": [],
    "forecast_periods": 12
  }'
```

## Part 2: Google Sheets Setup

### 2.1 Create a New Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Fish Density Prediction Data"

### 2.2 Sheet Structure

Create the following sheets in your Google Spreadsheet:

#### Sheet 1: "HistoricalData"
| Column A | Column B | Column C | Column D | Column E |
|----------|----------|----------|----------|----------|
| species  | date     | count    | location | temperature |
| Sardine  | 2023-01-01 | 150    | Zone-A   | 18.5     |
| Snapper  | 2023-01-01 | 85     | Zone-B   | 19.2     |
| Tuna     | 2023-01-01 | 45     | Zone-C   | 20.1     |

#### Sheet 2: "Predictions"
| Column A | Column B | Column C | Column D | Column E | Column F | Column G | Column H | Column I |
|----------|----------|----------|----------|----------|----------|----------|----------|----------|
| species  | forecast_date | predicted_count | period | model_aic | training_samples | prediction_timestamp | confidence_lower | confidence_upper |

#### Sheet 3: "ErrorLog"
| Column A | Column B | Column C | Column D |
|----------|----------|----------|----------|
| timestamp | species | error_message | workflow_id |

### 2.3 Set up Google Sheets API Access

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Sheets API
4. Create credentials (OAuth 2.0 client ID)
5. Download the credentials JSON file

## Part 3: n8n Setup

### 3.1 Install n8n

```bash
npm install -g n8n
```

### 3.2 Start n8n

```bash
n8n start
```

Access n8n at `http://localhost:5678`

### 3.3 Configure Google Sheets Credentials

1. In n8n, go to Settings → Credentials
2. Add new credential: "Google Sheets OAuth2 API"
3. Upload your Google credentials JSON file
4. Complete the OAuth flow

### 3.4 Import the Workflow

1. Copy the content from `n8n-fish-prediction-workflow.json`
2. In n8n, go to Workflows → Import from JSON
3. Paste the JSON content
4. Update the following in the workflow:
   - Replace `YOUR_GOOGLE_SHEET_ID` with your Google Sheet ID
   - Replace `YOUR_GOOGLE_SHEETS_CREDENTIAL_ID` with your credential ID

### 3.5 Configure Workflow Settings

Update the workflow nodes with your specific configuration:

1. **Read Historical Data** node:
   - Set correct Google Sheet ID
   - Ensure it reads from "HistoricalData" sheet

2. **Call Fish Prediction API** node:
   - Verify the API URL is correct (`http://localhost:8000/predict`)

3. **Write Predictions to Sheet** node:
   - Set correct Google Sheet ID
   - Ensure it writes to "Predictions" sheet

## Part 4: Integration Testing

### 4.1 Test the Python API

```bash
# Test API health
curl http://localhost:8000/health

# Test available species
curl http://localhost:8000/species

# Test prediction
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "species": "Sardine",
    "historical_data": [
      {"date": "2023-01-01", "count": 150},
      {"date": "2023-02-01", "count": 165},
      {"date": "2023-03-01", "count": 140}
    ],
    "forecast_periods": 6
  }'
```

### 4.2 Test n8n Workflow

1. Open the workflow in n8n
2. Click "Execute Workflow"
3. Check that:
   - Historical data is read from Google Sheets
   - API is called successfully
   - Predictions are written back to Google Sheets
   - No errors are logged

### 4.3 Verify Google Sheets Integration

1. Check "HistoricalData" sheet has sample data
2. Run the n8n workflow
3. Verify "Predictions" sheet is populated with forecast data
4. Check "ErrorLog" sheet for any errors

## Part 5: Automation Options

### 5.1 Schedule-based Triggers

Replace the manual trigger with a schedule trigger:

```json
{
  "parameters": {
    "rule": {
      "interval": [
        {
          "triggerAtHour": 9,
          "triggerAtMinute": 0
        }
      ]
    }
  },
  "name": "Daily Prediction Schedule",
  "type": "n8n-nodes-base.scheduleTrigger"
}
```

### 5.2 Webhook Triggers

Set up a webhook to trigger predictions when new data is added:

```json
{
  "parameters": {
    "path": "fish-prediction-webhook",
    "responseMode": "responseNode"
  },
  "name": "Webhook Trigger",
  "type": "n8n-nodes-base.webhook"
}
```

## Part 6: Advanced Features

### 6.1 Add Email Notifications

Add an email node to notify when predictions are complete:

```json
{
  "parameters": {
    "toEmail": "your-email@example.com",
    "subject": "Fish Density Predictions Complete",
    "text": "New fish density predictions have been generated and saved to Google Sheets."
  },
  "name": "Email Notification",
  "type": "n8n-nodes-base.emailSend"
}
```

### 6.2 Data Validation

Add validation to ensure data quality:

```javascript
// In a Code node before API call
const items = [];

for (const item of $input.all()) {
  const species = item.json.species;
  const count = parseInt(item.json.count);
  const date = new Date(item.json.date);
  
  // Validate data
  if (!species || isNaN(count) || count < 0 || isNaN(date.getTime())) {
    console.log(`Invalid data for ${species}: count=${count}, date=${item.json.date}`);
    continue;
  }
  
  items.push(item);
}

return items;
```

### 6.3 Multiple Location Support

Extend the API to handle location-based predictions:

```python
class LocationPredictionRequest(BaseModel):
    species: str
    location: str
    historical_data: List[Dict[str, Any]]
    forecast_periods: int = 12
```

## Part 7: Monitoring and Maintenance

### 7.1 API Monitoring

Monitor your API with health checks:

```bash
# Create a monitoring script
#!/bin/bash
while true; do
    curl -f http://localhost:8000/health || echo "API is down"
    sleep 300  # Check every 5 minutes
done
```

### 7.2 Data Backup

Regularly backup your Google Sheets data:

1. Go to File → Download in Google Sheets
2. Choose CSV format for each sheet
3. Store backups in a secure location

### 7.3 Error Handling

Monitor the ErrorLog sheet and set up alerts:

```javascript
// In n8n workflow - check for errors
const errorCount = $input.all().length;
if (errorCount > 0) {
  // Send alert email or Slack notification
  return [{json: {alert: true, errorCount: errorCount}}];
}
```

## Part 8: Deployment

### 8.1 Production API Deployment

For production, consider deploying the API using:

- **Docker**: Create a Dockerfile for containerization
- **Cloud Services**: Deploy on AWS, Google Cloud, or Azure
- **Process Management**: Use PM2 or supervisord

### 8.2 Environment Variables

Create a `.env` file for configuration:

```env
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=False
GOOGLE_SHEET_ID=your_sheet_id
N8N_WEBHOOK_URL=your_webhook_url
```

## Troubleshooting

### Common Issues

1. **API Connection Error**
   - Check if the Python API is running on port 8000
   - Verify firewall settings

2. **Google Sheets Authentication Error**
   - Ensure OAuth credentials are properly configured
   - Check if the Google Sheets API is enabled

3. **Data Format Issues**
   - Verify date formats are consistent (YYYY-MM-DD)
   - Ensure count values are numeric

4. **Prediction Errors**
   - Check if there's enough historical data (minimum 12 data points)
   - Verify species names match exactly

### Getting Help

- Check n8n logs: `~/.n8n/logs/`
- API logs: Check console output where the API is running
- Google Sheets API quota: Check your Google Cloud Console

## Next Steps

1. **Integrate with your React app**: Add components to display predictions
2. **Add more features**: Weather data, seasonal adjustments, etc.
3. **Scale the system**: Add caching, database storage, etc.
4. **Mobile notifications**: Set up push notifications for predictions

This integration provides a solid foundation for automated fish density predictions using your existing model and modern data workflow tools.