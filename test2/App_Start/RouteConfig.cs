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
            
            routes.MapRoute(
                "logRr",
                "log/{id}/{pass}",
                new
                {
                    controller = "Test",
                    action = "Log",
                }
            );

            // endpoint cambiar contraseña
            routes.MapRoute(
                "changePass",
                "cambiarContra/{nPass}/{id}",
                new
                {
                    controller = "Test",
                    action = "changePass",
                }
           );

            routes.MapRoute(
                "insertD",///nombre que quiera
                "insertarDepartamento/{nombre}/{tipo}/{sede}/{encargado}",///aparece url
                new
                {
                    controller = "Test",
                    action = "Departamentos",///nombre TestController
                }
            );

            routes.MapRoute(
                "OD",///nombre que quiera
                "obtenerD",///aparece url
                new
                {
                    controller = "Test",
                    action = "obtenerD",///nombre TestController
                }
            );

            routes.MapRoute(
                "setVisto",
                "setVisto/{id}/{idm}",
                new
                {
                    controller = "Test",
                    action = "setVisto"
                }
            );

            routes.MapRoute(
                "SendEmail",
                "SendEmail", // esto se pone en el url en js.js
                new
                {
                    controller = "Test",
                    action = "SendEmail", // asi se llama la funcion en TestController
                }
           );

            routes.MapRoute(
                "gomR",
                "getOwnMessage/{id}",
                new
                {
                    controller = "Test",
                    action = "getOwnMessage",
                }
            );
            routes.MapRoute(
                "insertR",
                "nuevoMensaje",
                new
                {
                    controller = "Test",
                    action = "nuevoMensaje",
                }
            );
            routes.MapRoute(
                "AdmiM",
                "AdminMensaje",
                new
                {
                    controller = "Test",
                    action = "AdminM",
                }
            );
            routes.MapRoute(
                "IN",
                "IN/{id}/{nombre}/{contra}/{rol}/{correo}/{carne}/{estadoCivil}/{fechaNacimiento}/{sexo}/{direccion}/{apellido1}/{apellido2}",
                new
                {
                    controller = "Test",
                    action = "IN",
                }
            );
            routes.MapRoute(
                "DeleteownMessajeR",
                "delleteownmensaje/{id_m}/{id_p}",
                new
                {
                    controller = "Test",
                    action = "DelOwnM",
                }
            );

            routes.MapRoute(
                "DeleteMensaje",
                "eliminarMensaje/{id_m}",
                new
                {
                    controller = "Test",
                    action = "EliminarMensaje",
                }
            );

            routes.MapRoute(
                "getDepartementPerson",
                "getDepartementPerson/{id}",
                new
                {
                    controller = "Test",
                    action = "getDepartementPerson"
                }
            );

            routes.MapRoute( //nuevo
                "buscarPersonas",
                "buscarPersonas/{id}/{control}",
                new
                {
                    controller = "Test",
                    action = "buscarPersonas"
                }
            );

            //nuevo
            routes.MapRoute(
                "setPersonaToDepartment",
                "setPersonaToDepartment/{idP}/{nombre}",
                new
                {
                    Controller = "Test",
                    action = "setPersonaToDepartment"
                }
             );
            //nuevo
            routes.MapRoute(
                    "getSedes",
                    "getSedes",
                    new
                    {
                        Controller = "Test",
                        action = "getSedes"
                    }
            );

            routes.MapRoute(
                    "deletePeopleFromDepartment",
                    "deletePeopleFromDepartment/{nombreDep}/{idP}",
                    new
                    {
                        Controller = "Test",
                        action = "deletePeopleFromDepartment"
                    }
            );

            routes.MapRoute(
                "getDepartmentoFiltrados",
                "getDepartmentosFiltrados/{sede}/{categoria}",
                new
                {
                    Controller = "Test",
                    action = "getDepartmentFiltrados"
                }
            );

            routes.MapRoute(
                "getDepartamentosPorSede",
                "getDepartamentosPorSede/{sede}",
                new
                {
                    Controller = "Test",
                    action = "getDepartamentosPorSede"
                }
             );

            routes.MapRoute(
                "getPersonas",
                "getPersonas",
                new
                {
                    Controller = "Test",
                    action = "getPersonas"
                }
            );

            routes.MapRoute(
                    "getEncargados",
                    "getEncargados",
                    new
                    {
                        Controller = "Test",
                        action = "getEncargados"
                    }
            );
            //nuevo
            routes.MapRoute(
                    "getPersonabyDepartamento",
                    "getPersonabyDepartamento/{nombreDepa}",
                    new
                    {
                        Controller = "Test",
                        action = "getPersonabyDepartamento"
                    }
            );

            routes.MapRoute(//no mover de aqui
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );

        }
    }
}