import { Link } from "wouter";
import { Gender, ProductCategory } from "@/types";
import { getCategoryImage, formatCategoryName } from "@/lib/utils";

interface CategoryCardProps {
  gender: Gender;
  category: ProductCategory;
}

export function CategoryCard({ gender, category }: CategoryCardProps) {
  const imageUrl = getCategoryImage(gender, category);
  const displayName = formatCategoryName(category);
  
  return (
    <Link href={`/category/${gender}/${category}`}>
      <div className="glass-card rounded-xl overflow-hidden relative h-48 md:h-64 group cursor-pointer">
        <img 
          src={imageUrl}
          alt={`${gender}'s ${displayName}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(18,18,18,0.9)] via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-montserrat font-semibold">
            {gender === 'men' ? "Men's" : "Women's"} {displayName}
          </h3>
        </div>
      </div>
    </Link>
  );
}
