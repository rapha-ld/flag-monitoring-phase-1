
const CustomLegend = () => {
  return (
    <div className="flex items-center space-x-2 text-xs ml-8 mt-[-10px] mb-[40px]">
      <div className="flex items-center">
        <div className="h-3 w-3 rounded-sm mr-1.5" style={{ backgroundColor: IMPACT_COLOR, opacity: 0.3 }}></div>
        <span>All flags</span>
      </div>
      <div className="flex items-center">
        <div className="h-[2px] w-6 mr-1.5" style={{ backgroundColor: THIS_FLAG_COLOR }}></div>
        <span>This flag</span>
      </div>
    </div>
  );
};
