
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "../ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form"
import { Textarea } from "../ui/textarea"
import { toast } from "../ui/use-toast"
const FormSchema = z.object({
    query: z
        .string()
        .min(1, {
            message: "Query cannot be empty",
        }),
})

export function QueryBox() {
    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            query: ""
        }
    })
    const { handleSubmit } = form;

    function onSubmit(data) {
        toast({
            title: "You entered the following query:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 text-wrap">
                    <code className="text-white">{JSON.stringify(data)}</code>
                </pre>
            ),
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-2 ">
                <FormField
                    control={form.control}
                    name="query"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="w-24">Query<span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="SELECT Id, Name FROM Account LIMIT 1"
                                    className=""
                                    {...field}

                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-24">Submit</Button>
            </form>
        </Form>
    )
}
