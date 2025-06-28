# krex.dll - Portfolio Website

A modern, responsive portfolio website built with Next.js 14, TypeScript, and Framer Motion. Features smooth page transitions, mobile-first design, and interactive animations.

## 🚀 Live Demo

Visit the live site: [krex38.xyz](https://krex38.xyz)

## ✨ Features

- **Modern Tech Stack**: Built with Next.js 14, TypeScript, and Tailwind CSS
- **Smooth Animations**: Powered by Framer Motion for seamless page transitions
- **Responsive Design**: Mobile-first approach with tablet and desktop optimizations
- **Interactive Navigation**: 
  - Desktop: Navigation bar with active indicators
  - Tablet: Optimized navigation layout
  - Mobile: Hamburger menu with slide-out navigation
- **Touch Gestures**: Swipe navigation for mobile and tablet devices
- **Keyboard Navigation**: Arrow keys and ESC key support
- **Performance Optimized**: Fast loading with optimized animations
- **SEO Ready**: Meta tags, Open Graph, and structured data
- **Analytics**: Vercel Analytics integration

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Fonts**: Geist Sans & Geist Mono
- **Analytics**: Vercel Analytics
- **Deployment**: Vercel

## 📱 Responsive Breakpoints

- **Mobile**: < 768px - Swipe navigation, hamburger menu
- **Tablet**: 768px - 1024px - Optimized navigation bar
- **Desktop**: > 1024px - Full navigation with side indicators

## 🎨 Sections

1. **Hero** - Introduction and welcome
2. **About** - Personal information and background
3. **Skills** - Technical skills and expertise
4. **Education** - Academic background
5. **Discord** - Community and social presence
6. **Contact** - Get in touch information

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Krex381/krexdll.git
cd krexdll
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 📂 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page with navigation logic
│   └── globals.css         # Global styles
├── components/
│   ├── Hero.tsx           # Hero section component
│   ├── About.tsx          # About section component
│   ├── Skills.tsx         # Skills section component
│   ├── Education.tsx      # Education section component
│   ├── Discord.tsx        # Discord section component
│   └── Contact.tsx        # Contact section component
└── ...
```

## 🎯 Key Features Explained

### Navigation System
- **Desktop**: Top navigation bar with smooth hover effects
- **Tablet**: Compact navigation bar
- **Mobile**: Hamburger menu with slide-out panel

### Animation System
- **Page Transitions**: 3D-style transitions with blur and scale effects
- **Device Optimization**: Different animation parameters for mobile/desktop
- **Performance**: GPU-accelerated transforms for smooth animations

### Touch Gestures
- **Swipe Detection**: Horizontal swipe to navigate between sections
- **Vertical Scroll**: Preserved for content scrolling
- **Gesture Thresholds**: Configurable sensitivity and timing

## 🔧 Customization

### Modifying Sections
Add or remove sections by updating the `sections` array in `page.tsx`:

```tsx
const sections = [
  { component: <Hero />, id: 'hero', name: 'Home' },
  { component: <About />, id: 'about', name: 'About' },
  // Add your new section here
];
```

### Animation Tweaking
Modify animation parameters in the `sectionVariants` object in `page.tsx`.

### Styling
Update Tailwind classes or modify `globals.css` for custom styling.

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [Apache 2.0 License](LICENSE).

## 👤 Author

**Krex**
- Website: [krex38.xyz](https://krex38.xyz)
- GitHub: [@Krex381](https://github.com/Krex381)
- Discord: [krex_dll](discord.com/users/644313519147319297)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Vercel](https://vercel.com/) for seamless deployment

---

⭐ Star this repo if you found it helpful!
