export interface ILogsEntity {
    ip: string;
    code: number;
    route: string;
    method: string;
    duration: number; // ms
    headers: string;
    body: string;
    query: string;
    req_bytes: number;
    res_bytes: number;
    updated_at: Date;
}
