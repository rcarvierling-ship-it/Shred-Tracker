import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export function CoachingBadge({ suggestion }: { suggestion: number | null }) {
    if (!suggestion) return null;
    return (
        <Badge variant="secondary" className="bg-blue-900/50 text-blue-200 border-blue-800 animate-in fade-in zoom-in duration-500">
            <Sparkles className="w-3 h-3 mr-1 text-yellow-400" />
            Coach: Try {suggestion}lbs
        </Badge>
    );
}
