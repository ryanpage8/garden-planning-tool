export interface Plant {
    id: string;
    name: string;
    position: { x: number; y: number };
}

export interface Plot {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    plants: string[] | number[];
}

export interface Garden {
    id: string;
    name: string;
    plots: Plot[];
}
