import { SelectControl } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { Placeholder, Spinner } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

const { withSelect } = wp.data;

const mapSelectToProps = (select, props) => {
    const { taxonomy = 'category' } = props;
    const { getEntityRecords } = select( 'core' );
    const { isResolving } = select( 'core/data' );
    const selectedTermIds = select('core/editor').getCurrentPostAttribute('categories');
    const query = { 
        per_page: -1, 
        hide_empty: false,
        include: selectedTermIds
    };

    const primaryTermId = select('core/editor').getCurrentPostAttribute('meta')[`_bjh_primary_${taxonomy}`] || null;

    return {
        primaryTermId,
        taxonomy,
        terms: getEntityRecords( 'taxonomy', taxonomy, query ),
        isRequesting: isResolving( 'core', 'getEntityRecords', [ 'taxonomy', taxonomy, query ] ),
    };
}


const Select = ( { isRequesting, terms, primaryTermId = null, taxonomy } ) => {

    if ( isRequesting ) {
        return (
            <Fragment>
                <Placeholder>
                    <Spinner />
                </Placeholder>
            </Fragment>
        );
    }
    
    const options = terms.map(termObj => ({ label: termObj.name, value: termObj.id }));

    return (
        <SelectControl
            label={ `Primary ${taxonomy}` }
            noOptionLabel="Select a Term"
            onChange={ val => console.log(val) }
            value={ primaryTermId }
            options={ options }
        />
    );
};

const PrimaryCategorySelect = withSelect( mapSelectToProps )( Select );

export default PrimaryCategorySelect;