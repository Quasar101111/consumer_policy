using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;
using Business_Logic.Services;
using Data_Logic.Repository;
using Moq;
using Data_Logic.Model;

namespace Test
{
    public class PolicyTest
    {
        private readonly IPolicyServices _policyServices;
        private readonly Mock<IPolicyRepository> _policyRepositoryMock;
        private readonly Mock<IPolicyViewRepository> _policyViewRepositoryMock;
        private readonly Mock<IUserRepository> _userRepositoryMock;

        public PolicyTest()
        {
            _policyRepositoryMock = new Mock<IPolicyRepository>();
            _userRepositoryMock = new Mock<IUserRepository>();
            _policyViewRepositoryMock = new Mock<IPolicyViewRepository>();
            _policyServices = new PolicyServices(
                _policyRepositoryMock.Object,
                _userRepositoryMock.Object,
                _policyViewRepositoryMock.Object
            );
        }

        [Fact]
        public async Task FindPolicy_PolicyNotFoundorChassisFound()
        {

            _policyRepositoryMock.Setup(r => r.CheckPolicyExists("P1")).ReturnsAsync(0);
            _policyRepositoryMock.Setup(r => r.CheckChassisExists("C1")).ReturnsAsync(1);

            var result = await _policyServices.FindPolicy("P1", "C1");
            Assert.Equal("Policy  or Vehicle not found", result.GetType().GetProperty("Message").GetValue(result));
        }

        [Fact]
        public async Task FindPolicy_PolicyFoundChassisNotFound()
        {

            _policyRepositoryMock.Setup(r => r.CheckPolicyExists("P1")).ReturnsAsync(1);
            _policyRepositoryMock.Setup(r => r.CheckChassisExists("C1")).ReturnsAsync(0);

            var result = await _policyServices.FindPolicy("P1", "C1");
            Assert.Equal("Policy  or Vehicle not found", result.GetType().GetProperty("Message").GetValue(result));
        }

        [Fact]
        public async Task FindPolicy_PolicyAndVehicleDoNotMatch()
        {
            _policyRepositoryMock.Setup(r => r.CheckPolicyExists("P1")).ReturnsAsync(1);
            _policyRepositoryMock.Setup(r => r.CheckChassisExists("C1")).ReturnsAsync(1);
            _policyRepositoryMock.Setup(r => r.CheckPolicyVehicleExists("P1", "C1")).ReturnsAsync(0);

            var result = await _policyServices.FindPolicy("P1", "C1");

            Assert.Equal("Policy and vehicle do not match", result.GetType().GetProperty("Message").GetValue(result));
        }

        [Fact]
        public async Task GetBasicDetails_WhenAllExists()
        {

            _policyRepositoryMock.Setup(r => r.CheckPolicyExists("P1")).ReturnsAsync(1);
            _policyRepositoryMock.Setup(r => r.CheckChassisExists("C1")).ReturnsAsync(1);
            _policyRepositoryMock.Setup(r => r.CheckPolicyVehicleExists("P1", "C1")).ReturnsAsync(1);

            var expectedDetails = new { PolicyNo = "P1", ChassisNo = "C1" };
            _policyRepositoryMock.Setup(r => r.GetBasicDetails("P1", "C1")).ReturnsAsync(expectedDetails);

            var result = await _policyServices.FindPolicy("P1", "C1");

            Assert.Equal(expectedDetails, result);
        }

        [Fact]
        public async Task AddUserPolicy_WhenUserDoesNotExist()
        {
            _userRepositoryMock.Setup(r => r.GetUserIds("user1")).ReturnsAsync((string)null);

            var result = await _policyServices.AddUserPolicy("P1", "user1");

            Assert.Equal("Username not found", result.GetType().GetProperty("Message").GetValue(result));
        }

        [Fact]
        public async Task AddUserPolicy_WhenAddPolicyReturns1()
        {
            _userRepositoryMock.Setup(r => r.GetUserIds("user1")).ReturnsAsync("U1");
            _policyRepositoryMock.Setup(r => r.AddPolicy("P1", "U1")).ReturnsAsync(1);

            var result = await _policyServices.AddUserPolicy("P1", "user1");

            Assert.Equal("Policy is added ", result.GetType().GetProperty("Message").GetValue(result));
        }

        [Fact]
        public async Task AddUserPolicy_WhenAddPolicyReturns2()
        {
            _userRepositoryMock.Setup(r => r.GetUserIds("user1")).ReturnsAsync("U1");
            _policyRepositoryMock.Setup(r => r.AddPolicy("P1", "U1")).ReturnsAsync(2);

            var result = await _policyServices.AddUserPolicy("P1", "user1");

            Assert.Equal("Already Added", result.GetType().GetProperty("Message").GetValue(result));
        }

