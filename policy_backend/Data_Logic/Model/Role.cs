using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data_Logic.Models
{
    [Table("portal_roles")]

    public class Role {
        [Key]
        public int role_id {  get; set; }

        public string roles { get; set; }

    }
}
