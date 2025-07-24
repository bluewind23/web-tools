# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a revenue-generating Korean web tools collection website built with Next.js 15. The site provides 11 useful online utilities without requiring user registration or software installation. All tools process data client-side for privacy and security.

**Live Purpose**: Revenue generation through advertising while providing valuable web utilities to Korean users.

## Development Commands

### Setup and Development
```bash
# Install dependencies
npm install

# Run development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

### Development Workflow
```bash
# Development server runs on http://localhost:3000
npm run dev

# Uses Turbopack for faster builds in development
# Auto-refresh on file changes
```

## Technology Stack

### Core Framework
- **Next.js 15.4.3** with App Router
- **React 19.1.0** with hooks (useState, useEffect, useRef)
- **TypeScript 5** for type safety
- **Turbopack** for development builds

### Styling & UI
- **Tailwind CSS 4** for styling
- **Korean-optimized typography** with appropriate font weights
- **Responsive design** (mobile-first approach)
- **Emoji icons** for visual appeal and Korean cultural preference

### Key Libraries
- **qrcode 1.5.3** - QR code generation
- **gif.js 0.2.0** - GIF creation and optimization
- **react-twemoji 0.5.0** - Emoji rendering
- **react-color 2.19.3** - Color picker components

### Processing Architecture
- **Client-side only** - All data processing happens in browser
- **No server dependencies** for tools functionality  
- **File handling** with Canvas API and FileReader
- **Canvas optimization** with `willReadFrequently: true`

## Application Architecture

### Project Structure
```
/src
  /app                 # App Router pages
    /page.tsx         # Main landing page with tool catalog
    /tools            # Individual tool pages
      /gif-maker/     # GIF creation tool
      /color-converter/ # Color conversion utilities
      /base64-converter/ # Base64 encoding/decoding
      /qr-generator/  # QR code generator
      # ... 7 more tools
  /components         # Reusable components
    /ToolLayout.tsx   # Wrapper for all tool pages
    /Header.tsx       # Site navigation
    /Footer.tsx       # Site footer
    /AdBanner.tsx     # Monetization components
  /data
    /tools.ts         # Tool definitions and metadata
