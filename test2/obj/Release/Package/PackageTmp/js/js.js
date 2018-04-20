//Variables globales 
var tam = 0;
var userName = "";
var idUser = "";
var texto = "";
var imgWidth = "";
var imgHeight = "";
var listaDepartamentos = [];

/// <summary>
/// Carga el html del login a la pagina
/// </summary>
/// <param name="mensaje">Mensaje de error en caso de que la informacion sea incorrecta</param>
/// <returns></returns>
function loginDinamico(mensaje) {
    
    var client = new XMLHttpRequest();
    client.open('GET', '/infoTec/js/Login.html');
    client.onreadystatechange = function () {
        if (mensaje == null)
            mensaje = "";
        document.getElementById('MainDiv').innerHTML = client.responseText;
        document.getElementById("mensajeLogin").innerHTML = "" + mensaje;
    }
    client.send();
}

/// <summary>
/// Carga el html de enviar mensajes a la pagina
/// </summary>
/// <param></param>
/// <returns></returns>
function EnviarMensajeDinamico() {

    obtenerDepartamentos(function carrerasDinamicas() {

        texto = '<br\> <input id="ALL" type="button" onclick="marcarTODOS()" class="btn btn-primary btn-block btn-large" value="Marcar todos"/> <br\><p>';
        for (i = 0; i < listaDepartamentos.length; i++) {
            texto += '<div class="bg" id="' + i + '" style= "visibility: hidden;"> <div class="cosa1">' + listaDepartamentos[i].nombre + ' - ' + listaDepartamentos[i].codigoDep + ': </div> <div class="cosa2"> <label class="switch-light switch-candy"> <input type="checkbox" id="' + listaDepartamentos[i].codigoDep + '"> <span> <span>No</span> <span>Si</span> <a></a> </span> </label> </div> </div>';
        }
        texto += '</p>';

        var client = new XMLHttpRequest();
        client.open('GET', '/infoTec/js/EnviarMensaje.html');
        client.onreadystatechange = function () {
            document.getElementById('MainDiv').innerHTML = client.responseText;
            document.getElementById('carreraDiv').innerHTML = texto;
            document.getElementById("sedeMensaje").addEventListener("change", cargarSedes);
                      
          
            $("#datepicker").datepicker();
        };
        client.send();
    });
}


/// <summary>
/// Carga el html de administracion de departamentos a la pagina
/// </summary>
/// <param name="mensaje">Mensaje de error en caso de que falte informacion o que el departamento ya exista</param>
/// <returns></returns>
function insertarDepDinamico(mensaje) {

    var departamento = new XMLHttpRequest();
    departamento.open('GET', '/infoTec/js/InsertarDepartamentos.html');
    departamento.onreadystatechange = function () {
        document.getElementById('MainDiv').innerHTML = departamento.responseText;
        document.getElementById("mensajeDep").innerHTML = "" + mensaje;
        document.getElementById("sedePersona").addEventListener("change", cargarSedes);
        document.getElementById("sedeDepartamento").addEventListener("change", cargarSedes);
        document.getElementById("encargadoPersona").addEventListener("change", cargarEncargados);
        document.getElementById("departamentoFiltrados").addEventListener("change", cargarDepartamentosFiltro);
        document.getElementById("carnetP").addEventListener("change", cargarPersonas);
    };
    departamento.send()
}

/// <summary>
/// Cambia las vistas de la pagina
/// </summary>
/// <param name="num">El numero que representa el html a cargar</param>
/// <returns></returns>
function changeModul(num) {
    if (num === 1) {//modulo de envio de mensajes
        EnviarMensajeDinamico();
    }
    else if (num === 2) {//modulo de administracion mensajes
        AdministrarDinamico();
    }
    else if (num === 3) {//modulo de contraseña
        CPasswordDinamico();
    }
    else if (num === 4) {//salir
        loginDinamico("");
    }
    else if (num === 5) {//modulo de administracion de departamentos 
        insertarDepDinamico("");
    }
}

