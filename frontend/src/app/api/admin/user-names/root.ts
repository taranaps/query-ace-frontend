import { API_BASE_URL } from '@/config/apiConfig';
import { UserDTO } from 'types/system-log';


export const fetchUserNames = async (token: string | null): Promise<UserDTO[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/users-names`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            return [];
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching user names:', error);
        return [];
    }
};