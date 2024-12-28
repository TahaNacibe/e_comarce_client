
import Navbar from './nav_bar';
import { getOnDisplayCategoriesData, getShopMetaData } from '@/app/services/navbar_services/navbar_srvices';

export default async function NavbarLoader() {
  const metaData = await getShopMetaData()
  const onDisplayCategories = await getOnDisplayCategoriesData()
    return <Navbar initialMetadata={metaData} initialCategories={onDisplayCategories} />

}
