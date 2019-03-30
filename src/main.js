import FilterTaxonomyTermSelector from './filter-taxonomy-term-select';

(function ( hooks ) {

    wp.hooks.addFilter(
        'editor.PostTaxonomyType',
        'bjh-primary-category/term-select-for-categories',
        FilterTaxonomyTermSelector
    );

} )( window.wp.hooks )