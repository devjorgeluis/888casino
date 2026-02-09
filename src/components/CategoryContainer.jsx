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
      <nav className="sc-grhCBx keEDki">
        <div className="sc-gcqYyY fdQKXs cy-tabs-navigation-wrapper">
          {props.categories.map((category, index) => (
            <CategoryButton
              key={category.id ?? category.code ?? index}
              name={category.name}
              code={category.code}
              image={category.image}
              active={props.selectedCategoryIndex === index}
              onClick={() => handleCategoryClick(category, index)}
            />
          ))}
        </div>
      </nav>
    </>
  )
}

export default CategoryContainer