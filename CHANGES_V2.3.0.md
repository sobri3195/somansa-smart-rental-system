# Somansa v2.3.0 - Cleanup Release

## Changes Summary

This release removes personal branding and unused features to create a clean, professional rental system application.

### 1. Removed Activity Ticker ✅
- **File**: `src/pages/Home.jsx`
- **Changes**: 
  - Removed entire "recent-activity" section (lines 202-220)
  - Removed `dummyRecentActivities` import
- **Effect**: Landing page no longer shows scrolling activity ticker

### 2. Removed Dark Mode Toggle ✅
- **Deleted Files**: 
  - `src/components/common/DarkModeToggle.jsx`
- **CSS Changes**: 
  - Removed `.dark-mode` class styles
  - Removed `.dark-mode-toggle` button styles
  - Removed dark mode from responsive media queries
  - Removed dark mode from print styles
- **Effect**: No more light/night view toggle feature

### 3. Removed Language Toggle ✅
- **Deleted Files**: 
  - `src/components/common/LanguageToggle.jsx`
- **CSS Changes**: 
  - Removed `.language-toggle` button styles
  - Removed language toggle from responsive media queries
  - Removed language toggle from print styles
- **Effect**: No more Indonesian/English language switcher

### 4. Updated Favicon ✅
- **File**: `public/favicon.svg`
- **Changes**: 
  - Replaced house icon with simple "S" letter
  - Maintains brand gradient colors (#667eea to #764ba2)
  - Cleaner, more professional design
- **Effect**: Browser tab now shows "S" for Somansa

### 5. Removed Developer Credits ✅
- **Footer** (`src/components/layout/Footer.jsx`):
  - Removed "Contact & Support" section
  - Removed personal email, Telegram, WhatsApp, and website links
  - Kept only essential Quick Links navigation
  
- **HTML Metadata** (`index.html`):
  - Removed meta author tag with developer credentials
  - Removed author object from JSON-LD structured data
  - Removed contact point with personal email
  
- **Effect**: No personal branding or developer credits anywhere in the app

## Files Modified

1. `src/pages/Home.jsx` - Removed activity ticker
2. `src/components/layout/Footer.jsx` - Simplified footer
3. `src/animations.css` - Removed dark mode and language toggle styles
4. `index.html` - Removed developer metadata
5. `public/favicon.svg` - New "S" letter design

## Files Deleted

1. `src/components/common/DarkModeToggle.jsx`
2. `src/components/common/LanguageToggle.jsx`

## Testing

- ✅ Build successful: `npm run build`
- ✅ Lint passed: `npm run lint`
- ✅ No errors or warnings

## Breaking Changes

None - all removed features were standalone and not used by other components.

## Migration Notes

If you had custom code referencing these features:
- Remove any imports of `DarkModeToggle` or `LanguageToggle`
- Remove any references to `useLanguage()` hook
- Remove any localStorage reads for `theme` or `language` keys
- The activity ticker data (`dummyRecentActivities`) is still in `dummyData.js` but unused

---

**Version**: 2.3.0  
**Date**: December 2024  
**Type**: Cleanup Release
