import FilterTaxonomyTermSelector from './filter-taxonomy-term-select'; 
import PrimaryTermSelect from './components/PrimaryTermSelect';
import { Fragment } from '@wordpress/element';

(function ( hooks, { taxonomies } ) {

    wp.hooks.addFilter(
        'editor.PostTaxonomyType',
        'bjh/primary-term-select',
        (HierarchicalTermSelector) => {
            return (props) => {
                let terms;
                console.log(props);
                if (taxonomies.indexOf(props.slug) === -1) {
                    return (
                        <HierarchicalTermSelector { ...props } />
                    )
                }
                return ( 
                    <Fragment>
                        Put that fucking component here
                        <HierarchicalTermSelector onUpdateTerms={obj => terms = obj.terms} {...props} />
                        <PrimaryTermSelect taxonomy={props.slug} terms={terms} />
                    </Fragment>
                )
            }
        }
    );

} )( window.wp.hooks, window._bjhpc )
