const CategoryButton = ({ name, active = false, onClick }) => {
  const baseClass = `
    aria-disabled:cursor-not-allowed 
    aria-disabled:opacity-75 
    flex-shrink-0 
    disabled:cursor-not-allowed 
    disabled:opacity-30 
    disabled:text-theme-secondary-500 
    focus:text-theme-secondary-600 
    focus-visible:outline-0 
    inline-flex 
    items-center 
    justify-center 
    gap-3 
    rounded-none 
    border-b-2 
    border-b-transparent 
    px-0 
    py-4 
    font-light 
    text-md 
    text-dark-grey-100 
    hover:border-b-theme-secondary-500 
    hover:text-theme-secondary-500 
    transition-all 
    duration-200
  `;

  const activeClass = active
    ? ' !border-b-theme-secondary-500 text-theme-secondary-500 font-medium'
    : '';

  return (
    <button
      type="button"
      className={`${baseClass}${activeClass}`}
      onClick={onClick}
    >
      <span>{name}</span>
    </button>
  );
};

export default CategoryButton;