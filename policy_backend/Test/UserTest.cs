using System;
using System.Threading.Tasks;
using Xunit;
using Moq;
using Microsoft.Extensions.Configuration;
using Business_Logic.Services;
using Data_Logic.Models;
using Data_Logic.Repository;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Business_Logic.Services.Tests
{
    public class UserServicesTest
    {
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IConfiguration> _configurationMock;
        private readonly UserServices _userServices;

        public UserServicesTest()
        {
            _userRepositoryMock = new Mock<IUserRepository>();
            _configurationMock = new Mock<IConfiguration>();

            string key = "thisisaverysecureandlongkey123456"; 
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            _configurationMock.Setup(c => c["Jwt:Key"]).Returns("thisisaverysecureandlongkey123456");
            _configurationMock.Setup(c => c["Jwt:Issuer"]).Returns("TestIssuer");
            _configurationMock.Setup(c => c["Jwt:Audience"]).Returns("TestAudience");
            _userServices = new UserServices(_userRepositoryMock.Object, _configurationMock.Object);
        }

        [Fact]
        public async Task Register_WhenEmailAlreadyExists()
        {
            var user = new User { Email = "test@example.com", Password = "password123" };
            _userRepositoryMock.Setup(r => r.EmailExists(user.Email)).ReturnsAsync(true);

            var result = await _userServices.Register(user);

            Assert.False(result.success);
            Assert.Equal("Email already exists", result.message);
            _userRepositoryMock.Verify(r => r.CreateUser(It.IsAny<User>()), Times.Never);
        }

        [Fact]
        public async Task Register_WhenEmailDoesNotExist()
        {
            var user = new User { Email = "unique@example.com", Password = "password123" };
            _userRepositoryMock.Setup(r => r.EmailExists(user.Email)).ReturnsAsync(false);
            
            _userRepositoryMock
    .Setup(r => r.CreateUser(It.IsAny<User>()))
    .ReturnsAsync((User u) => u); 

            var result = await _userServices.Register(user);

            Assert.True(result.success);
            Assert.Equal("User registered successfully", result.message);
            _userRepositoryMock.Verify(r => r.CreateUser(It.Is<User>(u =>
                u.Email == user.Email &&
                !string.IsNullOrEmpty(u.Password) &&
                u.Password != "password123" &&
                u.CreatedAt != default
            )), Times.Once);
        }

        [Fact]
        public async Task Login_WhenUserNotFound()
        {
            var loginDto = new LoginDTO { Username = "nouser", Password = "pass" };
            _userRepositoryMock.Setup(r => r.FindByUsername(loginDto.Username)).ReturnsAsync((User)null);

            var result = await _userServices.Login(loginDto);

            Assert.False(result.success);
            Assert.Null(result.token);
            Assert.Null(result.username);
            Assert.Equal("Invalid username or password", result.message);
        }

        [Fact]
        public async Task Login_WhenPasswordDoesNotMatch()
        {
            var user = new User { Username = "user", Password = BCrypt.Net.BCrypt.HashPassword("correctpass"), Email = "user@email.com" };
            var loginDto = new LoginDTO { Username = "user", Password = "wrongpass" };
            _userRepositoryMock.Setup(r => r.FindByUsername(loginDto.Username)).ReturnsAsync(user);

            var result = await _userServices.Login(loginDto);

            Assert.False(result.success);
            Assert.Null(result.token);
            Assert.Null(result.username);
            Assert.Equal("Invalid username or password", result.message);
        }

        [Fact]
        public async Task Login_WhenCorrect()
        {
            var user = new User { Username = "user", Password = BCrypt.Net.BCrypt.HashPassword("correctpass"), Email = "user@email.com" };
            var loginDto = new LoginDTO { Username = "user", Password = "correctpass" };
            _userRepositoryMock.Setup(r => r.FindByUsername(loginDto.Username)).ReturnsAsync(user);

            var result = await _userServices.Login(loginDto);

            Assert.True(result.success);
            Assert.NotNull(result.token);
            Assert.Equal("user", result.username);
            Assert.Equal("Login Successful", result.message);
        }

        [Theory]
        [InlineData(true, false, "Username already taken")]
        [InlineData(false, true, "Username available")]
        public async Task CheckUsernameAvailability_ReturnsExpectedResult(bool exists, bool expectedAvailable, string expectedMessage)
        {
            _userRepositoryMock.Setup(r => r.UserNameExists("testuser")).ReturnsAsync(exists);

            var result = await _userServices.CheckUsernameAvailability("testuser");

            Assert.Equal(expectedAvailable, result.available);
            Assert.Equal(expectedMessage, result.message);
        }

        [Fact]
        public async Task ChangePassword_WhenUserNotFound()
        {
            _userRepositoryMock.Setup(r => r.FindByUsername("nouser")).ReturnsAsync((User)null);

            var result = await _userServices.ChangePassword("nouser", "old", "new");

            Assert.Equal(1, result);
        }

        [Fact]
        public async Task ChangePassword_WhenOldPasswordDoesNotMatch()
        {
            var user = new User { Username = "user", Password = BCrypt.Net.BCrypt.HashPassword("correctpass") };
            _userRepositoryMock.Setup(r => r.FindByUsername("user")).ReturnsAsync(user);

            var result = await _userServices.ChangePassword("user", "wrongpass", "newpass");

            Assert.Equal(1, result);
        }

        [Fact]
        public async Task ChangePassword_WhenPasswordChangedSuccessfully()
        {
            var user = new User { Username = "user", Password = BCrypt.Net.BCrypt.HashPassword("oldpass") };
            _userRepositoryMock.Setup(r => r.FindByUsername("user")).ReturnsAsync(user);
            _userRepositoryMock.Setup(r => r.ChangePassword(It.IsAny<User>())).ReturnsAsync(true);

            var result = await _userServices.ChangePassword("user", "oldpass", "newpass");

            Assert.Equal(0, result);

            _userRepositoryMock.Verify(r => r.ChangePassword(It.IsAny<User>()), Times.Once);


        }

        [Fact]
        public async Task ChangePassword_Returns2_WhenRepositoryFailsToChangePassword()
        {
            var user = new User { Username = "user", Password = BCrypt.Net.BCrypt.HashPassword("oldpass") };
            _userRepositoryMock.Setup(r => r.FindByUsername("user")).ReturnsAsync(user);
            _userRepositoryMock.Setup(r => r.ChangePassword(It.IsAny<User>())).ReturnsAsync(false);

            var result = await _userServices.ChangePassword("user", "oldpass", "newpass");

            Assert.Equal(2, result);
        }
    }
}