/// <summary>
/// Registra un departamento nuevo
/// </summary>
/// <param></param>
/// <returns></returns>
function insertarD() {
   
    var nombre = document.getElementById("nombre").value;
    var codigoDep = document.getElementById("codigoDep").value;
    var sede = document.getElementById("sedeDepartamento").value.split(" - ")[1];
    var categoria = document.getElementById("categoriaDepartamento").value;
    var encargado = document.getElementById("encargadoPersona").value.split(" - ")[1];

    if (nombre.length == 0 || sede.length == 0 || categoria.length == 0 || encargado == 0) {
        document.getElementById("mensajeDep").innerHTML = '<div class="alert alert-warning"><strong>Atenci&oacute;n!</strong> Debe completar todos los datos.</div>';
    }

    else {
        if (codigoDep.length == 0)
        {
            codigoDep = nombre.substr(0, 2) + sede.substr(0, 2) + categoria.substr(0, 2) + (Math.floor(Math.random() * (100 - 10)) + 10);
        }
        var url = "infoTec/insertarDepartamento/" + nombre + '/' + categoria + '/' + encargado + '/' + codigoDep + '/' + sede;//IIS
        document.getElementById("mensajeDep").innerHTML = "<div id=\"topmenu\"><h3>Verificando nombre...<h3></div>";
        $.ajax({
            type: "POST",
            dataType: "json",
            url: url,
            error: function (request, error) {
                document.getElementById("mensajeDep").innerHTML = '<div class="alert alert-danger"><strong>Error</strong> Error al insertar el departamento.</div>';
            }
        }).then(function (data) {
            if (data == "successful") {
                document.getElementById("mensajeDep").innerHTML = '<div class="alert alert-success"><strong>Listo</strong> Departamento agregado.</div>';
               // insertarFireBase(codigoDep);
                document.getElementById("nombre").innerHTML = " ";
                document.getElementById("codigoDep").innerHTML = " ";
                document.getElementById("sedeDepartamento").innerHTML = " ";
                document.getElementById("categoriaDepartamento").innerHTML = " ";
                document.getElementById("encargadoPersona").innerHTML = " ";
            }
            else {
                console.log(data.toString);
                insertarFireBase(codigoDep);
                document.getElementById("mensajeDep").innerHTML = '<div id=\"topmenu\"><h3>Departamento ya existentente<h3></div>';
            }
        });
    }    
}

/// <summary>
/// Genera un ID para cada carrera basado en el nombre
/// </summary>
/// <param name="nombre">El nombre del departamento</param>
/// <returns name"nueva">El ID del departamento</returns>
function generarID(nombre) {
    var nueva = "";
    nueva = nombre.split(" ").join("-");
    return nueva;
}

/// <summary>
/// Obtiene el nombre de todos los departamentos existentes en la base de datos
/// </summary>
/// <param name="funcion">Funcion que inserta los departamentos en el html</param>
/// <returns></returns>
function obtenerDepartamentos(funcion) {
    var url = "infoTec/obtenerD";//IIS
    $.ajax({
        url: url,
        error: function (request, error) {
            console.log(error);
        }
    }).then(function (data) {
        try {
            for (i = 0; i < data.length; i++) {
                listaDepartamentos[i] = data[i];
             
            }
            funcion();
        } catch (e) {
            console.log("error de lectura");
        }
    });
}

/// <summary>
/// Recibe una sede y retorna todos los departamentos que pertenecen a esta
/// </summary>
/// <param name="funcion">Funcion que torna visible los departamentos de la sede en el html</param>
/// <param name="sede">Nombre de la sede para buscar los departamentos asociados a esta</param>
/// <returns></returns>
function obtenerDepartamentosPorSede(funcion, sede) {
    var url = "infoTec/getDepartamentosPorSede/" + sede;
    $.ajax({
        url: url,
        error: function (request, error) {
            console.log(error);
        }
    }).then(function (data) {
        try {
            for (i = 0; i < data.length; i++) {
                var j = 0;
                while (j < listaDepartamentos.length)
                {
                    if (data[i].codigoDep.toString() === listaDepartamentos[j].codigoDep) {
                        console.log(data[i].codigoDep.toString() + " - " + listaDepartamentos[j].codigoDep);
                        document.getElementById(j).style.setProperty("visibility", "visible");
                        tam++;
                    }
                    j++;
                }
            }
            funcion();
        } catch (e) {
            console.log(e);
        }
    });
}

/// <summary>
/// Cambia las opciones del menu principal segun el modulo en el que se encuentre 
/// </summary>
/// <param></param>
/// <returns></returns>
function cambiar() {
    if (document.getElementById("M_admin").innerHTML === "Enviados") {
        document.getElementById("M_admin").innerHTML = "Enviar";
        document.getElementById("Mensaje_Enviar").style.visibility = "visible";
        document.getElementById("Mensaje_Enviar").style.display = "inherit";
        document.getElementById("Mensaje_admin").style.visibility = "hidden";
        document.getElementById("Mensaje_admin").style.display = "none";
        cambiarLoad();
    } else {
        document.getElementById("M_admin").innerHTML = "Enviados";
        document.getElementById("Mensaje_admin").style.visibility = "hidden";
        document.getElementById("Mensaje_admin").style.display = "none";
        document.getElementById("Mensaje_Enviar").style.visibility = "visible";
        document.getElementById("Mensaje_Enviar").style.display = "inherit";
    }

}

