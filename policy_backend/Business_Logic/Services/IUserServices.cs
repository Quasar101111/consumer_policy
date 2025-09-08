using Data_Logic.Model;
using Data_Logic.Models;

namespace Business_Logic.Services
{
    public interface IUserServices
    {
       
        Task<int?> AdminGetUsers();
        Task<int> ChangePassword(string username, string oldPassword, string newPassword);
        Task<(bool available, string message)> CheckUsernameAvailability(string username);
        Task<(bool success, string? token, string? username, string? message)> Login(LoginDTO loginDTO);
        Task<(bool success, string message)> Register(User user);
    }
}