import { cn } from "@/lib/utils"
import { LoaderCircleIcon } from "lucide-react";

const Loader=({className}:{className?:string})=>{
    const combinedClassName=cn("my-28 h-16 w-16 text-primary/60 animate-spin text-white items-center",className);
    return <LoaderCircleIcon className={combinedClassName} />;
};
export default Loader;