using System.ComponentModel.DataAnnotations;

namespace Data_Logic.Models
{
    public class UserDTO
    {

        public int UserId { get; set; }
        
        [StringLength(100)]
        public string Username { get; set; }

        [StringLength(100)]
        public string FullName { get; set; }

        [StringLength(100)]
        public string Email { get; set; }

        [StringLength(100)]
        public string Password { get; set; }

        public int role {  get; set; }

    }

    public class LoginDTO
    {
        [StringLength(100)]
        public string Username { get; set; }

        [StringLength(100)]
        public string Password { get; set; }

    }

    public class ChangePasswordDTO
    {
        [Required]
        [StringLength(100)]
        public string Username { get; set; }

        [Required]
        [StringLength(100)]
        public string CurrentPassword { get; set; }

        [Required]
        [StringLength(100)]
        public string NewPassword { get; set; }
    }
}
