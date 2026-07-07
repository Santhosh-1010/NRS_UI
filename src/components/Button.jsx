const VARIANTS = {
  primary: 'bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium rounded-md transition-colors',
  danger: 'bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-medium rounded-md transition-colors',
  neutral: 'bg-slate-100 hover:bg-slate-200 disabled:opacity-60 text-slate-700 font-medium rounded-md transition-colors',
  icon: 'flex items-center justify-center h-8 w-8 rounded-lg transition-colors disabled:opacity-60',
};

const ICON_COLORS = {
  blue: 'text-blue-600 hover:bg-blue-50',
  red: 'text-red-600 hover:bg-red-50',
};

export default function Button({
  variant = 'primary',
  iconColor,
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) {
  const sizeClass = variant === 'icon' ? '' : size === 'sm' ? 'text-sm px-4 py-1.5' : 'px-4 py-1.5';
  const widthClass = fullWidth ? 'w-full' : '';
  const iconColorClass = variant === 'icon' ? ICON_COLORS[iconColor] || ICON_COLORS.blue : '';

  const classNames = [VARIANTS[variant], sizeClass, widthClass, iconColorClass, className]
    .filter(Boolean)
    .join(' ');

  return <button className={classNames} {...props} />;
}