        [Fact]
        public async Task AddUserPolicy_WhenAddPolicyReturnsOther()
        {
            _userRepositoryMock.Setup(r => r.GetUserIds("user1")).ReturnsAsync("U1");
            _policyRepositoryMock.Setup(r => r.AddPolicy("P1", "U1")).ReturnsAsync(0);

            var result = await _policyServices.AddUserPolicy("P1", "user1");

            Assert.Equal("Failed to add policy. Try again.", result.GetType().GetProperty("Message").GetValue(result));
        }


        [Fact]
        public async Task DeletePolicy_WhenPolicyIsDeleted()
        {

            int policyId = 1;
            _policyRepositoryMock.Setup(s => s.DeletePolicy(policyId)).ReturnsAsync(true);

            var result = await _policyServices.DeletePolicy(policyId);

            Assert.True(result);
            _policyRepositoryMock.Verify(r => r.DeletePolicy(policyId), Times.Once);

        }

        [Fact]
        public async Task DeletePolicy_WhenPolicyDoesNotExist()
        {

            int policyId = 999;
            _policyRepositoryMock.Setup(s => s.DeletePolicy(policyId)).ReturnsAsync(false);

            var result = await _policyServices.DeletePolicy(policyId);

            Assert.False(result);
        }


        [Fact]
        public async Task GetPolicyNumbersWithStatus_ReturnsFalseAndNull_WhenNoPoliciesFound()
        {
            _userRepositoryMock.Setup(r => r.GetUserIds("user1")).ReturnsAsync("U1");
            _policyViewRepositoryMock.Setup(r => r.GetPolicyNumbersWithStatus("U1")).ReturnsAsync((List<PolicyInfo>)null);

            var (success, result) = await _policyServices.GetPolicyNumbersWithStatus("user1");

            Assert.False(success);
            Assert.Null(result);
        }

        [Fact]
        public async Task GetPolicyNumbersWithStatus_ReturnsFalseAndNull_WhenEmptyListReturned()
        {
            _userRepositoryMock.Setup(r => r.GetUserIds("user1")).ReturnsAsync("U1");
            _policyViewRepositoryMock.Setup(r => r.GetPolicyNumbersWithStatus("U1")).ReturnsAsync(new List<PolicyInfo>());

            var (success, result) = await _policyServices.GetPolicyNumbersWithStatus("user1");

            Assert.False(success);
            Assert.Null(result);
        }

        [Fact]
        public async Task GetPolicyNumbersWithStatus_ReturnsTrueAndList_WhenPoliciesFound()
        {
            var policies = new List<PolicyInfo>
    {
        new PolicyInfo { PolicyNumber = "P1", Status = "Active" },
        new PolicyInfo { PolicyNumber = "P2", Status = "Inactive" }
    };
            _userRepositoryMock.Setup(r => r.GetUserIds("user1")).ReturnsAsync("U1");
            _policyViewRepositoryMock.Setup(r => r.GetPolicyNumbersWithStatus("U1")).ReturnsAsync(policies);

            var (success, result) = await _policyServices.GetPolicyNumbersWithStatus("user1");

            Assert.True(success);
            Assert.Equal(policies, result);
        }
        [Fact]
        public async Task GetPolicyNumbersWithStatus_ReturnsFalseAndNull_WhenUserDoesNotExist()
        {
            _userRepositoryMock.Setup(r => r.GetUserIds("user1")).ReturnsAsync((string)null);

            var (success, result) = await _policyServices.GetPolicyNumbersWithStatus("user1");

            Assert.False(success);
            Assert.Null(result);
        }


        [Fact]
        public async Task ToggleStatus_WhenRepositoryReturnsTrue()
        {
            _policyRepositoryMock.Setup(r => r.ToggleStatus(1)).ReturnsAsync(true);

            var result = await _policyServices.ToggleStatus(1);

            Assert.True(result);
        }

