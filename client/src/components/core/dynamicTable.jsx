import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table"
import { Building2, Crown } from "lucide-react"
import AccountDialog from "./accountDialog"
import OpportunityDialog from "./opportunityDialog"
import DeleteRecordDialog from "./deleteRecordDialog"
export default function DynamicTable({ records, singular, plural, picklistMap }) {
    let keys = [];

    records.forEach(record => {
        delete record.attributes;
    })
    if (records.length > 0) {
        const firstRecord = records[0];
        keys = Object.keys(firstRecord);
        keys.filter(key => key !== 'Id');
    }
    return (
        <div className="w-full overflow-hidden border border-[rgb(0,161,224)]">
            <div className="flex items-center justify-between bg-[rgb(0,161,224)] px-6 py-4">
                <div className="flex items-center">
                    {singular === 'Account' ? <Building2 className="h-5 w-5 mr-2 text-white" /> : <Crown className="h-5 w-5 mr-2 text-white" />}<h2 className="text-lg font-medium text-white">{plural}</h2>
                </div>
                {singular === 'Account' ? <AccountDialog picklistMap={picklistMap} action="create" /> : <OpportunityDialog picklistMap={picklistMap} action="create" />}
            </div>
            <Table>
                <TableHeader className="bg-[rgb(0,161,224)]">
                    <TableRow>
                        {keys.map((key) => (
                            key !== 'Id' && <TableHead key={key} className="text-white">{key}</TableHead>
                        ))}
                        <TableHead className="text-right text-white">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {records.map((record) => (
                        <TableRow key={record.Id}>
                            {keys.map((key) => (
                                key !== 'Id' && <TableCell className="text-left">{record[key] || "-"}</TableCell>
                            ))}
                            <TableCell className="text-right">
                                {singular === 'Account' ? <AccountDialog picklistMap={picklistMap} action="edit" record={record} /> : <OpportunityDialog picklistMap={picklistMap} action="edit" record={record} />}
                                <DeleteRecordDialog recordId={record.Id} sobject={singular} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div >
    )
}