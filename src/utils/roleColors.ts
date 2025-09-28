/**
 * Role-based color utility
 * Returns consistent colors for all icons based on user role and filled state
 */

export interface RoleColors {
  background: string;
  icon: string;
  hover?: string;
}

export const getRoleColors = (role: string, isFilled: boolean = false): RoleColors => {
  // If input is empty, always return gray
  if (!isFilled) {
    return {
      background: 'bg-gray-100',
      icon: 'text-gray-400',
      hover: 'hover:bg-gray-200'
    };
  }

  // If input is filled, return role-based colors
  switch (role?.toLowerCase()) {
    case 'owner':
      return {
        background: 'bg-green-100',
        icon: 'text-green-500',
        hover: 'hover:bg-green-200'
      };
    case 'user':
    default:
      return {
        background: 'bg-blue-100',
        icon: 'text-blue-500',
        hover: 'hover:bg-blue-200'
      };
  }
};

export const getDefaultRoleColors = (): RoleColors => {
  return {
    background: 'bg-gray-100',
    icon: 'text-gray-400',
    hover: 'hover:bg-gray-200'
  };
};
