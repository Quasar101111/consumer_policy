using Data_Logic.Models;

namespace Data_Logic.Repository
{
    public interface IUserRepository
    {
        Task<bool> ChangePassword(User user);
        Task<User> CreateUser(User user);
        Task<bool> EmailExists(string email);
        Task<User?> FindByUsername(string username);
        Task<string?> GetRole(int role);
        Task<string> GetUserIds(string username);
        Task<bool> UserNameExists(string username);
        Task<int> UsersCount();
    }
}