# IdiotMD

Un bot de WhatsApp inspirado en el legendario "You Are An Idiot" virus, un tributo a los días en que la ingenuidad digital era más común y las lecciones de seguridad se aprendían de la manera más directa posible.

## Filosofía del Proyecto

Este proyecto nace como una reflexión sobre la evolución de la tecnología y la seguridad informática. "You Are An Idiot" no era solo un virus molesto; era un recordatorio brutal de nuestra vulnerabilidad digital y la importancia de la precaución en línea.

En una era donde la información fluye libremente y los riesgos digitales son más sofisticados, IdiotMD sirve como una nostálgica remembranza de tiempos más simples, cuando los "virus" eran más una travesura que una amenaza existencial.

## Información Importante

Este proyecto es completamente independiente y no mantiene ninguna afiliación con WhatsApp Inc. WhatsApp es una marca registrada de WhatsApp LLC. IdiotMD es un desarrollo autónomo creado con fines educativos y de entretenimiento.

## Características del Sistema

### Funcionalidades Principales

**Comunicación Avanzada**
- Procesamiento de mensajes de voz y texto
- Sistema de respuestas automatizadas
- Integración con servicios de búsqueda

**Gestión de Grupos**
- Configuración personalizada por grupo
- Sistema de moderación automatizada
- Prevención de spam y enlaces maliciosos
- Mensajes de bienvenida personalizables

**Entretenimiento Digital**
- Colección de juegos interactivos
- Sistema de rol y experiencia
- Generación de stickers multimedia
- Descarga de contenido multimedia de YouTube

**Funciones Técnicas**
- Sistema SubBot para múltiples instancias
- Personalización de interfaz visual
- Integración con motores de búsqueda
- Arquitectura modular extensible

## Instalación en Entorno Android

### Preparación del Sistema

Descarga e instala Termux desde fuentes oficiales. La aplicación requiere permisos de almacenamiento para funcionar correctamente.

### Configuración del Entorno

Ejecuta los siguientes comandos en secuencia:

```bash
termux-setup-storage
```

```bash
apt update && apt upgrade -y
```

```bash
pkg install -y git nodejs python ffmpeg imagemagick yarn
```

### Descarga e Instalación del Proyecto

```bash
git clone https://github.com/SoySapo6/IdiotMD.git
```

```bash
cd IdiotMD
```

```bash
npm install
```

### Inicialización del Sistema

```bash
npm start
```

Si el sistema solicita confirmación durante la instalación, responde afirmativamente para continuar.

## Gestión del Sistema

### Reinicio Después de Interrupción

En caso de que el bot se detenga por cualquier motivo:

```bash
cd IdiotMD && npm start
```

### Configuración de Administrador

Para obtener privilegios administrativos:

```bash
nano settings.js
```

Modifica la sección correspondiente a números autorizados según tus necesidades.

---

## Recursos de Soporte

**Canales Oficiales de Comunicación**
- Canal Principal: https://whatsapp.com/channel/0029VayXJte65yD6LQGiRB0R
- Grupo de Soporte: https://chat.whatsapp.com/KI2MyKoGWFV7ylP49ioLQ0
- Comunidad de Usuarios: https://chat.whatsapp.com/KqkJwla1aq1LgaPiuFFtEY

**Contacto Directo**
- WhatsApp Personal: https://wa.me/51921826291
- Correo Electrónico: soymaycol.cn@gmail.com

## Desarrollo y Mantenimiento

**Creador Principal**
SoyMaycol (GitHub: @SoySapo6)

**Creador Original (Yuki Suou)**
Destroy (GitHub: @The-King-Destroy)

---

*"En la simplicidad de un mensaje molesto, encontramos la complejidad de nuestras vulnerabilidades digitales bro."*

## Licencia (MIT)

Este proyecto se distribuye bajo términos de uso educativo. El código fuente está disponible para estudio y mejora, manteniendo siempre el respeto por los derechos de autor y las mejores prácticas de desarrollo.