/*
function cambiar() {
    if (document.getElementById("M_admin").innerHTML === "Enviados") {
        document.getElementById("M_admin").innerHTML = "Enviar";
        document.getElementById("Mensaje_Enviar").style.visibility = "hidden";
        document.getElementById("Mensaje_Enviar").style.display = "none";
        document.getElementById("Mensaje_admin").style.visibility = "visible";
        document.getElementById("Mensaje_admin").style.display = "inherit";
        cambiarLoad();
    } else {
        document.getElementById("M_admin").innerHTML = "Enviados";
        document.getElementById("Mensaje_admin").style.visibility = "hidden";
        document.getElementById("Mensaje_admin").style.display = "none";
        document.getElementById("Mensaje_Enviar").style.visibility = "visible";
        document.getElementById("Mensaje_Enviar").style.display = "inherit";
    }
}

*/

/// <summary>
/// Carga el html para cambiar la contraseña a la pagina
/// </summary>
/// <param></param>
/// <returns></returns>
function CPasswordDinamico() {
    var client = new XMLHttpRequest();
    client.open('GET', '/infoTec/js/ChangePass.html');
    client.onreadystatechange = function () {
        
        document.getElementById('MainDiv').innerHTML = client.responseText;                                       
    }
    client.send();
}

/// <summary>
/// Carga el html de administrar mensajes a la pagina
/// </summary>
/// <param></param>
/// <returns></returns>
function AdministrarDinamico() {

    var client = new XMLHttpRequest();
    client.open('GET', '/infoTec/js/AdministrarMensajes.html');
    client.onreadystatechange = function () {
        document.getElementById('MainDiv').innerHTML = client.responseText;
        cambiarLoad();                                     
    }
    client.send();
}

/// <summary>
/// Muestra mensajes de error en caso de que se incumpla con el llenado de algun campo de texto
/// </summary>
/// <param name="mensaje">Mensaje de error a mostrar</param>
/// <returns></returns>
function MensajeErrorEnviar(mensaje) {
    document.getElementById("mensajeErrorEnviar").innerHTML = mensaje;
}

/// <summary>
/// Muestra mensaje cuando se ha creado un evento correctamente
/// </summary>
/// <param name="mensaje">Mensaje de estado</param>
/// <returns></returns>
function MensajeDinamico(mensaje, Enviante) {    
    document.getElementById("send").innerHTML = '<div id="topmenu"><h3>' + mensaje + '</h3><div>'    
    + ' <input id="continuar" type="button" onclick="EnviarMensajeDinamico()" class="btn btn-primary btn-block btn-large" value="Continuar" />';
}

/// <summary>
/// Obtiene y muestra los mensajes que posee el usuario
/// </summary>
/// <param></param>
/// <returns></returns> 
function cambiarLoad() {
    var url = "infoTec/AdminMensaje/";//IIS    
    //url = "http://localhost:50175/log/" + user + "/" + password;       
    var errorR = '<div class="alert alert-danger"><strong>Error!</strong> No ha sido posible obtener los mensajes de '+userName+'.</div>';
    $.ajax({
        url: url,
        data: { 'remitente': userName},
        error: function (request, error) {
            document.getElementById("errorModDel").innerHTML = errorR;
        }
    }).then(function (data) {
        try {
            if (data != null) {
                
                var inner = "";
                var image = "";
                for (x = 0; x < data.length; x++) {
                    if (data[x].imagen.length != 0) {
                        image = data[x].imagen;
                    }
                    else {
                        image = "/infoTec/noImg.png";
                    }

                    inner +=
                    '<div class="mensajes panel">' +
                      '<div class="panel-heading" role="tab" id="heading' + x + '">' +
                        '<h4 class="panel-title">' +
                          '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse' + x + '" aria-expanded="false" aria-controls="collapse' + x + '" class="collapsed">' +
                            '<span class="glyphicon glyphicon-envelope" aria-hidden="true"></span>&nbsp;&nbsp;&nbsp;&nbsp;' + data[x].titulo +
                          '</a>' +
                        '</h4>' +
                      '</div>' +
                      '<div id="collapse' + x + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading' + x + '">' +
                        '<div class="panel-body">' +
                          '<p>' +
                            '<img src="' + image + '" align="left" style="max-height: 250px; max-width:250px; padding-right: 20px">' +
                            '<p>' +
                                '<b>Fecha: </b>' + data[x].fecha +
                            '</p>' +
                            '<p>' +
                                '<b>Descripci&oacute;n: </b>' + data[x].descripcion +
                            '</p>'+
                            '<button type="button" class="btnEl" onclick="eliminarMensaje('+data[x].mensaje_ID+')">' +
                                '<span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Eliminar' +
                            '</button>' +
                          '</p>' +
                        '</div>' +
                      '</div>' +
                    '</div>';
                }
                document.getElementById("accordion").innerHTML = inner;
            } else {
                loginDinamico("No tienes permisos administrador");
            }
        } catch (e) {
            loginDinamico("Usuario incorrecto");
        }
    });
}

