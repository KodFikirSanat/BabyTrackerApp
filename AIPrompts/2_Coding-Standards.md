# File: 2_Coding-Standards.md
# Purpose: To define the specific coding, commenting, logging, and commit standards for this project.
# Audience: All AI Assistants and Human Developers.

---

## 1. Naming Conventions

### 1.1. Language
-   All code-level identifiers **MUST be in English.** This includes:
    -   Variable names (`const userProfile` not `const kullaniciProfili`)
    -   Function names (`function fetchData()` not `function veriCek()`)
    -   Component names (`UserProfileCard.tsx`)
    -   File and folder names (`/src/components/user-profile/`)
-   User-facing strings displayed in the UI (e.g., button titles, labels) **SHOULD be in Turkish** to match the Figma design.

### 1.2. Casing
-   **`PascalCase`**: For React Component names and TypeScript `type`/`interface` names (e.g., `UserProfile`, `RootStackParamList`).
-   **`camelCase`**: For all variables and functions (e.g., `const userName`, `function getUserProfile()`).

---

## 2. Commenting Standards

### 2.1. Language & Style
-   All comments **MUST be in professional and clear English.**
-   Comments should explain the **"why,"** not the "what." Assume the reader understands the code; explain the business logic or the reason for a specific implementation choice.
-   **NO EMOJIS** are allowed in code comments.

### 2.2. JSDoc Format
-   All exported functions, components, and complex types **MUST** have a JSDoc block (`/** ... */`) above them.
-   The block must describe the purpose, parameters (`@param`), and return values (`@returns`).

#### Example:
```typescript
/**
 * A reusable card component to display user information.
 * @param user - The user object containing name and email.
 * @param onPress - Function to be called when the card is pressed.
 * @returns A React Element.
 */
const UserProfileCard = ({ user, onPress }) => {
  // ... component logic
};
3. Logging Standards (console.log)
To make debugging easier and more organized, all console.log statements MUST follow this two-emoji format: [Component Emoji][Action Emoji] Descriptive Message.

3.1. Component Emojis
App.tsx: 📱

AppNavigator: 🗺️

MainTabNavigator: 🗂️

SplashScreen: ⏳

EntryScreen: 🚪

TrackingScreen: 📈

AiChatScreen: 🤖

GuidesScreen: 📚

ProfileScreen: 👤

(For new components, a new, relevant emoji should be chosen.)

3.2. Action Emojis
Loading / Pending: ⏳ (loading..., setting timer...)

Success / Mounted: ✅ (mounted, loaded successfully, data fetched)

Rendering: 🎨 (component rendering...)

Navigation / Action: ➡️ (navigating to..., button pressed...)

Cleanup: 🧹 (clearing timer..., unsubscribing...)

Error: ❌ (error fetching data!)

3.3. Example Log
JavaScript

console.log('🗺️➡️ AppNavigator: Navigating to Profile screen...');