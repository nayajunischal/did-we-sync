import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ToastAction } from "../ui/toast";
import { toast } from '../ui/use-toast';
import { useState } from "react";
import { FilePenIcon } from "lucide-react"
import { replaceNullValues } from "./opportunityDialog"
export default function AccountDialog({ picklistMap, record, action }) {
    record = replaceNullValues(record);
    const [isOpen, setIsOpen] = useState(false);
    const phonePattern = /^\+?(\d{1,3})?[-.\s]?(\(?\d{1,4}\)?)[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})$/;

    const FormSchema = z.object({
        Name: z
            .string()
            .min(1, {
                message: "Account name is required",
            }),
        Industry: z.string().optional(),
        Type: z.string().optional(),
        Phone: z.string().refine(val => val === '' || phonePattern.test(val), {
            message: "Invalid phone number format",
        }),
        Website: z.string().optional(),
        BillingState: z.string().optional(),
        ShippingState: z.string().optional()

    })
    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: record ? {
            ...record
        } : {
            Name: "",
            BillingState: "",
            ShippingState: "",
            Industry: "",
            Type: "",
            Phone: "",
            Website: ""
        }
    })
    const { handleSubmit } = form;
    const AccountTypePicklists = picklistMap.get('Account Type')
    const IndustryPicklists = picklistMap.get('Industry')
    const onSubmit = async (values) => {
        let res;
        if (action === 'create') {
            res = await fetch("https://did-we-sync-dev-157e15cae3f9.herokuapp.com/create?sobject=Account", {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify(values)
            })
        } else {
            values.Id = record.Id
            res = await fetch("https://did-we-sync-dev-157e15cae3f9.herokuapp.com/update?sobject=Account", {
                credentials: "include",
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify(values)
            })
        }

        if (res.ok) {
            toast({
                variant: "default",
                description: action === 'create' ? "✅ Record created successfully" : " ✅ Record updated successfully",
            })
            setIsOpen(false);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else {
            toast({
                variant: "destructive",
                title: "Oops! 😟",
                description: res.error,
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {action === 'create' ? <Button variant="outline" className="text-[rgb(0,161,224)]">Create Account</Button> :
                    <Button variant="outline" size="icon">
                        <FilePenIcon className="h-4 w-4 text-[rgb(0,161,224)]" />
                        <span className="sr-only">Edit</span>
                    </Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                {action === 'create' ? (
                    <DialogHeader className="text-[rgb(0,161,224)]">
                        <DialogTitle>Create Account</DialogTitle>
                        <DialogDescription>Fill out the form to create a new account.</DialogDescription>
                    </DialogHeader>
                ) : (
                    <DialogHeader className="text-[rgb(0,161,224)]">
                        <DialogTitle>Edit {record.Name}</DialogTitle>
                        <DialogDescription>Edit this record.</DialogDescription>
                    </DialogHeader>
                )}
                <Form {...form}>
                    <form className="grid gap-4 py-4" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="Name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Account Name</FormLabel>
                                                <FormControl>
                                                    <Input id="Name" placeholder="Enter account name" required {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                </div>
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="BillingState"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Billing State</FormLabel>
                                                <FormControl>
                                                    <Input id="BillingState" type="text" placeholder="NZ" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="Phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone</FormLabel>
                                                <FormControl>
                                                    <Input id="Phone" type="tel" placeholder="(123) 456-7890" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                </div>
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="Type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Type</FormLabel>
                                                <FormControl>
                                                    <Select {...field} onValueChange={field.onChange} id="Type">
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select type" />
                                                        </SelectTrigger>
                                                        <SelectContent >
                                                            {AccountTypePicklists.map((type) => (
                                                                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="ShippingState"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Billing State</FormLabel>
                                                <FormControl>
                                                    <Input id="shippingState" type="text" placeholder="NZ" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                </div>
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="Industry"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Industry</FormLabel>
                                                <FormControl>
                                                    <Select {...field} onValueChange={field.onChange}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select industry" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {IndustryPicklists.map((industry) => (
                                                                <SelectItem key={industry.value} value={industry.value}>
                                                                    {industry.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <FormField
                                    control={form.control}
                                    name="Website"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Website</FormLabel>
                                            <FormControl>
                                                <Input id="website" type="url" placeholder="https://example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" className="ml-auto bg-[rgb(0,161,224)]">
                                Save
                            </Button>
                            <div>
                                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}