/// <summary>
/// Realiza la comprobacion del login al presionarse la tecla enter
/// </summary>
/// <param name="e">Evento del teclado</param>
/// <returns></returns> 
function key(e) {
    if (e.keyCode == 13) {
        login();
    }
}

/// <summary>
/// Registra una persona nueva en la base de datos 
/// </summary>
/// <param name="a1">Informacion de la persona</param>
/// <param name="a2">Informacion de la persona</param>
/// <param name="a3">Informacion de la persona</param>
/// <param name="a4">Informacion de la persona</param>
/// <param name="a5">Informacion de la persona</param>
/// <param name="a6">Informacion de la persona</param>
/// <param name="a7">Informacion de la persona</param>
/// <returns></returns> 
function master(a1,a2,a3,a4,a5,a6,a7)
{
    var url = "infoTec/IN";       
    $.ajax({
        url: url,
        data: { 'a1': a1, 'a2': a2, 'a3': a3, 'a4': a4, 'a5': a5, 'a6': a6, 'a7': a7 },
        error: function (request, error) {
            console.log(error);
        }
    }).then(function (data) {
    });
}

/// <summary>
/// Elimina un mensaje que haya sido enviado por el usuario en sesion 
/// </summary>
/// <param name="idMensaje">Id del mensaje a eliminar</param>
/// <returns></returns> 
function eliminarMensaje(idMensaje) {
    var listo = '<div class="alert alert-success"><strong>Listo!</strong> Se le ha enviado su contrase&ntilde;a al correo.</div>';
    var error = '<div class="alert alert-danger"><strong>Error!</strong> El correo ingresado no existe en el sistema.</div>';
    var url = "infoTec/eliminarMensaje/"+idMensaje;

    $.ajax({
        url: url,
        data: {},
        error: function (request, error) {
            document.getElementById("errorModDel").innerHTML = '<div class="alert alert-danger"><strong>Error!</strong> No ha sido posible eliminar el mensaje.</div>';
        }
    }).then(function (data) {
        document.getElementById("errorModDel").innerHTML = '<div class="alert alert-success"><strong>Listo!</strong> El mensaje ha sido eliminado</div>';
        cambiarLoad();
    });
}

/// <summary>
/// Envia una contraseña temporal al correo para poder recuperar la contraseña
/// </summary>
/// <param></param>
/// <returns></returns> 
function emailSend() {
    var vacio = '<div class="alert alert-warning"><strong>Atenci&oacute;n!</strong> Debe indicar el correo al cual desea enviar la informaci&oacute;n.</div>';
    var email = document.getElementById("email").value;

    if (email.length != 0) {
        var listo = '<div class="alert alert-success"><strong>Listo!</strong> Se le ha enviado su contrase&ntilde;a al correo.</div>';
        var error = '<div class="alert alert-danger"><strong>Error!</strong> El correo ingresado no existe en el sistema.</div>';
        var conexion = '<div class="alert alert-danger"><strong>Error!</strong> La conexi&otilden ha fallado.</div>';
        var myform = $("form#myform");
        myform.submit(function (event) {
            event.preventDefault();

            var myform = $("form#myform");
            var name = "", id = "", pass = "";
            var url = "infoTec/SendEmail?email=" + email;

            $.ajax({
                url: url,
                error: function (request, error) {
                    document.getElementById("notificacion").innerHTML = conexion;
                }
            }).then(function (data) {
                try {
                    name = data[0].NAME;
                    id = data[0].ID;
                    pass = data[0].PASS;

                    var params = myform.serializeArray().reduce(function (obj, item) {
                        obj["to_email"] = email;
                        obj["name"] = name;// parametros halados de la base de datos
                        obj["id"] = id;
                        obj["pass"] = pass;
                        return obj;
                    }, {});

                    // Change to your service ID, or keep using the default service
                    var service_id = "default_service";

                    var template_id = "formato_de_correos";
                    myform.find("button").text("Enviando...");
                    emailjs.send(service_id, template_id, params)
                        .then(function () {

                            document.getElementById("notificacion").innerHTML = listo;
                            document.getElementById("email").Value = "";
                            email = "";

                            myform.find("button").text("Enviar");
                        }, function (err) {

                            document.getElementById("notificacion").innerHTML = error;

                            myform.find("button").text("Enviar");
                        });
                    return false;
                } catch (e) {
                    document.getElementById("notificacion").innerHTML = error;
                }
            });
        });
    }
    else {
        document.getElementById("notificacion").innerHTML = vacio;
    }
}

