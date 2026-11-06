import { notFound } from "next/navigation";
import { productDesigns } from "../product-data";
import { ProductApp } from "../product-v3";
export function generateStaticParams() { return productDesigns.map(({slug})=>({slug})); }
export default async function Page({params}:{params:Promise<{slug:string}>}) {
 const {slug}=await params; const concept=productDesigns.find(c=>c.slug===slug);
 if(!concept) notFound();
 return <ProductApp design={concept}/>;
}
