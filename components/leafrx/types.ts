export type Plant = {
    id: number;
    name: string;
    type: string;
    health: number;
    lastChecked: string;
    status: 'healthy' | 'warning' | 'critical';
    location: string;
    entries: number;
};

export type Scan = {
    id: number;
    plant: string;
    disease: string;
    severity: string;
    date: string;
    color: string;
};

export type TimelineEntry = {
    date: string;
    time: string;
    health: number;
    status: 'healthy' | 'warning';
    note: string;
};

export type Disease = {
    name: string;
    affected: string;
    severity: string;
    color: string;
    textColor: string;
};
