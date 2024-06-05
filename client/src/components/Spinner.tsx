import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

const Spinner = ({ className }: Props) => {
  return (
    <div
      className={cn(
        "h-5 w-5 animate-spin rounded-full border-l border-t border-muted-foreground",
        className,
      )}
    ></div>
  );
};

export default Spinner;
