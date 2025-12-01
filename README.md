# Control de LED desde el Navegador 🖥️💡

Control de encendido y apagado de un LED conectado a un Arduino **directamente desde el navegador** usando la **Web Serial API**.  
La interfaz es una pequeña consola web donde puedes:

- Conectar / desconectar el puerto serie.
- Enviar comandos `ON`, `OFF` y `Toggle`.
- Ver en tiempo real los mensajes que envía el Arduino.

> ⚠️ Este proyecto funciona solo en navegadores basados en Chromium (Chrome, Edge, Brave, Opera…) y **bajo HTTPS o `localhost`**.

---

![alt text](image.png)

## 📸 Capturas de pantalla

> *(Cambia los nombres de archivo por los que uses tú. Por ejemplo puedes crear una carpeta `docs/` o `img/`)*

- Vista principal de la aplicación  
  ![UI principal](web01.png)

- Selección del puerto serie del Arduino  
  ![Selección de puerto](web02.png)

- Conexión establecida y mensaje READY  
  ![Conexión establecida](web03.png)

- LED encendido desde el botón ON  
  ![LED encendido](arduino01.png)

---

## 🧩 Estructura del proyecto

```text
control-arduino-web/
├── index.html      # Interfaz web
├── styles.css      # Estilos (tema oscuro)
└── app.js          # Lógica de comunicación serie y manejo de la UI