```

### Component Architecture
- **ToolLayout**: Universal wrapper for all tools with ads and recommendations
- **Tool Pages**: Individual tool implementations with consistent UI patterns
- **Ad Integration**: Strategic ad placement for revenue generation
- **Header/Footer**: Site-wide navigation and branding

### Data Layer
- **tools.ts**: Central registry of all 11 tools with metadata
- **Categories**: Text, Image, Conversion, Development, Design, Calculation, Network
- **Popular Tools**: Flagged tools shown prominently on homepage
- **Keywords**: Korean search terms for tool discovery

## Tool Implementation Patterns

### Common Patterns Across Tools
1. **useState** for local state management
2. **File handling** with drag-and-drop support
3. **Canvas processing** for image/video manipulation
4. **Copy to clipboard** functionality
5. **Download generated files** capability
6. **Real-time preview** and updates
7. **Error handling** with user-friendly Korean messages

### GIF Maker (`/tools/gif-maker/page.tsx`)
**Advanced Features**:
- Video frame extraction with configurable FPS
- Batch image processing with progress tracking
- Size optimization with target file size capability
- Quality vs size trade-off controls
- **Key Innovation**: `fixDimensions` toggle for size vs quality optimization
- Canvas optimization for large file processing

**Technical Implementation**:
- `gif.js` worker-based processing
- Progressive optimization attempts
- Memory-efficient frame handling
- Real-time progress feedback

### Color Converter (`/tools/color-converter/page.tsx`)
**Advanced Features**:
- Real-time conversion between HEX, RGB, HSL, CMYK
- PANTONE color matching with 94 predefined colors
- Interactive color picker and sliders
- Color palette with quick selection
- Copy functionality for all formats

### Base64 Converter (`/tools/base64-converter/page.tsx`)
**Features**:
- Text and image encoding/decoding
- File upload with drag-and-drop
- Korean text support with proper UTF-8 handling
- Image preview for decoded data URLs
- Download functionality for results

### Tool Registry Pattern
Each tool follows consistent metadata structure:
```typescript
interface Tool {
  id: string;           // URL slug
  name: string;         // Korean display name
  description: string;  // Detailed Korean description
  shortDesc: string;    // Brief Korean description
  href: string;         // Route path
  icon: string;         // Emoji icon
  category: string;     // Tool category
  popular: boolean;     // Homepage feature flag
  keywords: string[];   // Korean search terms
}
```

## Korean Localization

### Content Strategy
- **Korean-first** design and content
- **Emoji icons** for universal understanding
- **Cultural preferences** reflected in design choices
- **Search keywords** optimized for Korean users
- **Error messages** in Korean with helpful context

### Typography
- **Font weights**: medium/semibold for Korean text visibility
- **Color contrast**: Improved from light gray (text-gray-500) to darker variants (text-gray-800/900)
- **Responsive scaling** for Korean character width

## Revenue Model

### Advertisement Integration
- **HeaderAd**: Top of homepage for maximum visibility
- **ToolResultAd**: After tool usage for engagement-based monetization
- **ContentBottomAd**: Tool page footer placement
- **Strategic placement** that doesn't interfere with tool functionality

### Monetization Components
```typescript
// Ad banner components in src/components/AdBanner.tsx
- HeaderAd: Homepage top placement
- ToolResultAd: Post-tool usage
- ContentBottomAd: Tool page footers
```

## Performance Optimizations

### Build Performance
- **Turbopack** for 10x faster development builds
- **Next.js 15** with improved bundling
- **Dynamic imports** for tool-specific libraries

### Runtime Performance
- **Client-side processing** eliminates server load
- **Canvas optimization** with `willReadFrequently: true`
- **Memory management** for large file processing
- **Progressive loading** for tool assets

### User Experience
- **Real-time feedback** for all operations
- **Progress indicators** for long-running tasks
- **Error recovery** with clear messaging
- **Responsive design** for mobile usage

## Common Issues & Solutions

### Text Visibility Issues
**Problem**: Light gray text difficult to read
**Solution**: Changed from `text-gray-500/600` to `text-gray-800/900` with `font-medium/semibold`

### GIF Generation Errors
**Problem**: Memory issues with large files
**Solution**: Canvas optimization, progressive processing, timeout handling

### Clipboard API Issues
**Problem**: `navigator.clipboard` undefined in insecure contexts
**Solution**: Fallback methods and secure context detection

### Search Functionality
**Problem**: Search not clearing on category change
**Solution**: `setSearchQuery('')` on category selection

## Development Guidelines

### Code Style
- **TypeScript strict mode** for type safety
- **ESLint** with Next.js configuration
- **Consistent error handling** with try-catch blocks
- **Korean comments** for business logic explanations

### Component Patterns
- **Hooks-based** functional components
- **Props interfaces** for all components
- **Event handler** naming with `handle` prefix
- **State management** with appropriate useState/useEffect

### File Processing
- **Size limits** (20MB for GIF maker)
- **Type validation** for uploaded files
- **Progress tracking** for user feedback
- **Memory cleanup** after processing

## Testing & Quality Assurance

### Manual Testing Checklist
- [ ] All 11 tools function correctly
- [ ] File upload/download works across browsers
- [ ] Korean text input/output correct
- [ ] Mobile responsiveness maintained
- [ ] Ad placements display properly
- [ ] Search functionality works
- [ ] Category filtering works

### Browser Compatibility
- **Chrome/Safari/Firefox** support required
- **Mobile browsers** optimization
- **Canvas API** availability
- **FileReader API** support

## SEO & Discovery

### Korean Market Optimization
- **Keywords**: Focused on Korean search terms
- **Meta descriptions**: Korean language optimization
- **Tool categorization**: Aligned with Korean user needs
- **Popular tools**: Based on Korean user preferences

### Search Features
- **Category filtering**: 8 categories including popular tools
- **Keyword search**: Searches name, description, and keywords
- **Popular tools**: Featured prominently on homepage

## Important Notes for Development

### Critical Patterns
1. **Always read files before editing** - Required by development environment
2. **Korean text priority** - All user-facing text should be Korean
3. **Client-side only** - No server-side dependencies for tools
4. **Revenue focus** - Ad placement decisions affect monetization
5. **Mobile-first** - Korean users heavily mobile-oriented

### Common Modifications
- **Text visibility**: Use `text-gray-800/900` with `font-medium/semibold`
- **Error handling**: Include Korean error messages
- **File processing**: Add progress feedback and size limits
- **Ad integration**: Maintain revenue-generating placements

### Code Quality Standards
- **TypeScript interfaces** for all data structures
- **Error boundaries** for production stability
- **Memory management** for large file processing
- **Performance monitoring** for user experience

This codebase represents a successful Korean web tools collection with revenue generation through strategic advertising placement and high-quality, client-side tool implementations.