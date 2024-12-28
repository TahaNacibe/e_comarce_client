import { LoaderCircle } from "lucide-react"

const LoadingWidget = () => {
    return (
        <div className="h-[90vh] w-full flex items-center justify-center">
            <LoaderCircle className="animate-spin" />
        </div>
    )
}

export default LoadingWidget