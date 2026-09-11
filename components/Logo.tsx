const FaviconIcon = ({ size = 24, className = "" }) => {
  return (
    <img 
      src="/public/favicon.svg" 
      alt="Favicon Icon" 
      width={size} 
      height={size} 
      className={className} 
    />
  );
};

export default FaviconIcon;