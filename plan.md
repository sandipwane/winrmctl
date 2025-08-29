# WinRM Config Utility - Development Plan

## Overview
A modern, user-friendly terminal application that simplifies Windows Remote Management (WinRM) configuration, bringing Claude Code's elegant TUI experience to Windows system administration.

## Prerequisites

### Phase 0: Project Initialization
```bash
# Initialize git repository
git init

# Create .gitignore
echo "node_modules/" > .gitignore
echo "dist/" >> .gitignore
echo ".DS_Store" >> .gitignore
echo "*.log" >> .gitignore

# Initial commit
git add .
git commit -m "Initial commit"
```

---

## Phase 1: Basic React Ink Setup

### Goal
Get a minimal React Ink app running with Bun and TypeScript.

### Steps
1. **Initialize Ink project**
   ```bash
   bunx create-ink-app --typescript .
   ```

2. **Test basic setup**
   ```bash
   bun install
   bun run build
   bun start
   ```

3. **Create basic Hello World component**
   - Modify `src/app.tsx` to display "WinRM Config Utility"
   - Add basic Text and Box components
   - Verify TypeScript compilation

### Deliverable
- Working CLI that displays "WinRM Config Utility" in a box
- Commit: "Setup basic React Ink with TypeScript and Bun"

---

## Phase 2: Layout Structure

### Goal
Create the main layout components that will frame the entire application.

### Steps
1. **Create layout components**
   ```
   src/components/
   ├── Layout.tsx      # Main wrapper with borders
   ├── Header.tsx      # App title and version
   └── StatusBar.tsx   # Bottom status line
   ```

2. **Implement basic layout**
   - Header with app title
   - Content area with borders
   - Status bar showing current time/mode

3. **Add basic styling**
   - Colors for header/footer
   - Box borders
   - Proper spacing

### Deliverable
- App with consistent layout structure
- Commit: "Add layout components with header and status bar"

---

## Phase 3: Navigation System

### Goal
Implement keyboard-based navigation between different screens.

### Steps
1. **Install navigation dependencies**
   ```bash
   bun add ink-select-input
   ```

2. **Create navigation components**
   ```
   src/components/
   ├── Menu.tsx        # Navigation menu
   └── Navigator.tsx   # Navigation controller
   ```

3. **Implement navigation logic**
   - Tab/Arrow key navigation
   - Screen switching
   - Active screen highlighting

4. **Create placeholder screens**
   ```
   src/components/screens/
   ├── Dashboard.tsx
   ├── TrustedHosts.tsx
   ├── Listeners.tsx
   ├── Authentication.tsx
   └── Diagnostics.tsx
   ```

### Deliverable
- Working navigation between empty screens
- Commit: "Implement navigation system with placeholder screens"

---

## Phase 4: Mock Data Layer

### Goal
Create a mock data system to simulate WinRM configurations.

### Steps
1. **Define TypeScript interfaces**
   ```
   src/types/
   └── index.ts    # All type definitions
   ```

2. **Create mock data**
   ```
   src/data/
   ├── mockData.ts     # Static mock data
   └── dataStore.ts    # Simulated state management
   ```

3. **Implement data types**
   - TrustedHost interface
   - Listener configuration
   - Authentication settings
   - Service status

### Deliverable
- Type-safe mock data system
- Commit: "Add mock data layer with TypeScript interfaces"

---

## Phase 5: Dashboard Screen

### Goal
Build an informative dashboard showing WinRM service status.

### Steps
1. **Install UI dependencies**
   ```bash
   bun add ink-spinner
   ```

2. **Create dashboard components**
   - Service status indicator
   - Quick statistics
   - Recent activity log

3. **Add mock interactions**
   - Refresh button (R key)
   - Simulated loading states
   - Status color coding (green/red/yellow)

### Deliverable
- Interactive dashboard with mock data
- Commit: "Implement dashboard screen with service status"

---

## Phase 6: Trusted Hosts Management

### Goal
Create an interactive screen for managing trusted hosts.

### Steps
1. **Install form dependencies**
   ```bash
   bun add ink-text-input ink-table
   ```

2. **Build trusted hosts screen**
   - Table view of current hosts
   - Add new host form
   - Delete confirmation dialog

