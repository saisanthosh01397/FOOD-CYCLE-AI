import os

# 5. Fix AnalyticsPage.jsx
analytics_path = 'frontend/src/pages/AnalyticsPage.jsx'
with open(analytics_path, 'r', encoding='utf-8') as f:
    analytics_content = f.read()

analytics_content = analytics_content.replace('kpis.total_carbon_saved', 'kpis.carbon_saved')
analytics_content = analytics_content.replace('XAxis dataKey="date"', 'XAxis dataKey="name"')
# Also fix monthly trend XAxis if it uses date
analytics_content = analytics_content.replace('XAxis dataKey="month"', 'XAxis dataKey="name"')

with open(analytics_path, 'w', encoding='utf-8') as f:
    f.write(analytics_content)

print("Fixed AnalyticsPage mismatches!")