        [Fact]
        public async Task ToggleStatus_WhenRepositoryReturnsFalse()
        {
            _policyRepositoryMock.Setup(r => r.ToggleStatus(1)).ReturnsAsync(false);

            var result = await _policyServices.ToggleStatus(1);

            Assert.False(result);
        }

       
        [Fact]
        public async Task PolicyDetails_WhenAllRepositoriesReturnData()
        {
            
            var policyNumber = "P123";
            var policyholder = new { Name = "John Doe" };
            var policyDetails = new { PolicyNo = "P123", Amount = 1000 };
            var coverageDetails = new { Coverage = "Full" };
            var vehicleDetails = new { ChassisNo = "C456" };

            _policyViewRepositoryMock.Setup(r => r.PolicyHolderDetails(policyNumber)).ReturnsAsync(policyholder);
            _policyViewRepositoryMock.Setup(r => r.PolicyDetails(policyNumber)).ReturnsAsync(policyDetails);
            _policyViewRepositoryMock.Setup(r => r.CoverageDetails(policyNumber)).ReturnsAsync(coverageDetails);
            _policyViewRepositoryMock.Setup(r => r.VehicleDetails(policyNumber)).ReturnsAsync(vehicleDetails);

            
            var result = await _policyServices.PolicyDetails(policyNumber);


            Assert.Equal(policyholder, result.GetType().GetProperty("policyholder").GetValue(result));
            Assert.Equal(policyDetails, result.GetType().GetProperty("PolicyDetails").GetValue(result));
            Assert.Equal(coverageDetails, result.GetType().GetProperty("coverageDetails").GetValue(result));
            Assert.Equal(vehicleDetails, result.GetType().GetProperty("vehicleDetails").GetValue(result));
        }

        [Fact]
        public async Task PolicyDetails_WhenRepositoriesReturnNull()
        {
            
            var policyNumber = "P999";
            _policyViewRepositoryMock.Setup(r => r.PolicyHolderDetails(policyNumber)).ReturnsAsync((object)null);
            _policyViewRepositoryMock.Setup(r => r.PolicyDetails(policyNumber)).ReturnsAsync((object)null);
            _policyViewRepositoryMock.Setup(r => r.CoverageDetails(policyNumber)).ReturnsAsync((object)null);
            _policyViewRepositoryMock.Setup(r => r.VehicleDetails(policyNumber)).ReturnsAsync((object)null);

            
            var result = await _policyServices.PolicyDetails(policyNumber);


            Assert.Null(result.GetType().GetProperty("policyholder").GetValue(result));
            Assert.Null(result.GetType().GetProperty("PolicyDetails").GetValue(result));
            Assert.Null(result.GetType().GetProperty("coverageDetails").GetValue(result));
            Assert.Null(result.GetType().GetProperty("vehicleDetails").GetValue(result));
        }

        [Fact]
        public async Task PolicyDetails_WhenSomeRepositoriesReturnNull()
        {
            
            var policyNumber = "P456";
            var policyholder = new { Name = "Jane Doe" };
            var policyDetails = new { PolicyNo = "P456", Amount = 2000 };

            _policyViewRepositoryMock.Setup(r => r.PolicyHolderDetails(policyNumber)).ReturnsAsync(policyholder);
            _policyViewRepositoryMock.Setup(r => r.PolicyDetails(policyNumber)).ReturnsAsync(policyDetails);
            _policyViewRepositoryMock.Setup(r => r.CoverageDetails(policyNumber)).ReturnsAsync((object)null);
            _policyViewRepositoryMock.Setup(r => r.VehicleDetails(policyNumber)).ReturnsAsync((object)null);

            
            var result = await _policyServices.PolicyDetails(policyNumber);


            Assert.Equal(policyholder, result.GetType().GetProperty("policyholder").GetValue(result));
            Assert.Equal(policyDetails, result.GetType().GetProperty("PolicyDetails").GetValue(result));
            Assert.Null(result.GetType().GetProperty("coverageDetails").GetValue(result));
            Assert.Null(result.GetType().GetProperty("vehicleDetails").GetValue(result));
        }


        [Fact]
        public async Task TotalPremium_WhenUserExists()
        {
            
            _userRepositoryMock.Setup(r => r.GetUserIds("user2")).ReturnsAsync("U2");
            _policyRepositoryMock.Setup(r => r.TotalPremium("U2")).ReturnsAsync(1500);

            
            var result = await _policyServices.TotalPremium("user2");


            Assert.Equal(1500, result);
            _policyRepositoryMock.Verify(r => r.TotalPremium("U2"), Times.Once);
        }

        [Fact]
        public async Task TotalPremium_WhenRepositoryReturnsZero()
        {
            
            _userRepositoryMock.Setup(r => r.GetUserIds("user3")).ReturnsAsync("U3");
            _policyRepositoryMock.Setup(r => r.TotalPremium("U3")).ReturnsAsync(0);

            
            var result = await _policyServices.TotalPremium("user3");


            Assert.Equal(0, result);
        }

    }


}

