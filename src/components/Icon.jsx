import React from 'react';
import * as Icons from 'lucide-react';

const Icon = ({ name, size = 24, className = '', ...props }) => {
  // Map kebab-case or camelCase names to Lucide icon components
  const formatName = (str) => {
    if (!str) return 'HelpCircle';
    // capitalize first letter and handle camelCase
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const IconComponent = Icons[formatName(name)] || Icons.HelpCircle;

  return <IconComponent size={size} className={className} {...props} />;
};

export default Icon;