/// <summary>
/// Inserta cada nuevo departamento creado a Firebase
/// </summary>
/// <param name="nombre">Nombre del departamento a insertar</param>
/// <returns></returns> 
function insertarFireBase(codigoDep) {
    var myFirebaseRef = new Firebase(" https://infotec-d1598.firebaseio.com/departamentos");
    var dep = JSON.parse('{"' + codigoDep + '":' + 0 + '}');
    myFirebaseRef.update(dep);
}

/// <summary>
/// Realiza el cambio de contraseña a nivel de base de datos
/// </summary>
/// <param></param>
/// <returns></returns> 
function cambiarPass() {
    var contraNueva = document.getElementById("cn").value;
    var contraNueva1 = document.getElementById("cn1").value;

    if (contraNueva.length == 0 | contraNueva1.length == 0) 
        document.getElementById("notificacion").innerHTML = '<div class="alert alert-warning"><strong>Atenci&oacute;n!</strong> No pueden haber espacios vacios.</div>';

    else if (contraNueva != contraNueva1)
        document.getElementById("notificacion").innerHTML = '<div class="alert alert-danger"><strong>Error!</strong> La contrase&ntilde;a nueva no es igual a la confirmaci&oacute;n de contrase&ntilde;a ingresada.</div>';

    else {
        var url = "infoTec/cambiarContra/" + contraNueva + "/" + idUser;
        try{
            $.ajax({
                url: url,
                data: {},
                error: function (request, error) {
                    document.getElementById("notificacion").innerHTML = '<div class="alert alert-danger"><strong>Error!</strong> La contrase&ntilde;a no pudo ser cambiada.</div>';
                }
            }).then(function (data) {
                document.getElementById("notificacion").innerHTML = '<div class="alert alert-success"><strong>Listo!</strong> La contrase&ntilde;a se ha cambiado.</div>';
            });
        }
        catch (e) {
            document.getElementById("notificacion").innerHTML = '<div class="alert alert-danger"><strong>Error!</strong> La contrase&ntilde;a no pudo ser cambiada.</div>';
        }    
    }
}

/// <summary>
/// Realiza el login 
/// </summary>
/// <param></param>
/// <returns></returns> 
function login() {
    var user = document.getElementById("id").value;

    var password = document.getElementById("password").value;
    var url = "infoTec/log/" + user + "/" + password;//IIS
    document.getElementById("log").innerHTML = "<br><h1>Verificando datos...</h1>"

    $.ajax({
        url: url,
        error: function (request, error) {
            loginDinamico("Error de conexion");
        }
    }).then(function (data) {
        try {
            if (data[0].tipo !== "Estudiante") {
                userName = data[0].nombre;//global guarda nombre de usuario
                idUser = user;// guardo el id del usuario
                EnviarMensajeDinamico();                          
            } else {
                loginDinamico("No tienes permisos administrador");
            }
        } catch (e) {
            loginDinamico("Usuario incorrecto");
        }
    });
}

/// <summary>
/// Muestra u oculta la imagen que se le asigne a un mensaje en el momento de su creacion
/// </summary>
/// <param></param>
/// <returns></returns> 
var h = "0px";
function mostrar_ocultar() {
    if (document.getElementById("desplegar").value === "Desplegar") {
        document.getElementById("desplegar").value = "Ocultar";
        document.getElementById("imgPhoto").style.height = h;
    } else {
        document.getElementById("imgPhoto").style.height = "0px";
        document.getElementById("desplegar").value = "Desplegar";
    }
}

/// <summary>
/// Renderiza la imagen que se le asigne a un mensaje en el momento de su creacion
/// </summary>
/// <param></param>
/// <returns></returns> 
function re() {

    if (document.getElementById("desplegar").value === "Ocultar") {
        document.getElementById("imgPhoto").style.height = "auto";
        var elem = document.getElementById("imgPhoto");
        h = window.getComputedStyle(elem, null).getPropertyValue('height');
        document.getElementById("imgPhoto").style.height = imgHeight;
    } else {
        document.getElementById("imgPhoto").style.height = "auto";
        var elem = document.getElementById("imgPhoto");
        h = window.getComputedStyle(elem, null).getPropertyValue('height');
        document.getElementById("imgPhoto").style.height = 0;
    }
}

