import { useState } from "react"
import { TrashIcon } from "lucide-react"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "../ui/alert-dialog"
import { Button } from "../ui/button"
import { ToastAction } from "../ui/toast";
import { toast } from '../ui/use-toast';

export default function DeleteRecordDialog({ recordId, sobject }) {
    const [isOpen, setIsOpen] = useState(false);
    const handleDelete = async () => {
        const res = await fetch(`https://did-we-sync-dev-157e15cae3f9.herokuapp.com/delete?sobject=${sobject}&id=${recordId}`, {
            credentials: "include",
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        })
        if (res.ok) {
            toast({
                variant: "default",
                description: "✅ Record deleted successfully ",
            })
            setIsOpen(false);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            console.error("Error deleting record:", res.error);
            toast({
                variant: "destructive",
                title: "Oops! 😟",
                description: res.error,
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
        }
    }
    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon" className="ml-2">
                    <TrashIcon className="h-4 w-4 text-red-500" />
                    <span className="sr-only">Delete</span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Record</AlertDialogTitle>
                    <AlertDialogDescription>
                        This record will be permanently deleted. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel >Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}