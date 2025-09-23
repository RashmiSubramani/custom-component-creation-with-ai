// Definitive list of available ShadCN components with use cases
// This is the source of truth for what components actually exist

export const AVAILABLE_SHADCN_COMPONENTS = {
  // Layout & Structure
  "card": {
    components: ["Card", "CardHeader", "CardTitle", "CardDescription", "CardContent", "CardFooter"],
    useCase: "Containers, information display, content sections"
  },
  "separator": {
    components: ["Separator"],
    useCase: "Visual dividers, section breaks"
  },
  "aspect-ratio": {
    components: ["AspectRatio"],
    useCase: "Responsive media containers"
  },
  "scroll-area": {
    components: ["ScrollArea"],
    useCase: "Custom scrollable areas"
  },
  "resizable": {
    components: ["ResizablePanelGroup", "ResizablePanel", "ResizableHandle"],
    useCase: "Resizable layouts and panels"
  },

  // Forms & Inputs
  "button": {
    components: ["Button"],
    useCase: "All clickable actions, form submissions"
  },
  "input": {
    components: ["Input"],
    useCase: "Text input fields"
  },
  "textarea": {
    components: ["Textarea"],
    useCase: "Multi-line text input"
  },
  "label": {
    components: ["Label"],
    useCase: "Form field labels"
  },
  "checkbox": {
    components: ["Checkbox"],
    useCase: "Boolean selection, multiple options"
  },
  "radio-group": {
    components: ["RadioGroup", "RadioGroupItem"],
    useCase: "Single selection from multiple options"
  },
  "select": {
    components: ["Select", "SelectContent", "SelectItem", "SelectTrigger", "SelectValue"],
    useCase: "Dropdown selection lists"
  },
  "switch": {
    components: ["Switch"],
    useCase: "Toggle on/off states"
  },
  "slider": {
    components: ["Slider"],
    useCase: "Range selection, volume controls"
  },
  "toggle": {
    components: ["Toggle"],
    useCase: "Toggle states, formatting options"
  },
  "toggle-group": {
    components: ["ToggleGroup", "ToggleGroupItem"],
    useCase: "Multiple toggle options"
  },
  "form": {
    components: ["Form", "FormControl", "FormDescription", "FormField", "FormItem", "FormLabel", "FormMessage"],
    useCase: "Complete form handling with validation"
  },
  "input-otp": {
    components: ["InputOTP", "InputOTPGroup", "InputOTPSlot", "InputOTPSeparator"],
    useCase: "One-time password input"
  },

  // Overlays & Modals (NO Modal component!)
  "dialog": {
    components: ["Dialog", "DialogContent", "DialogDescription", "DialogFooter", "DialogHeader", "DialogTitle", "DialogTrigger"],
    useCase: "Modals, popups, confirmations - USE THIS INSTEAD OF Modal"
  },
  "alert-dialog": {
    components: ["AlertDialog", "AlertDialogAction", "AlertDialogCancel", "AlertDialogContent", "AlertDialogDescription", "AlertDialogFooter", "AlertDialogHeader", "AlertDialogTitle", "AlertDialogTrigger"],
    useCase: "Confirmation dialogs, destructive actions"
  },
  "sheet": {
    components: ["Sheet", "SheetClose", "SheetContent", "SheetDescription", "SheetFooter", "SheetHeader", "SheetTitle", "SheetTrigger"],
    useCase: "Side panels, slide-out menus"
  },
  "drawer": {
    components: ["Drawer", "DrawerClose", "DrawerContent", "DrawerDescription", "DrawerFooter", "DrawerHeader", "DrawerTitle", "DrawerTrigger"],
    useCase: "Bottom-up slide panels (mobile-friendly)"
  },
  "popover": {
    components: ["Popover", "PopoverContent", "PopoverTrigger"],
    useCase: "Floating content, tooltips with interaction"
  },
  "tooltip": {
    components: ["Tooltip", "TooltipContent", "TooltipProvider", "TooltipTrigger"],
    useCase: "Hover information, help text"
  },
  "hover-card": {
    components: ["HoverCard", "HoverCardContent", "HoverCardTrigger"],
    useCase: "Rich hover previews"
  },

  // Navigation
  "menubar": {
    components: ["Menubar", "MenubarContent", "MenubarItem", "MenubarMenu", "MenubarSeparator", "MenubarShortcut", "MenubarSub", "MenubarSubContent", "MenubarSubTrigger", "MenubarTrigger"],
    useCase: "Application menu bars"
  },
  "navigation-menu": {
    components: ["NavigationMenu", "NavigationMenuContent", "NavigationMenuIndicator", "NavigationMenuItem", "NavigationMenuLink", "NavigationMenuList", "NavigationMenuTrigger", "NavigationMenuViewport"],
    useCase: "Website navigation, mega menus"
  },
  "dropdown-menu": {
    components: ["DropdownMenu", "DropdownMenuContent", "DropdownMenuItem", "DropdownMenuLabel", "DropdownMenuSeparator", "DropdownMenuShortcut", "DropdownMenuSub", "DropdownMenuSubContent", "DropdownMenuSubTrigger", "DropdownMenuTrigger"],
    useCase: "Context menus, action menus"
  },
  "context-menu": {
    components: ["ContextMenu", "ContextMenuContent", "ContextMenuItem", "ContextMenuLabel", "ContextMenuSeparator", "ContextMenuShortcut", "ContextMenuSub", "ContextMenuSubContent", "ContextMenuSubTrigger", "ContextMenuTrigger"],
    useCase: "Right-click menus"
  },
  "command": {
    components: ["Command", "CommandDialog", "CommandEmpty", "CommandGroup", "CommandInput", "CommandItem", "CommandList", "CommandSeparator", "CommandShortcut"],
    useCase: "Command palettes, search interfaces"
  },
  "breadcrumb": {
    components: ["Breadcrumb", "BreadcrumbEllipsis", "BreadcrumbItem", "BreadcrumbLink", "BreadcrumbList", "BreadcrumbPage", "BreadcrumbSeparator"],
    useCase: "Navigation breadcrumbs"
  },

  // Data Display
  "table": {
    components: ["Table", "TableBody", "TableCaption", "TableCell", "TableFooter", "TableHead", "TableHeader", "TableRow"],
    useCase: "Data tables, spreadsheet layouts"
  },
  "tabs": {
    components: ["Tabs", "TabsContent", "TabsList", "TabsTrigger"],
    useCase: "Tabbed interfaces, content switching"
  },
  "accordion": {
    components: ["Accordion", "AccordionContent", "AccordionItem", "AccordionTrigger"],
    useCase: "Expandable content sections, FAQs"
  },
  "collapsible": {
    components: ["Collapsible", "CollapsibleContent", "CollapsibleTrigger"],
    useCase: "Expandable/collapsible content"
  },
  "calendar": {
    components: ["Calendar"],
    useCase: "Date selection, date pickers (use with Popover for date picker)"
  },
  "chart": {
    components: ["ChartContainer", "ChartTooltip", "ChartTooltipContent", "ChartLegend", "ChartLegendContent"],
    useCase: "Data visualization, charts, graphs"
  },

  // Feedback & Status
  "alert": {
    components: ["Alert", "AlertDescription", "AlertTitle"],
    useCase: "Status messages, notifications"
  },
  "toast": {
    components: ["Toast", "ToastAction", "ToastClose", "ToastDescription", "ToastProvider", "ToastTitle", "ToastViewport"],
    useCase: "Temporary notifications"
  },
  "toaster": {
    components: ["Toaster"],
    useCase: "Toast notification system"
  },
  "sonner": {
    components: ["Sonner"],
    useCase: "Modern toast notifications"
  },
  "progress": {
    components: ["Progress"],
    useCase: "Loading progress, completion status"
  },
  "skeleton": {
    components: ["Skeleton"],
    useCase: "Loading placeholders"
  },

  // Media & Content
  "avatar": {
    components: ["Avatar", "AvatarFallback", "AvatarImage"],
    useCase: "User profile pictures, person representations"
  },
  "badge": {
    components: ["Badge"],
    useCase: "Status indicators, tags, labels"
  },
  "carousel": {
    components: ["Carousel", "CarouselContent", "CarouselItem", "CarouselNext", "CarouselPrevious"],
    useCase: "Image galleries, content sliders"
  },

  // Layout Helpers
  "pagination": {
    components: ["Pagination", "PaginationContent", "PaginationEllipsis", "PaginationItem", "PaginationLink", "PaginationNext", "PaginationPrevious"],
    useCase: "Page navigation, data pagination"
  },
  "sidebar": {
    components: ["Sidebar", "SidebarContent", "SidebarFooter", "SidebarGroup", "SidebarGroupAction", "SidebarGroupContent", "SidebarGroupLabel", "SidebarHeader", "SidebarInput", "SidebarInset", "SidebarMenu", "SidebarMenuAction", "SidebarMenuBadge", "SidebarMenuButton", "SidebarMenuItem", "SidebarMenuSkeleton", "SidebarMenuSub", "SidebarMenuSubButton", "SidebarMenuSubItem", "SidebarProvider", "SidebarRail", "SidebarSeparator", "SidebarTrigger"],
    useCase: "Application sidebars, navigation panels"
  }
};

// Generate formatted list for LLM prompt
export function getComponentListForLLM() {
  const lines = ["🎯 AVAILABLE SHADCN COMPONENTS (ONLY use these):"];
  
  Object.entries(AVAILABLE_SHADCN_COMPONENTS).forEach(([kebabName, info]) => {
    const componentNames = info.components.join(", ");
    lines.push(`• ${kebabName}: {${componentNames}} - ${info.useCase}`);
  });
  
  lines.push("");
  lines.push("🚫 CRITICAL: These components DO NOT EXIST in ShadCN:");
  lines.push("❌ Modal (use Dialog instead)");
  lines.push("❌ Text (use <p>, <span>, <div> instead)");
  lines.push("❌ Typography (use HTML headings <h1>-<h6> instead)");
  lines.push("❌ Popup (use Popover or Dialog instead)");
  lines.push("❌ DatePicker (use Calendar + Popover composition instead)");
  
  return lines.join("\n");
}

// Get just the kebab-case names for validation
export function getValidComponentNames() {
  return Object.keys(AVAILABLE_SHADCN_COMPONENTS);
}