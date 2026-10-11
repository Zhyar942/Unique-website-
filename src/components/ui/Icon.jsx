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
  Document
} from 'react-iconly';

/**
 * Standardized UI Icon System using Iconly (Light / Broken style)
 * Consistent sizes:
 *   14 / 16 — compact controls, tags, subtle indicators
 *   18 — normal interface controls, inputs
 *   20 — standard actions, header controls
 *   24 — primary controls
 *   32 — rare large displays
 */

const ICON_MAP = {
  // General Navigation & Controls
  search: Search,
  menu: Category,
  close: CloseSquare,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  'arrow-right': ArrowRight,
  'arrow-left': ArrowLeft,

  // Communication & Place
  call: Call,
  phone: Call,
  location: Location,
  time: TimeCircle,
  clock: TimeCircle,

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
  discovery: Discovery,
  materials: Discovery,
  show: Show,
  hide: Hide,
  eye: Show,

  // Management & Actions
  dashboard: Activity,
  package: Buy,
  products: Buy,
  settings: Setting,
  user: User,
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
  document: Document
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
