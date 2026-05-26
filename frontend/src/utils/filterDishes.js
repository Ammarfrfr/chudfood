export const filterDishes = (dishes, filters) => {
  if (!dishes || !Array.isArray(dishes)) return [];

  return dishes.filter((dish) => {
    // Filter by veg/non-veg
    if (filters.isVeg !== undefined && filters.isVeg !== null) {
      if (dish.isVeg !== filters.isVeg) return false;
    }

    // Filter by max price
    if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
      if (dish.price > filters.maxPrice) return false;
    }

    // Filter by area
    if (filters.area && filters.area !== 'All Mumbai') {
      if (dish.area !== filters.area) return false;
    }

    // Filter by cuisine
    if (filters.cuisine && filters.cuisine !== 'All') {
      if (dish.cuisine !== filters.cuisine) return false;
    }

    return true;
  });
};

