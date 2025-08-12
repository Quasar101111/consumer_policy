import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChangePassword from "@/app/change_password/page";
import * as api from "@/services/api";



jest.mock("@/services/api");
jest.mock('next/navigation',()=>({useRouter:jest.fn(),}))
import { useRouter } from "next/navigation";
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;
describe("ChangePassword", () => {
  
  
    
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
        push: jest.fn(),
        replace: jest.fn()
    });
    localStorage.setItem("username", "testuser");
  });

  it("renders form fields", () => {
    render(<ChangePassword />);
    expect(screen.getByLabelText('Current Password')).toBeInTheDocument();
    expect(screen.getByLabelText('New Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm New Password')).toBeInTheDocument();
  });

  it("shows error if fields are empty", async () => {
    render(<ChangePassword />);
    fireEvent.click(screen.getByRole("button", { name: /Change Password/i }));
   expect(await screen.findByText("Current Password is required.")).toBeInTheDocument();
expect(await screen.findByText("Password is required.")).toBeInTheDocument();
expect(await screen.findByText("Confirm password is required.")).toBeInTheDocument();
 });

  it("calls changePassword API on submit", async () => {
    (api.changePassword as jest.Mock).mockResolvedValue({ success: true, message: "Password changed successfully." });
    render(<ChangePassword />);
    fireEvent.change(screen.getByLabelText(/Current Password/i), { target: { value: "oldpass" } });
   fireEvent.change(screen.getByLabelText('New Password'), { target: { value: "newpass" } });

    fireEvent.change(screen.getByLabelText('Confirm New Password'), { target: { value: "newpass" } });
    fireEvent.click(screen.getByRole("button", { name: /Change Password/i }));
 await waitFor(() => {
  expect(api.changePassword).toHaveBeenCalledWith("testuser", "oldpass", "newpass");
  expect(screen.getAllByText(/Password changed successfully/i).length).toBeGreaterThan(0);
});

  });
});