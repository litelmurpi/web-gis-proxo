import { forwardRef } from "react";

const Card = forwardRef(({ className = "", children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`relative bg-base-900 border border-white/5 rounded-3xl shadow-card overflow-hidden group transition-colors hover:border-white/10 ${className}`}
      {...props}
    >
      {/* Subtle interactive ambient glow inside the card on hover */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 transition-transform duration-700 group-hover:translate-x-1/4 pointer-events-none" />

      {/* Subtle inner highlight to simulate glass edge / 3D depth on true black */}
      <div className="absolute inset-0 pointer-events-none border border-white/2 rounded-3xl mix-blend-overlay"></div>

      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
});
Card.displayName = "Card";

const CardHeader = forwardRef(({ className = "", children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`px-8 py-6 border-b border-white/5 flex items-center justify-between ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef(({ className = "", children, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={`text-sm font-semibold tracking-tight font-heading text-white ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
});
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef(
  ({ className = "", children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={`text-xs text-base-400 font-body mt-1 ${className}`}
        {...props}
      >
        {children}
      </p>
    );
  },
);
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div ref={ref} className={`p-8 ${className}`} {...props}>
        {children}
      </div>
    );
  },
);
CardContent.displayName = "CardContent";

const CardFooter = forwardRef(({ className = "", children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`px-8 py-6 bg-white/2 border-t border-white/5 flex items-center ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
