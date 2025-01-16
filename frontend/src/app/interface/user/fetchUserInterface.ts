export interface fetchUserInterface {
    id: number;
    firstName: string;
    email: string;
<<<<<<< HEAD
    username:string;
=======
    username: string;
>>>>>>> 503e9c07a81efc2ae80aeb2d367842cd06bc4bae
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