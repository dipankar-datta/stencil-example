import { type } from "os";

export type OlympicWinner = {
    athlete: string;
    age: number;
    country: string;
    year: number;
    date: string;
    sport: string;
    silver: number;
    bronze: number;
    gold: number;
    total: number;
};

export type Filter = {
    country: string
    year: number;
};