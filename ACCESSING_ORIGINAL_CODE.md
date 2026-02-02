# Accessing the Original App.tsx

The original 11,254-line `App.tsx` file has been preserved in git history and can be accessed anytime.

## How to View the Original File

### Option 1: View in Terminal
```bash
git show eb54a77:src/App.tsx
```

### Option 2: Save to a File
```bash
git show eb54a77:src/App.tsx > App.tsx.backup
```

### Option 3: View Specific Lines
```bash
# View lines 1-100
git show eb54a77:src/App.tsx | head -n 100

# View lines 5000-5100
git show eb54a77:src/App.tsx | sed -n '5000,5100p'
```

### Option 4: Compare with Current
```bash
git diff eb54a77:src/App.tsx src/App.tsx
```

### Option 5: Checkout Temporary Copy
```bash
git show eb54a77:src/App.tsx > /tmp/original-app.tsx
# Edit /tmp/original-app.tsx as needed
```

## Commit Reference

- **Commit:** eb54a77
- **Date:** Mon Feb 2 12:13:52 2026
- **Message:** "Refactor: Complete architectural overhaul of Kolo Tontine frontend"
- **File:** `src/App.tsx` (11,254 lines)

## Why No Backup File?

The backup file was removed from the repository to keep the pull request diff size manageable (under 150,000 characters). Since git preserves all history, the original file is always accessible through git commands.

## Finding Specific Components in Original File

The original file contained all screens as inline components. Here's how to find them:

```bash
# Search for specific screen definitions
git show eb54a77:src/App.tsx | grep -n "const.*Screen ="

# Find authentication screens
git show eb54a77:src/App.tsx | grep -n "SplashScreen\|PhoneNumberScreen\|OTPVerification"

# Find main app screens
git show eb54a77:src/App.tsx | grep -n "HomeScreen\|CirclesScreen\|WalletScreen"
```

## IDE Integration

### VS Code
1. Install "GitLens" extension
2. Right-click on `src/App.tsx`
3. Select "Open File at Revision..."
4. Choose commit `eb54a77`

### IntelliJ/WebStorm
1. Right-click on `src/App.tsx`
2. Select "Git" → "Show History"
3. Select commit `eb54a77`
4. View file content

## Quick Reference Commands

```bash
# View full original file
git show eb54a77:src/App.tsx

# Search for a function
git show eb54a77:src/App.tsx | grep -A 20 "function handleLogin"

# Count lines
git show eb54a77:src/App.tsx | wc -l

# Extract specific screen component
git show eb54a77:src/App.tsx | sed -n '/const HomeScreen/,/^  };$/p'
```

## Migrating Components

When migrating screens from the original file:

1. **Identify the screen:**
   ```bash
   git show eb54a77:src/App.tsx | grep -n "const CircleDetailsScreen"
   ```

2. **Extract the component:**
   ```bash
   git show eb54a77:src/App.tsx | sed -n '1234,1567p' > temp-screen.tsx
   ```

3. **Refactor into new structure:**
   - Move to `src/pages/`
   - Extract reusable components to `src/components/`
   - Use services for API calls
   - Use i18n for translations

---

**Note:** The original file is safely preserved in git history and will never be lost, even as we continue development.
