function calculateAge(fecha_nac) {
    // Si la fecha es un string, lo convierte a Date
    if (typeof fecha_nac === 'string') {
        fecha_nac = new Date(fecha_nac);
    }

    //Coge la fecha que le has pasado y la separa en dia, mes y año
    const dia_nac = fecha_nac.getDate();
    const mes_nac = fecha_nac.getMonth() + 1;
    const anyo_nac = fecha_nac.getFullYear();

    //Coge la fecha actual y la separa en dia, mes y año
    const fechaActual = new Date();
    const dia_actual = fechaActual.getDate();
    const mes_actual = fechaActual.getMonth() + 1;
    const anyo_actual = fechaActual.getFullYear();
    
    //Calcula la edad
    let edad = anyo_actual - anyo_nac;
    if (mes_actual - mes_nac < 0)
        edad -= 1;
    else if (mes_actual - mes_nac === 0)
        if (dia_actual - dia_nac < 0)
            edad -= 1;

    return edad;
}