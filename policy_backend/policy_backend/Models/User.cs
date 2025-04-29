using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace policy_backend.Models
{
    [Table("tbl_user")]
    public class User
    {
        [Key]
        [Required]
        public string Username { get; set; }

        public string FullName { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public DateTime CreatedAt { get; set; }

    }
}
