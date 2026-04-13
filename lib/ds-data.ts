/**
 * VSP Design System — Component & Token Data
 * Extracted from Figma DLS file KzwbNKTQUkX6xnRSJhx411
 */

// === Navigation Structure ===
export interface NavSection {
  title: string
  items: NavItem[]
}

export interface NavItem {
  label: string
  href: string
  badge?: string
}

export const navigation: NavSection[] = [
  {
    title: 'Getting Started',
    items: [
      { label: 'Introduction', href: '/design-system' },
      { label: 'Design Principles', href: '/design-system/foundations/principles' },
    ],
  },
  {
    title: 'Foundations',
    items: [
      { label: 'Colors', href: '/design-system/foundations/colors' },
      { label: 'Typography', href: '/design-system/foundations/typography' },
      { label: 'Spacing', href: '/design-system/foundations/spacing' },
      { label: 'Radius', href: '/design-system/foundations/radius' },
      { label: 'Elevation', href: '/design-system/foundations/elevation' },
    ],
  },
  {
    title: 'Actions',
    items: [
      { label: 'Button', href: '/design-system/components/button' },
      { label: 'Button Group', href: '/design-system/components/button-group' },
      { label: 'Fixed Bottom', href: '/design-system/components/fixed-bottom' },
      { label: 'Glass Floating Bar', href: '/design-system/components/glass-floating-bar' },
      { label: 'Uploader', href: '/design-system/components/uploader' },
    ],
  },
  {
    title: 'Forms',
    items: [
      { label: 'Text Field', href: '/design-system/components/text-field' },
      { label: 'Text Area', href: '/design-system/components/text-area' },
      { label: 'Dropdown', href: '/design-system/components/dropdown' },
      { label: 'Search Bar', href: '/design-system/components/search-bar' },
      { label: 'Special TextField', href: '/design-system/components/special-text-field' },
      { label: 'PIN / SOTP', href: '/design-system/components/pin' },
      { label: 'DateField & Calendar', href: '/design-system/components/date-field' },
    ],
  },
  {
    title: 'Selections',
    items: [
      { label: 'Checkbox', href: '/design-system/components/checkbox' },
      { label: 'Radio', href: '/design-system/components/radio' },
      { label: 'Toggle', href: '/design-system/components/toggle' },
      { label: 'Chip', href: '/design-system/components/chip', badge: 'Soon' },
    ],
  },
  {
    title: 'Navigation',
    items: [
      { label: 'Header', href: '/design-system/components/header' },
      { label: 'Tab', href: '/design-system/components/tab' },
      { label: 'Pagination', href: '/design-system/components/pagination' },
    ],
  },
  {
    title: 'Feedback',
    items: [
      { label: 'Feedback State', href: '/design-system/components/feedback-state' },
      { label: 'Toast', href: '/design-system/components/toast' },
      { label: 'Inform Message', href: '/design-system/components/inform-message' },
    ],
  },
  {
    title: 'Modals',
    items: [
      { label: 'Dialog & Overlay', href: '/design-system/components/dialog' },
      { label: 'Sheet', href: '/design-system/components/sheet' },
      { label: 'Tooltips', href: '/design-system/components/tooltips' },
    ],
  },
  {
    title: 'Indicators',
    items: [
      { label: 'Badge', href: '/design-system/components/badge' },
      { label: 'Label', href: '/design-system/components/label' },
    ],
  },
  {
    title: 'Interface Elements',
    items: [
      { label: 'List Item', href: '/design-system/components/list-item' },
      { label: 'Section', href: '/design-system/components/section' },
      { label: 'T&C', href: '/design-system/components/terms' },
      { label: 'Device Element', href: '/design-system/components/device-element' },
    ],
  },
  {
    title: 'Support',
    items: [
      { label: 'Skeleton', href: '/design-system/components/skeleton' },
      { label: 'Image', href: '/design-system/components/image' },
      { label: 'Divider', href: '/design-system/components/divider' },
    ],
  },
  {
    title: 'Content & Language',
    items: [
      { label: 'Tone of Voice', href: '/design-system/content/tone-of-voice' },
      { label: 'Writing Guidelines', href: '/design-system/content/writing' },
      { label: 'Error Messages', href: '/design-system/content/errors' },
    ],
  },
  {
    title: 'Templates',
    items: [
      { label: 'Screen Structure', href: '/design-system/templates/screen-structure' },
      { label: 'Page Types', href: '/design-system/templates/page-types' },
    ],
  },
  {
    title: 'Patterns',
    items: [
      { label: 'Form Patterns', href: '/design-system/patterns/forms' },
      { label: 'Search & Filter', href: '/design-system/patterns/search' },
      { label: 'Empty States', href: '/design-system/patterns/empty-states' },
      { label: 'Loading States', href: '/design-system/patterns/loading' },
      { label: 'Error Handling', href: '/design-system/patterns/errors' },
      { label: 'Navigation Flow', href: '/design-system/patterns/navigation' },
      { label: 'Confirmation Flow', href: '/design-system/patterns/confirmation' },
      { label: 'Data Display', href: '/design-system/patterns/data-display' },
    ],
  },
]

// === Component Data ===
export interface ComponentProp {
  name: string
  type: string
  defaultValue?: string | boolean
  options?: string[]
}

export interface ComponentData {
  slug: string
  name: string
  description: string
  category: string
  figmaPage: string
  figmaNodeId?: string
  variants: number
  properties: ComponentProp[]
  variantList: string[]
  guidelines?: { do: string[]; dont: string[] }
  anatomy?: string[]
  relatedComponents?: string[]
  // New fields for full documentation
  whenToUse?: string[]
  whenNotToUse?: string[]
  states?: { name: string; description: string }[]
  accessibility?: {
    keyboard?: string[]
    aria?: string[]
    screenReader?: string[]
    focusManagement?: string[]
  }
  contentGuidelines?: string[]
  codeExample?: string
}

