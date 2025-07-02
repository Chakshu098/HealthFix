import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, Camera, MessageSquare, FileText, MapPin } from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Diagnose by Symptoms",
    description: "Input your symptoms for an AI-powered analysis.",
    href: "/symptom-diagnosis",
    icon: Stethoscope,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Diagnose by Image",
    description: "Upload an image of your condition for a visual check.",
    href: "/image-diagnosis",
    icon: Camera,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    title: "Nearby Health Centers",
    description: "Find clinics, hospitals, and pharmacies near you.",
    href: "/nearby-centers",
    icon: MapPin,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    title: "AI Chatbot",
    description: "Ask our AI assistant any health-related questions.",
    href: "/chatbot",
    icon: MessageSquare,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "View Reports",
    description: "Access your past diagnosis reports and insights.",
    href: "/reports",
    icon: FileText,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome to HealthFix</h1>
        <p className="text-muted-foreground">Your AI-powered instant health diagnostics platform.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {features.map((feature) => (
          <Link href={feature.href} key={feature.href} className="group">
            <Card className="glass-card h-full hover:border-primary/50 hover:shadow-2xl">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className={`p-3 rounded-lg ${feature.bgColor}`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
