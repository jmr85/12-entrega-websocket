const fs = require('fs');

class ContenedorMensaje {
    constructor(fileName) {
        this.fileName = fileName;
    }
    async save(email, fecha, mensaje) {
        let obj = { email, fecha, mensaje };
        try {
            let dataArch = await fs.promises.readFile(this.fileName, 'utf8')
            let dataArchParse = JSON.parse(dataArch)
            if (dataArchParse.length) {
                await fs.promises.writeFile(this.fileName, JSON.stringify([...dataArchParse, { ...obj, id: dataArchParse[dataArchParse.length - 1].id + 1 }], null, 2))
            } else {
                await fs.promises.writeFile(this.fileName, JSON.stringify([{ ...obj, id: 1 }], null, 2))
            }
            console.log(`El archivo tiene el id: ${dataArchParse[dataArchParse.length - 1].id + 1}`)
        } catch (error) {
            console.log("error -> ", error)
        }
    }
    async getAll() {
        let contenido = []
        try {
            contenido = await fs.promises.readFile(this.fileName, 'utf8')
            contenido = JSON.parse(contenido)
        } catch (error) {
            console.log("Error: ", contenido, error);
            throw error
        }
        return contenido;
    }

    async getById(id) {
        let contenido = []
        try {
            contenido = await fs.promises.readFile(this.fileName, 'utf8')
            const contendoID = JSON.parse(contenido);
            const found = contendoID.find(element => element.id === id);
            contenido = found ? found : null;
        } catch (error) {
            console.log(error);
            throw error
        }
        return contenido;
    }

    async updateById(id, email, fecha, mensaje){
        try {
            let dataArch = await fs.promises.readFile(this.fileName, 'utf8')
            let dataArchParse = JSON.parse(dataArch)
            let mensajes = dataArchParse.find(msj => msj.id === id)// solo para validar
            if (mensajes !== undefined || mensajes !== null) {
               
                const dataArchParseFiltrado = dataArchParse.map(element => {
                    if (element.id === id) {
                        element.email = email;
                        element.fecha = fecha;
                        element.mensaje = mensaje;
                        return element;                    
                    }else{
                        return element;
                    }
                })
                await fs.promises.writeFile(this.fileName, JSON.stringify(dataArchParseFiltrado, null, 2), 'utf-8')
                
                console.log('ContenedorMensaje log: ', 'mensaje actualizado')
            } else {
                console.log('ContenedorMensaje log: ', 'no existe el mensaje')
            }
        } catch (error) {
            throw error;
        }
    }

    async deleteById(id) {
        try {
            let dataArch = await fs.promises.readFile(this.fileName, 'utf8')
            let dataArchParse = JSON.parse(dataArch)
            let mensaje = dataArchParse.find(prod => prod.id === id)
            if (mensaje !== undefined || mensaje !== null) {
                const dataArchParseFiltrado = dataArchParse.filter(prod => prod.id !== id)
                await fs.promises.writeFile(this.fileName, JSON.stringify(dataArchParseFiltrado, null, 2), 'utf-8')
                console.log('Mensaje eliminado')
            } else {
                console.log('no existe el mensaje')
            }
        } catch (error) {
            throw error;
        }
    }

    async deleteAll() {
        try {
            await promises.unlink(this.fileName, 'utf8')
            console.log('Todos los mensajes eliminados')
        } catch (error) {
            throw error;
        }
    }

}

module.exports = ContenedorMensaje;