import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-[13.5px] font-bold transition duration-200 ease-out disabled:pointer-events-none disabled:opacity-55 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bayang-tombol-emas bg-emas text-hutan hover:-translate-y-[2px] disabled:hover:translate-y-0 disabled:hover:shadow-none",
        destructive: "bg-bata text-kertas hover:bg-bata/90",
        outline:
          "border-[1.5px] border-garis-tebal bg-kertas text-hutan hover:border-daun hover:bg-emas-lembut",
        secondary: "bg-panel text-hutan hover:bg-emas-lembut",
        ghost: "text-redup hover:bg-bata/8 hover:text-bata",
        link: "text-daun underline-offset-4 hover:text-hutan hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-[8px] px-3 text-[12.5px]",
        lg: "h-11 px-6 text-[15px]",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
