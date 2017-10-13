var userName = "";
var idUser = "";
var texto = "";
var listaCarreras = [];
var listaIdCarreras = [];
var imgWidth = "";
var imgHeight = "";

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
function EnviarMensajeDinamico() {

    obtenerDepartamentos(function carrerasDinamicas() {
        texto = '<p style="color:white"><input id="ALL" type="button" onclick="marcarTODOS()" class="btn btn-primary btn-block btn-large" value="Marcar todos" />';
        for (i = 0; i < listaCarreras.length; i++) {
            texto += '<div class="bg"> <div class="cosa1">' + listaCarreras[i] + ':</div> <div class="cosa2"><input id="' + listaIdCarreras[i] + '" value="' + listaCarreras[i] + '" class="right" type="checkbox" data-off-color="warning"/></div></div>';
        }
        texto += '</p>';
        var client = new XMLHttpRequest();
        client.open('GET', '/infoTec/js/EnviarMensaje.html');
        client.onreadystatechange = function () {
            document.getElementById('MainDiv').innerHTML = client.responseText;
            document.getElementById('carreraDiv').innerHTML = texto;

            for (i = 0; i < listaIdCarreras.length; i++) {
                $("#" + listaIdCarreras[i]).bootstrapSwitch();
            }
            $("#switch-offColor").bootstrapSwitch();
            $("#datepicker").datepicker();
        };
        client.send();
    });
}
function insertarDepDinamico(mensaje) {

    var departamento = new XMLHttpRequest();
    departamento.open('GET', '/infoTec/js/InsertarDepartamentos.html');
    departamento.onreadystatechange = function () {
        document.getElementById('MainDiv').innerHTML = departamento.responseText;
        document.getElementById("mensajeDep").innerHTML = "" + mensaje;
    };
    departamento.send();
}
function changeModul(num) {// cambia las vistas de la pagina
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
    else if (num === 5) {//modulo de departamentos 
        insertarDepDinamico("");
    }
}
function insertarD() {///////////////////////////////////////////////////////////////////////////
   
    var nombre = document.getElementById("nombre").value;
    if (nombre.length == 0) {
        document.getElementById("mensajeDep").innerHTML = '<div class="alert alert-warning"><strong>Atenci&oacute;n!</strong> Debe ingresar un nombre para el departamento.</div>';
    }
    else {
    var url = "infoTec/insertarDepartamento/" + nombre;//IIS
        document.getElementById("inDep").innerHTML = "<div id=\"topmenu\"><h3>Verificando nombre...<h3></div>";
        $.ajax({
            type: "POST",
            dataType: "json",
            data: { 'nombre': nombre },
            url: url,
            error: function (request, error) {
                document.getElementById("mensajeDep").innerHTML = '<div class="alert alert-danger"><strong>Error!</strong> Error al insertar el departamento.</div>';
            }
        }).then(function (data) {
            try {
                if (data === "successful") {
                    console.log(2);
                    document.getElementById("mensajeDep").innerHTML = '<div class="alert alert-success"><strong>Listo!</strong> Departamento agregado de manera exitosa.</div>';
                    insertarFireBase(nombre);
                }
            } catch (e) {
                document.getElementById("mensajeDep").innerHTML = '<div class="alert alert-warning"><strong>Atenci&oacute;n!</strong> El departamento ya existe.</div>';
            }
        });
    }    
}

function generarID(nombre) {
    var nueva = "";
    nueva = nombre.split(" ").join("_");
    return nueva;
}

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
                listaCarreras[i] = data[i].toString();
                listaIdCarreras[i] = generarID(data[i].toString());
                //console.log(listaCarreras[i]);
                //console.log(listaIdCarreras[i]);
            }
            funcion();
        } catch (e) {
            console.log("error de lectura");
        }
    });
}

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

function CPasswordDinamico() {
    var client = new XMLHttpRequest();
    client.open('GET', '/infoTec/js/ChangePass.html');
    client.onreadystatechange = function () {
        
        document.getElementById('MainDiv').innerHTML = client.responseText;
        //document.getElementById("UserName").innerHTML = userName; //nombre del usuario                                        
    }
    client.send();
}

function AdministrarDinamico() {

    var client = new XMLHttpRequest();
    client.open('GET', '/infoTec/js/AdministrarMensajes.html');
    client.onreadystatechange = function () {
        document.getElementById('MainDiv').innerHTML = client.responseText;
        cambiarLoad();
        //document.getElementById("UserName").innerHTML = userName; //nombre del usuario                                        
    }
    client.send();
}



// funcion que se encarga de mostrar mensaje de error en caso de que se incumpla con el llenado de algun campo de texto
function MensajeErrorEnviar(mensaje) {
    document.getElementById("mensajeErrorEnviar").innerHTML = mensaje;
}

