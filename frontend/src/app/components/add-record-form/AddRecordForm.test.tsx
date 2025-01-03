import { render, screen, fireEvent } from '@testing-library/react';
import AddRecordForm from './AddRecordForm'; 
import '@testing-library/jest-dom';


describe('AddRecordForm Component', () => {
  test('renders form and checks for required fields', () => {
    render(<AddRecordForm />);


    const keywordField = screen.getByPlaceholderText('Keyword');
    const tagsField = screen.getByPlaceholderText('Tags (Optional)');
    const questionField = screen.getByPlaceholderText('Question');
   
    expect(keywordField).toHaveValue('');
    expect(tagsField).toHaveValue('');
    expect(questionField).toHaveValue('');
  });


  test('submit form with empty fields shows an alert', () => {
    global.alert = jest.fn();


    render(<AddRecordForm />);


    const saveButton = screen.getByText('Save'); 
    fireEvent.click(saveButton);


    expect(global.alert).toHaveBeenCalledWith('Please fill in all fields!');
  });
});
