export type Course = {
    id: string;
    name: string;
    code: string;
    professor: string;
    semester: string;
    year: number;
    department: string;
    currentStudents: number;
    alumni: number;
    prospective: number;
    difficulty: number;
    timeCommitment: number;
    avgGrade: string;
    color: string; // tailwind bg-* token
    popularity: number;
    tags: string[];
    description: string;
};


export type Reaction = { emoji: string; count: number };


export type Message = {
    id: number;
    user: string;
    userType: "current" | "alumni" | "prospective" | "instructor";
    avatar: string;
    year: string;
    message: string;
    timestamp: string;
    reactions: Reaction[];
};