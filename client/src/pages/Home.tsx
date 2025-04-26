import HeroBanner from '@/components/home/HeroBanner';
import TrendingProducts from '@/components/home/TrendingProducts';
import NewArrivals from '@/components/home/NewArrivals';
import SaleProducts from '@/components/home/SaleProducts';
import Categories from '@/components/home/Categories';
import { Helmet } from 'react-helmet';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Dripster - Streetwear Fashion</title>
        <meta name="description" content="Discover the latest streetwear fashion trends at Dripster. Shop the newest collections for men and women." />
      </Helmet>
      
      <HeroBanner />
      <TrendingProducts />
      <NewArrivals />
      <SaleProducts />
      <Categories />
    </>
  );
}
