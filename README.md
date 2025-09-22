# Sprint Planner

A Next.js application for sprint planning and project management. Calculate your team's sprint capacity in real-time with PTO tracking and on-call time considerations.

## Features

- **Real-time Sprint Capacity Calculation**: Input team size and sprint duration to get instant capacity calculations
- **PTO & Activities Tracking**: Add planned time off and activities that affect team capacity
- **On-Call Time Management**: Account for on-call responsibilities during sprints
- **Configuration Saving**: Save and load sprint configurations for reuse
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode Support**: Toggle between light and dark themes

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
3. **Automatic Deployment**: The GitHub Actions workflow will automatically build and deploy your app when you push to the `main` branch

Your app will be available at: `https://yourusername.github.io/sprint-planner`

### Manual Build

To build the project for static hosting:

```bash
npm run build
```

The static files will be generated in the `out/` directory.

## Configuration

The app uses the following configuration:

- **Next.js**: Configured for static export (`output: 'export'`)
- **GitHub Actions**: Automated deployment workflow included
- **Static Hosting**: Optimized for GitHub Pages and other static hosts

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
