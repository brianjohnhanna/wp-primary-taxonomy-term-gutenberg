import addPrimaryTermSelect from './components/PrimaryTermSelect';

(function ( hooks, { taxonomies } ) {

    wp.hooks.addFilter(
        'editor.PostTaxonomyType',
        'bjh/primary-term-select',
        (HierarchicalTermSelector) => {
            return (props) => {
                if (taxonomies.indexOf(props.slug) === -1) {
                    return <HierarchicalTermSelector {...props} />;
                }
                return addPrimaryTermSelect(HierarchicalTermSelector, props);
            }
        }
    );

} )( window.wp.hooks, window._bjhpts )
