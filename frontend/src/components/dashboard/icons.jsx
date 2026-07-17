function iconProps(props) {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    ...props,
  };
}

export const DashboardIcon = (props) => (
  <svg {...iconProps(props)}>
    <rect x="3" y="3" width="8" height="8" rx="1.5" />
    <rect x="13" y="3" width="8" height="5" rx="1.5" />
    <rect x="13" y="12" width="8" height="9" rx="1.5" />
    <rect x="3" y="14" width="8" height="7" rx="1.5" />
  </svg>
);

export const OrdersIcon = (props) => (
  <svg {...iconProps(props)}>
    <path d="M4 4h2l1.2 11.2A2 2 0 0 0 9.2 17h8.6a2 2 0 0 0 2-1.8L21 7H6" />
    <circle cx="9.5" cy="20.5" r="1.4" />
    <circle cx="17.5" cy="20.5" r="1.4" />
  </svg>
);

export const InventoryIcon = (props) => (
  <svg {...iconProps(props)}>
    <path d="M3 7.5 12 3l9 4.5-9 4.5-9-4.5Z" />
    <path d="M3 7.5v9L12 21l9-4.5v-9" />
    <path d="M12 12v9" />
  </svg>
);

export const DeliveriesIcon = (props) => (
  <svg {...iconProps(props)}>
    <rect x="2" y="7" width="12" height="9" rx="1.2" />
    <path d="M14 10h4l3 3v3h-7z" />
    <circle cx="7" cy="18.5" r="1.6" />
    <circle cx="17.5" cy="18.5" r="1.6" />
  </svg>
);

export const CustomersIcon = (props) => (
  <svg {...iconProps(props)}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    <circle cx="17" cy="8.5" r="2.4" />
    <path d="M15.5 14.2c2.6.4 4.5 2.7 4.5 5.5" />
  </svg>
);

export const TrainingIcon = (props) => (
  <svg {...iconProps(props)}>
    <path d="M2 8 12 4l10 4-10 4-10-4Z" />
    <path d="M6 10.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5" />
    <path d="M22 8v6" />
  </svg>
);

export const VetIcon = (props) => (
  <svg {...iconProps(props)}>
    <path d="M6 3v4a3 3 0 0 0 6 0V3" />
    <path d="M18 3v4a3 3 0 0 1-6 0" />
    <path d="M9 12v3a6 6 0 0 0 6 6" />
    <circle cx="18.5" cy="17.5" r="2.4" />
  </svg>
);

export const SubsidyIcon = (props) => (
  <svg {...iconProps(props)}>
    <rect x="3" y="4" width="18" height="16" rx="1.5" />
    <path d="M7 9h10M7 13h10M7 17h6" />
  </svg>
);

export const DealersIcon = (props) => (
  <svg {...iconProps(props)}>
    <path d="M3 21V9l9-6 9 6v12" />
    <path d="M9 21v-6h6v6" />
  </svg>
);

export const AccountsIcon = (props) => (
  <svg {...iconProps(props)}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
  </svg>
);

export const LogoutIcon = (props) => (
  <svg {...iconProps(props)}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </svg>
);

export const CartIcon = (props) => (
  <svg {...iconProps(props)}>
    <circle cx="9.5" cy="20.5" r="1.4" />
    <circle cx="17.5" cy="20.5" r="1.4" />
    <path d="M2.5 3h2l2.2 12.2a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.6L21 7H6" />
  </svg>
);
