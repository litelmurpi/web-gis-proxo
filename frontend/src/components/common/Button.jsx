import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      className = "",
      disabled,
      ...props
    },
    ref,
  ) => {
    // Base styles (using rounded-full based on preferred design)
    const baseStyles =
      "relative z-10 overflow-hidden group cursor-pointer font-medium font-body transition-all duration-300 transform hover:-translate-y-0.5 outline-none ring-2 ring-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0";

    const variants = {
      primary:
        "bg-primary-500 text-white shadow-glow-sm hover:shadow-glow-md focus-visible:ring-primary-400",
      secondary:
        "bg-white/5 hover:bg-white/10 text-white border border-white/10 shadow-sm focus-visible:ring-primary-500",
      outline:
        "bg-transparent border border-white/10 hover:border-white/20 text-base-300 hover:text-white hover:bg-white/5 focus-visible:ring-primary-500",
      ghost:
        "bg-transparent text-base-400 hover:text-white hover:bg-white/5 border border-transparent focus-visible:ring-primary-500",
      danger:
        "bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 hover:border-red-500/30 focus-visible:ring-red-500",
    };

    const sizes = {
      sm: "text-xs px-5 py-2 rounded-full",
      md: "text-[13px] px-6 py-2.5 rounded-full",
      lg: "text-sm px-8 py-3.5 rounded-full",
      icon: "p-2.5 rounded-full",
    };

    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    // Icon sizing
    const iconSizeClass = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";

    const renderContent = () => {
      // For primary variant, we use the complex nested structure for the 3D inner glow effect
      if (variant === "primary") {
        return (
          <>
            <span className="relative z-10 drop-shadow-sm flex items-center justify-center gap-2">
              {isLoading && (
                <Loader2
                  className={`${iconSizeClass} animate-spin opacity-70`}
                />
              )}
              {!isLoading && LeftIcon && <LeftIcon className={iconSizeClass} />}
              {children}
              {!isLoading && RightIcon && (
                <RightIcon className={iconSizeClass} />
              )}
            </span>
            {/* Subtle top inner gradient highlight for 3D feel */}
            <div className="absolute inset-0 rounded-full border border-white/20 pointer-events-none" />
            <div className="absolute inset-0 rounded-full bg-linear-to-b from-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </>
        );
      }

      // For secondary and other simple variants, keep the structure flatter but still support icons
      return (
        <span className="flex items-center justify-center gap-2">
          {isLoading && (
            <Loader2 className={`${iconSizeClass} animate-spin opacity-70`} />
          )}
          {!isLoading && LeftIcon && (
            <LeftIcon className={`${iconSizeClass} opacity-70`} />
          )}
          {children}
          {!isLoading && RightIcon && (
            <RightIcon className={`${iconSizeClass} opacity-70`} />
          )}
        </span>
      );
    };

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || isLoading}
        {...props}
      >
        {renderContent()}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
