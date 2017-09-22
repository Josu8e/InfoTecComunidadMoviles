using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace test2.Models
{
    public class DTO_MisMensajes
    {                
        public string titulo { get; set; }
        public string descripcion { get; set; }
        public string fecha { get; set; }
        public string imagen { get; set; }
        public string remitente { get; set; }
        public string borrable { get; set; }
        public string mensaje_ID { get; set; }
        public string visto { get; set; }
    }
}