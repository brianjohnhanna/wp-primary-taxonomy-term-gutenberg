import '@babel/polyfill';
import { createElement } from '@wordpress/element';
const registerPlugin = wp.plugins.registerPlugin;
const PluginSidebar = wp.editPost.PluginSidebar;
import PrimaryTermSelect from './components/PrimaryTermSelect';

const SIDEBAR_NAME = 'bjh-primary-term-sidebar';

(function ({ taxonomies }) {
    registerPlugin( SIDEBAR_NAME, {
        render: function() {
            return createElement( PluginSidebar,
                {
                    name: SIDEBAR_NAME,
                    icon: 'admin-post',
                    title: 'Primary Terms',
                },
                taxonomies.map((taxonomy, index) => (
                    <PrimaryTermSelect
                        key={ index }
                        taxonomy={ taxonomy } />
                ))
            );
        },
    } );
} )( window._bjhpc )
