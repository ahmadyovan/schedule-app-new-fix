import Navbar from "@/components/navbar";


export default function Template({ children }: { children: React.ReactNode }) {
    // Server-side logic here
    return (
        <div className="h-full w-full flex flex-col bg-[#DADADA] gap-5">
             <div className="h-full w-full px-5 sm:px-10">
                {children}
            </div>  
        </div>
    )
}