export const components: Record<string, ComponentData> = {
  'button': {
    slug: 'button',
    name: 'Button',
    description: 'Primary action button. Supports primary/secondary hierarchy, 48/32px sizes, default/danger types. One primary button per screen.',
    category: 'Actions',
    figmaPage: '❖ Button', figmaNodeId: '3666:2284',
    variants: 32,
    properties: [
      { name: 'hierarchy', type: 'VARIANT', defaultValue: 'primary', options: ['primary', 'secondary'] },
      { name: 'size', type: 'VARIANT', defaultValue: '48', options: ['48', '32'] },
      { name: 'state', type: 'VARIANT', defaultValue: 'enabled', options: ['enabled', 'disabled', 'loading', 'whilepressing'] },
      { name: 'type', type: 'VARIANT', defaultValue: 'default', options: ['default', 'danger'] },
      { name: 'Left icon', type: 'BOOLEAN', defaultValue: false },
    ],
    variantList: ['primary/48/enabled', 'primary/48/disabled', 'primary/48/loading', 'primary/32/enabled', 'secondary/48/enabled', 'secondary/32/enabled'],
    guidelines: {
      do: [
        'Use one primary button per screen',
        'Use secondary for less important actions',
        'Use danger type only for destructive actions (delete, cancel)',
        'Keep button labels short and action-oriented',
      ],
      dont: [
        'Don\'t use multiple primary buttons on the same screen',
        'Don\'t use danger type for non-destructive actions',
        'Don\'t use custom button divs — always use the component',
        'Don\'t put long sentences as button labels',
      ],
    },
    anatomy: ['Container (rounded-full)', 'Label text (Title/S 16px semibold)', 'Optional left icon (20px)', 'Loading spinner'],
    relatedComponents: ['Button Group', 'Fixed Bottom'],
    whenToUse: [
      'Use for any user-initiated action such as form submission, navigation, or confirmation.',
      'Use primary hierarchy for the single most important action on each screen.',
      'Use secondary hierarchy for supporting or dismissive actions alongside a primary button.',
      'Use size 32 for inline or compact contexts like cards, toasts, or table rows.',
      'Use danger type exclusively for irreversible or destructive operations (delete account, cancel contract).',
    ],
    whenNotToUse: [
      'Do not use for navigation links that do not trigger an action — use a text link or list item instead.',
      'Do not use for toggle or selection behavior — use Toggle, Checkbox, or Chip.',
      'Do not use a second primary button on the same screen — demote one to secondary.',
    ],
    states: [
      { name: 'enabled', description: 'Default interactive state; responds to tap and hover.' },
      { name: 'whilepressing', description: 'Active/pressed state; background layer shrinks inward to provide tactile feedback.' },
      { name: 'disabled', description: 'Non-interactive; reduced opacity via disabled-bg and disabled-fg tokens.' },
      { name: 'loading', description: 'Async action in progress; label replaced by spinner, pointer events blocked.' },
      { name: 'focus-visible', description: 'Keyboard focus ring (2px ring-ring with 1px offset) for accessibility navigation.' },
    ],
    accessibility: {
      keyboard: [
        'Enter or Space activates the button.',
        'Tab moves focus to the next focusable element; Shift+Tab moves backward.',
      ],
      aria: [
        'Use aria-disabled="true" instead of removing the button when contextually unavailable.',
        'Set aria-busy="true" during loading state to communicate progress to assistive technology.',
        'Add aria-label when the button contains only an icon and no visible text.',
      ],
      screenReader: [
        'Loading state announces "Loading" via the spinner\'s implicit role; pair with aria-live="polite" on the parent for status updates.',
        'Danger type has no semantic signal — prepend the label with a warning word (e.g., "Delete account") so intent is clear without color.',
      ],
      focusManagement: [
        'After an async action completes, move focus to the result feedback or next logical element.',
        'In dialogs, auto-focus the primary button on open; return focus to the trigger on close.',
      ],
    },
    contentGuidelines: [
      'Start labels with a verb in imperative form (e.g., "Confirm", "Transfer", "Cancel").',
      'Limit labels to 1-3 words; never exceed 24 characters.',
      'Do not use generic labels like "OK", "Yes", or "Click here" — be specific about the action.',
      'Danger button labels must name the destructive action explicitly (e.g., "Delete card", not "Continue").',
    ],
  },
  'button-group': {
    slug: 'button-group',
    name: 'Button Group',
    description: 'Groups 1-2 buttons in horizontal or vertical layout. Used inside Fixed Bottom or Dialog.',
    category: 'Actions',
    figmaPage: '❖ Button Group', figmaNodeId: '5152:159',
    variants: 4,
    properties: [
      { name: 'layout', type: 'VARIANT', defaultValue: 'Horizontal', options: ['Vertical', 'Horizontal'] },
      { name: 'secondary btn', type: 'BOOLEAN', defaultValue: true },
    ],
    variantList: ['Vertical', 'Horizontal', 'Single button', 'Double buttons'],
    guidelines: {
      do: ['Use inside Fixed Bottom for CTA areas', 'Primary + Secondary button combo'],
      dont: ['Don\'t stack more than 2 buttons', 'Don\'t use without a primary button'],
    },
    relatedComponents: ['Button', 'Fixed Bottom'],
  },
  'fixed-bottom': {
    slug: 'fixed-bottom',
    name: 'Fixed Bottom',
    description: 'Fixed bottom CTA area. Sticks to bottom of screen with safe area padding. Contains primary + secondary buttons.',
    category: 'Actions',
    figmaPage: '❖ Fixed Bottom', figmaNodeId: '5153:23717',
    variants: 2,
    properties: [],
    variantList: ['Default', 'With Keyboard'],
    guidelines: {
      do: ['Always use px-[22px] padding from edges', 'Include home indicator below', 'Use pt-[12px] pb-[16px] spacing'],
      dont: ['Don\'t place content below the Fixed Bottom', 'Don\'t remove safe area padding'],
    },
    anatomy: ['T&C checkbox (optional)', 'ButtonGroup (px-[22px])', 'Home indicator (pb safe area)'],
    relatedComponents: ['Button Group', 'Button'],
  },
  'glass-floating-bar': {
    slug: 'glass-floating-bar',
    name: 'Glass Floating Bar',
    description: 'Bottom navigation bar with glass blur effect. 4-5 tab items with active/inactive states.',
    category: 'Actions',
    figmaPage: '❖ Glass Floating Bar', figmaNodeId: '5153:39867',
    variants: 8,
    properties: [
      { name: 'Has main item', type: 'VARIANT', defaultValue: 'True', options: ['True', 'False'] },
      { name: 'Auto layout', type: 'VARIANT', defaultValue: 'Fill', options: ['Fill', 'Hug'] },
    ],
    variantList: ['With main item/Fill', 'With main item/Hug', 'Without main item/Fill', 'Without main item/Hug'],
    relatedComponents: ['Tab'],
  },
  'uploader': {
    slug: 'uploader',
    name: 'Uploader',
    description: 'File/image upload component. States: Empty, Uploaded. Can be disabled.',
    category: 'Actions',
    figmaPage: '❖ Uploader', figmaNodeId: '5152:622',
    variants: 3,
    properties: [
      { name: 'state', type: 'VARIANT', defaultValue: 'Empty', options: ['Empty', 'Uploaded'] },
      { name: 'Disabled', type: 'VARIANT', defaultValue: 'False', options: ['False', 'True'] },
    ],
    variantList: ['Empty', 'Uploaded', 'Disabled'],
  },
  'text-field': {
    slug: 'text-field',
    name: 'Text Field',
    description: 'Standard text input with label + helper text. Supports error state, icons, and required indicator.',
    category: 'Forms',
    figmaPage: '❖ Text Field', figmaNodeId: '3667:2522',
    variants: 16,
    properties: [
      { name: 'state', type: 'VARIANT', defaultValue: 'filled', options: ['filled', 'filled disabled', 'focus', 'outfocus', 'typing', 'outfocus disabled'] },
      { name: 'error', type: 'VARIANT', defaultValue: 'off', options: ['off', 'on'] },
      { name: 'Label', type: 'TEXT', defaultValue: 'Label' },
      { name: 'Content', type: 'TEXT', defaultValue: 'Content' },
      { name: 'icon', type: 'BOOLEAN', defaultValue: true },
      { name: 'helptext', type: 'BOOLEAN', defaultValue: true },
      { name: 'Required', type: 'BOOLEAN', defaultValue: false },
    ],
    variantList: ['outfocus', 'focus', 'typing', 'filled', 'disabled', 'error'],
    guidelines: {
      do: ['Always include a label', 'Show helper text for format requirements', 'Use error state with descriptive message'],
      dont: ['Don\'t use placeholder as label', 'Don\'t hide error messages'],
    },
    anatomy: ['Label (Title/XS 14px)', 'Input container (58px height, rounded-14)', 'Content text (Body/M 16px)', 'Helper text (Body/XS 12px)', 'Optional trailing icon', 'Optional required indicator'],
    relatedComponents: ['Text Area', 'Dropdown', 'Special TextField', 'Search Bar'],
    whenToUse: [
      'Use for any single-line text input: names, emails, phone numbers, addresses.',
      'Use with a label to clearly identify what data is expected.',
      'Use helper text to communicate format requirements or constraints before the user types.',
      'Use error state with an inline message to explain validation failures.',
      'Use leading/trailing icons to reinforce input purpose (e.g., search icon, visibility toggle).',
    ],
    whenNotToUse: [
      'Do not use for multi-line content — use Text Area instead.',
      'Do not use for selection from a predefined list — use Dropdown or Sheet picker.',
      'Do not use for large formatted amounts — use Special TextField with currency formatting.',
    ],
    states: [
      { name: 'outfocus', description: 'Default resting state; border uses border-border token, label visible.' },
      { name: 'focus', description: 'Input is focused but empty; border changes to brand-secondary (1.5px green).' },
      { name: 'typing', description: 'User is actively entering text; maintains focus border with live input.' },
      { name: 'filled', description: 'Input contains a value and is blurred; border returns to default.' },
      { name: 'filled-disabled', description: 'Input contains a value but is non-editable; uses disabled-bg and disabled-fg tokens.' },
      { name: 'outfocus-disabled', description: 'Empty and non-editable; shows disabled styling with no value.' },
      { name: 'error', description: 'Validation failed; border and helper text turn danger red, label also turns danger.' },
      { name: 'error-focus', description: 'Error state while input is focused; danger border persists so user sees the issue while correcting.' },
    ],
    accessibility: {
      keyboard: [
        'Tab moves focus into the input; Shift+Tab moves backward.',
        'Escape clears focus without changing the value when used in search contexts.',
      ],
      aria: [
        'Always associate the label with the input via htmlFor/id or aria-labelledby.',
        'Link helper text and error messages using aria-describedby on the input.',
        'Set aria-invalid="true" when the error state is active.',
        'Set aria-required="true" when the Required prop is enabled.',
      ],
      screenReader: [
        'Error messages are announced automatically when aria-describedby points to the error text element.',
        'Trailing icon actions (e.g., clear, reveal password) must have aria-label since they lack visible text.',
      ],
      focusManagement: [
        'On form submission error, move focus to the first field with a validation error.',
        'Auto-focus the first text field when a form screen mounts, unless a dialog or sheet is open.',
      ],
    },
    contentGuidelines: [
      'Labels must be short noun phrases (e.g., "Account number", "Full name") — never full sentences.',
      'Helper text should state the format or constraint (e.g., "10-digit number starting with 0").',
      'Error messages must describe the problem and suggest a fix (e.g., "Phone number must be 10 digits").',
      'Placeholder text is supplementary, not a replacement for labels — keep it as an example value.',
      'Do not use ALL CAPS in labels or helper text.',
    ],
  },
  'text-area': {
    slug: 'text-area',
    name: 'Text Area',
    description: 'Multi-line text input. Same state/error pattern as TextField.',
    category: 'Forms',
    figmaPage: '❖ Text Area', figmaNodeId: '5153:27418',
    variants: 7,
    properties: [
      { name: 'state', type: 'VARIANT', defaultValue: 'filled', options: ['filled', 'filled disabled', 'focus', 'outfocus', 'typing'] },
      { name: 'error', type: 'VARIANT', defaultValue: 'off', options: ['off', 'on'] },
    ],
    variantList: ['outfocus', 'focus', 'typing', 'filled', 'disabled', 'error'],
    relatedComponents: ['Text Field'],
  },
  'dropdown': {
    slug: 'dropdown',
    name: 'Dropdown',
    description: 'Select input with dropdown menu. Same states as TextField. Single selection from list.',
    category: 'Forms',
    figmaPage: '❖ Dropdown', figmaNodeId: '5153:26128',
    variants: 4,
    properties: [
      { name: 'state', type: 'VARIANT', defaultValue: 'filled disabled', options: ['filled disabled', 'focus', 'outfocus', 'filled'] },
      { name: 'error', type: 'VARIANT', defaultValue: 'off', options: ['off'] },
    ],
    variantList: ['outfocus', 'focus', 'filled', 'disabled'],
    relatedComponents: ['Text Field', 'Sheet'],
  },
  'search-bar': {
    slug: 'search-bar',
    name: 'Search Bar',
    description: 'Search input with magnifier icon. States: default, focus, typing, filled, outfocus.',
    category: 'Forms',
    figmaPage: '❖ Search Bar', figmaNodeId: '3667:3752',
    variants: 5,
    properties: [
      { name: 'state', type: 'VARIANT', defaultValue: 'default', options: ['default', 'focus', 'typing', 'filled', 'outfocus'] },
    ],
    variantList: ['default', 'focus', 'typing', 'filled', 'outfocus'],
    relatedComponents: ['Text Field', 'Header'],
  },
  'special-text-field': {
    slug: 'special-text-field',
    name: 'Special TextField',
    description: 'Formatted number input for amounts and phone numbers. Large display with currency formatting.',
    category: 'Forms',
    figmaPage: '❖ Special TextField', figmaNodeId: '3667:2995',
    variants: 5,
    properties: [
      { name: 'state', type: 'VARIANT', defaultValue: 'typing', options: ['typing', 'filled', 'focus', 'outfocus', 'error'] },
      { name: 'helpText', type: 'BOOLEAN', defaultValue: true },
    ],
    variantList: ['outfocus', 'focus', 'typing', 'filled', 'error'],
    relatedComponents: ['Text Field'],
  },
  'pin': {
    slug: 'pin',
    name: 'PIN / SOTP',
    description: 'PIN entry component. Supports hidden (dots) and visible (digits) modes. States: Inactive, Active, Typing, Error.',
    category: 'Forms',
    figmaPage: '❖ PIN / SOTP', figmaNodeId: '3666:3047',
    variants: 12,
    properties: [
      { name: 'state', type: 'VARIANT', defaultValue: 'Typing', options: ['Typing', 'Active', 'Default', 'Error', 'Inactive'] },
    ],
    variantList: ['Inactive', 'Active', 'Typing', 'Error', 'Hidden mode', 'Visible mode'],
    relatedComponents: ['Text Field'],
  },
  'date-field': {
    slug: 'date-field',
    name: 'DateField & Calendar',
    description: 'Date/time picker using native system selector. Supports day, month, year, and hour columns.',
    category: 'Forms',
    figmaPage: '❖ DateField & Calendar', figmaNodeId: '5153:27889',
    variants: 11,
    properties: [
      { name: 'hour', type: 'VARIANT', defaultValue: 'True', options: ['False', 'True'] },
      { name: 'day', type: 'VARIANT', defaultValue: 'True', options: ['True', 'False'] },
      { name: 'month', type: 'VARIANT', defaultValue: 'True', options: ['True', 'False'] },
      { name: 'year', type: 'VARIANT', defaultValue: 'True', options: ['True', 'False'] },
    ],
    variantList: ['Date only', 'Date + Time', 'Month + Year', 'Full'],
  },
  'checkbox': {
    slug: 'checkbox',
    name: 'Checkbox',
    description: 'Multi-selection control. Supports checkmark and indeterminate types. Can be disabled.',
    category: 'Selections',
    figmaPage: '❖ Checkbox / Radio / Toggle', figmaNodeId: '5122:8123',
    variants: 6,
    properties: [
      { name: 'Checked', type: 'VARIANT', defaultValue: 'False', options: ['False', 'True'] },
      { name: 'type', type: 'VARIANT', defaultValue: '[All type]', options: ['[All type]', 'Checkmark', 'Indeterminate'] },
      { name: 'Disabled', type: 'VARIANT', defaultValue: 'False', options: ['False', 'True'] },
    ],
    variantList: ['Unchecked', 'Checked', 'Indeterminate', 'Disabled'],
    guidelines: {
      do: ['Use for multiple selections', 'Group related options together'],
      dont: ['Don\'t use for single on/off — use Toggle instead'],
    },
    relatedComponents: ['Radio', 'Toggle'],
    whenToUse: [
      'Use for multi-selection scenarios where the user can pick zero or more options from a list.',
      'Use for terms and conditions acceptance before proceeding to a CTA.',
      'Use for settings screens where multiple preferences can be enabled simultaneously.',
      'Use for filter panels where multiple criteria can be applied at once.',
    ],
    whenNotToUse: [
      'Do not use for mutually exclusive choices — use Radio instead.',
      'Do not use for binary on/off settings — use Toggle instead.',
      'Do not use as a standalone action trigger — checkboxes represent state, not actions.',
    ],
    states: [
      { name: 'unchecked', description: 'Default idle state; empty box with border-bold stroke on background surface.' },
      { name: 'checked', description: 'Active state; filled with primary background and checkmark icon in primary-foreground.' },
      { name: 'indeterminate', description: 'Partial selection state; minus icon indicates that some but not all child items are selected.' },
      { name: 'disabled', description: 'Non-interactive state; uses disabled-bg background with disabled-fg icon color. Pointer events blocked.' },
      { name: 'focus-visible', description: 'Keyboard focus ring (2px ring-ring with 1px offset) for accessibility navigation.' },
    ],
    accessibility: {
      keyboard: [
        'Space toggles the checked state.',
        'Tab moves focus to the next focusable element; Shift+Tab moves backward.',
      ],
      aria: [
        'Uses role="checkbox" with aria-checked="true", "false", or "mixed" for indeterminate.',
        'Provide aria-label when no visible adjacent label text exists.',
        'When used in a group, wrap with role="group" and aria-labelledby pointing to the group heading.',
      ],
      screenReader: [
        'State change is announced automatically via the native aria-checked attribute update.',
        'Indeterminate state announces "mixed" — ensure the surrounding context explains what partial selection means.',
      ],
      focusManagement: [
        'In a checkbox group, each checkbox receives independent tab focus (not arrow-key roving).',
        'After toggling, focus remains on the checkbox to allow continued interaction.',
      ],
    },
    contentGuidelines: [
      'Label text must be a positive statement describing what enabling the option does (e.g., "Receive email notifications").',
      'Avoid negative phrasing (e.g., "Do not send emails") — it creates a double-negative when unchecked.',
      'Keep labels to a single line; use helper text below the group for additional explanation.',
      'For T&C checkboxes, use a linked text pattern: "I agree to the [Terms & Conditions]".',
    ],
  },
  'radio': {
    slug: 'radio',
    name: 'Radio',
    description: 'Single selection from a group. On/Off states with enabled/disabled support. Size: 24px.',
    category: 'Selections',
    figmaPage: '❖ Checkbox / Radio / Toggle', figmaNodeId: '5122:8123',
    variants: 4,
    properties: [
      { name: 'selected', type: 'VARIANT', defaultValue: 'On', options: ['On', 'Off'] },
      { name: 'state', type: 'VARIANT', defaultValue: 'enabled', options: ['enabled', 'disabled'] },
    ],
    variantList: ['Selected', 'Unselected', 'Disabled selected', 'Disabled unselected'],
    relatedComponents: ['Checkbox', 'Toggle'],
  },
  'toggle': {
    slug: 'toggle',
    name: 'Toggle',
    description: 'On/off switch for settings. Size: 32x52px with rounded-full shape.',
    category: 'Selections',
    figmaPage: '❖ Checkbox / Radio / Toggle', figmaNodeId: '5122:8123',
    variants: 4,
    properties: [
      { name: 'turnOn', type: 'VARIANT', defaultValue: 'On', options: ['On', 'Off'] },
      { name: 'state', type: 'VARIANT', defaultValue: 'enabled', options: ['enabled', 'disabled'] },
    ],
    variantList: ['On/Enabled', 'Off/Enabled', 'On/Disabled', 'Off/Disabled'],
    relatedComponents: ['Checkbox', 'Radio'],
  },
  'chip': {
    slug: 'chip',
    name: 'Chip',
    description: 'Compact element for filters, tags, or selections. Coming soon.',
    category: 'Selections',
    figmaPage: '❖ Chip', figmaNodeId: '5153:36048',
    variants: 0,
    properties: [],
    variantList: [],
  },
  'header': {
    slug: 'header',
    name: 'Header',
    description: 'Top navigation bar. Variants: Large Title (top-level screens), Default (sub-pages). Back button uses ChevronLeft.',
    category: 'Navigation',
    figmaPage: '❖ Header', figmaNodeId: '3666:2962',
    variants: 11,
    properties: [
      { name: 'state', type: 'VARIANT', defaultValue: 'Default', options: ['Large Title', 'Default', 'VP_Header'] },
      { name: 'tabs', type: 'BOOLEAN', defaultValue: false },
      { name: 'description', type: 'BOOLEAN', defaultValue: true },
      { name: 'SearchBar', type: 'BOOLEAN', defaultValue: false },
      { name: 'progress bar', type: 'BOOLEAN', defaultValue: false },
    ],
    variantList: ['Large Title', 'Default', 'VP_Header', 'With tabs', 'With search', 'With progress'],
    guidelines: {
      do: [
        'Use Large Title for main/top-level screens',
        'Use Default for sub-pages with back navigation',
        'Always use ChevronLeft for back — never ArrowLeft',
        'Large Title variant: page name goes in largeTitle, NOT title',
      ],
      dont: [
        'Don\'t use ArrowLeft icons for back navigation',
        'Don\'t put page name in title slot for Large Title variant',
      ],
    },
    anatomy: ['Status Bar (54px)', 'Navigation Bar (56px)', 'Optional Search Bar', 'Optional Tab Bar', 'Optional Progress Bar'],
    relatedComponents: ['Tab', 'Search Bar'],
    whenToUse: [
      'Use at the top of every screen as the primary navigation landmark.',
      'Use Large Title variant for top-level screens (home, dashboard, account) where the page name is prominent.',
      'Use Default variant for sub-pages with back navigation and a compact inline title.',
      'Use VP_Header variant only for ViettelPay-branded screens that require the custom status bar.',
      'Enable tabs prop when the screen contains multiple peer content sections switchable without navigation.',
    ],
    whenNotToUse: [
      'Do not use Header for modal or sheet titles — use the Dialog or Sheet component title slot instead.',
      'Do not use Header inside scrollable content — it must remain fixed at the top of the viewport.',
      'Do not use Default variant for top-level screens — use Large Title to establish hierarchy.',
    ],
    states: [
      { name: 'default', description: 'Standard nav bar with optional title, back button, and trailing actions.' },
      { name: 'large-title', description: 'Expanded header with 24px bold title below the nav bar; nav bar itself is icon-only.' },
      { name: 'vp-header', description: 'ViettelPay-branded variant with custom 54px status bar.' },
      { name: 'with-search', description: 'Search bar appended below the nav bar; input is initially collapsed as a pill.' },
      { name: 'with-tabs', description: 'Tab bar appended below the nav bar (or search bar) with underline active indicator.' },
      { name: 'with-progress', description: 'Progress bar appended to indicate step completion in multi-step flows.' },
      { name: 'search-focused', description: 'Search bar is focused; keyboard is open, optional cancel action appears.' },
      { name: 'tab-active', description: 'One tab is selected; 2.5px underline indicator and foreground text color applied.' },
      { name: 'scrolled', description: 'When paired with scroll, Large Title collapses into Default with inline title (implementation-level).' },
    ],
    accessibility: {
      keyboard: [
        'Tab key moves focus through back button, trailing actions, search input, and tab items in DOM order.',
        'Arrow Left/Right navigates between tab items when the tab bar has focus.',
        'Enter or Space activates the focused tab or action button.',
        'Escape closes the search bar when focused and returns focus to the previous element.',
      ],
      aria: [
        'The header landmark should use role="banner" or be placed inside a <header> element.',
        'Tab bar must use role="tablist" with each tab using role="tab" and aria-selected.',
        'Back button must have aria-label="Go back" since it contains only an icon.',
        'Trailing icon buttons must have aria-label describing their action (e.g., "Notifications", "Settings").',
      ],
      screenReader: [
        'Large title text is the first heading-level content on the page; consider using an h1 element or aria-level="1".',
        'Active tab is communicated via aria-selected="true"; screen readers announce "selected" automatically.',
        'Search bar placeholder is read as the input label; ensure it is descriptive (e.g., "Search transactions").',
      ],
      focusManagement: [
        'When navigating back, restore focus to the element that triggered the forward navigation.',
        'When search bar opens, auto-focus the search input.',
        'When switching tabs, move focus to the newly selected tab panel content.',
      ],
    },
    contentGuidelines: [
      'Title text must be 1-3 words that name the current screen (e.g., "Transfer", "Account details").',
      'Large title can be longer but must remain a single line — truncate with ellipsis if needed.',
      'Description below large title should be a single sentence providing context, not instructions.',
      'Tab labels must be 1-2 words; avoid verbs — use nouns (e.g., "History", "Settings", not "View history").',
      'Search placeholder must hint at searchable content (e.g., "Search by name or account number").',
    ],
  },
  'tab': {
    slug: 'tab',
    name: 'Tab',
    description: 'Content switching tabs. Primary (underline indicator) and Secondary (pill style). Sizes: 40/32px.',
    category: 'Navigation',
    figmaPage: '❖ Tab', figmaNodeId: '3666:3043',
    variants: 8,
    properties: [
      { name: 'size', type: 'VARIANT', defaultValue: '40', options: ['40', '32'] },
    ],
    variantList: ['Primary/40', 'Primary/32', 'Secondary/40', 'Secondary/32'],
    relatedComponents: ['Header'],
    whenToUse: [
      'Switch between related content sections on the same page (e.g., "All", "Pending", "Completed" transactions)',
      'Filter a single dataset by category without navigating away',
      'Segment a form or settings page into logical groups',
      'Pair with Header component for top-level page navigation within a feature',
    ],
    whenNotToUse: [
      'Global app navigation — use Glass Floating Bar (bottom nav) instead',
      'Nested tabs inside another tab group — restructure the information architecture',
      'More than 5 tab items — use a scrollable horizontal list or Sheet picker',
      'Binary toggle between two states — use Toggle or segmented control instead',
      'Filtering that combines multiple criteria — use Chip filters instead',
    ],
    states: [
      { name: 'Active', description: 'Currently selected tab with underline indicator (2.5px) or pill fill' },
      { name: 'Inactive', description: 'Unselected tab with muted label, no indicator' },
      { name: 'With Badge', description: 'Tab label accompanied by a Badge for unread counts or status' },
      { name: 'With Icon', description: 'Tab with a leading icon for quick visual identification' },
      { name: 'Scrollable', description: 'Horizontal scroll enabled when tabs overflow the viewport width' },
      { name: 'Disabled', description: 'Tab is visible but not interactive, used for upcoming or locked features' },
    ],
    accessibility: {
      keyboard: [
        'Arrow Left/Right moves focus between tabs',
        'Enter or Space activates the focused tab',
        'Home moves focus to the first tab; End moves to the last tab',
      ],
      aria: [
        'Tab list container has role="tablist"',
        'Each tab has role="tab" with aria-selected="true|false"',
        'Each panel has role="tabpanel" linked via aria-labelledby',
        'Disabled tabs have aria-disabled="true"',
      ],
      screenReader: [
        'Announce "Tab N of M" position when focused',
        'Announce badge count when present (e.g., "Pending, 3 new")',
      ],
      focusManagement: [
        'Only the active tab is in the natural tab order (roving tabindex)',
        'Arrow keys move focus without activating — Enter/Space activates',
      ],
    },
    contentGuidelines: [
      'Labels: 1-2 words maximum (e.g., "All", "Pending", "History")',
      'Use sentence case, not ALL CAPS',
      'Keep the number of tabs between 2 and 5 for scannability',
      'Order tabs by frequency of use, most common first',
      'Badge counts should update in real time when data changes',
    ],
  },
  'pagination': {
    slug: 'pagination',
    name: 'Pagination',
    description: 'Dot pagination indicator for carousels and onboarding flows.',
    category: 'Navigation',
    figmaPage: '❖ Pagination', figmaNodeId: '5155:7979',
    variants: 6,
    properties: [
      { name: 'position', type: 'VARIANT', defaultValue: 'Begin', options: ['Begin', 'End', 'Middle'] },
    ],
    variantList: ['Begin', 'Middle', 'End'],
  },
  'feedback-state': {
    slug: 'feedback-state',
    name: 'Feedback State',
    description: 'Full-screen result/status page. Types: Success, Fail, In Progress. Shows illustration + message + CTA buttons.',
    category: 'Feedback',
    figmaPage: '❖ Feedback State', figmaNodeId: '3844:2090',
    variants: 3,
    properties: [
      { name: 'type', type: 'VARIANT', defaultValue: 'Thành công', options: ['Fail', 'In progress', 'Thành công'] },
    ],
    variantList: ['Success', 'Fail', 'In Progress'],
    relatedComponents: ['Button Group'],
  },
  'toast': {
    slug: 'toast',
    name: 'Toast',
    description: 'Brief notification that auto-dismisses after 3 seconds. Types: Default, Error, Success.',
    category: 'Feedback',
    figmaPage: '❖ Toast', figmaNodeId: '3667:3627',
    variants: 3,
    properties: [
      { name: 'type', type: 'VARIANT', defaultValue: 'Default', options: ['Default', 'Error', 'Success'] },
      { name: 'textButton', type: 'BOOLEAN', defaultValue: true },
      { name: 'description', type: 'BOOLEAN', defaultValue: true },
    ],
    variantList: ['Default', 'Error', 'Success'],
    whenToUse: [
      'Confirm a completed action without interrupting the user flow (e.g., "Link copied", "Settings saved")',
      'Report transient errors that do not require explicit user action (e.g., "Network unavailable")',
      'Provide success feedback for background operations (e.g., "Bank account linked successfully")',
      'Nudge the user with an optional inline action (e.g., "Transaction failed — Retry")',
    ],
    whenNotToUse: [
      'Decisions that require user input — use Dialog instead',
      'Persistent warnings that must remain visible — use Inform Message instead',
      'Content longer than two lines of text — use Dialog or Inform Message',
      'Critical errors that block the user from proceeding — use Feedback State or Dialog',
      'Stacking more than three toasts simultaneously — consolidate or use a notification center',
    ],
    states: [
      { name: 'Default', description: 'Dark background toast for neutral confirmations and informational messages' },
      { name: 'Error', description: 'Rose/red tinted toast for error feedback with foreground text' },
      { name: 'Success', description: 'Green tinted toast for positive confirmation with foreground text' },
    ],
    accessibility: {
      aria: [
        'Container has role="status" and aria-live="polite" for non-critical messages',
        'Error toasts use aria-live="assertive" to interrupt screen reader output',
        'Dismiss button has aria-label="Dismiss notification"',
      ],
      screenReader: [
        'Announce title and body text when the toast appears',
        'Announce action label if present so users know an action is available',
      ],
      keyboard: [
        'Action button is focusable via Tab',
        'Dismiss button is focusable via Tab',
        'Enter or Space activates the focused action or dismiss button',
      ],
      focusManagement: [
        'Toast does not steal focus from the current element',
        'Focus remains on the user\'s current context during auto-dismiss',
      ],
    },
    contentGuidelines: [
      'Title: Maximum 5 words, describe the outcome (e.g., "Payment sent")',
      'Body: Optional, one sentence of additional context',
      'Action label: Short verb phrase (e.g., "Undo", "Retry", "View")',
      'Avoid exclamation marks and all-caps — keep tone calm and factual',
      'Match toast type to semantic meaning: success for positive, error for negative, default for neutral',
    ],
  },
  'inform-message': {
    slug: 'inform-message',
    name: 'Inform Message',
    description: 'Inline alert/banner. Hierarchy: primary (filled background), secondary (outline). Types: Warning, Success, Error.',
    category: 'Feedback',
    figmaPage: '❖ Inform Message', figmaNodeId: '3667:3550',
    variants: 5,
    properties: [
      { name: 'hierarchy', type: 'VARIANT', defaultValue: 'secondary', options: ['secondary', 'primary', 'Warning', 'Success', 'Error'] },
      { name: 'button', type: 'BOOLEAN', defaultValue: true },
      { name: 'icon', type: 'BOOLEAN', defaultValue: true },
    ],
    variantList: ['Primary', 'Secondary', 'Warning', 'Success', 'Error'],
    relatedComponents: ['Toast'],
  },
  'dialog': {
    slug: 'dialog',
    name: 'Dialog & Overlay',
    description: 'Modal dialog for confirmations and alerts. Types: Icon, Image, Default. Max 2 buttons.',
    category: 'Modals',
    figmaPage: '❖ Dialog & Overlay', figmaNodeId: '3666:3044',
    variants: 7,
    properties: [
      { name: 'type', type: 'VARIANT', defaultValue: 'Image', options: ['Icon', 'Image', 'default'] },
      { name: 'Title', type: 'TEXT', defaultValue: 'Title' },
      { name: 'Description', type: 'TEXT', defaultValue: 'Description' },
    ],
    variantList: ['Icon', 'Image', 'Default', 'Warning', 'Error', 'Verify', 'Info'],
    relatedComponents: ['Sheet', 'Button Group'],
    whenToUse: [
      'Confirm destructive actions such as account deletion, transaction cancellation, or data removal',
      'Display critical alerts that require immediate user acknowledgment before proceeding',
      'Present success or error feedback that needs explicit dismissal (e.g., payment confirmed)',
      'Request user verification before irreversible operations (e.g., biometric prompt)',
      'Show promotional or onboarding content with an image header and a single CTA',
    ],
    whenNotToUse: [
      'Non-blocking feedback — use Toast instead',
      'Content selection or form input — use Sheet instead',
      'Long-form content that requires scrolling — use a dedicated page or Sheet',
      'Stacking multiple dialogs — restructure the flow so only one dialog appears at a time',
      'Passive informational messages that do not require action — use Inform Message',
    ],
    states: [
      { name: 'Default', description: 'Text-only dialog with title, description, and up to two action buttons' },
      { name: 'Icon', description: 'Dialog with a 36px icon slot above the title for semantic context (warning, error, success)' },
      { name: 'Image', description: 'Dialog with an 80px image banner at the top for promotional or illustrative content' },
      { name: 'Warning', description: 'Icon variant with a warning icon and cautionary messaging' },
      { name: 'Error', description: 'Icon variant with an error icon for failure or critical issue communication' },
      { name: 'Verify', description: 'Confirmation dialog requiring explicit user verification before proceeding' },
      { name: 'Info', description: 'Informational dialog for non-critical announcements or guidance' },
    ],
    accessibility: {
      keyboard: [
        'Escape key closes the dialog and returns focus to the trigger element',
        'Tab key cycles through focusable elements within the dialog (focus trap)',
        'Enter or Space activates the focused button',
      ],
      aria: [
        'Container has role="dialog" and aria-modal="true"',
        'Title is linked via aria-labelledby',
        'Description is linked via aria-describedby',
        'Close button has aria-label="Close dialog"',
      ],
      screenReader: [
        'Announce dialog title and description when opened',
        'Announce button labels and their destructive intent when applicable',
      ],
      focusManagement: [
        'Move focus to the first focusable element (typically primary button) on open',
        'Return focus to the trigger element on close',
        'Trap focus inside the dialog while open',
      ],
    },
    contentGuidelines: [
      'Title: 1-5 words, state the action or outcome clearly (e.g., "Delete account?")',
      'Description: 1-2 sentences explaining consequences or context',
      'Primary button: Use an action verb matching the title (e.g., "Delete", "Confirm")',
      'Secondary button: Use "Cancel" or "Go back" — never repeat the primary label',
      'Destructive actions: Use danger button type for the primary action',
      'Avoid technical jargon — write at a Grade 8 reading level',
    ],
  },
  'sheet': {
    slug: 'sheet',
    name: 'Sheet',
    description: 'Bottom sheet modal. Slides up from bottom. Supports scrollable content, grabber handle, and close button.',
    category: 'Modals',
    figmaPage: '❖ Sheet', figmaNodeId: '3667:3685',
    variants: 10,
    properties: [],
    variantList: ['Default', 'With grabber', 'Full height', 'With close', 'Scrollable'],
    relatedComponents: ['Dialog'],
    whenToUse: [
      'Use for selection lists that exceed 5 items (e.g., bank selection, province picker).',
      'Use for filter panels with multiple criteria that need a dedicated surface.',
      'Use for confirmation flows that require more context than a Dialog can hold.',
      'Use for detail views that overlay the current screen without full navigation (e.g., transaction detail preview).',
      'Use the grabber variant when the sheet should be draggable to expand or dismiss.',
    ],
    whenNotToUse: [
      'Do not use for simple yes/no confirmations — use Dialog instead.',
      'Do not use for brief notifications or feedback — use Toast instead.',
      'Do not use for full-page forms — navigate to a dedicated screen instead.',
      'Do not use for content that requires its own navigation stack — use a full-screen page.',
      'Do not nest a Sheet inside another Sheet — restructure the flow into sequential steps.',
    ],
    states: [
      { name: 'closed', description: 'Sheet is not visible; overlay and content are unmounted or hidden.' },
      { name: 'opening', description: 'Sheet slides up from the bottom edge with a spring animation (500ms ease-in-out).' },
      { name: 'open', description: 'Sheet is fully visible with overlay backdrop (black/50). Content is interactive.' },
      { name: 'scrollable', description: 'Content exceeds visible height; internal scroll is enabled while the sheet position remains fixed.' },
      { name: 'closing', description: 'Sheet slides down and overlay fades out (300ms ease-in-out). Focus returns to trigger.' },
      { name: 'full-height', description: 'Sheet expands to near-full screen height, leaving only the status bar visible.' },
    ],
    accessibility: {
      keyboard: [
        'Escape closes the sheet and returns focus to the trigger element.',
        'Tab cycles through focusable elements within the sheet (focus trap).',
        'Shift+Tab moves focus backward through sheet content.',
      ],
      aria: [
        'Container uses role="dialog" and aria-modal="true" via Radix Dialog primitive.',
        'Title is linked via aria-labelledby for screen reader announcement on open.',
        'Description, when present, is linked via aria-describedby.',
        'Close button includes aria-label="Close" with sr-only visible text.',
      ],
      screenReader: [
        'Sheet title and description are announced when the sheet opens.',
        'List items within the sheet should each be individually labeled for selection context.',
        'Closing the sheet announces nothing — focus return to trigger provides implicit context.',
      ],
      focusManagement: [
        'On open, focus moves to the first focusable element inside the sheet (close button or first interactive item).',
        'On close, focus returns to the element that triggered the sheet.',
        'Focus is trapped within the sheet while it is open — background content is inert.',
      ],
    },
    contentGuidelines: [
      'Title: 1-4 words describing the sheet purpose (e.g., "Select bank", "Filter transactions").',
      'Include a close button (X icon) or grabber handle so the dismiss affordance is always visible.',
      'For selection lists, highlight the currently selected item with a checkmark or active state.',
      'Keep the sheet height proportional to content — do not force full height for short lists.',
      'When the sheet contains a CTA, place it in the SheetFooter with px-[22px] padding.',
    ],
  },
  'tooltips': {
    slug: 'tooltips',
    name: 'Tooltips',
    description: 'Contextual hint popup. Themes: Default, Inverse. 12 position options (Top, Bottom, Left, Right + corners).',
    category: 'Modals',
    figmaPage: '❖ Tooltips', figmaNodeId: '5677:465',
    variants: 24,
    properties: [
      { name: 'theme', type: 'VARIANT', defaultValue: 'Default', options: ['Default', 'Inverse'] },
      { name: 'position', type: 'VARIANT', defaultValue: 'Top', options: ['Top', 'Top Left', 'Top Right', 'Bottom', 'Bottom Left', 'Bottom Right', 'Left', 'Left Top', 'Left Bottom', 'Right', 'Right Top', 'Right Bottom'] },
    ],
    variantList: ['Default/Top', 'Default/Bottom', 'Inverse/Top', 'Inverse/Bottom', '...12 positions x 2 themes'],
  },
  'badge': {
    slug: 'badge',
    name: 'Badge',
    description: 'Small status indicator. Used on icons, tabs, or list items to show counts or status.',
    category: 'Indicators',
    figmaPage: '❖ Badge', figmaNodeId: '5155:9369',
    variants: 6,
    properties: [],
    variantList: ['Number', 'Dot', 'Icon', 'Small', 'Medium', 'Large'],
    whenToUse: [
      'Use to display unread notification counts on tab bar icons or list items.',
      'Use the dot variant as a minimal presence indicator when exact count is unnecessary.',
      'Use semantic variants (success, warning, danger, info) for status classification on list rows or cards.',
      'Use inside tab labels to indicate the number of items within each category.',
    ],
    whenNotToUse: [
      'Do not use for actionable labels or tags — use Label or Chip instead.',
      'Do not use for large amounts of text — badges are limited to short counts or single words.',
      'Do not use danger badge as the sole error indicator — pair it with an error message or Inform Message.',
      'Do not stack multiple badges on a single element — consolidate into one badge with the most relevant status.',
    ],
    states: [
      { name: 'default', description: 'Neutral badge with secondary background and foreground text; used for counts and non-semantic labels.' },
      { name: 'success', description: 'Green-tinted badge for positive status (e.g., "Active", "Completed").' },
      { name: 'warning', description: 'Yellow-tinted badge for caution states (e.g., "Pending", "Expiring").' },
      { name: 'danger', description: 'Red-tinted badge for error or urgent states (e.g., "Failed", "Overdue").' },
      { name: 'info', description: 'Blue-tinted badge for informational context (e.g., "New", "Updated").' },
      { name: 'dot', description: 'Minimal 6px dot indicator without text; signals presence of new content.' },
    ],
    accessibility: {
      keyboard: [
        'Badges are non-interactive and do not receive focus.',
        'When a badge decorates an interactive element (e.g., tab), the parent element receives focus.',
      ],
      aria: [
        'Add aria-label or aria-describedby on the parent element to convey the badge count (e.g., "Notifications, 3 unread").',
        'Dot badges must have aria-hidden="true" since they convey no text; the status must be communicated through the parent label.',
        'For status badges, ensure the status meaning is available in the parent text, not only in color.',
      ],
      screenReader: [
        'Notification count badges should be announced as part of the parent element label (e.g., "Messages tab, 5 new").',
        'Status badges should have their text read as part of the row context (e.g., "Transfer to Nguyen Van A, Completed").',
      ],
    },
    contentGuidelines: [
      'Number badges: display the raw count up to 99; use "99+" for counts exceeding 99.',
      'Status text: use one word or a short phrase (e.g., "Active", "Pending review").',
      'Match variant to semantic meaning: success for positive, warning for caution, danger for error, info for neutral-informational.',
      'Do not use badge text as a call to action — badges are read-only indicators.',
    ],
  },
  'label': {
    slug: 'label',
    name: 'Label',
    description: 'Status label/tag component. Used for transaction status, categories, or classification.',
    category: 'Indicators',
    figmaPage: '❖ Label', figmaNodeId: '5120:14898',
    variants: 6,
    properties: [],
    variantList: ['Default', 'Success', 'Warning', 'Error', 'Info', 'Neutral'],
  },
  'list-item': {
    slug: 'list-item',
    name: 'List Item',
    description: 'Configurable list row. Supports leading icon, title + subtitle, trailing content. Height: 44-72px.',
    category: 'Interface Elements',
    figmaPage: '❖ List Item', figmaNodeId: '3666:3046',
    variants: 14,
    properties: [],
    variantList: ['Single line', 'Two line', 'With icon', 'With avatar', 'With action', 'With chevron'],
    guidelines: {
      do: ['Use consistent height within a list group', 'Right-align metadata/values'],
      dont: ['Don\'t center body text in list items', 'Don\'t mix different list item heights in the same group'],
    },
    relatedComponents: ['Section', 'Divider'],
    whenToUse: [
      'Display a navigable list of settings, preferences, or menu options',
      'Render transaction history or activity log entries',
      'Show contact or recipient lists with avatar, name, and metadata',
      'Present selectable options where each row triggers a detail view or action',
      'Build data-dense lists with trailing values, badges, or toggle switches',
    ],
    whenNotToUse: [
      'Card-style content with images or rich media — use a custom card layout',
      'Grid or gallery layouts — List Item is strictly single-column',
      'Interactive forms with multiple inputs per row — use dedicated form components',
      'Content that requires wrapping or variable-height rows within the same group',
      'Standalone call-to-action — use Button instead',
    ],
    states: [
      { name: 'Single line', description: 'Title only, height 44px. Used for simple navigation or settings rows' },
      { name: 'Two line', description: 'Title + subtitle, height 56-72px. Used for transactions, contacts, or enriched rows' },
      { name: 'With icon', description: 'Leading icon (24px) for category or type identification' },
      { name: 'With avatar', description: 'Leading avatar (40px circle) for people, contacts, or merchants' },
      { name: 'With action', description: 'Trailing interactive element: Toggle, Badge, or text button' },
      { name: 'With chevron', description: 'Trailing ChevronRight indicating the row navigates to a detail screen' },
      { name: 'Pressed', description: 'Visual feedback on tap with subtle background fill' },
      { name: 'Disabled', description: 'Reduced opacity, non-interactive state for locked or unavailable items' },
      { name: 'Selected', description: 'Checkmark or highlighted state for selection lists' },
    ],
    accessibility: {
      keyboard: [
        'Enter or Space activates the list item (navigation or toggle)',
        'Arrow Up/Down moves focus between list items',
        'Tab moves focus to the trailing interactive element if present',
      ],
      aria: [
        'Container has role="list" on the parent, role="listitem" on each row',
        'Navigable rows use role="link" or wrap in an anchor element',
        'Toggle trailing elements retain their own role="switch" semantics',
        'Disabled items have aria-disabled="true"',
      ],
      screenReader: [
        'Announce title, subtitle, and trailing value as a single coherent label',
        'Announce trailing badge count (e.g., "Notifications, 5 unread")',
        'Announce chevron as "Opens detail" or equivalent navigation hint',
      ],
      focusManagement: [
        'Focus ring is visible on the entire row, not just the trailing element',
        'Trailing toggle can receive independent focus for keyboard operation',
      ],
    },
    contentGuidelines: [
      'Title: Concise noun or noun phrase, sentence case (e.g., "Linked accounts")',
      'Subtitle: Supporting detail — date, status, or secondary label',
      'Trailing value: Right-aligned, use Body/S for secondary data and Title/XS for primary amounts',
      'Keep rows within the same group at a consistent height',
      'Use Divider between items, not borders on the List Item itself',
      'Trailing chevron implies navigation — do not add it to non-navigable rows',
    ],
  },
  'section': {
    slug: 'section',
    name: 'Section',
    description: 'Content section with title. Follows the VSP _Section v1 template. Title spacing: pt-24 pb-12.',
    category: 'Interface Elements',
    figmaPage: '❖ Section', figmaNodeId: '4438:1587',
    variants: 13,
    properties: [],
    variantList: ['Default', 'With subtitle', 'With action', 'With label', 'Collapsible'],
    guidelines: {
      do: [
        'Always use px-[22px] for section padding',
        'Section title: pt-[24px] pb-[12px]',
        'Use Title/S (16px semibold) for section titles',
      ],
      dont: [
        'Don\'t use borders to separate sections',
        'Don\'t use different padding values',
      ],
    },
    anatomy: ['Section title (pt-24 pb-12, px-[22px])', 'Optional suffix label', 'Section content (px-[22px])'],
    relatedComponents: ['List Item', 'Divider'],
  },
  'terms': {
    slug: 'terms',
    name: 'T&C',
    description: 'Terms and conditions checkbox. Used above CTA buttons in Fixed Bottom area.',
    category: 'Interface Elements',
    figmaPage: '❖ T&C',
    variants: 2,
    properties: [],
    variantList: ['Unchecked', 'Checked'],
    relatedComponents: ['Checkbox', 'Fixed Bottom'],
  },
  'device-element': {
    slug: 'device-element',
    name: 'Device Element',
    description: 'Native device UI elements: Status Bar (54px), Home Indicator, iOS keyboards, biometric prompts.',
    category: 'Interface Elements',
    figmaPage: '❖ Device Element',
    variants: 51,
    properties: [],
    variantList: ['Status Bar', 'Home Indicator', 'Keyboard', 'Touch ID', 'Face ID'],
  },
  'skeleton': {
    slug: 'skeleton',
    name: 'Skeleton',
    description: 'Loading placeholder. Shows content structure before data loads.',
    category: 'Support',
    figmaPage: '❖ Skeleton', figmaNodeId: '5539:13848',
    variants: 0,
    properties: [],
    variantList: ['Default'],
  },
  'image': {
    slug: 'image',
    name: 'Image',
    description: 'Image component with aspect ratio control and placeholder support.',
    category: 'Support',
    figmaPage: '❖ Image', figmaNodeId: '5867:397',
    variants: 26,
    properties: [],
    variantList: ['1:1', '4:3', '16:9', 'Free', 'Circle', 'Rounded'],
  },
  'divider': {
    slug: 'divider',
    name: 'Divider',
    description: 'Horizontal line separator between content sections.',
    category: 'Support',
    figmaPage: '❖ Divider', figmaNodeId: '5900:14675',
    variants: 5,
    properties: [],
    variantList: ['Full width', 'Inset', 'With label'],
    relatedComponents: ['Section', 'List Item'],
  },
}

