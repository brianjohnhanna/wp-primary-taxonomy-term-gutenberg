import { SelectControl } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

const { withSelect } = wp.data;

// @see https://github.com/WordPress/gutenberg/tree/master/packages/data#withSelect

const Select = ( { primaryTermId = null, selectedTerms = [], taxonomy } ) => {
    // const options = selectedTerms
    //     .map(termObj => ({ label: termObj.name, value: termObj.id }));
    const options = [];

	return (
        <SelectControl
            label="Primary Category"
            noOptionLabel="Select a Term"
            onChange={ val => console.log(this) }
            value={ primaryTermId }
            options={ options }
        />
    );
};

const PrimaryCategorySelect = withSelect( async ( select, ownProps ) => {

    const { getCurrentPostAttribute } = select('core/editor');
    const { taxonomy = 'category' } = ownProps;

    const { _bjh_primary_category = null } = getCurrentPostAttribute('meta');
    const selectedTermIds = getCurrentPostAttribute('categories');

    const selectedTerms = await apiFetch( {
        path: addQueryArgs( `/wp-json/wp/v2/categories`, {
            per_page: -1,
            orderby: 'name',
            order: 'asc',
            _fields: 'id,name,parent'
        } ),
    } );

    return {
        primaryCategory: _bjh_primary_category,
        selectedTerms,
        taxonomy
    };
} )( Select );

export default PrimaryCategorySelect;