function MensajeDinamico(mensaje, Enviante) {
    
    document.getElementById("send").innerHTML = '<div id="topmenu"><h3>' + mensaje + '</h3><div>'    
    + ' <input id="continuar" type="button" onclick="EnviarMensajeDinamico()" class="btn btn-primary btn-block btn-large" value="Continuar" />';
}

function cambiarLoad() {
    var url = "infoTec/AdminMensaje/";//IIS    
    //url = "http://localhost:50175/log/" + user + "/" + password;//c#        
    var errorR = '<div class="alert alert-danger"><strong>Error!</strong> No ha sido posible obtener los mensajes de '+userName+'.</div>';
    $.ajax({
        url: url,
        data: { 'remitente': userName},
        error: function (request, error) {
            document.getElementById("errorModDel").innerHTML = errorR;
        }
    }).then(function (data) {
        try {
            //console.log(data);
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
                           //'<button type="button" data-toggle="modal" data-target="#modalEditar" class="btnEd" onclick="editarMensaje('+data[x].mensaje_ID+',\''+data[x].descripcion+'\',\''+data[x].fecha+'\',\''+data[x].titulo+'\')">' + 
                           //     '<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> Modificar' +
                           // '</button>' +
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

function key(e) {
    if (e.keyCode == 13) {
        login();
    }
}

function master(a1,a2,a3,a4,a5,a6,a7)
{
    var url = "infoTec/IN";
    //console.log(url);        
    $.ajax({
        url: url,
        data: { 'a1': a1, 'a2': a2, 'a3': a3, 'a4': a4, 'a5': a5, 'a6': a6, 'a7': a7 },
        error: function (request, error) {
            console.log(error);
        }
    }).then(function (data) {
    });
}

function editarMensaje(idMensaje, description, date, titulo) {
    console.log(idMensaje);
    document.getElementById("tituloEd").value = titulo.toString();
    document.getElementById("descripcionEd").value = description.toString();
    document.getElementById("datepickerEd").value = date
    var error = '<div class="alert alert-danger"><strong>Error!</strong> El correo ingresado no existe en el sistema.</div>';
}

// funcion encargada de eliminar un mensaje
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

//-----------------------------------------
//----------  ENVIAR CONTRASEÑA  ----------
//-----------------------------------------

function emailSend() {
    // notificaciones
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

function insertarFireBase(nombre) {
    var myFirebaseRef = new Firebase(" https://infotec-61239.firebaseio.com/departamentos");
    var dep = JSON.parse('{"' + nombre + '":' + 0 + '}');
    myFirebaseRef.update(dep);
}

// funcion encargada de realizar el cambio de contraseña
function cambiarPass() {
    var contraNueva = document.getElementById("cn").value;
    var contraNueva1 = document.getElementById("cn1").value;

    if (contraNueva.length == 0 | contraNueva1.length == 0) // si algun campo esta vacio
        document.getElementById("notificacion").innerHTML = '<div class="alert alert-warning"><strong>Atenci&oacute;n!</strong> No pueden haber espacios vacios.</div>';
    else if (contraNueva != contraNueva1)
        document.getElementById("notificacion").innerHTML = '<div class="alert alert-danger"><strong>Error!</strong> La contrase&ntilde;a nueva no es igual a la confirmaci&oacute;n de contrase&ntilde;a ingresada.</div>';
    else {
        // haciendo el cambio de contraseña
        var url = "infoTec/cambiarContra/" + contraNueva + "/" + idUser;
        try{
            $.ajax({
                url: url,
                data: {},
                error: function (request, error) {
                    //error
                    document.getElementById("notificacion").innerHTML = '<div class="alert alert-danger"><strong>Error!</strong> La contrase&ntilde;a no pudo ser cambiada.</div>';
                }
            }).then(function (data) {
                //exito
                document.getElementById("notificacion").innerHTML = '<div class="alert alert-success"><strong>Listo!</strong> La contrase&ntilde;a se ha cambiado.</div>';
            });
        }
        catch (e) {
            document.getElementById("notificacion").innerHTML = '<div class="alert alert-danger"><strong>Error!</strong> La contrase&ntilde;a no pudo ser cambiada.</div>';
        }    
    }
}

    //funcion de login
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
                if (data[0].tipo === "Administrador") {
                    userName = data[0].nombre;//global guarda nombre de usuario
                    idUser = user;// guardo el id del usuario
                    EnviarMensajeDinamico();// carga la siguiente ventana                            
                } else {
                    loginDinamico("No tienes permisos administrador");
                }
            } catch (e) {
                loginDinamico("Usuario incorrecto");
            }
        });
    }

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

    function mostrar_ocultarCarrera() {
        if (document.getElementById("desplegarCarrera").value === "Departamentos") {
            var distancia = (listaCarreras.length * 63) + 63;
            document.getElementById("carreraDiv").style.height = '' + distancia + 'px';//para animacion
            document.getElementById("desplegarCarrera").value = "Ocultar";
        } else {
            document.getElementById("carreraDiv").style.height = "0px";
            document.getElementById("desplegarCarrera").value = "Departamentos";
        }
    }
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
            h = img.height
            console.log(img.height);
            console.log(h);

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

    // funcion encargada de validar la fecha seleccionada cuando se envia el mensaje comparandola con la fecha del sistema
    function validarFecha(strFecha) {
        // fecha actual obtenida desde el sistema
        var fechaSistema = new Date();

        var diaAct = fechaSistema.getDate();
        var mesAct = fechaSistema.getMonth() + 1; // sumo 1 porque inicia en 0 hasta 11
        var anioAct = fechaSistema.getFullYear();

        var mesSelec = strFecha[0] + strFecha[1];
        var diaSelec = strFecha[3] + strFecha[4];
        var anioSelec = strFecha[6] + strFecha[7] + strFecha[8] + strFecha[9];

        //document.write("Fecha elegida ",diaSelec,"/",mesSelec,"/",anioSelec);
        // validaciones por anio
        if (anioSelec < anioAct)
            return false;        
        else {
            // validaciones por mes
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
        return false; //  en caso de que no entre a nada quiere decir que la fecha seleccionada no es valida          
    }

    function enviar() {
        var titulo = document.getElementById("titulo").value;
        var Descripcion = document.getElementById("description").value;

        var fecha = document.getElementById("datepicker").value;

        var strFecha = fecha.toString();

        var Enviante = userName;//cambio

        var imagen = document.getElementById("imgPhoto").src;

        if (imagen == "http://localhost/infoTec")
            imagen = "";

        var borrable = document.getElementById("switch-offColor").checked;
        var departamento = "";
        var selected = 0;

        for (i = 0; i < listaIdCarreras.length; i++) {// verifica las carreras marcadas
            if (document.getElementById(listaIdCarreras[i]).checked == true) {
                departamento = departamento + document.getElementById(listaIdCarreras[i]).value + ",";
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
    function marcarTODOS() {//marca y desmarca los switches de los departamentos
        if (document.getElementById("ALL").value == "Marcar todos") {// si el valor esta en Marcar todos
            for (i = 0; i < listaIdCarreras.length; i++) {
                $("#" + listaIdCarreras[i]).bootstrapSwitch('state', true);
            }
            document.getElementById("ALL").value = "Desmarcar todos"
        }
        else {// si el valor esta en Desmarcar todos
            for (i = 0; i < listaIdCarreras.length; i++) {
                $("#" + listaIdCarreras[i]).bootstrapSwitch('state', false);
            }
            document.getElementById("ALL").value = "Marcar todos"
        }
    }

// funciones para agregar personas
//=================================================================inicio
    function cargarSedes() {
        var url = 'infoTec/getSedes';
        $.ajax({
            url: url,
            error: function (request, error) {
                console.log(error);
            }

        }).then(function (data) {
            var opciones = document.getElementById("sedes");
            for (i = 0; i < data.length; i++) {
                opciones.innerHTML += "<option>" + data[i].nombreSede + "</option>";
            }
        });

    }
    
    function cargarDepartamentosSede(ids) {
        var url = 'infoTec/getDEpartmentBySede/' + ids;
        $.ajax({
            url: url,
            error: function (request, error) {
                console.log(error);
            }
        }).then(function (data) {
            var opciones = document.getElementById('departamentos');
            for (i = 0; i < data.length; i++) {
                opciones.innerHTML += "<option>" + data[i].nombre + "</option>";
            }
        });
    }


//===================================================================fin

    function push(depertamento) {
        var text = "";
        for (i = 0; i < depertamento.length; i++) {
            if (depertamento[i] !== ",") {
                text += depertamento[i];//concadena los departamentos     
            }
            else {// entra cuando ya llego a una coma enviando la notificacion push
                aux(text);
                text = "";
            }
        }
    }

    function aux(text) {
        var myFirebaseRef = new Firebase(" https://infotec-61239.firebaseio.com/");
        myFirebaseRef.child("departamentos/" + text).once("value", function (data) {
            var valor = data.val() + 1;
            var pushing = JSON.parse('{"' + text + '":' + valor + '}');
            console.log(pushing);
            myFirebaseRef.child("departamentos").update(pushing);
        });
    }