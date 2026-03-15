import { cn } from "@/lib/utils";
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-xl bg-[#1a1a17]/[0.04]", className)} {...props} />;
}
export { Skeleton };
