import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { FocusTimerProvider } from './Contexts/FocusTimerContext';
import { ThemeProvider } from './Contexts/ThemeContext';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ThemeProvider initialTheme={props.initialPage.props.auth?.user?.theme || 'system'}>
                <FocusTimerProvider>
                    <App {...props} />
                </FocusTimerProvider>
            </ThemeProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
