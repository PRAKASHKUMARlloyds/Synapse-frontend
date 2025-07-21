import { ResumeTable } from "./ResumeTable";

export const BulkResultDisplay =({ results }: { results: any[] })=>
    results.length > 0 ? <ResumeTable results= { results } onSelect={() => {}}/> : null;