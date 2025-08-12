import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import cards from '@/components/cards';
import PolicyDetailsTabs from '@/app/view_policy/components/detailsTab';
import DetailCard,{DetailCardProps} from '@/components/cards';

describe("Details card",()=>{
    const baseProps : DetailCardProps={
        title: 'title name',
        fields:{
            name: 'abc',
            email: 'abc@gmail.com',
            address: undefined,
            phone: null
        },
    };

   it("renders the tile and all the fields",()=>{
    render (<DetailCard {...baseProps} />);
    expect(screen.getByText(baseProps.title)).toBeInTheDocument();
    Object.keys(baseProps.fields).forEach((label)=>{
         expect(screen.getByText(label)).toBeInTheDocument();
    })
    expect(screen.getByText('abc')).toBeInTheDocument();
    expect(screen.getByText('abc@gmail.com')).toBeInTheDocument();
    const naElements = screen.getAllByText("N/A");
    expect(naElements.length).toBe(2);
    naElements.forEach((el) => {
      expect(el).toHaveClass("text-gray-400");
    });

   });
   
   it("adds custom className if provided", () => {
    const className = "custom-class";
    const { container } = render(<DetailCard {...baseProps} className={className} />);
    expect(container.firstChild).toHaveClass("custom-class");
  });

})


