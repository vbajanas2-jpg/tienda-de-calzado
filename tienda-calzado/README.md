# Tienda web de calzado femenino · Prototipo

Prototipo funcional del proyecto de titulación "Tienda web de calzado femenino con realidad aumentada".
Autora: Valeria Dayanna Bajaña Sosa. Nombre de la marca: por definir.

## Qué incluye

- **Usuaria:** catálogo con filtros, ficha del modelo con talla, color, suela y accesorio, vista 3D y prueba referencial con foto (realidad aumentada), carrito, programación de la entrega con mínimo 4 días hábiles (bloquea fines de semana y feriados), pago simulado con tarjeta o transferencia, registro, inicio de sesión y seguimiento del pedido.
- **Proveedor:** lista de pedidos con aviso de pedido nuevo, ficha de taller imprimible y cambio de estado (En fabricación, Control de calidad).
- **Administración:** verificación de transferencias, todos los pedidos, cambio a Enviado y Entregado, gestión del catálogo, accesorios, feriados y costo de envío.

## Cuentas de prueba

| Perfil | Correo | Contraseña |
|---|---|---|
| Usuaria | maria@ejemplo.com | 123456 |
| Proveedor | taller@ejemplo.com | taller |
| Administración | admin@ejemplo.com | admin |

## Archivos

- `index.html`: estructura de la página.
- `styles.css`: diseño visual.
- `app.js`: datos de ejemplo, lógica de días hábiles, pedidos y pantallas.

No necesita instalar nada: es HTML, CSS y JavaScript puro.

## Cómo publicarlo con GitHub Pages

1. Entra a github.com y crea un repositorio nuevo (por ejemplo `tienda-calzado`), público.
2. Pulsa **Add file → Upload files**, arrastra `index.html`, `styles.css`, `app.js` y `README.md`, y pulsa **Commit changes**.
3. Ve a **Settings → Pages**. En *Branch* elige `main` y la carpeta `/ (root)`, y pulsa **Save**.
4. En uno o dos minutos la página queda en `https://TU-USUARIO.github.io/tienda-calzado/`.

Para probarlo en tu computadora sin internet de por medio, basta con abrir `index.html` en el navegador.

## Notas del prototipo

- Los datos se guardan en el navegador (localStorage). Para ver los perfiles conectados, abre la página en dos pestañas: una como Usuaria y otra como Proveedor o Administración.
- Para volver a los datos iniciales: Administración → Envío y feriados → Restablecer datos de ejemplo.
- El pago es simulado y no guarda datos de tarjeta. En la versión final se conectaría una pasarela como PayPhone, Datafast o Kushki.
- La realidad aumentada es referencial con una foto. En la versión final se usaría una herramienta de RA web con detección de pies y modelos 3D.
- Modelos, precios, envío y feriados son datos de ejemplo.
