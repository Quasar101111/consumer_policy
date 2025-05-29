using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Data_Logic;
using Data_Logic.Models;
using Microsoft.EntityFrameworkCore;

namespace Data_Logic.Repository
{
    public class UserRepository
    {
        private readonly ApplicationDbContext _context;

        public UserRepository( ApplicationDbContext context) {
           _context = context;
        }

        public async Task<bool> EmailExists(string email) { 
        
            return await _context.Users.AnyAsync(u => u.Email == email);
        }

        public async Task<bool> UserNameExists(string username) {

            return await _context.Users.AnyAsync(u => u.Username == username);
        }

        public async Task<User> CreateUser(User user) { 
            
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User ?> FindByUsername(string username)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        }

        public async Task<string> GetUserIds(string username)
        {
            if (string.IsNullOrEmpty(username))
            {
                return null;
            }

            var user = await _context.Users
                .Where(u => u.Username == username)
                .Select(u => u.UserId.ToString())
                .FirstOrDefaultAsync();

            return user;
        }

        public async Task<bool > ChangePassword(User user) {


            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return true;

          
        }




    }
}
