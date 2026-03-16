import React from 'react';
import * as Icons from 'lucide-react';

const Icon = ({ name, size = 24, className = '', ...props }) => {
  const formatName = (str) => {
    if (!str) return 'HelpCircle';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const IconComponent = Icons[formatName(name)] || Icons.HelpCircle;

  return <IconComponent size={size} className={className} {...props} />;
};

export default Icon;
