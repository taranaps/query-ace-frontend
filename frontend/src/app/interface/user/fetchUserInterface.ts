export interface fetchUserInterface {
    id: number;
    firstName: string;
    email: string;
    username:string;
    location: string;
    status: "ACTIVE" | "INACTIVE";
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    roles: {
        id: number;
        roleName: string;
    }[];
}