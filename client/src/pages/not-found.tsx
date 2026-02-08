import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950">
      <Card className="w-full max-w-md mx-4 bg-slate-900 border-slate-800">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 text-red-500 items-center justify-center">
            <AlertCircle className="h-8 w-8" />
            <h1 className="text-2xl font-bold text-center font-serif">404 Page Not Found</h1>
          </div>
          <p className="mt-4 text-slate-400 text-center font-serif italic">
            "You have wandered into the void. Turn back, traveler, for there is nothing here but shadows."
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
