import { toast } from "react-toastify";

export const handleShare = async (title, text, url) => {
    if (navigator.share) {
        try {
            await navigator.share({
                title,
                text,
                url
            })
        } catch (error) {
            console.log(error);
        }
    } else {
        toast.warn("You are using an unsupported browser")
    }
}