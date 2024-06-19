import DynamicTable from "../../components/core/dynamicTable";
import { useEffect, useState } from "react";
import { Toaster } from "../../components/ui/toaster"

export default function Opportunities() {
    const [mapOfApiAndLabel, setMapOfApiAndLabel] = useState(null);
    const [mapLabelAndPicklists, setMapLabelAndPicklists] = useState(null);

    const [records, setRecords] = useState([]);
    useEffect(() => {
        const fetchSObectDescribe = async () => {
            const opportunityDescribe = await obtainObjectDescribe('Opportunity');
            const apiLabelMap = new Map();
            opportunityDescribe.meta.fields.map((field) => (
                apiLabelMap.set(field.name, field.label)
            ))
            setRecords(opportunityDescribe.result.records);
            const pickListMap = new Map();
            const meta = opportunityDescribe.meta;
            meta.fields.forEach((m) => {
                if (m.picklistValues.length > 0)
                    pickListMap.set(m.label, m.picklistValues)
            })
            setMapLabelAndPicklists(pickListMap);
            setMapOfApiAndLabel(apiLabelMap);
        }
        fetchSObectDescribe();
    }, [])
    return mapOfApiAndLabel ? (
        <div className="flex flex-col gap-8 px-1">
            <DynamicTable records={records} singular='Opportunity' plural='Opportunities' picklistMap={mapLabelAndPicklists} />
            <Toaster />
        </div>
    ) : (
        <div className="flex h-screen w-screen justify-center items-center p-3">
            <span className="text-[rgb(0,161,224)] font-semibold">Retrieving Opportunity metadata information ...</span>
        </div>
    )
}

export const obtainObjectDescribe = async (sobject) => {
    const response = await fetch(`https://did-we-sync-dev-157e15cae3f9.herokuapp.com/fetch/sObjectDescribe?sobject=${sobject}`, {
        credentials: 'include',
        headers: {
            "Access-Control-Allow-Origin": "*",
        }
    });
    if (response.ok) return await response.json();

    return null;
}