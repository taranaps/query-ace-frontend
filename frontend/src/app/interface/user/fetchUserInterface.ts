export interface fetchUserInterface {
    id: number;
    firstName: string;
    email: string;
    location: string;
    status: "ACTIVE" | "INACTIVE";
    isActive: boolean;
    timestamp: Date;
    roles: {
        id: number;
        roleName: string;
    }[];
}