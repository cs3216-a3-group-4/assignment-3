import { Inclination } from "@/client";

export interface FaqAnswerDetails {
    id: number;
    title: string;
    description: string;
};

export interface SampleComment {
    inclination: Inclination;
    content: string;
};

export interface SamplePoint {
    positive: boolean;
    title: string;
};
