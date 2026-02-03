import CategoryButton from "./CategoryButton";

const CategoryContainer = (props) => {
  if (!props.categories || props.categories.length === 0) {
    return null;
  }

  const handleCategoryClick = (category, index) => {
    if (props.onCategoryClick) {
      props.onCategoryClick(category, category.id, category.table_name, index, true);
    }
    if (props.onCategorySelect) {
      props.onCategorySelect(category);
    }
  };

  return (
    <>
      <div className="flex select-none items-center gap-2 overflow-x-hidden overscroll-contain scroll-smooth -mb-px gap-6 overflow-visible">
        {props.categories.map((category, index) => (
          <CategoryButton
            key={category.id ?? category.code ?? index}
            name={category.name}
            code={category.code}
            active={props.selectedCategoryIndex === index}
            onClick={() => handleCategoryClick(category, index)}
          />
        ))}
      </div>
      <div className="border-dark-grey-400 mb-6 flex items-center justify-between gap-4 border-b">
        <div className="flex w-full gap-1"></div>
      </div>
    </>
  )
}

export default CategoryContainer