//Radius of nearby search results
export const RADIUS: number = 1500, //1.5km radius
    MIN_RADIUS = 0.5,
    MAX_RADIUS = 5;

export const priceRange = [
    {
        label: "$ Budget, $18 and less ",
        value: 1
    },
    {
        label: "$$ Average, $20 - $40",
        value: 2
    },
    {
        label: "$$$ Balling, $40 - $70",
        value: 3
    },
    {
        label: "$$$$ In this Economy? $80 and up",
        value: 4
    }
];

export enum TasteType {
    Cuisine,
    Dietary
}

export enum FetchStatus {
    Idle = "idle",
    Loading = "loading",
    Success = "success",
    Failed = "failed"
}
