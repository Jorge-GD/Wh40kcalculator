# Warhammer 40K Calculator (Wh40kcalculator)

A comprehensive mathhammer calculator for Warhammer 40,000 designed to help players calculate combat probabilities and optimize their tactical decisions.

## Features

- **Attacker Profile Configuration**: Configure weapon stats including attacks, skill, strength, AP, and damage
- **Combat Phase Modifiers**: Support for hit modifiers, wound modifiers, and special abilities
- **Advanced Protocols**: Implementation of game rules like Sustained Hits, Lethal Hits, Critical Hit modifiers, and more
- **Real-time Calculations**: Instant probability calculations as you modify parameters
- **Multiple Profiles**: Support for multiple attacker and defender profiles
- **Modern UI**: Clean, responsive Angular Material interface
- **macOS-inspired Typography**: Uses the San Francisco font with a `-apple-system` fallback for a consistent look across browsers

## Development

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.13.

### Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

### Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

### Linting and formatting

Code quality is enforced with ESLint and Prettier. Check for lint issues with:

```bash
npm run lint
```

Automatically fix problems and format all files using:

```bash
npm run lint:fix
npm run format
```

## Project Structure

- `src/app/components/` - Angular components for UI
- `src/app/models/` - TypeScript models for data structures
- `src/app/services/` - Services for business logic and calculations
- `src/app/styles/` - Shared styles and utilities

## Publicar en GitHub Pages

Sigue estos pasos para desplegar la aplicación usando GitHub Pages:

1. Ejecuta el comando de compilación con la ruta base adecuada:

   ```bash
   ng build --base-href /Wh40kcalculator/
   ```

   Esto generará los archivos estáticos en la carpeta `dist/wh40kcalculator`.
2. Entra a la sección **Settings** del repositorio en GitHub y abre la pestaña **Pages**.
3. Selecciona la rama principal (por ejemplo `main`) y la carpeta `/dist/wh40kcalculator` como origen del sitio.
4. Guarda la configuración para activar la publicación.

Una vez completado el proceso, la aplicación estará disponible en:

```
https://<tu-usuario>.github.io/Wh40kcalculator/
```

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
