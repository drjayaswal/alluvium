import { Loader } from "lucide-react";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden">
      <Loader className="w-8 h-8 animate-spin text-main" />
    </div>
  );
}

export { Spinner };
