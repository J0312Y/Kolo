# Kolo Tontine - Refactoring Guide

This document explains the refactoring work completed on the Kolo Tontine project and how to work with the new architecture.

---

## What Changed?

### Before Refactoring
- ❌ Single 11,254-line `App.tsx` file
- ❌ No routing system
- ❌ No component separation
- ❌ Hardcoded translations
- ❌ No state management
- ❌ No API abstraction
- ❌ Difficult to maintain and test

### After Refactoring
- ✅ Clean component architecture
- ✅ React Router for navigation
- ✅ TypeScript types throughout
- ✅ i18next for translations
- ✅ Context API for state management
- ✅ API service layer
- ✅ Reusable UI components
- ✅ Easy to maintain and scale

---

## New Project Structure

```
src/
├── components/          # Reusable components
│   ├── ui/             # Basic UI components (Button, Input, Card, etc.)
│   ├── layout/         # Layout components (Header, BottomNavigation)
│   ├── auth/           # Authentication-specific components
│   ├── circles/        # Circle/Likelemba components
│   ├── wallet/         # Wallet components
│   └── profile/        # Profile components
│
├── pages/              # Page-level components (route targets)
│   ├── Home.tsx
│   ├── Circles.tsx
│   ├── Wallet.tsx
│   ├── Card.tsx
│   └── Profile.tsx
│
├── context/            # React Context providers
│   └── AuthContext.tsx # Authentication state management
│
├── services/           # API service layer
│   ├── api.ts          # Base API client
│   ├── auth.service.ts
│   ├── circles.service.ts
│   ├── goals.service.ts
│   └── transactions.service.ts
│
├── hooks/              # Custom React hooks
│
├── types/              # TypeScript type definitions
│   └── index.ts
│
├── i18n/               # Internationalization
│   ├── config.ts       # i18next configuration
│   ├── en.json         # English translations
│   └── fr.json         # French translations
│
├── routes/             # React Router configuration
│   └── index.tsx
│
├── utils/              # Utility functions
├── constants/          # App constants
├── App.tsx             # Main app component (now only 13 lines!)
└── main.tsx            # Entry point

# Backup of old code
App.tsx.backup          # Original 11,254-line file (for reference)
```

---

## Key Improvements

### 1. Component Architecture

**UI Components** (`src/components/ui/`)
- `Button.tsx` - Reusable button with variants
- `Input.tsx` - Input field with validation
- `Card.tsx` - Card container
- `Badge.tsx` - Status badges
- `Modal.tsx` - Modal dialogs

Example usage:
```tsx
import { Button, Input, Card } from '../components/ui';

<Card>
  <Input
    label="Phone Number"
    placeholder="+242 06 123 4567"
  />
  <Button variant="primary" fullWidth>
    Continue
  </Button>
</Card>
```

### 2. TypeScript Types

All entities now have proper TypeScript types:
```typescript
import { User, LikeLemba, Goal, Transaction } from '../types';

const user: User = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  // ... type-safe!
};
```

### 3. API Service Layer

Clean API calls with TypeScript:
```typescript
import { authService, circlesService } from '../services';

// Login
const response = await authService.login({ phone, password });

// Get circles
const circles = await circlesService.getMyCircles();

// Create circle
const newCircle = await circlesService.createCircle({
  name: 'Family Savings',
  amount: '50000',
  duration: 12,
  totalMembers: 6
});
```

### 4. Internationalization (i18n)

Easy multi-language support:
```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <h1>{t('home.welcomeBack')}</h1>
      <button onClick={() => i18n.changeLanguage('fr')}>
        Français
      </button>
    </div>
  );
};
```

### 5. Authentication Context

Global auth state management:
```tsx
import { useAuth } from '../context';

const MyComponent = () => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <p>Welcome, {user.firstName}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

### 6. React Router

Clean routing system:
```tsx
// Navigation is handled by React Router
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/circles');
navigate('/wallet');
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment
```bash
cp .env.example .env
# Edit .env with your API URL
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## Development Workflow

### Creating a New Page

1. Create page component in `src/pages/`:
```tsx
// src/pages/MyNewPage.tsx
import React from 'react';
import { Header } from '../components/layout';

export const MyNewPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="My New Page" />
      <div className="p-4">
        {/* Page content */}
      </div>
    </div>
  );
};
```

2. Add route in `src/routes/index.tsx`:
```tsx
import { MyNewPage } from '../pages/MyNewPage';

