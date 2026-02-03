# Work Time Tracker

A lightweight, browser-based time tracking application for interpreters and freelancers. Track calls, monitor earnings, set daily goals, and manage payment cycles—all without sending data to external servers.

## Features

### Core Tracking
- **Live Call Timer** - Start and stop calls with real-time earnings display
- **Manual Call Entry** - Add past calls with custom dates, durations, and rates
- **Multiple Rates** - Create and manage different billing rates for different services
- **Call Log** - View complete history with filtering (Today, Past Week, Past Month, Custom Date)
- **Earnings Display** - See total time and earnings for filtered call logs

### Statistics & Goals
- **Daily Goal Tracking** - Set a daily earnings target and monitor progress with visual progress bar
- **Call Statistics** - View average call duration and today's earnings at a glance
- **Monthly Breakdown** - See earnings split between first and second half of month
- **Payment Cycles** - Configure custom payment cycles to track earnings by pay period (optional)

### Data Management
- **Local Storage** - All data stored locally in your browser; no cloud sync or account required
- **Export/Import** - Backup your data as JSON or restore from previous backups
- **Storage Monitoring** - See how much data you're using (typical usage <100KB)
- **Data Reset Options** - Erase call history or reset all data with one click

### Customization
- **Dark Mode** - Toggle between light and dark themes (preference saved)
- **Time Zone Support** - Set a preferred time zone for all date/time displays
- **Responsive Design** - Works on desktop, tablet, and mobile devices

### Feedback & Support
- **Contact Us Modal** - Send feedback, bug reports, or suggestions directly to the developer
- **Multiple Categories** - Bug Report, Feedback, Suggestion, or Other
- **Email Optional** - Provide your email if you want a response, or send anonymously

## Getting Started

### Installation
1. Download `index.html`
2. Open the file in any modern web browser (Chrome, Firefox, Safari, Edge)
3. Bookmark the page for quick access

### First Steps
1. **Add a Rate** - Click "Add Rate" in the Rates section to create your first billing rate
2. **Start Tracking** - Use "Start Call" for live calls or "Add Call" for past calls
3. **Set a Goal** - Optional: enter a daily earnings goal in the Daily Goal section
4. **View Stats** - Check Call Statistics for overview of your earnings

## Usage Guide

### Adding Calls
**Live Call (Real-time):**
1. Select a rate from the dropdown
2. Click "Start Call"
3. Timer and earnings display in real-time
4. Click "End Call" when finished
5. Call is automatically saved

**Manual Entry:**
1. Click "Add Call"
2. Enter date, time, and duration (HH:MM:SS)
3. Select the rate applied
4. Click "Save"

### Managing Rates
- **Add Rate** - Enter a name and hourly/per-minute amount
- **Edit Rate** - Click the edit icon next to any rate
- **Delete Rate** - Click the trash icon to remove a rate

### Setting Goals
1. Enter your target daily earnings in the Daily Goal field
2. Click the save icon
3. Progress bar updates as you log calls

### Filtering Calls
- **Today** - Shows calls from midnight to now
- **Past Week** - Shows calls from 7 days ago to now
- **Past Month** - Shows calls from 30 days ago to now
- **Custom Date** - Select a specific date to view calls from that day only

### Payment Cycles (Optional)
1. Open Settings (gear icon)
2. Check "Enable payment cycles"
3. Click "Add Cycle"
4. Enter Start Date, End Date, and Pay Date
5. Your earnings will now display by cycle instead of by month

### Backup & Restore
**Export Data:**
1. Settings → "Export Data"
2. JSON file downloads with timestamp

**Import Data:**
1. Settings → "Import Data"
2. Select a previously exported JSON file
3. Confirm the import (overwrites current data)

### Themes & Time Zone
**Dark Mode:**
- Click the moon/sun icon (top right)
- Preference saves automatically

**Time Zone:**
1. Settings → "Time Zone"
2. Select from list or use browser default
3. All dates/times update immediately

## Data Privacy

✅ **100% Local Storage**
- All data stored in your browser
- No account needed
- No data sent to servers (except optional feedback via Formspree)

✅ **Your Data, Your Control**
- Export anytime
- Delete anytime
- No tracking or analytics

## Feedback

Have a bug to report or a feature suggestion? Click **"Contact Us"** in the footer to send feedback directly. Your email is optional—send anonymously if you prefer.

## Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge
- Any modern browser supporting ES6 and localStorage

## Troubleshooting

### Data Disappeared
- Check if you accidentally reset all data in Settings
- Restore from a backup if you have one
- Data is stored per browser and domain—switching browsers won't show your data

### Dark Mode Not Saving
- Ensure your browser allows localStorage
- Check if you're in private/incognito mode (some browsers limit storage)

### Time Zone Shows Incorrectly
- Set time zone manually in Settings
- Browser default will be used if not set

### Feedback Not Sending
- Check internet connection
- Ensure you're connected to the form endpoint
- Try refreshing and submitting again

## Tips & Tricks

💡 **Pro Tips:**
- Use distinct rate names for different service types (e.g., "Standard", "Premium", "Rush")
- Export your data weekly for backup
- Set a realistic daily goal to stay motivated
- Use payment cycles if paid bi-weekly or monthly
- Color-code notes by adding emoji to rate names (e.g., "🟢 Standard", "🔴 Rush")

## Support

For issues or questions:
1. Click **"Contact Us"** in the footer
2. Select feedback type (Bug, Feedback, Suggestion, Other)
3. Describe your issue and optionally provide your email
4. Submit

## License

This app is provided as-is for personal use. See "Terms of Service" in the app footer for details.

## Credits

Built with ❤️ for Interpreters by Interpreters.

Made by [Topo](https://www.instagram.com/otpo/)

---

**Last Updated:** February 2026  
