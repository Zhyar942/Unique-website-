import React from 'react';
import {
  Search,
  Call,
  Location,
  Category,
  CloseSquare,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  TickSquare,
  TimeCircle,
  Activity,
  Buy,
  Setting,
  User,
  Lock,
  Edit,
  Delete,
  Plus,
  Image,
  Logout,
  Star,
  ShieldDone,
  Discovery,
  TicketStar,
  Filter,
  PaperUpload,
  Download,
  Swap,
  Show,
  Hide,
  Send,
  Document,
  Home,
  Heart,
  Bag,
  Chat,
  Message,
  Notification,
  InfoCircle,
  Danger,
  TwoUsers,
  AddUser,
  Bookmark,
  Calendar,
  Camera,
  Discount,
  Folder,
  Play,
  Scan,
  Unlock,
  Voice,
  VolumeUp,
  VolumeOff,
  Wallet,
  Work
} from 'react-iconly';

/**
 * High-precision Iconly-styled Language / Globe Icon
 * Aligns seamlessly with Iconly Light/Curved stroke geometry
 */
const LanguageGlobeIcon = ({ size = 20, primaryColor = 'currentColor', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle
      cx="12"
      cy="12"
      r="9.25"
      stroke={primaryColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.2 12h17.6"
      stroke={primaryColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 2.75C9.7 6.1 8.5 9 8.5 12s1.2 5.9 3.5 9.25"
      stroke={primaryColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 2.75c2.3 3.35 3.5 6.25 3.5 9.25s-1.2 5.9-3.5 9.25"
      stroke={primaryColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Iconly-styled Three Dash (Hamburger) Menu Icon
 * Aligns precisely with Iconly Light/Curved stroke geometry (24x24, 1.65 stroke, round caps)
 */
const HamburgerMenuIcon = ({ size = 20, primaryColor = 'currentColor', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.75 7.25h16.5M3.75 12h16.5M3.75 16.75h16.5"
      stroke={primaryColor}
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Iconly-styled Clean Close (X) Icon
 */
const CloseIcon = ({ size = 20, primaryColor = 'currentColor', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M18 6L6 18M6 6l12 12"
      stroke={primaryColor}
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Standardized UI Icon System using Iconly (Light / Curved style)
 */
const ICON_MAP = {
  // General Navigation & Controls
  search: Search,
  menu: HamburgerMenuIcon,
  hamburger: HamburgerMenuIcon,
  'three-dash': HamburgerMenuIcon,
  category: Category,
  close: CloseIcon,
  'close-square': CloseSquare,
  home: Home,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  'arrow-right': ArrowRight,
  'arrow-left': ArrowLeft,

  // Communication & Place & Language
  call: Call,
  phone: Call,
  location: Location,
  time: TimeCircle,
  clock: TimeCircle,
  language: LanguageGlobeIcon,
  globe: LanguageGlobeIcon,
  discovery: Discovery,

  // Feedback & State
  check: TickSquare,
  tick: TickSquare,
  star: Star,
  heritage: Star,
  'ticket-star': TicketStar,
  shield: ShieldDone,
  'shield-done': ShieldDone,
  guarantee: ShieldDone,
  warranty: ShieldDone,
  materials: Discovery,
  show: Show,
  hide: Hide,
  eye: Show,
  heart: Heart,
  notification: Notification,
  info: InfoCircle,
  danger: Danger,

  // Management & Actions
  dashboard: Activity,
  package: Buy,
  products: Buy,
  bag: Bag,
  cart: Bag,
  settings: Setting,
  user: User,
  users: TwoUsers,
  lock: Lock,
  edit: Edit,
  delete: Delete,
  trash: Delete,
  plus: Plus,
  image: Image,
  logout: Logout,
  filter: Filter,
  external: PaperUpload,
  save: Download,
  reset: Swap,
  share: Send,
  chat: Chat,
  message: Message,
  document: Document,
  calendar: Calendar,
  bookmark: Bookmark,
  discount: Discount,
  folder: Folder,
  play: Play,
  scan: Scan,
  unlock: Unlock,
  voice: Voice,
  volume: VolumeUp,
  'volume-off': VolumeOff,
  wallet: Wallet,
  work: Work
};

export const AppIcon = ({
  name,
  size = 20,
  set = 'light',
  color = 'currentColor',
  style,
  className,
  ...props
}) => {
  const IconComponent = ICON_MAP[name];

  if (!IconComponent) {
    console.warn(`[AppIcon] Icon "${name}" not found in Iconly catalog.`);
    return null;
  }

  return (
    <span
      className={`app-icon app-icon-${name} ${className || ''}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 0,
        verticalAlign: 'middle',
        color,
        ...style
      }}
      {...props}
    >
      <IconComponent
        set={set}
        size={size}
        primaryColor={color}
      />
    </span>
  );
};

export default AppIcon;
