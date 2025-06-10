using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data_Logic.Model
{
    public class PolicyInfo
    {

        public int PolicyId { get; set; }
        public string PolicyNumber { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }
}
