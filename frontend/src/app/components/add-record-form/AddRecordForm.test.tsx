import { render, screen, fireEvent } from '@testing-library/react';
import AddRecordForm from './AddRecordForm'; // Make sure the path is correct
import '@testing-library/jest-dom';


describe('AddRecordForm Component', () => {
  test('renders form and checks for required fields', () => {
    render(<AddRecordForm />);


    // Check if the form fields are rendered
    const keywordField = screen.getByPlaceholderText('Keyword');
    const tagsField = screen.getByPlaceholderText('Tags (Optional)');
    const questionField = screen.getByPlaceholderText('Question');
   
    // Check if they are empty initially
    expect(keywordField).toHaveValue('');
    expect(tagsField).toHaveValue('');
    expect(questionField).toHaveValue('');
  });


  test('submit form with empty fields shows an alert', () => {
    // Mock the alert function
    global.alert = jest.fn();


    render(<AddRecordForm />);


    // Find the save button and simulate a click event
    const saveButton = screen.getByText('Save'); // Target by the button's text 'Save'
    fireEvent.click(saveButton);


    // Check if the alert function was called with the correct message
    expect(global.alert).toHaveBeenCalledWith('Please fill in all fields!');
  });
});