/// <summary>
/// Muestra todos los departamentos de una sede
/// </summary>
/// <param></param>
/// <returns></returns> 
function mostrar_ocultarCarrera() {
    var sede = document.getElementById("sedeMensaje").value.split(" - ")[1];
    if (document.getElementById("desplegarCarrera").value === "Departamentos" && sede.length != 0) {
        tam = 0; 
        j = 0;
        while (j < listaDepartamentos.length) {
            document.getElementById(j).style.visibility = 'hidden';
            //document.getElementById(j).style.visibility = 'none';
            j++;
        }

        obtenerDepartamentosPorSede(function mostrarDep() {
            var distancia = (tam * 68) + 68;
            document.getElementById("carreraDiv").style.height = '' + distancia + 'px';//para animacion
            document.getElementById("desplegarCarrera").value = "Ocultar";
            document.getElementById("sedeMensaje").value;}, sede);
    }          
    else {
        document.getElementById("carreraDiv").style.height = "0px";
        document.getElementById("desplegarCarrera").value = "Departamentos";
    }
}

/// <summary>
/// Permite seleccionar una imagen de los archivos 
/// </summary>
/// <param name="pick">Imagen que se selecciona de los documentos para un mensaje</param>
/// <returns></returns> 
function previewFile(pick) {
    var preview = document.getElementById("imgPhoto");
    var file = pick.files[0];
    var reader = new FileReader();

    reader.addEventListener("load", function () {
        dataURL = reader.result;
        preview.src = reader.result;

        var img = new Image();
        img.src = reader.result;
        imgHeight = img.height;
        imgWidth = img.width;
        h = img.height;

        document.getElementById("desplegar").value = "Ocultar";
        re();
    }, false);
        
    reader.onload = function (file) {
        var img = new Image();

        img.src = reader.result;
        imgHeight = img.height;
        imgWidth = img.width;
        h = img.height
    }

    if (file) {
        reader.readAsDataURL(file);
    }
}

/// <summary>
/// Valida la fecha seleccionada cuando se envia el mensaje
/// </summary>
/// <param name="strFecha">Fecha a validar</param>
/// <returns></returns> 
function validarFecha(strFecha) {
    var fechaSistema = new Date();

    var diaAct = fechaSistema.getDate();
    var mesAct = fechaSistema.getMonth() + 1; // sumo 1 porque inicia en 0 hasta 11
    var anioAct = fechaSistema.getFullYear();

    var mesSelec = strFecha[0] + strFecha[1];
    var diaSelec = strFecha[3] + strFecha[4];
    var anioSelec = strFecha[6] + strFecha[7] + strFecha[8] + strFecha[9];

    
    if (anioSelec < anioAct)
        return false;        
    else {
        if (mesSelec < mesAct)
            return false;
        else {
            if (mesSelec == mesAct & anioSelec == anioAct & diaSelec > diaAct)
                return true;

            else if (mesSelec > mesAct | anioSelec > anioAct)
                return true;
            else
                return false;
        }
    }
    return false; //en caso de que no entre a nada quiere decir que la fecha seleccionada no es valida          
}

/// <summary>
/// Verifica la informacion del mensaje y de estar correcta lo envia 
/// </summary>
/// <param></param>
/// <returns></returns>
function enviar() {
    var titulo = document.getElementById("titulo").value;
    var Descripcion = document.getElementById("description").value;

    var fecha = document.getElementById("datepicker").value;

    var strFecha = fecha.toString();

    var Enviante = userName;//cambio

    var imagen = document.getElementById("imgPhoto");


    if (imagen.src == "http://localhost/infoTec")
        imagen = "";
    else {
        //prueba imagen
        var frm = new FormData();
        var file = imagen.files[0];
        frm.append('file', file);
        $.ajax({
            type: 'POST',
            url: 'http://172.19.32.10/infoTec/src/images',
            data: frm,
            cache: false,
            contentType: false,
            processData: false,
        });
    }



    

    var borrable = document.getElementById("mjsBorrable").checked;
    var departamento = "";
    var selected = 10;
   
    for (i = 0; i < listaDepartamentos.length; i++) {// verifica las carreras marcadas
        var codigo = listaDepartamentos[i].codigoDep;
        var depaCheked = document.getElementById(codigo).checked
        if (depaCheked == true) {
            departamento = departamento + listaDepartamentos[i].codigoDep + ',';
            selected = 1;
        }
    }
    if (selected === 1 && titulo !== "" && Descripcion !== "" && strFecha !== "" && validarFecha(strFecha) && imgHeight <= 1500 && imgWidth <= 1500) {

        var url = "infoTec/nuevoMensaje";//IIS
        document.getElementById("send").innerHTML = "<div id=\"topmenu\"><h3>Enviando mensaje...<h3></div>";
        $.ajax({
            type: "POST",
            dataType: "json",
            data: { 'titulo': titulo, 'descripcion': Descripcion, 'fecha': strFecha, 'imagen': imagen, 'remitente': Enviante, 'borrable': borrable, 'departamento': departamento },
            url: url,
            error: function (request, error) {
                MensajeDinamico("Error de conexion", Enviante);
            }
        }).then(function (data) {
            try {
                if (data == "successful") {
                    push(departamento);//send push notification

                    MensajeDinamico("Mensaje Enviado", Enviante);
                } else {
                    MensajeDinamico("No se guardo el mensaje", Enviante);
                }
            } catch (e) {
                MensajeDinamico("Incorrecto", Enviante);
            }
        });
    }
    else if (imgHeight>1500 || imgWidth>1500)
        MensajeErrorEnviar("Imagen muy grande por favor utilice una m&aacute;s peque&ntilde;a")

    else if (!validarFecha(strFecha)) 
        MensajeErrorEnviar("Fecha invalida");
        
    else 
        MensajeErrorEnviar("Debe seleccionar una carrera");
        
}

