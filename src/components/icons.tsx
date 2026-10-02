import { Icon } from "./ui/Icon";

// Domain-grouped HugeIcons (free, Stroke Rounded). Import glyphs from here,
// never raw from the package, so swaps stay one-line.
export {
  Home01Icon,
  Search01Icon,
  ReceiptIcon,
  UserIcon,
  ShoppingBag02Icon,
  ArrowLeft01Icon,
  PlusSignIcon,
  MinusSignIcon,
  FavouriteIcon,
  Camera01Icon,
  StarIcon,
  BubbleChatIcon,
  Notification01Icon,
  Copy01Icon,
  MapPinIcon,
  FilterIcon,
  Clock01Icon,
  EyeIcon,
  EyeOffIcon,
  CheckmarkCircle01Icon,
  DashboardSquare01Icon,
  UsersIcon,
  Settings01Icon,
  Logout01Icon,
  Package01Icon,
  Navigation01Icon,
  Store01Icon,
  ChefHatIcon,
  Delete02Icon,
  Edit02Icon,
  CreditCardIcon,
  BankIcon,
  IdentificationIcon,
  ShieldCheckIcon,
  Calendar01Icon,
  ChartLineIcon,
  DeliveryBox01Icon,
  Wallet01Icon,
  ListViewIcon,
  RefreshIcon,
  BubbleChatNotificationIcon,
  BanknoteIcon,
  SentIcon,
  Video01Icon,
  PhoneIcon,
  LockIcon,
  CheckCheckIcon,
} from "@hugeicons/core-free-icons";

// Tab-bar compatible renderer with the app's default stroke.
export function ic(glyph: any) {
  return (props: { color: string; size: number; strokeWidth?: number }) => (
    <Icon
      icon={glyph}
      color={props.color}
      size={props.size}
      strokeWidth={props.strokeWidth ?? 1.9}
    />
  );
}
