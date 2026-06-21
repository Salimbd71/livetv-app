interface CategoryFilterProps {
  categories: string[];
  active: string;
  onSelect: (cat: string) => void;
}

const CategoryFilter = ({ categories, active, onSelect }: CategoryFilterProps) => (
  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
    {categories.map((cat) => (
      <button
        key={cat}
        onClick={() => onSelect(cat)}
        className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition ${
          active === cat
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-channel-hover"
        }`}
      >
        {cat}
      </button>
    ))}
  </div>
);

export default CategoryFilter;