<Route path="/my-new-page" element={<MyNewPage />} />
```

3. Export from `src/pages/index.ts`:
```tsx
export { MyNewPage } from './MyNewPage';
```

### Creating a New Component

1. Create component in appropriate folder:
```tsx
// src/components/circles/CircleCard.tsx
import React from 'react';
import { Card } from '../ui';
import { LikeLemba } from '../../types';

interface CircleCardProps {
  circle: LikeLemba;
  onClick?: () => void;
}

export const CircleCard: React.FC<CircleCardProps> = ({ circle, onClick }) => {
  return (
    <Card onClick={onClick} hoverable>
      <h3>{circle.name}</h3>
      <p>{circle.amount} XAF</p>
    </Card>
  );
};
```

2. Use in pages:
```tsx
import { CircleCard } from '../components/circles/CircleCard';

<CircleCard circle={circle} onClick={() => navigate(`/circles/${circle.id}`)} />
```

### Adding API Endpoints

1. Add to service file:
```typescript
// src/services/circles.service.ts
async updateCircle(id: string, data: Partial<CreateCircleData>): Promise<ApiResponse<LikeLemba>> {
  return apiClient.put<LikeLemba>(`/likelembas/${id}`, data);
}
```

2. Use in components:
```typescript
import { circlesService } from '../services';

const handleUpdate = async () => {
  await circlesService.updateCircle(id, { name: 'New Name' });
};
```

### Adding Translations

1. Add to `src/i18n/en.json`:
```json
{
  "myFeature": {
    "title": "My Feature",
    "description": "Feature description"
  }
}
```

2. Add French translation to `src/i18n/fr.json`:
```json
{
  "myFeature": {
    "title": "Ma Fonctionnalité",
    "description": "Description de la fonctionnalité"
  }
}
```

3. Use in components:
```tsx
const { t } = useTranslation();
<h1>{t('myFeature.title')}</h1>
```

---

## Migration Status

### ✅ Completed
- [x] Project structure setup
- [x] TypeScript types
- [x] i18n configuration
- [x] API service layer
- [x] UI components (Button, Input, Card, Badge, Modal)
- [x] Layout components (Header, BottomNavigation)
- [x] Authentication context
- [x] React Router setup
- [x] Basic page structure

### 🚧 In Progress (Next Steps)
- [ ] Migrate all screens from `App.tsx.backup`
- [ ] Implement authentication pages (Login, Register, OTP)
- [ ] Implement circle management pages
- [ ] Implement wallet pages
- [ ] Implement goal management pages
- [ ] Implement profile pages
- [ ] Add form validation
- [ ] Add error boundaries
- [ ] Add loading states
- [ ] Add toast notifications

### 📋 TODO
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Add Storybook for component documentation
- [ ] Optimize bundle size
- [ ] Add PWA support
- [ ] Add offline support
- [ ] Performance optimization

---

## Best Practices

### Component Design
- Keep components under 200 lines
- One component per file
- Use TypeScript interfaces for props
- Extract reusable logic to hooks
- Use proper prop types

### State Management
- Use Context API for global state
- Use local state for component-specific data
- Keep state as close to where it's used as possible
- Avoid prop drilling

### API Calls
- Always use the service layer
- Handle errors properly
- Show loading states
- Implement retry logic for failed requests

### Styling
- Use Tailwind CSS utility classes
- Keep styles consistent
- Use design tokens (colors, spacing)
- Make components responsive

### Security
- Never store sensitive data in localStorage
- Always validate on server-side
- Sanitize user inputs
- Use HTTPS only
- Implement proper authentication

---

## Testing

### Running Tests
```bash
npm test
```

### Writing Tests
```tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

---

## Troubleshooting

### Port already in use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Module not found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors
```bash
# Restart TypeScript server in VS Code
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

---

## Resources

- [React Documentation](https://react.dev)
- [React Router Documentation](https://reactrouter.com)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [i18next Documentation](https://www.i18next.com)

---

## Contributing

1. Create a feature branch
2. Follow the coding standards
3. Write tests for new features
4. Update documentation
5. Submit a pull request

---

## Support

For questions or issues:
- Check `SECURITY_REVIEW.md` for security guidelines
- Review the original `App.tsx.backup` for reference
- Contact the development team

---

**Happy Coding! 🚀**
