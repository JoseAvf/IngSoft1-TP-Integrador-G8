# 🏋️‍♂️ CuerpoSano - Sistema de Gestión para Gimnasios
## 📦 Incremento 1 — Gestión de Miembros y Membresías
### 🎯 Objetivo

Construir la base del sistema, implementando el registro y control de **miembros**, **tipos de membresías** y **carnets con código único**.  
Este incremento representa el **núcleo funcional del sistema**, sirviendo de cimiento para los futuros módulos (clases, entrenadores, cobranzas, reportes, etc.).

---

### ⚙️ Componentes desarrollados

#### 🧱 Capa de Dominio (`CuerpoSano.Domain`)
Contiene las **entidades principales** y sus relaciones:

- `Miembro` → Datos personales, vínculo 1:1 con Membresía y Carnet.  
- `Membresia` → Tipo, costo, fechas de fechas de emisión, vencimiento y posible pausa.  
- `Carnet` → Generado automáticamente con un código de barras/GUID único.  
- `Persona` → Clase abstracta base de `Miembro` y `Entrenador`.

**Relaciones principales:**
- `Miembro` 1 ↔ 1 `Membresia`  
- `Miembro` 1 ↔ 1 `Carnet`

---

#### 🧩 Capa de Aplicación (`CuerpoSano.Application`)
Implementa la **lógica de negocio y casos de uso** principales.

- **Interfaces:**
  - `IMiembroService`, `IMembresiaService`
  - `IMiembroRepository`, `IMembresiaRepository`

- **Servicios:**
  - `MiembroService`: 
    - Alta de miembros con validación de DNI único.
    - Generación automática de carnet.
    - Vinculación y actualización de membresías.
  - `MembresiaService`: 
    - Gestión de membresías.
    - Cálculo de costos con descuentos por edad y estudiante.
    - Gestión de pausas.
    - Sincronización de `MembresiaId` en el miembro.

---

### 🏗️ Capa de Infraestructura (CuerpoSano.Infrastructure)
Encargada de la persistencia de datos con Entity Framework Core (Code First).

- CuerpoSanoDbContext — define DbSet para cada entidad y relaciones: 
  - Al eliminar un Miembro, se borran automáticamente su Carnet y Membresia.
  - Al eliminar una Membresia, el miembro queda intacto, y en memoria se puede setear Membresia y MembresiaId a null.
- Repositories/ — implementaciones concretas (MiembroRepository, MembresiaRepository).

---

### 🌐 Capa Web API (CuerpoSano.WebApi)
Proporciona los endpoints REST para la gestión de miembros y membresías.

Controladores:
- MiembrosController
- MembresiasController

Endpoints principales:

| Método | Ruta | Descripción |
|--------------|--------------|--------------|
| GET | /api/miembros | Listar todos los miembros |
| POST | /api/miembros | Crear un nuevo miembro(con carnet generado automáticamente |
| PUT |  /api/miembros/{id} | Modificar datos del miembro |
| DELETE | /api/miembros/{id} | Eliminar miembro (borra carnet y membresía asociada) |
| GET | /api/membresias | Listar membresías |
| POST | /api/membresias | Crear membresía nueva para un miembro |
| DELETE | /api/membresias/{id} | Eliminar membresía (setea MembresiaId y Membresia en el miembro a null) |

> 💡 Nota: Se usan DTOs separados para Request y Response para evitar ciclos de serialización y exponer solo datos necesarios.

---

### 🧮 Cálculo de costos y descuentos
El sistema aplica descuentos automáticos según condiciones del socio:

- 🧓 Mayores de 65 años → 20%
- 🎓 Estudiantes → 10%
- 💰 Combinables entre sí.

El cálculo se aplica al crear  o renovar la membresía.

--- 

### 🧾 Resultado del incremento
Al finalizar el Incremento 1, el sistema permite:

✅ Registrar miembros con validación de DNI único.
✅ Asociar una membresía a cada miembro.
✅ Generar un carnet con código único automáticamente.
✅ Calcular costos ajustados por descuentos.
✅ Permitir pausar membresías hasta 30 días.
✅ Persistir toda la información en SQL Server mediante EF Core.
✅ Borrar miembros y membresías con reglas de cascada correctas.

---

### 🧰 Cómo configurar y ejecutar el Incremento 1
Sigue estos pasos para preparar tu entorno y ejecutar el sistema:

1️⃣ Clonar el repositorio
```
git clone https://github.com/JoseAvf/IngSoft1-TP-Integrador-G8.git
```

2️⃣ Configurar la base de datos
Editá appsettings.json en CuerpoSano.WebApi:

```
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=CuerpoSanoDb;Trusted_Connection=True;"
}
```

3️⃣ Ejecutar la API
```
cd ../CuerpoSano.WebApi
dotnet run
```
✅ Al iniciar, la aplicación aplicará automáticamente todas las migraciones pendientes y creará la base de datos si no existe,  con las tablas: 
- Miembros
- Membresias
- Carnets
- Personas

4️⃣ Probar los endpoints
La API se ejecutará en:

🔗 http://localhost:5000  o  https://localhost:7000

Se puede probar los endpoints en Swagger:

📄 http://localhost:7000/swagger

5️⃣ Estructura del backend
```
backend/
├── CuerpoSano.Domain/
│   └── Entities/
├── CuerpoSano.Application/
│   ├── DTOs/
│   ├── Interfaces/
│   └── Services/
├── CuerpoSano.Infrastructure/
│   ├── Persistence/
│   └── Repositories/
└── CuerpoSano.WebApi/
    ├── Controllers/
    └── Program.cs
```
🧩 Próximos pasos (Iteración 2)

En el siguiente incremento se agregará:
- Gestión de clases y entrenadores.
- Asignación de miembros a clases (con cupos).
- Control de asistencia y penalizaciones por inasistencias.

👨‍💻 Autores
- Grupo 8
- Proyecto Académico para Ingeniería de Software — Trabajo Práctico Integrador

