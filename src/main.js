// import HierarchicalTermSelectorWithPrimaryTerm from './components/hierarchial-term-selector-with-primary-term';
import { createElement } from '@wordpress/element';
import { unescape as unescapeString } from 'lodash';
import { __ } from '@wordpress/i18n';

(function ( hooks ) {

    function CustomizeTaxonomySelector( OriginalComponent ) {

        class HierarchicalTermSelectorWithPrimaryTerm extends OriginalComponent {
            constructor(props) {
                super(props);
                this.state.primaryTerm = 1;
            }
            renderTerms( renderedTerms ) {
                const { terms = [] } = this.props;
                console.log(terms);
                const makePrimaryLabel = __('Make Primary', 'bjh-primary-category');
                const isPrimaryLabel = __('Primary', 'bjh-primary-category');
                return renderedTerms.map( ( term ) => {
                    const id = `editor-post-taxonomies-hierarchical-term-${ term.id }`;
                    return (
                        <div key={ term.id } className="editor-post-taxonomies__hierarchical-terms-choice">
                            <input
                                id={ id }
                                className="editor-post-taxonomies__hierarchical-terms-input"
                                type="checkbox"
                                checked={ terms.indexOf( term.id ) !== -1 }
                                value={ term.id }
                                onChange={ this.onChange }
                            />
                            <label htmlFor={ id }>
                                { unescapeString( term.name ) }
                                
                            </label>
                            { terms.indexOf( term.id ) !== -1 && this.state.primaryTerm === term.id && (
                                     <span>{ isPrimaryLabel }</span>
                                ) }
                                { terms.indexOf( term.id ) !== -1 && this.state.primaryTerm !== term.id && (
                                     <a onClick={ this.makePrimary(term.id) }>{ makePrimaryLabel }</a>
                                ) }
                            
                            
                            { !! term.children.length && (
                                <div className="editor-post-taxonomies__hierarchical-terms-subchoices">
                                    { this.renderTerms( term.children ) }
                                </div>
                            ) }
                        </div>
                    );
                } );
            }

            makePrimary(termId) {
                termId = parseInt( termId, 10 );
                // this.setState( { primaryTerm: termId } );
                console.log(termId);
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