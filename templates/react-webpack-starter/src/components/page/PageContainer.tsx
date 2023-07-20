import cn from 'classnames';
import React from 'react';

const PageContainer: React.FC<React.BaseHTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => {
  return (
    <div className={cn(['page-container', className, props])} {...props}>
      {children}
    </div>
  );
};

export default PageContainer;
