import type { Concept, ConceptCard } from "./concepts";
export type VariantProps = {
 concept:Concept; tab:number; query:string; onQuery:(value:string)=>void;
 openDetail:(card:ConceptCard)=>void; saved:string[]; toggleSave:(title:string)=>void;
 step:number; selection:number; onSelect:(value:number)=>void;
 values:Record<string,string>; setValue:(key:string,value:string)=>void;
};
