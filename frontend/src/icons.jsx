function Icon({ children, size = 18, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const SearchIcon = (p) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-4.2-4.2" />
  </Icon>
);

export const PinIcon = (p) => (
  <Icon {...p}>
    <path d="M12 21s-6.5-5.4-6.5-10.2A6.5 6.5 0 0 1 12 4.3a6.5 6.5 0 0 1 6.5 6.5C18.5 15.6 12 21 12 21z" />
    <circle cx="12" cy="10.8" r="2.3" />
  </Icon>
);

export const CrosshairIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="6.5" />
    <path d="M12 2.5v3.5M12 18v3.5M2.5 12H6M18 12h3.5" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
  </Icon>
);

export const DropletIcon = (p) => (
  <Icon {...p}>
    <path d="M12 3.5s5.8 6.3 5.8 10.4a5.8 5.8 0 0 1-11.6 0C6.2 9.8 12 3.5 12 3.5z" />
  </Icon>
);

export const WindIcon = (p) => (
  <Icon {...p}>
    <path d="M3.5 8.5h9.8a2.6 2.6 0 1 0-2.6-2.6" />
    <path d="M3.5 12.5h14.6a2.8 2.8 0 1 1-2.8 2.8" />
    <path d="M3.5 16.5h6.2" />
  </Icon>
);

export const GaugeIcon = (p) => (
  <Icon {...p}>
    <path d="M5 19a9 9 0 1 1 14 0" />
    <path d="M12 13.5 15.5 9" />
    <circle cx="12" cy="14" r="1.5" fill="currentColor" stroke="none" />
  </Icon>
);

export const RainCloudIcon = (p) => (
  <Icon {...p}>
    <path d="M7 15a4 4 0 0 1-.6-7.9 5.5 5.5 0 0 1 10.7 1.2A3.5 3.5 0 0 1 17 15H7z" />
    <path d="M9 18.5v1.5M12.5 18v2M16 18.5v1.5" />
  </Icon>
);

export const SunriseIcon = (p) => (
  <Icon {...p}>
    <path d="M12 9V3.5M12 3.5 9.5 6M12 3.5 14.5 6" />
    <path d="M5.2 16.5a6.8 6.8 0 0 1 13.6 0" />
    <path d="M3 20h18" />
  </Icon>
);

export const SunsetIcon = (p) => (
  <Icon {...p}>
    <path d="M12 3.5V9M12 9 9.5 6.5M12 9l2.5-2.5" />
    <path d="M5.2 16.5a6.8 6.8 0 0 1 13.6 0" />
    <path d="M3 20h18" />
  </Icon>
);

export const SunIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19" />
  </Icon>
);

export const ClockIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Icon>
);

export const GlobeIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.6 2.3 4 5.2 4 8.5s-1.4 6.2-4 8.5c-2.6-2.3-4-5.2-4-8.5s1.4-6.2 4-8.5z" />
  </Icon>
);

export const DownloadIcon = (p) => (
  <Icon {...p}>
    <path d="M12 4v10M12 14l-3.5-3.5M12 14l3.5-3.5" />
    <path d="M4.5 16.5v2A1.5 1.5 0 0 0 6 20h12a1.5 1.5 0 0 0 1.5-1.5v-2" />
  </Icon>
);

export const PencilIcon = (p) => (
  <Icon {...p}>
    <path d="m14.5 5.5 4 4L8 20H4v-4z" />
    <path d="m12.5 7.5 4 4" />
  </Icon>
);

export const TrashIcon = (p) => (
  <Icon {...p}>
    <path d="M4.5 6.5h15M9.5 6V4.5A1.5 1.5 0 0 1 11 3h2a1.5 1.5 0 0 1 1.5 1.5V6" />
    <path d="M6.5 6.5 7.3 19a2 2 0 0 0 2 1.9h5.4a2 2 0 0 0 2-1.9l.8-12.5" />
    <path d="M10 10.5v6M14 10.5v6" />
  </Icon>
);

export const ChevronIcon = (p) => (
  <Icon {...p}>
    <path d="m6 9.5 6 6 6-6" />
  </Icon>
);

export const CloseIcon = (p) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
);

export const InfoIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v5" />
    <circle cx="12" cy="8" r="0.9" fill="currentColor" stroke="none" />
  </Icon>
);

export const AlertIcon = (p) => (
  <Icon {...p}>
    <path d="M12 4 2.8 19.5h18.4L12 4z" />
    <path d="M12 10v4.5" />
    <circle cx="12" cy="17.2" r="0.9" fill="currentColor" stroke="none" />
  </Icon>
);

export const UmbrellaIcon = (p) => (
  <Icon {...p}>
    <path d="M12 3a9 9 0 0 1 9 9H3a9 9 0 0 1 9-9z" />
    <path d="M12 12v6.5a2 2 0 0 0 4 0" />
  </Icon>
);

export const SnowflakeIcon = (p) => (
  <Icon {...p}>
    <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9" />
    <path d="M12 3l-2 2M12 3l2 2M12 21l-2-2M12 21l2-2" />
  </Icon>
);

export const ThermometerIcon = (p) => (
  <Icon {...p}>
    <path d="M10.5 13.8V5a1.5 1.5 0 0 1 3 0v8.8a4 4 0 1 1-3 0z" />
    <circle cx="12" cy="17.5" r="1.6" fill="currentColor" stroke="none" />
  </Icon>
);

export const PlusIcon = (p) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const CheckIcon = (p) => (
  <Icon {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Icon>
);

export const DatabaseIcon = (p) => (
  <Icon {...p}>
    <ellipse cx="12" cy="5.5" rx="7.5" ry="3" />
    <path d="M4.5 5.5v13c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-13" />
    <path d="M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3" />
  </Icon>
);
