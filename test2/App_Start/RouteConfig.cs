using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace test2
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            //Endpoint para el login
            routes.MapRoute(
                "logRr",//esto se pone en el url en js.js
                "log/{id}/{pass}",//asi se llama en el testcontroller 
                new
                {
                    controller = "Test",
                    action = "Log",
                }
            );

            //Endpoint cambiar contraseña
            routes.MapRoute(
                "changePass",
                "cambiarContra/{nPass}/{id}",
                new
                {
                    controller = "Test",
                    action = "changePass",
                }
           );

            //Endpoint para insertar un departamento
            routes.MapRoute(
                "insertD",
                "insertarDepartamento/{nombre}/{tipo}/{encargado}/{codigoDep}/{sede}",
                new
                {
                    controller = "Test",
                    action = "Departamentos",
                }
            );

            //Endpoint para obtener los departamentos 
            routes.MapRoute(
                "OD",
                "obtenerD",
                new
                {
                    controller = "Test",
                    action = "obtenerD",
                }
            );

            //
            routes.MapRoute(
                "setVisto",
                "setVisto/{id}/{idm}",
                new
                {
                    controller = "Test",
                    action = "setVisto"
                }
            );

            //Endpoint para enviar el correo con la contraseña provisional 
            routes.MapRoute(
                "SendEmail",
                "SendEmail",
                new
                {
                    controller = "Test",
                    action = "SendEmail",
                }
           );

            //No se usa  
            routes.MapRoute(
                "gomR",
                "getOwnMessage/{id}",
                new
                {
                    controller = "Test",
                    action = "getOwnMessage",
                }
            );

            //Endpoint para registrar un nuevo mensaje 
            routes.MapRoute(
                "insertR",
                "nuevoMensaje",
                new
                {
                    controller = "Test",
                    action = "nuevoMensaje",
                }
            );

            //Endpoint para obtener los mensajes que el usuario loggeado ha enviado
            routes.MapRoute(
                "AdmiM",
                "AdminMensaje",
                new
                {
                    controller = "Test",
                    action = "AdminM",
                }
            );

            //Endpoint para registrar a una persona 
            routes.MapRoute(
                "IN",
                "IN/{id}/{nombre}/{contra}/{rol}/{correo}/{carne}/{estadoCivil}/{fechaNacimiento}/{sexo}/{direccion}/{apellido1}/{apellido2}",
                new
                {
                    controller = "Test",
                    action = "IN",
                }
            );

            //No se usa 
            routes.MapRoute(
                "DeleteownMessajeR",
                "delleteownmensaje/{id_m}/{id_p}",
                new
                {
                    controller = "Test",
                    action = "DelOwnM",
                }
            );

            //Endpoint para eliminar un mensaje 
            routes.MapRoute(
                "DeleteMensaje",
                "eliminarMensaje/{id_m}",
                new
                {
                    controller = "Test",
                    action = "EliminarMensaje",
                }
            );

            //No se usa 
            routes.MapRoute(
                "getDepartementPerson",
                "getDepartementPerson/{id}",
                new
                {
                    controller = "Test",
                    action = "getDepartementPerson"
                }
            );

            //No se usa 
            routes.MapRoute(
                "buscarPersonas",
                "buscarPersonas/{id}/{control}",
                new
                {
                    controller = "Test",
                    action = "buscarPersonas"
                }
            );

            //Endpoint para agregar una persona a un departamento
            routes.MapRoute(
                "setPersonaToDepartment",
                "setPersonaToDepartment/{idP}/{nombre}",
                new
                {
                    Controller = "Test",
                    action = "setPersonaToDepartment"
                }
             );

            //Endpoint para obtener todas las sedes
            routes.MapRoute(
                    "getSedes",
                    "getSedes",
                    new
                    {
                        Controller = "Test",
                        action = "getSedes"
                    }
            );

            //Endpoint para eliminar a una persona de un departamento
            routes.MapRoute(
                    "deletePeopleFromDepartment",
                    "deletePeopleFromDepartment/{nombreDep}/{idP}",
                    new
                    {
                        Controller = "Test",
                        action = "deletePeopleFromDepartment"
                    }
            );

            //Endpoint para obtener un departamento segun un filtro 
            routes.MapRoute(
                "getDepartmentoFiltrados",
                "getDepartmentosFiltrados/{sede}/{categoria}",
                new
                {
                    Controller = "Test",
                    action = "getDepartmentFiltrados"
                }
            );
        
            //Endpoint para obtener todos los departamentos de una sede
            routes.MapRoute(
                "getDepartamentosPorSede",
                "getDepartamentosPorSede/{sede}",
                new
                {
                    Controller = "Test",
                    action = "getDepartamentosPorSede"
                }
             );

            //Endpoint para obtener la informacion de una persona 
            routes.MapRoute(
                "getPersonas",
                "getPersonas",
                new
                {
                    Controller = "Test",
                    action = "getPersonas"
                }
            );

            //Endpoint para obtener a todas las personas que no son estudiantes 
            routes.MapRoute(
                    "getEncargados",
                    "getEncargados",
                    new
                    {
                        Controller = "Test",
                        action = "getEncargados"
                    }
            );

            //Endpoint para obtener los miembros de un departamento 
            routes.MapRoute(
                    "getPersonabyDepartamento",
                    "getPersonabyDepartamento/{nombreDepa}",
                    new
                    {
                        Controller = "Test",
                        action = "getPersonabyDepartamento"
                    }
            );

            //No borrar 
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );

        }
    }
}