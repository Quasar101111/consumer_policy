using Data_Logic.Model;

namespace Business_Logic.Services
{
    public interface IPolicyServices
    {
        Task<object> AddUserPolicy(string policyno, string username);
        Task<int> AdminGetPolicies();
        Task<bool> DeletePolicy(int id);
        Task<object> FindPolicy(string policyno, string chassisno);
        Task<(bool success, List<PolicyInfo>? result)> GetPolicyNumbersWithStatus(string username);
        Task<object> PolicyDetails(string policyNumber);
        Task<bool> ToggleStatus(int id);
        Task<int> TotalPremium(string username);
        Task<(bool success, string? message, List<string>? result)> ViewPolicyNo(string username);
    }
}