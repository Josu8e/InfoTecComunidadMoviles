using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Configuration;
namespace test2.Models
{

    public class Conexion
    {
        //SqlConnection con = new SqlConnection("Data Source=localhost;Initial Catalog=infoTecDB;User ID=sa;Password=heaven");
        SqlConnection con = new SqlConnection("Data Source=172.19.32.10;Initial Catalog=infoTec;Persist Security Info=True;User ID=infotec;Password=_1Nf0t3c");
        SqlCommand comand;
        SqlDataReader reader;
        string consult;
        
        public List<DTO_Persona> Log(String id, String pass)
        {
            con.Open();
            //consult = string.Format("select * from skill where Name ='{0}'", lista[listaIndex].nombre);
            consult = string.Format("select ID,nombre,rol from Persona where ID=@ID and pass=@pass");
            comand = new SqlCommand(consult, con);

            Console.WriteLine("Entro al login xD");
            comand.Parameters.Add("@ID", System.Data.SqlDbType.VarChar);
            comand.Parameters["@ID"].Value = id;

            comand.Parameters.Add("@PASS", System.Data.SqlDbType.VarChar);
            comand.Parameters["@PASS"].Value = pass;

            reader = comand.ExecuteReader();

            List<DTO_Persona> lista = new List<DTO_Persona>();
            while (reader.Read())
            {
                DTO_Persona nn = new DTO_Persona();
                nn.ID = reader[0].ToString();
                nn.nombre = reader[1].ToString();
                nn.tipo = reader[2].ToString();
                lista.Add(nn);
            }
            con.Close();
            return lista;
        }
        /// <summary>
        /// Funcion encargada de seleccionar el nombre, id y contrasenia que seran enviados en el correo del forgetPass
        /// </summary>
        /// <param name="email">Email del usuario, tiene que estar registrado para poder obtener la informacion</param>
        /// <returns>Lista con los datos del usuario</returns>
        public List<datos> sendEmail(String email)
        {
            con.Open();
            consult = string.Format("SELECT nombre,ID,pass FROM Persona WHERE correo=@EMAIL");
            comand = new SqlCommand(consult, con);

            comand.Parameters.Add("@EMAIL", System.Data.SqlDbType.VarChar);

            comand.Parameters["@EMAIL"].Value = email;
            
            reader = comand.ExecuteReader();

            List<datos> lista = new List<datos>();
            while (reader.Read())
            {
                datos nn = new datos();
                nn.NAME = reader[0].ToString();
                nn.ID = reader[1].ToString();
                nn.PASS = reader[2].ToString();
                lista.Add(nn);
            }
            con.Close();
            return lista;
        }