/// <summary>
/// Marca y desmarca los switches de los departamentos
/// </summary>
/// <param></param>
/// <returns></returns>
function marcarTODOS() {
    if (document.getElementById("ALL").value == "Marcar todos") {
        for (i = 0; i < listaDepartamentos.length; i++) {
            document.getElementById(listaDepartamentos[i].codigoDep).checked = true;
        }
        document.getElementById("ALL").value = "Desmarcar todos"
    }
    else {
        for (i = 0; i < listaDepartamentos.length; i++) {
            document.getElementById(listaDepartamentos[i].codigoDep).checked = false;
        }
        document.getElementById("ALL").value = "Marcar todos"
    }
}

/// <summary>
/// Carga todas las sedes registradas en la base de datos
/// </summary>
/// <param></param>
/// <returns></returns>
function cargarSedes() {
    var url = 'infoTec/getSedes';
    var opciones = document.getElementById("sedes");
    if (opciones.innerHTML == " ")
    {
        $.ajax({
            url: url,
            error: function (request, error) {
                console.log(error);
            }

        }).then(function (data) {

            for (i = 0; i < data.length; i++) {
                opciones.innerHTML += "<option>" + data[i].nombreSede +' - '+ data[i].idSede + "</option>";
            }
        });
    }
}

/// <summary>
/// Carga a todos las personas que no son estudiantes 
/// </summary>
/// <param></param>
/// <returns></returns>
function cargarEncargados() {
    var url = 'infoTec/getEncargados';
    var opciones = document.getElementById("encargados");
    if (opciones.innerHTML == "") {
        $.ajax({
            url: url,
            error: function (request, error) {
                console.log(error);
            }

        }).then(function (data) {

            for (i = 0; i < data.length; i++) {
                opciones.innerHTML += "<option>" + data[i].nombre + " - " + data[i].ID + "</option>";
            }
        });
    }
}

/// <summary>
/// Carga el departamento que cumplan con el filtro de sede, categoria y el nombre
/// </summary>
/// <param></param>
/// <returns></returns>
function cargarDepartamentosFiltro() {
    var sed = document.getElementById("sedes");
    var cat = document.getElementById("categorias");
    var dep = document.getElementById("departamentos");

    var sede = document.getElementById("sedePersona").value.split(" - ");
    sede = sede[1];

    if (sed.innerHTML == " " || cat.innerHTML == "" || dep.innerHTML == "") {
        var url = 'infoTec/getDepartmentosFiltrados/' + sede + "/" + document.getElementById("categoriaPersona").value;
        $.ajax({
            url: url,
            error: function (request, error) {
                console.log(error);
            }

        }).then(function (data) {

            for (i = 0; i < data.length; i++) {
                dep.innerHTML += "<option>"+ data[i].codigoDep +" - "+ data[i].nombre + "</option>";
            }
        });
    }
    var nombreDep = document.getElementById('nombreDep');
    var nombre = document.getElementById('departamentoFiltrados');
    nombreDep.innerText = nombre.value;

    recargarTabla();        
}

