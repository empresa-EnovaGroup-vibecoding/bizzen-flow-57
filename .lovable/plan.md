
# Plan: Historial Clinico Digital con Ficha de Evaluacion Facial

## Resumen

Implementare un sistema completo de historial clinico digital para el modulo de clientes, incluyendo una nueva tabla en la base de datos para almacenar las evaluaciones faciales y la conexion con el inventario para recomendaciones de productos.

---

## Cambios en Base de Datos

### Nueva Tabla: `facial_evaluations`

Almacenara todas las fichas de evaluacion facial vinculadas a cada cliente.

```text
facial_evaluations
├── id (uuid, PK)
├── client_id (uuid, FK -> clients)
├── created_at (timestamp)
├── updated_at (timestamp)
│
├── -- DATOS MEDICOS --
├── has_skin_disease (boolean)
├── skin_disease_details (text, nullable)
├── has_allergies (boolean)
├── allergy_details (text, nullable)
├── takes_medication (boolean)
├── medication_details (text, nullable)
├── recent_treatments (boolean)
├── treatment_details (text, nullable)
├── uses_sunscreen (boolean)
├── smokes_alcohol (boolean)
├── pregnancy_lactation (boolean)
│
├── -- RUTINA ACTUAL --
├── cleaning_frequency (enum: once, twice, occasional)
├── cleanser_brand (text, nullable)
├── serum_brand (text, nullable)
├── cream_brand (text, nullable)
├── sunscreen_brand (text, nullable)
├── uses_makeup (boolean)
├── removes_makeup_properly (boolean)
├── uses_exfoliants (boolean)
│
├── -- EVALUACION PROFESIONAL --
├── skin_type (enum: normal, dry, combination, oily, sensitive, acneic)
├── skin_analysis (text)
└── treatment_performed (text)
```

### Nueva Tabla: `evaluation_product_recommendations`

Tabla de relacion para vincular productos recomendados a cada evaluacion.

```text
evaluation_product_recommendations
├── id (uuid, PK)
├── evaluation_id (uuid, FK -> facial_evaluations)
├── product_id (uuid, FK -> inventory)
├── notes (text, nullable)
└── created_at (timestamp)
```

### Politicas RLS

Ambas tablas tendran las mismas politicas de seguridad que las demas tablas (Staff can view/create/update/delete con `auth.uid() IS NOT NULL`).

---

## Nuevos Componentes de UI

### 1. Actualizacion de ClientDetail.tsx

Reorganizare el componente actual para tener dos pestanas principales:

```text
┌─────────────────────────────────────────────────────────┐
│  [Datos Generales]  [Historial Clinico]                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Pestana "Datos Generales":                             │
│  - Informacion de contacto (actual)                     │
│  - Citas (actual)                                       │
│  - Compras/Ventas (actual)                              │
│                                                         │
│  Pestana "Historial Clinico":                           │
│  - Lista cronologica de evaluaciones                    │
│  - Boton "Nueva Evaluacion" prominente                  │
│  - Cada evaluacion muestra fecha y resumen              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 2. Componente: FacialEvaluationForm.tsx

Formulario completo con los siguientes bloques:

**Bloque A: Datos Medicos y Antecedentes**
- Checkboxes condicionales con campos de texto que aparecen al activar
- Selectores Si/No para protector solar, tabaco/alcohol, embarazo

**Bloque B: Rutina Actual**
- Radio buttons para frecuencia de limpieza
- Campos de texto para marcas de productos
- Toggles para maquillaje, desmaquillaje, exfoliantes

**Bloque C: Evaluacion Profesional**
- Radio buttons para tipo de piel (6 opciones)
- Textarea grande para analisis de piel
- Textarea grande para tratamiento realizado

**Bloque D: Productos Recomendados**
- Buscador conectado al inventario
- Lista de productos seleccionados con posibilidad de agregar notas
- Chips removibles para cada producto seleccionado

### 3. Componente: EvaluationHistoryList.tsx

Lista cronologica de evaluaciones con:
- Fecha de la evaluacion
- Tipo de piel detectado
- Resumen del tratamiento (truncado)
- Al hacer clic, abre vista de detalle

### 4. Componente: EvaluationDetail.tsx

Vista de solo lectura para consultar evaluaciones pasadas con toda la informacion.

---

## Estructura de Archivos

```text
src/components/clients/
├── ClientDetail.tsx (modificado)
├── FacialEvaluationForm.tsx (nuevo)
├── EvaluationHistoryList.tsx (nuevo)
├── EvaluationDetail.tsx (nuevo)
└── ProductRecommendationSelector.tsx (nuevo)
```

---

## Detalles Tecnicos

### Migracion SQL

1. Crear enum `cleaning_frequency_type` con valores: `once`, `twice`, `occasional`
2. Crear enum `skin_type` con valores: `normal`, `dry`, `combination`, `oily`, `sensitive`, `acneic`
3. Crear tabla `facial_evaluations` con todas las columnas
4. Crear tabla `evaluation_product_recommendations`
5. Establecer foreign keys a `clients` e `inventory`
6. Habilitar RLS y crear politicas de seguridad

### React Query Keys

- `["clientEvaluations", clientId]` - Lista de evaluaciones del cliente
- `["evaluationDetail", evaluationId]` - Detalle de una evaluacion
- `["evaluationProducts", evaluationId]` - Productos recomendados

### Validaciones del Formulario

- Campos condicionales (si marca enfermedad dermatologica, el campo de texto se vuelve requerido)
- Tipo de piel es obligatorio
- Al menos un campo de evaluacion profesional debe estar lleno

---

## Flujo de Usuario

1. Usuario entra a ficha de cliente
2. Ve dos pestanas: "Datos Generales" y "Historial Clinico"
3. En "Historial Clinico" ve lista de evaluaciones previas y boton "Nueva Evaluacion"
4. Al hacer clic en "Nueva Evaluacion", se abre formulario completo
5. Completa datos medicos, rutina, evaluacion profesional
6. En seccion de productos, busca y selecciona productos del inventario
7. Al guardar, la evaluacion queda vinculada al cliente con fecha actual
8. La nueva evaluacion aparece en la lista cronologica

---

## Beneficios para el Negocio

- **Historial completo**: Cada visita queda documentada profesionalmente
- **Venta cruzada**: Las recomendaciones de productos quedan registradas para seguimiento
- **Continuidad**: En proximas visitas, se puede consultar que se recomendo antes
- **Profesionalismo**: Ficha tecnica digital mejora la imagen del negocio
