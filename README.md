# Acorn

## Política de merges / Merge Policy

### ¿Se pueden hacer merges automáticos?

Sí, el proyecto soporta **merges automáticos** mediante el label `auto-merge`.

#### Cómo funciona

1. **CI obligatorio**: Todo pull request debe pasar los checks de CI (lint y build) definidos en `.github/workflows/ci.yml` antes de poder ser mergeado.
2. **Revisión requerida**: Por defecto, se requiere la aprobación de al menos un code owner (definido en `.github/CODEOWNERS`) antes de que el merge pueda completarse.
3. **Auto-merge**: Si un PR tiene el label `auto-merge`, el workflow `.github/workflows/auto-merge.yml` habilitará el auto-merge automáticamente. Cuando todos los checks pasen y se cumplan los requisitos de aprobación, GitHub mergeará el PR de forma automática usando squash.

#### Flujo recomendado

```
1. Abrir un PR hacia `main`
2. El CI corre automáticamente (lint + build)
3. Solicitar revisión (o esperar que CODEOWNERS sea notificado)
4. Agregar el label `auto-merge` si se desea que el PR se mergee solo al cumplir los requisitos
5. Una vez aprobado y con todos los checks verdes → merge automático
```

> **Sin el label `auto-merge`**: el PR requiere que alguien lo mergee manualmente después de la aprobación.

---

### Does the project support automatic merges?

Yes. Add the `auto-merge` label to a pull request and GitHub will merge it automatically (squash) once all required CI checks pass and the required review approvals are satisfied.
