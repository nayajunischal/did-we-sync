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
import { FilePenIcon, CalendarIcon } from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover"
import { Calendar } from "../ui/calendar"
import { cn } from "../../lib/utils"
import { format } from "date-fns"

export default function OpportunityDialog({ picklistMap, record, action }) {
    record = replaceNullValues(record);
    console.log('Got record', record);
    const [isOpen, setIsOpen] = useState(false);
    if (record) {
        record.CloseDate = !record.CloseDate ? new Date() : new Date(record.CloseDate);
    }

    const FormSchema = z.object({
        Name: z
            .string()
            .min(1, {
                message: "Opportunity Name is required",
            }),
        AccountId: z.string().optional(),
        Amount: z.number().min(0, 'Amount must be non-negative').nonnegative('Amount is required'),
        CloseDate: z.date({
            required_error: "Close Date is required.",
        }),
        StageName: z.string().min(1, { message: 'Stage is required', path: ['stage'] }),
    })
    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: record ? {
            ...record
        } : {
            Name: "",
            AccountId: "",
            CloseDate: new Date(),
            StageName: "",
            Amount: 0
        }
    })
    const { handleSubmit } = form;
    const StagePicklists = picklistMap.get('Stage')
    const onSubmit = async (values) => {
        console.log(values);
        let res;
        if (action === 'create') {
            res = await fetch("https://did-we-sync-dev-157e15cae3f9.herokuapp.com/create?sobject=Opportunity", {
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
            res = await fetch("https://did-we-sync-dev-157e15cae3f9.herokuapp.com/update?sobject=Opportunity", {
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
                {action === 'create' ? <Button variant="outline" className="text-[rgb(0,161,224)]">Create Opportunity</Button> :
                    <Button variant="outline" size="icon">
                        <FilePenIcon className="h-4 w-4 text-[rgb(0,161,224)]" />
                        <span className="sr-only">Edit</span>
                    </Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                {action === 'create' ? (
                    <DialogHeader className="text-[rgb(0,161,224)]">
                        <DialogTitle>Create Opportunity</DialogTitle>
                        <DialogDescription>Fill out the form to create a new opportunity.</DialogDescription>
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
                                                <FormLabel>Opportunity Name</FormLabel>
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
                                        name="AccountId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Account</FormLabel>
                                                <FormControl>
                                                    <Input id="AccountId" type="text" placeholder="Enter account" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    {/* <FormField
                                        control={form.control}
                                        name="CloseDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Close Date</FormLabel>
                                                <FormControl>
                                                    <Popover >
                                                        <PopoverTrigger asChild>
                                                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                                <CalendarDaysIcon className="mr-1 h-4 w-4 -translate-x-1" />
                                                                Select date
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={field.value}
                                                                onSelect={field.onChange}
                                                                disabled={(date) =>
                                                                    date > new Date().toISOString() || date < new Date("1900-01-01")
                                                                }
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} /> */}
                                    <FormField
                                        control={form.control}
                                        name="CloseDate"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Date of birth</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-[240px] pl-3 text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "PPP")
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            defaultValue={new Date()}
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            initialFocus
                                                            {...field}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="StageName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Stage</FormLabel>
                                                <FormControl>
                                                    <Select {...field} onValueChange={field.onChange} id="StageName" required>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select stage" />
                                                        </SelectTrigger>
                                                        <SelectContent >
                                                            {StagePicklists.map((stage) => (
                                                                <SelectItem key={stage.value} value={stage.value}>{stage.label}</SelectItem>
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
                                        name="Amount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Amount</FormLabel>
                                                <FormControl>
                                                    <Input id="Amount" type="number" placeholder="Enter amount" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                </div>
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

export const replaceNullValues = (obj) => {
    for (let key in obj) {
        if (obj[key] === null) {
            obj[key] = '';
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            replaceNullValues(obj[key]);
        }
    }
    return obj;
};

