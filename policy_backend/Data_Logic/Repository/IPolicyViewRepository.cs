using Data_Logic.Model;

namespace Data_Logic.Repository
{
    public interface IPolicyViewRepository
    {
        Task<object> CoverageDetails(string policyno);
        Task<List<PolicyInfo>> GetPolicyNumbersWithStatus(string userId);
        Task<object> PolicyDetails(string policyno);
        Task<object> PolicyHolderDetails(string policyno);
        Task<object> VehicleDetails(string policyno);
    }
}