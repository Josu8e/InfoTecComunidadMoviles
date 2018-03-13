using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
using test2.Models;

namespace test2.Controllers
{
    public class TestController : Controller
    {
        public Conexion conexion = new Conexion();


        public JsonResult Log(String id, String pass)
        {
            switch (Request.HttpMethod)
            {
                /* case "POST":
                     return Json(productosManager.InsertarCliente(item));
                 case "PUT":
                     return Json(productosManager.ActualizarCliente(item));*/
                case "GET":
                    return Json(conexion.Log(id, pass),
                                JsonRequestBehavior.AllowGet);
                    /* case "DELETE":
                         return Json(productosManager.EliminarCliente(id.GetValueOrDefault()));*/
            }

            return Json(new { Error = true, Message = "Operación HTTP desconocida" });
        }

        public JsonResult getOwnMessage(String id)
        {
            switch (Request.HttpMethod)
            {

                case "GET":
                    return Json(conexion.getOwnMessage(id),
                                JsonRequestBehavior.AllowGet);
            }
            return Json(new { Error = true, Message = "Operación HTTP desconocida" });
        }

        public JsonResult AdminM(String remitente)
        {
            return Json(conexion.AdminM(remitente),
                        JsonRequestBehavior.AllowGet);
        }

        public JsonResult obtenerD()
        {
            return Json(
                  conexion.obtenerDepartamentos()
                    , JsonRequestBehavior.AllowGet);
        }

        public JsonResult Departamentos(String nombre, String codigoDep, String tipo, String sede, String encargado)////Consulta departamentos
        {

            return Json(
                    conexion.insertarDepartamento(nombre,codigoDep,tipo,sede,encargado), JsonRequestBehavior.AllowGet);
        }

        public JsonResult IN(string id, string nombre, string contra, string rol, string correo, string carne, string estadoCivil, string fechaNacimiento, char sexo, string direccion, string apellido1, string apellido2)
        {
            
            return Json(conexion.IN(id, nombre, contra, rol, correo, carne, estadoCivil, fechaNacimiento, sexo, direccion, apellido1, apellido2),
                    JsonRequestBehavior.AllowGet);    
        }

        public JsonResult nuevoMensaje(String titulo, String Descripcion, String fecha, string imagen, String remitente, String borrable, string departamento)
        {
            return Json(
                  conexion.insertar(titulo, Descripcion, fecha, imagen, remitente, borrable, departamento)
                    , JsonRequestBehavior.AllowGet);
        }

        public JsonResult editarMensaje(int ID, string titulo, string Descripcion, string fecha, string imagen, string borrable)
        {
            return Json(
                  conexion.editarMensaje(ID, titulo, Descripcion, fecha, imagen, borrable)
                    , JsonRequestBehavior.AllowGet);
        }

        public JsonResult DelOwnM(int id_m, int id_p)
        {
            return Json(
                  conexion.borrarMensaje(id_m, id_p)
                    , JsonRequestBehavior.AllowGet);
        }

        public JsonResult EliminarMensaje(int id_m)
        {
            return Json(
                  conexion.borrarMensajeTotal(id_m)
                    , JsonRequestBehavior.AllowGet);
        }

        public JsonResult buscarPersonas(string id,int control)//nuevo
        {
            return Json(
                    conexion.buscarPersonas(id,control),
                    JsonRequestBehavior.AllowGet);
        }

        //nuevo
        public JsonResult getSedes()
        {
            return Json(
                    conexion.getSedes(),
                    JsonRequestBehavior.AllowGet);
        }

        public JsonResult getEncargados()
        {
            return Json(
                    conexion.getEncargados(),
                    JsonRequestBehavior.AllowGet);
        }

        //nuevo
        public JsonResult getDepartmentFiltrados(string sede, string categoria)
        {
            return Json(
                conexion.getDepartmentFiltrados(sede, categoria),
                JsonRequestBehavior.AllowGet);
        }

        public JsonResult getPersonas()
        {
            return Json(
                conexion.cargarPersonas(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult setPersonaToDepartment(string idP,string nombre)
        {
            return Json(
                conexion.setDepartToPerson(idP, nombre),
                JsonRequestBehavior.AllowGet);
        }

        public JsonResult SendEmail(String email)
        {
            switch (Request.HttpMethod)
            {
                case "GET":
                    return Json(conexion.sendEmail(email),
                                JsonRequestBehavior.AllowGet);
            }
            return Json(new { Error = true, Message = "Operación HTTP desconocida" });
        }

        public JsonResult setVisto(string id, int idm)
        {
            return Json(conexion.setVisto(id, idm), JsonRequestBehavior.AllowGet);
        }  
        
        /// <summary>
        /// Función para cambiar contraseña
        /// </summary>
        /// <param name="nPass">Contraseña nueva</param>
        /// <param name="id">ID del usuario logeado</param>
        /// <returns></returns>
        public JsonResult changePass(String nPass, String id)
        {
            return Json(conexion.changePass(nPass, id), 
                  JsonRequestBehavior.AllowGet);
        }

        public JsonResult getDepartementPerson(String id)
        {
            return Json(conexion.getDepartementPerson(id), 
                JsonRequestBehavior.AllowGet);
        }

        public JsonResult getDepartamentosPorSede(String sede)
        {
            return Json(conexion.getDepartamentosPorSede(sede),
                JsonRequestBehavior.AllowGet);
        }

        public JsonResult deletePeopleFromDepartment(string nombreDep, string idP)
        {
            return Json(conexion.deletePeopleFromDepartment(nombreDep, idP),
                JsonRequestBehavior.AllowGet);
        }

        public JsonResult getPersonabyDepartamento(string nombreDepa)
        {
            return Json(conexion.getPersonabyDepartamento(nombreDepa),
                JsonRequestBehavior.AllowGet);
        }
    }
}
