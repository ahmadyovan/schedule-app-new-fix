import Navbar from "@/components/navbar";

export default function Template({ children }: { children: React.ReactNode }) {
    // Server-side logic here
    return (
        <div className="h-screen w-screen flex flex-col bg-[#DADADA] text-xs font-sans">
            {children}  
        </div>
    )
}