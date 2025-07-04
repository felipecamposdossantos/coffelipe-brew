
import { Badge } from '@/components/ui/badge';
import { Achievement } from '@/hooks/useAchievements';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
}

export const AchievementBadge = ({ achievement, size = 'md' }: AchievementBadgeProps) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  return (
    <Badge
      variant="secondary"
      className={`${sizeClasses[size]} bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-medium shadow-sm`}
    >
      <span className="mr-1">{achievement.achievement_icon}</span>
      {achievement.achievement_name}
      {achievement.points_earned > 0 && (
        <span className="ml-1 text-xs opacity-90">
          +{achievement.points_earned}
        </span>
      )}
    </Badge>
  );
};
