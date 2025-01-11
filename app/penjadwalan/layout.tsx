import Navbar from "@/components/navbar";


export default function Template({ children }: { children: React.ReactNode }) {
    // Server-side logic here
    return (
        <div className="h-full w-full flex bg-[#DADADA] gap-5">
             <div className="h-full w-full ">
                {children}
            </div>  
        </div>
    )
}