// === Token Data ===
export const colorTokens = {
  primitives: 173,
  semantic: 80,
  darkModeCoverage: '100%',
  aliasingRate: '92.5%',
}

export const spacingTokens = [
  { name: '0', value: '0px' }, { name: '2', value: '2px' }, { name: '4', value: '4px' },
  { name: '6', value: '6px' }, { name: '8', value: '8px' }, { name: '10', value: '10px' },
  { name: '12', value: '12px' }, { name: '14', value: '14px' }, { name: '16', value: '16px' },
  { name: '20', value: '20px' }, { name: '22', value: '22px' }, { name: '24', value: '24px' },
  { name: '32', value: '32px' }, { name: '36', value: '36px' }, { name: '40', value: '40px' },
  { name: '48', value: '48px' }, { name: '56', value: '56px' }, { name: '64', value: '64px' },
  { name: '80', value: '80px' },
  { name: 'content-padding', value: '22px' },
  { name: 'section-gap', value: '24px' },
  { name: 'Sec_top_16', value: '16px' },
  { name: 'Sec_top_24', value: '24px' },
  { name: 'Sec_top_32', value: '32px' },
]

export const radiusTokens = [
  { name: '0', value: '0px' }, { name: '4', value: '4px' }, { name: '6', value: '6px' },
  { name: '8', value: '8px' }, { name: '12', value: '12px' }, { name: '16', value: '16px' },
  { name: '20', value: '20px' }, { name: '24', value: '24px' }, { name: 'card', value: '20px' },
  { name: '32', value: '32px' }, { name: '100', value: '100px' }, { name: 'full', value: '9999px' },
]

