# Work Time Tracker

A modern, feature-rich web application for interpreters and time-based service providers to manage rates, track calls in real-time, and monitor earnings with detailed statistics.

**Live Demo:** https://untopo.github.io/work-time-tracker/

## ✨ Key Features

### 📞 Call Management
- **Live Timer**: Start/stop calls with real-time duration and earnings calculation
- **Manual Entries**: Add calls with custom date, time, and duration
- **Edit & Delete**: Modify or remove existing call records
- **Flexible Rate Selection**: Apply different rates to different calls
- **Call Filtering**: View calls by today, past week, past month, or specific date
- **Active Call Indicator**: Visual pulse animation showing live call in progress

### 💰 Rate System
- Create and manage multiple custom rates (e.g., "Standard", "Premium", "Express")
- Per-minute billing with customizable amounts
- Last-used rate remembered automatically
- Quick access to add/edit/delete rates from the dashboard

### 📊 Statistics & Analytics
- **Daily Metrics**: View calls, average duration, total earnings for any selected date
- **Daily Goal Tracking**: Set targets with real-time progress bar and time-to-goal estimation
- **Monthly Breakdown**: Split earnings into first half and second half of the month
- **Payment Cycle Tracking**: Enable optional custom payment cycles with earn-per-cycle metrics
- **Countdown Timers**: Days remaining until cycle end and payday
- **Storage Monitor**: Visual indicator of local storage usage (5MB limit)

### 🔄 Payment Cycles (Optional)
- **Enable/Disable**: Toggle payment cycle mode on or off
- **Flexible Configuration**: Create custom cycles with start, end, and pay dates
- **Edit & Delete**: Modify existing cycles or remove them
- **Cycle Earnings**: Calculate total earnings within each cycle
- **Visual Countdown**: See days until cycle end and payday at a glance

### 🎨 User Interface & Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Mode**: Automatic or manual theme switching with persistent preference
- **Modern Aesthetics**: Built with Tailwind CSS and Font Awesome 6.4.0
- **Smooth Animations**: Gradient headers, glow effects, and transitions
- **Intuitive Controls**: Easy-to-use inline editing and deletion
- **Typography**: Professional Poppins font throughout

### 💾 Data Management
- **Automatic Persistence**: All data saved to browser localStorage
- **Export/Import**: Download data as JSON or restore from backup
- **Time Zone Support**: Select from global time zones or use browser default
- **Error Recovery**: Automatic reset if stored data becomes corrupted
- **Privacy First**: All data stays in your browser—nothing sent to external servers

## 🚀 Quick Start

### Access the Application

**Option 1: Direct File**
1. Download `index.html`
2. Open in your web browser

**Option 2: Local Repository**
1. Clone or fork the repository
2. Open `index.html` in your browser
3. (Optional) Set up GitHub Pages for online access

**Option 3: Live Online**
Visit: https://untopo.github.io/work-time-tracker/

### Getting Started (5 minutes)

1. **Add Your Rates**
   - Click "Add Rate" in the Rates section
   - Enter rate name and per-minute amount
   - Save and repeat for multiple rates

2. **Set a Daily Goal**
   - Enter your target earnings in the "Daily Goal" field
   - Click "Save Goal"
   - Watch the progress bar fill as you log calls

3. **Start Tracking**
   - Select a rate from the dropdown
   - Click "Start Call" and work
   - Click "End Call" to save automatically
   - Or use "Add Call" for manual entries with custom times

## 📖 How to Use

### Starting a Live Call
1. Select a rate from the dropdown in "Call Controls"
2. Click "Start Call" (button becomes red "End Call")
3. Watch real-time timer and earnings calculation
4. Click "End Call" when finished—call automatically saves

### Adding Manual Calls
1. Click "Add Call" to open the entry form
2. Set the date and time
3. Enter duration (hours, minutes, seconds)
4. Select the rate applied
5. Click "Submit" to save

### Managing Calls
- **Edit**: Click the edit button on any call to modify details
- **Delete**: Click the delete button to remove a call
- **Filter**: Use filter buttons to view calls by time period
- **Export**: Download all calls and settings as a JSON file

### Setting Up Payment Cycles
1. Open Settings (gear icon)
2. Toggle "Enable Payment Cycles"
3. Click "Add Cycle" to create new cycles
4. Set start date, end date, and payday
5. Statistics automatically update to show cycle earnings

### Managing Rates
- Click the edit button on a rate to modify
- Click the delete button to remove a rate
- Rates can be applied to new or existing calls

### Customization

**Dark/Light Mode**
- Click the moon/sun icon in the top-right corner
- Preference saves automatically

**Time Zone**
- Open Settings → Time Zone Selector
- Choose from global time zones or use browser default
- Times display accurately based on your selection
- Reset to browser default anytime

**Daily Goal**
- Set your target earnings for the day
- Progress bar shows completion percentage
- Remaining time to goal displays in minutes

**Data Backup**
- Click "Export Data" in Settings to download JSON backup
- Click "Import Data" to restore from a backup file
- Use this to transfer data between devices

## 🛠️ Technical Details

### Built With
- **HTML5** - Semantic markup
- **Tailwind CSS 3** - Utility-first styling via CDN
- **JavaScript (Vanilla)** - No frameworks required
- **Font Awesome 6.4.0** - Professional icons
- **Google Fonts** - Poppins typography
- **localStorage API** - Client-side data persistence
- **Intl API** - Timezone and locale support

### Browser Compatibility
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Data Storage
- All data stored in browser localStorage
- 5MB typical limit per domain
- Storage usage displayed in Settings
- No data sent to any server
- Complete privacy—your data never leaves your device

### Performance
- Single-file deployment (no build needed)
- Minimal dependencies (all via CDN)
- Fast load times
- Responsive interactions with smooth animations

## 🎯 Use Cases

**Freelance Interpreters** - Track hourly billing, manage multiple rates (consecutive vs. simultaneous), and view earnings by payment cycle

**Tutors & Coaches** - Log student sessions, track billable hours, monitor daily/monthly income

**Consultants** - Record project time, apply different rates per client, export for invoicing

**Call Center Staff** - Track calls, monitor personal KPIs, estimate daily targets

## 🔒 Privacy & Security

✅ All data stored locally in your browser
✅ No tracking or analytics
✅ No external API calls
✅ No server-side storage
✅ Open source—inspect the code anytime

## 📝 License

MIT License - Use freely for personal or commercial projects

## 💡 Tips & Tricks

- Use **"Start Call"** for real-time tracking; use **"Add Call"** for entries you forgot to log
- Create multiple rates if you charge different amounts for different services
- Export your data regularly as a backup
- Payment cycles are optional—use monthly metrics if you prefer
- Switch time zones without losing any data
- Dark mode is easier on the eyes during evening work sessions

## 🤝 Contributing

Found a bug or have a feature suggestion? Feel free to open an issue or submit a pull request!

---

**🚀 Built with ❤️ to help interpreters and service providers organize their time and maximize earnings**

For questions or support, check the Privacy Policy and Terms of Service in the app footer.
