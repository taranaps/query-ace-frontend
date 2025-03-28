// import React from 'react';
// import { render, screen, fireEvent } from '@testing-library/react';
// import AddTagPopup from './AddTagPopup';
// import "@testing-library/jest-dom";


// describe('AddTagPopup Component', () => {
//     const mockOnClose = jest.fn();
//     const mockOnAddTags = jest.fn();
//     const mockTagGroups = [
//         { tagGroupName: 'Group 1', tagNames: ['Tag 1', 'Tag 2'] },
//         { tagGroupName: 'Group 2', tagNames: ['Tag A', 'Tag B'] },
//     ];

//     beforeEach(() => {
//         jest.clearAllMocks();
//     });

//     test('renders the popup and displays the title', () => {
//         render(
//             <AddTagPopup
//                 open={true}
//                 onClose={mockOnClose}
//                 tagGroups={mockTagGroups}
//                 onAddTags={mockOnAddTags}
//             />
//         );

//         expect(screen.getByText('Add Tags')).toBeInTheDocument();
//     });

//     test('renders tag group options correctly', () => {
//         render(
//             <AddTagPopup
//                 open={true}
//                 onClose={mockOnClose}
//                 tagGroups={mockTagGroups}
//                 onAddTags={mockOnAddTags}
//             />
//         );

//         fireEvent.mouseDown(screen.getByLabelText('Tag Group'));
//         expect(screen.getByText('Group 1')).toBeInTheDocument();
//         expect(screen.getByText('Group 2')).toBeInTheDocument();
//     });

//     test('renders tag options when a group is selected', () => {
//         render(
//             <AddTagPopup
//                 open={true}
//                 onClose={mockOnClose}
//                 tagGroups={mockTagGroups}
//                 onAddTags={mockOnAddTags}
//             />
//         );

//         fireEvent.mouseDown(screen.getByLabelText('Tag Group'));
//         fireEvent.click(screen.getByText('Group 1'));

//         fireEvent.mouseDown(screen.getByLabelText('Tag Name'));
//         expect(screen.getByText('Tag 1')).toBeInTheDocument();
//         expect(screen.getByText('Tag 2')).toBeInTheDocument();
//     });

//     test('calls onAddTags with selected group and tag', () => {
//         render(
//             <AddTagPopup
//                 open={true}
//                 onClose={mockOnClose}
//                 tagGroups={mockTagGroups}
//                 onAddTags={mockOnAddTags}
//             />
//         );

//         fireEvent.mouseDown(screen.getByLabelText('Tag Group'));
//         fireEvent.click(screen.getByText('Group 1'));

//         fireEvent.mouseDown(screen.getByLabelText('Tag Name'));
//         fireEvent.click(screen.getByText('Tag 1'));

//         fireEvent.click(screen.getByText('Add Tag'));

//         expect(mockOnAddTags).toHaveBeenCalledWith({ group: 'Group 1', tag: 'Tag 1' });
//     });

//     test('disables Add Tag button if no group or tag is selected', () => {
//         render(
//             <AddTagPopup
//                 open={true}
//                 onClose={mockOnClose}
//                 tagGroups={mockTagGroups}
//                 onAddTags={mockOnAddTags}
//             />
//         );

//         const addButton = screen.getByText('Add Tag');
//         expect(addButton).toBeDisabled();

//         fireEvent.mouseDown(screen.getByLabelText('Tag Group'));
//         fireEvent.click(screen.getByText('Group 1'));
//         expect(addButton).toBeDisabled();

//         fireEvent.mouseDown(screen.getByLabelText('Tag Name'));
//         fireEvent.click(screen.getByText('Tag 1'));
//         expect(addButton).toBeEnabled();
//     });

//     test('calls onClose when Cancel button is clicked', () => {
//         render(
//             <AddTagPopup
//                 open={true}
//                 onClose={mockOnClose}
//                 tagGroups={mockTagGroups}
//                 onAddTags={mockOnAddTags}
//             />
//         );

//         fireEvent.click(screen.getByText('Cancel'));
//         expect(mockOnClose).toHaveBeenCalled();
//     });
// });
