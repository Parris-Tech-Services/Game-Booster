import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface LogEntry {
  id: string;
  type: 'narrative' | 'combat' | 'info' | 'success' | 'error';
  text: string;
  timestamp: string;
}

interface GameLogProps {
  logs: LogEntry[];
}

export function GameLog({ logs }: GameLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="relative h-full flex flex-col bg-slate-950/50 rounded-xl border border-slate-800/60 shadow-inner overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-slate-950/80 to-transparent z-10 pointer-events-none" />
      
      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        <div className="space-y-4 pb-4">
          <AnimatePresence initial={false}>
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "text-sm md:text-base leading-relaxed font-serif tracking-wide border-l-2 pl-4 py-1",
                  {
                    "border-amber-500/50 text-amber-50": log.type === 'narrative',
                    "border-red-500/50 text-red-200": log.type === 'combat',
                    "border-blue-500/50 text-blue-200": log.type === 'info',
                    "border-green-500/50 text-green-200": log.type === 'success',
                    "border-red-700/50 text-red-400": log.type === 'error',
                  }
                )}
              >
                <span className="text-xs font-mono opacity-40 mr-3 select-none">{log.timestamp}</span>
                {log.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
      
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-950/80 to-transparent z-10 pointer-events-none" />
    </div>
  );
}
