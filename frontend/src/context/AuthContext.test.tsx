// import React from 'react';
// import { render, act } from '@testing-library/react';
// import { AuthContext, AuthProvider } from './AuthContext';
// import { useRouter } from 'next/navigation';
// import '@testing-library/jest-dom';


// // Mock `useRouter` globally
// jest.mock('next/navigation', () => ({
//     useRouter: jest.fn(),
// }));

// const mockPush = jest.fn();

// (useRouter as jest.Mock).mockImplementation(() => ({
//     push: mockPush,
// }));

// describe('AuthContext', () => {
//     beforeEach(() => {
//         localStorage.clear();
//         jest.clearAllMocks();
//     });

//     it('calls router.push("/login") on logout', () => {
//         let contextValue: any;

//         render(
//             <AuthProvider>
//                 <AuthContext.Consumer>
//                     {(value) => {
//                         contextValue = value;
//                         return null;
//                     }}
//                 </AuthContext.Consumer>
//             </AuthProvider>
//         );

//         act(() => {
//             contextValue.logout(); // Trigger logout
//         });

//         // Verify router.push was called with '/login'
//         expect(mockPush).toHaveBeenCalledWith('/login');
//         expect(mockPush).toHaveBeenCalledTimes(1); // Ensure it was called once
//     });
// });