        public String borrarMensajeTotal(int mensajeID)
        {
            SqlCommand comand;
            string consult;
            try
            {
                consult = string.Format("delete from Mensaje where ID=@ID_m;");//////////////////
                comand = new SqlCommand(consult, con);

                // Creando los parámetros necesarios
                comand.Parameters.Add("@ID_m", System.Data.SqlDbType.Int);

                // Asignando los valores a los atributos
                comand.Parameters["@ID_m"].Value = mensajeID;

                //-----------------------------------------------
                con.Open();
                comand.ExecuteNonQuery();
                con.Close();
                return "succesfull";

            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public String insertarDepartamento(String nombre,string tipo,int idSede)/////INSERTAR DEPARTAMENTO
        {
            SqlCommand comand;
            string consult;
            string consult2;
            SqlCommand comand2;
            try
            {
                consult = string.Format("insert into departamentos values (@nombre,@tipo)");//////////////////
                comand = new SqlCommand(consult, con);

                comand.Parameters.Add("@nombre", System.Data.SqlDbType.VarChar);
                comand.Parameters["@nombre"].Value = nombre;

                comand.Parameters.Add("@tipo", System.Data.SqlDbType.VarChar);
                comand.Parameters["@tipo"].Value = tipo;

                consult2 = string.Format("insert into Departamento_Sede values (@nombre,@idSede)");
                comand2 = new SqlCommand(consult2, con);

                comand2.Parameters.Add("@nombre", System.Data.SqlDbType.VarChar);
                comand2.Parameters.Add("@idSede", System.Data.SqlDbType.Int);
                comand2.Parameters["@nombre"].Value = nombre;
                comand2.Parameters["@idSede"].Value = idSede;

                con.Open();
                comand.ExecuteNonQuery();
                comand2.ExecuteNonQuery();
                con.Close();
                return "successful";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public List<String> obtenerDepartamentos()
        {
            con.Open();
            consult = string.Format("select * from departamentos");
            comand = new SqlCommand(consult, con);
            reader = comand.ExecuteReader();

            List<String> lista = new List<String>();
            while (reader.Read())
            {
                String nombre = reader[0].ToString();
                lista.Add(nombre);
            }
            con.Close();
            return lista;
        }
        /// <summary>
        /// Función encargada de la edición de mensajes o eventos creados
        /// </summary>
        /// <param name="titulo">Nuevo título</param>
        /// <param name="Descripcion">Nueva descripción</param>
        /// <param name="fecha">Nueva fecha</param>
        /// <param name="imagen">Nueva imagen</param>
        /// <param name="borrable">Nueva opción de borrable si o no</param>
        /// <returns></returns>
        public string editarMensaje(int ID, string titulo, string Descripcion, string fecha, string imagen, string borrable)
        {
            SqlCommand comand;
            string consult;
            try
            {
                consult = string.Format("UPDATE Mensaje SET titulo=@titulo, descripcion=@descripcion, fecha=@fecha, imagen=@imagen, borrable@borrable where ID=@ID");//////////////////
                comand = new SqlCommand(consult, con);

                // Creando los parámetros necesarios
                comand.Parameters.Add("@ID", System.Data.SqlDbType.Int);
                comand.Parameters.Add("@titulo", System.Data.SqlDbType.VarChar);
                comand.Parameters.Add("@descripcion", System.Data.SqlDbType.VarChar);
                comand.Parameters.Add("@fecha", System.Data.SqlDbType.VarChar);
                comand.Parameters.Add("@imagen", System.Data.SqlDbType.VarChar);                
                comand.Parameters.Add("@borrable", System.Data.SqlDbType.VarChar);
                // Asignando los valores a los atributos
                comand.Parameters["@ID"].Value = ID;
                comand.Parameters["@titulo"].Value = titulo;
                comand.Parameters["@descripcion"].Value = Descripcion;
                comand.Parameters["@fecha"].Value = fecha;
                comand.Parameters["@imagen"].Value = imagen;
                comand.Parameters["@borrable"].Value = borrable;

                //-----------------------------------------------
                con.Open();
                comand.ExecuteNonQuery();
                con.Close();
                return "successful";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }


        /// <summary>
        /// Funcion encargada de ir a la base de datos a cambiar la contraseña
        /// </summary>
        /// <param name="nPass">Contraseña nueva</param>
        /// <param name="id">ID del usuario al que se le desea cambiar la contraseña</param>
        /// <returns>Mensaje de exito o mensaje de la excepción</returns>
        public String changePass(String nPass,String id)
        {
            try
            {
                // update Persona set pass=@nPass where ID=@id
                consult = string.Format("UPDATE Persona SET pass=@nPass WHERE ID=@ID;");
                comand = new SqlCommand(consult, con);

                // Creando los parámetros necesarios
                comand.Parameters.Add("@nPass", System.Data.SqlDbType.VarChar);
                comand.Parameters.Add("@ID", System.Data.SqlDbType.VarChar);

                // Asignando los valores a los atributos
                comand.Parameters["@nPass"].Value = nPass;
                comand.Parameters["@ID"].Value = id;

                /* - - - - - - - - - - - - - - - - - - - - */
                con.Open();
                comand.ExecuteNonQuery();
                con.Close();

                return "successful";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }            
        }

        public String setVisto(string id, int idm)
        {
            consult = string.Format("update Mensaje_Persona set visto='si' where ID_p=@id and ID_M=@idm");
            comand = new SqlCommand(consult, con);
            comand.Parameters.Add("@id", System.Data.SqlDbType.VarChar);
            comand.Parameters["@id"].Value = id;

            comand.Parameters.Add("@idm", System.Data.SqlDbType.Int);
            comand.Parameters["@idm"].Value = idm;

            try
            {
                con.Open();
                comand.ExecuteNonQuery();
                con.Close();
                return "succesfull";
            }
            catch (Exception ex)
            {
                con.Close();
                return ex.Message;
            }
        }


        public String IN(string id, string nombre,string contra,string rol,string correo,string carne,string estadoCivil,string fechaNacimiento,char sexo,string direccion,string apellido1,string apellido2)
        {
            SqlCommand comand;
            string consult;
            try
            {
                consult = string.Format("exec nuevaPersona @id, @nombre, @contra, @rol, @correo, @carne, @estadoCivil, @fechaNacimiento, @sexo, @direccion, @apellido1, @apellido2");//////////////////
                comand = new SqlCommand(consult, con);

                // Creando los parámetros necesarios
                comand.Parameters.Add("@id", System.Data.SqlDbType.VarChar);
                comand.Parameters.Add("@nombre", System.Data.SqlDbType.VarChar);
                comand.Parameters.Add("@contra", System.Data.SqlDbType.VarChar);
                comand.Parameters.Add("@rol", System.Data.SqlDbType.VarChar);
                comand.Parameters.Add("@correo", System.Data.SqlDbType.VarChar);
                comand.Parameters.Add("@carne", System.Data.SqlDbType.VarChar);
                comand.Parameters.Add("@estadoCivil", System.Data.SqlDbType.VarChar);
                comand.Parameters.Add("@fechaNacimiento", System.Data.SqlDbType.VarChar);
                comand.Parameters.Add("@sexo", System.Data.SqlDbType.Char);
                comand.Parameters.Add("@direccion", System.Data.SqlDbType.VarChar);
                comand.Parameters.Add("@apellido1", System.Data.SqlDbType.VarChar);
                comand.Parameters.Add("@apellido2", System.Data.SqlDbType.VarChar);
                /*comand.Parameters.AddWithValue("@id", id);
                comand.Parameters.AddWithValue("@nombre", nombre);
                comand.Parameters.AddWithValue("@contra", contra);
                comand.Parameters.AddWithValue("@rol", rol);
                comand.Parameters.AddWithValue("@correo", correo);
                comand.Parameters.AddWithValue("@carne", carne);
                comand.Parameters.AddWithValue("@estadoCivil", estadoCivil);
                comand.Parameters.AddWithValue("@fechaNacimiento", fechaNacimiento);
                comand.Parameters.AddWithValue("@sexo", sexo);
                comand.Parameters.AddWithValue("@direccion", direccion);
                comand.Parameters.AddWithValue("@apellido1", apellido1);
                comand.Parameters.AddWithValue("@apellido2", apellido2);*/


                // Asignando los valores a los atributos
                comand.Parameters["@id"].Value = id;
                comand.Parameters["@nombre"].Value = nombre;
                comand.Parameters["@contra"].Value = contra;
                comand.Parameters["@rol"].Value = rol;
                comand.Parameters["@correo"].Value = correo;
                comand.Parameters["@carne"].Value = carne;
                comand.Parameters["@estadoCivil"].Value = estadoCivil;
                comand.Parameters["@fechaNacimiento"].Value = fechaNacimiento;
                comand.Parameters["@sexo"].Value = sexo;
                comand.Parameters["@direccion"].Value = direccion;
                comand.Parameters["@apellido1"].Value = apellido1;
                comand.Parameters["@apellido2"].Value = apellido2;


                //-----------------------------------------------
                con.Open();
                comand.ExecuteNonQuery();
                con.Close();
                return "successful";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public List<DTO_MisMensajes> getOwnMessage(String id)
        {
            
            con.Open();            
            consult = string.Format("exec misMensajes @ID");
            comand = new SqlCommand(consult, con);
            comand.Parameters.Add("@ID", System.Data.SqlDbType.VarChar);
            comand.Parameters["@ID"].Value = id;
            reader = comand.ExecuteReader();
            List<DTO_MisMensajes> lista = new List<DTO_MisMensajes>();
            while (reader.Read())
            {
                DTO_MisMensajes nn = new DTO_MisMensajes();
                nn.titulo = reader[0].ToString();
                nn.descripcion = reader[1].ToString();
                nn.fecha = reader[2].ToString();
                nn.imagen = reader[3].ToString();
                nn.remitente = reader[4].ToString();
                nn.borrable = reader[5].ToString();
                nn.mensaje_ID = reader[6].ToString();
                nn.visto = reader[7].ToString();
                lista.Add(nn);
            }
            con.Close();
            return lista;
        }

        public List<DTO_adminMensajes> AdminM(String remitente)
        {
            con.Open();
            consult = string.Format("select * from mensaje where remitente=@remitente");
            comand = new SqlCommand(consult, con);
            comand.Parameters.Add("@remitente", System.Data.SqlDbType.VarChar);
            comand.Parameters["@remitente"].Value = remitente;
            reader = comand.ExecuteReader();
            List<DTO_adminMensajes> lista = new List<DTO_adminMensajes>();
            while (reader.Read())
            {
                DTO_adminMensajes nn = new DTO_adminMensajes();

                nn.mensaje_ID = reader[0].ToString();
                nn.titulo = reader[1].ToString();
                nn.descripcion = reader[2].ToString();
                nn.fecha = reader[3].ToString();
                nn.imagen = reader[4].ToString();                
                lista.Add(nn);
            }
            con.Close();
            return lista;
        }
        /// <summary>
        /// Función encargada de la inserción de un nuevo mensaje (evento)
        /// </summary>
        /// <param name="titulo">Título del mensaje</param>
        /// <param name="Descripcion">Descripción del mensaje</param>
        /// <param name="fecha">Fecha en que se realizará el evento</param>
        /// <param name="imagen">Imagen que se insertó para el evento</param>
        /// <param name="remitente">Persona que envió el mensaje</param>
        /// <param name="borrable">Opción que no le permite a los usuarios la eliminación del mensaje enviado</param>
        /// <param name="departamento">Departamentos a los que se envió el mensaje</param>
        /// <returns>Mensaje de exito o de error</returns>
        public String insertar(String titulo, String Descripcion, String fecha, String imagen, String remitente, String borrable, string departamento)
        {
            SqlCommand comand;
            string consult;
            try
            {
                consult = string.Format("exec NuevoMensaje @titulo ,@descripcion ,@fecha  ,@imagen ,@remitente,@borrable,@departamento  ");//////////////////
                comand = new SqlCommand(consult, con);
                //------------------generico para cualquier consulta
                
                // Creando los parámetros necesarios
                comand.Parameters.Add("@titulo", System.Data.SqlDbType.VarChar);
                comand.Parameters.Add("@descripcion", System.Data.SqlDbType.VarChar);
                comand.Parameters.Add("@fecha", System.Data.SqlDbType.VarChar);
                comand.Parameters.Add("@imagen", System.Data.SqlDbType.VarChar);
                comand.Parameters.Add("@remitente", System.Data.SqlDbType.VarChar);
                comand.Parameters.Add("@borrable", System.Data.SqlDbType.VarChar);
                comand.Parameters.Add("@departamento", System.Data.SqlDbType.VarChar);
                // Asignando los valores a los atributos
                comand.Parameters["@titulo"].Value = titulo;
                comand.Parameters["@descripcion"].Value = Descripcion;
                comand.Parameters["@fecha"].Value = fecha;
                comand.Parameters["@imagen"].Value = imagen;
                comand.Parameters["@remitente"].Value = remitente;
                comand.Parameters["@borrable"].Value = borrable;
                comand.Parameters["@departamento"].Value = departamento;
                
                //-----------------------------------------------
                con.Open();
                comand.ExecuteNonQuery();
                con.Close();
                return "successful";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
        public List<DTO_Departamento> getDepartementPerson(string id)
        {
            con.Open();
            consult = string.Format("select d.nombre From Persona as p inner Join Persona_departamentos as Pd on p.ID = Pd.IDPer inner join departamentos as d on Pd.nombreDep = d.nombre where id = @idC");
            comand = new SqlCommand(consult, con);
            comand.Parameters.Add("@idC", System.Data.SqlDbType.Int);
            comand.Parameters["@idC"].Value = id;
            reader = comand.ExecuteReader();
            List<DTO_Departamento> lista = new List<DTO_Departamento>();
            while (reader.Read())
            {
                DTO_Departamento dto = new DTO_Departamento();
                dto.nombre = reader[0].ToString();
                lista.Add(dto);
            }
            con.Close();
            return lista;
        }


        public String borrarMensaje(int mensajeID, int personaID)
        {
            SqlCommand comand;
            string consult;
            try
            {
                consult = string.Format("delete from Mensaje_Persona where ID_m=@ID_m and ID_p = @ID_p");//////////////////
                comand = new SqlCommand(consult, con);
                //------------------generico para cualquier consulta


                // Creando los parámetros necesarios
                comand.Parameters.Add("@ID_m", System.Data.SqlDbType.Int);
                comand.Parameters.Add("@ID_p", System.Data.SqlDbType.Int);

                // Asignando los valores a los atributos
                comand.Parameters["@ID_m"].Value = mensajeID;
                comand.Parameters["@ID_p"].Value = personaID;
                
                //-----------------------------------------------
                con.Open();
                comand.ExecuteNonQuery();
                con.Close();
                return "succesfull";

            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public string setDepartToPerson(string idP,string nombre)//nuevo
        {
            SqlCommand comand;
            string consult;
            try
            {
                consult = string.Format("insert into Persona_departamentos values (@nombre,@id)");

                comand = new SqlCommand(consult, con);

                comand.Parameters.Add("@nombre", System.Data.SqlDbType.NChar);
                comand.Parameters.Add("@id", System.Data.SqlDbType.NChar);
                comand.Parameters["@nombre"].Value = nombre;
                comand.Parameters["@id"].Value = idP;

                con.Open();
                comand.ExecuteNonQuery();
                con.Close();
                return "succesfull";
            }
            catch(Exception e)
            {
                return e.Message;
            }

        }
        public List<DTO_Persona> getPersonabyDepartamento(string nombreDepa)
        {
            List<DTO_Persona> lista = new List<DTO_Persona>();
            string consult;
            SqlCommand comand;
            try
            {
                con.Open();
                consult = string.Format("select p.Nombre, p.ID, p.carne From Persona as p inner Join Persona_departamentos as Pd on p.ID = Pd.IDPer inner join departamentos as d on Pd.nombreDep = d.nombre where d.nombre = @nombreDepa");
                comand = new SqlCommand(consult, con);
                comand.Parameters.Add("@nombreDepa", System.Data.SqlDbType.NChar);
                comand.Parameters["@nombreDepa"].Value = nombreDepa;

                reader = comand.ExecuteReader();
                
                while (reader.Read())
                {
                    DTO_Persona dto = new DTO_Persona();
                    dto.nombre = reader[0].ToString();
                    dto.ID = reader[1].ToString();
                    dto.tipo = reader[2].ToString();
                    lista.Add(dto);
                }
                con.Close();
            }
            catch (Exception e)
            {
                //algo
            }


            return lista;
        }
        //nuevo
        public List<DTO_Sede> getSedes()
        {
            SqlCommand comand;
            string consult;
            
            consult = string.Format("select * from Sedes");
            comand = new SqlCommand(consult, con);
            con.Open();
            reader = comand.ExecuteReader();
            List<DTO_Sede> lista = new List<DTO_Sede>();
            while (reader.Read())
            {
                DTO_Sede dto = new DTO_Sede();
                dto.idSede = reader[0].ToString();
                dto.nombreSede = reader[1].ToString();
                lista.Add(dto);
            }
            con.Close();
            return lista;
        }
        public List<DTO_Persona> getEncargados()
        {
            SqlCommand comand;
            string consult;

            consult = string.Format("select ID, nombre from Persona where rol != 'Estudiante'");
            comand = new SqlCommand(consult, con);
            con.Open();
            reader = comand.ExecuteReader();
            List<DTO_Persona> lista = new List<DTO_Persona>();
            while (reader.Read())
            {
                DTO_Persona dto = new DTO_Persona();
                dto.ID = reader[0].ToString();
                dto.nombre = reader[1].ToString();
                lista.Add(dto);
            }
            con.Close();
            return lista;
        }

        //
        public List<DTO_Departamento> getDepartmentFiltrados(string sede, string categoria)
        {
            SqlCommand comand;
            string consult;
            consult = string.Format("select d.nombre from departamentos as d inner Join Departamento_Sede as DS on d.nombre = DS.nombreDepartamento inner join Sedes as s on s.nombreSede = @sede where d.tipo = @categoria");
            comand = new SqlCommand(consult, con);
            comand.Parameters.Add("@sede", System.Data.SqlDbType.NChar);
            comand.Parameters["@sede"].Value = sede;
            comand.Parameters.Add("@categoria", System.Data.SqlDbType.NChar);
            comand.Parameters["@categoria"].Value = categoria;

            con.Open();
            reader = comand.ExecuteReader();
            List<DTO_Departamento> lista = new List<DTO_Departamento>();
            while (reader.Read())
            {
                DTO_Departamento dto = new DTO_Departamento();
                dto.nombre = reader[0].ToString();
                lista.Add(dto);
            }
            con.Close();
            return lista;
        }

        public List<DTO_Persona> cargarPersonas()
        {
            List<DTO_Persona> lista;
            SqlCommand comand;
            string consult;
            consult = string.Format("select nombre,carne,id from Persona");
            comand = new SqlCommand(consult, con);


            con.Open();
            reader = comand.ExecuteReader();
            lista = new List<DTO_Persona>();
            while (reader.Read())
            {
                DTO_Persona dto = new DTO_Persona();
                dto.nombre = reader[0].ToString();
                dto.ID = reader[1].ToString();
                dto.tipo = reader[2].ToString();
                lista.Add(dto);
            }
            con.Close();
            return lista;
        }


        public List<DTO_Persona> buscarPersonas(string id, int control)//nuevo
        {
            SqlCommand comand;
            string consult;


            if (control == 0)
            {

                consult = string.Format("select ID,nombre,rol  from Persona where ID like @id");
                comand = new SqlCommand(consult, con);

                comand.Parameters.Add("@id", System.Data.SqlDbType.NChar);

                comand.Parameters["@id"].Value = id;

                con.Open();

                reader = comand.ExecuteReader();
                List<DTO_Persona> lista = new List<DTO_Persona>();

                while (reader.Read())
                {
                    DTO_Persona dto = new DTO_Persona();
                    dto.ID = reader[0].ToString();
                    dto.nombre = reader[1].ToString();
                    dto.tipo = reader[2].ToString();
                    lista.Add(dto);
                }
                con.Close();
                return lista;
            }
            else
            {
                consult = string.Format("select ID,nombre,rol  from Persona where nombre like @id");
                comand = new SqlCommand(consult, con);

                comand.Parameters.Add("@id", System.Data.SqlDbType.NChar);

                comand.Parameters["@id"].Value = id;

                con.Open();

                reader = comand.ExecuteReader();
                List<DTO_Persona> lista = new List<DTO_Persona>();

                while (reader.Read())
                {
                    DTO_Persona dto = new DTO_Persona();
                    dto.ID = reader[0].ToString();
                    dto.nombre = reader[1].ToString();
                    dto.tipo = reader[2].ToString();
                    lista.Add(dto);
                }
                con.Close();
                return lista;

            }
            
        }
    }
}
//insert into  Mensaje (titulo,Descripcion,fecha,imagen,remitente) values ('Ferias de idea','Los jovenes enprendedores del tec mostaran su ideas en pasillos frente a la bola','2016-10-02','','CA maritza')

/*
 
  SqlConnection connection;
            SqlCommand comand;
            string consult;
            try
            {
                connection = new SqlConnection("Data Source=Jimmy-PC;Initial Catalog=seven_abyssal_lords;User ID=sa;Password=heaven");

                consult = string.Format("delete Caracter where name=@name delete skill where name=@name;");//////////////////
                comand = new SqlCommand(consult, connection);
                //------------------generico para cualquier consulta


                // Creando los parámetros necesarios
                comand.Parameters.Add("@name", System.Data.SqlDbType.VarChar);

                // Asignando los valores a los atributos
                comand.Parameters["@name"].Value = lista[listaIndex].nombre;


                //-----------------------------------------------
                connection.Open();////////////////////////
 
   SqlConnection connection;
            SqlCommand comand;
            string consult;
            try
            {
                connection = new SqlConnection("Data Source=Jimmy-PC;Initial Catalog=seven_abyssal_lords;User ID=sa;Password=heaven");

                consult = string.Format("execute crear @pjindex ,@name  ,@modelindex ,@texindex ");//////////////////
                comand = new SqlCommand(consult, connection);
                //------------------generico para cualquier consulta


                // Creando los parámetros necesarios
                comand.Parameters.Add("@modelindex", System.Data.SqlDbType.Int);
                comand.Parameters.Add("@texindex", System.Data.SqlDbType.Int);
                comand.Parameters.Add("@pjindex", System.Data.SqlDbType.Int);
                comand.Parameters.Add("@name", System.Data.SqlDbType.VarChar);
                // Asignando los valores a los atributos
                comand.Parameters["@modelindex"].Value = modelIndex;
                comand.Parameters["@texindex"].Value = texIndex;
                comand.Parameters["@pjindex"].Value = pjIndex;
                comand.Parameters["@name"].Value = PjName;


                //-----------------------------------------------
                connection.Open();
                comand.ExecuteNonQuery();
                connection.Close();
 
 */