3. **Implement interactions**
   - Arrow keys to select host
   - 'A' to add new host
   - 'D' to delete selected
   - 'Enter' to edit

### Deliverable
- Full CRUD operations for trusted hosts (mock)
- Commit: "Add trusted hosts management screen"

---

## Phase 7: Listeners Configuration

### Goal
Build interface for configuring HTTP/HTTPS listeners.

### Steps
1. **Create listener components**
   - Port configuration forms
   - Protocol selection (HTTP/HTTPS)
   - Certificate path input (for HTTPS)

2. **Add validation**
   - Port range validation (1-65535)
   - Duplicate port checking
   - Certificate path validation

3. **Visual feedback**
   - Success/error messages
   - Loading spinners for "applying" changes

### Deliverable
- Listener configuration with validation
- Commit: "Implement listeners configuration screen"

---

## Phase 8: Authentication Settings

### Goal
Create authentication configuration interface.

### Steps
1. **Build auth components**
   - Toggle switches for auth methods
   - Credential delegation settings
   - Security level selector

2. **Implement auth options**
   - Kerberos enable/disable
   - NTLM configuration
   - Basic auth warnings

3. **Add help text**
   - Inline descriptions
   - Security recommendations

### Deliverable
- Complete authentication settings screen
- Commit: "Add authentication settings interface"

---

## Phase 9: Diagnostics & Testing

### Goal
Build diagnostics screen for testing connections.

### Steps
1. **Create diagnostic tools**
   - Connection tester
   - Mock log viewer
   - System requirements checker

2. **Add test functionality**
   - Test connection form
   - Progress indicators
   - Result display (success/failure)

3. **Implement log viewer**
   - Scrollable log display
   - Log level filtering
   - Clear logs option

### Deliverable
- Diagnostics screen with testing tools
- Commit: "Implement diagnostics and testing screen"

---

## Phase 10: Polish & Enhancement

### Goal
Add finishing touches and improve user experience.

### Steps
1. **Add help system**
   - '?' key for help
   - Keyboard shortcuts guide
   - Context-sensitive help

2. **Improve visual feedback**
   - Smooth transitions
   - Better color scheme
   - Loading animations

3. **Add configuration export**
   - Export settings to JSON
   - Import settings
   - Reset to defaults

4. **Error handling**
   - Graceful error messages
   - Recovery suggestions
   - Input validation feedback

### Deliverable
- Polished, user-friendly TUI application
- Commit: "Add polish and UX enhancements"

---

## Phase 11: Documentation & Testing

### Goal
Complete documentation and add basic tests.

### Steps
1. **Update README**
   - Installation instructions
   - Usage guide
   - Keyboard shortcuts reference

2. **Add examples**
   - Common use cases
   - Screenshots (if possible)
   - Configuration examples

3. **Create tests**
   - Component rendering tests
   - Navigation flow tests
   - Data manipulation tests

### Deliverable
- Complete documentation and test suite
- Commit: "Add documentation and tests"

---

## Phase 12: Build & Distribution

### Goal
Prepare for distribution and usage.

### Steps
1. **Optimize build**
   - Production build configuration
   - Bundle size optimization
   - Performance improvements

2. **Create distribution**
   - Build standalone executable
   - Package.json scripts
   - Installation script

3. **Add CI/CD** (optional)
   - GitHub Actions workflow
   - Automated releases
   - Version tagging

### Deliverable
- Ready-to-use CLI application
- Commit: "Prepare for distribution"

---

## Notes

### Development Tips
- Test each phase thoroughly before moving to the next
- Commit after each successful phase
- Keep components small and focused
- Use TypeScript strictly for better type safety

### Key Libraries
- `ink` - React for CLIs
- `ink-select-input` - Selection lists
- `ink-text-input` - Text input fields
- `ink-spinner` - Loading indicators
- `ink-table` - Table display

### Testing Commands
```bash
# Development
bun run dev

# Build
bun run build

# Run
bun start

# Test
bun test
```

### Git Workflow
```bash
# After each phase
git add .
git commit -m "Phase X: Description"

# Create feature branches if needed
git checkout -b feature/phase-name
```