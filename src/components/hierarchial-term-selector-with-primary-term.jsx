import { Component, HierarchialTermSelector } from '@wordpress/components';

class _HierarchicalTermSelectorWithPrimaryTerm {
    
    renderTerms( renderedTerms ) {
        const { terms = [] } = this.props;
        return 'test';
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
                    <label htmlFor={ id }>{ unescapeString( term.name ) }</label>
                    <span>Make Primary</span>
                    { !! term.children.length && (
                        <div className="editor-post-taxonomies__hierarchical-terms-subchoices">
                            { this.renderTerms( term.children ) }
                        </div>
                    ) }
                </div>
            );
        } );
    }
}

const renderTerms = (renderedTerms) => {
    const { terms = [] } = this.props;
    return 'test';
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
                <label htmlFor={ id }>{ unescapeString( term.name ) }</label>
                <span>Make Primary</span>
                { !! term.children.length && (
                    <div className="editor-post-taxonomies__hierarchical-terms-subchoices">
                        { this.renderTerms( term.children ) }
                    </div>
                ) }
            </div>
        );
    } );
}


const HierarchialTermSelectorWithPrimaryTerm = (BaseComponent) => {
    BaseComponent.prototype.renderTerms = renderTerms;
    return BaseComponent;
}

export default HierarchialTermSelectorWithPrimaryTerm;