namespace policy_backend.Models
{
    public class UserDTO
    {
         
        public string Username { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    
}

    public class LoginDTO
    { 
        public string Username { get; set; }
        public string Password { get; set; }
    
    }
}
