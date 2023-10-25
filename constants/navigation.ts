import { Chart2 as DashboardIcon, FileText as FileIcon } from "solar-icon-set";

export const MainNavigation = [
  {
    key: "dashboard",
    icon: DashboardIcon,
    pathName: "/dashboard",
    match: "dashboard",
    name: "Patient",
  },
  {
    key: "selectFile",
    icon: FileIcon,
    pathName: "/dashboard/select-file",
    match: "select-file",
    name: "Select file",
  },
];
