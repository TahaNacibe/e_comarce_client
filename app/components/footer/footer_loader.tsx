import { getShopMetaData } from "@/app/services/navbar_services/navbar_services";
import Footer from "./footer_component";



export default async function FooterLoader() {
    const metaData = await getShopMetaData()

    return <Footer metaData={metaData as any} />
}