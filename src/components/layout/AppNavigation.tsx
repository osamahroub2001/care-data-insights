
import { 
  Activity, 
  User, 
  Users, 
  Heart, 
  AlertTriangle, 
  BarChart, 
  Database 
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const routes = [
  {
    name: "Dashboard",
    path: "/",
    icon: <Activity className="h-5 w-5" />,
  },
  {
    name: "Patients",
    path: "/patients",
    icon: <User className="h-5 w-5" />,
  },
  {
    name: "Doctors",
    path: "/doctors",
    icon: <Users className="h-5 w-5" />,
  },
  {
    name: "Vital Signs",
    path: "/vitals",
    icon: <Heart className="h-5 w-5" />,
  },
  {
    name: "Alerts",
    path: "/alerts",
    icon: <AlertTriangle className="h-5 w-5" />,
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: <BarChart className="h-5 w-5" />,
  },
  {
    name: "Simulation",
    path: "/simulation",
    icon: <Database className="h-5 w-5" />,
  },
];

export function AppNavigation() {
  const location = useLocation();

  return (
    <div className="py-4">
      <div className="px-4 mb-8">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-health-primary" />
          <h1 className="font-bold text-lg text-health-primary">HealthMonitor</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Healthcare Monitoring System</p>
      </div>
      
      <nav className="space-y-1 px-2">
        {routes.map((route) => (
          <Link
            key={route.path}
            to={route.path}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              location.pathname === route.path
                ? "bg-health-primary text-white"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {route.icon}
            <span>{route.name}</span>
          </Link>
        ))}
      </nav>
      
      <div className="mt-8 px-4">
        <div className="rounded-md bg-muted p-4">
          <h3 className="font-medium text-sm">Healthcare Monitoring</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Multi-database system with realtime monitoring and alerts.
          </p>
        </div>
      </div>
    </div>
  );
}
