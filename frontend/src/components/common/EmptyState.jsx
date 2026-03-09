import { Inbox } from "lucide-react";

/**
 * Reusable empty/error state component.
 * Shown when data is unavailable or a fetch fails.
 *
 * @param {Object} props
 * @param {string} [props.title] - Heading text
 * @param {string} [props.message] - Descriptive message
 * @param {Function} [props.onRetry] - Callback for retry button
 * @param {React.ReactNode} [props.icon] - Custom icon override
 */
export default function EmptyState({
  title = "No Data Available",
  message = "There's nothing to display here yet. Data will appear once the backend is connected.",
  onRetry,
  icon,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 h-full min-h-[300px]">
      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 mb-6">
        {icon || <Inbox className="w-10 h-10 text-base-500" />}
      </div>
      <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
      <p className="text-base-400 text-sm max-w-sm mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all py-2 px-5 rounded-xl text-sm font-medium outline-none"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
