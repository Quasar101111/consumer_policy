using System.ComponentModel.DataAnnotations;

namespace policy_backend.Models
{
    public class UserDTO
    {
        [StringLength(100)]
        public string Username { get; set; }

        [StringLength(100)]
        public string FullName { get; set; }

        [StringLength(100)]
        public string Email { get; set; }

        [StringLength(100)]
        public string Password { get; set; }

    }

    public class LoginDTO
    {
        [StringLength(100)]
        public string Username { get; set; }

        [StringLength(100)]
        public string Password { get; set; }

    }
}