export const typographyStyles = [
  { name: 'Heading/XL', size: 48, weight: 'Semi Bold', lineHeight: 56 },
  { name: 'Heading/L', size: 40, weight: 'Semi Bold', lineHeight: 48 },
  { name: 'Heading/M', size: 32, weight: 'Semi Bold', lineHeight: 40 },
  { name: 'Title/XL', size: 28, weight: 'Semi Bold', lineHeight: 40 },
  { name: 'Title/L', size: 24, weight: 'Semi Bold', lineHeight: 32 },
  { name: 'Title/M', size: 20, weight: 'Semi Bold', lineHeight: 24 },
  { name: 'Title/M-Subtle', size: 20, weight: 'Medium', lineHeight: 24 },
  { name: 'Title/S', size: 16, weight: 'Semi Bold', lineHeight: 24 },
  { name: 'Title/S-Subtle', size: 16, weight: 'Medium', lineHeight: 24 },
  { name: 'Title/XS', size: 14, weight: 'Semi Bold', lineHeight: 20 },
  { name: 'Title/XS-Subtle', size: 14, weight: 'Medium', lineHeight: 20 },
  { name: 'Body/L', size: 20, weight: 'Regular', lineHeight: 24 },
  { name: 'Body/M', size: 16, weight: 'Regular', lineHeight: 24 },
  { name: 'Body/S', size: 14, weight: 'Regular', lineHeight: 20 },
  { name: 'Body/XS', size: 12, weight: 'Regular', lineHeight: 20 },
  { name: 'Caption/M', size: 12, weight: 'Semi Bold', lineHeight: 20 },
  { name: 'Caption/M-Subtle', size: 12, weight: 'Medium', lineHeight: 20 },
  { name: 'Caption/S', size: 10, weight: 'Semi Bold', lineHeight: 16 },
  { name: 'Caption/2XS', size: 11, weight: 'Semi Bold', lineHeight: 16 },
]

export const elevationStyles = [
  { name: 'Elevation/Subtle', description: 'Subtle shadow for cards and containers' },
  { name: 'Elevation/Card', description: 'Standard card elevation' },
  { name: 'Elevation/Sheet', description: 'Bottom sheet and modal elevation' },
  { name: 'Elevation/Border', description: 'Border-like subtle shadow' },
  { name: 'VSP glass', description: 'Glass morphism blur effect for floating elements' },
  { name: 'Material Blur', description: 'Heavy blur for overlays' },
]

// === Stats ===
export const dsStats = {
  totalComponents: 82,
  totalComponentSets: 62,
  totalVariants: 340,
  totalVariables: 316,
  colorVariables: 253,
  spacingTokens: 24,
  radiusTokens: 12,
  typographyTokens: 27,
  textStyles: 43,
  effectStyles: 11,
  descriptionRate: '96%',
  darkModeCoverage: '100%',
  score: '7.4/10',
}
