interface BadgeProps {
  count?: number | string;
  className?: string;
}

const CountBadge: React.FC<BadgeProps> = ({ className, count = 0 }) => {
  return (
    <div
      className={`absolute -top-2.5 -right-2.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs ${className}`}
    >
      {count}
    </div>
  );
};

export default CountBadge;
