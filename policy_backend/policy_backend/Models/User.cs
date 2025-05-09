using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace policy_backend.Models
{
    [Table("portal_user")]
    public class User
    {
        [Key]
        [Required]
        [StringLength(100)]
        public string Username { get; set; }

        [StringLength(100)]
        public string FullName { get; set; }
        
        [StringLength(100)]
        public string Email { get; set; }

        [StringLength(100)]
        public string Password { get; set; }

        public DateTime CreatedAt { get; set; }

    }
}
