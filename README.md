# Sprint Planner

A Next.js application for sprint planning and project management. Calculate your team's sprint capacity in real-time with PTO tracking and on-call time considerations.

🌐 **Live Demo**: [https://campasachamp.github.io/sprint-planner/](https://campasachamp.github.io/sprint-planner/)

## Features

- **Real-time Sprint Capacity Calculation**: Input team size and sprint duration to get instant capacity calculations
- **PTO & Activities Tracking**: Add planned time off and activities that affect team capacity
- **On-Call Time Management**: Account for on-call responsibilities during sprints
- **Rollover Points Tracking**: Account for unfinished work from previous sprints
- **Configuration Management**: Save, load, duplicate, rename, and delete sprint configurations for reuse
- **Progressive Web App (PWA)**: Install as a native app on mobile and desktop devices
- **Quick Select**: Pre-configured sprint duration buttons for common sprint lengths
- **Toast Notifications**: Real-time feedback for all user actions
- **Smooth Animations**: Visual feedback and smooth transitions throughout the interface
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Automatic Dark Mode**: Automatically adapts to your system's color scheme preference

## Sprint Capacity Calculation

The application calculates sprint capacity using the following formula:

```
Total Capacity = (Team Members × Sprint Days) - PTO Days - On-Call Days - Rollover Points
```

### Formula Breakdown

- **Team Members × Sprint Days**: Base capacity assuming full availability
- **PTO Days**: Total days lost due to planned time off and activities
  - Calculated as: `Σ(Developers × Duration)` for each PTO activity
- **On-Call Days**: Days spent on on-call responsibilities
- **Rollover Points**: Story points from unfinished work in previous sprint

### Example Calculation

For a team of 5 developers in a 10-day sprint:
- Base capacity: `5 × 10 = 50 points`
- With 2 developers taking 1 day PTO each: `50 - 2 = 48 points`
- With 1 day of on-call time: `48 - 1 = 47 points`
- With 3 rollover points: `47 - 3 = 44 points`

**Final capacity: 44 story points**

## Progressive Web App (PWA)

The Sprint Planner is built as a Progressive Web App, which means you can install it on your device like a native application:

### Installation
- **Desktop**: Look for the install button in your browser's address bar or menu
- **Mobile**: Add to home screen when prompted or through your browser's menu
- **Offline**: Once installed, the app works offline and syncs when you're back online

### PWA Features
- **App-like Experience**: Full-screen interface without browser UI
- **Fast Loading**: Cached resources for instant startup
- **Offline Support**: Continue using saved configurations even without internet
- **Native Integration**: Appears in your device's app drawer/home screen

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

### GitHub Pages (Recommended)

This project is configured for automatic deployment to GitHub Pages:

1. **Push to GitHub**: Push your code to a GitHub repository
2. **Enable GitHub Pages**: 
   - Go to your repository Settings
   - Navigate to Pages section
   - Set source to "GitHub Actions"
3. **Automatic Deployment**: The GitHub Actions workflow will automatically build and deploy your app when you push to the `master` branch

Your app will be available at: `https://yourusername.github.io/sprint-planner`

**Live Site**: [https://campasachamp.github.io/sprint-planner/](https://campasachamp.github.io/sprint-planner/)

### Manual Build

To build the project for static hosting:

```bash
npm run build
```

The static files will be generated in the `out/` directory.

## Configuration Management

The Sprint Planner includes advanced configuration management features:

### Configuration Features
- **Save Configurations**: Store multiple sprint setups with custom names
- **Load Configurations**: Quickly switch between saved configurations
- **Duplicate Configurations**: Create copies of existing configurations for variations
- **Rename Configurations**: Update configuration names for better organization
- **Delete Configurations**: Remove unused configurations to keep your list clean
- **Auto-save**: Changes are automatically saved to your browser's local storage
- **Export/Import**: Configurations persist across browser sessions

### Technical Configuration

The app uses the following technical setup:

- **Next.js**: Configured for static export (`output: 'export'`)
- **GitHub Actions**: Automated deployment workflow included
- **Static Hosting**: Optimized for GitHub Pages and other static hosts
- **PWA Manifest**: Configured for app installation and offline use
- **Local Storage**: Configuration data stored locally in your browser

## User Interface & Experience

The Sprint Planner is designed with a focus on user experience and visual feedback:

### Visual Features
- **Smooth Animations**: Number inputs animate when values change, providing immediate visual feedback
- **Color-coded Feedback**: Capacity changes are highlighted with green (increase) or red (decrease) animations
- **Gradient Backgrounds**: Beautiful gradient backgrounds that adapt to light and dark modes
- **Responsive Layout**: Optimized layouts for desktop, tablet, and mobile devices
- **Interactive Elements**: Hover effects, focus states, and smooth transitions throughout

### Accessibility
- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader Support**: Proper ARIA labels and semantic HTML structure
- **High Contrast**: Dark mode provides excellent contrast for better readability
- **Touch Friendly**: Large touch targets optimized for mobile devices

### Quick Actions
- **Quick Select Buttons**: Pre-configured sprint duration buttons (1, 2, 3, 5, 10, 14 days)
- **Counter Controls**: Easy increment/decrement buttons for all numeric inputs
- **Toast Notifications**: Real-time feedback for all user actions (save, load, delete, etc.)
- **Modal Dialogs**: Clean modal interfaces for configuration management

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

TODO:
1. Add edit button to PTO/activities entries
2. Make light mode have more contrast, especially in Main Box
3. Add a toggle for light/dark mode
4. Make rollover points into final output box because it should show total points (includes rollover) and total new points (doesn't include rollover)