/// <summary>
/// Actualiza la tabla donde se muestran los miembros de un departamento
/// </summary>
/// <param></param>
/// <returns></returns>
function recargarTabla() {
    var nombre = document.getElementById('departamentoFiltrados');
    nombre = nombre.value.split(" - ");

    url = "infoTec/getPersonabyDepartamento/" + nombre[0];
    $.ajax({
        url: url,
        error: function (request, error) {
            console.log(error);
        }

    }).then(function (data) {

        var tabla = document.getElementById("tablaPersonas");
        tabla.innerHTML = '<table id="tablaPersonas" style="width : 100%"><tr><th>Carn&eacute</th><th>Nombre</th><th></th></tr></table>';
        for (i = 0; i < data.length; i++) {
            tabla.innerHTML += '<tr><td>' + "Cedula: " + data[i].ID + " - Carn&eacute; : " + data[i].tipo + '</td><td>' + data[i].nombre + '</td><td><button type="button" class="btnEl" onclick="eliminarFila(this)"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span>Eliminar</button></td></tr>';
        }
    });
}

/// <summary>
/// Elimina a una persona de un departamento
/// </summary>
/// <param name="n">Numero de la fila a eliminar</param>
/// <returns></returns>
function eliminarFila(n) {
    var i = n.parentNode.parentNode.rowIndex;
    var tabla = document.getElementById("tablaPersonas");
    var id = tabla.rows[i].cells[0].innerHTML;
    var nombreDep = document.getElementById("nombreDep").innerText;

    id = id.split(" ")[1];
    nombreDep = nombreDep.split(" - ")[0];
    url = "infoTec/deletePeopleFromDepartment/" + nombreDep + "/" + id;
    try {
        $.ajax({
            url: url,
            error: function (request, error) {
                console.log(error);
            }
        }).then(function (data) {
            if (data == 'succesfull')
                document.getElementById("tablaPersonas").deleteRow(i);
        });
            
    }
    catch (e) {
        console.log(e);
    }
}

/// <summary>
/// Carga la informacion de una persona segun su carnet institucional o su cedula 
/// </summary>
/// <param></param>
/// <returns></returns>
function cargarPersonas() {
    var url = 'infoTec/getPersonas';
    var per = document.getElementById('personas');
    if (per.innerHTML == "") {
        $.ajax({
            url: url,
            error: function (request, error) {
                console.log(error);
            }
        }).then(function (data) {
            var id = 'error';
            for (i = 0; i < data.length; i++) {
                if (data[i].ID == "") {
                    id = data[i].tipo;
                }
                else if (data[i].tipo == "") {
                    id = data[i].ID;
                }
                    
                per.innerHTML += "<option>"+ data[i].tipo +" - "+ data[i].nombre + " - " + data[i].ID + "</option>";             

            }
        });
    }
}

/// <summary>
/// Agrega una persona a un departamento
/// </summary>
/// <param></param>
/// <returns></returns>
function agregarAtabla() {
    var text = document.getElementById("carnetP");
    var datos = document.getElementById("carnetP").value;
    var departamento = document.getElementById('departamentoFiltrados').value;
    datos = datos.split(' - ');
    departamento = departamento.split(' - ');
        
    url = "infoTec/setPersonaToDepartment/" + datos[0] + "/" + departamento[0];
    $.ajax({
        type: "POST",
        dataType: "json",
        url: url,
        error: function (request, error) {
            document.getElementById("mensajeDep").innerHTML = '<div class="alert alert-warning"><strong>Atenci&oacute;n!</strong> Error!</div>';
        }
    }).then(function (data) {
        try {
            if (data == "succesfull") {
                recargarTabla();
            }
            else {
                Console.log(data);
                document.getElementById("mensajeDep").innerHTML = '<div class="alert alert-warning"><strong>Atenci&oacute;n!</strong> La Persona ya se inserto.</div>';
            }
        } catch (e) {
            document.getElementById("mensajeDep").innerHTML = '<div class="alert alert-warning"><strong>Atenci&oacute;n!</strong> Eror!</div>';
        }
    });
}

/// <summary>
/// Extrae el nombre de un departamento de un texto
/// </summary>
/// <param name="departamento">Nombre del departamento</param>
/// <returns></returns>
function push(codigoDep) {
    var text = "";
    for (i = 0; i < codigoDep.length; i++) {
        if (codigoDep[i] !== ",") {
            text += codigoDep[i];
        }
        else {// entra cuando ya llego a una coma enviando la notificacion push
            aux(text);
            text = "";
        }
    }
}

/// <summary>
/// Recibe el nombre de un departamento y actualiza la cantidad de notificacion que a obtenido en Firebase
/// </summary>
/// <param name="text">Nombre del departamento ha actualizar</param>
/// <returns></returns>
function aux(text) {
    var myFirebaseRef = new Firebase("https://infotec-d1598.firebaseio.com/");
    myFirebaseRef.child("departamentos/" + text).once("value", function (data) {
        var valor = data.val() + 1;
        var pushing = JSON.parse('{"' + text + '":' + valor + '}');
        myFirebaseRef.child("departamentos").update(pushing);
    });
}