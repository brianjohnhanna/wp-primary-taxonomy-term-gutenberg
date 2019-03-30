import { createElement } from '@wordpress/element';
import { TreeSelect, Button, SelectControl } from '@wordpress/components';
import { get } from 'lodash';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

const MIN_TERMS_COUNT_FOR_FILTER = 8;

(function ( hooks ) {

    function CustomizeTaxonomySelector( OriginalComponent ) {

        class HierarchicalTermSelectorWithPrimaryTerm extends OriginalComponent {
            constructor(props) {
                super(props);
                this.state.primaryTerm = 1;
            }
            render() {
                const { slug, taxonomy, instanceId, hasCreateAction, hasAssignAction } = this.props;
        
                if ( ! hasAssignAction ) {
                    return null;
                }
        
                const { availableTermsTree, availableTerms, filteredTermsTree, formName, formParent, loading, showForm, filterValue } = this.state;
                const labelWithFallback = ( labelProperty, fallbackIsCategory, fallbackIsNotCategory ) => get(
                    taxonomy,
                    [ 'labels', labelProperty ],
                    slug === 'category' ? fallbackIsCategory : fallbackIsNotCategory
                );
                const newTermButtonLabel = labelWithFallback(
                    'add_new_item',
                    __( 'Add new category' ),
                    __( 'Add new term' )
                );
                const newTermLabel = labelWithFallback(
                    'new_item_name',
                    __( 'Add new category' ),
                    __( 'Add new term' )
                );
                const parentSelectLabel = labelWithFallback(
                    'parent_item',
                    __( 'Parent Category' ),
                    __( 'Parent Term' )
                );
                const noParentOption = `— ${ parentSelectLabel } —`;
                const newTermSubmitLabel = newTermButtonLabel;
                const inputId = `editor-post-taxonomies__hierarchical-terms-input-${ instanceId }`;
                const filterInputId = `editor-post-taxonomies__hierarchical-terms-filter-${ instanceId }`;
                const filterLabel = get(
                    this.props.taxonomy,
                    [ 'labels', 'search_items' ],
                    __( 'Search Terms' )
                );
                const groupLabel = get(
                    this.props.taxonomy,
                    [ 'name' ],
                    __( 'Terms' )
                );
                const showFilter = availableTerms.length >= MIN_TERMS_COUNT_FOR_FILTER;

                const { terms: selectedTermIds = [] } = this.props;
                const primaryTermOptions = availableTermsTree
                    .filter(termObj => selectedTermIds.indexOf(termObj.id) !== -1)
                    .map(termObj => ({ label: termObj.name, value: termObj.id }));

                return [
                    showFilter && <label
                        key="filter-label"
                        htmlFor={ filterInputId }>
                        { filterLabel }
                    </label>,
                    showFilter && <input
                        type="search"
                        id={ filterInputId }
                        value={ filterValue }
                        onChange={ this.setFilterValue }
                        className="editor-post-taxonomies__hierarchical-terms-filter"
                        key="term-filter-input"
                    />,
                    <SelectControl
                        label="Primary Category"
                        noOptionLabel="Select a Term"
                        onChange={ this.makePrimary.bind(this) }
                        value={ this.state.primaryTerm }
                        options={ primaryTermOptions }
                    />,
                    <div
                        className="editor-post-taxonomies__hierarchical-terms-list"
                        key="term-list"
                        tabIndex="0"
                        role="group"
                        aria-label={ groupLabel }
                    >   
                        { this.renderTerms( '' !== filterValue ? filteredTermsTree : availableTermsTree ) }
                    </div>,
                    ! loading && hasCreateAction && (
                        <Button
                            key="term-add-button"
                            onClick={ this.onToggleForm }
                            className="editor-post-taxonomies__hierarchical-terms-add"
                            aria-expanded={ showForm }
                            isLink
                        >
                            { newTermButtonLabel }
                        </Button>
                    ),
                    showForm && (
                        <form onSubmit={ this.onAddTerm } key="hierarchical-terms-form">
                            <label
                                htmlFor={ inputId }
                                className="editor-post-taxonomies__hierarchical-terms-label"
                            >
                                { newTermLabel }
                            </label>
                            <input
                                type="text"
                                id={ inputId }
                                className="editor-post-taxonomies__hierarchical-terms-input"
                                value={ formName }
                                onChange={ this.onChangeFormName }
                                required
                            />
                            { !! availableTerms.length &&
                                <TreeSelect
                                    label={ parentSelectLabel }
                                    noOptionLabel={ noParentOption }
                                    onChange={ this.onChangeFormParent }
                                    selectedId={ formParent }
                                    tree={ availableTermsTree }
                                />
                            }
                            <Button
                                isDefault
                                type="submit"
                                className="editor-post-taxonomies__hierarchical-terms-submit"
                            >
                                { newTermSubmitLabel }
                            </Button>
                        </form>
                    ),
                ];
                /* eslint-enable jsx-a11y/no-onchange */
            }

            componentDidMount() {
                const postId = wp.data.select("core/editor").getCurrentPostId();
                apiFetch.use( apiFetch.createNonceMiddleware( window.bjhpc ) );
                apiFetch( {
                    path: `/wp-json/wp/v2/posts/${postId}`,
                    method: 'GET'
                } ).then(res => console.log(res));
            }
            
            makePrimary(termId) {
                const postId = wp.data.select("core/editor").getCurrentPostId();
                termId = parseInt( termId, 10 );
                const { taxonomy, slug } = this.props;
                const meta = {
                    [`_bjh_primary_${slug}`]: termId
                };
                apiFetch.use( apiFetch.createNonceMiddleware( window.bjhpc ) );
                const request = apiFetch( {
                    path: `/wp-json/wp/v2/posts/${postId}`,
                    method: 'POST',
                    data: {
                        title: 'Test Post 2',
                        meta
                    },
                } );
                request.then(() => {
                    this.setState( { primaryTerm: termId } );
                }).catch((err) => {
                    console.warn(err);
                })
            }
            
        }

        return function( props ) { 

            if ( props.slug === 'category' ) { 
                return createElement( 
                    HierarchicalTermSelectorWithPrimaryTerm,
                    props 
                );

            } else {
                return createElement(
                    OriginalComponent,
                    props
                );
            }
        }
    };

    wp.hooks.addFilter(
        'editor.PostTaxonomyType',
        'bjh-primary-category/replace-term-select-for-categories',
        CustomizeTaxonomySelector
    );

} )( window.wp.hooks )