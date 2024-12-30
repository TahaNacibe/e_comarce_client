
import { getOnDisplayCategoriesData, getShopMetaData } from '@/app/services/navbar_services/navbar_services';
import Navbar from './nav_bar';

export default async function NavbarLoader() {
  const metaData = await getShopMetaData()
  const onDisplayCategories = await getOnDisplayCategoriesData()
    return <Navbar initialMetadata={metaData} initialCategories={onDisplayCategories} />

}
