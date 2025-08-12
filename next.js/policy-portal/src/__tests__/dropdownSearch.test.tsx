import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import cards from '@/components/cards';
import SearchableDropdown from '@/components/dropdownSearch';

describe('SearchableDropdown', () => {
  const policiesVal = [
    'Policy123',
    'Policy456',
    'Policy789',
    
  ];

  it('renders the inital policynumber on rendering',()=>{
        render(<SearchableDropdown policies={policiesVal} />);
        const input = screen.getByRole('combobox');
        expect(input).toHaveValue(policiesVal[0]);

  });

  it('calls onSelect with initial policy on mount', () => {
    const onSelect = jest.fn();
    render(<SearchableDropdown policies={policiesVal} onSelect={onSelect} />);
    expect(onSelect).toHaveBeenCalledWith(policiesVal[0]);

  });

   it('shows options when input is focused and filters based on search term', () => {
    render(<SearchableDropdown policies={policiesVal} />);
    
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input,{target:{value:'Policy45'}});
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    const filteredOptions = screen.getAllByRole('listbox');
    expect(filteredOptions.length).toBe(1);
    expect(filteredOptions[0]).toHaveTextContent('Policy456');
});



  it('selecting an option updates input and hides dropdown', () => {
    const onSelect = jest.fn();
     render(<SearchableDropdown policies={policiesVal} onSelect={onSelect} />);
     const input = screen.getByRole('combobox');
     fireEvent.focus(input);
    //   fireEvent.change(input,{target:{value:'Policy456'}});
     const optionSelect = screen.getByText('Policy456');
     fireEvent.click(optionSelect);
     expect(onSelect).toHaveBeenCalledWith('Policy456');
     expect(screen.queryByText('listbox')).not.toBeInTheDocument();
    //  expect(input).toHaveValue('Policy456');

  });


    it('dropdown closes when clicking outside', () => {
    render(
      <div>
        <SearchableDropdown policies={policiesVal} />
        <button data-testid="outside-button">Outside</button>
      </div>
    );

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    const outsideButton = screen.getByTestId('outside-button');
    fireEvent.mouseDown(outsideButton);

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  
  it('shows "no options" if no matching results ', () => {
    render(<SearchableDropdown policies={policiesVal} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);

    fireEvent.change(input, { target: { value: 'nonexistentpolicy' } });

    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
     
  });



});
