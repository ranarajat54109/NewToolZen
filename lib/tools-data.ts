import { Shuffle, Orbit, Type, Settings, FileImage, FileText, Hash, Key, FileJson, GitCompare, Smile, Sigma, QrCode, Barcode, Crop, Maximize, CalendarClock, Database, Palette, Coffee, Timer, Monitor, Wrench } from 'lucide-react';

export interface Tool {
  name: string;
  href: string;
  icon: any;
  description: string;
  category: string;
}

export interface ToolCategory {
  category: string;
  icon: any;
  items: Tool[];
  showOnDashboard?: boolean;
}

export const TOOLS: ToolCategory[] = [
  {
    category: 'Generators',
    icon: Orbit,
    showOnDashboard: true,
    items: [
      { name: 'Random Number', href: '/tools/generators/random-number', icon: Shuffle, description: 'Generate random numbers with custom ranges and options.', category: 'Generators' },
      { name: 'Random Name', href: '/tools/generators/random-name', icon: Type, description: 'Create random male/female names from various nationalities.', category: 'Generators' },
      { name: 'Birthday Generator', href: '/tools/generators/birthday', icon: Orbit, description: 'Generate random birth dates with predefined age ranges.', category: 'Generators' },
      { name: 'CNPJ Generator', href: '/tools/generators/cnpj', icon: Settings, description: 'Generate valid Brazilian CNPJ numbers for testing.', category: 'Generators' },
      { name: 'CPF Generator', href: '/tools/generators/cpf', icon: Hash, description: 'Generate valid Brazilian CPF numbers.', category: 'Generators' },
      { name: 'PIN Code', href: '/tools/generators/pin', icon: Key, description: 'Generate secure numeric PIN codes of custom lengths.', category: 'Generators' },
    ]
  },
  {
    category: 'Converters',
    icon: FileText,
    showOnDashboard: false,
    items: [
      { name: 'PDF to JPG', href: '/tools/converters/pdf-to-jpg', icon: FileImage, description: 'Convert PDF documents to high-quality JPG images.', category: 'Converters' },
      { name: 'JPG to PDF', href: '/tools/converters/jpg-to-pdf', icon: FileText, description: 'Convert JPG images into a single PDF document.', category: 'Converters' },
      { name: 'Word to PDF', href: '/tools/converters/word-to-pdf', icon: FileText, description: 'Convert Word documents to PDF format.', category: 'Converters' },
      { name: 'PDF to Word', href: '/tools/converters/pdf-to-word', icon: FileText, description: 'Convert PDF documents to editable Word files.', category: 'Converters' },
    ]
  },
  {
    category: 'Image Tools',
    icon: FileImage,
    showOnDashboard: false,
    items: [
      { name: 'Emoji Picker', href: '/tools/image/emoji-picker', icon: Smile, description: 'Browse and copy your favorite emojis.', category: 'Image Tools' },
      { name: 'Symbol Picker', href: '/tools/image/symbol-picker', icon: Sigma, description: 'Find and copy special symbols and characters.', category: 'Image Tools' },
      { name: 'QR Code Generator', href: '/tools/image/qr-code', icon: QrCode, description: 'Create customizable QR codes for links.', category: 'Image Tools' },
      { name: 'Barcode Generator', href: '/tools/image/barcode', icon: Barcode, description: 'Generate high-quality barcodes instantly.', category: 'Image Tools' },
      { name: 'Image Cropper', href: '/tools/image/cropper', icon: Crop, description: 'Crop your images to exact dimensions.', category: 'Image Tools' },
      { name: 'Image Resizer', href: '/tools/image/resizer', icon: Maximize, description: 'Resize images while keeping aspect ratio.', category: 'Image Tools' },
    ]
  },
  {
    category: 'Utilities',
    icon: Wrench,
    showOnDashboard: false,
    items: [
      { name: 'JSON Viewer', href: '/tools/utilities/json-viewer', icon: FileJson, description: 'View and format JSON data in a readable way.', category: 'Utilities' },
      { name: 'Text Compare', href: '/tools/utilities/text-compare', icon: GitCompare, description: 'Compare two text snippets and see differences.', category: 'Utilities' },
    ]
  },
  {
    category: 'Break Timer',
    icon: Coffee,
    showOnDashboard: false,
    items: [
      { name: 'Countdown Timer', href: '/tools/break-timer/timer', icon: Timer, description: 'A functional countdown timer for your breaks.', category: 'Break Timer' },
      { name: 'Fake Update Screen', href: '/tools/break-timer/fake-update', icon: Monitor, description: 'Simulate OS-style update screens for a break.', category: 'Break Timer' },
    ]
  },
  {
    category: 'Random Data',
    icon: Database,
    showOnDashboard: false,
    items: [
      { name: 'Random User', href: '/tools/random-data', icon: Database, description: 'Generate random user data for testing.', category: 'Random Data' },
    ]
  },
  {
    category: 'Date & Time',
    icon: CalendarClock,
    showOnDashboard: false,
    items: [
      { name: 'Date Calculator', href: '/tools/datetime', icon: CalendarClock, description: 'Calculate date differences and future dates.', category: 'Date & Time' },
    ]
  },
  {
    category: 'Colors',
    icon: Palette,
    showOnDashboard: false,
    items: [
      { name: 'Color Picker', href: '/tools/colors', icon: Palette, description: 'Choose and manage color palettes.', category: 'Colors' },
    ]
  }
];

export const ALL_TOOLS = TOOLS.flatMap(category => category.items);
